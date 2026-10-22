import React, { useState } from 'react';
import {
  Calendar,
  Plane,
  Building2,
  Radio,
  Lock,
  DollarSign,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Users,
  Compass,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import {
  Celebrity,
  EventShow,
  JetCharter,
  HotelPartner,
  GatedContentItem,
  BroadcastMessage,
  TicketTier,
} from '../types';
import { luxuryAudio } from './AudioEngine';

interface CelebrityDashboardProps {
  celebrity: Celebrity;
  events: EventShow[];
  jets: JetCharter[];
  hotels: HotelPartner[];
  gatedContent: GatedContentItem[];
  broadcasts: BroadcastMessage[];
  onAddEvent: (newEvent: EventShow) => void;
  onSendBroadcast: (newMsg: BroadcastMessage) => void;
  onAddGatedContent: (item: GatedContentItem) => void;
}

export const CelebrityDashboard: React.FC<CelebrityDashboardProps> = ({
  celebrity,
  events,
  jets,
  hotels,
  gatedContent,
  broadcasts,
  onAddEvent,
  onSendBroadcast,
  onAddGatedContent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'travel' | 'broadcast' | 'vault' | 'finances'>('overview');

  // Form states for creating new event
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCity, setNewEventCity] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventDate, setNewEventDate] = useState('DEC 12, 2026');
  const [newEventTierPrice, setNewEventTierPrice] = useState('3500');

  // Form states for broadcast
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'All Patrons' | 'Gold Tier & Above' | 'Sovereign Circle Only'>('Sovereign Circle Only');
  const [broadcastChannel, setBroadcastChannel] = useState<'VIP Concierge SMS' | 'Direct App Push' | 'Encrypted Dispatch'>('VIP Concierge SMS');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Form states for Gated Content Drop
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultTitle, setVaultTitle] = useState('');
  const [vaultType, setVaultType] = useState<'Masterclass 4K' | 'Private Audio Vault' | 'Runway Archive' | 'Secret Drop'>('Masterclass 4K');
  const [vaultTier, setVaultTier] = useState('Gold Tier & Above');
  const [vaultDuration, setVaultDuration] = useState('42 min');

  // Payout simulation state
  const [payoutTriggered, setPayoutTriggered] = useState(false);

  const celebEvents = events.filter((e) => e.celebrityId === celebrity.id);
  const celebVault = gatedContent.filter((g) => g.celebrityId === celebrity.id);
  const celebBroadcasts = broadcasts.filter((b) => b.celebrityId === celebrity.id);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventCity) return;
    luxuryAudio.playChime(659.25);

    const price = parseInt(newEventTierPrice) || 3000;
    const created: EventShow = {
      id: `evt-custom-${Date.now()}`,
      celebrityId: celebrity.id,
      title: newEventTitle,
      city: newEventCity,
      country: 'VIP Destination',
      venue: newEventVenue || 'Private Villa Amphitheater',
      date: newEventDate,
      time: '20:00 CET',
      image: '/src/assets/images/luxury_event_stage_1792684672440.jpg',
      description: 'An ultra-private curated evening designed exclusively for tier holders with private aviation transfers.',
      tiers: [
        {
          id: `tier-sovereign-${Date.now()}`,
          name: 'Sovereign Circle Pass',
          price: price,
          perks: ['Private Salon seating', 'Direct backstage artist encounter', 'Dedicated aviation concierge'],
          available: 12,
          total: 12,
          badge: 'Sovereign',
        },
        {
          id: `tier-gold-${Date.now()}`,
          name: 'Royal Mezzanine',
          price: Math.round(price * 0.65),
          perks: ['Reserved lounge seating', 'Vintage champagne reception'],
          available: 24,
          total: 24,
          badge: 'Premier',
        },
      ],
      privateJetShuttleAvailable: true,
      hotelPackageAvailable: true,
      status: 'Upcoming',
    };

    onAddEvent(created);
    setShowEventModal(false);
    setNewEventTitle('');
    setNewEventCity('');
    setNewEventVenue('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    luxuryAudio.playChime(783.99);

    const newMsg: BroadcastMessage = {
      id: `bc-${Date.now()}`,
      celebrityId: celebrity.id,
      title: broadcastTitle,
      body: broadcastBody,
      channel: broadcastChannel,
      audienceSegment: broadcastAudience,
      sentAt: 'Just now',
      deliveredCount: broadcastAudience === 'Sovereign Circle Only' ? 64 : 14820,
      openRate: '99.4%',
    };

    onSendBroadcast(newMsg);
    setBroadcastTitle('');
    setBroadcastBody('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  const handleCreateVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultTitle) return;
    luxuryAudio.playChime(880.0);

    const newItem: GatedContentItem = {
      id: `gate-${Date.now()}`,
      celebrityId: celebrity.id,
      title: vaultTitle,
      type: vaultType,
      duration: vaultDuration,
      tierRequired: vaultTier,
      unlockedCount: 0,
      description: 'Exclusive archival transmission unlocked exclusively for verified patron accounts.',
      status: 'Approved',
      moderationScore: 99,
      publishedAt: 'Just now',
    };

    onAddGatedContent(newItem);
    setShowVaultModal(false);
    setVaultTitle('');
  };

  const handleTriggerPayout = () => {
    luxuryAudio.playChime(587.33);
    setPayoutTriggered(true);
    setTimeout(() => {
      setPayoutTriggered(false);
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Concierge Command Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#1E202B]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C8880] mb-1">
            <span className="text-[#C9A86A]">CELEBRITY CONCIERGE ENGINE</span>
            <span>·</span>
            <span>Subdomain: {celebrity.subdomain}.aura.luxury</span>
            <span>·</span>
            <span className="text-emerald-400">Stripe Connect Active</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {celebrity.name}’s Command Studio
          </h1>
          <p className="text-sm text-[#9E9A92] mt-1 font-light">
            Manage your bespoke event seating tiers, Gulfstream jet charters, luxury penthouse allotments, and high-margin Stripe Connect splits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              luxuryAudio.playClick();
              setShowEventModal(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Salon</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-[#1A1B24]">
        {[
          { id: 'overview', label: 'Studio Overview', icon: TrendingUp },
          { id: 'events', label: `Events & Tiers (${celebEvents.length})`, icon: Calendar },
          { id: 'travel', label: 'Private Jets & Penthouse', icon: Plane },
          { id: 'broadcast', label: 'VIP Fan Broadcast', icon: Radio },
          { id: 'vault', label: `Gated Vault (${celebVault.length})`, icon: Lock },
          { id: 'finances', label: 'Stripe Connect Splits', icon: DollarSign },
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
                  ? 'bg-[#1C1E2A] text-[#EDE8DF] border border-white/10 shadow-sm'
                  : 'text-[#8E8B83] hover:text-[#EDE8DF] hover:bg-[#12131C]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C9A86A]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="mt-8 space-y-8">
          {/* Top KPI Cards (Clean single-elevation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="text-xs uppercase font-mono text-[#8C8880]">Total Gross Revenue (GMV)</div>
              <div className="text-3xl font-serif font-bold text-white tabular-nums mt-2">
                ${(celebrity.metrics.gmvTotal / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-[#A6A29A] mt-2 flex items-center gap-1.5">
                <span className="text-emerald-400 font-mono">+18.4%</span>
                <span>vs previous quarter</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="text-xs uppercase font-mono text-[#8C8880]">Artist Split (92%)</div>
              <div className="text-3xl font-serif font-bold text-[#E5C378] tabular-nums mt-2">
                ${((celebrity.metrics.gmvTotal * 0.92) / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-[#A6A29A] mt-2">
                Stripe Connect direct routing
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="text-xs uppercase font-mono text-[#8C8880]">Escrow Pending Payout</div>
              <div className="text-3xl font-serif font-bold text-white tabular-nums mt-2">
                ${(celebrity.metrics.pendingPayout / 1000).toFixed(0)}K
              </div>
              <div className="text-[11px] text-[#A6A29A] mt-2">
                Ready for instant disbursement
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="text-xs uppercase font-mono text-[#8C8880]">Active Jet Hours</div>
              <div className="text-3xl font-serif font-bold text-white tabular-nums mt-2">
                {celebrity.metrics.flightHours}h
              </div>
              <div className="text-[11px] text-[#A6A29A] mt-2">
                Gulfstream G650ER & Global 7500
              </div>
            </div>
          </div>

          {/* 2-Column Split: Active Salons & Recent Broadcasts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-white">Upcoming Curated Salons</h3>
                <button
                  onClick={() => setActiveTab('events')}
                  className="text-xs text-[#C9A86A] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {celebEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-[#14151F] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-mono text-[#D4AF37]">{evt.date} · {evt.city}</div>
                      <div className="text-base font-semibold text-white mt-0.5">{evt.title}</div>
                      <div className="text-xs text-[#9E9A92] mt-0.5">{evt.venue}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono text-[#A8A49C]">
                        {evt.tiers.reduce((acc, t) => acc + (t.total - t.available), 0)} / {evt.tiers.reduce((acc, t) => acc + t.total, 0)} Sold
                      </div>
                      <div className="text-sm font-serif font-bold text-white mt-1">
                        From ${Math.min(...evt.tiers.map((t) => t.price)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-white">Latest Patron Broadcasts</h3>
                <button
                  onClick={() => setActiveTab('broadcast')}
                  className="text-xs text-[#C9A86A] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Dispatch New</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {celebBroadcasts.length === 0 ? (
                  <div className="text-xs text-[#888] py-8 text-center">No dispatches sent yet.</div>
                ) : (
                  celebBroadcasts.map((bc) => (
                    <div key={bc.id} className="p-3.5 rounded-xl bg-[#14151F] border border-white/5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#8C8880]">
                        <span className="text-[#C9A86A]">{bc.channel}</span>
                        <span>{bc.sentAt}</span>
                      </div>
                      <div className="text-xs font-semibold text-white mt-1">{bc.title}</div>
                      <div className="text-[11px] text-[#A6A29A] mt-1 line-clamp-2">{bc.body}</div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-2">
                        {bc.openRate} Open Rate · {bc.deliveredCount.toLocaleString()} Delivered
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS & TIERS */}
      {activeTab === 'events' && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Event Salons & Seating Tiers</h2>
              <p className="text-xs text-[#9E9A92] mt-0.5">Define seat allocations, pricing thresholds, and luxury hospitality inclusions.</p>
            </div>
            <button
              onClick={() => {
                luxuryAudio.playClick();
                setShowEventModal(true);
              }}
              className="px-4 py-2 bg-[#1C1E2A] text-white hover:bg-[#252838] border border-white/10 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>Add Salon Tour Date</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {celebEvents.map((evt) => (
              <div key={evt.id} className="p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C9A86A]">
                      <span>{evt.date}</span>
                      <span>·</span>
                      <span>{evt.time}</span>
                      <span>·</span>
                      <span className="text-white">{evt.city}, {evt.country}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mt-1">{evt.title}</h3>
                    <p className="text-xs text-[#9E9A92] mt-1">{evt.venue} — {evt.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-[#1A1C28] text-xs font-mono text-emerald-400 border border-emerald-500/20">
                      Live on Subdomain
                    </span>
                  </div>
                </div>

                {/* Tier Breakdowns */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {evt.tiers.map((tier) => (
                    <div key={tier.id} className="p-4 rounded-xl bg-[#14151F] border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#C9A86A]">{tier.badge}</span>
                        <span className="text-sm font-serif font-bold text-white tabular-nums">
                          ${tier.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-2">{tier.name}</div>
                      <div className="text-xs text-[#8C8880] mt-1">
                        {tier.total - tier.available} reserved / {tier.total} allotment
                      </div>

                      {/* Capacity progress bar */}
                      <div className="w-full bg-[#08080C] h-1.5 rounded-full mt-3 overflow-hidden">
                        <div
                          className="bg-[#C9A86A] h-full"
                          style={{ width: `${((tier.total - tier.available) / tier.total) * 100}%` }}
                        />
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                        {tier.perks.slice(0, 2).map((perk, idx) => (
                          <div key={idx} className="text-[11px] text-[#A6A29A] flex items-center gap-1.5">
                            <span className="text-[#C9A86A]">✓</span>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRAVEL INTEGRATIONS */}
      {activeTab === 'travel' && (
        <div className="mt-8 space-y-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Private Jet Charters & Penthouse Partnerships</h2>
            <p className="text-xs text-[#9E9A92] mt-0.5">Real-time FBO slots and presidential suite inventory linked to VIP event tickets.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Jet Fleet Cards */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase font-mono text-[#C9A86A] tracking-wider">Aura Aviation Partner Fleet</h3>
              {jets.map((jet) => (
                <div key={jet.id} className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-emerald-400">{jet.status}</span>
                      <h4 className="text-base font-serif font-bold text-white mt-0.5">{jet.model}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-serif font-bold text-[#E5C378] tabular-nums">
                        ${jet.hourlyRateUsd.toLocaleString()}/hr
                      </div>
                      <div className="text-[11px] font-mono text-[#8C8880]">Tail: {jet.tailNumber}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono text-[#A8A49C] bg-[#14151F] p-2.5 rounded-xl border border-white/5">
                    <div>Pax: <span className="text-white font-bold">{jet.capacityPax}</span></div>
                    <div>Speed: <span className="text-white font-bold">{jet.cruiseSpeedKnots} kts</span></div>
                    <div>Range: <span className="text-white font-bold">{jet.rangeKm}</span></div>
                  </div>

                  <div className="mt-3 text-xs text-[#9E9A92]">
                    <span className="text-[#C9A86A] font-medium">FBO Corridor:</span> {jet.defaultOriginFbo} ➔ {jet.defaultDestFbo}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                    {jet.cateringMenu.slice(0, 2).map((dish, i) => (
                      <span key={i} className="text-[11px] text-[#A6A29A] bg-[#1A1C28] px-2 py-0.5 rounded">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Hotel Penthouse Allotments */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase font-mono text-[#C9A86A] tracking-wider">Presidential Penthouse Allotments</h3>
              {hotels.map((h) => (
                <div key={h.id} className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#C9A86A]">{h.city}</span>
                      <h4 className="text-base font-serif font-bold text-white mt-0.5">{h.name}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-serif font-bold text-white tabular-nums">
                        ${h.nightlyRateUsd.toLocaleString()}/night
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">{h.status}</div>
                    </div>
                  </div>

                  <div className="text-xs text-[#EDE8DF] font-medium mt-2">
                    Suite: {h.suiteName} ({h.roomSqFt.toLocaleString()} sq ft)
                  </div>
                  <div className="text-xs text-[#8C8880] mt-0.5">View: {h.view}</div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                    {h.perks.slice(0, 2).map((perk, i) => (
                      <div key={i} className="text-[11px] text-[#A6A29A] flex items-center gap-1.5">
                        <span className="text-[#C9A86A]">✦</span>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VIP FAN BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
            <h2 className="font-serif text-xl font-bold text-white">Concierge VIP Broadcast Dispatch</h2>
            <p className="text-xs text-[#9E9A92] mt-0.5 mb-6">
              Send priority SMS, push alerts, or private dispatches directly to high-net-worth patron ticket holders.
            </p>

            {broadcastSuccess && (
              <div className="p-4 mb-6 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Broadcast dispatched successfully to patron circle with 99.4% delivery guarantee.</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#A8A49C] mb-1.5">
                  Target Patron Audience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['All Patrons', 'Gold Tier & Above', 'Sovereign Circle Only'] as const).map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setBroadcastAudience(tier)}
                      className={`px-3 py-2 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                        broadcastAudience === tier
                          ? 'bg-[#1E202B] border-[#C9A86A] text-[#EDE8DF]'
                          : 'bg-[#12131C] border-white/5 text-[#888]'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A8A49C] mb-1.5">
                  Dispatch Delivery Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['VIP Concierge SMS', 'Direct App Push', 'Encrypted Dispatch'] as const).map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setBroadcastChannel(ch)}
                      className={`px-3 py-2 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                        broadcastChannel === ch
                          ? 'bg-[#1E202B] border-[#C9A86A] text-[#EDE8DF]'
                          : 'bg-[#12131C] border-white/5 text-[#888]'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A8A49C] mb-1.5">
                  Dispatch Title / Subject
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Private Jet Flight Manifest Confirmed"
                  className="w-full bg-[#12131C] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#C9A86A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A8A49C] mb-1.5">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  placeholder="Detail the itinerary, dressing recommendations, or secret rehearsal access details..."
                  className="w-full bg-[#12131C] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#C9A86A]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Send Verified Dispatch</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
            <h3 className="font-serif text-lg font-bold text-white mb-4">Transmission Ledger</h3>
            <div className="space-y-3">
              {celebBroadcasts.map((bc) => (
                <div key={bc.id} className="p-4 rounded-xl bg-[#14151F] border border-white/5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#C9A86A]">{bc.channel}</span>
                    <span className="text-[#888]">{bc.sentAt}</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1.5">{bc.title}</div>
                  <div className="text-xs text-[#A8A49C] mt-1">{bc.body}</div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8C8880]">
                    <span>Target: {bc.audienceSegment}</span>
                    <span className="text-emerald-400">{bc.deliveredCount} Delivered ({bc.openRate})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GATED VAULT */}
      {activeTab === 'vault' && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Backstage Gated Vault & Masterclasses</h2>
              <p className="text-xs text-[#9E9A92] mt-0.5">Restricted high-fidelity media unlocked only for verified ticket tier patrons.</p>
            </div>
            <button
              onClick={() => {
                luxuryAudio.playClick();
                setShowVaultModal(true);
              }}
              className="px-4 py-2 bg-[#1C1E2A] text-white hover:bg-[#252838] border border-white/10 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>Upload Gated Media Drop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {celebVault.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#C9A86A]">{item.type}</span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    {item.status} ({item.moderationScore}% Compliant)
                  </span>
                </div>
                <h4 className="text-base font-serif font-bold text-white mt-2">{item.title}</h4>
                <p className="text-xs text-[#9E9A92] mt-1">{item.description}</p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#8C8880]">
                  <span>Tier Required: <strong className="text-white">{item.tierRequired}</strong></span>
                  <span>Duration: <strong className="text-white">{item.duration}</strong></span>
                </div>
                <div className="text-[11px] text-[#A6A29A] mt-1">
                  Unlocked by {item.unlockedCount} patrons · Published {item.publishedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STRIPE CONNECT FINANCES */}
      {activeTab === 'finances' && (
        <div className="mt-8 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F1018] border border-[#1F212D]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div>
                <div className="text-xs font-mono text-[#C9A86A]">STRIPE CONNECT ARCHITECTURE</div>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">Escrow & Split Payout Ledger</h3>
                <p className="text-xs text-[#9E9A92] mt-1">
                  Connected Account: <span className="font-mono text-white">{celebrity.stripeConnect.accountId}</span> · Payout Schedule: <strong className="text-emerald-400">{celebrity.stripeConnect.payoutSchedule}</strong>
                </p>
              </div>

              <div>
                <button
                  onClick={handleTriggerPayout}
                  disabled={payoutTriggered}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{payoutTriggered ? 'Disbursing Funds...' : 'Disburse Payout Now'}</span>
                </button>
              </div>
            </div>

            {payoutTriggered && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Wire transfer of ${(celebrity.metrics.pendingPayout / 1000).toFixed(0)}K routed via Stripe Connect to artist treasury account. Transfer ID: tr_83921049281.</span>
              </div>
            )}

            {/* Split Diagram */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-[#14151F] border border-white/5">
                <div className="text-xs font-mono text-[#8C8880] uppercase">Celebrity Payout Share</div>
                <div className="text-3xl font-serif font-bold text-[#E5C378] tabular-nums mt-1">92.0%</div>
                <div className="text-xs text-[#9E9A92] mt-1">
                  Direct net revenue earned from ticket sales, private jet charters, and premium lounge add-ons.
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#14151F] border border-white/5">
                <div className="text-xs font-mono text-[#8C8880] uppercase">AURA Platform SaaS Fee</div>
                <div className="text-3xl font-serif font-bold text-white tabular-nums mt-1">8.0%</div>
                <div className="text-xs text-[#9E9A92] mt-1">
                  Covers global concierge dispatch, dedicated aviation slot reservation, SSL multi-tenant subdomains, and 4K vault hosting.
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#14151F] border border-white/5">
                <div className="text-xs font-mono text-[#8C8880] uppercase">Settlement Speed</div>
                <div className="text-3xl font-serif font-bold text-white tabular-nums mt-1">T+0 Instant</div>
                <div className="text-xs text-[#9E9A92] mt-1">
                  Automated Stripe Connect split triggers upon customer checkout confirmation.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE EVENT */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0E1018] border border-[#2A2B3D] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white mb-2">Create New Curated Salon Date</h3>
            <p className="text-xs text-[#9E9A92] mb-6">
              Published automatically to your bespoke subdomain ({celebrity.subdomain}.aura.luxury).
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#888] mb-1">Salon Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Solstice Symphony in St. Moritz"
                  className="w-full bg-[#14151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#888] mb-1">City / Region</label>
                  <input
                    type="text"
                    value={newEventCity}
                    onChange={(e) => setNewEventCity(e.target.value)}
                    placeholder="e.g. St. Moritz"
                    className="w-full bg-[#14151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#888] mb-1">Date</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g. DEC 18, 2026"
                    className="w-full bg-[#14151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#888] mb-1">Venue / Estate</label>
                <input
                  type="text"
                  value={newEventVenue}
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  placeholder="e.g. Badrutt's Palace Alpine Amphitheater"
                  className="w-full bg-[#14151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#888] mb-1">Sovereign Tier Price (USD)</label>
                <input
                  type="number"
                  value={newEventTierPrice}
                  onChange={(e) => setNewEventTierPrice(e.target.value)}
                  className="w-full bg-[#14151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-xs text-[#888] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 cursor-pointer"
                >
                  Publish to Subdomain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE GATED VAULT ITEM */}
      {showVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0E1018] border border-[#2A2B3D] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white mb-2">Publish Gated Vault Content</h3>
            <p className="text-xs text-[#9E9A92] mb-6">
              Only verified ticket holders of the required tier will be granted access.
            </p>

            <form onSubmit={handleCreateVaultItem} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#888] mb-1">Title</label>
                <input
                  type="text"
                  value={vaultTitle}
                  onChange={(e) => setVaultTitle(e.target.value)}
                  placeholder="e.g. Masterclass: Orchestral Texture in Vienna"
                  className="w-full bg-[#14151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#888] mb-1">Format Type</label>
                  <select
                    value={vaultType}
                    onChange={(e) => setVaultType(e.target.value as any)}
                    className="w-full bg-[#14151F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Masterclass 4K">Masterclass 4K</option>
                    <option value="Private Audio Vault">Private Audio Vault</option>
                    <option value="Runway Archive">Runway Archive</option>
                    <option value="Secret Drop">Secret Drop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#888] mb-1">Tier Threshold</label>
                  <select
                    value={vaultTier}
                    onChange={(e) => setVaultTier(e.target.value)}
                    className="w-full bg-[#14151F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="All Patrons">All Patrons</option>
                    <option value="Gold Tier & Above">Gold Tier & Above</option>
                    <option value="Sovereign Circle Only">Sovereign Circle Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowVaultModal(false)}
                  className="px-4 py-2 text-xs text-[#888] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 cursor-pointer"
                >
                  Publish Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
