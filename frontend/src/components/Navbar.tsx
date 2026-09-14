import React from 'react';
import { Cpu, Terminal, BookOpen, BarChart3, Map, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Cpu },
    { id: 'questions', label: 'Questions', icon: BookOpen },
    { id: 'interview', label: 'Mock Interview', icon: Terminal },
    { id: 'diagrams', label: 'Diagram Studio', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
  ];

  return (
    <header className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a href="#landing" onClick={() => setActiveTab('landing')} className="brand-wordmark">
          <Terminal size={22} color="#f54e00" />
          Designo<span className="accent">.ai</span>
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
                  background: isActive ? 'var(--color-surface-card)' : 'transparent',
                  border: isActive ? '1px solid var(--color-hairline-strong)' : '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isActive ? 'var(--color-ink)' : 'var(--color-body)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserIcon size={12} />
              {user.fullName || user.email} ({user.role})
            </span>
            <button onClick={onLogout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn-primary">
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
};
