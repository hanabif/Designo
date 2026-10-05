import React, { useState } from 'react';
import { Users, FileQuestion, CreditCard, Shield, Sliders, Search, UserPlus } from 'lucide-react';
import type { User } from '../types';
import { Button, Card, Badge } from './ui';

interface AdminPanelViewProps {
  user?: User | null;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ user: _user }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'subscriptions' | 'audit' | 'ai_config'>('users');
  const [isSuperAdmin] = useState<boolean>(true);

  const usersList = [
    { id: '1', name: 'Alex Chen', email: 'alex@tech.com', role: 'PRO', status: 'Active', avatar: '👨‍💻' },
    { id: '2', name: 'Jane Doe', email: 'jane@company.com', role: 'PRO', status: 'Active', avatar: '👩‍💻' },
    { id: '3', name: 'Mark Zuckerberg', email: 'mark@meta.com', role: 'FREE', status: 'Active', avatar: '🧑‍💻' },
    { id: '4', name: 'Sundar Pichai', email: 'sundar@google.com', role: 'ADMIN', status: 'Active', avatar: '👨‍💼' },
  ];

  const auditLogs = [
    { timestamp: '2026-09-18 14:32', action: 'user.role_changed', detail: 'Promoted jane@company.com to Pro tier' },
    { timestamp: '2026-09-18 11:15', action: 'question.created', detail: 'Added "Design Global CDN" to question bank' },
    { timestamp: '2026-09-17 09:40', action: 'ai.prompt_updated', detail: 'Updated System Design Evaluation Prompt template v2.4' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[560px]">
        {/* Admin Sidebar Nav (3 cols) */}
        <Card padding="md" className="md:col-span-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8e8ea0] mb-3 px-2">
              Admin Operations
            </div>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#ede9fe] text-[#6b38d4]'
                  : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
              }`}
            >
              <Users size={16} /> Users Directory
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-[#ede9fe] text-[#6b38d4]'
                  : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
              }`}
            >
              <FileQuestion size={16} /> Question Bank
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'subscriptions'
                  ? 'bg-[#ede9fe] text-[#6b38d4]'
                  : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
              }`}
            >
              <CreditCard size={16} /> Subscriptions
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[#ede9fe] text-[#6b38d4]'
                  : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
              }`}
            >
              <Shield size={16} /> Audit Trail
            </button>

            {isSuperAdmin && (
              <div className="pt-4 mt-4 border-t border-[#e5e1ea]">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 mb-2 px-2">
                  Super Admin
                </div>
                <button
                  onClick={() => setActiveTab('ai_config')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'ai_config'
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
                  }`}
                >
                  <Sliders size={16} className="text-amber-600" /> AI Calibrations
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Main Content (9 cols) */}
        <div className="md:col-span-9 space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8ea0]" />
              <input
                placeholder="Search users or operations..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#e5e1ea] rounded-xl text-xs text-[#0a0a0f] focus:outline-hidden focus:border-[#6b38d4]"
              />
            </div>

            <Button
              variant="dark"
              size="sm"
              iconLeft={<UserPlus size={14} />}
            >
              Invite Admin
            </Button>
          </div>

          {/* Users Table */}
          {activeTab === 'users' && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-lg text-[#0a0a0f] mb-4">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#e5e1ea] text-[#8e8ea0] uppercase">
                      <th className="py-3 px-2">Engineer</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e1ea]">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-[#faf9fc]">
                        <td className="py-3 px-2 font-sans font-semibold text-[#0a0a0f] flex items-center gap-2">
                          <span>{u.avatar}</span>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3 px-2 text-[#5e5e6e]">{u.email}</td>
                        <td className="py-3 px-2">
                          <Badge variant="primary">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="success">
                            {u.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button className="text-[#6b38d4] hover:underline font-sans font-semibold cursor-pointer">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Audit Logs */}
          {activeTab === 'audit' && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-lg text-[#0a0a0f] mb-4">Audit Trail Logs</h2>
              <div className="space-y-3">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#faf9fc] border border-[#e5e1ea] text-xs font-mono flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0a0a0f]">{log.action}</span>
                      <p className="text-[#5e5e6e] font-sans mt-0.5">{log.detail}</p>
                    </div>
                    <span className="text-[#8e8ea0]">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* AI Config */}
          {activeTab === 'ai_config' && (
            <Card padding="lg" className="space-y-4">
              <h2 className="font-display font-bold text-lg text-[#0a0a0f]">AI Evaluator Prompt Calibration</h2>
              <p className="text-xs text-[#5e5e6e]">Model: Gemini 1.5 Pro / GPT-4o Multi-Turn Architecture Rubric</p>
              <textarea
                rows={5}
                defaultValue="You are an uncompromising Principal / Staff Engineer conducting a system design interview. Probe for SPOFs, concurrency locks, data contracts, and fault tolerance."
                className="w-full p-3 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl font-mono text-xs text-[#0a0a0f] focus:outline-hidden focus:border-[#6b38d4]"
              />
              <Button variant="dark" size="sm">
                Save &amp; Deploy Prompt v2.5
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
