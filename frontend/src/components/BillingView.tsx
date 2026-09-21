import React from 'react';
import { CreditCard, Check, Download, ExternalLink } from 'lucide-react';

interface BillingViewProps {
  user?: any;
}

export const BillingView: React.FC<BillingViewProps> = ({ user }) => {
  const currentPlan = user?.role === 'PRO' || user?.plan === 'PRO' ? 'Pro' : 'Free';

  const history = [
    { date: 'Sep 01, 2026', desc: 'Designo Pro Monthly Subscription', amount: '$29.00', status: 'Paid' },
    { date: 'Aug 01, 2026', desc: 'Designo Pro Monthly Subscription', amount: '$29.00', status: 'Paid' },
    { date: 'Jul 01, 2026', desc: 'Designo Pro Monthly Subscription', amount: '$29.00', status: 'Paid' },
  ];

  return (
    <div className="container section-padding" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge-accent" style={{ marginBottom: '6px' }}>
          <CreditCard size={12} /> Subscription Management
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 400 }}>Billing & Subscriptions</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', marginTop: '4px' }}>
          Manage your subscription tier, billing preferences, and invoice records.
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="card-solid" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span className="badge-subtle" style={{ backgroundColor: '#ffffff', marginBottom: '6px' }}>Current Plan</span>
          <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Designo {currentPlan} Tier</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Renews automatically on Oct 01, 2026 via Visa ending in 4242.
          </p>
        </div>

        <button className="btn-filled" style={{ backgroundColor: '#ffffff' }}>
          Manage Payment Method <ExternalLink size={14} />
        </button>
      </div>

      {/* 3 Pricing Plan Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        {/* Free */}
        <div className="card-solid" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Free</h3>
            <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>$0 <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ mo</span></div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              <li style={{ display: 'flex', gap: '6px' }}><Check size={14} color="#1f8a65" /> 3 interviews / month</li>
              <li style={{ display: 'flex', gap: '6px' }}><Check size={14} color="#1f8a65" /> Basic category scores</li>
            </ul>
          </div>
          <button className="btn-filled" style={{ width: '100%', justifyContent: 'center' }} disabled={currentPlan === 'Free'}>
            {currentPlan === 'Free' ? 'Current Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* Pro */}
        <div className="card-solid" style={{ border: '2px solid var(--color-text)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '16px', backgroundColor: 'var(--color-dark-btn)', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
            Most Popular
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Pro</h3>
            <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>$29 <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ mo</span></div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-text)', marginBottom: '20px' }}>
              <li style={{ display: 'flex', gap: '6px' }}><Check size={14} color="var(--color-text)" /> Unlimited mock interviews</li>
              <li style={{ display: 'flex', gap: '6px' }}><Check size={14} color="var(--color-text)" /> Advanced SPOF diagram auditor</li>
              <li style={{ display: 'flex', gap: '6px' }}><Check size={14} color="var(--color-text)" /> Company tracks (Google/Meta/Amazon)</li>
            </ul>
          </div>
          <button className="btn-dark" style={{ width: '100%', justifyContent: 'center' }}>
            {currentPlan === 'Pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Enterprise */}
        <div className="card-solid" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Enterprise</h3>
            <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>Custom</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              <li style={{ display: 'flex', gap: '6px' }}><Check size={14} color="#1f8a65" /> Team management & shared stats</li>
              <li style={{ display: 'flex', gap: '6px' }}><Check size={14} color="#1f8a65" /> Organization admin dashboard</li>
            </ul>
          </div>
          <button className="btn-filled" style={{ width: '100%', justifyContent: 'center' }}>Contact Sales</button>
        </div>
      </div>

      {/* Billing History Table */}
      <div className="card-solid">
        <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px' }}>Billing History & Invoices</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: '10px 0' }}>Date</th>
              <th style={{ padding: '10px 0' }}>Description</th>
              <th style={{ padding: '10px 0' }}>Amount</th>
              <th style={{ padding: '10px 0' }}>Status</th>
              <th style={{ padding: '10px 0', textAlign: 'right' }}>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ padding: '12px 0' }}>{row.date}</td>
                <td style={{ padding: '12px 0', fontWeight: 500 }}>{row.desc}</td>
                <td style={{ padding: '12px 0', fontFamily: 'var(--font-mono)' }}>{row.amount}</td>
                <td style={{ padding: '12px 0' }}>
                  <span className="badge-subtle" style={{ backgroundColor: '#e6f4ef', color: '#1f8a65' }}>{row.status}</span>
                </td>
                <td style={{ padding: '12px 0', textAlign: 'right' }}>
                  <button className="btn-ghost" style={{ padding: '4px' }} title="Download Invoice">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
