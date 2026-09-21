import React, { useState } from 'react';
import { X, Terminal, Github, Mail } from 'lucide-react';
import { api, setAuthToken } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signup' | 'login' | 'reset'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'reset') {
        setResetSent(true);
        setLoading(false);
        return;
      }

      if (mode === 'signup') {
        const res = await api.register({ fullName, email, password });
        setAuthToken(res.token);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.login({ email, password });
        setAuthToken(res.token);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 23, 23, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card-solid"
        style={{
          width: '100%',
          maxWidth: '840px',
          padding: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          boxShadow: 'var(--shadow-dropdown)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Decorative Panel */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            borderRight: '1px solid var(--color-border-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Terminal size={22} color="var(--color-text)" />
              <strong style={{ fontSize: '18px', fontWeight: 600 }}>Designo.ai</strong>
            </div>

            <p style={{ fontSize: '18px', fontStyle: 'italic', lineHeight: 1.4, color: 'var(--color-text)', marginBottom: '16px' }}>
              "Every great architect started with a blank canvas."
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Practice realistic mock interviews, receive objective weighted scoring, and close knowledge gaps.
            </p>
          </div>

          {/* Decorative Node Graph Visual */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-button)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ color: 'var(--color-text-secondary)' }}>[API Gateway] ──► [Service]</div>
            <div style={{ color: '#1f8a65' }}>   └──► [Redis Cache] (Hit)</div>
            <div style={{ color: '#2563eb' }}>   └──► [DB Replica] (Sync)</div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '4px' }}>
              <X size={20} />
            </button>
          </div>

          {mode === 'reset' ? (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '8px' }}>Reset your password</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                Enter your registered email address and we'll send a password recovery link.
              </p>

              {resetSent ? (
                <div style={{ backgroundColor: 'var(--color-primary)', padding: '16px', borderRadius: 'var(--radius-button)', fontSize: '14px' }}>
                  🎉 <strong>Check your inbox</strong> — the link expires in 15 minutes.
                  <div style={{ marginTop: '12px' }}>
                    <button onClick={() => setMode('login')} className="btn-filled">Back to Log In</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="input-cofounder"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                    />
                  </div>

                  <button type="submit" className="btn-accent" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
                    {loading ? 'Sending...' : 'Send reset link'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <button type="button" onClick={() => setMode('login')} className="btn-ghost" style={{ fontSize: '13px' }}>
                      Back to Log In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '6px' }}>
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                {mode === 'signup' ? 'Start practicing system design interviews in seconds.' : 'Sign in to resume your mock interview sessions.'}
              </p>

              {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 'var(--radius-button)', fontSize: '13px', marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {mode === 'signup' && (
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="input-cofounder"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Chen"
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="input-cofounder"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@tech.com"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Password</label>
                    {mode === 'login' && (
                      <button type="button" onClick={() => setMode('reset')} className="btn-ghost" style={{ padding: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    className="input-cofounder"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {mode === 'signup' && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      Rules: 8+ characters, one uppercase letter, one number
                    </div>
                    {/* Strength Bar */}
                    <div style={{ height: '4px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '2px', overflow: 'hidden', display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          style={{
                            flex: 1,
                            backgroundColor:
                              bar <= strength
                                ? strength <= 1
                                  ? '#dc2626'
                                  : strength === 2
                                  ? '#d97706'
                                  : '#1f8a65'
                                : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-dark" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
                  {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Log In'}
                </button>
              </form>

              {/* OAuth Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-subtle)' }} />
                <span>or continue with</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-subtle)' }} />
              </div>

              {/* OAuth Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <button className="btn-filled" style={{ justifyContent: 'center', fontSize: '13px' }}>
                  <Mail size={16} /> Google
                </button>
                <button className="btn-filled" style={{ justifyContent: 'center', fontSize: '13px' }}>
                  <Github size={16} /> GitHub
                </button>
              </div>

              {/* Footer Swap Link */}
              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {mode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer', textDecoration: 'underline' }}>
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer', textDecoration: 'underline' }}>
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
