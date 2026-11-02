import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';
import {
  DEFAULT_PROFILE, DEFAULT_PROGRESS, DEFAULT_ACTIVITY,
  BACKEND_ROADMAP, OTHER_ROADMAPS,
} from '../data/mockData';
import { api } from '../services/api';
import * as authService from '../services/auth';

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
  return stage ? stage.id : null;
}

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
  const [practice, setPracticeState] = useState(() => getItem(STORAGE_KEYS.PRACTICE, []));
  const [attempts, setAttemptsState] = useState(() => getItem(STORAGE_KEYS.ATTEMPTS, []));
  const [gamification, setGamificationState] = useState(() => getItem(STORAGE_KEYS.GAMIFICATION, { xp: 0, solvedCount: 0, lastSolvedDate: null, streak: 0, bestStreak: 0, badges: [] }));
  const [theme, setThemeState] = useState(() => getItem(STORAGE_KEYS.THEME, 'dark'));
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [auth, setAuthState] = useState(() => getItem(STORAGE_KEYS.AUTH, null));
  const isAuthenticated = !!auth?.userId;

  // Hydrate from backend asynchronously on mount
  useEffect(() => {
    async function syncWithBackend() {
      // The Express store is single-tenant and holds the default demo student,
      // so only pull its data when that student is the one signed in.
      const sessionUser = getItem(STORAGE_KEYS.AUTH, null)?.userId;
      if (sessionUser !== 'demo-ayush') {
        try { await api.checkHealth(); setBackendStatus('online'); }
        catch { setBackendStatus('offline'); }
        return;
      }
      try {
        const [prof, prog] = await Promise.all([
          api.getProfile().catch(() => null),
          api.getProgress().catch(() => null),
        ]);

        if (prof) {
          setProfileState(prof);
          setItem(STORAGE_KEYS.PROFILE, prof);
        }
        if (prog?.progress) {
          setProgressState(prog.progress);
          setItem(STORAGE_KEYS.PROGRESS, prog.progress);
        }
        if (prog?.activity) {
          setActivityState(prog.activity);
          setItem(STORAGE_KEYS.ACTIVITY, prog.activity);
        }
        if (prog?.sessions) {
          setSessionsState(prog.sessions);
          setItem(STORAGE_KEYS.SESSIONS, prog.sessions);
        }
        setBackendStatus('online');
      } catch {
        setBackendStatus('offline');
      }
    }

    syncWithBackend();
  }, []);

  // Keep the signed-in student's account record in sync with their live data
  useEffect(() => {
    if (!auth?.userId) return;
    authService.snapshotAccount(auth.userId, { profile, progress, activity, sessions });
  }, [auth, profile, progress, activity, sessions]);

  const applySession = useCallback(({ account, session }) => {
    const prof = account.profile || DEFAULT_PROFILE;
    const prog = account.progress || DEFAULT_PROGRESS;
    const act = account.activity || [];
    const sess = account.sessions || [];
    setProfileState(prof); setItem(STORAGE_KEYS.PROFILE, prof);
    setProgressState(prog); setItem(STORAGE_KEYS.PROGRESS, prog);
    setActivityState(act); setItem(STORAGE_KEYS.ACTIVITY, act);
    setSessionsState(sess); setItem(STORAGE_KEYS.SESSIONS, sess);
    setAuthState(session); setItem(STORAGE_KEYS.AUTH, session);
    return session;
  }, []);

  const login = useCallback(async (credentials) => applySession(await authService.login(credentials)), [applySession]);
  const register = useCallback(async (data) => applySession(await authService.register(data)), [applySession]);
  const demoLogin = useCallback(async (demoId) => applySession(await authService.demoLogin(demoId)), [applySession]);

  const logout = useCallback(() => {
    if (auth?.userId) authService.snapshotAccount(auth.userId, { profile, progress, activity, sessions });
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setAuthState(null);
  }, [auth, profile, progress, activity, sessions]);

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

  const updateProfile = useCallback(async (updates) => {
    const next = { ...profile, ...updates };
    setProfileState(next);
    setItem(STORAGE_KEYS.PROFILE, next);

    try {
      await api.updateProfile(updates);
    } catch {
      // Offline fallback already updated in localStorage
    }
  }, [profile]);

  const selectGoal = useCallback(async (goalId) => {
    const next = {
      goalId,
      completedStages: [],
      currentStage: computeCurrentStage([], goalId),
      weeklyHours: 0,
      weeklyTarget: 8,
      streak: 0,
      overallPercent: 0,
      masteredTopics: [],
    };
    setProgressState(next);
    setItem(STORAGE_KEYS.PROGRESS, next);
    updateProfile({ currentGoal: goalId });
    const act = [{ id: Date.now(), text: 'Selected new goal: ' + goalId.replace(/-/g, ' '), time: 'Just now', color: 'primary' }];
    setActivityState(act);
    setItem(STORAGE_KEYS.ACTIVITY, act);

    try {
      await api.selectGoal(goalId);
    } catch {
      // Handled via local fallback
    }
  }, [updateProfile]);

  const completeStage = useCallback(async (stageId) => {
    const currentCompleted = progress.completedStages || [];
    if (currentCompleted.includes(stageId)) return;
    const nextCompleted = [...currentCompleted, stageId];
    const goalId = progress.goalId || 'backend-developer';
    const currentStage = computeCurrentStage(nextCompleted, goalId);
    const overallPercent = computeProgress(nextCompleted, goalId);
    const roadmap = goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || []);
    const stageData = roadmap.find(s => s.id === stageId);

    // Auto-master all topics in the completed stage
    const stageTopics = stageData?.topics || [];
    const currentMastered = progress.masteredTopics || [];
    const nextMastered = Array.from(new Set([...currentMastered, ...stageTopics]));

    const newActivity = { id: Date.now(), text: 'Completed: ' + (stageData ? stageData.title : stageId), time: 'Just now', color: 'tertiary' };
    const next = { ...progress, completedStages: nextCompleted, currentStage, overallPercent, masteredTopics: nextMastered };
    setProgressState(next);
    setItem(STORAGE_KEYS.PROGRESS, next);
    const nextActivity = [newActivity, ...activity].slice(0, 10);
    setActivityState(nextActivity);
    setItem(STORAGE_KEYS.ACTIVITY, nextActivity);

    try {
      await api.completeStage(stageId);
    } catch {
      // Local fallback active
    }
  }, [progress, activity]);

  const toggleTopic = useCallback(async (topic) => {
    const currentMastered = progress.masteredTopics || [];
    const nextMastered = currentMastered.includes(topic)
      ? currentMastered.filter(t => t !== topic)
      : [...currentMastered, topic];

    const next = { ...progress, masteredTopics: nextMastered };
    setProgressState(next);
    setItem(STORAGE_KEYS.PROGRESS, next);

    try {
      await api.toggleTopic(topic);
    } catch {
      // Local fallback active
    }
  }, [progress]);

  const addStudySession = useCallback(async (durationMinutes) => {
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

    try {
      await api.logSession(durationMinutes);
    } catch {
      // Handled locally
    }
  }, [progress, sessions, activity]);

  const addPracticeQuestion = useCallback((question) => {
    const item = { id: Date.now(), title: question.title.trim(), url: question.url?.trim() || '', topic: question.topic?.trim() || 'General practice', source: question.source?.trim() || 'Personal list', status: 'todo', createdAt: new Date().toISOString() }
    if (!item.title) return
    const next = [item, ...practice].slice(0, 100)
    setPracticeState(next)
    setItem(STORAGE_KEYS.PRACTICE, next)
  }, [practice])

  const togglePracticeQuestion = useCallback((questionId) => {
    const next = practice.map(item => item.id === questionId ? { ...item, status: item.status === 'done' ? 'todo' : 'done', solvedAt: item.status === 'done' ? null : new Date().toISOString() } : item)
    setPracticeState(next)
    setItem(STORAGE_KEYS.PRACTICE, next)
    const solved = next.find(item => item.id === questionId)?.status === 'done'
    const newActivity = { id: Date.now(), text: solved ? 'Completed a practice question' : 'Reopened a practice question', time: 'Just now', color: solved ? 'tertiary' : 'primary' }
    const nextActivity = [newActivity, ...activity].slice(0, 10)
    setActivityState(nextActivity)
    setItem(STORAGE_KEYS.ACTIVITY, nextActivity)
  }, [practice, activity])

  const recordPracticeAttempt = useCallback((attempt) => {
    const item = { id: Date.now(), questionId: attempt.questionId, title: attempt.title, topic: attempt.topic, answerLength: attempt.answerLength, quality: attempt.quality, feedback: attempt.feedback, xpAwarded: attempt.quality === 'good', createdAt: new Date().toISOString() }
    const next = [item, ...attempts].slice(0, 100)
    setAttemptsState(next)
    setItem(STORAGE_KEYS.ATTEMPTS, next)
  }, [attempts])

  const awardPracticeXp = useCallback((questionId) => {
    const alreadyAwarded = attempts.some(item => item.questionId === questionId && item.xpAwarded)
    if (alreadyAwarded) return
    const today = new Date()
    const todayKey = today.toISOString().slice(0, 10)
    const previousKey = gamification.lastSolvedDate
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const yesterdayKey = yesterday.toISOString().slice(0, 10)
    const nextStreak = previousKey === yesterdayKey ? (gamification.streak || 0) + 1 : 1
    const solvedCount = (gamification.solvedCount || 0) + 1
    const badgeRules = [{ id: 'first-solve', label: 'First Solve', icon: 'flag', test: solvedCount >= 1 }, { id: 'ten-solves', label: '10 Questions', icon: 'military_tech', test: solvedCount >= 10 }, { id: 'seven-day-streak', label: '7-Day Streak', icon: 'local_fire_department', test: nextStreak >= 7 }]
    const badges = Array.from(new Set([...(gamification.badges || []), ...badgeRules.filter(badge => badge.test).map(badge => badge.id)]))
    const next = { ...gamification, xp: (gamification.xp || 0) + 40, solvedCount, lastSolvedDate: todayKey, streak: nextStreak, bestStreak: Math.max(gamification.bestStreak || 0, nextStreak), badges }
    setGamificationState(next)
    setItem(STORAGE_KEYS.GAMIFICATION, next)
  }, [attempts, gamification])

  const markPracticeSolved = useCallback((questionId) => {
    const next = practice.map(item => item.id === questionId ? { ...item, status: 'done', solvedAt: item.solvedAt || new Date().toISOString() } : item)
    setPracticeState(next)
    setItem(STORAGE_KEYS.PRACTICE, next)
    const question = next.find(item => item.id === questionId)
    if (question) {
      const nextActivity = [{ id: Date.now(), text: `Solved: ${question.title}`, time: 'Just now', color: 'tertiary' }, ...activity].slice(0, 10)
      setActivityState(nextActivity)
      setItem(STORAGE_KEYS.ACTIVITY, nextActivity)
    }
  }, [practice, activity])

  const removePracticeQuestion = useCallback((questionId) => {
    const next = practice.filter(item => item.id !== questionId)
    setPracticeState(next)
    setItem(STORAGE_KEYS.PRACTICE, next)
  }, [practice])
  const getRoadmap = useCallback(() => {
    const goalId = progress.goalId || 'backend-developer';
    return getRoadmapWithStatus(progress.completedStages || [], progress.currentStage || 'stage-01', goalId);
  }, [progress]);

  // Reset demo state across both local storage and server
  const resetDemo = useCallback(async () => {
    // Keep the session and account registry so a reset doesn't sign the student out
    const keep = [STORAGE_KEYS.AUTH, STORAGE_KEYS.ACCOUNTS, STORAGE_KEYS.THEME];
    Object.values(STORAGE_KEYS).filter(k => !keep.includes(k)).forEach(k => localStorage.removeItem(k));
    const seed = authService.getResetState(auth?.userId, profile);
    setProfileState(seed.profile);
    setProgressState(seed.progress);
    setSessionsState([]);
    setActivityState(seed.activity);

    try {
      if (!auth?.userId || auth.userId === 'demo-ayush') await api.resetAll();
    } catch {
      // Local reset completed
    }
  }, [auth, profile]);

  return (
    <AppContext.Provider value={{
      profile, progress, sessions, activity, practice, attempts, theme, backendStatus,
      auth, isAuthenticated, login, register, demoLogin, logout,
      toggleTheme, updateProfile, selectGoal, completeStage, toggleTopic, addStudySession, addPracticeQuestion, togglePracticeQuestion, markPracticeSolved, removePracticeQuestion, recordPracticeAttempt, awardPracticeXp, gamification, getRoadmap, resetDemo
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}



