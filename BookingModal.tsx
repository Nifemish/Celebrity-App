import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ChevronRight,
  Plane,
  Building2,
  ShieldCheck,
  CreditCard,
  QrCode,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  Celebrity,
  EventShow,
  TicketTier,
  JetCharter,
  HotelPartner,
  BookingOrder,
} from '../types';
import { luxuryAudio } from './AudioEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  celebrity: Celebrity;
  event: EventShow;
  selectedTier?: TicketTier;
  jets: JetCharter[];
  hotels: HotelPartner[];
  onCompleteBooking: (order: BookingOrder) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  celebrity,
  event,
  selectedTier,
  jets,
  hotels,
  onCompleteBooking,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [activeTier, setActiveTier] = useState<TicketTier>(
    selectedTier || event.tiers[0]
  );
  const [includeJet, setIncludeJet] = useState<boolean>(false);
  const [selectedJet, setSelectedJet] = useState<JetCharter>(jets[0]);
  const [includeHotel, setIncludeHotel] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelPartner>(hotels[0]);

  // Customer form inputs
  const [patronName, setPatronName] = useState('Lord Sterling Vance');
  const [patronEmail, setPatronEmail] = useState('s.vance@patron-heritage.com');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<BookingOrder | null>(null);

  if (!isOpen) return null;

  // Financial calculations
  const ticketPrice = activeTier.price;
  const jetPrice = includeJet ? selectedJet.hourlyRateUsd : 0;
  const hotelPrice = includeHotel ? selectedHotel.nightlyRateUsd : 0;
  const totalAmount = ticketPrice + jetPrice + hotelPrice;
  const platformFee = Math.round(totalAmount * 0.08); // 8% SaaS fee
  const celebrityPayout = totalAmount - platformFee; // 92% artist share

  const handlePayWithStripe = () => {
    luxuryAudio.playChime(659.25);
    setIsProcessingPayment(true);

    setTimeout(() => {
      const order: BookingOrder = {
        id: `ord-${Date.now()}`,
        bookingRef: `AURA-${event.city.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: patronName,
        customerEmail: patronEmail,
        celebrityId: celebrity.id,
        eventId: event.id,
        eventTitle: event.title,
        tierName: activeTier.name,
        ticketPrice,
        jetCharterIncluded: includeJet,
        jetCharterPrice: jetPrice,
        hotelIncluded: includeHotel,
        hotelPrice,
        subtotal: totalAmount,
        saasFee: platformFee,
        celebrityPayout,
        stripeChargeId: `ch_3P${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'Paid',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        qrPayload: `AURA-PRIVÉ-PASS-${event.city.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      };

      setCompletedOrder(order);
      setIsProcessingPayment(false);
      setCurrentStep(4);
      onCompleteBooking(order);

      // Luxury Gold confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F9E7BA', '#FFFFFF', '#C9A86A'],
        });
      } catch {
        // safe
      }
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0C0D14] border border-[#2B2D3E] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            luxuryAudio.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 text-[#888] hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Breadcrumb Steps */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#8C8880] mb-6">
          <span className={currentStep >= 1 ? 'text-[#C9A86A]' : ''}>1. Tier Selection</span>
          <span>➔</span>
          <span className={currentStep >= 2 ? 'text-[#C9A86A]' : ''}>2. Luxury Travel</span>
          <span>➔</span>
          <span className={currentStep >= 3 ? 'text-[#C9A86A]' : ''}>3. Stripe Checkout</span>
          <span>➔</span>
          <span className={currentStep === 4 ? 'text-emerald-400' : ''}>4. VIP Pass</span>
        </div>

        {/* STEP 1: TIER SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-[#C9A86A]">STAGE I OF III</div>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Select Your Salon Tier
              </h3>
              <p className="text-xs text-[#9E9A92] mt-1">
                {event.title} · {event.city} ({event.date})
              </p>
            </div>

            <div className="space-y-3">
              {event.tiers.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    luxuryAudio.playClick();
                    setActiveTier(t);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeTier.id === t.id
                      ? 'bg-[#151722] border-[#C9A86A] shadow-lg'
                      : 'bg-[#0F1018] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#C9A86A]">{t.badge}</span>
                      <span className="text-xs text-[#888]">({t.available} seats left)</span>
                    </div>
                    <div className="text-base font-semibold text-white mt-1">{t.name}</div>
                    <div className="text-xs text-[#A8A49C] mt-0.5">{t.perks[0]}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-serif font-bold text-white tabular-nums">
                      ${t.price.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-[#8C8880]">USD</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  luxuryAudio.playClick();
                  setCurrentStep(2);
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Continue to Travel & Lodging</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TRAVEL & LODGING ADD-ONS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-[#C9A86A]">STAGE II OF III</div>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Luxury Aviation & Penthouse
              </h3>
              <p className="text-xs text-[#9E9A92] mt-1">
                Seamless itinerary additions coordinated directly with the artist’s concierge.
              </p>
            </div>

            {/* Jet Shuttle Option */}
            <div
              onClick={() => {
                luxuryAudio.playClick();
                setIncludeJet(!includeJet);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                includeJet
                  ? 'bg-[#151722] border-[#C9A86A]'
                  : 'bg-[#0F1018] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${includeJet ? 'bg-[#C9A86A] text-black' : 'bg-[#1C1E2B] text-[#C9A86A]'}`}>
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Private Jet Charter Shuttle</h4>
                    <p className="text-xs text-[#9E9A92] mt-0.5">{selectedJet.model} · Ramp Tarmac Transfer</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-serif font-bold text-white tabular-nums">
                    +${selectedJet.hourlyRateUsd.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-[#C9A86A]">
                    {includeJet ? '✓ Selected' : '+ Add to Itinerary'}
                  </div>
                </div>
              </div>
            </div>

            {/* Penthouse Suite Option */}
            <div
              onClick={() => {
                luxuryAudio.playClick();
                setIncludeHotel(!includeHotel);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                includeHotel
                  ? 'bg-[#151722] border-[#C9A86A]'
                  : 'bg-[#0F1018] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${includeHotel ? 'bg-[#C9A86A] text-black' : 'bg-[#1C1E2B] text-[#C9A86A]'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{selectedHotel.name}</h4>
                    <p className="text-xs text-[#9E9A92] mt-0.5">{selectedHotel.suiteName} · Butler Service</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-serif font-bold text-white tabular-nums">
                    +${selectedHotel.nightlyRateUsd.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-[#C9A86A]">
                    {includeHotel ? '✓ Selected' : '+ Add to Itinerary'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-[#888] hover:text-white cursor-pointer"
              >
                Back to Tiers
              </button>
              <button
                onClick={() => {
                  luxuryAudio.playClick();
                  setCurrentStep(3);
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Stripe Checkout</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: STRIPE CONNECT CHECKOUT & SPLIT BREAKDOWN */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-[#C9A86A]">STAGE III OF III</div>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Stripe Connect Split Ledger
              </h3>
              <p className="text-xs text-[#9E9A92] mt-1">
                Transparent revenue split breakdown between {celebrity.name} (92%) and AURA Platform (8%).
              </p>
            </div>

            {/* Split Breakdown Ledger Box */}
            <div className="p-5 rounded-2xl bg-[#090A0E] border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between text-[#B5B0A6]">
                <span>1× {activeTier.name} Ticket</span>
                <span className="font-mono text-white tabular-nums">${ticketPrice.toLocaleString()}</span>
              </div>
              {includeJet && (
                <div className="flex justify-between text-[#B5B0A6]">
                  <span>Private Jet Shuttle ({selectedJet.model})</span>
                  <span className="font-mono text-white tabular-nums">+${jetPrice.toLocaleString()}</span>
                </div>
              )}
              {includeHotel && (
                <div className="flex justify-between text-[#B5B0A6]">
                  <span>Presidential Penthouse ({selectedHotel.name})</span>
                  <span className="font-mono text-white tabular-nums">+${hotelPrice.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                <span>Total Amount Due</span>
                <span className="font-mono text-[#D4AF37] tabular-nums">${totalAmount.toLocaleString()} USD</span>
              </div>

              {/* Stripe Connect Split Visualization */}
              <div className="mt-4 pt-3 border-t border-dashed border-white/10 grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-[#14151F] border border-white/5">
                  <div className="text-[#8C8880]">Artist Net Share (92%)</div>
                  <div className="text-white font-bold text-sm mt-0.5">${celebrityPayout.toLocaleString()}</div>
                  <div className="text-[#666] text-[10px]">Direct to {celebrity.stripeConnect.accountId}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#14151F] border border-white/5">
                  <div className="text-[#8C8880]">AURA SaaS Fee (8%)</div>
                  <div className="text-[#C9A86A] font-bold text-sm mt-0.5">${platformFee.toLocaleString()}</div>
                  <div className="text-[#666] text-[10px]">Platform escrow & hosting</div>
                </div>
              </div>
            </div>

            {/* Patron Credentials */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[#888] mb-1">Patron Full Name</label>
                <input
                  type="text"
                  value={patronName}
                  onChange={(e) => setPatronName(e.target.value)}
                  className="w-full bg-[#14151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#888] mb-1">Private Dispatch Email</label>
                <input
                  type="email"
                  value={patronEmail}
                  onChange={(e) => setPatronEmail(e.target.value)}
                  className="w-full bg-[#14151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-[#888] hover:text-white cursor-pointer"
              >
                Back to Travel
              </button>

              <button
                onClick={handlePayWithStripe}
                disabled={isProcessingPayment}
                className="px-6 py-3 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {isProcessingPayment ? 'Authorizing Split on Stripe...' : `Pay $${totalAmount.toLocaleString()} via Stripe`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: VIP PASS GENERATION */}
        {currentStep === 4 && completedOrder && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#C9A86A]">
                RESERVATION RATIFIED & SPLIT ROUTED
              </div>
              <h3 className="font-serif text-3xl font-bold text-white mt-1">
                Your Sovereign Pass is Active
              </h3>
              <p className="text-xs text-[#9E9A92] mt-1">
                Ref: <span className="font-mono text-white">{completedOrder.bookingRef}</span> · Stripe Charge: {completedOrder.stripeChargeId}
              </p>
            </div>

            {/* Generated Golden NFC Pass Card */}
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#1C1E2B] via-[#0E1018] to-[#08080C] border border-[#C9A86A]/40 shadow-2xl text-left relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-[#D4AF37]">
                <span>AURA PRIVÉ MONOGRAM PASS</span>
                <span>NFC VERIFIED</span>
              </div>

              <div className="mt-4">
                <div className="text-xs uppercase text-[#888] font-mono">Patron</div>
                <div className="text-lg font-serif font-bold text-white">{completedOrder.customerName}</div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[#888] font-mono text-[10px]">EVENT</div>
                  <div className="text-white font-medium truncate">{event.city} Solstice</div>
                </div>
                <div>
                  <div className="text-[#888] font-mono text-[10px]">TIER</div>
                  <div className="text-[#D4AF37] font-semibold">{completedOrder.tierName}</div>
                </div>
              </div>

              {completedOrder.jetCharterIncluded && (
                <div className="mt-3 pt-2 border-t border-white/10 text-xs text-white flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>Gulfstream Private Shuttle Included</span>
                </div>
              )}

              {/* Simulated QR Code Bar */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-[10px] font-mono text-[#777] break-all max-w-[200px]">
                  {completedOrder.qrPayload}
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <QrCode className="w-10 h-10 text-black" />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                luxuryAudio.playClick();
                onClose();
              }}
              className="px-8 py-3 bg-[#181926] hover:bg-[#222435] text-white text-xs font-medium uppercase tracking-wider rounded-xl border border-white/10 cursor-pointer"
            >
              Return to Subdomain Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
