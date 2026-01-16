// Tipos para el sistema multitenant

export type TenantPlan = 'free' | 'premium' | 'enterprise';
export type TenantStatus = 'active' | 'suspended' | 'inactive';

export interface TenantColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface TenantLocation {
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface TenantHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string; // "09:00"
  close: string; // "22:00"
  closed: boolean;
}

export interface TenantSocialNetwork {
  id: string;
  name: 'instagram' | 'facebook' | 'x' | 'tiktok';
  url: string;
  icon: string;
}

// ═══════════════════════════════════════════════════════════
// Tipos para Contenido de la Web (Nuevo Sistema)
// ═══════════════════════════════════════════════════════════

export interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export interface FeatureItem {
  id: string;
  image: string;
  title: string;
  description: string;
  order: number;
}

export interface CTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface HomeContent {
  hero: HeroData;
  features: FeatureItem[];
  ctaSection: CTASection;
}

export interface AboutMain {
  title: string;
  description: string; // HTML
  image: string;
  imageAlt: string;
}

export interface ValueItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface ValuesSection {
  title: string;
  items: ValueItem[];
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  order: number;
}

export interface GallerySection {
  enabled: boolean;
  title: string;
  images: GalleryImage[];
}

export interface AboutContent {
  main: AboutMain;
  values: ValuesSection;
  gallery: GallerySection;
}

export interface WebContent {
  home: HomeContent;
  about: AboutContent;
}

// ═══════════════════════════════════════════════════════════
// Tipos existentes...
// ═══════════════════════════════════════════════════════════

export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  description: string;
  order: number;
}

export interface HomePageHero {
  image?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  overlayOpacity?: number;
}

export interface HomePageFeatures {
  enabled?: boolean;
  sectionTitle?: string;
  sectionSubtitle?: string;
  items?: CarouselItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export interface HomePageStory {
  enabled?: boolean;
  image?: string;
  badge?: string;
  title?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface HomePage {
  hero?: HomePageHero;
  features?: HomePageFeatures;
  story?: HomePageStory;
}

export interface AboutPageHeader {
  title?: string;
  subtitle?: string;
}

export interface AboutPageSection {
  enabled?: boolean;
  image?: string;
  title?: string;
  content?: string;
}

export interface AboutPage {
  header?: AboutPageHeader;
  history?: AboutPageSection;
  philosophy?: AboutPageSection;
  team?: AboutPageSection;
}

export interface TenantSettings {
  // Branding
  colors?: TenantColors;
  logo?: string;
  favicon?: string;
  font?: string;
  heroBanner?: string;

  // Contact
  phone?: string;
  email?: string;
  whatsapp?: string;

  // Location
  location?: TenantLocation;
  hours?: TenantHours[];

  // Social Media
  socialNetworks?: TenantSocialNetwork[];

  // Content
  slogan?: string;
  description?: string;
  longDescription?: string;
  history?: string;
  gallery?: string[];
  capacity?: number;
  foundedYear?: number;
  footerText?: string;

  // Features
  enableOrders?: boolean;
  enableReservations?: boolean;
  enableDelivery?: boolean;
  deliveryFee?: number;
  minOrderAmount?: number;

  // Website Pages Content
  homePage?: HomePage;
  aboutPage?: AboutPage;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  customDomain?: string;
  email: string;
  plan: TenantPlan;
  status: TenantStatus;
  settings: TenantSettings;
  webContent?: WebContent; // Nuevo contenido de la web
  createdAt: string;
  updatedAt: string;

  // Stats (solo para SuperAdmin)
  _count?: {
    users: number;
    dishes: number;
    categories: number;
    orders: number;
  };
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  email: string;
  domain?: string;
  plan: TenantPlan;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  settings?: Partial<TenantSettings>;
}

export interface UpdateTenantInput {
  name?: string;
  email?: string;
  domain?: string;
  customDomain?: string;
  plan?: TenantPlan;
  status?: TenantStatus;
  settings?: Partial<TenantSettings>;
}

export interface TenantStats {
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  activeDishes: number;
  activeCategories: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  popularDishes: Array<{
    id: string;
    name: string;
    orderCount: number;
  }>;
}

