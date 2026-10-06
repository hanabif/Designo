import React from 'react';
import { CheckCircle2, Sparkles, Bell, BarChart3 } from 'lucide-react';
import { Modal, Badge } from './ui';
import type { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const notifications: (NotificationItem & { icon: React.ElementType; iconColor: string })[] = [
    {
      id: '1',
      unread: true,
      icon: CheckCircle2,
      iconColor: 'text-[#10b981]',
      title: 'Mock Interview Evaluated',
      desc: 'Your session on "Design Uber / Real-Time Dispatch" scored 86/100 (Strong Hire).',
      time: '12 mins ago',
    },
    {
      id: '2',
      unread: true,
      icon: Sparkles,
      iconColor: 'text-[#6b38d4]',
      title: 'Roadmap Milestone Unlocked',
      desc: 'Based on your recent performance, Module 2 (Distributed Consensus) is now ready.',
      time: '1 hour ago',
    },
    {
      id: '3',
      unread: false,
      icon: Bell,
      iconColor: 'text-[#5e5e6e]',
      title: 'Practice Streak Reminder',
      desc: "You're on a 5-day active streak. Practice 1 drill today to maintain your multiplier.",
      time: 'Yesterday',
    },
    {
      id: '4',
      unread: false,
      icon: BarChart3,
      iconColor: 'text-[#0a0a0f]',
      title: 'Weekly Analytics Digest',
      desc: 'Your average score jumped +8.2 points over the last 7 days across Google L6 tracks.',
      time: '3 days ago',
    },
  ];

  const modalTitle = (
    <div className="flex items-center gap-2">
      <Bell size={18} className="text-[#6b38d4]" />
      <h2 className="font-display font-bold text-lg text-[#0a0a0f]">Notifications</h2>
      <Badge variant="primary" className="ml-1">
        2 NEW
      </Badge>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth="md">
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1" data-lenis-prevent>
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                n.unread ? 'bg-[#f4f1fb]/60 border-[#8b5cf6]/20' : 'bg-[#faf9fc] border-[#e5e1ea]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${n.iconColor}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#0a0a0f]">{n.title}</span>
                    <span className="text-[10px] font-mono text-[#8e8ea0]">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#5e5e6e] mt-1 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-[#e5e1ea] flex justify-between items-center text-xs">
        <button className="text-[#6b38d4] font-semibold hover:underline cursor-pointer">
          Mark all as read
        </button>
        <button
          onClick={onClose}
          className="text-[#5e5e6e] hover:text-[#0a0a0f] cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
