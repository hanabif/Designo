import React, { useState } from 'react';
import { CreditCard, Check, Download, ExternalLink } from 'lucide-react';
import type { User } from '../types';
import { Button, Card, Badge } from './ui';

interface BillingViewProps {
  user?: User | null;
}

export const BillingView: React.FC<BillingViewProps> = ({ user }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const history = [
    { date: 'Oct 01, 2026', invoice: 'INV-2026-003', desc: 'Designo Pro Candidate — Monthly', amount: '$39.00', status: 'Paid' },
    { date: 'Sep 01, 2026', invoice: 'INV-2026-002', desc: 'Designo Pro Candidate — Monthly', amount: '$39.00', status: 'Paid' },
    { date: 'Aug 01, 2026', invoice: 'INV-2026-001', desc: 'Designo Pro Candidate — Monthly', amount: '$39.00', status: 'Paid' },
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$0',
      period: 'forever free',
      desc: 'Essential first-principles practice for students & junior engineers.',
      features: [
        '3 mock interview sessions / month',
        'Basic rubric breakdown (Score / 100)',
        'Access to 10 foundational questions',
        'Standard evaluation latency',
      ],
      cta: 'Current Plan',
      isCurrent: !user,
      isPopular: false,
    },
    {
      id: 'pro',
      name: 'Pro Candidate',
      price: billingCycle === 'annual' ? '$29' : '$39',
      period: billingCycle === 'annual' ? '/mo (billed annually)' : '/month',
      desc: 'Complete autonomous coaching loop for Senior (L5) interviews.',
      features: [
        'Unlimited mock interview loops',
        'Real-time AI diagram auditor & SPOF detector',
        'Calibrated company tracks (Google, Meta, Amazon)',
        'Turn-by-turn score delta analysis (+/- pts)',
        'Custom knowledge gap learning roadmap',
      ],
      cta: 'Manage Subscription',
      isCurrent: true,
      isPopular: true,
    },
    {
      id: 'staff',
      name: 'Staff & Principal',
      price: billingCycle === 'annual' ? '$79' : '$99',
      period: billingCycle === 'annual' ? '/mo (billed annually)' : '/month',
      desc: 'High-stakes calibration for L6+ Bar Raiser & Principal loops.',
      features: [
        'Everything in Pro Candidate',
        'Ruthless Staff Bar Raiser AI persona',
        'Production failover & chaos simulation scenarios',
        'Mermaid & SVG full architectural exports',
        '1-on-1 human Staff Architect session critique',
      ],
      cta: 'Upgrade to Staff',
      isCurrent: false,
      isPopular: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8 pb-6 border-b border-[#e5e1ea]">
        <Badge variant="primary" icon={<CreditCard size={13} />} className="mb-2">
          SUBSCRIPTION &amp; BILLING
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
          Plans &amp; Membership
        </h1>
        <p className="text-sm text-[#5e5e6e] mt-1">
          Invest in realistic mock interview simulations designed to land Staff and Principal engineering offers.
        </p>
      </div>

      {/* Active Subscription Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#f3f0ff] via-white to-[#faf9fe] border border-[#8b5cf6]/30 mb-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Badge variant="primary">
            Active Subscription
          </Badge>
          <h2 className="font-display font-bold text-2xl text-[#0a0a0f] mt-2">
            Designo Pro Candidate Plan
          </h2>
          <p className="text-xs text-[#5e5e6e] mt-1 font-mono">
            Renews automatically on Nov 01, 2026 ($39.00/mo) via Visa ending in 4242.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          iconRight={<ExternalLink size={13} />}
        >
          Manage Card Details
        </Button>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-[#0a0a0f]' : 'text-[#8e8ea0]'}`}>
          Monthly Billing
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className="w-12 h-6 bg-[#0a0a0f] rounded-full p-1 transition-colors relative cursor-pointer"
          aria-label="Toggle annual or monthly billing"
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform ${
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-[#0a0a0f]' : 'text-[#8e8ea0]'}`}>
            Annual Billing
          </span>
          <Badge variant="primary">
            SAVE 20%
          </Badge>
        </div>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
              p.isPopular
                ? 'bg-white border-2 border-[#6b38d4] shadow-lg ring-4 ring-[#6b38d4]/5'
                : 'bg-white border border-[#e5e1ea] shadow-xs'
            }`}
          >
            {p.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6b38d4] text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                MOST POPULAR
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl text-[#0a0a0f]">{p.name}</h3>
              </div>
              <p className="text-xs text-[#5e5e6e] mb-6 leading-relaxed">{p.desc}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display font-black text-4xl text-[#0a0a0f]">{p.price}</span>
                <span className="font-mono text-xs text-[#8e8ea0]">{p.period}</span>
              </div>

              {/* Features list */}
              <div className="space-y-3 mb-8">
                {p.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#0a0a0f]">
                    <Check size={14} className="text-[#6b38d4] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant={p.isPopular ? 'dark' : 'outline'}
              size="md"
              fullWidth
            >
              {p.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* Invoice History Table */}
      <Card padding="lg">
        <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-4">
          Invoice History &amp; Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#e5e1ea] text-[#8e8ea0] uppercase">
                <th className="py-3 px-2">Invoice</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1ea]">
              {history.map((inv, idx) => (
                <tr key={idx} className="hover:bg-[#faf9fc] transition-colors">
                  <td className="py-3.5 px-2 font-semibold text-[#0a0a0f]">{inv.invoice}</td>
                  <td className="py-3.5 px-2 text-[#5e5e6e]">{inv.date}</td>
                  <td className="py-3.5 px-2 text-[#0a0a0f] font-sans">{inv.desc}</td>
                  <td className="py-3.5 px-2 font-bold text-[#0a0a0f]">{inv.amount}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant="success">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button className="text-[#6b38d4] hover:underline inline-flex items-center gap-1 font-sans font-semibold cursor-pointer">
                      <Download size={12} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
