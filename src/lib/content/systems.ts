import type { Locale } from '@/i18n/routing';

export type SpecRow = { label: Record<Locale, string>; value: Record<Locale, string> };

/** A single execution photo with a meaningful (non-filename) caption. */
export type GalleryItem = { src: string; caption: Record<Locale, string> };

/** An application zone + the engineering reason this system fits it. */
export type ApplicationFit = { type: Record<Locale, string>; why: Record<Locale, string> };

/** A focused technical subsection (e.g. CBI Europe radiant integration, acoustic baffle). */
export type SystemSubsection = { title: Record<Locale, string>; body: Record<Locale, string> };

/** A single FAQ entry. */
export type Faq = { q: Record<Locale, string>; a: Record<Locale, string> };

export type CeilingSystem = {
  slug: string;
  order: number;
  iconKey: 'linear' | 'grid' | 'tile' | 'baffle';
  name: Record<Locale, string>;
  /** engineering category framing (micro-label) */
  category: Record<Locale, string>;
  /** one practical application line (homepage system cards) */
  context: Record<Locale, string>;
  /** Level 1 — system definition (one structured sentence) */
  definition: Record<Locale, string>;
  /** SEO — keyword-rich title + persuasive description */
  seo: { title: Record<Locale, string>; description: Record<Locale, string> };
  /** detail-page H1 (longer, descriptive) */
  h1: Record<Locale, string>;
  /** 2–3 sentence lead — what it is + when to specify it */
  lead: Record<Locale, string>;
  /** Level 2 — engineering logic (4–6 bullets) */
  logic: Record<Locale, string[]>;
  /** system anatomy labels: profile / carrier / hanger / plenum / MEP access */
  anatomy: Record<Locale, string[]>;
  /** technical parameters — expanded spec sheet (15–20 rows) */
  specs: SpecRow[];
  /** application zones with the reason each fits */
  applications: ApplicationFit[];
  /** when NOT to specify this system */
  notRecommended: Record<Locale, string[]>;
  /** execution gallery with meaningful captions */
  gallery: GalleryItem[];
  /** design / customisation variants (dimensions, spacing, colour, finish, acoustic, curve) */
  variants: SpecRow[];
  /** 3–4 system-selection decision criteria */
  selection: Record<Locale, string[]>;
  /** focused technical subsections (optional — e.g. CBI Europe, acoustic baffle) */
  subsections?: SystemSubsection[];
  /** required visuals / visual-documentation checklist (placeholders until real assets exist) */
  requiredVisuals: Record<Locale, string[]>;
  /** 4 FAQ entries */
  faq: Faq[];
  /** system-specific conversion CTA text */
  systemCta: Record<Locale, string>;
  /** short comparison hint shown in the related-systems section */
  comparisonHint: Record<Locale, string>;
  cover: string;
};

/** Repeated, deliberately honest placeholder for unverified certified values. */
const TBD: Record<Locale, string> = {
  fa: 'نیازمند تأیید واحد مهندسی آویزسازه',
  en: 'To be confirmed by AvizSazeh engineering team',
};
const BY_ARCH: Record<Locale, string> = {
  fa: 'قابل تعریف براساس طراحی معماری',
  en: 'Definable per architectural design',
};
const COAT: Record<Locale, string> = {
  fa: 'رنگ پودری الکترواستاتیک پلی‌استر',
  en: 'Electrostatic polyester powder coat',
};
const COAT_25: Record<Locale, string> = {
  fa: 'رنگ پودری الکترواستاتیک، ۲۵ میکرون',
  en: 'Electrostatic powder coat, 25 µm',
};
const COLORS: Record<Locale, string> = {
  fa: 'رنگ‌های استاندارد و سفارشی پروژه',
  en: 'Standard & custom project colours',
};

/**
 * The four executed ceiling systems of AvizSazeh, framed as engineering systems.
 * Real spec-sheet values (from avizsazeh.ir / source/CONTENT.md) are used where they
 * exist; unverified certified values use the explicit "TBD by engineering" placeholder.
 */
export const systems: CeilingSystem[] = [
  /* ─────────────────────────────── 1 · LINEAR ─────────────────────────────── */
  {
    slug: 'linear-ceiling',
    order: 1,
    iconKey: 'linear',
    name: { fa: 'سیستم سقف خطی', en: 'Linear Ceiling System' },
    category: { fa: 'سیستم نواری جهت‌دار', en: 'Directional strip system' },
    context: {
      fa: 'برای معماری جهت‌دار، راهروها، فضاهای تجاری و ریتم خطی تمیز.',
      en: 'For directional architecture, corridors, commercial interiors and clean linear rhythm.',
    },
    definition: {
      fa: 'یک سیستم سقف کاذب نواری ماژولار از تسمه‌های آلومینیومی که در کنار هم الگوهای خطی، مورب یا شعاعی می‌سازد.',
      en: 'A modular strip ceiling system of aluminium profiles arranged side by side to form linear, diagonal, or radial patterns.',
    },
    seo: {
      title: {
        fa: 'سقف خطی آلومینیوم | آویزسازه — فرودگاه، تجاری، صنعتی',
        en: 'Aluminium Linear Ceiling | AvizSazeh — Airport, Commercial, Industrial',
      },
      description: {
        fa: 'سقف خطی آلومینیومی آویزسازه با نقشه اجرایی اختصاصی، تسمه‌های فلزی با پوشش پلی‌استر، دسترسی به پلنوم و قابلیت طراحی خطی، مورب یا شعاعی برای فضاهای تجاری، فرودگاهی و صنعتی.',
        en: 'AvizSazeh aluminium linear ceiling with dedicated shop drawings, polyester-coated metal strips, plenum access and linear, diagonal or radial layouts for commercial, airport and industrial spaces.',
      },
    },
    h1: {
      fa: 'سیستم سقف خطی — سقف معماری برای فضاهای طولانی و بزرگ‌مقیاس',
      en: 'Linear Ceiling System — Architectural ceilings for long, large-scale spaces',
    },
    lead: {
      fa: 'سقف خطی سیستمی نواری از تسمه‌های آلومینیومی است که ریتم خطی پیوسته و جهت‌دار می‌سازد و سقف کاذب فلزی معماری را به ابزار هدایت بصری تبدیل می‌کند. این سیستم زمانی تخصیص می‌یابد که فضا کشیده و بزرگ‌مقیاس باشد، ترکیب با نور خطی اهمیت داشته باشد و دسترسی دوره‌ای به پلنوم لازم باشد. قابلیت اجرای خطی، مورب، شعاعی و منحنی، آن را به گزینه‌ای انعطاف‌پذیر برای فرودگاه‌ها، راهروها و فضاهای تجاری بدل می‌کند.',
      en: 'The linear ceiling is a strip system of aluminium profiles that builds a continuous, directional rhythm and turns an architectural metal ceiling into a wayfinding device. It is specified when a space is elongated and large-scale, when integration with linear lighting matters, and when periodic plenum access is required. Linear, diagonal, radial and curved layouts make it a flexible choice for airports, corridors and commercial interiors.',
    },
    logic: {
      fa: [
        'توزیع بار در راستای محورهای خطی و موازی برای سطوح بزرگ و پیوسته',
        'تسمه‌های آلومینیومی با پوشش رنگ پلی‌استر — مقاوم به رطوبت و عوامل جوی',
        'دسترسی به فضای پلنوم برای روشنایی، تهویه و سیستم‌های اعلام/اطفای حریق',
        'تنوع ابعاد، ارتفاع تسمه و رنگ برای کنترل ریتم بصری و عمق فضا',
        'سازگاری با نور خطی و نور مخفی برای یکپارچگی معماری روشنایی',
        'امکان اجرای خطی، مورب، شعاعی و منحنی با بررسی مهندسی',
      ],
      en: [
        'Load distribution along parallel, linear axes for large continuous fields',
        'Polyester-coated aluminium strips — moisture- and weather-resistant',
        'Plenum access for lighting, HVAC, and fire detection / suppression',
        'Variable strip width, height and colour to control spatial rhythm and depth',
        'Compatible with linear and concealed lighting for integrated architectural light',
        'Linear, diagonal, radial and curved execution subject to engineering review',
      ],
    },
    anatomy: {
      fa: ['تسمه آلومینیومی (پروفیل)', 'کریر اصلی', 'آویز قابل تنظیم', 'فضای پلنوم', 'دسترسی تأسیسات (MEP)'],
      en: ['Aluminium strip (profile)', 'Primary carrier', 'Adjustable hanger', 'Plenum void', 'MEP access'],
    },
    specs: [
      { label: { fa: 'نوع سیستم', en: 'System type' }, value: { fa: 'سقف نواری باز', en: 'Linear strip ceiling' } },
      { label: { fa: 'متریال', en: 'Material' }, value: { fa: 'آلومینیوم یا متریال تأییدشده پروژه', en: 'Aluminium or project-approved material' } },
      { label: { fa: 'عرض نوار', en: 'Strip width' }, value: TBD },
      { label: { fa: 'ارتفاع نوار', en: 'Strip height' }, value: TBD },
      { label: { fa: 'فاصله بین نوارها', en: 'Strip spacing' }, value: BY_ARCH },
      { label: { fa: 'طول ماژول', en: 'Module length' }, value: TBD },
      { label: { fa: 'ضخامت ورق', en: 'Sheet thickness' }, value: TBD },
      { label: { fa: 'پوشش رنگ', en: 'Finish' }, value: COAT },
      { label: { fa: 'رنگ‌بندی', en: 'Colour range' }, value: COLORS },
      { label: { fa: 'الگوی نصب', en: 'Installation pattern' }, value: { fa: 'خطی / مورب / شعاعی / منحنی با بررسی مهندسی', en: 'Linear / diagonal / radial / curved (engineering review)' } },
      { label: { fa: 'سیستم تعلیق', en: 'Suspension system' }, value: { fa: 'کریر اصلی، آویز و اتصالات تنظیمی', en: 'Primary carrier, hangers & adjustable connectors' } },
      { label: { fa: 'دسترسی به پلنوم', en: 'Plenum access' }, value: { fa: 'دسترسی از فاصله بین نوارها و نواحی تعریف‌شده', en: 'Via gaps between strips & defined zones' } },
      { label: { fa: 'یکپارچگی با روشنایی', en: 'Lighting integration' }, value: { fa: 'مناسب برای نور خطی و نور مخفی', en: 'Suited to linear & concealed lighting' } },
      { label: { fa: 'امکان آکوستیک', en: 'Acoustic option' }, value: { fa: 'با جاذب صوتی در پلنوم، نیازمند طراحی مهندسی', en: 'With plenum absorbers, requires engineering design' } },
      { label: { fa: 'کلاس آتش', en: 'Fire class' }, value: TBD },
      { label: { fa: 'وزن تقریبی', en: 'Approx. weight' }, value: TBD },
      { label: { fa: 'کاربردها', en: 'Applications' }, value: { fa: 'فرودگاه، راهروهای بزرگ، فضاهای تجاری، اداری، صنعتی', en: 'Airports, large corridors, commercial, office, industrial' } },
    ],
    applications: [
      {
        type: { fa: 'فرودگاه و پایانه حمل‌ونقل', en: 'Airports & transport terminals' },
        why: { fa: 'برای ایجاد جهت بصری و ریتم طولی در فضاهای بسیار بزرگ.', en: 'To create visual direction and longitudinal rhythm across very large spaces.' },
      },
      {
        type: { fa: 'راهروها و فضاهای کشیده', en: 'Corridors & elongated spaces' },
        why: { fa: 'برای هدایت حرکت و یکپارچگی بصری در طول مسیر.', en: 'To guide movement and unify the space along its length.' },
      },
      {
        type: { fa: 'مراکز تجاری', en: 'Commercial centres' },
        why: { fa: 'برای ترکیب نور خطی، دسترسی و ظاهر معماری منظم.', en: 'To combine linear lighting, access and an ordered architectural look.' },
      },
      {
        type: { fa: 'فضاهای صنعتی کنترل‌شده', en: 'Controlled industrial spaces' },
        why: { fa: 'برای دوام، دسترسی و اجرای منظم در محیط‌های بهره‌برداری.', en: 'For durability, access and orderly execution in operational environments.' },
      },
    ],
    notRecommended: {
      fa: [
        'فضاهایی که نیاز به سطح کاملاً بسته و قابل شست‌وشوی پیوسته دارند',
        'پروژه‌هایی که دسترسی کاملاً مخفی و بدون دید به پلنوم می‌خواهند',
      ],
      en: [
        'Spaces requiring a fully closed, continuously washable surface',
        'Projects that need a fully concealed plenum with no visible void',
      ],
    },
    gallery: [
      // TODO: replace with real named project references when confirmed by AvizSazeh
      { src: '/systems/linear-1.webp', caption: { fa: 'نمونه اجرای سقف خطی در فضای تجاری بزرگ‌مقیاس', en: 'Linear ceiling installed in a large-scale commercial space' } },
      { src: '/systems/linear-2.jpg', caption: { fa: 'دیتیل پروفیل تسمه و فاصله‌گذاری در اجرای خطی', en: 'Strip profile and spacing detail in a linear installation' } },
    ],
    variants: [
      { label: { fa: 'ابعاد (عرض/ارتفاع نوار)', en: 'Dimensions (strip width/height)' }, value: TBD },
      { label: { fa: 'فاصله‌گذاری', en: 'Spacing' }, value: BY_ARCH },
      { label: { fa: 'رنگ‌بندی', en: 'Colours' }, value: COLORS },
      { label: { fa: 'پوشش', en: 'Finish' }, value: COAT },
      { label: { fa: 'گزینه آکوستیک', en: 'Acoustic option' }, value: { fa: 'جاذب در پلنوم — نیازمند طراحی مهندسی', en: 'Plenum absorber — requires engineering design' } },
      { label: { fa: 'اجرای منحنی/شعاعی', en: 'Curved / radial' }, value: { fa: 'خطی، مورب، شعاعی، منحنی با بررسی مهندسی', en: 'Linear, diagonal, radial, curved with engineering review' } },
    ],
    selection: {
      fa: [
        'فضای شما کشیده و جهت‌دار است و به ریتم خطی پیوسته نیاز دارد',
        'ترکیب با نور خطی و نور مخفی بخشی از مفهوم معماری است',
        'دسترسی دوره‌ای به پلنوم لازم است اما سطح کاملاً بسته ضروری نیست',
        'الگوی مورب، شعاعی یا منحنی بخشی از زبان طراحی پروژه است',
      ],
      en: [
        'Your space is elongated and directional and needs a continuous linear rhythm',
        'Integration with linear and concealed lighting is part of the architectural concept',
        'Periodic plenum access is needed but a fully closed surface is not essential',
        'Diagonal, radial or curved patterning is part of the project design language',
      ],
    },
    requiredVisuals: {
      fa: [
        'عکس هیرو از اجرای بزرگ‌مقیاس سقف خطی',
        'نمای نزدیک پروفیل تسمه و فاصله بین نوارها',
        'دیاگرام: عرض، ارتفاع، فاصله، کریر، آویز',
        'نمونه یکپارچگی با روشنایی خطی',
        'نمونه الگوی مورب یا شعاعی',
      ],
      en: [
        'Hero photo of a large-scale installed linear ceiling',
        'Close-up of strip profile and the gap between strips',
        'Diagram: strip width, height, gap, carrier, hanger',
        'Linear-lighting integration example',
        'Diagonal / radial pattern example',
      ],
    },
    faq: [
      {
        q: { fa: 'سقف خطی برای چه فضاهایی مناسب است؟', en: 'What spaces is a linear ceiling suited to?' },
        a: { fa: 'سقف خطی برای فضاهای کشیده و بزرگ‌مقیاس مانند فرودگاه‌ها، راهروها، مراکز تجاری و فضاهای صنعتی کنترل‌شده مناسب است؛ هرجا که ریتم خطی جهت‌دار، یکپارچگی با روشنایی و دسترسی دوره‌ای به پلنوم اهمیت داشته باشد.', en: 'It suits elongated, large-scale spaces such as airports, corridors, commercial centres and controlled industrial areas — wherever directional linear rhythm, lighting integration and periodic plenum access matter.' },
      },
      {
        q: { fa: 'آیا سقف خطی امکان دسترسی به تأسیسات پشت سقف را دارد؟', en: 'Does a linear ceiling allow access to services behind it?' },
        a: { fa: 'بله. فاصله بین نوارها و نواحی تعریف‌شده، دسترسی به فضای پلنوم را برای روشنایی، تهویه و سیستم‌های اعلام و اطفای حریق فراهم می‌کند. جزئیات دسترسی در نقشه اجرایی تعیین می‌شود.', en: 'Yes. The gaps between strips and defined zones provide plenum access for lighting, HVAC and fire detection/suppression. Access detailing is set in the shop drawings.' },
      },
      {
        q: { fa: 'آیا سقف خطی قابلیت اجرای مورب یا شعاعی دارد؟', en: 'Can a linear ceiling be run diagonally or radially?' },
        a: { fa: 'بله. علاوه بر الگوی خطی، اجرای مورب، شعاعی و منحنی با بررسی مهندسی امکان‌پذیر است؛ هندسه نهایی به شعاع، چیدمان کریر و طول ماژول وابسته است.', en: 'Yes. Besides the linear pattern, diagonal, radial and curved layouts are possible subject to engineering review; the final geometry depends on radius, carrier layout and module length.' },
      },
      {
        q: { fa: 'آیا می‌توان سقف خطی را با نور خطی ترکیب کرد؟', en: 'Can a linear ceiling be combined with linear lighting?' },
        a: { fa: 'بله. این سیستم برای یکپارچگی با نور خطی و نور مخفی طراحی می‌شود و هماهنگی جانمایی روشنایی در نقشه اجرایی انجام می‌گیرد.', en: 'Yes. The system is designed to integrate with linear and concealed lighting, with luminaire placement coordinated in the shop drawings.' },
      },
    ],
    systemCta: {
      fa: 'آیا فضای شما برای سقف خطی مناسب است؟ مشخصات پروژه را ثبت کنید.',
      en: 'Is your space right for a linear ceiling? Submit your project specifications.',
    },
    comparisonHint: {
      fa: 'ریتم خطی جهت‌دار؛ در مقایسه با گریلیوم، خط پیوسته‌تر و سطح بسته‌تر.',
      en: 'Directional linear rhythm; vs. open cell, a more continuous line and more closed surface.',
    },
    cover: '/design-system/linear-ceiling.png',
  },

  /* ─────────────────────────── 2 · OPEN CELL / GRILLIOM ─────────────────────────── */
  {
    slug: 'open-cell',
    order: 2,
    iconKey: 'grid',
    name: { fa: 'سیستم سقف سلول‌باز (گریلیوم)', en: 'Open Cell System (Grilliom)' },
    category: { fa: 'سیستم شبکه‌ای دوبعدی', en: 'Two-dimensional grid system' },
    context: {
      fa: 'برای عمق بصری باز، تهویه، دسترسی تأسیسات و سقف‌های وسیع.',
      en: 'For open visual depth, ventilation, MEP accessibility and large ceiling fields.',
    },
    definition: {
      fa: 'یک سیستم شبکه‌ای ماژولار از پروفیل‌های U نر و ماده که ساختار سلولی باز برای عبور نور و هوا ایجاد می‌کند.',
      en: 'A modular orthogonal grid assembled from interlocking U-profiles into an open cellular structure that lets light and air pass through.',
    },
    seo: {
      title: {
        fa: 'سقف سلول‌باز گریلیوم فلزی | آویزسازه — تجاری، مال، حمل‌ونقل',
        en: 'Open Cell Grilliom Metal Ceiling | AvizSazeh — Retail, Mall, Transit',
      },
      description: {
        fa: 'سقف گریلیوم آلومینیومی آویزسازه با شبکه باز، دسترسی فوری به پلنوم، هماهنگی با روشنایی، HVAC و سیستم‌های اعلام و اطفای حریق. مناسب مال‌ها، مراکز تجاری و پایانه‌های حمل‌ونقل.',
        en: 'AvizSazeh aluminium grilliom ceiling with an open grid, immediate plenum access and coordination with lighting, HVAC and fire detection/suppression. Suited to malls, commercial centres and transport terminals.',
      },
    },
    h1: {
      fa: 'سیستم سقف سلول‌باز (گریلیوم) — شبکه باز با یکپارچگی کامل MEP',
      en: 'Open Cell (Grilliom) System — An open grid with full MEP integration',
    },
    lead: {
      fa: 'سقف سلول‌باز یا گریلیوم، سیستمی شبکه‌ای از پروفیل‌های U نر و ماده است که سطحی باز و دارای عمق بصری می‌سازد و دید به پلنوم را حفظ می‌کند. این سیستم زمانی انتخاب می‌شود که دسترسی سریع و مکرر به تأسیسات MEP، نصب سریع و عمق بصری باز اهمیت داشته باشد. عبور آزاد نور و هوا، آن را برای مال‌ها، مراکز تجاری و پایانه‌های پرتردد مناسب می‌کند.',
      en: 'The open cell ceiling, or grilliom, is a grid of interlocking male/female U-profiles that creates an open, deep surface while keeping the plenum visible. It is chosen when fast, frequent MEP access, rapid installation and open visual depth are priorities. The free passage of light and air makes it well suited to malls, commercial centres and high-traffic terminals.',
    },
    logic: {
      fa: [
        'توزیع بار دوبعدی و تعادل یکنواخت در کل شبکه',
        'انعطاف بالا برای یکپارچه‌سازی تأسیسات مکانیکی و برقی (MEP)',
        'پنل‌های فلزی سبک با مقاومت مکانیکی بالا و نصب سریع',
        'دسترسی کامل و فوری به فضای پلنوم برای نگهداری و تعمیرات',
        'عبور آزاد نور و هوا برای عمق بصری باز و تهویه طبیعی',
        'مکانیزم اتصال شبکه‌ای پروفیل U نر و ماده برای اجرای منظم',
      ],
      en: [
        '2D load distribution with uniform balance across the grid',
        'High flexibility for MEP integration',
        'Lightweight metal panels with high mechanical resistance and fast install',
        'Immediate, full plenum access for maintenance and repair',
        'Free passage of light and air for open visual depth and natural ventilation',
        'Male/female U-profile grid interlock for orderly execution',
      ],
    },
    anatomy: {
      fa: ['پروفیل U (سلول)', 'شبکه نگهدارنده', 'آویز', 'فضای پلنوم', 'دسترسی تأسیسات (MEP)'],
      en: ['U-profile (cell)', 'Supporting grid', 'Hanger', 'Plenum void', 'MEP access'],
    },
    specs: [
      { label: { fa: 'نوع سیستم', en: 'System type' }, value: { fa: 'سقف شبکه‌ای باز / گریلیوم', en: 'Open cell grilliom' } },
      { label: { fa: 'متریال', en: 'Material' }, value: { fa: 'آلومینیوم یا فلز تأییدشده پروژه', en: 'Aluminium or project-approved metal' } },
      { label: { fa: 'ضخامت ورق', en: 'Sheet thickness' }, value: { fa: '۰٫۵ میلی‌متر', en: '0.5 mm' } },
      { label: { fa: 'ابعاد ماژول', en: 'Module dimensions' }, value: { fa: '۶۰۰×۶۰۰ میلی‌متر', en: '600×600 mm' } },
      { label: { fa: 'اندازه سلول', en: 'Cell size' }, value: TBD },
      { label: { fa: 'ارتفاع پروفیل U', en: 'U-profile height' }, value: TBD },
      { label: { fa: 'درصد سطح باز', en: 'Open area' }, value: { fa: 'وابسته به ابعاد سلول و پروفیل', en: 'Depends on cell & profile dimensions' } },
      { label: { fa: 'پوشش رنگ', en: 'Finish' }, value: COAT_25 },
      { label: { fa: 'رنگ‌بندی', en: 'Colour range' }, value: COLORS },
      { label: { fa: 'مکانیزم اتصال', en: 'Connection mechanism' }, value: { fa: 'پروفیل‌های U نر و ماده / اتصال شبکه‌ای', en: 'Male/female U-profiles / grid interlock' } },
      { label: { fa: 'سیستم تعلیق', en: 'Suspension system' }, value: { fa: 'آویز، کریر و شبکه نگهدارنده', en: 'Hangers, carrier & supporting grid' } },
      { label: { fa: 'دسترسی به پلنوم', en: 'Plenum access' }, value: { fa: 'بسیار بالا / دسترسی سریع', en: 'Very high / fast access' } },
      { label: { fa: 'یکپارچگی با MEP', en: 'MEP integration' }, value: { fa: 'روشنایی، HVAC، اعلام و اطفای حریق', en: 'Lighting, HVAC, fire detection & suppression' } },
      { label: { fa: 'قابلیت عبور هوا و نور', en: 'Air & light passage' }, value: { fa: 'بالا', en: 'High' } },
      { label: { fa: 'کلاس آتش', en: 'Fire class' }, value: TBD },
      { label: { fa: 'وزن تقریبی', en: 'Approx. weight' }, value: TBD },
      { label: { fa: 'کاربردها', en: 'Applications' }, value: { fa: 'مراکز تجاری، مال‌ها، پایانه‌ها، فضاهای عمومی پرتردد', en: 'Commercial centres, malls, terminals, high-traffic public spaces' } },
    ],
    applications: [
      {
        type: { fa: 'مراکز تجاری و مال‌ها', en: 'Commercial centres & malls' },
        why: { fa: 'برای حفظ عمق بصری و دسترسی سریع به تأسیسات بالای سقف.', en: 'To preserve visual depth and keep fast access to overhead services.' },
      },
      {
        type: { fa: 'پایانه‌های حمل‌ونقل', en: 'Transport terminals' },
        why: { fa: 'برای هماهنگی با MEP و نگهداری آسان در فضاهای بزرگ.', en: 'For MEP coordination and easy maintenance across large fields.' },
      },
      {
        type: { fa: 'فضاهای عمومی پرتردد', en: 'High-traffic public spaces' },
        why: { fa: 'برای نصب سریع و تعمیرات آسان بدون مختل‌کردن بهره‌برداری.', en: 'For fast install and easy repair without disrupting operation.' },
      },
      {
        type: { fa: 'فضاهای با پلنوم فعال', en: 'Spaces with an active plenum' },
        why: { fa: 'برای دسترسی مستمر به تأسیسات پشت سقف.', en: 'For continuous access to the services behind the ceiling.' },
      },
    ],
    notRecommended: {
      fa: [
        'فضاهایی که باید پلنوم کاملاً پنهان باشد',
        'فضاهای بسیار آلوده یا پرگردوغبار بدون برنامه نگهداری منظم',
        'فضاهای استریل که سطح بسته و قابل شست‌وشوی کامل می‌خواهند',
      ],
      en: [
        'Spaces where the plenum must be fully concealed',
        'Very dusty or contaminated spaces without a regular maintenance plan',
        'Sterile spaces requiring a fully closed, fully washable surface',
      ],
    },
    gallery: [
      // TODO: replace with real named project references when confirmed by AvizSazeh
      { src: '/systems/opencell-1.jpg', caption: { fa: 'نمونه اجرای سقف گریلیوم در مرکز تجاری پرتردد', en: 'Grilliom ceiling installed in a busy commercial centre' } },
      { src: '/systems/opencell-2.jpg', caption: { fa: 'شبکه باز گریلیوم با دید به پلنوم و تأسیسات', en: 'Open grilliom grid revealing the plenum and services' } },
      { src: '/systems/opencell-3.jpg', caption: { fa: 'دیتیل اتصال پروفیل U نر و ماده', en: 'Male/female U-profile joint detail' } },
      { src: '/systems/opencell-4.jpg', caption: { fa: 'یکپارچگی شبکه سلول‌باز با روشنایی و تهویه', en: 'Open cell grid integrated with lighting and ventilation' } },
    ],
    variants: [
      { label: { fa: 'اندازه سلول', en: 'Cell size' }, value: TBD },
      { label: { fa: 'ارتفاع پروفیل U', en: 'U-profile height' }, value: TBD },
      { label: { fa: 'ابعاد ماژول', en: 'Module dimensions' }, value: { fa: '۶۰۰×۶۰۰ میلی‌متر', en: '600×600 mm' } },
      { label: { fa: 'رنگ‌بندی', en: 'Colours' }, value: COLORS },
      { label: { fa: 'پوشش', en: 'Finish' }, value: COAT_25 },
      { label: { fa: 'درصد سطح باز', en: 'Open area' }, value: { fa: 'وابسته به اندازه سلول و ارتفاع پروفیل', en: 'Depends on cell size & profile height' } },
    ],
    selection: {
      fa: [
        'عمق بصری باز و دید به پلنوم بخشی از مفهوم طراحی است',
        'دسترسی سریع و مکرر به تأسیسات MEP لازم است',
        'فضای پرتردد عمومی با نیاز به نصب سریع و نگهداری آسان دارید',
        'سطح کاملاً بسته و قابل شست‌وشو ضروری نیست',
      ],
      en: [
        'Open visual depth and a visible plenum are part of the design concept',
        'Fast, frequent access to MEP services is required',
        'You have a high-traffic public space needing rapid install and easy maintenance',
        'A fully closed, washable surface is not essential',
      ],
    },
    requiredVisuals: {
      fa: [
        'دیاگرام انفجاری قفل پروفیل U نر و ماده',
        'مقایسه اندازه سلول‌ها',
        'عکس یکپارچگی با MEP',
        'نمای نزدیک اتصال شبکه',
        'اجرای بزرگ‌مقیاس تجاری یا پایانه',
      ],
      en: [
        'Exploded diagram of the male/female U-profile interlock',
        'Cell-size comparison',
        'MEP integration photo',
        'Grid-joint close-up',
        'Large commercial / terminal installation',
      ],
    },
    faq: [
      {
        q: { fa: 'سقف گریلیوم چه تفاوتی با سقف بسته دارد؟', en: 'How does a grilliom ceiling differ from a closed ceiling?' },
        a: { fa: 'گریلیوم سطحی شبکه‌ای و باز است که نور و هوا را عبور می‌دهد و دید به پلنوم را حفظ می‌کند؛ در حالی‌که سقف بسته سطحی پیوسته و پوشیده می‌سازد. نتیجه، عمق بصری بیشتر و دسترسی فوری به تأسیسات است.', en: 'A grilliom is an open grid that passes light and air and keeps the plenum visible, whereas a closed ceiling forms a continuous covered surface. The result is greater visual depth and immediate access to services.' },
      },
      {
        q: { fa: 'آیا سقف سلول‌باز برای تأسیسات MEP مناسب است؟', en: 'Is an open cell ceiling suitable for MEP services?' },
        a: { fa: 'بله. سطح باز شبکه امکان هماهنگی و دسترسی سریع به روشنایی، HVAC و سیستم‌های اعلام و اطفای حریق را فراهم می‌کند و یکی از مناسب‌ترین گزینه‌ها برای پلنوم فعال است.', en: 'Yes. The open grid allows coordination with, and fast access to, lighting, HVAC and fire detection/suppression, making it one of the best options for an active plenum.' },
      },
      {
        q: { fa: 'اندازه سلول‌ها چگونه انتخاب می‌شود؟', en: 'How is the cell size selected?' },
        a: { fa: 'اندازه سلول و ارتفاع پروفیل U براساس عمق بصری مدنظر، درصد سطح باز، شرایط روشنایی و الزامات تأسیساتی تعیین و توسط واحد مهندسی آویزسازه تأیید می‌شود.', en: 'Cell size and U-profile height are set by the desired visual depth, open-area ratio, lighting conditions and service requirements, and are confirmed by the AvizSazeh engineering team.' },
      },
      {
        q: { fa: 'چه زمانی سقف گریلیوم پیشنهاد نمی‌شود؟', en: 'When is a grilliom ceiling not recommended?' },
        a: { fa: 'زمانی که پلنوم باید کاملاً پنهان بماند، فضا بسیار پرگردوغبار و بدون برنامه نگهداری باشد، یا فضای استریل به سطح بسته و قابل شست‌وشوی کامل نیاز داشته باشد.', en: 'When the plenum must stay fully concealed, the space is very dusty without a maintenance plan, or a sterile area needs a fully closed, washable surface.' },
      },
    ],
    systemCta: {
      fa: 'پروژه خود را برای ارزیابی سیستم گریلیوم ثبت کنید.',
      en: 'Submit your project for grilliom system evaluation.',
    },
    comparisonHint: {
      fa: 'بیشترین دسترسی به پلنوم و یکپارچگی MEP؛ در مقابل تایل، سطح بازتر.',
      en: 'Maximum plenum access and MEP integration; vs. metal tile, a more open surface.',
    },
    cover: '/design-system/open-cell.png',
  },

  /* ─────────────────────────────── 3 · METAL TILE ─────────────────────────────── */
  {
    slug: 'metal-tile',
    order: 3,
    iconKey: 'tile',
    name: { fa: 'سیستم تایل فلزی', en: 'Metal Tile System' },
    category: { fa: 'سیستم شبکه‌ای پنلی', en: 'Panelised grid system' },
    context: {
      fa: 'برای چیدمان ماژولار، قابل‌دسترس و تمیز با دیتیل کنترل‌شده.',
      en: 'For modular, accessible and clean ceiling layouts with controlled detailing.',
    },
    definition: {
      fa: 'یک سیستم پنلی از تایل‌های فولاد گالوانیزه یا آلومینیوم با پوشش رنگ پودری الکترواستاتیک پلی‌استر.',
      en: 'A panelised system of galvanised-steel or aluminium tiles finished with electrostatic polyester powder coating.',
    },
    seo: {
      title: {
        fa: 'تایل فلزی سقف | آویزسازه — آکوستیک، بیمارستان، CBI Europe',
        en: 'Metal Ceiling Tile | AvizSazeh — Acoustic, Hospital, CBI Europe',
      },
      description: {
        fa: 'تایل فلزی آویزسازه از گالوانیزه یا آلومینیوم با پوشش الکترواستاتیک، امکان پانچ آکوستیک، دسترسی آسان به پلنوم و قابلیت بررسی برای فضاهای بیمارستانی، اداری، فرودگاهی و سیستم‌های تابشی CBI Europe.',
        en: 'AvizSazeh metal tile in galvanised steel or aluminium with electrostatic coating, optional acoustic perforation, easy plenum access and reviewability for hospital, office and airport spaces and CBI Europe radiant systems.',
      },
    },
    h1: {
      fa: 'سیستم تایل فلزی — سقف پنلی با عملکرد آکوستیک و قابلیت یکپارچگی تأسیساتی',
      en: 'Metal Tile System — A panelised ceiling with acoustic performance and service integration',
    },
    lead: {
      fa: 'تایل فلزی سیستمی پنلی از تایل‌های گالوانیزه یا آلومینیوم با پوشش الکترواستاتیک است که سطحی منظم، ماژولار و قابل‌تعویض می‌سازد. این سیستم زمانی انتخاب می‌شود که نظم بصری، نگهداری آسان، عملکرد آکوستیک با پانچ و امکان هماهنگی تأسیساتی اهمیت داشته باشد. قابلیت بررسی برای فضاهای بهداشتی و سازگاری با سیستم‌های تابشی CBI Europe، دامنه کاربرد آن را گسترده می‌کند.',
      en: 'The metal tile is a panelised system of galvanised or aluminium tiles with an electrostatic finish that creates an ordered, modular and replaceable surface. It is specified when visual order, easy maintenance, perforated acoustic performance and service coordination matter. Reviewability for hygienic spaces and compatibility with CBI Europe radiant systems broaden its range.',
    },
    logic: {
      fa: [
        'نصب سریع در مرحله ساخت و دسترسی آسان به پلنوم در بهره‌برداری',
        'مقاومت بالا در برابر رطوبت، سایش و خوردگی با سطح یکنواخت و بادوام',
        'طراحی پانچ ویژه به همراه پشم‌سنگ برای عملکرد آکوستیک',
        'قابلیت بررسی برای سازگاری با سیستم‌های تابشی CBI Europe',
        'تنوع نوع نصب: نمایان، مخفی و کلیپ‌این براساس نیاز پروژه',
        'سطح منظم و ماژولار برای تعویض‌پذیری و کنترل دیتیل',
      ],
      en: [
        'Fast install during construction, easy plenum access in use',
        'High resistance to moisture, abrasion and corrosion with a uniform durable surface',
        'Special punching + rock wool for acoustic performance',
        'Reviewable for compatibility with CBI Europe radiant systems',
        'Mounting options: exposed, concealed and clip-in per project need',
        'Ordered, modular surface for replaceability and detail control',
      ],
    },
    anatomy: {
      fa: ['تایل فلزی (پنل)', 'سازه نگهدارنده (گرید)', 'آویز', 'فضای پلنوم', 'دسترسی تأسیسات (MEP)'],
      en: ['Metal tile (panel)', 'Supporting grid', 'Hanger', 'Plenum void', 'MEP access'],
    },
    specs: [
      { label: { fa: 'نوع سیستم', en: 'System type' }, value: { fa: 'سقف پنلی / تایل فلزی', en: 'Panelised metal tile' } },
      { label: { fa: 'متریال', en: 'Material' }, value: { fa: 'گالوانیزه یا آلومینیوم', en: 'Galvanised steel or aluminium' } },
      { label: { fa: 'ضخامت ورق', en: 'Sheet thickness' }, value: { fa: '۰٫۵ / ۰٫۶ / ۰٫۷ میلی‌متر', en: '0.5 / 0.6 / 0.7 mm' } },
      { label: { fa: 'ابعاد استاندارد', en: 'Standard dimensions' }, value: { fa: '۶۰۰×۶۰۰ / ۶۰۰×۱۲۰ میلی‌متر', en: '600×600 / 600×120 mm' } },
      { label: { fa: 'نوع نصب', en: 'Mounting type' }, value: { fa: 'نمایان / مخفی / کلیپ‌این — نیازمند تأیید پروژه', en: 'Exposed / concealed / clip-in — project to confirm' } },
      { label: { fa: 'نوع پنل', en: 'Panel type' }, value: { fa: 'ساده / پانچ / آکوستیک', en: 'Plain / perforated / acoustic' } },
      { label: { fa: 'پوشش رنگ', en: 'Finish' }, value: COAT_25 },
      { label: { fa: 'رنگ‌بندی', en: 'Colour range' }, value: COLORS },
      { label: { fa: 'گزینه آکوستیک', en: 'Acoustic option' }, value: { fa: 'پانچ به همراه پشم‌سنگ یا جاذب صوتی', en: 'Perforation with rock wool or acoustic absorber' } },
      { label: { fa: 'مقدار NRC', en: 'NRC value' }, value: TBD },
      { label: { fa: 'سازگاری با CBI Europe', en: 'CBI Europe compatibility' }, value: { fa: 'قابل بررسی و طراحی براساس نیاز پروژه', en: 'Reviewable & designable per project need' } },
      { label: { fa: 'دسترسی به پلنوم', en: 'Plenum access' }, value: { fa: 'از طریق بازشدن یا جابه‌جایی تایل', en: 'Via opening or removing tiles' } },
      { label: { fa: 'مقاومت رطوبتی', en: 'Moisture resistance' }, value: { fa: 'وابسته به متریال، پوشش و شرایط محیطی', en: 'Depends on material, finish & environment' } },
      { label: { fa: 'قابلیت شست‌وشو', en: 'Washability' }, value: { fa: 'نیازمند تأیید براساس نوع پوشش و کاربری', en: 'To confirm per finish & use' } },
      { label: { fa: 'مناسب فضای استریل', en: 'Sterile-space suitability' }, value: { fa: 'نیازمند تأیید مشخصات بهداشتی پروژه', en: 'Requires project hygiene-spec confirmation' } },
      { label: { fa: 'کلاس آتش', en: 'Fire class' }, value: TBD },
      { label: { fa: 'وزن تقریبی', en: 'Approx. weight' }, value: TBD },
      { label: { fa: 'کاربردها', en: 'Applications' }, value: { fa: 'بیمارستان، اداری، بانک، فرودگاه، مراکز تجاری', en: 'Hospitals, offices, banks, airports, commercial centres' } },
    ],
    applications: [
      {
        type: { fa: 'بیمارستان و فضای درمانی', en: 'Hospitals & healthcare' },
        why: { fa: 'به دلیل سطح منظم، دسترسی کنترل‌شده و امکان بررسی پوشش بهداشتی.', en: 'For an ordered surface, controlled access and reviewable hygienic finishes.' },
      },
      {
        type: { fa: 'اداری و بانکی', en: 'Office & banking' },
        why: { fa: 'برای ظاهر منظم، نگهداری آسان و دسترسی دوره‌ای به تأسیسات.', en: 'For an ordered look, easy maintenance and periodic service access.' },
      },
      {
        type: { fa: 'فرودگاه و فضای عمومی', en: 'Airport & public spaces' },
        why: { fa: 'برای دوام، ماژولار بودن و تعویض‌پذیری در بهره‌برداری طولانی.', en: 'For durability, modularity and replaceability over long service life.' },
      },
      {
        type: { fa: 'فضاهای آکوستیک', en: 'Acoustic spaces' },
        why: { fa: 'با پانچ و جاذب صوتی براساس طراحی مهندسی.', en: 'With perforation and acoustic absorber per engineering design.' },
      },
    ],
    notRecommended: {
      fa: [
        'فضاهایی که هدف اصلی آن‌ها ریتم عمودی یا عمق بصری شدید است',
        'پروژه‌هایی که نیاز به بازبودن کامل پلنوم دارند',
      ],
      en: [
        'Spaces whose main goal is vertical rhythm or strong visual depth',
        'Projects that require a fully open plenum',
      ],
    },
    gallery: [
      // TODO: replace with real named project references when confirmed by AvizSazeh
      { src: '/systems/tile-1.jpg', caption: { fa: 'نمونه اجرای تایل فلزی در فضای اداری منظم', en: 'Metal tile installed in an ordered office space' } },
      { src: '/systems/tile-2.jpg', caption: { fa: 'سطح ماژولار تایل با دسترسی کنترل‌شده به پلنوم', en: 'Modular tile surface with controlled plenum access' } },
      { src: '/systems/tile-3.webp', caption: { fa: 'دیتیل تایل پانچ آکوستیک', en: 'Acoustic perforated tile detail' } },
      { src: '/systems/tile-4.webp', caption: { fa: 'تایل فلزی در فضای عمومی بزرگ‌مقیاس', en: 'Metal tile in a large-scale public space' } },
    ],
    variants: [
      { label: { fa: 'ابعاد', en: 'Dimensions' }, value: { fa: '۶۰۰×۶۰۰ / ۶۰۰×۱۲۰ میلی‌متر', en: '600×600 / 600×120 mm' } },
      { label: { fa: 'نوع نصب', en: 'Mounting' }, value: { fa: 'نمایان / مخفی / کلیپ‌این', en: 'Exposed / concealed / clip-in' } },
      { label: { fa: 'نوع پنل', en: 'Panel type' }, value: { fa: 'ساده / پانچ / آکوستیک', en: 'Plain / perforated / acoustic' } },
      { label: { fa: 'رنگ‌بندی', en: 'Colours' }, value: COLORS },
      { label: { fa: 'پوشش', en: 'Finish' }, value: COAT_25 },
      { label: { fa: 'گزینه آکوستیک', en: 'Acoustic option' }, value: { fa: 'پانچ به همراه پشم‌سنگ', en: 'Perforation with rock wool' } },
    ],
    selection: {
      fa: [
        'سطح منظم، ماژولار و قابل‌تعویض با دیتیل کنترل‌شده می‌خواهید',
        'عملکرد آکوستیک با پانچ و جاذب صوتی نیاز است',
        'هماهنگی با سیستم تابشی CBI Europe در دستور کار است',
        'فضای بهداشتی یا استریل با مشخصات تأییدشده مدنظر است',
      ],
      en: [
        'You want an ordered, modular, replaceable surface with controlled detailing',
        'Perforated acoustic performance with an absorber is required',
        'Coordination with a CBI Europe radiant system is on the agenda',
        'A hygienic or sterile space with confirmed specifications is intended',
      ],
    },
    subsections: [
      {
        title: { fa: 'یکپارچگی با سیستم‌های تابشی و CBI Europe', en: 'Integration with radiant systems & CBI Europe' },
        body: {
          fa: 'تایل فلزی قابلیت بررسی برای یکپارچگی با سیستم‌های تابشی و CBI Europe را دارد؛ اما این قابلیت باید براساس طراحی مکانیکی، عملکرد حرارتی، منطق دسترسی، نوع پنل و نقشه‌های هماهنگی ارزیابی شود. این سازگاری یک قابلیت طراحی‌محور است و بدون بررسی مهندسی پروژه به‌صورت قطعی ادعا نمی‌شود.',
          en: 'The metal tile can be reviewed for integration with radiant systems and CBI Europe; however, this capability must be evaluated against mechanical design, thermal performance, access logic, panel type and coordination drawings. It is a design-driven capability and is not asserted as certain without project-specific engineering review.',
        },
      },
    ],
    requiredVisuals: {
      fa: [
        'جزئیات تایل پانچ آکوستیک',
        'مقطع پانچ به همراه پشم‌سنگ',
        'مقایسه گرید مخفی و نمایان',
        'تصویر کاربری بیمارستانی یا استریل',
        'تصویر یا جانمای هماهنگی با سقف تابشی CBI',
      ],
      en: [
        'Acoustic punched-tile detail',
        'Perforation + rock-wool section',
        'Concealed vs. exposed grid comparison',
        'Hospital / sterile application image',
        'CBI / radiant-ceiling coordination image or placeholder',
      ],
    },
    faq: [
      {
        q: { fa: 'تفاوت تایل فلزی ساده و آکوستیک چیست؟', en: 'What is the difference between plain and acoustic metal tiles?' },
        a: { fa: 'تایل ساده سطحی بدون پانچ است و عملکرد آکوستیک ویژه‌ای ندارد؛ تایل آکوستیک با پانچ و لایه پشم‌سنگ یا جاذب صوتی، انعکاس صدا را کاهش می‌دهد. مقدار دقیق جذب (NRC) نیازمند تأیید واحد مهندسی آویزسازه است.', en: 'A plain tile has no perforation and no special acoustic performance; an acoustic tile uses perforation plus a rock-wool or absorber layer to reduce sound reflection. The exact absorption (NRC) is to be confirmed by the AvizSazeh engineering team.' },
      },
      {
        q: { fa: 'آیا تایل فلزی برای بیمارستان مناسب است؟', en: 'Is metal tile suitable for hospitals?' },
        a: { fa: 'تایل فلزی به دلیل سطح منظم و دسترسی کنترل‌شده گزینه‌ای متداول برای فضاهای درمانی است؛ اما مناسب‌بودن برای فضای استریل به تأیید مشخصات بهداشتی، نوع پوشش و قابلیت شست‌وشوی پروژه وابسته است.', en: 'Metal tile is a common option for healthcare thanks to its ordered surface and controlled access; suitability for a sterile space, however, depends on confirmation of hygiene specs, finish type and project washability.' },
      },
      {
        q: { fa: 'تایل فلزی چگونه دسترسی به پلنوم را فراهم می‌کند؟', en: 'How does metal tile provide plenum access?' },
        a: { fa: 'هر تایل به‌صورت مستقل با بازشدن یا جابه‌جایی قابل برداشتن است و دسترسی موضعی به تأسیسات پشت سقف را فراهم می‌کند، بدون آن‌که کل سطح مختل شود.', en: 'Each tile can be lifted or removed individually, giving local access to the services behind the ceiling without disturbing the whole surface.' },
      },
      {
        q: { fa: 'آیا تایل فلزی با سیستم‌های تابشی قابل هماهنگی است؟', en: 'Can metal tile be coordinated with radiant systems?' },
        a: { fa: 'بله، قابلیت بررسی برای هماهنگی با سیستم‌های تابشی و CBI Europe وجود دارد؛ اما این هماهنگی به طراحی مکانیکی، عملکرد حرارتی، نوع پنل و نقشه‌های هماهنگی وابسته است و باید توسط واحد مهندسی تأیید شود.', en: 'Yes, it can be reviewed for coordination with radiant systems and CBI Europe; this coordination depends on mechanical design, thermal performance, panel type and coordination drawings and must be confirmed by the engineering team.' },
      },
    ],
    systemCta: {
      fa: 'مشخصات فنی پروژه را برای انتخاب بین تایل ساده، آکوستیک یا تأسیساتی ثبت کنید.',
      en: 'Submit your project specs to choose between plain, acoustic or service-integrated tiles.',
    },
    comparisonHint: {
      fa: 'سطح منظم و ماژولار با گزینه آکوستیک و سازگاری CBI؛ در مقابل گریلیوم، بسته‌تر و بهداشتی‌تر.',
      en: 'Ordered, modular surface with acoustic option and CBI compatibility; vs. open cell, more closed and hygienic.',
    },
    cover: '/design-system/metal-tile.png',
  },

  /* ─────────────────────────────── 4 · BAFFLE ─────────────────────────────── */
  {
    slug: 'baffle',
    order: 4,
    iconKey: 'baffle',
    name: { fa: 'سیستم بافل', en: 'Baffle System' },
    category: { fa: 'سیستم خطی عمودی / آکوستیک', en: 'Vertical-fin / acoustic system' },
    context: {
      fa: 'برای ریتم آکوستیک، عمق بصری و سقف‌های معماری گویا.',
      en: 'For acoustic rhythm, visual depth and expressive architectural ceilings.',
    },
    definition: {
      fa: 'یک سیستم سقف باز با المان‌های خطی و عمودی که ریتم بصری و عمق فضایی می‌سازد و سقف اصلی را قابل‌مشاهده نگه می‌دارد.',
      en: 'An open-ceiling system of linear vertical fins that creates visual rhythm and spatial depth while keeping the main slab visible.',
    },
    seo: {
      title: {
        fa: 'سقف بافل فلزی | آویزسازه — آکوستیک، مدرسه، فضای معماری',
        en: 'Metal Baffle Ceiling | AvizSazeh — Acoustic, School, Architectural',
      },
      description: {
        fa: 'سیستم بافل فلزی آویزسازه برای ایجاد عمق معماری، کنترل آکوستیک و حفظ دسترسی به پلنوم. قابل بررسی برای اجرای خطی، منحنی یا موج‌دار با رنگ‌های ویژه و طرح چوب.',
        en: 'AvizSazeh metal baffle system for architectural depth, acoustic control and retained plenum access. Reviewable for straight, curved or wavy execution with special colours and wood-look finishes.',
      },
    },
    h1: {
      fa: 'سیستم بافل — عمق معماری، کنترل آکوستیک و امکان اجرای خطی یا موج‌دار',
      en: 'Baffle System — Architectural depth, acoustic control and straight or wavy execution',
    },
    lead: {
      fa: 'سیستم بافل از المان‌های خطی و عمودی ساخته می‌شود که عمق معماری و ریتم بصری می‌سازند و سقف اصلی و پلنوم را قابل‌دسترس نگه می‌دارند. این سیستم زمانی انتخاب می‌شود که کنترل آکوستیک، بیان معماری و امکان اجرای منحنی یا موج‌دار اهمیت داشته باشد. تنوع متریال و پوشش — ساده، رنگ ویژه و طرح چوب — آن را به ابزاری گویا برای مدارس، لابی‌ها و فضاهای اداری بدل می‌کند.',
      en: 'The baffle system is built from linear vertical elements that create architectural depth and visual rhythm while keeping the main slab and plenum accessible. It is specified when acoustic control, architectural expression and the option of curved or wavy execution matter. A range of materials and finishes — plain, special colour and wood-look — makes it an expressive tool for schools, lobbies and offices.',
    },
    logic: {
      fa: [
        'المان‌های خطی و عمودی با امکان اجرای مستقیم، منحنی یا موج‌دار',
        'فاصله‌گذاری هوشمند برای دسترسی به پلنوم و جانمایی روشنایی، تهویه و اطفای حریق',
        'بافل آکوستیک برای جذب صدا و کنترل بازتاب در فضاهای حساس',
        'تنوع متریال و رنگ — ساده، ویژه و طرح چوب',
        'عمق بصری و ریتم عمودی برای بیان معماری فضا',
        'حفظ دید به سقف اصلی همراه با پوشش معماری کنترل‌شده',
      ],
      en: [
        'Linear / vertical elements that can run straight, curved, or wavy',
        'Smart spacing for plenum access and placement of lighting, HVAC, fire suppression',
        'Acoustic baffles that absorb sound and control reflection in sensitive spaces',
        'Wide material & colour range — plain, special, and wood-pattern',
        'Visual depth and vertical rhythm for architectural expression',
        'Keeps the main slab visible while providing a controlled architectural cover',
      ],
    },
    anatomy: {
      fa: ['بافل عمودی', 'ریل نگهدارنده', 'آویز', 'فضای پلنوم', 'دسترسی تأسیسات (MEP)'],
      en: ['Vertical baffle', 'Support rail', 'Hanger', 'Plenum void', 'MEP access'],
    },
    specs: [
      { label: { fa: 'نوع سیستم', en: 'System type' }, value: { fa: 'سقف باز عمودی / بافل', en: 'Open vertical baffle ceiling' } },
      { label: { fa: 'متریال', en: 'Material' }, value: { fa: 'گالوانیزه یا آلومینیوم', en: 'Galvanised steel or aluminium' } },
      { label: { fa: 'ضخامت ورق', en: 'Sheet thickness' }, value: { fa: '۰٫۵ میلی‌متر', en: '0.5 mm' } },
      { label: { fa: 'عرض بافل', en: 'Baffle width' }, value: { fa: '۲۰–۵۰ میلی‌متر', en: '20–50 mm' } },
      { label: { fa: 'ارتفاع بافل', en: 'Baffle height' }, value: TBD },
      { label: { fa: 'طول بافل', en: 'Baffle length' }, value: { fa: 'تا ۳۰۰۰ میلی‌متر', en: 'Up to 3000 mm' } },
      { label: { fa: 'فاصله بین بافل‌ها', en: 'Baffle spacing' }, value: { fa: 'قابل تعریف براساس طراحی آکوستیک و معماری', en: 'Definable per acoustic & architectural design' } },
      { label: { fa: 'درصد سطح باز', en: 'Open area' }, value: { fa: 'وابسته به ارتفاع و فاصله بافل‌ها', en: 'Depends on baffle height & spacing' } },
      { label: { fa: 'الگوی نصب', en: 'Installation pattern' }, value: { fa: 'مستقیم / منحنی / موج‌دار با بررسی مهندسی', en: 'Straight / curved / wavy with engineering review' } },
      { label: { fa: 'پوشش رنگ', en: 'Finish' }, value: COAT_25 },
      { label: { fa: 'گزینه پوشش', en: 'Finish option' }, value: { fa: 'ساده / رنگ ویژه / طرح چوب', en: 'Plain / special colour / wood-pattern' } },
      { label: { fa: 'گزینه آکوستیک', en: 'Acoustic option' }, value: { fa: 'جاذب صوتی یا پشم‌سنگ براساس طراحی', en: 'Acoustic absorber or rock wool per design' } },
      { label: { fa: 'مقدار NRC', en: 'NRC value' }, value: TBD },
      { label: { fa: 'سیستم تعلیق', en: 'Suspension system' }, value: { fa: 'ریل نگهدارنده، آویز و اتصالات تنظیمی', en: 'Support rail, hangers & adjustable connectors' } },
      { label: { fa: 'دسترسی به پلنوم', en: 'Plenum access' }, value: { fa: 'بالا، از فاصله بین بافل‌ها', en: 'High, via gaps between baffles' } },
      { label: { fa: 'کلاس آتش', en: 'Fire class' }, value: TBD },
      { label: { fa: 'وزن تقریبی', en: 'Approx. weight' }, value: TBD },
      { label: { fa: 'کاربردها', en: 'Applications' }, value: { fa: 'مدرسه، کتابخانه، اداری، تجاری، لابی، هتل', en: 'Schools, libraries, offices, retail, lobbies, hotels' } },
    ],
    applications: [
      {
        type: { fa: 'مدارس و کتابخانه‌ها', en: 'Schools & libraries' },
        why: { fa: 'برای کنترل انعکاس صدا و ایجاد نظم بصری در فضاهای آموزشی.', en: 'To control sound reflection and create visual order in learning spaces.' },
      },
      {
        type: { fa: 'لابی و هتل', en: 'Lobbies & hotels' },
        why: { fa: 'برای عمق معماری و امکان استفاده از طرح چوب و رنگ ویژه.', en: 'For architectural depth and the option of wood-look and special colours.' },
      },
      {
        type: { fa: 'دفاتر و فضاهای کاری', en: 'Offices & workspaces' },
        why: { fa: 'برای ریتم بصری و جذب صوت در محیط‌های حساس به آکوستیک.', en: 'For visual rhythm and sound absorption in acoustically sensitive environments.' },
      },
      {
        type: { fa: 'مراکز تجاری', en: 'Commercial centres' },
        why: { fa: 'برای طراحی چشمگیر همراه با دسترسی به تأسیسات بالای سقف.', en: 'For a striking design while keeping access to overhead services.' },
      },
    ],
    notRecommended: {
      fa: [
        'فضاهای با ارتفاع سقف بسیار کم',
        'فضاهای درمانی استریل که سطح بسته و قابل شست‌وشوی کامل می‌خواهند',
        'فضاهایی که تجمع گردوغبار بین المان‌ها مشکل نگهداری ایجاد می‌کند',
      ],
      en: [
        'Spaces with a very low ceiling height',
        'Sterile healthcare spaces requiring a fully closed, fully washable surface',
        'Spaces where dust accumulation between elements creates a maintenance problem',
      ],
    },
    gallery: [
      // TODO: replace with real named project references when confirmed by AvizSazeh
      { src: '/systems/baffle-1.jpg', caption: { fa: 'نمونه اجرای بافل خطی با ریتم عمودی منظم', en: 'Linear baffle installation with an ordered vertical rhythm' } },
      { src: '/systems/baffle-2.webp', caption: { fa: 'بافل با عمق معماری و دسترسی به پلنوم', en: 'Baffles delivering architectural depth with plenum access' } },
    ],
    variants: [
      { label: { fa: 'عرض / ارتفاع', en: 'Width / height' }, value: { fa: 'عرض ۲۰–۵۰ میلی‌متر، ارتفاع نیازمند تأیید مهندسی', en: 'Width 20–50 mm, height to be confirmed by engineering' } },
      { label: { fa: 'فاصله‌گذاری', en: 'Spacing' }, value: { fa: 'قابل تعریف براساس طراحی آکوستیک', en: 'Definable per acoustic design' } },
      { label: { fa: 'رنگ‌بندی', en: 'Colours' }, value: COLORS },
      { label: { fa: 'گزینه پوشش', en: 'Finish option' }, value: { fa: 'ساده / رنگ ویژه / طرح چوب', en: 'Plain / special colour / wood-pattern' } },
      { label: { fa: 'گزینه آکوستیک', en: 'Acoustic option' }, value: { fa: 'جاذب صوتی یا پشم‌سنگ', en: 'Acoustic absorber or rock wool' } },
      { label: { fa: 'اجرای منحنی / موج‌دار', en: 'Curved / wavy' }, value: { fa: 'مستقیم / منحنی / موج‌دار با بررسی مهندسی', en: 'Straight / curved / wavy with engineering review' } },
    ],
    selection: {
      fa: [
        'کنترل آکوستیک و کاهش بازتاب صدا اولویت پروژه است',
        'عمق معماری و ریتم عمودی بخشی از مفهوم طراحی است',
        'اجرای منحنی یا موج‌دار به‌عنوان بیان معماری مدنظر است',
        'طرح چوب یا رنگ ویژه برای هویت فضا لازم است',
      ],
      en: [
        'Acoustic control and reduced sound reflection are project priorities',
        'Architectural depth and vertical rhythm are part of the design concept',
        'Curved or wavy execution is intended as architectural expression',
        'A wood-look or special colour is needed for the identity of the space',
      ],
    },
    subsections: [
      {
        title: { fa: 'بافل آکوستیک', en: 'Acoustic baffle' },
        body: {
          fa: 'بافل آکوستیک با افزودن جاذب صوتی یا پشم‌سنگ و تنظیم ارتفاع و فاصله‌گذاری المان‌ها، انعکاس صدا را کاهش می‌دهد و کنترل آکوستیک فضا را بهبود می‌بخشد. عملکرد دقیق آکوستیک به طراحی فضا وابسته است و مقادیر مشخص جذب (NRC) بدون آزمون و تأیید واحد مهندسی آویزسازه ادعا نمی‌شود.',
          en: 'The acoustic baffle reduces sound reflection by adding an absorber or rock wool and tuning the height and spacing of the elements, improving the room’s acoustic control. Exact acoustic performance depends on the room design, and specific absorption values (NRC) are not claimed without testing and confirmation by the AvizSazeh engineering team.',
        },
      },
      {
        title: { fa: 'بافل منحنی و موج‌دار', en: 'Curved & wavy baffle' },
        body: {
          fa: 'اجرای منحنی و موج‌دار بافل امکان‌پذیر است، اما به شعاع انحنا، چیدمان کریر، طول ماژول، هندسه سیستم تعلیق و بررسی مهندسی وابسته است. فرم نهایی پس از تأیید این پارامترها در نقشه اجرایی قطعی می‌شود.',
          en: 'Curved and wavy baffle execution is possible, but depends on the bend radius, carrier layout, module length, suspension geometry and engineering review. The final form is fixed in the shop drawings once these parameters are confirmed.',
        },
      },
    ],
    requiredVisuals: {
      fa: [
        'اجرای بافل با طرح چوب',
        'اجرای بافل منحنی یا موج‌دار',
        'دیاگرام مقایسه ارتفاع بافل',
        'دیاگرام مقایسه فاصله‌گذاری',
        'جزئیات بافل آکوستیک',
        'مقطع: ارتفاع، عرض، فاصله، ریل بالا، آویز',
      ],
      en: [
        'Wood-look baffle installation',
        'Curved / wavy baffle installation',
        'Baffle-height comparison diagram',
        'Spacing comparison diagram',
        'Acoustic baffle detail',
        'Cross-section: height, width, spacing, top rail, hanger',
      ],
    },
    faq: [
      {
        q: { fa: 'سقف بافل چه کاربردی دارد؟', en: 'What is a baffle ceiling used for?' },
        a: { fa: 'سقف بافل برای ایجاد عمق معماری و ریتم عمودی، کنترل آکوستیک و حفظ دسترسی به پلنوم به کار می‌رود و در مدارس، کتابخانه‌ها، لابی‌ها، هتل‌ها و فضاهای اداری و تجاری کاربرد دارد.', en: 'A baffle ceiling is used to create architectural depth and vertical rhythm, control acoustics and keep plenum access; it suits schools, libraries, lobbies, hotels and office or retail spaces.' },
      },
      {
        q: { fa: 'آیا بافل برای کنترل صدا مناسب است؟', en: 'Is a baffle suitable for sound control?' },
        a: { fa: 'بله. بافل آکوستیک با جاذب صوتی یا پشم‌سنگ و تنظیم ارتفاع و فاصله، انعکاس صدا را کاهش می‌دهد. مقدار دقیق جذب (NRC) نیازمند تأیید واحد مهندسی آویزسازه است.', en: 'Yes. An acoustic baffle with an absorber or rock wool and tuned height and spacing reduces sound reflection. The exact absorption (NRC) is to be confirmed by the AvizSazeh engineering team.' },
      },
      {
        q: { fa: 'فاصله و ارتفاع بافل چگونه انتخاب می‌شود؟', en: 'How are baffle spacing and height chosen?' },
        a: { fa: 'فاصله و ارتفاع بافل براساس هدف آکوستیک، عمق بصری مدنظر، شرایط روشنایی و دسترسی به پلنوم تعیین و توسط واحد مهندسی تأیید می‌شود.', en: 'Baffle spacing and height are set by the acoustic goal, desired visual depth, lighting conditions and plenum access, and are confirmed by the engineering team.' },
      },
      {
        q: { fa: 'آیا بافل منحنی یا موج‌دار قابل اجراست؟', en: 'Can baffles be run curved or wavy?' },
        a: { fa: 'بله، اجرای منحنی و موج‌دار امکان‌پذیر است؛ اما به شعاع انحنا، چیدمان کریر، طول ماژول و هندسه سیستم تعلیق وابسته است و نیازمند بررسی مهندسی است.', en: 'Yes, curved and wavy execution is possible; it depends on the bend radius, carrier layout, module length and suspension geometry and requires engineering review.' },
      },
    ],
    systemCta: {
      fa: 'ارتفاع، فاصله‌گذاری و فرم بافل پروژه خود را برای بررسی مهندسی ثبت کنید.',
      en: 'Submit your project’s baffle height, spacing and form for engineering review.',
    },
    comparisonHint: {
      fa: 'عمق عمودی و کنترل آکوستیک با امکان فرم منحنی و موج‌دار؛ در مقابل خطی، بیان عمودی‌تر.',
      en: 'Vertical depth and acoustic control with curved/wavy form options; vs. linear, a more vertical expression.',
    },
    cover: '/design-system/baffle.png',
  },
];

export const systemSlugs = systems.map((s) => s.slug);

export function getSystem(slug: string): CeilingSystem | undefined {
  return systems.find((s) => s.slug === slug);
}
