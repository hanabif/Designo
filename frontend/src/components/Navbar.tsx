import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Terminal, BookOpen, BarChart3, Map, Cpu, Bell, CreditCard,
  LayoutDashboard, User as UserIcon, LogOut, Play, Sparkles, Menu, X, Settings,
} from 'lucide-react';
import type { User } from '../types';
import { Button } from './ui';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenSetupModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onOpenNotifications, onOpenSetupModal, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { path: '/', label: 'Overview', icon: Sparkles },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/questions', label: 'Questions', icon: BookOpen },
    { path: '/interview', label: 'Simulator', icon: Terminal },
    { path: '/diagrams', label: 'Diagram Studio', icon: Cpu },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/roadmap', label: 'Roadmap', icon: Map },
    { path: '/billing', label: 'Billing', icon: CreditCard },
    { path: '/profile', label: 'Profile & Settings', icon: Settings },
  ];
  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(path + '/');

  const links = (mobile = false) => navItems.filter((item) => item.path !== '/').map((item) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return <Link key={item.path} to={item.path} onClick={() => mobile && setMobileMenuOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? 'bg-[#ede9fe] text-[#6b38d4]' : 'text-[#5e5e6e] hover:bg-[#f4f1fb] hover:text-[#0a0a0f]'}`}><Icon size={17} className={active ? 'text-[#6b38d4]' : 'text-[#8e8ea0]'} /><span>{item.label}</span></Link>;
  });

  return <>
    <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-[#e5e1ea] bg-white/90 px-4 py-6 backdrop-blur-xl">
      <Link to="/dashboard" className="mb-8 flex items-center gap-3 px-2 text-decoration-none">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a0a0f] text-white"><Terminal size={18} /></div>
        <div><span className="font-display text-lg font-extrabold tracking-tight text-[#0a0a0f]">Designo<span className="text-[#6b38d4]">.ai</span></span></div>
      </Link>
      <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8e8ea0]">Workspace</div>
      <nav className="flex flex-col gap-1">{links()}</nav>
      <div className="mt-auto space-y-3 border-t border-[#e5e1ea] pt-4">
        <button onClick={onOpenNotifications} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#5e5e6e] hover:bg-[#f4f1fb] hover:text-[#0a0a0f]" aria-label="View notifications"><Bell size={17} /><span>Notifications</span><span className="ml-auto h-2 w-2 rounded-full bg-[#6b38d4]" /></button>
        <Button variant="dark" size="sm" fullWidth iconLeft={<Play size={13} fill="currentColor" />} onClick={onOpenSetupModal}>Mock Interview</Button>
        {user ? <div className="flex items-center gap-2 rounded-xl bg-[#faf9fe] p-2">
          <button onClick={() => navigate('/dashboard')} className="flex min-w-0 flex-1 items-center gap-2 text-left" title="Go to dashboard">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8b5cf6]/30 bg-[#ede9fe] text-xs font-semibold text-[#6b38d4]">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</div>
            <span className="min-w-0"><span className="block truncate text-xs font-semibold text-[#0a0a0f]">{user.fullName || user.name || user.email?.split('@')[0] || 'Engineer'}</span><span className="block truncate font-mono text-[10px] text-[#5e5e6e]">{user.tier || 'Pro Candidate'}</span></span>
          </button><button onClick={onLogout} className="rounded-lg p-2 text-[#8e8ea0] hover:bg-red-50 hover:text-red-600" title="Log Out" aria-label="Log out"><LogOut size={16} /></button>
        </div> : <Button variant="outline" size="sm" fullWidth iconLeft={<UserIcon size={14} />} onClick={onOpenAuth}>Sign In</Button>}
      </div>
    </aside>

    <header className="sticky top-0 z-40 border-b border-[#e5e1ea] bg-[#faf9fe]/95 backdrop-blur-xl md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0a0f] text-white"><Terminal size={16} /></div><span className="font-display text-lg font-extrabold text-[#0a0a0f]">Designo<span className="text-[#6b38d4]">.ai</span></span></Link>
        <div className="flex items-center gap-1"><button onClick={onOpenNotifications} className="rounded-lg p-2 text-[#5e5e6e]" aria-label="View notifications"><Bell size={18} /></button><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-[#5e5e6e]" aria-label="Toggle navigation">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </div>
      {mobileMenuOpen && <nav className="space-y-1 border-t border-[#e5e1ea] bg-white px-4 py-3">{links(true)}<Button variant="dark" size="sm" fullWidth iconLeft={<Play size={13} fill="currentColor" />} onClick={() => { setMobileMenuOpen(false); onOpenSetupModal(); }}>Mock Interview</Button>{user ? <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#5e5e6e]"><LogOut size={17} />Log out</button> : <Button variant="outline" size="sm" fullWidth iconLeft={<UserIcon size={14} />} onClick={onOpenAuth}>Sign In</Button>}</nav>}
    </header>
  </>;
};
