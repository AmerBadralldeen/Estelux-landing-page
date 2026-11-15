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
  KeyRound
} from 'lucide-react';

/**
 * ESTELUX Istanbul — High-Converting Single-Page Dental Aesthetics Landing Page
 * + Live Bilingual Admin Dashboard (Consultation Leads Inbox & Media/Gallery Manager)
 * Built with React, TypeScript, Tailwind CSS, and Lucide Icons.
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
  message: string;
  status: LeadStatus;
  adminNotes: string;
  createdAt: string;
  langSubmitted: Language;
}

const WHATSAPP_DISPLAY = '+90 544 455 5513';
const WHATSAPP_RAW = '905444555513';
const DEFAULT_ADMIN_PIN = '1234';

const STORAGE_KEYS = {
  leads: 'estelux_consultation_leads_v1',
  cases: 'estelux_dental_cases_v1',
  logo: 'estelux_brand_logo_v1',
  heroPhoto: 'estelux_hero_photo_v1',
  adminPin: 'estelux_admin_pin_v1',
};

const DEFAULT_ASSETS = {
  logo: 'Logo Colored.jpg',
  case1: 'photo_6028350293931659414_y.jpg',
  case2: 'photo_6028350293931659415_y.jpg',
  case3: 'photo_6028350293931659416_y.jpg',
  case4: 'photo_6028350293931659417_y.jpg',
  heroDental:
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1400&q=85',
};

const INITIAL_CASES: DentalCase[] = [
  {
    id: 'case-1',
    src: DEFAULT_ASSETS.case1,
    category: 'cosmetic',
    titleEn: 'Full Smile Restoration',
    titleAr: 'ترميم الابتسامة الكامل',
    tagEn: 'Cosmetic Dentistry',
    tagAr: 'علاج الأسنان وتجميلها',
    captionEn: 'Comprehensive aesthetic alignment and natural enamel restoration.',
    captionAr: 'تناسق جمالي شامل وترميم طبيعي لمظهر الأسنان.',
    visible: true,
  },
  {
    id: 'case-2',
    src: DEFAULT_ASSETS.case2,
    category: 'hollywood',
    titleEn: 'Hollywood Smile Design',
    titleAr: 'تصميم هوليوود سمايل',
    tagEn: 'Hollywood Smile',
    tagAr: 'هوليوود سمايل',
    captionEn: 'Structural reconstruction and custom shade harmony in Istanbul.',
    captionAr: 'إعادة بناء الأسنان وتناغم مثالي للون والشكل في إسطنبول.',
    visible: true,
  },
  {
    id: 'case-3',
    src: DEFAULT_ASSETS.case3,
    category: 'hollywood',
    titleEn: 'Precision Aesthetic Makeover',
    titleAr: 'تجميل الابتسامة بدقة عالية',
    tagEn: 'Hollywood Smile',
    tagAr: 'هوليوود سمايل',
    captionEn: 'Balanced smile arc tailored to facial symmetry and natural radiance.',
    captionAr: 'قوس ابتسامة متوازن مصمم خصيصاً ليتناغم مع ملامح الوجه.',
    visible: true,
  },
  {
    id: 'case-4',
    src: DEFAULT_ASSETS.case4,
    category: 'cosmetic',
    titleEn: 'Complete Oral Rehabilitation',
    titleAr: 'إعادة تأهيل الفم والأسنان',
    tagEn: 'Cosmetic Dentistry',
    tagAr: 'علاج الأسنان وتجميلها',
    captionEn: 'Restoring both confident aesthetics and lasting dental function.',
    captionAr: 'استعادة الجمال الطبيعي والوظيفة الصحية للأسنان.',
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
    message: 'أرغب في معرفة تكلفة هوليوود سمايل ومدة الإقامة المطلوبة في إسطنبول.',
    status: 'new',
    adminNotes: 'Prefer evening WhatsApp call after 6 PM Istanbul time.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    langSubmitted: 'ar',
  },
  {
    id: 'lead-102',
    fullName: 'Daniel Weber',
    countryCode: '+43',
    phone: '6604481920',
    country: 'Austria',
    email: 'd.weber@example.at',
    serviceValue: 'dental',
    message: 'Looking for full upper and lower zirconia crowns + airport VIP pickup.',
    status: 'contacted',
    adminNotes: 'Sent panoramic X-ray instructions via WhatsApp.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    langSubmitted: 'en',
  },
  {
    id: 'lead-103',
    fullName: 'طارق العتيبي',
    countryCode: '+971',
    phone: '509871122',
    country: 'UAE',
    email: '',
    serviceValue: 'implants',
    message: 'استشارة بخصوص زراعة 4 أسنان مع حجز فندق قريب من العيادة.',
    status: 'booked',
    adminNotes: 'Confirmed arrival on the 22nd — VIP Transfer & Hotel arranged.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    langSubmitted: 'ar',
  },
];

const COUNTRY_CODES = [
  { code: '+90', flag: '🇹🇷' },
  { code: '+966', flag: '🇸🇦' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+965', flag: '🇰🇼' },
  { code: '+974', flag: '🇶🇦' },
  { code: '+973', flag: '🇧🇭' },
  { code: '+968', flag: '🇴🇲' },
  { code: '+962', flag: '🇯🇴' },
  { code: '+20', flag: '🇪🇬' },
  { code: '+964', flag: '🇮🇶' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+33', flag: '🇫🇷' },
  { code: '+43', flag: '🇦🇹' },
  { code: '+1', flag: '🇺🇸' },
];

const TRANSLATIONS = {
  en: {
    brandSubtitle: 'Look Beautiful, Live Healthy',
    nav: {
      homeAria: 'ESTELUX Home',
      logoAlt: 'ESTELUX — Look Beautiful, Live Healthy',
      allServices: 'All services',
      langSwitch: 'العربية',
      whatsapp: 'WhatsApp',
      whatsappAria: 'Contact ESTELUX on WhatsApp',
      dashboardBtn: 'Dashboard',
      backToSite: 'View Landing Page',
    },
    hero: {
      kicker: 'FEATURED SERVICE • ISTANBUL',
      title: 'Dental Surgery & Cosmetic Dentistry',
      subtitle: 'Excellence in Medical Care',
      slogan: 'Look Beautiful, Live Healthy — Excellence in Medical Care.',
      lead: 'Discover personalized dental care and aesthetic dentistry in Istanbul. From your initial online consultation and medical assessment to treatment coordination and post-treatment follow-up, ESTELUX guides you through every step of your smile journey.',
      whatsappCta: 'Contact us on WhatsApp',
      whatsappPrefill:
        'Hello ESTELUX, I am interested in Dental Surgery & Cosmetic Dentistry. I would like to receive more information and arrange a consultation.',
      photoAlt: 'ESTELUX Dental Surgery & Cosmetic Dentistry consultation in Istanbul',
      photoCaption: 'Personalized Dental Aesthetics & Smile Design in Istanbul',
      resultsHeading: 'Clinical Smile Transformations',
      resultsHint: 'Click any photo to enlarge',
      verifiedBadge: 'Verified Clinical Case',
      filters: {
        all: 'All Cases',
        hollywood: 'Hollywood Smile',
        cosmetic: 'Cosmetic Dentistry',
      },
      casePrefix: 'Case #',
    },
    form: {
      heading: 'Request a consultation',
      intro: 'Leave your details so our Istanbul coordination team can arrange your personalized dental assessment.',
      countryCodeAria: 'Country dialing code',
      fullName: 'Full name',
      fullNamePlaceholder: 'Your full name',
      whatsapp: 'WhatsApp number',
      whatsappPlaceholder: '5XX XXX XXXX',
      country: 'Country',
      countryPlaceholder: 'e.g., UK, Saudi Arabia, UAE',
      email: 'Email address (optional)',
      emailPlaceholder: 'you@example.com',
      serviceLabel: 'Interested service',
      services: [
        { value: 'dental', label: 'Dental Surgery & Cosmetic Dentistry' },
        { value: 'hollywood', label: 'Hollywood Smile & Porcelain Veneers' },
        { value: 'implants', label: 'Dental Implants & Oral Surgery' },
        { value: 'hair', label: 'Hair Transplantation' },
        { value: 'plastic', label: 'Plastic & Cosmetic Surgery' },
        { value: 'spine', label: 'Spine Surgery' },
      ],
      message: 'Message (optional)',
      messagePlaceholder: 'Tell us about your smile goals or preferred dates...',
      consent: 'I agree to be contacted by ESTELUX regarding my consultation request.',
      submit: 'Request my consultation',
      submitting: 'Submitting...',
      whatsappDirect: 'Chat directly on WhatsApp',
      note: 'Complimentary online assessment • Direct Istanbul coordination',
      errors: {
        name: 'Please enter your full name.',
        phone: 'Please enter a valid WhatsApp number.',
        country: 'Please enter your country.',
        email: 'Please enter a valid email address.',
        consent: 'Please confirm privacy consent to continue.',
      },
      confirmTitle: 'Consultation request received',
      confirmBody:
        'Thank you. Your request has been saved to our Istanbul coordinator desk. You can also send it directly on WhatsApp below for instant scheduling.',
      confirmWaBtn: 'Send via WhatsApp now',
      resetBtn: 'Submit another request',
      waSummaryIntro: 'Hello ESTELUX, I would like to arrange a consultation.',
      waFieldName: 'Name',
      waFieldPhone: 'WhatsApp',
      waFieldCountry: 'Country',
      waFieldEmail: 'Email',
      waFieldService: 'Service',
      waFieldNotes: 'Notes',
    },
    tourism: {
      heading: 'Seamless Istanbul experience',
      sub: 'Everything coordinated from arrival to follow-up.',
      items: [
        {
          title: 'VIP TRANSFER',
          desc: 'Private airport pickup and comfortable clinic transfers throughout your stay.',
        },
        {
          title: 'ACCOMMODATION',
          desc: 'Carefully arranged hotel accommodation near our medical facilities in Istanbul.',
        },
        {
          title: 'BOOKING SERVICES',
          desc: 'Complete medical appointment scheduling and personal coordination assistance.',
        },
      ],
    },
    services: {
      kicker: 'ADDITIONAL SPECIALTIES',
      heading: 'More medical services',
      sub: 'Select a specialty below to pre-fill your consultation request.',
      items: [
        {
          value: 'hair',
          title: 'Hair Transplantation',
          desc: 'Personalized hair restoration procedures coordinated with specialized medical teams in Istanbul.',
          linkText: 'Ask about hair transplantation',
        },
        {
          value: 'plastic',
          title: 'Plastic & Cosmetic Surgery',
          desc: 'Aesthetic and reconstructive procedures tailored to natural, balanced results.',
          linkText: 'Ask about cosmetic surgery',
        },
        {
          value: 'spine',
          title: 'Spine Surgery',
          desc: 'Specialized spinal assessment and surgical care supported by modern medical technology.',
          linkText: 'Ask about spine surgery',
        },
      ],
    },
    lightbox: {
      close: 'Close',
      prev: 'Previous case',
      next: 'Next case',
      cta: 'Request consultation',
    },
    footer: {
      slogan: 'Look Beautiful, Live Healthy.',
      whatsappLabel: 'WhatsApp',
      privacy: 'Privacy Policy',
      rights: `© ${new Date().getFullYear()} ESTELUX Istanbul. All rights reserved.`,
      privacyTitle: 'Privacy Policy',
      privacyText:
        'ESTELUX protects your personal and medical inquiry information. Details submitted in the consultation form are used solely to evaluate your request and coordinate your consultation in Istanbul. We never share your information with unauthorized third parties.',
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
          `Hello ${name}, thank you for contacting ESTELUX Istanbul regarding ${service}. Our medical coordinator is ready to assist you.`,
      },
      media: {
        brandSectionTitle: 'Brand Logo & Hero Banner Image',
        brandSectionSub: 'Upload from your device or paste an image URL. Updates appear immediately on the landing page.',
        logoLabel: 'ESTELUX Brand Logo',
        heroPhotoLabel: 'Hero Featured Clinic Photo',
        uploadBtn: 'Upload File',
        urlPlaceholder: 'Or paste image URL (https://...)',
        applyUrl: 'Apply',
        resetDefaults: 'Reset All Media to Original',
        addCaseTitle: 'Add New Before & After Clinical Case',
        addCaseSub: 'Upload a clinical transformation photo and provide English & Arabic titles.',
        caseTitleEn: 'Title (English)',
        caseTitleEnPh: 'e.g., Zirconia Crown Makeover',
        caseTitleAr: 'Title (Arabic)',
        caseTitleArPh: 'مثال: ابتسامة الزيركون الطبيعية',
        caseCategory: 'Category',
        catHollywood: 'Hollywood Smile',
        catCosmetic: 'Cosmetic Dentistry',
        caseCaptionEn: 'Short Description (English)',
        caseCaptionAr: 'Short Description (Arabic)',
        choosePhoto: 'Choose Photo from Device',
        orImageUrl: 'Or paste Image URL',
        addCaseBtn: 'Publish to Gallery',
        manageCasesTitle: 'Manage Clinical Gallery Cases',
        manageCasesSub: 'Edit titles, toggle visibility on the landing page, reorder, or delete cases.',
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
    nav: {
      homeAria: 'الصفحة الرئيسية ESTELUX',
      logoAlt: 'ESTELUX — تألّق بجمالك، وعِش بصحة',
      allServices: 'جميع الخدمات',
      langSwitch: 'English',
      whatsapp: 'واتساب',
      whatsappAria: 'تواصل مع ESTELUX عبر واتساب',
      dashboardBtn: 'لوحة التحكم',
      backToSite: 'عرض صفحة الهبوط',
    },
    hero: {
      kicker: 'التخصص الرئيسي • إسطنبول',
      title: 'جراحة الأسنان وتجميلها',
      subtitle: 'التميّز في الرعاية الطبية',
      slogan: 'تألّق بجمالك، وعِش بصحة — التميّز في الرعاية الطبية.',
      lead: 'اكتشف رعاية الأسنان المخصصة وطب الأسنان التجميلي في إسطنبول. بدءاً من الاستشارة الأولية عبر الإنترنت والتقييم الطبي، مروراً بتنسيق العلاج وحتى المتابعة بعد الإجراء، ترافقك ESTELUX في كل خطوة نحو ابتسامتك المثالية.',
      whatsappCta: 'تواصل معنا عبر واتساب',
      whatsappPrefill:
        'مرحباً ESTELUX، أنا مهتم بخدمة جراحة الأسنان وتجميلها. أود الحصول على مزيد من المعلومات وترتيب موعد للاستشارة.',
      photoAlt: 'استشارة جراحة الأسنان وتجميلها في عيادة ESTELUX إسطنبول',
      photoCaption: 'تصميم الابتسامة وتجميل الأسنان المخصص في إسطنبول',
      resultsHeading: 'نتائج سريرية حقيقية قبل وبعد',
      resultsHint: 'انقر للتكبير',
      verifiedBadge: 'حالة سريرية موثقة',
      filters: {
        all: 'جميع الحالات',
        hollywood: 'هوليوود سمايل',
        cosmetic: 'تجميل الأسنان',
      },
      casePrefix: 'حالة رقم ',
    },
    form: {
      heading: 'اطلب استشارة طبية',
      intro: 'اترك بياناتك ليتواصل معك فريق التنسيق في إسطنبول ويجهز خطتك العلاجية المخصصة.',
      countryCodeAria: 'رمز الدولة الدولي',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'أدخل اسمك الكامل',
      whatsapp: 'رقم الواتساب',
      whatsappPlaceholder: '5XX XXX XXXX',
      country: 'بلد الإقامة',
      countryPlaceholder: 'مثال: السعودية، الإمارات، الكويت',
      email: 'البريد الإلكتروني (اختياري)',
      emailPlaceholder: 'you@example.com',
      serviceLabel: 'الخدمة المطلوبة',
      services: [
        { value: 'dental', label: 'جراحة الأسنان وتجميلها' },
        { value: 'hollywood', label: 'هوليوود سمايل وعدسات الأسنان' },
        { value: 'implants', label: 'زراعة الأسنان وجراحة الفم' },
        { value: 'hair', label: 'زراعة الشعر' },
        { value: 'plastic', label: 'الجراحة التجميلية والترميمية' },
        { value: 'spine', label: 'جراحة العمود الفقري' },
      ],
      message: 'رسالتك (اختياري)',
      messagePlaceholder: 'أخبرنا عن أهداف ابتسامتك أو الموعد المناسب لك...',
      consent: 'أوافق على تواصل ESTELUX معي بخصوص طلب الاستشارة الطبية.',
      submit: 'اطلب استشارتي الآن',
      submitting: 'جاري الإرسال...',
      whatsappDirect: 'تحدث مباشرة عبر واتساب',
      note: 'تقييم مجاني عبر الإنترنت • تنسيق مباشر في إسطنبول',
      errors: {
        name: 'يرجى إدخال الاسم الكامل.',
        phone: 'يرجى إدخال رقم واتساب صحيح.',
        country: 'يرجى إدخال بلد الإقامة.',
        email: 'يرجى إدخال بريد إلكتروني صحيح.',
        consent: 'يرجى الموافقة للمتابعة.',
      },
      confirmTitle: 'تم استلام طلب الاستشارة بنجاح',
      confirmBody:
        'شكراً لك. تم حفظ طلبك وإرساله إلى لوحة تنسيق المرضى في إسطنبول. يمكنك أيضاً إرساله مباشرة عبر واتساب أدناه لتأكيد الموعد فوراً.',
      confirmWaBtn: 'أرسل عبر واتساب الآن',
      resetBtn: 'إرسال طلب جديد',
      waSummaryIntro: 'مرحباً ESTELUX، أرغب في ترتيب موعد لاستشارة طبية.',
      waFieldName: 'الاسم',
      waFieldPhone: 'رقم الواتساب',
      waFieldCountry: 'بلد الإقامة',
      waFieldEmail: 'البريد الإلكتروني',
      waFieldService: 'الخدمة المطلوبة',
      waFieldNotes: 'ملاحظات',
    },
    tourism: {
      heading: 'تجربة متكاملة في إسطنبول',
      sub: 'تنسيق مريح من لحظة وصولك وحتى المتابعة.',
      items: [
        {
          title: 'نقل VIP خاص',
          desc: 'استقبال خاص من المطار وتنقلات مريحة بين الفندق والعيادة طوال إقامتك.',
        },
        {
          title: 'إقامة فندقية مريحة',
          desc: 'ترتيبات إقامة فندقية مريحة ومختارة بعناية بالقرب من مراكزنا الطبية في إسطنبول.',
        },
        {
          title: 'خدمات الحجز والتنسيق',
          desc: 'تنسيق كامل للمواعيد الطبية ومساعدة شخصية في جميع الحجوزات.',
        },
      ],
    },
    services: {
      kicker: 'تخصصات طبية إضافية',
      heading: 'خدمات طبية أخرى',
      sub: 'اختر التخصص أدناه لتحديده تلقائياً في نموذج الاستشارة.',
      items: [
        {
          value: 'hair',
          title: 'زراعة الشعر',
          desc: 'إجراءات حديثة لاستعادة الشعر بالتنسيق مع نخبة من الفرق الطبية المتخصصة في إسطنبول.',
          linkText: 'استفسر عن زراعة الشعر',
        },
        {
          value: 'plastic',
          title: 'الجراحة التجميلية والترميمية',
          desc: 'إجراءات تجميلية وترميمية مخصصة تركز على النتائج الطبيعية والمتناسقة.',
          linkText: 'استفسر عن الجراحة التجميلية',
        },
        {
          value: 'spine',
          title: 'جراحة العمود الفقري',
          desc: 'تقييم متخصص ورعاية جراحية للعمود الفقري مدعومة بأحدث التقنيات الطبية.',
          linkText: 'استفسر عن جراحة العمود الفقري',
        },
      ],
    },
    lightbox: {
      close: 'إغلاق',
      prev: 'الحالة السابقة',
      next: 'الحالة التالية',
      cta: 'اطلب استشارة طبية',
    },
    footer: {
      slogan: 'تألّق بجمالك، وعِش بصحة.',
      whatsappLabel: 'واتساب',
      privacy: 'سياسة الخصوصية',
      rights: `© ${new Date().getFullYear()} ESTELUX إسطنبول. جميع الحقوق محفوظة.`,
      privacyTitle: 'سياسة الخصوصية',
      privacyText:
        'تحترم ESTELUX خصوصيتك وتحافظ على سرية بياناتك الطبية والشخصية. تُستخدم المعلومات المقدمة في نموذج الاستشارة حصرياً لتقييم طلبك وتنسيق استشارتك في إسطنبول ولا يتم مشاركتها مع أي أطراف خارجية.',
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
          `مرحباً ${name}، شكراً لتواصلك مع ESTELUX إسطنبول بخصوص خدمة (${service}). فريق التنسيق الطبي جاهز لمساعدتك وتزويدك بكافة التفاصيل.`,
      },
      media: {
        brandSectionTitle: 'تعديل شعار العلامة التجارية وصورة الواجهة الرئيسية',
        brandSectionSub: 'ارفع صورة من جهازك أو الصق رابط صورة مباشر. تظهر التعديلات فوراً في صفحة الهبوط.',
        logoLabel: 'شعار ESTELUX الرسمي',
        heroPhotoLabel: 'الصورة الرئيسية للعيادة في الواجهة',
        uploadBtn: 'رفع صورة من الجهاز',
        urlPlaceholder: 'أو الصق رابط الصورة (https://...)',
        applyUrl: 'تطبيق',
        resetDefaults: 'استعادة جميع الصور الافتراضية',
        addCaseTitle: 'إضافة حالة قبل وبعد جديدة إلى المعرض',
        addCaseSub: 'ارفع صورة الحالة وأدخل العنوان باللغتين العربية والإنجليزية.',
        caseTitleEn: 'العنوان (بالإنجليزية)',
        caseTitleEnPh: 'مثال: Zirconia Crown Makeover',
        caseTitleAr: 'العنوان (بالعربية)',
        caseTitleArPh: 'مثال: ابتسامة الزيركون الطبيعية',
        caseCategory: 'التصنيف',
        catHollywood: 'هوليوود سمايل',
        catCosmetic: 'تجميل الأسنان',
        caseCaptionEn: 'وصف مختصر (بالإنجليزية)',
        caseCaptionAr: 'وصف مختصر (بالعربية)',
        choosePhoto: 'اختر صورة من جهازك',
        orImageUrl: 'أو الصق رابط الصورة',
        addCaseBtn: 'نشر الصورة في المعرض',
        manageCasesTitle: 'التحكم في صور الحالات السريرية الحالية',
        manageCasesSub: 'تعديل العناوين، إظهار أو إخفاء الصورة في الصفحة، تغيير الترتيب، أو الحذف.',
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
  const isSecretAdminUrl = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return hash === '#admin' || hash.startsWith('#admin/') || params.get('admin') === '1';
  };

  const [view, setView] = useState<ViewMode>(() => (isSecretAdminUrl() ? 'login' : 'landing'));
  const [adminTab, setAdminTab] = useState<AdminTab>('leads');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.adminPin) || DEFAULT_ADMIN_PIN;
    } catch {
      return DEFAULT_ADMIN_PIN;
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
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  const [brandLogo, setBrandLogo] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.logo) || DEFAULT_ASSETS.logo;
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
  const [selectedServiceValue, setSelectedServiceValue] = useState<string>('dental');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+90');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState<ConsultationLead | null>(null);

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
    }, 2600);
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
        setView((prev) => (prev === 'admin' ? 'admin' : 'login'));
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
  }, []);

  const exitToLandingPage = () => {
    if (typeof window !== 'undefined') {
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }
    setView('landing');
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredCases.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filteredCases.length) % filteredCases.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, filteredCases.length]);

  const handleSelectServiceAndScroll = (serviceValue: string) => {
    setSelectedServiceValue(serviceValue);
    setSubmitted(false);
    const el = document.getElementById('consultation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    }, 450);
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

  // Image File Reader Helper (converts uploaded image to Data URL for immediate live preview & storage)
  const handleImageFileUpload = (
    file: File | undefined,
    callback: (dataUrl: string) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin) {
      setIsAuthenticated(true);
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
    const headers = ['ID', 'Full Name', 'Phone', 'Country', 'Email', 'Service', 'Message', 'Status', 'Admin Notes', 'Created At'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.countryCode} ${l.phone}"`,
      `"${l.country.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${getServiceLabel(l.serviceValue)}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      l.status,
      `"${l.adminNotes.replace(/"/g, '""')}"`,
      l.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
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
      className="min-h-screen bg-[#FAF7F2] text-[#4A3F3B] selection:bg-[#C47D6B] selection:text-white antialiased"
      style={{
        fontFamily: isRTL
          ? "'Cairo', system-ui, sans-serif"
          : "'Montserrat', system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        body, input, button, select, textarea, h1, h2, h3, p, span, a, label {
          font-family: ${isRTL ? "'Cairo', system-ui, sans-serif" : "'Montserrat', system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      {/* Live Save Toast */}
      {toastMessage && (
        <div className="fixed top-20 end-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1918] text-white text-xs sm:text-sm font-semibold shadow-xl border border-[#C47D6B]/40">
          <CheckCircle2 className="w-4 h-4 text-[#1E9E54]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          STICKY MINIMAL HEADER (PUBLIC SITE & ADMIN MODE)
      ====================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5D6CE]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 min-h-[76px] flex items-center justify-between gap-3">
          {/* Original Unmodified ESTELUX Logo */}
          <a
            href="#top"
            onClick={(e) => {
              if (view !== 'landing') {
                e.preventDefault();
                exitToLandingPage();
              }
            }}
            aria-label={t.nav.homeAria}
            className="inline-flex items-center gap-3 group focus:outline-none"
          >
            <div className="bg-[#0B0A0A] rounded-lg px-2 py-1 shadow-xs border border-[#2A2422] flex items-center justify-center">
              <img
                src={brandLogo}
                alt={t.nav.logoAlt}
                className="h-10 sm:h-11 w-auto object-contain block"
              />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold tracking-[0.18em] text-[#1C1918] leading-tight">
                ESTELUX
              </span>
              <span className="text-[11px] font-medium text-[#786A65] mt-0.5">
                {t.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Minimal Navigation Controls (No Public Dashboard Button) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {view === 'landing' ? (
              <a
                href="#services"
                className="hidden lg:inline-block text-xs sm:text-sm font-semibold text-[#1C1918] hover:text-[#C47D6B] underline underline-offset-4 transition-colors px-2"
              >
                {t.nav.allServices}
              </a>
            ) : (
              <button
                type="button"
                onClick={exitToLandingPage}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg bg-[#EFE7DD] hover:bg-[#E5D6CE] text-[#1C1918] text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>{t.nav.backToSite}</span>
              </button>
            )}

            {/* Bilingual Toggle (EN / العربية) */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-[#CDBBB2] bg-white hover:border-[#C47D6B] text-xs font-semibold text-[#1C1918] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#C47D6B]" />
              <span>{t.nav.langSwitch}</span>
            </button>

            {/* Direct WhatsApp Header Button */}
            {view === 'landing' && (
              <a
                href={defaultWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.nav.whatsappAria}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#1E9E54] hover:bg-[#198747] text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">{t.nav.whatsapp}</span>
              </a>
            )}
          </div>
        </div>
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
                  className={`w-full min-h-[48px] px-4 rounded-xl border text-center tracking-[0.25em] font-bold text-lg text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B] ${
                    pinError ? 'border-red-600' : 'border-[#CDBBB2]'
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
                className="w-full min-h-[48px] rounded-xl bg-[#C47D6B] hover:bg-[#A86554] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                {t.admin.loginBtn}
              </button>
            </form>

            <div className="pt-2 border-t border-[#E5D6CE] flex items-center justify-center">
              <button
                type="button"
                onClick={exitToLandingPage}
                className="text-xs font-semibold text-[#786A65] hover:text-[#1C1918] cursor-pointer"
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
        <main className="max-w-[1180px] mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6">
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
              <div className="flex items-center justify-between text-xs font-semibold text-[#786A65]">
                <span>{t.admin.stats.total}</span>
                <Users className="w-4 h-4 text-[#C47D6B]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1C1918]">
                {isRTL ? toArabicDigits(leads.length) : leads.length}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#786A65]">
                <span>{t.admin.stats.new}</span>
                <Clock className="w-4 h-4 text-[#B46956]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#B46956]">
                {isRTL ? toArabicDigits(newLeadsCount) : newLeadsCount}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#786A65]">
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
              <div className="flex items-center justify-between text-xs font-semibold text-[#786A65]">
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
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                adminTab === 'leads'
                  ? 'bg-[#C47D6B] text-white shadow-xs'
                  : 'bg-white text-[#4A3F3B] border border-[#E5D6CE] hover:border-[#C47D6B]'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>{t.admin.tabLeads}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  adminTab === 'leads'
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
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                adminTab === 'media'
                  ? 'bg-[#C47D6B] text-white shadow-xs'
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
                  <Search className="w-4 h-4 text-[#786A65] absolute start-3.5 top-1/2 -translate-y-1/2" />
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        leadStatusFilter === st.key
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
                <div className="bg-white rounded-2xl border border-[#E5D6CE] p-12 text-center text-sm text-[#786A65]">
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
                        ? 'bg-[#C47D6B]/15 text-[#A86554] border-[#C47D6B]/30'
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
                              <span className="text-[11px] text-[#786A65]">
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
                              className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-xl bg-[#1E9E54] hover:bg-[#198747] text-white text-xs font-bold transition-colors"
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
                              className={`inline-flex items-center gap-1 min-h-[38px] px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                                confirmDeleteLeadId === lead.id
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
                              <span className="font-bold text-[#B46956]">{serviceName}</span>
                              <span className="text-[11px] uppercase text-[#786A65]">
                                {lead.langSubmitted}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#1C1918] leading-relaxed flex items-start gap-2">
                              <FileText className="w-4 h-4 text-[#786A65] shrink-0 mt-0.5" />
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
                    <div className="h-28 rounded-xl bg-[#0B0A0A] flex items-center justify-center p-3 border border-[#2A2422]">
                      <img
                        src={brandLogo}
                        alt="ESTELUX Logo Preview"
                        className="max-h-20 w-auto object-contain"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C47D6B] hover:bg-[#A86554] text-white text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{t.admin.media.uploadBtn}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e.target.files?.[0], (url) => {
                              setBrandLogo(url);
                              showToast(t.admin.media.savedToast);
                            })
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
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C47D6B] hover:bg-[#A86554] text-white text-xs font-bold cursor-pointer">
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
                    <div className="aspect-[3/4] max-h-56 w-full rounded-xl border-2 border-dashed border-[#CDBBB2] bg-[#FAF7F2] flex flex-col items-center justify-center overflow-hidden p-2">
                      {newCaseSrc ? (
                        <img
                          src={newCaseSrc}
                          alt="New case preview"
                          className="w-full h-full object-contain"
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
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C47D6B] hover:bg-[#A86554] disabled:opacity-50 text-white text-xs sm:text-sm font-bold cursor-pointer"
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
                        className={`rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 ${
                          item.visible
                            ? 'bg-[#FAF7F2] border-[#E5D6CE]'
                            : 'bg-stone-100/80 border-stone-300 opacity-80'
                        }`}
                      >
                        <div className="w-full sm:w-32 shrink-0 space-y-2">
                          <div className="aspect-[3/4] rounded-xl bg-white border border-[#E5D6CE] overflow-hidden">
                            <img
                              src={isEditing ? editDraft.src : item.src}
                              alt={item.titleEn}
                              className="w-full h-full object-contain p-1"
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
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.visible
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-stone-200 text-stone-700'
                                  }`}
                                >
                                  {item.visible
                                    ? t.admin.media.visibleBadge
                                    : t.admin.media.hiddenBadge}
                                </span>
                                <span className="text-[11px] font-bold text-[#B46956]">
                                  {isRTL ? item.tagAr : item.tagEn}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-[#1C1918]">{item.titleEn}</h3>
                              <p className="text-xs font-semibold text-[#5A4E4A]">{item.titleAr}</p>
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
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E9E54] text-white text-xs font-bold cursor-pointer"
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
              SECTION 01 & 02 — HERO + DOMINANT DENTAL SURGERY & COSMETIC DENTISTRY
              + DIRECT EMBEDDED CONSULTATION FORM
          ================================================================== */}
          <section
            aria-labelledby="main-heading"
            className="bg-gradient-to-br from-[#EFE7DD]/85 via-[#FAF7F2] to-[#FAF7F2] py-8 sm:py-14 border-b border-[#E5D6CE]"
          >
            <div className="max-w-[1180px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* LEFT / START COLUMN: Dominant Dental Focus & Clinical Results */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B46956] mb-3">
                    {t.hero.kicker}
                  </p>
                  <h1
                    id="main-heading"
                    className="text-3xl sm:text-5xl lg:text-[3.2rem] font-extrabold text-[#1C1918] leading-[1.12] tracking-tight"
                  >
                    {t.hero.title}
                  </h1>
                  <p className="mt-2 text-base sm:text-lg font-semibold text-[#C47D6B]">
                    {t.hero.slogan}
                  </p>
                  <p className="mt-4 text-sm sm:text-base text-[#4A3F3B] leading-relaxed max-w-2xl">
                    {t.hero.lead}
                  </p>
                </div>

                {/* Direct WhatsApp Lead Action */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={defaultWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1E9E54] hover:bg-[#198747] text-white font-semibold text-sm shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{t.hero.whatsappCta}</span>
                    <span dir="ltr" className="text-xs opacity-90 font-medium">
                      ({WHATSAPP_DISPLAY})
                    </span>
                  </a>
                </div>

                {/* Featured Clinical Banner Photo */}
                <div className="relative rounded-2xl overflow-hidden border border-[#E5D6CE] bg-[#EFE7DD] shadow-sm">
                  <img
                    src={heroPhoto}
                    alt={t.hero.photoAlt}
                    className="w-full h-56 sm:h-72 object-cover block"
                  />
                  <div className="px-4 py-2.5 bg-white/95 border-t border-[#E5D6CE] flex items-center justify-between text-xs text-[#5A4E4A]">
                    <span className="font-semibold text-[#1C1918]">{t.hero.photoCaption}</span>
                    <span className="inline-flex items-center gap-1 text-[#B46956] font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ESTELUX Istanbul</span>
                    </span>
                  </div>
                </div>

                {/* Clinical Before & After Gallery */}
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h2 className="text-base sm:text-lg font-bold text-[#1C1918]">
                      {t.hero.resultsHeading}
                    </h2>

                    <div className="flex flex-wrap items-center gap-1.5">
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
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            activeFilter === tab.key
                              ? 'bg-[#C47D6B] text-white'
                              : 'bg-white text-[#4A3F3B] border border-[#E5D6CE] hover:border-[#C47D6B]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {filteredCases.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className="group relative rounded-xl overflow-hidden bg-white border border-[#E5D6CE] hover:border-[#C47D6B] shadow-2xs transition-all text-start focus:outline-none focus:ring-2 focus:ring-[#C47D6B] cursor-pointer"
                      >
                        <div className="aspect-[3/4] w-full bg-white overflow-hidden">
                          <img
                            src={item.src}
                            alt={isRTL ? item.titleAr : item.titleEn}
                            loading="lazy"
                            className="w-full h-full object-contain p-1 group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>
                        <div className="p-2 bg-[#FAF7F2] border-t border-[#E5D6CE] flex items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold text-[#1C1918] truncate">
                            {isRTL ? item.titleAr : item.titleEn}
                          </span>
                          <ZoomIn className="w-3.5 h-3.5 text-[#C47D6B] shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT / END COLUMN: Sticky Direct Consultation Form Card */}
              <section
                id="consultation"
                aria-labelledby="form-heading"
                className="lg:col-span-5 lg:sticky lg:top-[96px] bg-white p-6 sm:p-8 rounded-3xl border border-[#E5D6CE] shadow-[0_14px_38px_rgba(28,25,24,0.06)] scroll-mt-24"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-block text-xs font-bold text-[#B46956] bg-[#EFE7DD] px-3 py-1 rounded-md">
                    {selectedServiceObj.label}
                  </span>
                </div>

                <h2
                  id="form-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.form.heading}
                </h2>
                <p className="mt-2 mb-5 text-sm text-[#5A4E4A] leading-relaxed">
                  {t.form.intro}
                </p>

                {submitted && lastSubmittedLead ? (
                  <div className="p-5 rounded-2xl bg-[#EFE7DD]/75 border border-[#E5D6CE] space-y-3">
                    <div className="flex items-center gap-2 text-[#1E9E54] font-bold text-base">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>{t.form.confirmTitle}</span>
                    </div>
                    <p className="text-sm text-[#4A3F3B] leading-relaxed">
                      {t.form.confirmBody}
                    </p>
                    <a
                      href={buildWhatsAppLinkFromLead(lastSubmittedLead)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E9E54] hover:bg-[#198747] text-white font-semibold text-sm transition-colors"
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
                      className="block text-xs font-semibold text-[#B46956] underline underline-offset-4 pt-1 cursor-pointer"
                    >
                      {t.form.resetBtn}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="full-name"
                        className="block text-xs sm:text-sm font-semibold text-[#1C1918] mb-1"
                      >
                        {t.form.fullName} *
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder={t.form.fullNamePlaceholder}
                        className={`w-full min-h-[46px] px-3.5 py-2 rounded-xl border bg-white text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#C47D6B] ${
                          errors.name ? 'border-red-600' : 'border-[#CDBBB2]'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* WhatsApp Number with Country Code */}
                    <div>
                      <label
                        htmlFor="whatsapp-phone"
                        className="block text-xs sm:text-sm font-semibold text-[#1C1918] mb-1"
                      >
                        {t.form.whatsapp} *
                      </label>
                      <div className="flex gap-2" dir="ltr">
                        <select
                          aria-label={t.form.countryCodeAria}
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="min-h-[46px] px-2.5 rounded-xl border border-[#CDBBB2] bg-[#FAF7F2] text-sm font-semibold text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
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
                          className={`flex-1 min-w-0 min-h-[46px] px-3.5 py-2 rounded-xl border bg-white text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#C47D6B] ${
                            errors.phone ? 'border-red-600' : 'border-[#CDBBB2]'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Country & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-xs sm:text-sm font-semibold text-[#1C1918] mb-1"
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
                          className={`w-full min-h-[46px] px-3.5 py-2 rounded-xl border bg-white text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#C47D6B] ${
                            errors.country ? 'border-red-600' : 'border-[#CDBBB2]'
                          }`}
                        />
                        {errors.country && (
                          <p className="mt-1 text-xs text-red-700">{errors.country}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs sm:text-sm font-semibold text-[#1C1918] mb-1"
                        >
                          {t.form.email}
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: '' });
                          }}
                          placeholder={t.form.emailPlaceholder}
                          className={`w-full min-h-[46px] px-3.5 py-2 rounded-xl border bg-white text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#C47D6B] ${
                            errors.email ? 'border-red-600' : 'border-[#CDBBB2]'
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-700">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Interested Service */}
                    <div>
                      <label
                        htmlFor="interested-service"
                        className="block text-xs sm:text-sm font-semibold text-[#1C1918] mb-1"
                      >
                        {t.form.serviceLabel}
                      </label>
                      <select
                        id="interested-service"
                        value={selectedServiceValue}
                        onChange={(e) => setSelectedServiceValue(e.target.value)}
                        className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CDBBB2] bg-white text-sm font-medium text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                      >
                        {t.form.services.map((srv) => (
                          <option key={srv.value} value={srv.value}>
                            {srv.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Optional Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs sm:text-sm font-semibold text-[#1C1918] mb-1"
                      >
                        {t.form.message}
                      </label>
                      <textarea
                        id="message"
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.form.messagePlaceholder}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CDBBB2] bg-white text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                      />
                    </div>

                    {/* Privacy Consent */}
                    <label className="flex items-start gap-2.5 text-xs text-[#5A4E4A] cursor-pointer pt-0.5">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) setErrors({ ...errors, consent: '' });
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-[#CDBBB2] accent-[#C47D6B]"
                      />
                      <span>{t.form.consent}</span>
                    </label>
                    {errors.consent && (
                      <p className="text-xs text-red-700">{errors.consent}</p>
                    )}

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C47D6B] hover:bg-[#A86554] disabled:opacity-60 text-white font-bold text-sm sm:text-base shadow-sm transition-colors cursor-pointer"
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

                    {/* Direct WhatsApp Alternative */}
                    <a
                      href={defaultWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#1E9E54]/35 bg-[#1E9E54]/8 hover:bg-[#1E9E54]/15 text-[#177A41] font-semibold text-xs sm:text-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.form.whatsappDirect}</span>
                    </a>

                    <p className="text-[11px] text-center text-[#786A65] pt-0.5">
                      {t.form.note}
                    </p>
                  </form>
                )}
              </section>
            </div>
          </section>

          {/* =================================================================
              SECTION 03 — MEDICAL TOURISM SUPPORT (SIMPLE ICONS ONLY)
              VIP TRANSFER • ACCOMMODATION • BOOKING SERVICES
          ================================================================== */}
          <section
            aria-labelledby="tourism-heading"
            className="bg-[#EFE7DD]/70 border-b border-[#E5D6CE] py-10 sm:py-12"
          >
            <div className="max-w-[1180px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-3">
                <h2
                  id="tourism-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.tourism.heading}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#5A4E4A]">{t.tourism.sub}</p>
              </div>

              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {t.tourism.items.map((item, idx) => {
                  const Icon = idx === 0 ? Plane : idx === 1 ? Building2 : CalendarCheck;
                  return (
                    <article
                      key={item.title}
                      className="border-s border-[#D8C5BC] ps-5 flex flex-col gap-2"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E5D6CE] flex items-center justify-center shadow-2xs">
                        <Icon className="w-5 h-5 text-[#C47D6B]" strokeWidth={1.9} />
                      </div>
                      <h3 className="text-sm font-bold tracking-wider uppercase text-[#1C1918] mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A3F3B] leading-relaxed">
                        {item.desc}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 04 — SECONDARY MEDICAL SERVICES (NO ABOUT US)
          ================================================================== */}
          <section
            id="services"
            aria-labelledby="services-heading"
            className="py-14 sm:py-16 scroll-mt-20"
          >
            <div className="max-w-[1180px] mx-auto px-4 sm:px-8">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B46956] mb-1.5">
                  {t.services.kicker}
                </p>
                <h2
                  id="services-heading"
                  className="text-2xl sm:text-4xl font-extrabold text-[#1C1918] tracking-tight"
                >
                  {t.services.heading}
                </h2>
                <p className="mt-1.5 text-sm text-[#5A4E4A]">{t.services.sub}</p>
              </div>

              <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
                {t.services.items.map((srv) => (
                  <article
                    key={srv.value}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5D6CE] hover:border-[#C47D6B] transition-colors flex flex-col justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1C1918]">
                        {srv.title}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-sm text-[#5A4E4A] leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectServiceAndScroll(srv.value)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#B46956] hover:text-[#1C1918] underline underline-offset-4 self-start cursor-pointer"
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
          MINIMAL FOOTER (NO PUBLIC DASHBOARD LINK)
      ====================================================================== */}
      <footer className="border-t border-[#E5D6CE] bg-[#FAF7F2] py-6 pb-20 sm:pb-6">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#786A65]">
          <div className="flex items-center gap-3">
            <div className="bg-[#0B0A0A] rounded-md px-2 py-1">
              <img
                src={brandLogo}
                alt="ESTELUX"
                className="h-7 w-auto object-contain block"
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
             <span>{t.footer.rights}</span>

        <span className="text-[#CDBBB2]" aria-hidden="true">•</span>

        <a
          href="https://threedigitsoftware.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#5A4E4A] hover:text-[#C47D6B] transition-colors"
        >
          {isRTL ? 'تطوير: ' : 'Powered by '}
          <span className="underline underline-offset-4">threedigitsoftware.com</span>
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
            className="hidden sm:inline-flex fixed bottom-6 end-6 z-40 items-center gap-2.5 px-4 py-3 rounded-full bg-[#1E9E54] hover:bg-[#198747] text-white font-semibold text-sm shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.nav.whatsapp}</span>
          </a>

          <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5D6CE] px-3 py-2 flex items-center gap-2">
            <a
              href="#consultation"
              className="flex-1 min-h-[42px] inline-flex items-center justify-center rounded-xl bg-[#C47D6B] text-white font-bold text-xs"
            >
              {t.form.heading}
            </a>
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1E9E54] text-white font-semibold text-xs"
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
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5D6CE] bg-[#FAF7F2]">
              <div>
                <p className="text-xs font-bold text-[#B46956]">
                  {isRTL
                    ? filteredCases[lightboxIndex].tagAr
                    : filteredCases[lightboxIndex].tagEn}
                </p>
                <h3 className="text-sm font-bold text-[#1C1918]">
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

            <div className="relative bg-white flex items-center justify-center max-h-[72vh] overflow-hidden">
              <img
                src={filteredCases[lightboxIndex].src}
                alt={
                  isRTL
                    ? filteredCases[lightboxIndex].titleAr
                    : filteredCases[lightboxIndex].titleEn
                }
                className="max-h-[70vh] w-auto object-contain"
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
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={t.lightbox.next}
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredCases.length)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white border border-[#E5D6CE] shadow-md text-[#1C1918] cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-4 py-3 bg-[#FAF7F2] border-t border-[#E5D6CE] flex items-center justify-between gap-3">
              <span className="text-xs text-[#5A4E4A]">
                {formatCaseLabel(lightboxIndex)} /{' '}
                {isRTL ? toArabicDigits(filteredCases.length) : filteredCases.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(null);
                  handleSelectServiceAndScroll('dental');
                }}
                className="px-4 py-2 rounded-lg bg-[#C47D6B] hover:bg-[#A86554] text-white text-xs font-bold cursor-pointer"
              >
                {t.lightbox.cta}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CHANGE DASHBOARD PIN MODAL
      ====================================================================== */}
      {pinModalOpen && (
        <div
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
                  className="px-4 py-2 rounded-xl bg-[#C47D6B] hover:bg-[#A86554] text-white text-xs font-bold cursor-pointer"
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