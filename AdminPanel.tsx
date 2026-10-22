import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Lock,
  ArrowUpRight,
  Filter,
  CreditCard,
} from 'lucide-react';
import {
  Celebrity,
  PlatformMetrics,
  GatedContentItem,
  BookingOrder,
} from '../types';
import { luxuryAudio } from './AudioEngine';

interface AdminPanelProps {
  metrics: PlatformMetrics;
  celebrities: Celebrity[];
  gatedItems: GatedContentItem[];
  recentOrders: BookingOrder[];
  onApproveItem: (id: string) => void;
  onFlagItem: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  metrics,
  celebrities,
  gatedItems,
  recentOrders,
  onApproveItem,
  onFlagItem,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'moderation' | 'tenants' | 'transactions'>('metrics');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredItems = gatedItems.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Platform Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#1E202B]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C8880] mb-1">
            <span className="text-[#C9A86A]">AURA PRIVÉ GLOBAL SAAS REGISTRY</span>
            <span>·</span>
            <span>Multi-Tenant Gateway v4.2</span>
            <span>·</span>
            <span className="text-emerald-400">18 Subdomains Online</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Platform Operations & Moderation
          </h1>
          <p className="text-sm text-[#9E9A92] mt-1 font-light">
            Monitor GMV velocity, Stripe Connect escrow splits, automated guideline compliance, and multi-tenant SSL nodes.
          </p>
        </div>

        {/* Global SaaS Metric Pill */}
        <div className="flex items-center gap-4 bg-[#0F1018] p-4 rounded-2xl border border-white/5">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#888]">Platform SaaS Revenue (8%)</div>
            <div className="text-xl font-serif font-bold text-[#E5C378] tabular-nums mt-0.5">
              ${(metrics.totalPlatformRevenue / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div>
            <div className="text-[10px] font-mono uppercase text-[#888]">Active Subscriptions</div>
            <div className="text-xl font-serif font-bold text-white tabular-nums mt-0.5">
              {metrics.activeCelebrities} Tiers
            </div>
          </div>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-[#1A1B24] pb-2 overflow-x-auto">
        {[
          { id: 'metrics', label: 'Financial Telemetry', icon: TrendingUp },
          { id: 'moderation', label: `Content Moderation (${gatedItems.length})`, icon: ShieldAlert },
          { id: 'tenants', label: `Celebrity Tenancy (${celebrities.length})`, icon: Globe },
          { id: 'transactions', label: `Stripe Ledger (${recentOrders.length})`, icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                luxuryAudio.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#1C1E2A] text-white border border-white/10 shadow-sm'
                  : 'text-[#8E8B83] hover:text-[#EDE8DF]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C9A86A]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: FINANCIAL TELEMETRY */}
      {activeTab === 'metrics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="text-xs uppercase font-mono text-[#8C8880]">Cumulative GMV Volume</div>
              <div className="text-3xl font-serif font-bold text-white tabular-nums mt-2">
                ${(metrics.totalGmv / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-[#A6A29A] mt-2">Tickets, Aviation & Suites</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="text-xs uppercase font-mono text-[#8C8880]">Celebrity Payouts (92%)</div>
              <div className="text-3xl font-serif font-bold text-[#E5C378] tabular-nums mt-2">
                ${(metrics.celebrityPayoutVolume / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-[#A6A29A] mt-2">Routed via Stripe Connect</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="text-xs uppercase font-mono text-[#8C8880]">Stripe Escrow Reserve</div>
              <div className="text-3xl font-serif font-bold text-white tabular-nums mt-2">
                ${(metrics.stripeEscrowHeld / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-emerald-400 mt-2">Full Collateral Backed</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="text-xs uppercase font-mono text-[#8C8880]">Platform Gross Take-Rate</div>
              <div className="text-3xl font-serif font-bold text-white tabular-nums mt-2">
                8.00%
              </div>
              <div className="text-[11px] text-[#A6A29A] mt-2">Fixed SaaS split protocol</div>
            </div>
          </div>

          {/* Subscription Tiers Table */}
          <div className="p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Celebrity SaaS Tier Subscriptions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[#888] font-mono">
                    <th className="pb-3 font-normal">Plan Name</th>
                    <th className="pb-3 font-normal">Monthly Fee</th>
                    <th className="pb-3 font-normal">Aviation Engine</th>
                    <th className="pb-3 font-normal">Subdomain SSL</th>
                    <th className="pb-3 font-normal">Stripe Split</th>
                    <th className="pb-3 font-normal">Enrolled Icons</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr>
                    <td className="py-3 text-white font-serif text-sm">Sovereign Obsidian</td>
                    <td className="py-3 text-[#E5C378]">$14,500/mo</td>
                    <td className="py-3 text-emerald-400">Unlimited Gulfstream / Global</td>
                    <td className="py-3 text-white">Custom Domain CNAME</td>
                    <td className="py-3 text-white">92% Artist / 8% SaaS</td>
                    <td className="py-3 text-white">12 Icons</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-white font-serif text-sm">Imperial Gold</td>
                    <td className="py-3 text-[#E5C378]">$8,500/mo</td>
                    <td className="py-3 text-emerald-400">Citation X+ Charter Pool</td>
                    <td className="py-3 text-white">subdomain.aura.luxury</td>
                    <td className="py-3 text-white">90% Artist / 10% SaaS</td>
                    <td className="py-3 text-white">6 Icons</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CONTENT MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Editorial & Content Moderation</h2>
              <p className="text-xs text-[#9E9A92] mt-0.5">
                Audit celebrity masterclasses, backstage livestreams, and VIP messaging against platform guidelines.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-[#12131C] rounded-xl border border-white/5 text-xs">
              {(['all', 'approved', 'pending review', 'flagged'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                    filterStatus === status ? 'bg-[#1E202B] text-white shadow-sm' : 'text-[#888] hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D] flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#C9A86A] bg-[#161824] px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded ${
                        item.status === 'Approved'
                          ? 'bg-emerald-950/60 text-emerald-400'
                          : item.status === 'Flagged'
                          ? 'bg-rose-950/60 text-rose-400'
                          : 'bg-amber-950/60 text-amber-400'
                      }`}
                    >
                      {item.status} ({item.moderationScore}% Compliance)
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white mt-1.5">{item.title}</h3>
                  <p className="text-xs text-[#9E9A92] mt-1">{item.description}</p>
                  <div className="text-[11px] font-mono text-[#777] mt-2">
                    Published: {item.publishedAt} · Required: {item.tierRequired}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      luxuryAudio.playChime(659.25);
                      onApproveItem(item.id);
                    }}
                    className="px-3.5 py-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve Drop</span>
                  </button>

                  <button
                    onClick={() => {
                      luxuryAudio.playClick();
                      onFlagItem(item.id);
                    }}
                    className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Flag / Quarantine</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: CELEBRITY TENANCY */}
      {activeTab === 'tenants' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Multi-Tenant Subdomain Directory</h2>
            <p className="text-xs text-[#9E9A92] mt-0.5">
              Each artist operates an autonomous edge namespace with custom DNS and dedicated Stripe Connect treasury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {celebrities.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400">DNS Verified</span>
                  <span className="text-[11px] font-mono text-[#8C8880]">{c.stripeConnect.status}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white mt-2">{c.name}</h3>
                <div className="text-xs font-mono text-[#C9A86A] mt-0.5">{c.subdomainFull}</div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs font-mono text-[#A8A49C]">
                  <div>GMV: <strong className="text-white">${(c.metrics.gmvTotal / 1000000).toFixed(1)}M</strong></div>
                  <div>Patrons: <strong className="text-white">{c.metrics.patronsCount}</strong></div>
                  <div>Stripe: <span className="text-[#888]">{c.stripeConnect.accountId}</span></div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5">
                  <a
                    href={`#${c.subdomain}`}
                    className="text-xs text-[#C9A86A] hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Inspect Edge Node</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
          <h2 className="font-serif text-xl font-bold text-white mb-4">Stripe Connect Split Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-[#888]">
                  <th className="pb-3 font-normal">Reference</th>
                  <th className="pb-3 font-normal">Patron</th>
                  <th className="pb-3 font-normal">Salon Event</th>
                  <th className="pb-3 font-normal">Total Charge</th>
                  <th className="pb-3 font-normal">Artist (92%)</th>
                  <th className="pb-3 font-normal">AURA Fee (8%)</th>
                  <th className="pb-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 text-white font-semibold">{ord.bookingRef}</td>
                    <td className="py-3 text-[#A8A49C]">{ord.customerName}</td>
                    <td className="py-3 text-white truncate max-w-[180px]">{ord.eventTitle}</td>
                    <td className="py-3 text-white font-bold">${ord.subtotal.toLocaleString()}</td>
                    <td className="py-3 text-[#E5C378]">${ord.celebrityPayout.toLocaleString()}</td>
                    <td className="py-3 text-[#C9A86A]">${ord.saasFee.toLocaleString()}</td>
                    <td className="py-3 text-emerald-400">{ord.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
