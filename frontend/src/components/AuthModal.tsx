import React, { useEffect, useState } from 'react';
import { api, saveAuthTokens } from '../services/api';
import { Modal, Button } from './ui';
import { LogoMark } from './Logo';
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
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <LogoMark size={38} className="shrink-0" />
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
          {mode === 'signup' && 'Welcome to Designo'}
          {mode === 'login' && 'Welcome back'}
          {mode === 'reset' && 'Reset your password'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#777782]">
          {mode === 'signup' && 'Create your account and start practicing system design.'}
          {mode === 'login' && 'Sign in to continue your practice.'}
          {mode === 'reset' && 'We’ll send a reset link to your email.'}
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      showCloseButton
      maxWidth="2xl"
      className="auth-modal max-h-[calc(100dvh-2rem)]"
    >
      <div className="auth-form-fit">
      {/* Social auth */}
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
      </div>
    </Modal>
  );
};
