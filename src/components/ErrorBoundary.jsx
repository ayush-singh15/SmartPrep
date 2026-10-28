import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('SmartPrep ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    try {
      localStorage.removeItem('smartprep_auth')
      localStorage.removeItem('smartprep_profile')
      localStorage.removeItem('smartprep_progress')
    } catch {
      // ignore
    }
    window.location.hash = '#/login'
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090d14',
          color: '#f3f6fb',
          padding: 24,
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: 480,
            width: '100%',
            backgroundColor: '#101722',
            border: '1px solid rgba(45, 68, 98, 0.45)',
            borderRadius: 14,
            padding: 28,
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#f43f5e',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              marginBottom: 16
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Session Rendering Issue</h2>
            <p style={{ fontSize: '0.875rem', color: '#93a4be', marginBottom: 20, lineHeight: 1.5 }}>
              {this.state.error?.message || 'An unexpected error occurred while rendering the workspace.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  backgroundColor: '#14b8a6',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Reload
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  backgroundColor: '#172232',
                  color: '#f43f5e',
                  border: '1px solid rgba(244, 63, 94, 0.35)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Reset Session & Login
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
