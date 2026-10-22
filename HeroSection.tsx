import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Compass, Shield, Award, Sparkles } from 'lucide-react';
import { Celebrity } from '../types';
import { luxuryAudio } from './AudioEngine';

interface HeroSectionProps {
  celebrity: Celebrity;
  onExploreEvents: () => void;
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  celebrity,
  onExploreEvents,
  onOpenBooking,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  // GSAP Power4.out Entrance & Liquid reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      });

      gsap.from(subheadRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.0,
        delay: 0.2,
        ease: 'power4.out',
      });

      gsap.from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.35,
        ease: 'power4.out',
      });

      gsap.from(imageCardRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 1.4,
        delay: 0.1,
        ease: 'power4.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [celebrity.id]);

  // Mouse-follow Parallax on hero image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageCardRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const offsetX = (clientX / innerWidth - 0.5) * 16;
    const offsetY = (clientY / innerHeight - 0.5) * 16;

    gsap.to(imageCardRef.current, {
      x: offsetX,
      y: offsetY,
      rotationY: offsetX * 0.4,
      rotationX: -offsetY * 0.4,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!imageCardRef.current) return;
    gsap.to(imageCardRef.current, {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      duration: 1.0,
      ease: 'power3.out',
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 px-6 overflow-hidden"
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none rounded-full blur-[140px] opacity-25"
        style={{
          background: `radial-gradient(circle, ${celebrity.accentColor} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Editorial Typography & Claims */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#A8A49C] mb-4">
            <span className="text-[#D4AF37] tracking-wider uppercase">{celebrity.category}</span>
            <span aria-hidden="true" className="text-[#555]">·</span>
            <span>Bespoke Subdomain Node</span>
            <span aria-hidden="true" className="text-[#555]">·</span>
            <span className="text-white/80">Tier 1 Sovereign Access</span>
          </div>

          {/* High-Contrast Luxury Serif Headline with text-wrap balance */}
          <h1
            ref={headlineRef}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7F2] leading-[1.1] mb-6"
            style={{ textWrap: 'balance' }}
          >
            The Private World of <br />
            <span className="text-gold-gradient italic">{celebrity.name}</span>
          </h1>

          {/* Subhead Prose */}
          <p
            ref={subheadRef}
            className="text-base sm:text-lg text-[#B5B0A6] leading-relaxed max-w-2xl mb-8 font-light"
          >
            {celebrity.bio} An integrated architecture uniting bespoke amphitheater recitals, Gulfstream private charters, and presidential penthouse suites in a single seamless itinerary.
          </p>

          {/* Call to Actions */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                luxuryAudio.playClick();
                onOpenBooking();
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-[#F9E7BA] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-xl hover:shadow-[#D4AF37]/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Curate VIP Reservation</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                luxuryAudio.playClick();
                onExploreEvents();
              }}
              className="px-6 py-3.5 bg-[#14151E] hover:bg-[#1D1F2C] text-[#EDE8DF] font-medium text-xs uppercase tracking-widest rounded-xl border border-white/10 hover:border-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#C9A86A]" />
              <span>Explore Itinerary & Tiers</span>
            </button>
          </div>

          {/* Claim-to-Proof Quantitative Adjacency Bar (Clean unboxed metrics) */}
          <div className="mt-12 pt-8 border-t border-[#1C1D26] grid grid-cols-3 gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#7A7770] font-mono">
                Patron Circle
              </div>
              <div className="text-2xl font-serif font-bold text-white tabular-nums mt-1">
                {celebrity.metrics.patronsCount}
              </div>
              <div className="text-[11px] text-[#9A968E] mt-0.5">Strictly verified patrons</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#7A7770] font-mono">
                Charter Flown
              </div>
              <div className="text-2xl font-serif font-bold text-[#E5C378] tabular-nums mt-1">
                {celebrity.metrics.flightHours}h
              </div>
              <div className="text-[11px] text-[#9A968E] mt-0.5">FBO verified log</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#7A7770] font-mono">
                Stripe Split
              </div>
              <div className="text-2xl font-serif font-bold text-white tabular-nums mt-1">
                92% / 8%
              </div>
              <div className="text-[11px] text-[#9A968E] mt-0.5">Direct artist payout</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Asset with 3D Parallax Tilt */}
        <div className="lg:col-span-5 flex justify-center perspective-1000">
          <div
            ref={imageCardRef}
            className="relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform-style-preserve-3d group"
          >
            {/* High-fidelity generated portrait */}
            <img
              src={celebrity.heroImage}
              alt={celebrity.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />

            {/* Cinematic contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

            {/* Bespoke Seal Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 text-[11px] text-[#E5C378] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AURA VERIFIED</span>
            </div>

            {/* Bottom Card Identity Plate */}
            <div className="absolute bottom-5 left-5 right-5 text-left">
              <div className="text-[11px] uppercase tracking-wider text-[#C9A86A] font-mono mb-1">
                {celebrity.title}
              </div>
              <div className="text-xl font-serif font-bold text-white leading-snug">
                {celebrity.name}
              </div>
              <div className="text-xs text-[#A8A49C] mt-1 flex items-center gap-2">
                <span>Next Show: Verona Solstice</span>
                <span className="text-[#C9A86A]">·</span>
                <span className="font-mono text-white">Oct 28</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
