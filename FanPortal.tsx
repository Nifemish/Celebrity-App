import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Plane,
  Building2,
  Lock,
  Play,
  Volume2,
  Check,
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight,
  Maximize2,
  X,
} from 'lucide-react';
import {
  Celebrity,
  EventShow,
  JetCharter,
  HotelPartner,
  GatedContentItem,
  TicketTier,
} from '../types';
import { ThreeCanvas } from './ThreeCanvas';
import { luxuryAudio } from './AudioEngine';

interface FanPortalProps {
  celebrity: Celebrity;
  events: EventShow[];
  jets: JetCharter[];
  hotels: HotelPartner[];
  gatedContent: GatedContentItem[];
  onSelectEventForBooking: (event: EventShow, tier?: TicketTier) => void;
}

export const FanPortal: React.FC<FanPortalProps> = ({
  celebrity,
  events,
  jets,
  hotels,
  gatedContent,
  onSelectEventForBooking,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [activeMediaItem, setActiveMediaItem] = useState<GatedContentItem | null>(null);
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState(false);

  const celebEvents = events.filter((e) => e.celebrityId === celebrity.id);
  const selectedEvent = celebEvents.find((e) => e.id === selectedEventId) || celebEvents[0] || events[0];
  const celebVault = gatedContent.filter((g) => g.celebrityId === celebrity.id);

  const handlePlayPreview = (item: GatedContentItem) => {
    luxuryAudio.playChime(523.25);
    setActiveMediaItem(item);
    setIsPlayingAudioPreview(true);
  };

  return (
    <div className="space-y-24">
      {/* SECTION 1: 3D INTERACTIVE PRIVATE JET & VIP PASS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs font-mono uppercase tracking-widest text-[#C9A86A] mb-2">
            Tactile 3D Inspection
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            The Sovereign Aviation & Pass Artifact
          </h2>
          <p className="text-sm text-[#A8A49C] mt-2 font-light">
            Every booking includes a serialized obsidian and gold NFC pass alongside certified Gulfstream G650ER private charter routing.
          </p>
        </div>

        <ThreeCanvas accentColor={celebrity.accentColor} celebrityName={celebrity.name} />
      </section>

      {/* SECTION 2: PRIVATE SALON ITINERARY & TICKETING */}
      <section id="events" className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#C9A86A] mb-2">
              Curated Itinerary
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Exclusive Salon Performances
            </h2>
            <p className="text-sm text-[#A8A49C] mt-2 font-light">
              Strictly intimate venues with fewer than 150 patrons worldwide.
            </p>
          </div>

          {/* Event Picker Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {celebEvents.map((evt) => (
              <button
                key={evt.id}
                onClick={() => {
                  luxuryAudio.playClick();
                  setSelectedEventId(evt.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedEvent?.id === evt.id
                    ? 'bg-[#1E202B] text-white border border-[#C9A86A]/40 shadow-md'
                    : 'bg-[#12131C] text-[#8C8880] hover:text-[#EDE8DF] border border-white/5'
                }`}
              >
                <span>{evt.city}</span>
                <span className="text-[#C9A86A] ml-2 font-mono">({evt.date})</span>
              </button>
            ))}
          </div>
        </div>

        {selectedEvent && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Event Hero Details & Photography */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#222433] bg-[#0E1018] group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1018] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-[#D4AF37] border border-white/10">
                  {selectedEvent.status}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C9A86A]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedEvent.date} · {selectedEvent.time}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mt-2 leading-tight">
                  {selectedEvent.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-[#8C8880] mt-2 font-light">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>{selectedEvent.venue}, {selectedEvent.city}</span>
                </div>

                <p className="text-xs text-[#A8A49C] mt-4 leading-relaxed font-light">
                  {selectedEvent.description}
                </p>

                {/* Inclusions Strip */}
                <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#EDE8DF]">
                    <Plane className="w-4 h-4 text-[#C9A86A]" />
                    <span>Private Jet Shuttle Option</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#EDE8DF]">
                    <Building2 className="w-4 h-4 text-[#C9A86A]" />
                    <span>Penthouse Suite Option</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Tiers Selection */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8C8880] mb-2">
                Available Seating Tiers & Allotments
              </div>

              {selectedEvent.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-6 rounded-2xl bg-[#0F1018] border border-[#202230] hover:border-[#C9A86A]/40 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#C9A86A] bg-[#1A1C28] px-2 py-0.5 rounded border border-[#C9A86A]/20">
                          {tier.badge}
                        </span>
                        <span className="text-xs text-[#7A7770] font-mono">
                          {tier.available} seats remaining
                        </span>
                      </div>
                      <h4 className="font-serif text-xl font-bold text-white mt-1.5">{tier.name}</h4>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-2xl font-serif font-bold text-white tabular-nums">
                        ${tier.price.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-[#8C8880] font-mono">Inclusive of VIP Host</div>
                    </div>
                  </div>

                  {/* Perks list */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A8A49C]">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[11px] text-[#7A7770]">
                      Instant Stripe Connect Split Payout · Verified NFC Token
                    </div>

                    <button
                      onClick={() => {
                        luxuryAudio.playClick();
                        onSelectEventForBooking(selectedEvent, tier);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Select Tier & Travel</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: LUXURY TRAVEL & AVIATION FLEET SPOTLIGHT */}
      <section id="aviation" className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden border border-[#222433] bg-[#0A0B10] p-8 md:p-12">
          {/* Subtle Jet Cabin Background Photo */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="/src/assets/images/luxury_jet_cabin_1792684672358.jpg"
              alt="Private Jet Interior"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B10] via-[#0A0B10]/90 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-[#C9A86A] mb-2">
              Private Aviation Add-on
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Direct Tarmac-to-Stage Transfers
            </h2>
            <p className="text-sm text-[#A8A49C] mt-3 font-light leading-relaxed">
              Eliminate commercial terminals. Fly aboard our dedicated Gulfstream G650ER or Bombardier Global 7500 charter fleet, complete with Petrossian Beluga caviar service and direct tarmac limousine escort to the maestro’s amphitheater.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#14151F]/80 border border-white/5 backdrop-blur-sm">
                <div className="text-xs font-mono text-[#8C8880]">Cruising Altitude</div>
                <div className="text-lg font-serif font-bold text-white mt-0.5">51,000 FT</div>
                <div className="text-[11px] text-[#A6A29A]">Above all weather</div>
              </div>
              <div className="p-4 rounded-xl bg-[#14151F]/80 border border-white/5 backdrop-blur-sm">
                <div className="text-xs font-mono text-[#8C8880]">FBO Boarding</div>
                <div className="text-lg font-serif font-bold text-white mt-0.5">15 Min</div>
                <div className="text-[11px] text-[#A6A29A]">Teterboro & Farnborough</div>
              </div>
              <div className="p-4 rounded-xl bg-[#14151F]/80 border border-white/5 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="text-xs font-mono text-[#8C8880]">In-Flight Dining</div>
                <div className="text-lg font-serif font-bold text-[#E5C378] mt-0.5">Michelin 3★</div>
                <div className="text-[11px] text-[#A6A29A]">Dom Pérignon 2013</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: GATED BACKSTAGE VAULT & MASTERCLASSES */}
      <section id="vault" className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#C9A86A] mb-2">
              Patron Exclusives
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Backstage 4K Vault & Audio Stems
            </h2>
            <p className="text-sm text-[#A8A49C] mt-2 font-light">
              High-fidelity recordings, orchestral masterclasses, and uncompressed Dolby Atmos master tracks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {celebVault.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#0E1018] border border-[#202230] hover:border-[#C9A86A]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-[#C9A86A] bg-[#161824] px-2.5 py-1 rounded">
                    {item.type}
                  </span>
                  <span className="text-[#888]">{item.duration}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#9E9A92] mt-2 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="text-xs font-mono text-[#8C8880]">
                  Required: <strong className="text-white">{item.tierRequired}</strong>
                </div>

                <button
                  onClick={() => handlePlayPreview(item)}
                  className="px-4 py-2 bg-[#171924] hover:bg-[#202334] text-[#EDE8DF] text-xs font-medium rounded-xl border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>Preview Transmission</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEDIA PREVIEW MODAL */}
      {activeMediaItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0E1018] border border-[#2C2E40] rounded-2xl p-6 max-w-xl w-full shadow-2xl relative">
            <button
              onClick={() => {
                setActiveMediaItem(null);
                setIsPlayingAudioPreview(false);
              }}
              className="absolute top-5 right-5 text-[#888] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-mono text-[#C9A86A] mb-1">
              PATRON MEDIA STREAM · 4K LOSSLESS
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">
              {activeMediaItem.title}
            </h3>
            <p className="text-xs text-[#9E9A92] mb-6">
              {activeMediaItem.description}
            </p>

            {/* Simulated Audio/Video Waveform Player */}
            <div className="p-6 rounded-xl bg-[#14151F] border border-white/5 text-center">
              <div className="flex items-center justify-center gap-1.5 h-16 mb-4">
                {[40, 65, 80, 45, 95, 30, 75, 90, 50, 70, 85, 35, 60, 90, 70, 40].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#C9A86A] rounded-full transition-all duration-300"
                    style={{
                      height: isPlayingAudioPreview
                        ? `${Math.max(15, Math.round(h * Math.random()))}%`
                        : `${h}%`,
                      opacity: isPlayingAudioPreview ? 1 : 0.4,
                    }}
                  />
                ))}
              </div>

              <div className="text-xs font-mono text-emerald-400 mb-4">
                ● 24-bit / 96kHz High-Resolution Master Stream Active
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    luxuryAudio.playChime(659.25);
                    setIsPlayingAudioPreview(!isPlayingAudioPreview);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  {isPlayingAudioPreview ? 'Pause Audio' : 'Resume Master Audio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
