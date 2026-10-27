import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';
import {
  DEFAULT_PROFILE, DEFAULT_PROGRESS, DEFAULT_ACTIVITY,
  BACKEND_ROADMAP, OTHER_ROADMAPS,
} from '../data/mockData';

const AppContext = createContext(null);

function computeProgress(completedStages, goalId) {
  const roadmap = goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || []);
  const total = roadmap.length;
  if (total === 0) return 0;
  return Math.round((completedStages.length / total) * 100);
}

function computeCurrentStage(completedStages, goalId) {
  const roadmap = goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || []);
  const stage = roadmap.find(s => !completedStages.includes(s.id));
  return stage ? stage.id : null; // null = roadmap finished
}

// Derives each stage's state from the list of completed stage ids:
//   COMPLETED -> id is in completedStages
//   CURRENT   -> first stage that is not completed
//   UPCOMING  -> the stage right after CURRENT (visible, unlocks next)
//   LOCKED    -> everything after that (prerequisite not done)
function getRoadmapWithStatus(completedStages, currentStageId, goalId) {
  const roadmap = goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || []);
  const currentIdx = roadmap.findIndex(s => !completedStages.includes(s.id));
  return roadmap.map((stage, idx) => {
    let status = 'locked';
    if (completedStages.includes(stage.id)) status = 'completed';
    else if (idx === currentIdx) status = 'current';
    else if (idx === currentIdx + 1) status = 'upcoming';
    return { ...stage, status };
  });
}

export function AppProvider({ children }) {
  const [profile, setProfileState] = useState(() => getItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE));
  const [progress, setProgressState] = useState(() => getItem(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS));
  const [sessions, setSessionsState] = useState(() => getItem(STORAGE_KEYS.SESSIONS, []));
  const [activity, setActivityState] = useState(() => getItem(STORAGE_KEYS.ACTIVITY, DEFAULT_ACTIVITY));
  const [theme, setThemeState] = useState(() => getItem(STORAGE_KEYS.THEME, 'dark'));

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') { html.classList.add('light'); html.classList.remove('dark'); }
    else { html.classList.add('dark'); html.classList.remove('light'); }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    setItem(STORAGE_KEYS.THEME, next);
  }, [theme]);

  const updateProfile = useCallback((updates) => {
    const next = { ...profile, ...updates };
    setProfileState(next);
    setItem(STORAGE_KEYS.PROFILE, next);
  }, [profile]);

  const selectGoal = useCallback((goalId) => {
    const next = { goalId, completedStages: [], currentStage: computeCurrentStage([], goalId), weeklyHours: 0, weeklyTarget: 8, streak: 0, overallPercent: 0 };
    setProgressState(next);
    setItem(STORAGE_KEYS.PROGRESS, next);
    updateProfile({ currentGoal: goalId });
    const act = [{ id: Date.now(), text: 'Selected new goal: ' + goalId.replace(/-/g, ' '), time: 'Just now', color: 'primary' }];
    setActivityState(act);
    setItem(STORAGE_KEYS.ACTIVITY, act);
  }, [updateProfile]);

  const completeStage = useCallback((stageId) => {
    const currentCompleted = progress.completedStages || [];
    if (currentCompleted.includes(stageId)) return;
    const nextCompleted = [...currentCompleted, stageId];
    const goalId = progress.goalId || 'backend-developer';
    const currentStage = computeCurrentStage(nextCompleted, goalId);
    const overallPercent = computeProgress(nextCompleted, goalId);
    const roadmap = goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || []);
    const stageData = roadmap.find(s => s.id === stageId);
    const newActivity = { id: Date.now(), text: 'Completed: ' + (stageData ? stageData.title : stageId), time: 'Just now', color: 'tertiary' };
    const next = { ...progress, completedStages: nextCompleted, currentStage, overallPercent };
    setProgressState(next);
    setItem(STORAGE_KEYS.PROGRESS, next);
    const nextActivity = [newActivity, ...activity].slice(0, 10);
    setActivityState(nextActivity);
    setItem(STORAGE_KEYS.ACTIVITY, nextActivity);
  }, [progress, activity]);

  const addStudySession = useCallback((durationMinutes) => {
    const hours = durationMinutes / 60;
    const newSession = { id: Date.now(), duration: durationMinutes, stage: progress.currentStage, date: new Date().toISOString() };
    const nextSessions = [newSession, ...sessions].slice(0, 50);
    setSessionsState(nextSessions);
    setItem(STORAGE_KEYS.SESSIONS, nextSessions);
    const nextWeeklyHours = Math.round(((progress.weeklyHours || 0) + hours) * 10) / 10;
    const newActivity = { id: Date.now() + 1, text: 'Study session: ' + durationMinutes + ' min completed', time: new Date().toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), color: 'primary' };
    const next = { ...progress, weeklyHours: nextWeeklyHours };
    setProgressState(next);
    setItem(STORAGE_KEYS.PROGRESS, next);
    const nextActivity = [newActivity, ...activity].slice(0, 10);
    setActivityState(nextActivity);
    setItem(STORAGE_KEYS.ACTIVITY, nextActivity);
  }, [progress, sessions, activity]);

  const getRoadmap = useCallback(() => {
    const goalId = progress.goalId || 'backend-developer';
    return getRoadmapWithStatus(progress.completedStages || [], progress.currentStage || 'stage-01', goalId);
  }, [progress]);

  // Reset everything back to the Ayush demo state (handy before a presentation)
  const resetDemo = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    setProfileState(DEFAULT_PROFILE); setProgressState(DEFAULT_PROGRESS);
    setSessionsState([]); setActivityState(DEFAULT_ACTIVITY);
  }, []);

  return (
    <AppContext.Provider value={{ profile, progress, sessions, activity, theme, toggleTheme, updateProfile, selectGoal, completeStage, addStudySession, getRoadmap, resetDemo }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}