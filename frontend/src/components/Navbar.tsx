import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Terminal,
  BookOpen,
  BarChart3,
  Map,
  Cpu,
  Bell,
  CreditCard,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Play,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import type { User } from '../types';
import { Button, Badge } from './ui';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenSetupModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenNotifications,
  onOpenSetupModal,
  onLogout,
}) => {
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
  ];

  const checkIsActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-40 transition-all duration-300 backdrop-blur-xl bg-[#faf9fe]/90 border-b border-[#e5e1ea]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Badge */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-3 group text-decoration-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#0a0a0f] flex items-center justify-center transition-transform group-hover:scale-95 shadow-xs text-white">
              <Terminal size={17} />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-[#0a0a0f]">
              Designo<span className="text-[#6b38d4]">.ai</span>
            </span>
          </Link>

          <div className="hidden lg:inline-flex">
            <Badge
              variant="primary"
              icon={<span className="w-1.5 h-1.5 rounded-full bg-[#6b38d4] animate-pulse" />}
            >
              L6/L7 Architect AI
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ede9fe] text-[#6b38d4] shadow-xs'
                    : 'text-[#5e5e6e] hover:text-[#0a0a0f] hover:bg-[#f4f1fb]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#6b38d4]' : 'text-[#8e8ea0]'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full text-[#5e5e6e] hover:text-[#0a0a0f] hover:bg-[#f4f1fb] transition-colors cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6b38d4]" />
          </button>

          <Button
            variant="dark"
            size="sm"
            className="hidden sm:inline-flex"
            iconLeft={<Play size={13} fill="currentColor" />}
            onClick={onOpenSetupModal}
          >
            Mock Interview
          </Button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#e5e1ea]">
              <div
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 cursor-pointer"
                title="Go to dashboard"
              >
                <div className="w-8 h-8 rounded-full bg-[#ede9fe] text-[#6b38d4] font-semibold text-xs flex items-center justify-center border border-[#8b5cf6]/30">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <div className="font-semibold text-[#0a0a0f] leading-tight">
                    {user.fullName || user.name || user.email?.split('@')[0] || 'Engineer'}
                  </div>
                  <div className="text-[10px] text-[#5e5e6e] font-mono">
                    {user.tier || 'Pro Candidate'}
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-[#8e8ea0] hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                title="Log Out"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              iconLeft={<UserIcon size={14} />}
              onClick={onOpenAuth}
            >
              Sign In
            </Button>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-lg text-[#5e5e6e] hover:text-[#0a0a0f] hover:bg-[#f4f1fb] cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e5e1ea] bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-[#ede9fe] text-[#6b38d4]'
                    : 'text-[#5e5e6e] hover:bg-[#faf9fc] hover:text-[#0a0a0f]'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
