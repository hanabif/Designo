import React from 'react';
import { X, CheckCircle2, Sparkles, Bell, AlertTriangle, BarChart3, Check } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      unread: true,
      icon: CheckCircle2,
      iconColor: '#1f8a65',
      title: 'Interview Completed',
      desc: 'Your mock interview on "Design Uber / Real-Time Dispatch" is complete.',
      time: '10 mins ago',
    },
    {
      id: '2',
      unread: true,
      icon: Sparkles,
      iconColor: '#2563eb',
      title: 'Score & Report Generated',
      desc: 'Your overall evaluation report is ready — you scored 82/100 (Strong Performance).',
      time: '1 hour ago',
    },
    {
      id: '3',
      unread: false,
      icon: Bell,
      iconColor: '#8b5cf6',
      title: 'Learning Roadmap Reminder',
      desc: "You haven't practiced Database Sharding concepts in 5 days.",
      time: 'Yesterday',
    },
    {
      id: '4',
      unread: false,
      icon: AlertTriangle,
      iconColor: '#d97706',
      title: 'Subscription Expiring Soon',
      desc: 'Your Pro plan auto-renews in 3 days. Manage payment preferences in settings.',
      time: '2 days ago',
    },
    {
      id: '5',
      unread: false,
      icon: BarChart3,
      iconColor: '#171717',
      title: 'Weekly Progress Summary',
      desc: 'Your week in review: 3 interviews completed, +6 average score increase.',
      time: '4 days ago',
    },
  ];

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
          maxWidth: '520px',
          padding: '24px',
          boxShadow: 'var(--shadow-dropdown)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} />
            <h3 style={{ fontSize: '20px', fontWeight: 500 }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-ghost" style={{ fontSize: '13px', padding: '4px 8px' }}>
              <Check size={14} /> Mark all as read
            </button>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '4px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  backgroundColor: item.unread ? 'var(--color-primary)' : 'var(--color-bg)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-button)',
                  padding: '12px 16px 12px 20px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left Edge Glow Indicator for Unread */}
                {item.unread && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '12px',
                      bottom: '12px',
                      width: '4px',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: '#2563eb',
                    }}
                  />
                )}

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Icon size={16} color={item.iconColor} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text)' }}>{item.title}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.time}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
