import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Terminal, BookOpen, BarChart3, Map, Cpu, Bell, CreditCard,
  LayoutDashboard, User as UserIcon, LogOut, Play, Sparkles, Menu, X, Settings,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { Logo, LogoWordmark } from './Logo';
import { isClerkEnabled, ClerkUserButton } from '../lib/clerk';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accountMenuOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [accountMenuOpen]);
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
    return <Link key={item.path} to={item.path} onClick={() => mobile && setMobileMenuOpen(false)} title={!mobile && sidebarCollapsed ? item.label : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? 'bg-[#ede9fe] text-[#6b38d4]' : 'text-[#5e5e6e] hover:bg-[#f4f1fb] hover:text-[#0a0a0f]'} ${!mobile && sidebarCollapsed ? 'justify-center' : ''}`}><Icon size={17} className={`shrink-0 ${active ? 'text-[#6b38d4]' : 'text-[#8e8ea0]'}`} /><span className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out ${!mobile && sidebarCollapsed ? 'max-w-0 opacity-0' : 'max-w-48 opacity-100'}`}>{item.label}</span></Link>;
  });

  return <>
    <aside className={`hidden md:flex sticky top-0 h-screen shrink-0 flex-col overflow-hidden border-r border-[#e5e1ea] bg-white/90 px-2 py-6 backdrop-blur-xl transition-[width] duration-300 ease-in-out ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="mb-8 flex items-center justify-between">
      <Link to="/dashboard" title={sidebarCollapsed ? 'Designo' : undefined} className="flex min-w-0 items-center gap-3 px-1 text-decoration-none">
        <Logo size={28} wordmark={false} />
        <div className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out ${sidebarCollapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'}`}><LogoWordmark className="text-lg font-extrabold" /></div>
      </Link>
      {!sidebarCollapsed && <button onClick={() => setSidebarCollapsed(true)} aria-label="Collapse sidebar" title="Collapse sidebar" className="rounded-lg p-2 text-[#8e8ea0] hover:bg-[#f4f1fb] hover:text-[#6b38d4]"><PanelLeftClose size={17} /></button>}
      {sidebarCollapsed && <button onClick={() => setSidebarCollapsed(false)} aria-label="Expand sidebar" title="Expand sidebar" className="rounded-lg p-1 text-[#8e8ea0] transition-colors hover:bg-[#f4f1fb] hover:text-[#6b38d4]"><PanelLeftOpen size={15} /></button>}
      </div>
      {!sidebarCollapsed && <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8e8ea0]">Workspace</div>}
      {/* Nav takes the leftover height and scrolls internally on short
          viewports, so the footer (account button) can never be cropped. */}
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1" data-lenis-prevent>{links()}</nav>
      <div className="mt-auto shrink-0 space-y-3 border-t border-[#e5e1ea] pt-4">
        <button onClick={onOpenNotifications} title={sidebarCollapsed ? 'Notifications' : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#5e5e6e] hover:bg-[#f4f1fb] hover:text-[#0a0a0f] ${sidebarCollapsed ? 'justify-center' : ''}`} aria-label="View notifications"><Bell size={17} className="shrink-0" />{!sidebarCollapsed && <><span>Notifications</span><span className="ml-auto h-2 w-2 rounded-full bg-[#6b38d4]" /></>}</button>
        {sidebarCollapsed ? <button onClick={onOpenSetupModal} title="Mock Interview" aria-label="Mock Interview" className="flex w-full justify-center rounded-xl bg-[#0a0a0f] p-3 text-white hover:bg-neutral-800"><Play size={14} fill="currentColor" /></button> : <Button variant="dark" size="sm" fullWidth iconLeft={<Play size={13} fill="currentColor" />} onClick={onOpenSetupModal}>Mock Interview</Button>}
        {user ? isClerkEnabled ? (
          <div className="flex items-center rounded-xl bg-[#faf9fe] p-1.5" title="Account options">
            <ClerkUserButton />
          </div>
        ) : <div ref={accountMenuRef} className={`relative flex items-center gap-2 rounded-xl bg-[#faf9fe] p-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <button
            onClick={() => setAccountMenuOpen((open) => !open)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            title="Account options"
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8b5cf6]/30 bg-[#ede9fe] text-xs font-semibold text-[#6b38d4]">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</div>
            {!sidebarCollapsed && <span className="min-w-0"><span className="block truncate text-xs font-semibold text-[#0a0a0f]">{user.fullName || user.name || user.email?.split('@')[0] || 'Engineer'}</span><span className="block truncate font-mono text-[10px] text-[#5e5e6e]">{user.tier || 'Pro Candidate'}</span></span>}
          </button>
          {accountMenuOpen && (
            <div role="menu" className="absolute bottom-full left-0 z-50 mb-2 w-48 rounded-xl border border-[#e5e1ea] bg-white p-1.5 shadow-lg">
              {user.email && <p className="truncate px-2.5 py-2 text-[11px] text-[#8e8ea0]" title={user.email}>{user.email}</p>}
              <button role="menuitem" onClick={() => { setAccountMenuOpen(false); navigate('/dashboard'); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#5e5e6e] hover:bg-[#f4f1fb] hover:text-[#0a0a0f]">
                <LayoutDashboard size={15} /> View dashboard
              </button>
              <button role="menuitem" onClick={() => { setAccountMenuOpen(false); onLogout(); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50">
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div> : sidebarCollapsed ? <button onClick={onOpenAuth} title="Sign In" aria-label="Sign In" className="flex w-full justify-center rounded-xl border border-[#e5e1ea] p-2.5 text-[#5e5e6e] hover:bg-[#f4f1fb]"><UserIcon size={16} /></button> : <Button variant="outline" size="sm" fullWidth iconLeft={<UserIcon size={14} />} onClick={onOpenAuth}>Sign In</Button>}
      </div>
    </aside>

    <header className="sticky top-0 z-40 border-b border-[#e5e1ea] bg-[#faf9fe]/95 backdrop-blur-xl md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2"><Logo size={24} wordmarkClassName="text-lg font-extrabold" /></Link>
        <div className="flex items-center gap-1"><button onClick={onOpenNotifications} className="rounded-lg p-2 text-[#5e5e6e]" aria-label="View notifications"><Bell size={18} /></button><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-[#5e5e6e]" aria-label="Toggle navigation">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </div>
      {mobileMenuOpen && <nav className="space-y-1 border-t border-[#e5e1ea] bg-white px-4 py-3">{links(true)}<Button variant="dark" size="sm" fullWidth iconLeft={<Play size={13} fill="currentColor" />} onClick={() => { setMobileMenuOpen(false); onOpenSetupModal(); }}>Mock Interview</Button>{user ? <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#5e5e6e]"><LogOut size={17} />Log out</button> : <Button variant="outline" size="sm" fullWidth iconLeft={<UserIcon size={14} />} onClick={onOpenAuth}>Sign In</Button>}</nav>}
    </header>
  </>;
};
