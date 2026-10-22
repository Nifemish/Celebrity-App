import React from 'react';
import { Volume2, VolumeX, ShieldCheck, UserCheck, LayoutDashboard, Download } from 'lucide-react';
import { Celebrity, UserViewRole } from '../types';
import { luxuryAudio } from './AudioEngine';

interface NavbarProps {
  currentRole: UserViewRole;
  onRoleChange: (role: UserViewRole) => void;
  celebrities: Celebrity[];
  activeCelebrity: Celebrity;
  onSelectCelebrity: (celeb: Celebrity) => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  celebrities,
  activeCelebrity,
  onSelectCelebrity,
  isAudioMuted,
  onToggleAudio,
  onOpenBooking,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#08080A]/90 border-b border-[#1F2029] backdrop-blur-md">
      {/* Strict 1-Row 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onRoleChange('fan');
            }}
            className="font-display text-xl font-bold tracking-widest text-white hover:text-[#D4AF37] transition-colors whitespace-nowrap"
          >
            AURA <span className="text-[#C9A86A] font-light">PRIVÉ</span>
          </a>
          <span className="hidden sm:inline-block text-[11px] font-mono text-[#8C8880] px-2 py-0.5 rounded bg-[#13141C] border border-white/5">
            {activeCelebrity.subdomainFull}
          </span>
        </div>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider text-[#9E9A92] font-medium">
          <a
            href="#events"
            onClick={() => onRoleChange('fan')}
            className={`hover:text-white transition-colors whitespace-nowrap ${currentRole === 'fan' ? 'text-white border-b border-[#C9A86A] pb-1' : ''}`}
          >
            Private Salons
          </a>
          <a
            href="#aviation"
            onClick={() => onRoleChange('fan')}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Aviation Fleet
          </a>
          <a
            href="#vault"
            onClick={() => onRoleChange('fan')}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Backstage Vault
          </a>
          <button
            onClick={() => {
              luxuryAudio.playClick();
              onRoleChange('celebrity');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${currentRole === 'celebrity' ? 'text-[#D4AF37] border-b border-[#C9A86A] pb-1' : ''}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Celebrity Dashboard</span>
          </button>
          <button
            onClick={() => {
              luxuryAudio.playClick();
              onRoleChange('admin');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${currentRole === 'admin' ? 'text-[#D4AF37] border-b border-[#C9A86A] pb-1' : ''}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SaaS Admin Console</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Subtle Audio Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Enable procedural audio' : 'Mute procedural audio'}
            className="p-2 rounded-lg bg-[#14151E] hover:bg-[#1E202B] text-[#A6A29A] hover:text-[#D4AF37] transition-colors border border-white/5 cursor-pointer"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
          </button>

          {/* Celebrity Subdomain Quick Switcher */}
          <div className="relative hidden md:block">
            <select
              value={activeCelebrity.id}
              onChange={(e) => {
                const found = celebrities.find((c) => c.id === e.target.value);
                if (found) {
                  luxuryAudio.playWhoosh();
                  onSelectCelebrity(found);
                }
              }}
              className="bg-[#12131C] text-xs text-[#EDE8DF] px-3 py-2 rounded-lg border border-white/10 hover:border-[#C9A86A]/40 transition-colors cursor-pointer appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-[#C9A86A]"
            >
              {celebrities.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#12131C] text-white">
                  {c.name} ({c.subdomain}.aura)
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-[#888]">
              ▼
            </span>
          </div>

          {/* Download Source Zip */}
          <a
            href="/aura-prive-luxury-saas.zip"
            download="aura-prive-luxury-saas.zip"
            title="Download complete app project as .zip"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-[#D4AF37] bg-[#14151E] hover:bg-[#1E202B] rounded-lg border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .ZIP</span>
          </a>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              luxuryAudio.playClick();
              onOpenBooking();
            }}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#F5DEB3] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-[#D4AF37]/20 whitespace-nowrap cursor-pointer"
          >
            Reserve VIP Pass
          </button>
        </div>
      </div>

      {/* Subdomain Notice Strip on Mobile */}
      <div className="md:hidden px-6 py-2 bg-[#0E0F15] border-t border-white/5 flex items-center justify-between text-xs">
        <span className="font-mono text-[#8C8880] truncate">{activeCelebrity.subdomainFull}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRoleChange('celebrity')}
            className={`px-2 py-1 rounded text-[11px] ${currentRole === 'celebrity' ? 'bg-[#C9A86A] text-black font-semibold' : 'text-[#8C8880]'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`px-2 py-1 rounded text-[11px] ${currentRole === 'admin' ? 'bg-[#C9A86A] text-black font-semibold' : 'text-[#8C8880]'}`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
