/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MOCK_CELEBRITIES,
  MOCK_EVENTS,
  MOCK_JETS,
  MOCK_HOTELS,
  MOCK_GATED_CONTENT,
  MOCK_BROADCASTS,
  MOCK_BOOKING_ORDERS,
  MOCK_PLATFORM_METRICS,
} from './data/mockData';
import {
  Celebrity,
  EventShow,
  TicketTier,
  GatedContentItem,
  BroadcastMessage,
  BookingOrder,
  UserViewRole,
  PlatformMetrics,
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FanPortal } from './components/FanPortal';
import { CelebrityDashboard } from './components/CelebrityDashboard';
import { AdminPanel } from './components/AdminPanel';
import { BookingModal } from './components/BookingModal';
import { CustomCursor } from './components/CustomCursor';
import { LuxuryLoader } from './components/LuxuryLoader';
import { luxuryAudio } from './components/AudioEngine';

export default function App() {
  const [celebrities] = useState<Celebrity[]>(MOCK_CELEBRITIES);
  const [activeCelebrity, setActiveCelebrity] = useState<Celebrity>(MOCK_CELEBRITIES[0]);
  const [currentRole, setCurrentRole] = useState<UserViewRole>('fan');

  // Application State
  const [events, setEvents] = useState<EventShow[]>(MOCK_EVENTS);
  const [jets] = useState(MOCK_JETS);
  const [hotels] = useState(MOCK_HOTELS);
  const [gatedContent, setGatedContent] = useState<GatedContentItem[]>(MOCK_GATED_CONTENT);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(MOCK_BROADCASTS);
  const [orders, setOrders] = useState<BookingOrder[]>(MOCK_BOOKING_ORDERS);
  const [metrics, setMetrics] = useState<PlatformMetrics>(MOCK_PLATFORM_METRICS);

  // Audio mute state
  const [isAudioMuted, setIsAudioMuted] = useState(luxuryAudio.isMuted);

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<EventShow | null>(null);
  const [selectedTierForBooking, setSelectedTierForBooking] = useState<TicketTier | undefined>(undefined);

  const handleToggleAudio = () => {
    const muted = luxuryAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleSelectCelebrity = (celeb: Celebrity) => {
    setActiveCelebrity(celeb);
  };

  const handleOpenBooking = (event?: EventShow, tier?: TicketTier) => {
    const targetEvent = event || events.find((e) => e.celebrityId === activeCelebrity.id) || events[0];
    setSelectedEventForBooking(targetEvent);
    setSelectedTierForBooking(tier || targetEvent.tiers[0]);
    setIsBookingOpen(true);
  };

  const handleCompleteBooking = (newOrder: BookingOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Update Platform Metrics
    setMetrics((prev) => ({
      ...prev,
      totalGmv: prev.totalGmv + newOrder.subtotal,
      totalPlatformRevenue: prev.totalPlatformRevenue + newOrder.saasFee,
      totalBookings: prev.totalBookings + 1,
      celebrityPayoutVolume: prev.celebrityPayoutVolume + newOrder.celebrityPayout,
    }));
  };

  const handleAddEvent = (newEvent: EventShow) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleSendBroadcast = (newMsg: BroadcastMessage) => {
    setBroadcasts((prev) => [newMsg, ...prev]);
  };

  const handleAddGatedContent = (item: GatedContentItem) => {
    setGatedContent((prev) => [item, ...prev]);
  };

  const handleApproveItem = (id: string) => {
    setGatedContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' as const } : item))
    );
  };

  const handleFlagItem = (id: string) => {
    setGatedContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Flagged' as const } : item))
    );
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#EDE8DF] selection:bg-[#C9A86A] selection:text-black font-sans relative">
      {/* Animated Monogram Loading Screen */}
      <LuxuryLoader brandName="AURA PRIVÉ" />

      {/* Smooth Magnetic Custom Cursor */}
      <CustomCursor />

      {/* Primary Top Bar (Strict 1-Row 3-Zone Contract) */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        celebrities={celebrities}
        activeCelebrity={activeCelebrity}
        onSelectCelebrity={handleSelectCelebrity}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Viewport Routing */}
      <main className="relative z-10 pb-20">
        {currentRole === 'fan' && (
          <>
            {/* Cinematic Editorial Hero Section */}
            <HeroSection
              celebrity={activeCelebrity}
              onExploreEvents={() => {
                const el = document.getElementById('events');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenBooking={() => handleOpenBooking()}
            />

            {/* Fan Experience: 3D Visualizer, Salon Itinerary, Aviation Fleet, Gated Vault */}
            <FanPortal
              celebrity={activeCelebrity}
              events={events}
              jets={jets}
              hotels={hotels}
              gatedContent={gatedContent}
              onSelectEventForBooking={(event, tier) => handleOpenBooking(event, tier)}
            />
          </>
        )}

        {currentRole === 'celebrity' && (
          <CelebrityDashboard
            celebrity={activeCelebrity}
            events={events}
            jets={jets}
            hotels={hotels}
            gatedContent={gatedContent}
            broadcasts={broadcasts}
            onAddEvent={handleAddEvent}
            onSendBroadcast={handleSendBroadcast}
            onAddGatedContent={handleAddGatedContent}
          />
        )}

        {currentRole === 'admin' && (
          <AdminPanel
            metrics={metrics}
            celebrities={celebrities}
            gatedItems={gatedContent}
            recentOrders={orders}
            onApproveItem={handleApproveItem}
            onFlagItem={handleFlagItem}
          />
        )}
      </main>

      {/* Interactive Step-by-Step Booking & Travel Modal */}
      {selectedEventForBooking && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          celebrity={activeCelebrity}
          event={selectedEventForBooking}
          selectedTier={selectedTierForBooking}
          jets={jets}
          hotels={hotels}
          onCompleteBooking={handleCompleteBooking}
        />
      )}

      {/* Quiet Luxury Footer */}
      <footer className="border-t border-[#191A24] bg-[#050608] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#7A7770]">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold tracking-widest text-white">AURA PRIVÉ</span>
            <span>·</span>
            <span>Multi-Tenant Celebrity Concierge & Aviation SaaS</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <a
              href="/aura-prive-luxury-saas.zip"
              download="aura-prive-luxury-saas.zip"
              className="text-[#C9A86A] hover:text-[#F5DEB3] underline flex items-center gap-1 font-semibold"
            >
              <span>Download Project .ZIP Archive</span>
            </a>
            <span>·</span>
            <span>Stripe Connect Split Engine</span>
            <span>·</span>
            <span>FAA Part 135 Compliant</span>
          </div>

          <div className="text-[11px] font-mono">
            © 2026 AURA TECHNOLOGIES GROUP. ALL PRIVILEGES RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
