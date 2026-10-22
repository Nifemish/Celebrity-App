export type UserViewRole = 'fan' | 'celebrity' | 'admin';

export interface Celebrity {
  id: string;
  subdomain: string;
  subdomainFull: string;
  name: string;
  title: string;
  category: 'Symphonic Music' | 'Haute Couture' | 'Motorsport & Athletics';
  bio: string;
  avatar: string;
  heroImage: string;
  accentColor: string;
  accentSecondary: string;
  metrics: {
    patronsCount: string;
    eventsCount: number;
    flightHours: number;
    gmvTotal: number;
    pendingPayout: number;
  };
  customDomainConfig: {
    verified: boolean;
    sslActive: boolean;
    cname: string;
  };
  stripeConnect: {
    accountId: string;
    status: 'Active' | 'Restricted' | 'Under Review';
    payoutSchedule: 'Instant' | 'Weekly (Mon)';
    saasPlatformFeePercent: number; // e.g. 8%
  };
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  available: number;
  total: number;
  badge: string;
}

export interface EventShow {
  id: string;
  celebrityId: string;
  title: string;
  city: string;
  country: string;
  venue: string;
  date: string;
  time: string;
  image: string;
  description: string;
  tiers: TicketTier[];
  privateJetShuttleAvailable: boolean;
  hotelPackageAvailable: boolean;
  status: 'Upcoming' | 'Sold Out' | 'Presale';
}

export interface JetCharter {
  id: string;
  model: string;
  manufacturer: string;
  tailNumber: string;
  rangeKm: string;
  cruiseSpeedKnots: number;
  capacityPax: number;
  hourlyRateUsd: number;
  defaultOriginFbo: string;
  defaultDestFbo: string;
  cateringMenu: string[];
  status: 'Available on Apron' | 'In Flight' | 'Chartered';
  features: string[];
}

export interface HotelPartner {
  id: string;
  name: string;
  city: string;
  suiteName: string;
  nightlyRateUsd: number;
  perks: string[];
  roomSqFt: number;
  view: string;
  status: 'Available' | 'Reserved';
}

export interface GatedContentItem {
  id: string;
  celebrityId: string;
  title: string;
  type: 'Masterclass 4K' | 'Private Audio Vault' | 'Runway Archive' | 'Secret Drop';
  duration: string;
  tierRequired: string;
  unlockedCount: number;
  description: string;
  status: 'Approved' | 'Pending Review' | 'Flagged';
  moderationScore: number; // 0-100% compliance
  previewMediaSnippet?: string;
  publishedAt: string;
}

export interface BroadcastMessage {
  id: string;
  celebrityId: string;
  title: string;
  body: string;
  channel: 'VIP Concierge SMS' | 'Direct App Push' | 'Encrypted Dispatch';
  audienceSegment: 'All Patrons' | 'Gold Tier & Above' | 'Sovereign Circle Only';
  sentAt: string;
  deliveredCount: number;
  openRate: string;
}

export interface BookingOrder {
  id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  celebrityId: string;
  eventId: string;
  eventTitle: string;
  tierName: string;
  ticketPrice: number;
  jetCharterIncluded: boolean;
  jetCharterPrice: number;
  hotelIncluded: boolean;
  hotelPrice: number;
  subtotal: number;
  saasFee: number; // 8%
  celebrityPayout: number; // 92%
  stripeChargeId: string;
  status: 'Paid' | 'Processing' | 'Escrow';
  createdAt: string;
  qrPayload: string;
}

export interface PlatformMetrics {
  totalGmv: number;
  totalPlatformRevenue: number;
  activeCelebrities: number;
  totalBookings: number;
  stripeEscrowHeld: number;
  celebrityPayoutVolume: number;
}
