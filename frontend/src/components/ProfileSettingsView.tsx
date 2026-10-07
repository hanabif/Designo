import React, { useState } from 'react';
import { Save, UserRound } from 'lucide-react';
import type { User } from '../types';
import { api } from '../services/api';
import { Button, Card, Badge } from './ui';

const roles = ['Frontend Engineer', 'Backend Engineer', 'Full-Stack Engineer', 'Mobile Engineer (iOS)', 'Mobile Engineer (Android)', 'Software Engineer', 'Platform Engineer', 'DevOps Engineer', 'Cloud Infrastructure Engineer', 'Site Reliability Engineer (SRE)', 'Data Engineer', 'Analytics Engineer', 'Machine Learning Engineer', 'AI Engineer', 'Data Scientist', 'Security Engineer', 'QA / Test Automation Engineer', 'Embedded Systems Engineer', 'Game Developer', 'Engineering Manager', 'Solutions Architect'];
const levels = ['STUDENT', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'STAFF'];

interface ProfileSettingsViewProps {
  user: User | null;
  onSave: (user: User) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ user, onSave }) => {
  const [position, setPosition] = useState(user?.currentPosition || user?.profile?.position || 'Backend Engineer');
  const [experienceLevel, setExperienceLevel] = useState((user?.experienceLevel || user?.profile?.experienceLevel || 'SENIOR').toUpperCase().replace('-', '_'));
  const [years, setYears] = useState(user?.yearsOfExperience ?? user?.profile?.years ?? 5);
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany || user?.profile?.targetCompany || 'Google');
  const [targetLevel, setTargetLevel] = useState(user?.targetLevel || user?.profile?.targetLevel || 'Senior (L5)');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const save = async () => {
    setSaving(true);
    setMessage('');
    const update = { currentPosition: position, experienceLevel, yearsOfExperience: years, targetCompany, targetLevel };
    try {
      const saved = await api.updateProfile(update);
      onSave({ ...saved, profile: { position, experienceLevel, years, targetCompany, targetLevel } });
      setMessage('Profile saved. Your next interview will use these preferences.');
    } catch {
      setMessage('Could not save your profile. Please sign in and try again.');
    } finally {
      setSaving(false);
    }
  };

  return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <div className="mb-7 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ede9fe] text-[#6b38d4]"><UserRound size={21} /></div><div><Badge variant="primary">Profile settings</Badge><h1 className="mt-2 text-3xl font-bold">Interview preferences</h1></div></div>
    <Card padding="lg">
      <p className="mb-6 text-sm text-[#5e5e6e]">Update your role and experience. The AI interviewer uses these details to tailor the technical focus and difficulty of your practice.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-xs font-semibold text-[#5e5e6e]">Current / desired role<select value={position} onChange={(e) => setPosition(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e5e1ea] bg-[#faf9fc] px-4 py-3 text-sm text-[#0a0a0f]">{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
        <label className="text-xs font-semibold text-[#5e5e6e]">Experience level<select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e5e1ea] bg-[#faf9fc] px-4 py-3 text-sm text-[#0a0a0f]">{levels.map((level) => <option key={level} value={level}>{level.replace('_', ' ')}</option>)}</select></label>
        <label className="text-xs font-semibold text-[#5e5e6e]">Years of experience<input type="number" min="0" max="60" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[#e5e1ea] bg-[#faf9fc] px-4 py-3 text-sm text-[#0a0a0f]" /></label>
        <label className="text-xs font-semibold text-[#5e5e6e]">Target company<input value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e5e1ea] bg-[#faf9fc] px-4 py-3 text-sm text-[#0a0a0f]" /></label>
        <label className="text-xs font-semibold text-[#5e5e6e] sm:col-span-2">Target interview level<input value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e5e1ea] bg-[#faf9fc] px-4 py-3 text-sm text-[#0a0a0f]" /></label>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">{message && <p className="text-xs text-[#5e5e6e]">{message}</p>}<Button variant="dark" size="md" loading={saving} iconLeft={<Save size={15} />} onClick={save}>Save profile</Button></div>
    </Card>
  </div>;
};
