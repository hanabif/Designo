import React, { useState } from 'react';
import { Users, FileQuestion, CreditCard, Shield, Sliders, Search, UserPlus, Edit2 } from 'lucide-react';

interface AdminPanelViewProps {
  user?: any;
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
    { timestamp: '2026-09-18 14:32', action: 'user.role_changed', detail: 'Promoted jane@company.com to Pro tier', category: '#2563eb' },
    { timestamp: '2026-09-18 11:15', action: 'question.created', detail: 'Added "Design Global CDN" to question bank', category: '#1f8a65' },
    { timestamp: '2026-09-17 09:40', action: 'ai.prompt_updated', detail: 'Updated System Design Evaluation Prompt template v2.4', category: '#d97706' },
  ];

  return (
    <div className="container section-padding">
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '28px', minHeight: '560px' }}>
        {/* Admin Sidebar Nav */}
        <div className="card-solid" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px', paddingLeft: '8px' }}>
              Admin Operations
            </div>

            <button
              onClick={() => setActiveTab('users')}
              className="btn-ghost"
              style={{
                justifyContent: 'flex-start',
                backgroundColor: activeTab === 'users' ? 'var(--color-primary)' : 'transparent',
                fontWeight: activeTab === 'users' ? 600 : 400,
              }}
            >
              <Users size={16} /> Users Management
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className="btn-ghost"
              style={{
                justifyContent: 'flex-start',
                backgroundColor: activeTab === 'questions' ? 'var(--color-primary)' : 'transparent',
                fontWeight: activeTab === 'questions' ? 600 : 400,
              }}
            >
              <FileQuestion size={16} /> Question Bank
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className="btn-ghost"
              style={{
                justifyContent: 'flex-start',
                backgroundColor: activeTab === 'subscriptions' ? 'var(--color-primary)' : 'transparent',
                fontWeight: activeTab === 'subscriptions' ? 600 : 400,
              }}
            >
              <CreditCard size={16} /> Subscriptions
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className="btn-ghost"
              style={{
                justifyContent: 'flex-start',
                backgroundColor: activeTab === 'audit' ? 'var(--color-primary)' : 'transparent',
                fontWeight: activeTab === 'audit' ? 600 : 400,
              }}
            >
              <Shield size={16} /> Audit Logs
            </button>

            {/* Super Admin Section */}
            {isSuperAdmin && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d97706', marginBottom: '8px', paddingLeft: '8px' }}>
                  Super Admin Tools
                </div>

                <button
                  onClick={() => setActiveTab('ai_config')}
                  className="btn-ghost"
                  style={{
                    justifyContent: 'flex-start',
                    backgroundColor: activeTab === 'ai_config' ? 'var(--color-primary)' : 'transparent',
                    fontWeight: activeTab === 'ai_config' ? 600 : 400,
                  }}
                >
                  <Sliders size={16} color="#d97706" /> AI Configuration
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Admin View Content */}
        <div>
          {/* Top Bar Search & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '360px' }}>
              <Search size={16} color="var(--color-text-muted)" />
              <input className="input-cofounder" placeholder="Search users or logs..." />
            </div>

            <button className="btn-accent">
              <UserPlus size={16} /> Invite Admin
            </button>
          </div>

          {/* Tab 1: Users Table */}
          {activeTab === 'users' && (
            <div className="card-solid">
              <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>User Management Table</h2>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
                    <th style={{ padding: '10px 0' }}>User</th>
                    <th style={{ padding: '10px 0' }}>Email</th>
                    <th style={{ padding: '10px 0' }}>Role</th>
                    <th style={{ padding: '10px 0' }}>Status</th>
                    <th style={{ padding: '10px 0', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{u.avatar}</span>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </td>
                      <td style={{ padding: '12px 0', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px 0' }}>
                        <span className="badge-accent" style={{ fontSize: '11px' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px 0' }}>
                        <span className="badge-subtle" style={{ backgroundColor: '#e6f4ef', color: '#1f8a65' }}>{u.status}</span>
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>
                        <button className="btn-ghost" style={{ padding: '4px' }} title="Edit User"><Edit2 size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Audit Logs Tab */}
          {activeTab === 'audit' && (
            <div className="card-solid">
              <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>System Audit Logs</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {auditLogs.map((log, i) => (
                  <div key={i} style={{ padding: '12px 16px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-button)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: log.category }} />
                      <span>{log.timestamp}</span>
                      <strong style={{ color: 'var(--color-text)' }}>· {log.action} ·</strong>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{log.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: AI Config (Super Admin Only) */}
          {activeTab === 'ai_config' && (
            <div className="card-solid">
              <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>Super Admin: AI Engine Configuration</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                    System Evaluation Prompt Template
                  </label>
                  <textarea
                    className="input-cofounder font-mono"
                    style={{ height: '140px', fontSize: '13px' }}
                    defaultValue="You are Designo AI, a senior software architect interviewer evaluating system design answers across 7 weighted categories. Return JSON format with category scores, SPOFs, and recommendations."
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button className="btn-dark">Save AI Configuration</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
