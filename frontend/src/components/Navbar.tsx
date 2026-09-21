import React from 'react';
import { Terminal, BookOpen, BarChart3, Map, Cpu, Bell, Shield, CreditCard, LayoutDashboard, User as UserIcon, LogOut, Play } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenSetupModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenNotifications,
  onOpenSetupModal,
  onLogout,
}) => {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Cpu },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'questions', label: 'Questions', icon: BookOpen },
    { id: 'interview', label: 'Simulator', icon: Terminal },
    { id: 'diagrams', label: 'Diagram Studio', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'admin', label: 'Admin', icon: Shield },
  ];

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand Logo & Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <a
          href="#landing"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('landing');
          }}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', fontWeight: 600, fontSize: '18px' }}
        >
          <Terminal size={22} color="var(--color-text)" />
          Designo<span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>.ai</span>
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  border: '1px solid transparent',
                  borderRadius: 'var(--radius-button)',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 450,
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right User Bar & Notifications Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onOpenNotifications}
          className="btn-ghost"
          style={{ position: 'relative', padding: '8px' }}
          title="Notifications"
        >
          <Bell size={18} />
          {/* Unread badge dot */}
          <div
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
            }}
          />
        </button>

        <button onClick={onOpenSetupModal} className="btn-filled" style={{ fontSize: '13px', padding: '6px 12px' }}>
          <Play size={14} /> Quick Session
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-accent" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserIcon size={12} /> {user.fullName || user.email}
            </span>
            <button onClick={onLogout} className="btn-ghost" style={{ padding: '6px' }} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn-dark">
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
};
