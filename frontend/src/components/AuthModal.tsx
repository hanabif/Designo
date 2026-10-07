import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';
import { api, saveAuthTokens } from '../services/api';
import { Modal, Button } from './ui';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, isNewAccount: boolean) => void;
  initialMode?: 'signup' | 'login';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'signup' }) => {
  const [mode, setMode] = useState<'signup' | 'login' | 'reset'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

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
        saveAuthTokens(res.accessToken, res.refreshToken);
        onSuccess(res.user, true);
        onClose();
      } else {
        const res = await api.login({ email, password });
        saveAuthTokens(res.accessToken, res.refreshToken);
        onSuccess(res.user, false);
        onClose();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-[#0a0a0f] flex items-center justify-center text-white shrink-0">
        <Terminal size={16} />
      </div>
      <div>
        <h2 className="font-display font-bold text-xl text-[#0a0a0f]">
          {mode === 'signup' && 'Create your account'}
          {mode === 'login' && 'Welcome back'}
          {mode === 'reset' && 'Reset password'}
        </h2>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth="md">
      {/* Social auth */}
      {mode !== 'reset' && (
        <div className="space-y-2.5 mb-6">
          <button
            type="button"
            onClick={() => setError('GitHub sign-in is not configured yet. Please use email and password.')}
            className="w-full py-2.5 px-4 rounded-xl border border-[#e5e1ea] bg-[#faf9fc] hover:bg-white text-xs font-semibold text-[#0a0a0f] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-[#e5e1ea]" />
            <span className="px-3 text-[11px] font-mono text-[#8e8ea0] uppercase">Or with email</span>
            <div className="flex-1 border-t border-[#e5e1ea]" />
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            Password reset link sent to your email.
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-4 py-2.5 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] focus:outline-hidden focus:border-[#6b38d4] focus:bg-white"
            />
          </div>
        )}

        <div>
          <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-1.5">
            Work / Personal Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-2.5 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] focus:outline-hidden focus:border-[#6b38d4] focus:bg-white"
          />
        </div>

        {mode !== 'reset' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs uppercase text-[#5e5e6e] font-semibold">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-[11px] text-[#6b38d4] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] focus:outline-hidden focus:border-[#6b38d4] focus:bg-white"
            />
          </div>
        )}

        <Button
          type="submit"
          variant="dark"
          loading={loading}
          fullWidth
          className="mt-2"
        >
          {mode === 'signup' ? 'Create Account' : mode === 'login' ? 'Sign In' : 'Send Reset Link'}
        </Button>
      </form>

      {/* Footer switch mode */}
      <div className="mt-6 pt-4 border-t border-[#e5e1ea] text-center text-xs text-[#5e5e6e]">
        {mode === 'signup' ? (
          <span>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-[#6b38d4] font-semibold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </span>
        ) : (
          <span>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-[#6b38d4] font-semibold hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </span>
        )}
      </div>
    </Modal>
  );
};
