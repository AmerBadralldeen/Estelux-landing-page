import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MessageCircle,
  Globe,
  Plane,
  Building2,
  CalendarCheck,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  LayoutDashboard,
  Lock,
  Search,
  Download,
  Trash2,
  Plus,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Inbox,
  Check,
  Edit3,
  LogOut,
  Users,
  Clock,
  CheckSquare,
  FileText,
  KeyRound,
  ShieldCheck,
  Award,
  Star,
  Stethoscope,
  HeartHandshake,
  BadgeCheck,
  Menu
} from 'lucide-react';

/**
 * ESTELUX Istanbul — High-Converting Bilingual Dental Aesthetics & Medical Tourism Landing Page
 * + Live Bilingual Coordinator Dashboard (Consultation Leads Inbox & Media/Gallery Manager)
 */

type Language = 'en' | 'ar';
type ViewMode = 'landing' | 'login' | 'admin';
type AdminTab = 'leads' | 'media';
type LeadStatus = 'new' | 'contacted' | 'booked' | 'archived';

interface DentalCase {
  id: string;
  src: string;
  category: 'hollywood' | 'cosmetic';
  titleEn: string;
  titleAr: string;
  tagEn: string;
  tagAr: string;
  captionEn: string;
  captionAr: string;
  specsEn?: string;
  specsAr?: string;
  visible: boolean;
}

interface ConsultationLead {
  id: string;
  fullName: string;
  countryCode: string;
  phone: string;
  country: string;
  email: string;
  serviceValue: string;
  timeline?: string;
  message: string;
  status: LeadStatus;
  adminNotes: string;
  createdAt: string;
  langSubmitted: Language;
}

const WHATSAPP_DISPLAY = '+90 544 455 5513';
const WHATSAPP_RAW = '905444555513';
const ENV_ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN || '').trim();

const STORAGE_KEYS = {
  leads: 'estelux_consultation_leads_v1',
  cases: 'estelux_dental_cases_v4',
  logo: 'estelux_brand_logo_v4',
  heroPhoto: 'estelux_hero_photo_v4',
  adminPin: 'estelux_admin_pin_v1',
  adminSession: 'estelux_admin_auth_session_v1',
};

const DEFAULT_ASSETS = {
  logo: '/estelux-logo.png',
  case1: '/case-hollywood-2.jpg',
  case2: '/case-cosmetic-1.jpg',
  case3: '/case-hollywood-1.jpg',
  case4: '/case-cosmetic-2.jpg',
  case5: '/case-cosmetic-3.jpg',
  heroDental: '/case-hollywood-2.jpg',
};

const BROKEN_LEGACY_FILES = new Set([
  'Logo Colored.jpg',
  '/estelux-logo.svg',
  'photo_6028350293931659414_y.jpg',
  'photo_6028350293931659415_y.jpg',
  'photo_6028350293931659416_y.jpg',
  'photo_6028350293931659417_y.jpg',
]);

const INITIAL_CASES: DentalCase[] = [
  {
    id: 'case-1',
    src: DEFAULT_ASSETS.case1,
    category: 'hollywood',
    titleEn: 'Hollywood Smile — Natural Arch Restoration',
    titleAr: 'هوليوود سمايل — تجميل وتناسق الابتسامة الطبيعي',
    tagEn: 'Hollywood Smile',
    tagAr: 'هوليوود سمايل',
    captionEn: 'Seamless replacement of missing upper incisor and full smile design with E-Max® porcelain veneers.',
    captionAr: 'تعويض السن الأمامي المفقود وتصميم ابتسامة متكاملة بعدسات الإيماكس الخزفية.',
    specsEn: '5 Days • Ivoclar E-Max®',
    specsAr: '٥ أيام • إيماكس ألماني',
    visible: true,
  },
  {
    id: 'case-2',
    src: DEFAULT_ASSETS.case2,
    category: 'cosmetic',
    titleEn: 'Full-Mouth Cosmetic Dentistry Makeover',
    titleAr: 'علاج الأسنان وتجميلها — تأهيل شامل للفكين',
    tagEn: 'Cosmetic Dentistry',
    tagAr: 'علاج الأسنان وتجميلها',
    captionEn: 'Complete functional and aesthetic transformation of worn dentition using multilayer German zirconia crowns.',
    captionAr: 'إعادة تأهيل شاملة للأسنان المتآكلة واستعادة البياض الطبيعي بتيجان الزيركون الألماني.',
    specsEn: '6 Days • Multilayer Zirconia',
    specsAr: '٦ أيام • زيركون متعدد الطبقات',
    visible: true,
  },
  {
    id: 'case-3',
    src: DEFAULT_ASSETS.case3,
    category: 'hollywood',
    titleEn: 'Hollywood Smile — Full Bite & Shade Alignment',
    titleAr: 'هوليوود سمايل — إعادة بناء الإطباق وتناغم اللون',
    tagEn: 'Hollywood Smile',
    tagAr: 'هوليوود سمايل',
    captionEn: 'Precision digital smile reconstruction correcting missing tooth gap, bite alignment, and enamel radiance.',
    captionAr: 'تصميم رقمي متكامل لتعويض الفراغ الأمامي وتصحيح الإطباق بلون طبيعي مشرق.',
    specsEn: '5 Days • 3D Digital Smile Design',
    specsAr: '٥ أيام • تصميم رقمي ثلاثي الأبعاد',
    visible: true,
  },
  {
    id: 'case-4',
    src: DEFAULT_ASSETS.case4,
    category: 'cosmetic',
    titleEn: 'Complete Upper & Lower Arch Rehabilitation',
    titleAr: 'علاج الأسنان وتجميلها — تعويض وتجميل كامل',
    tagEn: 'Cosmetic Dentistry',
    tagAr: 'علاج الأسنان وتجميلها',
    captionEn: 'Restoring missing upper teeth and severe attrition into a balanced, confident, and healthy smile.',
    captionAr: 'تعويض الأسنان المفقودة والمتآكلة واستعادة الابتسامة الصحية والجمالية بالكامل.',
    specsEn: '10-Year Written Warranty',
    specsAr: 'ضمان دولي مكتوب ١٠ سنوات',
    visible: true,
  },
  {
    id: 'case-5',
    src: DEFAULT_ASSETS.case5,
    category: 'cosmetic',
    titleEn: 'Aesthetic Smile Reconstruction',
    titleAr: 'ترميم وتجميل الابتسامة المتقدم',
    tagEn: 'Cosmetic Dentistry',
    tagAr: 'علاج الأسنان وتجميلها',
    captionEn: 'High-translucency aesthetic crowns crafted for natural gum harmony and facial balance in Istanbul.',
    captionAr: 'تيجان خزفية عالية الشفافية مصممة لتتناغم مع اللثة وملامح الوجه في إسطنبول.',
    specsEn: '6 Days • Istanbul Clinic',
    specsAr: '٦ أيام • عيادة إسطنبول',
    visible: true,
  },
];

const INITIAL_LEADS: ConsultationLead[] = [
  {
    id: 'lead-101',
    fullName: 'سارة المنصور / Sara Al-Mansoor',
    countryCode: '+966',
    phone: '551234890',
    country: 'Saudi Arabia',
    email: 'sara.m@example.com',
    serviceValue: 'hollywood',
    timeline: 'Within 1–3 months',
    message: 'أرغب في معرفة تكلفة هوليوود سمايل (20 سن) ومدة الإقامة المطلوبة في إسطنبول.',
    status: 'new',
    adminNotes: 'Prefer evening WhatsApp call after 6 PM Istanbul time.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    langSubmitted: 'ar',
  },
  {
    id: 'lead-102',
    fullName: 'Lukas Schneider',
    countryCode: '+49',
    phone: '1704481920',
    country: 'Germany',
    email: 'l.schneider@example.de',
    serviceValue: 'zirconia',
    timeline: 'As soon as possible',
    message: 'Looking for full upper and lower German zirconia crowns + airport VIP pickup from Frankfurt flight.',
    status: 'contacted',
    adminNotes: 'Sent panoramic X-ray instructions & 5-day treatment itinerary via WhatsApp.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    langSubmitted: 'en',
  },
  {
    id: 'lead-103',
    fullName: "Aoife O'Connor",
    countryCode: '+353',
    phone: '879871122',
    country: 'Ireland',
    email: 'aoife.oconnor@example.ie',
    serviceValue: 'implants',
    timeline: 'Within 1–3 months',
    message: 'Interested in dental implants and porcelain veneers package with hotel near the clinic.',
    status: 'booked',
    adminNotes: 'Confirmed Dublin–Istanbul flight on the 22nd — VIP Transfer & 5-Star Hotel arranged.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    langSubmitted: 'en',
  },
];

const COUNTRY_CODES = [
  { id: 'de', code: '+49', flag: '🇩🇪', label: 'Germany' },
  { id: 'ie', code: '+353', flag: '🇮🇪', label: 'Ireland' },
  { id: 'gb', code: '+44', flag: '🇬🇧', label: 'United Kingdom' },
  { id: 'sa', code: '+966', flag: '🇸🇦', label: 'Saudi Arabia' },
  { id: 'ae', code: '+971', flag: '🇦🇪', label: 'UAE' },
  { id: 'kw', code: '+965', flag: '🇰🇼', label: 'Kuwait' },
  { id: 'qa', code: '+974', flag: '🇶🇦', label: 'Qatar' },
  { id: 'tr', code: '+90', flag: '🇹🇷', label: 'Türkiye' },
  { id: 'at', code: '+43', flag: '🇦🇹', label: 'Austria' },
  { id: 'ch', code: '+41', flag: '🇨🇭', label: 'Switzerland' },
  { id: 'fr', code: '+33', flag: '🇫🇷', label: 'France' },
  { id: 'nl', code: '+31', flag: '🇳🇱', label: 'Netherlands' },
  { id: 'se', code: '+46', flag: '🇸🇪', label: 'Sweden' },
  { id: 'bh', code: '+973', flag: '🇧🇭', label: 'Bahrain' },
  { id: 'om', code: '+968', flag: '🇴🇲', label: 'Oman' },
  { id: 'jo', code: '+962', flag: '🇯🇴', label: 'Jordan' },
  { id: 'eg', code: '+20', flag: '🇪🇬', label: 'Egypt' },
  { id: 'iq', code: '+964', flag: '🇮🇶', label: 'Iraq' },
  { id: 'us', code: '+1', flag: '🇺🇸', label: 'USA / Canada' },
];

const TRANSLATIONS = {
  en: {
    brandSubtitle: 'Look Beautiful, Live Healthy',
    topBar: {
      accredited: 'JCI & ISO Certified Partner Clinics in Istanbul',
      materials: 'Certified German & Swiss Materials (Ivoclar E-Max® & Straumann®)',
      warranty: '10-Year Written International Warranty',
      onlineNow: 'Coordinators Online Now',
    },
    nav: {
      homeAria: 'ESTELUX Home',
      logoAlt: 'ESTELUX — Look Beautiful, Live Healthy',
      treatments: 'Treatments',
      gallery: 'Smile Gallery',
      whyUs: 'Why ESTELUX',
      journey: 'Patient Journey',
      reviews: 'Reviews',
      faq: 'FAQ',
      allServices: 'Other Specialties',
      freeQuote: 'Free Smile Quote',
      langSwitch: 'العربية',
      whatsapp: 'WhatsApp',
      whatsappAria: 'Contact ESTELUX on WhatsApp',
      dashboardBtn: 'Dashboard',
      backToSite: 'View Landing Page',
      returnToAdmin: 'Coordinator Mode Active — Return to Control Center',
    },
    hero: {
      kicker: 'PREMIER DENTAL AESTHETICS • ISTANBUL, TÜRKIYE',
      responseBadge: 'Avg. Coordinator Reply: Under 10 Mins',
      title: 'Dental Surgery & Luxury Smile Aesthetics',
      subtitle: 'Excellence in Medical Care',
      slogan: 'Look Beautiful, Live Healthy — Precision Digital Dentistry in Istanbul.',
      lead: 'Experience world-class Hollywood Smile veneers, German zirconia crowns, and Swiss dental implants in Istanbul—at up to 70% savings compared to Western Europe, the UK, and GCC. From your free 3D online assessment to VIP airport pickup and 5-star hotel stay, ESTELUX coordinates every detail.',
      primaryCta: 'Get Free Treatment Plan',
      whatsappCta: 'Chat on WhatsApp',
      whatsappPrefill:
        'Hello ESTELUX Istanbul, I am interested in a free dental consultation and treatment quote. Could you please share more details?',
      photoAlt: 'ESTELUX Dental Surgery & Cosmetic Dentistry specialist suite in Istanbul',
      photoCaption: '3D Digital Smile Design & Pain-Free Aesthetic Dentistry in Istanbul',
      metrics: [
        { value: '5,200+', label: 'Smile Transformations' },
        { value: '15+ Yrs', label: 'Specialist Surgeons' },
        { value: 'Up to 70%', label: 'Savings vs. EU & UK' },
        { value: '10-Year', label: 'Written Warranty' },
      ],
      resultsHeading: 'Verified Clinical Smile Transformations',
      resultsSub: 'Real patient outcomes achieved in 5–7 days in Istanbul. Click any case to inspect.',
      resultsHint: 'Click to enlarge',
      verifiedBadge: 'Verified Case',
      filters: {
        all: 'All Cases',
        hollywood: 'Hollywood Smile',
        cosmetic: 'Crowns & Implants',
      },
      casePrefix: 'Case #',
    },
    treatmentsSection: {
      kicker: 'SIGNATURE DENTAL PACKAGES',
      heading: 'Tailored Dental Treatments in Istanbul',
      sub: 'Every procedure uses CE & FDA-certified European materials with a written international warranty and VIP travel coordination.',
      durationLabel: 'Istanbul Stay:',
      warrantyLabel: 'Warranty:',
      ctaText: 'Request Quote for This Treatment',
      items: [
        {
          value: 'hollywood',
          image: '/case-hollywood-2.jpg',
          badge: 'Most Popular',
          title: 'Hollywood Smile & E-Max® Veneers',
          stay: '5–7 Days',
          warranty: '10-Year Guarantee',
          desc: 'Ultra-thin Ivoclar Vivadent® E-Max porcelain laminate veneers custom-crafted with 3D Digital Smile Design for natural translucency and facial harmony.',
          highlights: [
            '3D Digital Smile Preview & trial mock-up before bonding',
            'Stain-resistant German porcelain in natural or Hollywood shades',
            'Minimal tooth preparation preserving healthy enamel',
          ],
        },
        {
          value: 'zirconia',
          image: '/case-cosmetic-1.jpg',
          badge: 'Full Restoration',
          title: 'German Zirconia Crowns & Cosmetic Dentistry',
          stay: '5–7 Days',
          warranty: '10-Year Guarantee',
          desc: 'High-translucency multilayer monolithic zirconia crowns combining exceptional bite strength with lifelike enamel aesthetics.',
          highlights: [
            '100% biocompatible, metal-free German CAD/CAM zirconia',
            'Ideal for damaged, heavily filled, or missing teeth bridges',
            'Precision digital intraoral scanning (no messy impressions)',
          ],
        },
        {
          value: 'implants',
          image: '/case-cosmetic-2.jpg',
          badge: 'Permanent Solution',
          title: 'Dental Implants & Full Arch Reconstruction',
          stay: '3–5 Days / Stage',
          warranty: 'Lifetime Implant Warranty',
          desc: 'Swiss and German titanium implants placed with 3D CBCT computer-guided precision for missing teeth or full-jaw fixed rehabilitation.',
          highlights: [
            'Premium Straumann® & Nobel Biocare® implant systems',
            'Immediate temporary fixed teeth so you never leave toothless',
            'Painless local anesthesia or sedation options available',
          ],
        },
        {
          value: 'dental',
          image: '/case-hollywood-1.jpg',
          badge: 'Complete Smile Design',
          title: 'Aesthetic Smile Reconstruction & Alignment',
          stay: '5–7 Days',
          warranty: '10-Year Guarantee',
          desc: 'Comprehensive cosmetic dentistry and prosthetic rehabilitation correcting gaps, severe wear, and bite asymmetry in a single coordinated trip.',
          highlights: [
            'Custom shade and tooth morphology tailored to your face',
            'Laser gum contouring (pink aesthetics) for balanced proportions',
            'Includes panoramic X-ray, 3D CBCT scan, and aftercare kit',
          ],
        },
      ],
    },
    whyUs: {
      kicker: 'THE ESTELUX STANDARD',
      heading: 'Why International Patients Trust ESTELUX',
      sub: 'We combine senior prosthodontic artistry with effortless 5-star hospitality in the heart of Istanbul.',
      items: [
        {
          title: 'Approve Your Smile Before Placement',
          desc: 'Using 3D intraoral scanning and a physical trial mock-up, you see and approve the exact shape, length, and shade of your new teeth before final bonding.',
        },
        {
          title: '100% Certified European Brands',
          desc: 'Every veneer, crown, and implant comes with an official serial-numbered authenticity card from Ivoclar Vivadent®, Straumann®, or Nobel Biocare®.',
        },
        {
          title: 'Transparent All-Inclusive Packages',
          desc: 'Your personalized treatment quote covers 3D CBCT scans, panoramic X-rays, temporary teeth, medications, VIP airport transfers, and hotel coordination—with zero hidden clinic fees.',
        },
        {
          title: 'Dedicated Multilingual Host 24/7',
          desc: 'A personal English, German, or Arabic-speaking coordinator accompanies you at every clinic appointment so communication is effortless.',
        },
      ],
    },
    journey: {
      kicker: 'HOW IT WORKS',
      heading: 'Your 4-Step Smile Journey in Istanbul',
      sub: 'From your first WhatsApp message to your final reveal, everything is organized for a stress-free experience.',
      steps: [
        {
          num: '01',
          title: 'Free Online Smile Assessment',
          desc: 'Send us smile photos or a recent X-ray via WhatsApp or our form. Our senior dental surgeons prepare a detailed treatment plan and fixed price quote within 24 hours.',
        },
        {
          num: '02',
          title: 'VIP Arrival & 5-Star Hotel',
          desc: 'Once you book your flight to Istanbul, our private VIP chauffeur greets you at the airport and drives you directly to your partner hotel and clinic appointments.',
        },
        {
          num: '03',
          title: '3D Digital Design & Treatment',
          desc: 'We perform a 3D CBCT scan, design your custom smile digitally, fit your temporary teeth on day one, and craft your final restorations in our CAD/CAM lab.',
        },
        {
          num: '04',
          title: 'Final Smile Reveal & Warranty',
          desc: 'After your final fitting and bite check, you receive your official 10-year / lifetime warranty certificate and ongoing remote aftercare support.',
        },
      ],
    },
    reviews: {
      kicker: 'PATIENT STORIES',
      heading: 'Trusted by Patients Across Europe & GCC',
      sub: 'Read verified experiences from international patients who chose ESTELUX Istanbul for their smile transformation.',
      verifiedLabel: 'Verified Patient',
      items: [
        {
          name: 'Markus H.',
          country: 'Munich, Germany 🇩🇪',
          treatment: '20 E-Max® Veneers',
          quote:
            'My dentist in Munich quoted me over €16,000. At ESTELUX in Istanbul I paid a fraction of that, stayed in a 5-star hotel, and the digital smile design looks completely natural.',
        },
        {
          name: 'Ciara Doyle',
          country: 'Dublin, Ireland 🇮🇪',
          treatment: 'Hollywood Smile & Gum Contouring',
          quote:
            'From the VIP pickup at Istanbul Airport to my final fitting, the coordination was flawless. Zero pain, no hidden costs, and I got to preview my teeth shape before they were cemented.',
        },
        {
          name: 'Faisal Al-Harbi',
          country: 'Riyadh, Saudi Arabia 🇸🇦',
          treatment: 'Full-Mouth Zirconia Crowns',
          quote:
            'The Arabic-speaking coordinator accompanied me at every step. The clinic is ultra-modern and my new smile was finished in just 6 days.',
        },
        {
          name: 'Charlotte Evans',
          country: 'London, United Kingdom 🇬🇧',
          treatment: 'Dental Implants & Crowns',
          quote:
            'I was nervous about traveling abroad for dental implants, but the surgeon explained my 3D scan in detail and gave me a written warranty certificate. Best decision I ever made.',
        },
      ],
    },
    faq: {
      kicker: 'FREQUENTLY ASKED QUESTIONS',
      heading: 'Everything You Need to Know Before Travelling',
      sub: 'Have another question? Message our medical coordinators directly on WhatsApp for an instant answer.',
      items: [
        {
          q: 'How many days do I need to stay in Istanbul for a Hollywood Smile or Crowns?',
          a: 'For E-Max® porcelain veneers or German zirconia crowns, a stay of 5 to 7 days in Istanbul is sufficient. You will have 3 to 4 comfortable clinic visits with plenty of free time to enjoy Istanbul.',
        },
        {
          q: 'How long does Dental Implant treatment take?',
          a: 'Dental implant placement requires a 3 to 5 day visit for the surgical placement and temporary teeth. After a 3 to 4 month healing period (osseointegration) at home, you return for 5 to 6 days to fit your permanent zirconia or porcelain crowns.',
        },
        {
          q: 'Are the procedures painful?',
          a: 'No. All treatments are performed under modern digital local anesthesia (and sedation upon request) so you feel no pain during preparation or placement. We also provide complete post-care medication.',
        },
        {
          q: 'Do you provide a written guarantee for veneers, crowns, and implants?',
          a: 'Yes. Every patient receives an official written ESTELUX warranty certificate along with original manufacturer serial cards—covering E-Max® veneers and zirconia crowns for 10 years, and titanium dental implants for life.',
        },
        {
          q: 'How can I get an accurate price quote before booking my flight?',
          a: 'Simply submit the consultation form on this page or message us on WhatsApp with clear photos of your teeth (or a panoramic X-ray if available). Our surgeons will review your case free of charge and send a transparent, itemized treatment plan.',
        },
        {
          q: 'What is included in the VIP transfer and hotel coordination?',
          a: 'We arrange private airport pickup and drop-off in luxury VIP vehicles, all transfers between your hotel and our clinic, 5-star partner hotel accommodation near the clinic, and a dedicated native-speaking patient host.',
        },
      ],
    },
    form: {
      badge: '100% Free Online Medical Assessment',
      heading: 'Request Your Free Smile Plan',
      intro: 'Leave your details below. Our Istanbul medical coordinator will contact you with a personalized treatment plan and cost estimate.',
      timelineLabel: 'When are you planning treatment?',
      timelines: [
        { value: 'As soon as possible', label: 'As soon as possible' },
        { value: 'Within 1–3 months', label: 'Within 1–3 months' },
        { value: 'Just researching / price check', label: 'Price check' },
      ],
      countryCodeAria: 'Country dialing code',
      fullName: 'Full name',
      fullNamePlaceholder: 'Your full name',
      whatsapp: 'WhatsApp number',
      whatsappPlaceholder: '7700 900077',
      country: 'Country of residence',
      countryPlaceholder: 'e.g., Germany, Ireland, UK, Saudi Arabia',
      email: 'Email address (optional)',
      emailPlaceholder: 'you@example.com',
      serviceLabel: 'Interested treatment',
      services: [
        { value: 'hollywood', label: 'Hollywood Smile & E-Max® Porcelain Veneers' },
        { value: 'zirconia', label: 'German Zirconia Crowns & Full Rehabilitation' },
        { value: 'implants', label: 'Dental Implants (All-on-4 / All-on-6)' },
        { value: 'dental', label: 'General Dental Surgery & Cosmetic Dentistry' },
        { value: 'whitening', label: 'Laser Teeth Whitening & Gum Aesthetics' },
        { value: 'hair', label: 'Hair Transplantation (Sapphire FUE / DHI)' },
        { value: 'plastic', label: 'Plastic & Cosmetic Surgery' },
        { value: 'spine', label: 'Spine & Orthopedic Surgery' },
      ],
      message: 'Smile goals or questions (optional)',
      messagePlaceholder: 'Tell us about your dental goals, number of teeth, or preferred travel dates...',
      consent: 'I agree to be contacted by ESTELUX regarding my free medical consultation.',
      submit: 'Get My Free Smile Assessment',
      submitting: 'Preparing your request...',
      whatsappDirect: 'Or Chat Instantly on WhatsApp',
      note: '🔒 100% Confidential • No-Obligation Quote • Response in ~10 mins',
      errors: {
        name: 'Please enter your full name.',
        phone: 'Please enter a valid WhatsApp phone number.',
        country: 'Please enter your country of residence.',
        email: 'Please enter a valid email address.',
        consent: 'Please confirm privacy consent to continue.',
      },
      confirmTitle: 'Consultation Request Received!',
      confirmBody:
        'Thank you. Your inquiry has been assigned to a senior Istanbul patient coordinator. Tap below to send your summary on WhatsApp for priority same-hour review.',
      confirmWaBtn: 'Send on WhatsApp for Instant Reply',
      resetBtn: 'Submit another inquiry',
      waSummaryIntro: 'Hello ESTELUX Istanbul, I would like to receive my free consultation and treatment quote.',
      waFieldName: 'Name',
      waFieldPhone: 'WhatsApp',
      waFieldCountry: 'Country',
      waFieldEmail: 'Email',
      waFieldService: 'Treatment',
      waFieldTimeline: 'Timeline',
      waFieldNotes: 'Notes',
    },
    tourism: {
      heading: '5-Star VIP Medical Travel Included',
      sub: 'Everything coordinated from Istanbul Airport arrival to post-care follow-up.',
      items: [
        {
          title: 'VIP AIRPORT & CLINIC TRANSFER',
          desc: 'Private Mercedes-Benz airport pickup and comfortable chauffeur transfers between your hotel and clinic.',
        },
        {
          title: 'LUXURY 5-STAR ACCOMMODATION',
          desc: 'Curated partner hotels located minutes away from our dental center in central Istanbul.',
        },
        {
          title: 'PERSONAL PATIENT CONCIERGE',
          desc: 'Dedicated native-speaking translator and priority appointment scheduling throughout your stay.',
        },
      ],
    },
    services: {
      kicker: 'COMPREHENSIVE CARE IN ISTANBUL',
      heading: 'Additional Medical Specialties',
      sub: 'Beyond dental aesthetics, ESTELUX coordinates specialized surgical care with top accredited hospitals in Istanbul.',
      items: [
        {
          value: 'hair',
          title: 'Hair Transplantation',
          desc: 'Maximum-density Sapphire FUE and DHI hair & beard restoration with natural hairline design and PRP therapy.',
          linkText: 'Inquire about Hair Restoration',
        },
        {
          value: 'plastic',
          title: 'Plastic & Cosmetic Surgery',
          desc: 'Rhinoplasty, facial rejuvenation, and body contouring performed by board-certified plastic surgeons.',
          linkText: 'Inquire about Plastic Surgery',
        },
        {
          value: 'spine',
          title: 'Spine & Orthopedic Surgery',
          desc: 'Advanced minimally invasive spinal assessment and surgical care supported by modern hospital technology.',
          linkText: 'Inquire about Spine Surgery',
        },
      ],
    },
    ctaBanner: {
      kicker: 'START YOUR SMILE TRANSFORMATION',
      heading: 'Ready to Discover Your New Smile in Istanbul?',
      sub: 'Send us a quick message on WhatsApp or request your complimentary online assessment today. No obligation, transparent pricing.',
      primaryBtn: 'Request Free Assessment',
      waBtn: 'WhatsApp Us Now',
    },
    lightbox: {
      close: 'Close',
      prev: 'Previous case',
      next: 'Next case',
      cta: 'Request Quote for Similar Smile',
    },
    footer: {
      slogan: 'Look Beautiful, Live Healthy — Istanbul, Türkiye.',
      whatsappLabel: 'WhatsApp',
      privacy: 'Privacy Policy',
      rights: `© ${new Date().getFullYear()} ESTELUX Istanbul. All rights reserved.`,
      privacyTitle: 'Privacy & Medical Confidentiality Policy',
      privacyText:
        'ESTELUX strictly protects your personal and medical inquiry information in accordance with international health data protection standards. Details and photos submitted are reviewed exclusively by our medical coordination team and dental surgeons to prepare your treatment plan and are never shared with third parties.',
      close: 'Close',
    },
    admin: {
      loginTitle: 'ESTELUX Coordinator Portal',
      loginSub: 'Enter your security PIN to manage consultation requests and clinical gallery photos.',
      pinPlaceholder: 'Enter Security PIN',
      pinError: 'Incorrect PIN. Please try again.',
      loginBtn: 'Unlock Dashboard',
      cancelBtn: 'Return to Landing Page',
      portalTitle: 'ESTELUX Control Center',
      portalSub: 'Live Synchronization with Public Landing Page',
      logout: 'Lock & Exit',
      changePinBtn: 'Change PIN',
      pinModal: {
        title: 'Change Dashboard PIN',
        sub: 'Update the security PIN required to access the ESTELUX coordinator dashboard.',
        currentLabel: 'Current PIN',
        newLabel: 'New PIN (min. 4 characters)',
        confirmLabel: 'Confirm New PIN',
        saveBtn: 'Update PIN',
        errCurrent: 'Current PIN is incorrect.',
        errLength: 'New PIN must be at least 4 characters.',
        errMismatch: 'New PIN and confirmation do not match.',
        successToast: 'Dashboard PIN updated successfully!',
      },
      tabLeads: 'Consultation Messages',
      tabMedia: 'Gallery & Photos Manager',
      stats: {
        total: 'Total Requests',
        new: 'New Inquiries',
        booked: 'Confirmed Bookings',
        activePhotos: 'Active Gallery Cases',
      },
      leads: {
        searchPlaceholder: 'Search by patient name, phone, country, or note...',
        filterAll: 'All',
        statusNew: 'New',
        statusContacted: 'Contacted',
        statusBooked: 'Booked',
        statusArchived: 'Archived',
        exportCsv: 'Export CSV',
        empty: 'No consultation messages match your filter.',
        patient: 'Patient',
        service: 'Requested Service',
        message: 'Patient Message',
        noMessage: 'No additional notes provided.',
        notesLabel: 'Coordinator Internal Notes',
        notesPlaceholder: 'Add flight details, X-ray status, or follow-up notes...',
        whatsappReply: 'Reply on WhatsApp',
        deleteConfirm: 'Click again to confirm delete',
        deleteBtn: 'Delete',
        waReplyGreeting: (name: string, service: string) =>
          `Hello ${name}, thank you for contacting ESTELUX Istanbul regarding ${service}. Our medical coordinator is ready to assist you with your treatment plan.`,
      },
      media: {
        brandSectionTitle: 'Brand Logo & Hero Banner Image',
        brandSectionSub: 'Upload from your device (auto-optimized) or paste an image URL. Updates appear immediately on the landing page.',
        logoLabel: 'ESTELUX Brand Logo',
        heroPhotoLabel: 'Hero Featured Clinic Photo',
        uploadBtn: 'Upload File',
        urlPlaceholder: 'Or paste image URL (https://...)',
        applyUrl: 'Apply',
        resetDefaults: 'Reset All Media to Original',
        addCaseTitle: 'Add New Before & After Clinical Case',
        addCaseSub: 'Upload a clinical transformation photo and provide English & Arabic titles.',
        caseTitleEn: 'Title (English)',
        caseTitleEnPh: 'e.g., 20 E-Max® Porcelain Veneers',
        caseTitleAr: 'Title (Arabic)',
        caseTitleArPh: 'مثال: ٢٠ عدسة إيماكس خزفية',
        caseCategory: 'Category',
        catHollywood: 'Hollywood Smile',
        catCosmetic: 'Cosmetic Dentistry / Crowns & Implants',
        caseCaptionEn: 'Short Description (English)',
        caseCaptionAr: 'Short Description (Arabic)',
        choosePhoto: 'Choose Photo from Device',
        orImageUrl: 'Or paste Image URL',
        addCaseBtn: 'Publish to Gallery',
        manageCasesTitle: 'Manage Clinical Gallery Cases',
        manageCasesSub: 'Edit titles & descriptions, toggle visibility on the landing page, reorder, or delete cases.',
        visibleBadge: 'Visible on Site',
        hiddenBadge: 'Hidden',
        editBtn: 'Edit Details',
        saveBtn: 'Save Changes',
        cancelEdit: 'Cancel',
        moveUp: 'Move Up',
        moveDown: 'Move Down',
        toggleVisibility: 'Toggle Visibility',
        savedToast: 'Changes saved & synced live!',
      },
    },
  },
  ar: {
    brandSubtitle: 'تألّق بجمالك، وعِش بصحة',
    topBar: {
      accredited: 'مراكز طبية معتمدة دولياً (JCI & ISO) في إسطنبول',
      materials: 'مواد ألمانية وسويسرية أصلية (Ivoclar E-Max® & Straumann®)',
      warranty: 'ضمان دولي مكتوب لمدة ١٠ سنوات',
      onlineNow: 'فريق التنسيق متاح الآن',
    },
    nav: {
      homeAria: 'الصفحة الرئيسية ESTELUX',
      logoAlt: 'ESTELUX — تألّق بجمالك، وعِش بصحة',
      treatments: 'علاجات الأسنان',
      gallery: 'نتائج قبل وبعد',
      whyUs: 'لماذا ESTELUX',
      journey: 'رحلة العلاج',
      reviews: 'آراء المرضى',
      faq: 'الأسئلة الشائعة',
      allServices: 'تخصصات أخرى',
      freeQuote: 'استشارة مجانية',
      langSwitch: 'English',
      whatsapp: 'واتساب',
      whatsappAria: 'تواصل مع ESTELUX عبر واتساب',
      dashboardBtn: 'لوحة التحكم',
      backToSite: 'عرض صفحة الهبوط',
      returnToAdmin: 'وضع الإدارة نشط — العودة إلى لوحة التحكم',
    },
    hero: {
      kicker: 'الرائدون في طب الأسنان التجميلي • إسطنبول، تركيا',
      responseBadge: 'معدل الرد عبر واتساب: أقل من ١٠ دقائق',
      title: 'جراحة الأسنان وتصميم الابتسامة الفاخرة',
      subtitle: 'التميّز في الرعاية الطبية',
      slogan: 'تألّق بجمالك، وعِش بصحة — دقة طب الأسنان الرقمي في إسطنبول.',
      lead: 'احصل على ابتسامة هوليوود بعدسات الإيماكس الألمانية، وتيجان الزيركون، وزراعة الأسنان السويسرية في إسطنبول بتوفير يصل إلى ٧٠٪ مقارنة بأوروبا والخليج. بدءاً من التقييم المجاني عبر الإنترنت وحتى الاستقبال الخاص VIP من المطار والإقامة الفندقية الفاخرة، تنسّق ESTELUX كل تفاصيل رحلتك.',
      primaryCta: 'احصل على خطة علاج مجانية',
      whatsappCta: 'تحدث عبر واتساب',
      whatsappPrefill:
        'مرحباً ESTELUX إسطنبول، أرغب في الحصول على استشارة مجانية وعرض سعر لتجميل وعلاج الأسنان.',
      photoAlt: 'استشارة جراحة الأسنان وتجميلها في عيادة ESTELUX إسطنبول',
      photoCaption: 'تصميم الابتسامة الرقمي ثلاثي الأبعاد وطب الأسنان التجميلي بدون ألم في إسطنبول',
      metrics: [
        { value: '+٥,٢٠٠', label: 'ابتسامة ناجحة' },
        { value: '+١٥ سنة', label: 'خبرة الأطباء الجراحين' },
        { value: 'حتى ٧٠٪', label: 'توفير في التكلفة' },
        { value: '١٠ سنوات', label: 'ضمان دولي مكتوب' },
      ],
      resultsHeading: 'نتائج سريرية موثقة لابتسامات مرضانا',
      resultsSub: 'تحولات حقيقية تم إنجازها خلال ٥ إلى ٧ أيام في إسطنبول. اضغط على أي صورة للتكبير.',
      resultsHint: 'انقر للتكبير',
      verifiedBadge: 'حالة موثقة',
      filters: {
        all: 'جميع الحالات',
        hollywood: 'هوليوود سمايل',
        cosmetic: 'زيركون وزراعة الأسنان',
      },
      casePrefix: 'حالة رقم ',
    },
    treatmentsSection: {
      kicker: 'باقات علاج وتجميل الأسنان',
      heading: 'أحدث تقنيات تجميل وجراحة الأسنان في إسطنبول',
      sub: 'نستخدم حصرياً مواد أوروبية معتمدة من FDA و CE مع شهادة ضمان دولية مكتوبة وخدمات استقبال VIP متكاملة.',
      durationLabel: 'مدة الإقامة في إسطنبول:',
      warrantyLabel: 'الضمان:',
      ctaText: 'اطلب عرض سعر لهذا الإجراء',
      items: [
        {
          value: 'hollywood',
          image: '/case-hollywood-2.jpg',
          badge: 'الأكثر طلباً',
          title: 'هوليوود سمايل وعدسات إيماكس (E-Max®)',
          stay: '٥ – ٧ أيام',
          warranty: 'ضمان ١٠ سنوات',
          desc: 'عدسات خزفية فائقة الرقة من Ivoclar Vivadent® الألمانية مصممة بتقنية التصميم الرقمي ثلاثي الأبعاد لشفافية طبيعية وتناسق مثالي مع الوجه.',
          highlights: [
            'بروفة رقمية وتجربة شكل الابتسامة قبل التركيب النهائي',
            'خزف ألماني مقاوم للتصبغات بدرجات بياض طبيعية أو ناصعة',
            'حفاظ فائق على طبقة المينا الصحية بأقل برد ممكن',
          ],
        },
        {
          value: 'zirconia',
          image: '/case-cosmetic-1.jpg',
          badge: 'تأهيل شامل',
          title: 'تيجان الزيركون الألماني وتجميل الأسنان',
          stay: '٥ – ٧ أيام',
          warranty: 'ضمان ١٠ سنوات',
          desc: 'تيجان زيركونيا ألمانية متعددة الطبقات تجمع بين القوة الفائقة لتحمل المضغ والمظهر الطبيعي الشفاف للأسنان.',
          highlights: [
            'زيركون حيوي خالٍ تماماً من المعادن ومصنع بتقنية CAD/CAM',
            'مثالي لتعويض الأسنان المتضررة أو الجسور المتكاملة',
            'مسح رقمي ثلاثي الأبعاد للفم بدون طبعات تقليدية مزعجة',
          ],
        },
        {
          value: 'implants',
          image: '/case-cosmetic-2.jpg',
          badge: 'حل دائم مدى الحياة',
          title: 'زراعة الأسنان وتعويض الأسنان المفقودة',
          stay: '٣ – ٥ أيام لكل مرحلة',
          warranty: 'ضمان مدى الحياة للزرعات',
          desc: 'زرعات تيتانيوم سويسرية وألمانية يتم وضعها بتوجيه ثلاثي الأبعاد (3D CBCT) لتعويض الأسنان المفقودة أو الفك بالكامل.',
          highlights: [
            'أنظمة Straumann® و Nobel Biocare® العالمية المعتمدة',
            'تركيب أسنان مؤقتة ثابتة فوراً خلال نفس الزيارة',
            'إجراء غير مؤلم تحت التخدير الموضعي الرقمي أو التهدئة',
          ],
        },
        {
          value: 'dental',
          image: '/case-hollywood-1.jpg',
          badge: 'تصميم متكامل للابتسامة',
          title: 'ترميم الابتسامة وتصحيح الإطباق التجميلي',
          stay: '٥ – ٧ أيام',
          warranty: 'ضمان ١٠ سنوات',
          desc: 'علاج تجميلي وتعويضي متكامل لإغلاق الفراغات وتصحيح تآكل الأسنان وتناسق اللثة في رحلة علاجية واحدة.',
          highlights: [
            'تصميم مخصص لشكل ولون الأسنان بما يناسب ملامح الوجه',
            'تحديد وتوريد اللثة بالليزر لإبراز جمال الابتسامة',
            'يشمل الأشعة البانورامية والمسح ثلاثي الأبعاد 3D CBCT',
          ],
        },
      ],
    },
    whyUs: {
      kicker: 'معايير ESTELUX الطبية',
      heading: 'لماذا يختار المرضى الدوليون عيادة ESTELUX؟',
      sub: 'نجمع بين نخبة استشاريي تجميل الأسنان وخدمات الضيافة الفاخرة من فئة ٥ نجوم في قلب إسطنبول.',
      items: [
        {
          title: 'معاينة واعتماد ابتسامتك قبل التثبيت',
          desc: 'من خلال المسح الرقمي ثلاثي الأبعاد والنموذج التجريبي (Mock-up)، يمكنك رؤية وتجربة شكل ولون أسنانك الجديدة والموافقة عليها قبل التثبيت النهائي.',
        },
        {
          title: 'مواد أوروبية أصلية ١٠٠٪ بشهادة رقم تسلسلي',
          desc: 'تأتي كل عدسة وتاج وزرعة مع بطاقة أصالة رسمية برقم تسلسلي من شركات Ivoclar Vivadent® و Straumann® و Nobel Biocare®.',
        },
        {
          title: 'باقات شاملة بأسعار واضحة بدون رسوم خفية',
          desc: 'يشمل عرض السعر تصوير الأشعة البانورامية والمقطعية 3D CBCT، والأسنان المؤقتة، والأدوية، واستقبال المطار VIP، وتنسيق الفندق بدون أي تكاليف إضافية.',
        },
        {
          title: 'مرافق ومترجم شخصي يتحدث لغتك ٢٤/٧',
          desc: 'يرافقك منسق شخصي يتحدث العربية أو الإنجليزية أو الألمانية في جميع مواعيدك الطبية لضمان راحتك التامة.',
        },
      ],
    },
    journey: {
      kicker: 'خطوات بسيطة وواضحة',
      heading: 'رحلة ابتسامتك في إسطنبول في ٤ خطوات',
      sub: 'من رسالتك الأولى عبر واتساب وحتى عودتك بابتسامتك الجديدة، نرتب لك كل شيء بدقة واحترافية.',
      steps: [
        {
          num: '٠١',
          title: 'تقييم طبي مجاني عبر الإنترنت',
          desc: 'أرسل صور أسنانك أو صورة أشعة عبر واتساب أو النموذج. يقوم أطباؤنا بإعداد خطة علاج مفصلة وعرض سعر ثابت خلال ٢٤ ساعة.',
        },
        {
          num: '٠٢',
          title: 'استقبال VIP من المطار وإقامة ٥ نجوم',
          desc: 'فور وصولك إلى مطار إسطنبول، يستقبلك سائقنا الخاص بسيارة VIP فاخرة ليقلك إلى فندقك والعيادة في جميع مواعيدك.',
        },
        {
          num: '٠٣',
          title: 'التصميم الرقمي ثلاثي الأبعاد والعلاج',
          desc: 'نجري فحص 3D CBCT، ونصمم ابتسامتك رقمياً، ونركب الأسنان المؤقتة في اليوم الأول بينما يصنع مختبرنا الرقمي تركيباتك النهائية.',
        },
        {
          num: '٠٤',
          title: 'التركيب النهائي وشهادة الضمان الدولي',
          desc: 'بعد التأكد من دقة الإطباق وجمال الابتسامة، تتسلم شهادة الضمان الرسمية لمدة ١٠ سنوات / مدى الحياة مع متابعة طبية مستمرة.',
        },
      ],
    },
    reviews: {
      kicker: 'تجارب حقيقية لمرضانا',
      heading: 'ثقة المرضى من الخليج وأوروبا',
      sub: 'اطلع على تجارب المرضى الذين اختاروا ESTELUX إسطنبول لتجميل وزراعة الأسنان.',
      verifiedLabel: 'مراجع موثق',
      items: [
        {
          name: 'فيصل الحربي',
          country: 'الرياض، السعودية 🇸🇦',
          treatment: 'تيجان الزيركون الألماني للفكين',
          quote:
            'المنسق الطبي رافقني منذ وصولي مطار إسطنبول وحتى انتهاء العلاج. العيادة حديثة جداً والنتيجة طبيعية للغاية وتمت خلال ٦ أيام فقط.',
        },
        {
          name: 'ماركوس هـ.',
          country: 'ميونخ، ألمانيا 🇩🇪',
          treatment: '٢٠ عدسة إيماكس (هوليوود سمايل)',
          quote:
            'في ألمانيا طلبوا مني أكثر من ١٦ ألف يورو. في ESTELUX حصلت على نفس عدسات الإيماكس السويسرية/الألمانية الأصلية مع إقامة فندقية ٥ نجوم وبأقل من ثلث التكلفة.',
        },
        {
          name: 'سيارا دويل',
          country: 'دبلن، أيرلندا 🇮🇪',
          treatment: 'هوليوود سمايل وتجميل اللثة بالليزر',
          quote:
            'تنظيم رائع من الاستقبال في المطار وحتى الجلسة النهائية. لم أشعر بأي ألم، وأعجبني أنني شاهدت شكل الأسنان التجريبي قبل التركيب الدائم.',
        },
        {
          name: 'شارلوت إيفانز',
          country: 'لندن، المملكة المتحدة 🇬🇧',
          treatment: 'زراعة الأسنان السويسرية وتيجان الخزف',
          quote:
            'كنت مترددة بشأن السفر لعلاج الأسنان، لكن الجراح شرح لي الأشعة ثلاثية الأبعاد بالتفصيل وسلمني شهادة ضمان دولية مكتوبة. أفضل قرار اتخذته.',
        },
      ],
    },
    faq: {
      kicker: 'الأسئلة الشائعة',
      heading: 'كل ما تود معرفته قبل السفر إلى إسطنبول',
      sub: 'هل لديك سؤال آخر؟ تواصل مع منسقينا الطبيين مباشرة عبر واتساب للحصول على إجابة فورية.',
      items: [
        {
          q: 'كم يوماً أحتاج للإقامة في إسطنبول لإجراء هوليوود سمايل أو تيجان الزيركون؟',
          a: 'لإجراء عدسات الإيماكس (E-Max®) أو تيجان الزيركون الألماني، تكفي إقامة لمدة ٥ إلى ٧ أيام في إسطنبول، تتخللها ٣ إلى ٤ زيارات مريحة للعيادة مع وقت كافٍ للاستمتاع بالمدينة.',
        },
        {
          q: 'كم تستغرق عملية زراعة الأسنان؟',
          a: 'تتطلب المرحلة الأولى لزراعة الأسنان وتركيب الأسنان المؤقتة زيارة لمدة ٣ إلى ٥ أيام فقط. وبعد التئام العظم مع الزرعة (من ٣ إلى ٤ أشهر)، تعود في زيارة ثانية لمدة ٥ إلى ٦ أيام لتركيب التيجان الدائمة.',
        },
        {
          q: 'هل الإجراءات مؤلمة؟',
          a: 'إطلاقاً. جميع العلاجات تتم تحت التخدير الموضعي الرقمي الحديث (مع توفر خيار التهدئة عند الطلب) لضمان عدم الشعور بأي ألم أثناء التحضير أو التركيب.',
        },
        {
          q: 'هل تقدمون ضماناً مكتوباً على العدسات والتيجان والزراعة؟',
          a: 'نعم، يحصل كل مراجع على شهادة ضمان رسمية مكتوبة من ESTELUX بالإضافة إلى بطاقات الرقم التسلسلي الأصلية، وتشمل ضمان ١٠ سنوات لعدسات الإيماكس والزيركون، وضمان مدى الحياة لزرعات التيتانيوم.',
        },
        {
          q: 'كيف أحصل على التكلفة الدقيقة وخطة العلاج قبل حجز الطيران؟',
          a: 'فقط أرسل طلبك عبر النموذج في هذه الصفحة أو راسلنا عبر واتساب مع صور واضحة لأسنانك (أو صورة أشعة بانورامية إن وجدت). سيقوم أطباؤنا بدراسة حالتك مجاناً وإرسال خطة علاج مفصلة وواضحة.',
        },
        {
          q: 'ماذا تشمل خدمات الاستقبال VIP والإقامة الفندقية؟',
          a: 'نرتب لك الاستقبال والتوديع من مطار إسطنبول بسيارات VIP خاصة، وجميع التنقلات بين الفندق والعيادة، وحجز فندق ٥ نجوم قريب من المركز الطبي، ومترجم شخصي مرافق لك.',
        },
      ],
    },
    form: {
      badge: 'تقييم طبي مجاني ١٠٠٪ عبر الإنترنت',
      heading: 'اطلب خطة علاجك المجانية',
      intro: 'اترك بياناتك ليتواصل معك فريق التنسيق في إسطنبول ويجهز خطتك العلاجية المخصصة مع التكلفة التقديرية.',
      timelineLabel: 'متى تخطط لإجراء العلاج؟',
      timelines: [
        { value: 'As soon as possible', label: 'في أقرب وقت ممكن' },
        { value: 'Within 1–3 months', label: 'خلال ١ – ٣ أشهر' },
        { value: 'Just researching / price check', label: 'استفسار عن الأسعار' },
      ],
      countryCodeAria: 'رمز الدولة الدولي',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'أدخل اسمك الكامل',
      whatsapp: 'رقم الواتساب',
      whatsappPlaceholder: '5XX XXX XXXX',
      country: 'بلد الإقامة',
      countryPlaceholder: 'مثال: السعودية، الإمارات، ألمانيا، بريطانيا',
      email: 'البريد الإلكتروني (اختياري)',
      emailPlaceholder: 'you@example.com',
      serviceLabel: 'الإجراء المطلوب',
      services: [
        { value: 'hollywood', label: 'هوليوود سمايل وعدسات إيماكس (E-Max®)' },
        { value: 'zirconia', label: 'تيجان الزيركون الألماني وتأهيل الفكين' },
        { value: 'implants', label: 'زراعة الأسنان السويسرية (All-on-4 / All-on-6)' },
        { value: 'dental', label: 'جراحة الأسنان وتجميلها الشامل' },
        { value: 'whitening', label: 'تبييض الأسنان بالليزر وتجميل اللثة' },
        { value: 'hair', label: 'زراعة الشعر (Sapphire FUE / DHI)' },
        { value: 'plastic', label: 'الجراحة التجميلية والترميمية' },
        { value: 'spine', label: 'جراحة العمود الفقري والعظام' },
      ],
      message: 'تفاصيل إضافية أو استفسارك (اختياري)',
      messagePlaceholder: 'أخبرنا عن أهداف ابتسامتك أو عدد الأسنان أو الموعد المناسب للسفر...',
      consent: 'أوافق على تواصل ESTELUX معي بخصوص طلب الاستشارة الطبية المجانية.',
      submit: 'احصل على تقييمي المجاني الآن',
      submitting: 'جاري إرسال طلبك...',
      whatsappDirect: 'أو تحدث فوراً عبر واتساب',
      note: '🔒 سرية تامة ١٠٠٪ • استشارة مجانية بدون التزام • رد خلال ١٠ دقائق',
      errors: {
        name: 'يرجى إدخال الاسم الكامل.',
        phone: 'يرجى إدخال رقم واتساب صحيح.',
        country: 'يرجى إدخال بلد الإقامة.',
        email: 'يرجى إدخال بريد إلكتروني صحيح.',
        consent: 'يرجى الموافقة للمتابعة.',
      },
      confirmTitle: 'تم استلام طلب الاستشارة بنجاح!',
      confirmBody:
        'شكراً لك. تم تحويل طلبك إلى منسق المرضى في إسطنبول. اضغط أدناه لإرسال ملخص طلبك مباشرة عبر واتساب للحصول على أولوية الرد الفوري.',
      confirmWaBtn: 'أرسل عبر واتساب للرد الفوري',
      resetBtn: 'إرسال طلب استشارة آخر',
      waSummaryIntro: 'مرحباً ESTELUX إسطنبول، أرغب في الحصول على استشارة مجانية وخطة علاج.',
      waFieldName: 'الاسم',
      waFieldPhone: 'رقم الواتساب',
      waFieldCountry: 'بلد الإقامة',
      waFieldEmail: 'البريد الإلكتروني',
      waFieldService: 'الإجراء المطلوب',
      waFieldTimeline: 'الموعد المقترح',
      waFieldNotes: 'ملاحظات',
    },
    tourism: {
      heading: 'خدمات سياحة علاجية VIP من فئة ٥ نجوم',
      sub: 'تنسيق مريح ومتكامل من لحظة وصولك مطار إسطنبول وحتى المتابعة بعد العودة.',
      items: [
        {
          title: 'استقبال وتنقلات VIP خاصة',
          desc: 'استقبال خاص من المطار بسيارات مرسيدس VIP وتنقلات مريحة بين الفندق والعيادة طوال إقامتك.',
        },
        {
          title: 'إقامة فندقية فاخرة ٥ نجوم',
          desc: 'ترتيبات إقامة في فنادق فاخرة مختارة بعناية على بُعد دقائق من مركزنا الطبي في إسطنبول.',
        },
        {
          title: 'منسق ومترجم شخصي مرافق',
          desc: 'تنسيق كامل للمواعيد الطبية ومرافقة شخصيةبلغتك الأم في جميع خطوات العلاج.',
        },
      ],
    },
    services: {
      kicker: 'رعاية طبية متكاملة في إسطنبول',
      heading: 'تخصصات طبية وجراحية إضافية',
      sub: 'إلى جانب طب الأسنان التجميلي، تنسق ESTELUX إجراءات جراحية متخصصة في أفضل المستشفيات المعتمدة في إسطنبول.',
      items: [
        {
          value: 'hair',
          title: 'زراعة الشعر الطبيعي',
          desc: 'تقنيات السفير FUE وأقلام تشوي DHI لزراعة الشعر واللحية بكثافة قصوى وخط مقدمة طبيعي.',
          linkText: 'استفسر عن زراعة الشعر',
        },
        {
          value: 'plastic',
          title: 'الجراحة التجميلية والترميمية',
          desc: 'تجميل الأنف، شد الوجه، ونحت القوام بإشراف نخبة من جراحي التجميل المعتمدين.',
          linkText: 'استفسر عن الجراحة التجميلية',
        },
        {
          value: 'spine',
          title: 'جراحة العمود الفقري والعظام',
          desc: 'تشخيص دقيق وجراحات طفيفة التوغل للعمود الفقري والمفاصل بأحدث التقنيات الطبية.',
          linkText: 'استفسر عن جراحة العمود الفقري',
        },
      ],
    },
    ctaBanner: {
      kicker: 'ابدأ رحلة ابتسامتك الجديدة',
      heading: 'هل أنت مستعد لتصميم ابتسامتك المثالية في إسطنبول؟',
      sub: 'تواصل معنا عبر واتساب أو اطلب تقييمك الطبي المجاني اليوم. أسعار واضحة وخدمة VIP متكاملة.',
      primaryBtn: 'اطلب تقييمك المجاني',
      waBtn: 'راسلنا عبر واتساب الآن',
    },
    lightbox: {
      close: 'إغلاق',
      prev: 'الحالة السابقة',
      next: 'الحالة التالية',
      cta: 'اطلب استشارة لابتسامة مماثلة',
    },
    footer: {
      slogan: 'تألّق بجمالك، وعِش بصحة — إسطنبول، تركيا.',
      whatsappLabel: 'واتساب',
      privacy: 'سياسة الخصوصية',
      rights: `© ${new Date().getFullYear()} ESTELUX إسطنبول. جميع الحقوق محفوظة.`,
      privacyTitle: 'سياسة الخصوصية والسرية الطبية',
      privacyText:
        'تحترم ESTELUX خصوصيتك وتحافظ على سرية بياناتك الطبية والشخصية وفق أعلى المعايير الدولية. تُستخدم المعلومات والصور المقدمة حصرياً من قبل الفريق الطبي لتقييم حالتك وإعداد خطة علاجك في إسطنبول ولا يتم مشاركتها مع أي أطراف خارجية.',
      close: 'إغلاق',
    },
    admin: {
      loginTitle: 'بوابة إدارة ESTELUX',
      loginSub: 'أدخل رمز الدخول للتحكم في طلبات الاستشارة الواردة وتعديل صور المعرض والشعار.',
      pinPlaceholder: 'أدخل رمز الدخول',
      pinError: 'رمز الدخول غير صحيح. يرجى المحاولة مرة أخرى.',
      loginBtn: 'فتح لوحة التحكم',
      cancelBtn: 'العودة إلى صفحة الهبوط',
      portalTitle: 'لوحة تحكم ESTELUX',
      portalSub: 'مزامنة فورية ومباشرة مع صفحة الهبوط',
      logout: 'قفل والخروج',
      changePinBtn: 'تغيير رمز الدخول',
      pinModal: {
        title: 'تغيير رمز دخول لوحة التحكم',
        sub: 'قم بتحديث رمز الأمان المطلوب للدخول إلى لوحة تنسيق ESTELUX.',
        currentLabel: 'رمز الدخول الحالي',
        newLabel: 'رمز الدخول الجديد (4 خانات على الأقل)',
        confirmLabel: 'تأكيد رمز الدخول الجديد',
        saveBtn: 'حفظ الرمز الجديد',
        errCurrent: 'رمز الدخول الحالي غير صحيح.',
        errLength: 'يجب أن يتكون الرمز الجديد من 4 خانات على الأقل.',
        errMismatch: 'رمز الدخول الجديد وتأكيده غير متطابقين.',
        successToast: 'تم تحديث رمز دخول لوحة التحكم بنجاح!',
      },
      tabLeads: 'رسائل وطلبات الاستشارة',
      tabMedia: 'إدارة وتعديل الصور',
      stats: {
        total: 'إجمالي الطلبات',
        new: 'طلبات جديدة',
        booked: 'مواعيد مؤكدة',
        activePhotos: 'صور المعرض النشطة',
      },
      leads: {
        searchPlaceholder: 'ابحث بالاسم، رقم الهاتف، البلد، أو الملاحظات...',
        filterAll: 'الكل',
        statusNew: 'جديد',
        statusContacted: 'تم التواصل',
        statusBooked: 'تم الحجز',
        statusArchived: 'مؤرشف',
        exportCsv: 'تصدير Excel / CSV',
        empty: 'لا توجد رسائل تطابق خيارات البحث الحالية.',
        patient: 'المراجع',
        service: 'الخدمة المطلوبة',
        message: 'رسالة المراجع',
        noMessage: 'لم يترك المراجع رسالة إضافية.',
        notesLabel: 'ملاحظات فريق التنسيق (داخلية)',
        notesPlaceholder: 'أضف تفاصيل الرحلة، صور الأشعة، أو موعد المتابعة...',
        whatsappReply: 'رد عبر واتساب',
        deleteConfirm: 'اضغط مرة أخرى لتأكيد الحذف',
        deleteBtn: 'حذف',
        waReplyGreeting: (name: string, service: string) =>
          `مرحباً ${name}، شكراً لتواصلك مع ESTELUX إسطنبول بخصوص خدمة (${service}). فريق التنسيق الطبي جاهز لمساعدتك وتزويدك بخطة العلاج والتفاصيل.`,
      },
      media: {
        brandSectionTitle: 'تعديل شعار العلامة التجارية وصورة الواجهة الرئيسية',
        brandSectionSub: 'ارفع صورة من جهازك (يتم ضغطها تلقائياً) أو الصق رابط صورة مباشر. تظهر التعديلات فوراً في صفحة الهبوط.',
        logoLabel: 'شعار ESTELUX الرسمي',
        heroPhotoLabel: 'الصورة الرئيسية للعيادة في الواجهة',
        uploadBtn: 'رفع صورة من الجهاز',
        urlPlaceholder: 'أو الصق رابط الصورة (https://...)',
        applyUrl: 'تطبيق',
        resetDefaults: 'استعادة جميع الصور الافتراضية',
        addCaseTitle: 'إضافة حالة قبل وبعد جديدة إلى المعرض',
        addCaseSub: 'ارفع صورة الحالة وأدخل العنوان والوصف باللغتين العربية والإنجليزية.',
        caseTitleEn: 'العنوان (بالإنجليزية)',
        caseTitleEnPh: 'مثال: 20 E-Max® Porcelain Veneers',
        caseTitleAr: 'العنوان (بالعربية)',
        caseTitleArPh: 'مثال: ٢٠ عدسة إيماكس خزفية',
        caseCategory: 'التصنيف',
        catHollywood: 'هوليوود سمايل',
        catCosmetic: 'تجميل الأسنان / زيركون وزراعة',
        caseCaptionEn: 'وصف مختصر (بالإنجليزية)',
        caseCaptionAr: 'وصف مختصر (بالعربية)',
        choosePhoto: 'اختر صورة من جهازك',
        orImageUrl: 'أو الصق رابط الصورة',
        addCaseBtn: 'نشر الصورة في المعرض',
        manageCasesTitle: 'التحكم في صور الحالات السريرية الحالية',
        manageCasesSub: 'تعديل العناوين والوصف، إظهار أو إخفاء الصورة في الصفحة، تغيير الترتيب، أو الحذف.',
        visibleBadge: 'ظاهرة في الموقع',
        hiddenBadge: 'مخفية',
        editBtn: 'تعديل البيانات',
        saveBtn: 'حفظ التعديلات',
        cancelEdit: 'إلغاء',
        moveUp: 'تحريك للأعلى',
        moveDown: 'تحريك للأسفل',
        toggleVisibility: 'إظهار / إخفاء',
        savedToast: 'تم حفظ التعديلات ومزامنتها فوراً!',
      },
    },
  },
};

const toArabicDigits = (num: number | string) =>
  String(num).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isSecretAdminUrl = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return hash === '#admin' || hash.startsWith('#admin/') || params.get('admin') === '1';
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.adminSession) === '1';
    } catch {
      return false;
    }
  });

  const [view, setView] = useState<ViewMode>(() => {
    if (!isSecretAdminUrl()) return 'landing';
    try {
      return sessionStorage.getItem(STORAGE_KEYS.adminSession) === '1' ? 'admin' : 'login';
    } catch {
      return 'login';
    }
  });

  const [adminTab, setAdminTab] = useState<AdminTab>('leads');
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.adminPin) || ENV_ADMIN_PIN;
    } catch {
      return ENV_ADMIN_PIN;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Change PIN Modal State
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [currentPinField, setCurrentPinField] = useState('');
  const [newPinField, setNewPinField] = useState('');
  const [confirmPinField, setConfirmPinField] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');

  // Persistent Leads, Gallery Cases, Brand Logo & Hero Photo State
  const [leads, setLeads] = useState<ConsultationLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.leads);
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [dentalCases, setDentalCases] = useState<DentalCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.cases);
      if (!saved) return INITIAL_CASES;
      const parsed: DentalCase[] = JSON.parse(saved);
      // Sanitize any legacy broken file paths
      return parsed.map((c, idx) =>
        BROKEN_LEGACY_FILES.has(c.src)
          ? { ...c, src: INITIAL_CASES[idx % INITIAL_CASES.length].src }
          : c
      );
    } catch {
      return INITIAL_CASES;
    }
  });

  const [brandLogo, setBrandLogo] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.logo);
      if (!saved || BROKEN_LEGACY_FILES.has(saved)) return DEFAULT_ASSETS.logo;
      return saved;
    } catch {
      return DEFAULT_ASSETS.logo;
    }
  });

  const [heroPhoto, setHeroPhoto] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.heroPhoto) || DEFAULT_ASSETS.heroDental;
    } catch {
      return DEFAULT_ASSETS.heroDental;
    }
  });

  // Public Landing Page UI State
  const [activeFilter, setActiveFilter] = useState<'all' | 'hollywood' | 'cosmetic'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Consultation Form State
  const [selectedServiceValue, setSelectedServiceValue] = useState<string>('hollywood');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('As soon as possible');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+49');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState<ConsultationLead | null>(null);
  const fullNameInputRef = useRef<HTMLInputElement | null>(null);

  // Admin Dashboard Controls State
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | LeadStatus>('all');
  const [confirmDeleteLeadId, setConfirmDeleteLeadId] = useState<string | null>(null);

  // Media Manager State
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [heroUrlInput, setHeroUrlInput] = useState('');
  const [newCaseSrc, setNewCaseSrc] = useState('');
  const [newCaseTitleEn, setNewCaseTitleEn] = useState('');
  const [newCaseTitleAr, setNewCaseTitleAr] = useState('');
  const [newCaseCategory, setNewCaseCategory] = useState<'hollywood' | 'cosmetic'>('hollywood');
  const [newCaseCaptionEn, setNewCaseCaptionEn] = useState('');
  const [newCaseCaptionAr, setNewCaseCaptionAr] = useState('');
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DentalCase | null>(null);
  const newCaseFileRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(leads));
    } catch {
      // Ignore storage quota errors
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cases, JSON.stringify(dentalCases));
    } catch {
      // Ignore storage quota errors
    }
  }, [dentalCases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.logo, brandLogo);
    } catch {
      // Ignore storage quota errors
    }
  }, [brandLogo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.heroPhoto, heroPhoto);
    } catch {
      // Ignore storage quota errors
    }
  }, [heroPhoto]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.adminPin, adminPin);
    } catch {
      // Ignore storage quota errors
    }
  }, [adminPin]);

  const isRTL = lang === 'ar';
  const t = TRANSLATIONS[lang];

  // Sync secret admin route on hashchange / popstate
  useEffect(() => {
    const syncRoute = () => {
      if (isSecretAdminUrl()) {
        setView(isAuthenticated ? 'admin' : 'login');
      } else {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, [isAuthenticated]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const hasModal = lightboxIndex !== null || privacyOpen || pinModalOpen;
    document.body.style.overflow = hasModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, privacyOpen, pinModalOpen]);

  const exitToLandingPage = () => {
    if (typeof window !== 'undefined') {
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }
    setView('landing');
  };

  const openAdminPortal = () => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#admin');
    }
    setView(isAuthenticated ? 'admin' : 'login');
  };

  // Visible cases for public landing page
  const visibleCases = dentalCases.filter((c) => c.visible);
  const filteredCases =
    activeFilter === 'all'
      ? visibleCases
      : visibleCases.filter((item) => item.category === activeFilter);

  const selectedServiceObj =
    t.form.services.find((s) => s.value === selectedServiceValue) || t.form.services[0];

  const defaultWaUrl = `https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(
    t.hero.whatsappPrefill
  )}`;

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  // Global keyboard shortcuts for modals & lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        if (privacyOpen) setPrivacyOpen(false);
        if (pinModalOpen) setPinModalOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
        return;
      }
      if (lightboxIndex === null || filteredCases.length === 0) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : isRTL
              ? (prev - 1 + filteredCases.length) % filteredCases.length
              : (prev + 1) % filteredCases.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : isRTL
              ? (prev + 1) % filteredCases.length
              : (prev - 1 + filteredCases.length) % filteredCases.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, privacyOpen, pinModalOpen, mobileMenuOpen, filteredCases.length, isRTL]);

  const handleSelectServiceAndScroll = (serviceValue: string) => {
    setSelectedServiceValue(serviceValue);
    setSubmitted(false);
    setMobileMenuOpen(false);
    const el = document.getElementById('consultation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        fullNameInputRef.current?.focus({ preventScroll: true });
      }, 500);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.name = t.form.errors.name;
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 6 || digits.length > 15) nextErrors.phone = t.form.errors.phone;
    if (!country.trim()) nextErrors.country = t.form.errors.country;
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = t.form.errors.email;
    }
    if (!consent) nextErrors.consent = t.form.errors.consent;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const newLead: ConsultationLead = {
      id: `lead-${Date.now()}`,
      fullName: fullName.trim(),
      countryCode,
      phone: phone.trim(),
      country: country.trim(),
      email: email.trim(),
      serviceValue: selectedServiceValue,
      timeline: selectedTimeline,
      message: message.trim(),
      status: 'new',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      langSubmitted: lang,
    };

    setTimeout(() => {
      setLeads((prev) => [newLead, ...prev]);
      setLastSubmittedLead(newLead);
      setSubmitting(false);
      setSubmitted(true);
      setFullName('');
      setPhone('');
      setCountry('');
      setEmail('');
      setMessage('');
    }, 380);
  };

  const buildWhatsAppLinkFromLead = (lead: ConsultationLead) => {
    const serviceLabel =
      t.form.services.find((s) => s.value === lead.serviceValue)?.label ||
      t.form.services[0].label;

    const summary = [
      t.form.waSummaryIntro,
      `${t.form.waFieldName}: ${lead.fullName}`,
      `${t.form.waFieldPhone}: ${lead.countryCode} ${lead.phone}`,
      `${t.form.waFieldCountry}: ${lead.country}`,
      lead.email ? `${t.form.waFieldEmail}: ${lead.email}` : null,
      `${t.form.waFieldService}: ${serviceLabel}`,
      lead.timeline ? `${t.form.waFieldTimeline}: ${lead.timeline}` : null,
      lead.message ? `${t.form.waFieldNotes}: ${lead.message}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(summary)}`;
  };

  const formatCaseLabel = (index: number) =>
    isRTL ? `${t.hero.casePrefix}${toArabicDigits(index + 1)}` : `${t.hero.casePrefix}${index + 1}`;

  const getServiceLabel = (serviceValue: string) =>
    t.form.services.find((s) => s.value === serviceValue)?.label || serviceValue;

  // Client-side image compression + reader so uploaded photos fit comfortably in localStorage
  const handleImageFileUpload = (
    file: File | undefined,
    callback: (dataUrl: string) => void,
    preserveTransparency = false
  ) => {
    if (!file) return;
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') callback(reader.result);
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          callback(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mime = preserveTransparency ? 'image/png' : 'image/jpeg';
        const compressed = canvas.toDataURL(mime, 0.82);
        callback(compressed);
      };
      img.onerror = () => callback(reader.result as string);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Admin Login / First-Time PIN Setup Handler (No hardcoded secrets in source code)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pinInput.trim();
    if (!adminPin) {
      if (entered.length < 4) {
        setPinError(true);
        return;
      }
      setAdminPin(entered);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.adminSession, '1');
      } catch {
        // Ignore session storage errors
      }
      setPinError(false);
      setPinInput('');
      setView('admin');
      return;
    }
    if (entered === adminPin) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.adminSession, '1');
      } catch {
        // Ignore session storage errors
      }
      setPinError(false);
      setPinInput('');
      setView('admin');
    } else {
      setPinError(true);
    }
  };

  // Change Admin PIN Handler
  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinField.trim() !== adminPin) {
      setPinChangeError(t.admin.pinModal.errCurrent);
      return;
    }
    if (newPinField.trim().length < 4) {
      setPinChangeError(t.admin.pinModal.errLength);
      return;
    }
    if (newPinField.trim() !== confirmPinField.trim()) {
      setPinChangeError(t.admin.pinModal.errMismatch);
      return;
    }
    setAdminPin(newPinField.trim());
    setCurrentPinField('');
    setNewPinField('');
    setConfirmPinField('');
    setPinChangeError('');
    setPinModalOpen(false);
    showToast(t.admin.pinModal.successToast);
  };

  // Export Leads to CSV
  const exportLeadsCsv = () => {
    const headers = [
      'ID',
      'Full Name',
      'Phone',
      'Country',
      'Email',
      'Service',
      'Timeline',
      'Message',
      'Status',
      'Admin Notes',
      'Created At',
    ];
    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.countryCode} ${l.phone}"`,
      `"${l.country.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${getServiceLabel(l.serviceValue)}"`,
      `"${(l.timeline || '').replace(/"/g, '""')}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      l.status,
      `"${l.adminNotes.replace(/"/g, '""')}"`,
      l.createdAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `estelux-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads in Admin Dashboard
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
    const q = leadSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      lead.fullName.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.country.toLowerCase().includes(q) ||
      lead.message.toLowerCase().includes(q) ||
      lead.adminNotes.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Add New Clinical Case Handler
  const handleAddNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseSrc.trim()) return;
    const titleEn = newCaseTitleEn.trim() || 'Smile Transformation';
    const titleAr = newCaseTitleAr.trim() || 'تجميل الابتسامة';
    const created: DentalCase = {
      id: `case-${Date.now()}`,
      src: newCaseSrc.trim(),
      category: newCaseCategory,
      titleEn,
      titleAr,
      tagEn: newCaseCategory === 'hollywood' ? 'Hollywood Smile' : 'Cosmetic Dentistry',
      tagAr: newCaseCategory === 'hollywood' ? 'هوليوود سمايل' : 'علاج الأسنان وتجميلها',
      captionEn:
        newCaseCaptionEn.trim() ||
        'Personalized aesthetic dental transformation in Istanbul.',
      captionAr:
        newCaseCaptionAr.trim() ||
        'تجميل وتصميم الابتسامة المخصص في إسطنبول.',
      visible: true,
    };
    setDentalCases((prev) => [created, ...prev]);
    setNewCaseSrc('');
    setNewCaseTitleEn('');
    setNewCaseTitleAr('');
    setNewCaseCaptionEn('');
    setNewCaseCaptionAr('');
    if (newCaseFileRef.current) newCaseFileRef.current.value = '';
    showToast(t.admin.media.savedToast);
  };

  const moveCase = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= dentalCases.length) return;
    const copy = [...dentalCases];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    setDentalCases(copy);
    showToast(t.admin.media.savedToast);
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div
      id="top"
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={lang}
      className="min-h-screen bg-[#FAF7F2] text-[#4A3F3B] selection:bg-[#9A4F3E] selection:text-white antialiased"
      style={{
        fontFamily: isRTL
          ? "'Cairo', system-ui, sans-serif"
          : "'Montserrat', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Live Save Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 end-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1918] text-white text-xs sm:text-sm font-semibold shadow-xl border border-[#C47D6B]/40"
        >
          <CheckCircle2 className="w-4 h-4 text-[#1E9E54]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Admin Preview Bar when logged in as Coordinator and viewing public site */}
      {view === 'landing' && isAuthenticated && (
        <div className="bg-[#1C1918] text-white text-xs py-2 px-4 border-b border-[#C47D6B]/40">
          <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#EACDA3]">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.nav.returnToAdmin}</span>
            </span>
            <button
              type="button"
              onClick={openAdminPortal}
              className="px-3 py-1 rounded-lg bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white font-bold text-xs cursor-pointer transition-colors"
            >
              {t.nav.dashboardBtn}
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STICKY MINIMAL LUXURY HEADER (PUBLIC SITE & ADMIN MODE)
      ====================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FCF9F7]/95 backdrop-blur-md border-b border-[#E8C9C1]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 h-[74px] flex items-center justify-between gap-4">
          {/* ESTELUX Horizontal Brand Lockup */}
          <a
            href="#top"
            onClick={(e) => {
              if (view !== 'landing') {
                e.preventDefault();
                exitToLandingPage();
              }
            }}
            aria-label={t.nav.homeAria}
            className="inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
          >
            <div className="bg-white rounded-xl px-2 py-1 border border-[#E8C9C1] flex items-center justify-center shrink-0">
              <img
                src={brandLogo === DEFAULT_ASSETS.logo ? '/estelux-emblem.png' : brandLogo}
                alt={t.nav.logoAlt}
                width={48}
                height={38}
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/estelux-logo.png')) {
                    target.src = DEFAULT_ASSETS.logo;
                  }
                }}
                className="h-9 w-auto object-contain block"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-[0.26em] text-[#9E5B4B] leading-none">
                ESTELUX
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.04em] text-[#6B504A] mt-1 whitespace-nowrap">
                {t.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Clean Section Navigation */}
          {view === 'landing' && (
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-[#3B2A26] whitespace-nowrap"
            >
              <a href="#gallery" className="hover:text-[#9A4F3E] transition-colors py-1">
                {t.nav.gallery}
              </a>
              <a href="#treatments" className="hover:text-[#9A4F3E] transition-colors py-1">
                {t.nav.treatments}
              </a>
              <a href="#journey" className="hover:text-[#9A4F3E] transition-colors py-1">
                {t.nav.journey}
              </a>
              <a href="#faq" className="hover:text-[#9A4F3E] transition-colors py-1">
                {t.nav.faq}
              </a>
            </nav>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {view !== 'landing' && (
              <button
                type="button"
                onClick={exitToLandingPage}
                className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-[#EFE7DD] hover:bg-[#E5D6CE] text-[#1C1918] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{t.nav.backToSite}</span>
              </button>
            )}

            {/* Bilingual Toggle (EN / العربية) */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-[#DDB0A5] bg-white hover:border-[#9A4F3E] text-xs font-bold text-[#1C1918] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-[#9A4F3E] shrink-0" />
              <span>{t.nav.langSwitch}</span>
            </button>

            {view === 'landing' && (
              <>
                <a
                  href={defaultWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.nav.whatsappAria}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 sm:px-4 rounded-xl bg-[#157A3E] hover:bg-[#106231] text-white text-xs font-bold transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{t.nav.whatsapp}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label="Toggle Menu"
                  aria-expanded={mobileMenuOpen}
                  className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#DDB0A5] bg-white text-[#1C1918] cursor-pointer shrink-0"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {view === 'landing' && mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#E8C9C1] px-4 py-4 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#1C1918]">
              <a
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-[#FCF9F7] hover:bg-[#F7EAE6]"
              >
                {t.nav.gallery}
              </a>
              <a
                href="#treatments"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-[#FCF9F7] hover:bg-[#F7EAE6]"
              >
                {t.nav.treatments}
              </a>
              <a
                href="#journey"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-[#FCF9F7] hover:bg-[#F7EAE6]"
              >
                {t.nav.journey}
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-[#FCF9F7] hover:bg-[#F7EAE6]"
              >
                {t.nav.faq}
              </a>
            </div>
            <a
              href="#consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 rounded-xl bg-[#9A4F3E] text-white text-center text-xs font-bold"
            >
              {t.hero.primaryCta}
            </a>
          </div>
        )}
      </header>

      {/* =====================================================================
          VIEW 1: ADMIN LOGIN PORTAL (#admin)
      ====================================================================== */}
      {view === 'login' && (
        <main className="py-16 sm:py-24 px-4">
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5D6CE] p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFE7DD] flex items-center justify-center text-[#C47D6B]">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#1C1918]">{t.admin.loginTitle}</h1>
              <p className="text-xs sm:text-sm text-[#5A4E4A]">{t.admin.loginSub}</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder={t.admin.pinPlaceholder}
                  autoFocus
                  className={`w-full min-h-[48px] px-4 rounded-xl border text-center tracking-[0.25em] font-bold text-lg text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B] ${pinError ? 'border-red-600' : 'border-[#CDBBB2]'
                    }`}
                />
                {pinError && (
                  <p className="mt-2 text-xs text-red-700 text-center font-semibold">
                    {t.admin.pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                {t.admin.loginBtn}
              </button>
            </form>

            <div className="pt-2 border-t border-[#E5D6CE] flex items-center justify-center">
              <button
                type="button"
                onClick={exitToLandingPage}
                className="text-xs font-semibold text-[#52443F] hover:text-[#1C1918] cursor-pointer"
              >
                {t.admin.cancelBtn}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 2: ADMIN DASHBOARD (LEADS INBOX + MEDIA/GALLERY MANAGER)
      ====================================================================== */}
      {view === 'admin' && isAuthenticated && (
        <main className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6">
          {/* Top Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5D6CE]">
            <div>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#C47D6B]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C1918]">
                  {t.admin.portalTitle}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#5A4E4A] mt-1">{t.admin.portalSub}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCurrentPinField('');
                  setNewPinField('');
                  setConfirmPinField('');
                  setPinChangeError('');
                  setPinModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CDBBB2] bg-white hover:border-[#C47D6B] text-xs font-semibold text-[#1C1918] cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#C47D6B]" />
                <span>{t.admin.changePinBtn}</span>
              </button>

              <button
                type="button"
                onClick={exitToLandingPage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CDBBB2] bg-[#FAF7F2] hover:border-[#C47D6B] text-xs font-semibold text-[#1C1918] cursor-pointer"
              >
                <span>{t.nav.backToSite}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  try {
                    sessionStorage.removeItem(STORAGE_KEYS.adminSession);
                  } catch {
                    // Ignore
                  }
                  exitToLandingPage();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1918] text-white text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.admin.logout}</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#52443F]">
                <span>{t.admin.stats.total}</span>
                <Users className="w-4 h-4 text-[#C47D6B]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1C1918]">
                {isRTL ? toArabicDigits(leads.length) : leads.length}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#52443F]">
                <span>{t.admin.stats.new}</span>
                <Clock className="w-4 h-4 text-[#8C4332]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#8C4332]">
                {isRTL ? toArabicDigits(newLeadsCount) : newLeadsCount}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#52443F]">
                <span>{t.admin.stats.booked}</span>
                <CheckSquare className="w-4 h-4 text-[#1E9E54]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1E9E54]">
                {isRTL
                  ? toArabicDigits(leads.filter((l) => l.status === 'booked').length)
                  : leads.filter((l) => l.status === 'booked').length}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#52443F]">
                <span>{t.admin.stats.activePhotos}</span>
                <ImageIcon className="w-4 h-4 text-[#C47D6B]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1C1918]">
                {isRTL ? toArabicDigits(visibleCases.length) : visibleCases.length}
              </p>
            </div>
          </div>

          {/* Primary Dashboard Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#E5D6CE] pb-3">
            <button
              type="button"
              onClick={() => setAdminTab('leads')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${adminTab === 'leads'
                ? 'bg-[#9A4F3E] text-white shadow-xs'
                : 'bg-white text-[#4A3F3B] border border-[#E5D6CE] hover:border-[#C47D6B]'
                }`}
            >
              <Inbox className="w-4 h-4" />
              <span>{t.admin.tabLeads}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${adminTab === 'leads'
                  ? 'bg-white text-[#C47D6B]'
                  : 'bg-[#EFE7DD] text-[#1C1918]'
                  }`}
              >
                {isRTL ? toArabicDigits(leads.length) : leads.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab('media')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${adminTab === 'media'
                ? 'bg-[#9A4F3E] text-white shadow-xs'
                : 'bg-white text-[#4A3F3B] border border-[#E5D6CE] hover:border-[#C47D6B]'
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t.admin.tabMedia}</span>
            </button>
          </div>

          {/* -----------------------------------------------------------------
              TAB A: CONSULTATION MESSAGES / LEADS INBOX
          ------------------------------------------------------------------ */}
          {adminTab === 'leads' && (
            <div className="space-y-4">
              {/* Filter & Search Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5D6CE] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#52443F] absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder={t.admin.leads.searchPlaceholder}
                    className="w-full min-h-[42px] ps-10 pe-3.5 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { key: 'all', label: t.admin.leads.filterAll },
                      { key: 'new', label: t.admin.leads.statusNew },
                      { key: 'contacted', label: t.admin.leads.statusContacted },
                      { key: 'booked', label: t.admin.leads.statusBooked },
                      { key: 'archived', label: t.admin.leads.statusArchived },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setLeadStatusFilter(st.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${leadStatusFilter === st.key
                        ? 'bg-[#1C1918] text-white'
                        : 'bg-[#FAF7F2] text-[#4A3F3B] border border-[#E5D6CE] hover:border-[#C47D6B]'
                        }`}
                    >
                      {st.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={exportLeadsCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFE7DD] hover:bg-[#E5D6CE] text-[#1C1918] text-xs font-bold cursor-pointer ms-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.admin.leads.exportCsv}</span>
                  </button>
                </div>
              </div>

              {/* Leads Cards List */}
              {filteredLeads.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E5D6CE] p-12 text-center text-sm text-[#52443F]">
                  {t.admin.leads.empty}
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredLeads.map((lead) => {
                    const serviceName = getServiceLabel(lead.serviceValue);
                    const waDigits = `${lead.countryCode}${lead.phone}`.replace(/\D/g, '');
                    const waReplyHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(
                      t.admin.leads.waReplyGreeting(lead.fullName, serviceName)
                    )}`;

                    const statusBadgeStyle =
                      lead.status === 'new'
                        ? 'bg-[#9A4F3E]/15 text-[#A86554] border-[#C47D6B]/30'
                        : lead.status === 'contacted'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : lead.status === 'booked'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200';

                    return (
                      <article
                        key={lead.id}
                        className="bg-white rounded-2xl border border-[#E5D6CE] p-5 space-y-4 shadow-2xs"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#EFE7DD] pb-3.5">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-[#1C1918]">
                                {lead.fullName}
                              </h3>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadgeStyle}`}
                              >
                                {lead.status === 'new'
                                  ? t.admin.leads.statusNew
                                  : lead.status === 'contacted'
                                    ? t.admin.leads.statusContacted
                                    : lead.status === 'booked'
                                      ? t.admin.leads.statusBooked
                                      : t.admin.leads.statusArchived}
                              </span>
                              {lead.timeline && (
                                <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5D6CE] text-[11px] font-semibold text-[#5A4E4A]">
                                  {lead.timeline}
                                </span>
                              )}
                              <span className="text-[11px] text-[#52443F]">
                                • {formatDate(lead.createdAt)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4A3F3B]">
                              <span dir="ltr" className="font-semibold text-[#1C1918]">
                                {lead.countryCode} {lead.phone}
                              </span>
                              <span>• {lead.country}</span>
                              {lead.email && <span>• {lead.email}</span>}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as LeadStatus;
                                setLeads((prev) =>
                                  prev.map((item) =>
                                    item.id === lead.id ? { ...item, status: nextStatus } : item
                                  )
                                );
                                showToast(t.admin.media.savedToast);
                              }}
                              className="min-h-[38px] px-3 rounded-xl border border-[#CDBBB2] bg-[#FAF7F2] text-xs font-bold text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                            >
                              <option value="new">{t.admin.leads.statusNew}</option>
                              <option value="contacted">{t.admin.leads.statusContacted}</option>
                              <option value="booked">{t.admin.leads.statusBooked}</option>
                              <option value="archived">{t.admin.leads.statusArchived}</option>
                            </select>

                            <a
                              href={waReplyHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-xl bg-[#157A3E] hover:bg-[#198747] text-white text-xs font-bold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{t.admin.leads.whatsappReply}</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirmDeleteLeadId === lead.id) {
                                  setLeads((prev) => prev.filter((item) => item.id !== lead.id));
                                  setConfirmDeleteLeadId(null);
                                } else {
                                  setConfirmDeleteLeadId(lead.id);
                                  setTimeout(() => setConfirmDeleteLeadId(null), 3000);
                                }
                              }}
                              className={`inline-flex items-center gap-1 min-h-[38px] px-3 rounded-xl border text-xs font-semibold cursor-pointer ${confirmDeleteLeadId === lead.id
                                ? 'bg-red-600 text-white border-red-600'
                                : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                                }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>
                                {confirmDeleteLeadId === lead.id
                                  ? t.admin.leads.deleteConfirm
                                  : t.admin.leads.deleteBtn}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          <div className="lg:col-span-6 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EFE7DD] space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#8C4332]">{serviceName}</span>
                              <span className="text-[11px] uppercase text-[#52443F]">
                                {lead.langSubmitted}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#1C1918] leading-relaxed flex items-start gap-2">
                              <FileText className="w-4 h-4 text-[#52443F] shrink-0 mt-0.5" />
                              <span>{lead.message || t.admin.leads.noMessage}</span>
                            </p>
                          </div>

                          <div className="lg:col-span-6 space-y-1">
                            <label className="block text-xs font-bold text-[#1C1918]">
                              {t.admin.leads.notesLabel}
                            </label>
                            <textarea
                              rows={2}
                              value={lead.adminNotes}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLeads((prev) =>
                                  prev.map((item) =>
                                    item.id === lead.id ? { ...item, adminNotes: val } : item
                                  )
                                );
                              }}
                              placeholder={t.admin.leads.notesPlaceholder}
                              className="w-full px-3 py-2 rounded-xl border border-[#CDBBB2] bg-white text-xs sm:text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                            />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB B: MEDIA & GALLERY MANAGER (LOGO, HERO PHOTO, BEFORE & AFTER)
          ------------------------------------------------------------------ */}
          {adminTab === 'media' && (
            <div className="space-y-8">
              {/* 1. Brand Logo & Hero Banner Editor */}
              <section className="bg-white rounded-2xl border border-[#E5D6CE] p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE7DD] pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#1C1918]">
                      {t.admin.media.brandSectionTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5A4E4A] mt-0.5">
                      {t.admin.media.brandSectionSub}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBrandLogo(DEFAULT_ASSETS.logo);
                      setHeroPhoto(DEFAULT_ASSETS.heroDental);
                      setDentalCases(INITIAL_CASES);
                      showToast(t.admin.media.savedToast);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CDBBB2] bg-[#FAF7F2] hover:border-[#C47D6B] text-xs font-bold text-[#1C1918] self-start cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C47D6B]" />
                    <span>{t.admin.media.resetDefaults}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Logo Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D6CE] space-y-3">
                    <p className="text-sm font-bold text-[#1C1918]">{t.admin.media.logoLabel}</p>
                    <div className="h-28 rounded-xl bg-white flex items-center justify-center p-3 border border-[#E8C9C1]">
                      <img
                        src={brandLogo}
                        alt="ESTELUX Logo Preview"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_ASSETS.logo;
                        }}
                        className="max-h-24 w-auto object-contain"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{t.admin.media.uploadBtn}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(
                              e.target.files?.[0],
                              (url) => {
                                setBrandLogo(url);
                                showToast(t.admin.media.savedToast);
                              },
                              true
                            )
                          }
                        />
                      </label>

                      <div className="flex-1 min-w-[180px] flex gap-1.5">
                        <input
                          type="url"
                          value={logoUrlInput}
                          onChange={(e) => setLogoUrlInput(e.target.value)}
                          placeholder={t.admin.media.urlPlaceholder}
                          className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-[#CDBBB2] bg-white text-xs text-[#1C1918]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (logoUrlInput.trim()) {
                              setBrandLogo(logoUrlInput.trim());
                              setLogoUrlInput('');
                              showToast(t.admin.media.savedToast);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1C1918] text-white text-xs font-bold cursor-pointer"
                        >
                          {t.admin.media.applyUrl}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hero Banner Photo Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D6CE] space-y-3">
                    <p className="text-sm font-bold text-[#1C1918]">
                      {t.admin.media.heroPhotoLabel}
                    </p>
                    <div className="h-28 rounded-xl bg-[#EFE7DD] overflow-hidden border border-[#E5D6CE]">
                      <img
                        src={heroPhoto}
                        alt="Hero Clinic Preview"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_ASSETS.heroDental;
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{t.admin.media.uploadBtn}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e.target.files?.[0], (url) => {
                              setHeroPhoto(url);
                              showToast(t.admin.media.savedToast);
                            })
                          }
                        />
                      </label>

                      <div className="flex-1 min-w-[180px] flex gap-1.5">
                        <input
                          type="url"
                          value={heroUrlInput}
                          onChange={(e) => setHeroUrlInput(e.target.value)}
                          placeholder={t.admin.media.urlPlaceholder}
                          className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-[#CDBBB2] bg-white text-xs text-[#1C1918]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (heroUrlInput.trim()) {
                              setHeroPhoto(heroUrlInput.trim());
                              setHeroUrlInput('');
                              showToast(t.admin.media.savedToast);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1C1918] text-white text-xs font-bold cursor-pointer"
                        >
                          {t.admin.media.applyUrl}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Add New Before & After Clinical Case */}
              <section className="bg-white rounded-2xl border border-[#E5D6CE] p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#1C1918]">
                    {t.admin.media.addCaseTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A4E4A] mt-0.5">
                    {t.admin.media.addCaseSub}
                  </p>
                </div>

                <form onSubmit={handleAddNewCase} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-2">
                    <div className="aspect-[4/3] max-h-56 w-full rounded-xl border-2 border-dashed border-[#CDBBB2] bg-[#FAF7F2] flex flex-col items-center justify-center overflow-hidden p-2">
                      {newCaseSrc ? (
                        <img
                          src={newCaseSrc}
                          alt="New case preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center space-y-1.5 p-3">
                          <ImageIcon className="w-7 h-7 text-[#C47D6B] mx-auto" />
                          <p className="text-xs font-semibold text-[#5A4E4A]">
                            {t.admin.media.choosePhoto}
                          </p>
                        </div>
                      )}
                    </div>

                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#EFE7DD] hover:bg-[#E5D6CE] text-[#1C1918] text-xs font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#C47D6B]" />
                      <span>{t.admin.media.choosePhoto}</span>
                      <input
                        ref={newCaseFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e.target.files?.[0], (url) => setNewCaseSrc(url))
                        }
                      />
                    </label>

                    <input
                      type="text"
                      value={newCaseSrc}
                      onChange={(e) => setNewCaseSrc(e.target.value)}
                      placeholder={t.admin.media.orImageUrl}
                      className="w-full px-3 py-2 rounded-xl border border-[#CDBBB2] text-xs text-[#1C1918]"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1C1918] mb-1">
                          {t.admin.media.caseTitleEn}
                        </label>
                        <input
                          type="text"
                          value={newCaseTitleEn}
                          onChange={(e) => setNewCaseTitleEn(e.target.value)}
                          placeholder={t.admin.media.caseTitleEnPh}
                          className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C1918] mb-1">
                          {t.admin.media.caseTitleAr}
                        </label>
                        <input
                          type="text"
                          value={newCaseTitleAr}
                          onChange={(e) => setNewCaseTitleAr(e.target.value)}
                          placeholder={t.admin.media.caseTitleArPh}
                          className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1918] mb-1">
                        {t.admin.media.caseCategory}
                      </label>
                      <select
                        value={newCaseCategory}
                        onChange={(e) =>
                          setNewCaseCategory(e.target.value as 'hollywood' | 'cosmetic')
                        }
                        className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] bg-white text-xs sm:text-sm font-semibold"
                      >
                        <option value="hollywood">{t.admin.media.catHollywood}</option>
                        <option value="cosmetic">{t.admin.media.catCosmetic}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1C1918] mb-1">
                          {t.admin.media.caseCaptionEn}
                        </label>
                        <input
                          type="text"
                          value={newCaseCaptionEn}
                          onChange={(e) => setNewCaseCaptionEn(e.target.value)}
                          className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C1918] mb-1">
                          {t.admin.media.caseCaptionAr}
                        </label>
                        <input
                          type="text"
                          value={newCaseCaptionAr}
                          onChange={(e) => setNewCaseCaptionAr(e.target.value)}
                          className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={!newCaseSrc.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] disabled:opacity-50 text-white text-xs sm:text-sm font-bold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.admin.media.addCaseBtn}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </section>

              {/* 3. Manage Existing Clinical Cases */}
              <section className="bg-white rounded-2xl border border-[#E5D6CE] p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#1C1918]">
                    {t.admin.media.manageCasesTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A4E4A] mt-0.5">
                    {t.admin.media.manageCasesSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dentalCases.map((item, idx) => {
                    const isEditing = editingCaseId === item.id && editDraft !== null;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 ${item.visible
                          ? 'bg-[#FAF7F2] border-[#E5D6CE]'
                          : 'bg-stone-100/80 border-stone-300 opacity-80'
                          }`}
                      >
                        <div className="w-full sm:w-36 shrink-0 space-y-2">
                          <div className="aspect-[4/3] rounded-xl bg-white border border-[#E5D6CE] overflow-hidden">
                            <img
                              src={isEditing ? editDraft.src : item.src}
                              alt={item.titleEn}
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_ASSETS.case1;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <label className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-white border border-[#CDBBB2] hover:border-[#C47D6B] text-[11px] font-bold text-[#1C1918] cursor-pointer">
                            <Upload className="w-3 h-3 text-[#C47D6B]" />
                            <span>{t.admin.media.uploadBtn}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (url) => {
                                  if (isEditing && editDraft) {
                                    setEditDraft({ ...editDraft, src: url });
                                  } else {
                                    setDentalCases((prev) =>
                                      prev.map((c) => (c.id === item.id ? { ...c, src: url } : c))
                                    );
                                    showToast(t.admin.media.savedToast);
                                  }
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                          {isEditing && editDraft ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editDraft.titleEn}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, titleEn: e.target.value })
                                }
                                placeholder={t.admin.media.caseTitleEn}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={editDraft.titleAr}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, titleAr: e.target.value })
                                }
                                placeholder={t.admin.media.caseTitleAr}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={editDraft.captionEn}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, captionEn: e.target.value })
                                }
                                placeholder={t.admin.media.caseCaptionEn}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs"
                              />
                              <input
                                type="text"
                                value={editDraft.captionAr}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, captionAr: e.target.value })
                                }
                                placeholder={t.admin.media.caseCaptionAr}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs"
                              />
                              <select
                                value={editDraft.category}
                                onChange={(e) => {
                                  const cat = e.target.value as 'hollywood' | 'cosmetic';
                                  setEditDraft({
                                    ...editDraft,
                                    category: cat,
                                    tagEn:
                                      cat === 'hollywood'
                                        ? 'Hollywood Smile'
                                        : 'Cosmetic Dentistry',
                                    tagAr:
                                      cat === 'hollywood'
                                        ? 'هوليوود سمايل'
                                        : 'علاج الأسنان وتجميلها',
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs font-semibold"
                              >
                                <option value="hollywood">{t.admin.media.catHollywood}</option>
                                <option value="cosmetic">{t.admin.media.catCosmetic}</option>
                              </select>
                              <input
                                type="text"
                                value={editDraft.src}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, src: e.target.value })
                                }
                                placeholder={t.admin.media.orImageUrl}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-[11px]"
                              />
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.visible
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-200 text-stone-700'
                                    }`}
                                >
                                  {item.visible
                                    ? t.admin.media.visibleBadge
                                    : t.admin.media.hiddenBadge}
                                </span>
                                <span className="text-[11px] font-bold text-[#8C4332]">
                                  {isRTL ? item.tagAr : item.tagEn}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-[#1C1918]">{item.titleEn}</h3>
                              <p className="text-xs font-semibold text-[#5A4E4A]">{item.titleAr}</p>
                              <p className="text-[11px] text-[#52443F] line-clamp-2 pt-0.5">
                                {isRTL ? item.captionAr : item.captionEn}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E5D6CE]">
                            {isEditing && editDraft ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDentalCases((prev) =>
                                      prev.map((c) => (c.id === item.id ? editDraft : c))
                                    );
                                    setEditingCaseId(null);
                                    setEditDraft(null);
                                    showToast(t.admin.media.savedToast);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#157A3E] text-white text-xs font-bold cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{t.admin.media.saveBtn}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCaseId(null);
                                    setEditDraft(null);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs font-semibold cursor-pointer"
                                >
                                  {t.admin.media.cancelEdit}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCaseId(item.id);
                                    setEditDraft({ ...item });
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#CDBBB2] hover:border-[#C47D6B] text-xs font-semibold text-[#1C1918] cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3 text-[#C47D6B]" />
                                  <span>{t.admin.media.editBtn}</span>
                                </button>

                                <button
                                  type="button"
                                  title={t.admin.media.toggleVisibility}
                                  onClick={() => {
                                    setDentalCases((prev) =>
                                      prev.map((c) =>
                                        c.id === item.id ? { ...c, visible: !c.visible } : c
                                      )
                                    );
                                    showToast(t.admin.media.savedToast);
                                  }}
                                  className="p-1.5 rounded-lg bg-white border border-[#CDBBB2] hover:border-[#C47D6B] text-[#1C1918] cursor-pointer"
                                >
                                  {item.visible ? (
                                    <Eye className="w-3.5 h-3.5 text-[#1E9E54]" />
                                  ) : (
                                    <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  title={t.admin.media.moveUp}
                                  disabled={idx === 0}
                                  onClick={() => moveCase(idx, -1)}
                                  className="p-1.5 rounded-lg bg-white border border-[#CDBBB2] disabled:opacity-40 text-[#1C1918] cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  title={t.admin.media.moveDown}
                                  disabled={idx === dentalCases.length - 1}
                                  onClick={() => moveCase(idx, 1)}
                                  className="p-1.5 rounded-lg bg-white border border-[#CDBBB2] disabled:opacity-40 text-[#1C1918] cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  title={t.admin.leads.deleteBtn}
                                  onClick={() => {
                                    setDentalCases((prev) => prev.filter((c) => c.id !== item.id));
                                    showToast(t.admin.media.savedToast);
                                  }}
                                  className="p-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-700 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </main>
      )}

      {/* =====================================================================
          VIEW 3: PUBLIC HIGH-CONVERTING DENTAL LANDING PAGE
      ====================================================================== */}
      {view === 'landing' && (
        <main>
          {/* =================================================================
              SECTION 01 — CLEAN LUXURY HERO + SIMPLE CONSULTATION FORM
          ================================================================== */}
          <section
            aria-labelledby="main-heading"
            className="bg-gradient-to-b from-[#F7EAE6]/60 to-[#FCF9F7] py-10 sm:py-16 border-b border-[#E8C9C1]"
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* LEFT COLUMN: Clean Headline, Concise Value & Minimal Trust Strip */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8C4332]">
                    {t.hero.kicker}
                  </p>

                  <h1
                    id="main-heading"
                    className="text-3xl sm:text-5xl font-extrabold text-[#1C1918] leading-[1.12] tracking-tight"
                  >
                    {t.hero.title}
                  </h1>

                  <p className="text-sm sm:text-base text-[#4A3F3B] leading-relaxed max-w-xl">
                    {t.hero.lead}
                  </p>
                </div>

                {/* Primary CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#consultation"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectServiceAndScroll(selectedServiceValue);
                    }}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white font-bold text-sm shadow-sm transition-colors whitespace-nowrap"
                  >
                    <span>{t.hero.primaryCta}</span>
                    {isRTL ? (
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    )}
                  </a>

                  <a
                    href={defaultWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-[#157A3E] hover:bg-[#106231] text-white font-bold text-sm shadow-sm transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{t.hero.whatsappCta}</span>
                  </a>
                </div>

                {/* Minimal 3-Item Trust Row (No Heavy Boxes) */}
                <div className="pt-4 border-t border-[#E8C9C1] grid grid-cols-3 gap-4 max-w-lg">
                  {t.hero.metrics.slice(0, 3).map((m) => (
                    <div key={m.label}>
                      <p className="text-lg sm:text-xl font-extrabold text-[#1C1918]">
                        {m.value}
                      </p>
                      <p className="text-[11px] font-medium text-[#52443F] mt-0.5">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Clean, Spacious Consultation Form */}
              <section
                id="consultation"
                aria-labelledby="form-heading"
                className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8C9C1] shadow-[0_14px_40px_rgba(61,34,28,0.06)] scroll-mt-24 max-w-xl w-full lg:ms-auto"
              >
                <h2
                  id="form-heading"
                  className="text-2xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.form.heading}
                </h2>
                <p className="mt-1.5 mb-5 text-xs sm:text-sm text-[#52443F] leading-relaxed">
                  {t.form.intro}
                </p>

                {submitted && lastSubmittedLead ? (
                  <div className="p-5 rounded-2xl bg-[#FCF9F7] border border-[#E8C9C1] space-y-3.5">
                    <div className="flex items-center gap-2 text-[#0F6934] font-extrabold text-base">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>{t.form.confirmTitle}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A3F3B] leading-relaxed">
                      {t.form.confirmBody}
                    </p>
                    <a
                      href={buildWhatsAppLinkFromLead(lastSubmittedLead)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#157A3E] hover:bg-[#106231] text-white font-bold text-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.form.confirmWaBtn}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setLastSubmittedLead(null);
                      }}
                      className="block text-xs font-bold text-[#8C4332] underline underline-offset-4 pt-1 cursor-pointer"
                    >
                      {t.form.resetBtn}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Quick Single-Line Timeline Selector Pills */}
                    <div>
                      <span className="block text-xs font-bold text-[#1C1918] mb-1.5">
                        {t.form.timelineLabel}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {t.form.timelines.map((tl, idx) => {
                          const compactLabel = isRTL
                            ? idx === 0
                              ? 'أقرب وقت'
                              : idx === 1
                              ? '١ – ٣ أشهر'
                              : 'الأسعار'
                            : idx === 0
                            ? 'ASAP'
                            : idx === 1
                            ? '1–3 Months'
                            : 'Price Check';
                          return (
                            <button
                              key={tl.value}
                              type="button"
                              onClick={() => setSelectedTimeline(tl.value)}
                              className={`h-10 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center whitespace-nowrap ${
                                selectedTimeline === tl.value
                                  ? 'bg-[#3D221C] text-white border-[#3D221C]'
                                  : 'bg-[#FCF9F7] text-[#4A3F3B] border-[#E8C9C1] hover:border-[#B27262]'
                              }`}
                            >
                              {compactLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Full Name & Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="full-name"
                          className="block text-xs font-bold text-[#1C1918] mb-1.5"
                        >
                          {t.form.fullName} *
                        </label>
                        <input
                          ref={fullNameInputRef}
                          id="full-name"
                          type="text"
                          autoComplete="name"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.name) setErrors({ ...errors, name: '' });
                          }}
                          placeholder={t.form.fullNamePlaceholder}
                          className={`w-full h-[46px] px-3.5 rounded-xl border bg-white text-base sm:text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#B27262] ${
                            errors.name ? 'border-red-600' : 'border-[#DDB0A5]'
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-700">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="country"
                          className="block text-xs font-bold text-[#1C1918] mb-1.5"
                        >
                          {t.form.country} *
                        </label>
                        <input
                          id="country"
                          type="text"
                          autoComplete="country-name"
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            if (errors.country) setErrors({ ...errors, country: '' });
                          }}
                          placeholder={t.form.countryPlaceholder}
                          className={`w-full h-[46px] px-3.5 rounded-xl border bg-white text-base sm:text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#B27262] ${
                            errors.country ? 'border-red-600' : 'border-[#DDB0A5]'
                          }`}
                        />
                        {errors.country && (
                          <p className="mt-1 text-xs text-red-700">{errors.country}</p>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label
                        htmlFor="whatsapp-phone"
                        className="block text-xs font-bold text-[#1C1918] mb-1.5"
                      >
                        {t.form.whatsapp} *
                      </label>
                      <div className="flex gap-2" dir="ltr">
                        <select
                          aria-label={t.form.countryCodeAria}
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-[106px] shrink-0 h-[46px] px-2.5 rounded-xl border border-[#DDB0A5] bg-[#FCF9F7] text-xs font-bold text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#B27262]"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.id} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          id="whatsapp-phone"
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors({ ...errors, phone: '' });
                          }}
                          placeholder={t.form.whatsappPlaceholder}
                          className={`flex-1 min-w-0 h-[46px] px-3.5 rounded-xl border bg-white text-base sm:text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#B27262] ${
                            errors.phone ? 'border-red-600' : 'border-[#DDB0A5]'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-700">{errors.phone}</p>
                      )}
                    </div>

                    {/* Interested Treatment */}
                    <div>
                      <label
                        htmlFor="interested-service"
                        className="block text-xs font-bold text-[#1C1918] mb-1.5"
                      >
                        {t.form.serviceLabel}
                      </label>
                      <select
                        id="interested-service"
                        value={selectedServiceValue}
                        onChange={(e) => setSelectedServiceValue(e.target.value)}
                        className="w-full h-[46px] px-3.5 rounded-xl border border-[#DDB0A5] bg-white text-sm font-semibold text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#B27262]"
                      >
                        {t.form.services.map((srv) => (
                          <option key={srv.value} value={srv.value}>
                            {srv.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Privacy Consent */}
                    <label className="flex items-start gap-2.5 text-xs text-[#52443F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) setErrors({ ...errors, consent: '' });
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-[#DDB0A5] accent-[#9A4F3E]"
                      />
                      <span className="leading-snug">{t.form.consent}</span>
                    </label>
                    {errors.consent && (
                      <p className="text-xs text-red-700">{errors.consent}</p>
                    )}

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-[50px] inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] disabled:opacity-60 text-white font-extrabold text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t.form.submitting}</span>
                        </>
                      ) : (
                        <>
                          <span>{t.form.submit}</span>
                          {isRTL ? (
                            <ArrowLeft className="w-4 h-4" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center font-medium text-[#52443F]">
                      {t.form.note}
                    </p>
                  </form>
                )}
              </section>
            </div>
          </section>

          {/* =================================================================
              SECTION 02 — BEFORE & AFTER CLINICAL GALLERY
          ================================================================== */}
          <section
            id="gallery"
            aria-labelledby="gallery-heading"
            className="py-14 sm:py-20 bg-white border-b border-[#E8C9C1] scroll-mt-20"
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                  <h2
                    id="gallery-heading"
                    className="text-2xl sm:text-3xl font-extrabold text-[#1C1918] tracking-tight"
                  >
                    {t.hero.resultsHeading}
                  </h2>
                  <p className="text-sm text-[#52443F]">{t.hero.resultsSub}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {(
                    [
                      { key: 'all', label: t.hero.filters.all },
                      { key: 'hollywood', label: t.hero.filters.hollywood },
                      { key: 'cosmetic', label: t.hero.filters.cosmetic },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setActiveFilter(tab.key);
                        setLightboxIndex(null);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        activeFilter === tab.key
                          ? 'bg-[#9A4F3E] text-white'
                          : 'bg-[#FCF9F7] text-[#4A3F3B] border border-[#E8C9C1] hover:border-[#B27262]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="luxury-card-hover group rounded-2xl overflow-hidden bg-white border border-[#E8C9C1] hover:border-[#B27262] text-start focus:outline-none focus:ring-2 focus:ring-[#B27262] cursor-pointer flex flex-col"
                  >
                    <div className="aspect-square w-full bg-white p-2 border-b border-[#F2E2DC] overflow-hidden">
                      <img
                        src={item.src}
                        alt={isRTL ? item.titleAr : item.titleEn}
                        width={600}
                        height={600}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_ASSETS.case1;
                        }}
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 bg-[#FCF9F7] flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#8C4332]">
                          {isRTL ? item.tagAr : item.tagEn}
                        </p>
                        <h3 className="text-sm font-extrabold text-[#1C1918] truncate mt-0.5">
                          {isRTL ? item.titleAr : item.titleEn}
                        </h3>
                      </div>
                      <ZoomIn className="w-4 h-4 text-[#9A4F3E] shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 03 — SIGNATURE DENTAL TREATMENTS
          ================================================================== */}
          <section
            id="treatments"
            aria-labelledby="treatments-heading"
            className="py-14 sm:py-20 bg-[#FCF9F7] border-b border-[#E8C9C1] scroll-mt-20"
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-10">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8C4332]">
                  {t.treatmentsSection.kicker}
                </p>
                <h2
                  id="treatments-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.treatmentsSection.heading}
                </h2>
                <p className="text-sm text-[#52443F] leading-relaxed">
                  {t.treatmentsSection.sub}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {t.treatmentsSection.items.map((pkg) => (
                  <article
                    key={pkg.value}
                    className="luxury-card-hover rounded-3xl bg-white border border-[#E8C9C1] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center"
                  >
                    <div className="sm:col-span-5 rounded-2xl bg-[#FCF9F7] border border-[#F2E2DC] p-2 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        width={500}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        className="w-full aspect-square object-contain mx-auto block"
                      />
                    </div>

                    <div className="sm:col-span-7 flex flex-col justify-between gap-4">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#F7EAE6] text-[#8C4332] text-[11px] font-bold">
                            {pkg.stay}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#0F6934] text-[11px] font-bold">
                            {pkg.warranty}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-[#1C1918] leading-snug">
                          {pkg.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4A3F3B] leading-relaxed">
                          {pkg.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectServiceAndScroll(pkg.value)}
                        className="w-full h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        <span>{t.treatmentsSection.ctaText}</span>
                        {isRTL ? (
                          <ArrowLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 04 — 4-STEP PATIENT JOURNEY + VIP ISTANBUL SUPPORT
          ================================================================== */}
          <section
            id="journey"
            aria-labelledby="journey-heading"
            className="py-14 sm:py-20 bg-white border-b border-[#E8C9C1] scroll-mt-20"
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-10">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8C4332]">
                  {t.journey.kicker}
                </p>
                <h2
                  id="journey-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.journey.heading}
                </h2>
                <p className="text-sm text-[#52443F] leading-relaxed">{t.journey.sub}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {t.journey.steps.map((step) => (
                  <div
                    key={step.num}
                    className="bg-[#FCF9F7] rounded-2xl border border-[#E8C9C1] p-6 space-y-2.5"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#9A4F3E] text-white font-extrabold text-xs">
                      {step.num}
                    </span>
                    <h3 className="text-base font-extrabold text-[#1C1918]">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-[#52443F] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Simple 3-Pillar VIP Travel Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-[#E8C9C1]">
                {t.tourism.items.map((item, idx) => {
                  const Icon = idx === 0 ? Plane : idx === 1 ? Building2 : CalendarCheck;
                  return (
                    <div key={item.title} className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#F7EAE6] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#8C4332]" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1918]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#52443F] mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 05 — PATIENT REVIEWS (3 CLEAN CARDS)
          ================================================================== */}
          <section
            id="reviews"
            aria-labelledby="reviews-heading"
            className="py-14 sm:py-20 bg-[#FCF9F7] border-b border-[#E8C9C1] scroll-mt-20"
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-8">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8C4332]">
                  {t.reviews.kicker}
                </p>
                <h2
                  id="reviews-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.reviews.heading}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.reviews.items.slice(0, 3).map((rev) => (
                  <article
                    key={rev.name}
                    className="rounded-2xl bg-white border border-[#E8C9C1] p-6 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-[#1C1918] leading-relaxed">
                        "{rev.quote}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F2E2DC] text-xs">
                      <p className="font-extrabold text-[#1C1918]">{rev.name}</p>
                      <p className="text-[#52443F] mt-0.5">{rev.country}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 06 — FREQUENTLY ASKED QUESTIONS (4 ESSENTIAL Q&As)
          ================================================================== */}
          <section
            id="faq"
            aria-labelledby="faq-heading"
            className="py-14 sm:py-20 bg-white scroll-mt-20"
          >
            <div className="max-w-[820px] mx-auto px-4 sm:px-8 space-y-8">
              <div className="text-center space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8C4332]">
                  {t.faq.kicker}
                </p>
                <h2
                  id="faq-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.faq.heading}
                </h2>
              </div>

              <div className="space-y-3">
                {t.faq.items.slice(0, 4).map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={item.q}
                      className="rounded-2xl bg-[#FCF9F7] border border-[#E8C9C1] overflow-hidden"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-5 py-4 text-start flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1C1918] hover:text-[#9A4F3E] transition-colors cursor-pointer"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#9A4F3E] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4A3F3B] leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 07 — ADDITIONAL MEDICAL SPECIALTIES (HAIR, PLASTIC, SPINE)
          ================================================================== */}
          <section
            id="services"
            aria-labelledby="services-heading"
            className="py-14 sm:py-16 bg-[#FCF9F7] border-t border-[#E8C9C1] scroll-mt-20"
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
              <div className="max-w-xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8C4332] mb-1.5">
                  {t.services.kicker}
                </p>
                <h2
                  id="services-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.services.heading}
                </h2>
                <p className="mt-1.5 text-sm text-[#52443F]">{t.services.sub}</p>
              </div>

              <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">
                {t.services.items.map((srv) => (
                  <article
                    key={srv.value}
                    className="luxury-card-hover p-6 rounded-2xl bg-white border border-[#E8C9C1] hover:border-[#B27262] flex flex-col justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#1C1918]">
                        {srv.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#52443F] leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectServiceAndScroll(srv.value)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8C4332] hover:text-[#1C1918] underline underline-offset-4 self-start cursor-pointer"
                    >
                      <span>{srv.linkText}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          MINIMAL FOOTER
      ====================================================================== */}
      <footer className="border-t border-[#E8C9C1] bg-[#FCF9F7] py-6 pb-20 sm:pb-6">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#52443F]">
          <div className="flex items-center gap-3">
            <div className="bg-white border border-[#E8C9C1] rounded-lg px-2 py-1 shadow-2xs">
              <img
                src={brandLogo}
                alt="ESTELUX"
                width={54}
                height={42}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_ASSETS.logo;
                }}
                className="h-9 w-auto object-contain block"
              />
            </div>
            <span className="font-semibold text-[#1C1918]">{t.footer.slogan}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#1C1918] hover:text-[#C47D6B]"
            >
              <Phone className="w-3.5 h-3.5 text-[#C47D6B]" />
              <span>{t.footer.whatsappLabel}:</span>
              <span dir="ltr">{WHATSAPP_DISPLAY}</span>
            </a>

            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="underline underline-offset-4 hover:text-[#1C1918] cursor-pointer"
            >
              {t.footer.privacy}
            </button>

            <span>{t.footer.rights}</span>

            <span className="text-[#CDBBB2]" aria-hidden="true">
              •
            </span>

            <a
              href="https://threedigitsoftware.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#5A4E4A] hover:text-[#C47D6B] transition-colors"
            >
              {isRTL ? 'تطوير: ' : 'Powered by '}
              <span className="underline underline-offset-4">Threedigitsoftware.com</span>
            </a>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          FLOATING WHATSAPP BUTTON & MOBILE STICKY CONSULTATION BAR
      ====================================================================== */}
      {view === 'landing' && (
        <>
          <a
            href={defaultWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.whatsappAria}
            className="hidden sm:inline-flex fixed bottom-6 end-6 z-40 items-center gap-2.5 px-4 py-3 rounded-full bg-[#157A3E] hover:bg-[#198747] text-white font-bold text-sm shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.nav.whatsapp}</span>
          </a>

          <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5D6CE] px-3 py-2 flex items-center gap-2">
            <a
              href="#consultation"
              onClick={(e) => {
                e.preventDefault();
                handleSelectServiceAndScroll(selectedServiceValue);
              }}
              className="flex-1 min-h-[42px] inline-flex items-center justify-center rounded-xl bg-[#9A4F3E] text-white font-bold text-xs"
            >
              {t.form.heading}
            </a>
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#157A3E] text-white font-bold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.nav.whatsapp}</span>
            </a>
          </div>
        </>
      )}

      {/* =====================================================================
          CLINICAL RESULTS LIGHTBOX MODAL
      ====================================================================== */}
      {lightboxIndex !== null && filteredCases[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full rounded-2xl bg-white overflow-hidden shadow-2xl border border-[#E5D6CE]"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5D6CE] bg-[#FAF7F2]">
              <div>
                <p className="text-xs font-bold text-[#8C4332]">
                  {isRTL
                    ? filteredCases[lightboxIndex].tagAr
                    : filteredCases[lightboxIndex].tagEn}
                </p>
                <h3 className="text-sm sm:text-base font-extrabold text-[#1C1918]">
                  {isRTL
                    ? filteredCases[lightboxIndex].titleAr
                    : filteredCases[lightboxIndex].titleEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label={t.lightbox.close}
                className="p-2 rounded-lg hover:bg-[#EFE7DD] text-[#1C1918] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-white p-2 flex items-center justify-center max-h-[68vh] overflow-hidden">
              <img
                src={filteredCases[lightboxIndex].src}
                alt={
                  isRTL
                    ? filteredCases[lightboxIndex].titleAr
                    : filteredCases[lightboxIndex].titleEn
                }
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_ASSETS.case1;
                }}
                className="max-h-[65vh] w-auto object-contain"
              />
              {filteredCases.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={t.lightbox.prev}
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + filteredCases.length) % filteredCases.length
                      )
                    }
                    className="absolute start-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white border border-[#E5D6CE] shadow-md text-[#1C1918] cursor-pointer"
                  >
                    {isRTL ? (
                      <ChevronRight className="w-5 h-5" />
                    ) : (
                      <ChevronLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={t.lightbox.next}
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredCases.length)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white border border-[#E5D6CE] shadow-md text-[#1C1918] cursor-pointer"
                  >
                    {isRTL ? (
                      <ChevronLeft className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-4 bg-[#FAF7F2] border-t border-[#E5D6CE] space-y-3">
              <p className="text-xs sm:text-sm text-[#4A3F3B] leading-relaxed">
                {isRTL
                  ? filteredCases[lightboxIndex].captionAr
                  : filteredCases[lightboxIndex].captionEn}
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#52443F]">
                  {formatCaseLabel(lightboxIndex)} /{' '}
                  {isRTL ? toArabicDigits(filteredCases.length) : filteredCases.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const cat = filteredCases[lightboxIndex].category;
                    setLightboxIndex(null);
                    handleSelectServiceAndScroll(cat === 'hollywood' ? 'hollywood' : 'zirconia');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white text-xs font-bold cursor-pointer"
                >
                  {t.lightbox.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CHANGE DASHBOARD PIN MODAL
      ====================================================================== */}
      {pinModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPinModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-2xl bg-white p-6 space-y-4 border border-[#E5D6CE] shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#C47D6B]" />
                <h3 className="font-bold text-lg text-[#1C1918]">{t.admin.pinModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPinModalOpen(false)}
                aria-label={t.footer.close}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5A4E4A]">{t.admin.pinModal.sub}</p>

            <form onSubmit={handleUpdatePin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1918] mb-1">
                  {t.admin.pinModal.currentLabel}
                </label>
                <input
                  type="password"
                  value={currentPinField}
                  onChange={(e) => {
                    setCurrentPinField(e.target.value);
                    setPinChangeError('');
                  }}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#CDBBB2] text-sm text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1918] mb-1">
                  {t.admin.pinModal.newLabel}
                </label>
                <input
                  type="password"
                  value={newPinField}
                  onChange={(e) => {
                    setNewPinField(e.target.value);
                    setPinChangeError('');
                  }}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#CDBBB2] text-sm text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1918] mb-1">
                  {t.admin.pinModal.confirmLabel}
                </label>
                <input
                  type="password"
                  value={confirmPinField}
                  onChange={(e) => {
                    setConfirmPinField(e.target.value);
                    setPinChangeError('');
                  }}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#CDBBB2] text-sm text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                />
              </div>

              {pinChangeError && (
                <p className="text-xs text-red-700 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinChangeError}</span>
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#CDBBB2] text-xs font-semibold text-[#1C1918] cursor-pointer"
                >
                  {t.admin.media.cancelEdit}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white text-xs font-bold cursor-pointer"
                >
                  {t.admin.pinModal.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          PRIVACY POLICY MODAL
      ====================================================================== */}
      {privacyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPrivacyOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-2xl bg-white p-6 space-y-3 border border-[#E5D6CE] shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#1C1918]">{t.footer.privacyTitle}</h3>
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                aria-label={t.footer.close}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#4A3F3B] leading-relaxed">{t.footer.privacyText}</p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#1C1918] text-white text-xs font-semibold cursor-pointer"
              >
                {t.footer.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
