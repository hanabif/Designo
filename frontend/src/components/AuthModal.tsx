import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, ShieldCheck } from 'lucide-react';
import { api, setAuthToken } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('engineer@example.com');
  const [password, setPassword] = useState('Password123');
  const [fullName, setFullName] = useState('Alex Rivera');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetLevel, setTargetLevel] = useState('L5 Senior Engineer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login({ email, password });
        setAuthToken(res.accessToken);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.register({
          email,
          password,
          fullName,
          targetCompany,
          targetLevel,
          experienceLevel: 'SENIOR',
        });
        setAuthToken(res.accessToken);
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
        backgroundColor: 'rgba(38, 37, 30, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        className="card-surface"
        style={{ width: '420px', position: 'relative', border: '1px solid var(--color-hairline-strong)' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-muted)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: mode === 'login' ? 'var(--color-ink)' : 'transparent',
                color: mode === 'login' ? '#fff' : 'var(--color-body)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: mode === 'register' ? 'var(--color-ink)' : 'transparent',
                color: mode === 'register' ? '#fff' : 'var(--color-body)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Register Account
            </button>
          </div>

          <h2 className="display-md" style={{ fontSize: '20px' }}>
            {mode === 'login' ? 'Welcome back to Designo' : 'Create candidate account'}
          </h2>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fdf2f2',
              border: '1px solid #f8b4b4',
              borderRadius: 'var(--radius-md)',
              color: '#9b1c1c',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                className="text-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input
              type="email"
              className="text-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Password</label>
            <input
              type="password"
              className="text-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'register' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Company</label>
                <input
                  type="text"
                  className="text-input"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Level</label>
                <input
                  type="text"
                  className="text-input"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
