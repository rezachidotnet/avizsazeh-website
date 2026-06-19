import type { Locale } from '@/i18n/routing';

/**
 * Structured project / client records.
 *
 * IMPORTANT — credibility rules:
 *  - No fabricated execution data. Areas, years, exact system types, heights,
 *    locations, quotes and technical details are `null` until the business owner
 *    supplies verified information.
 *  - `sectorFa` only reflects the publicly-known identity of the named
 *    organisation (an airport is aviation infrastructure, Arya Sasol is
 *    petrochemical). It is NOT a fabricated project detail.
 *  - The UI must never render a `null` field, an empty label, or a placeholder
 *    like "[m²]".
 *  - A card may only link to a case-study page once `hasCaseStudy()` is true.
 */

export type ProjectCategory =
  | 'flagship'
  | 'industrial'
  | 'commercial'
  | 'public'
  | 'municipal'
  | 'contractor'
  | 'partner';

export type ProofStatus = 'documented' | 'partial' | 'logo-only';

/**
 * Bilingual case-study content. Qualitative engineering narrative tied to the
 * project type — NOT fabricated metrics. Hard numbers (area, height, year) stay
 * in the `null`-able fields above until verified by the engineering team.
 */
export type CaseStudy = {
  seo: { title: Record<Locale, string>; description: Record<Locale, string> };
  /** project type / facility line shown under the title */
  projectType: Record<Locale, string>;
  lead: Record<Locale, string>;
  challenge: Record<Locale, string>;
  systemLogic: Record<Locale, string>;
  constraints: Record<Locale, string>;
  /** AvizSazeh's role on a project of this type */
  role: Record<Locale, string>;
  /** honest note that exact technical data is pending verification */
  dataNote: Record<Locale, string>;
  /** placeholder labels for visuals still to be supplied */
  visualPlaceholders: Record<Locale, string[]>;
  relatedSystems: string[];
  relatedApplications: string[];
};

export type Project = {
  slug: string;
  titleFa: string;
  titleEn?: string;
  category: ProjectCategory;
  clientNameFa: string;
  clientNameEn?: string;
  logo?: string;
  /** High-level sector derived from the client's known identity (not project data). */
  sectorFa?: string | null;
  sectorEn?: string | null;
  locationFa?: string | null;
  countryFa?: string | null;
  year?: string | null;
  systemTypeFa?: string | null;
  areaM2?: string | null;
  executionHeightM?: string | null;
  challengeFa?: string | null;
  solutionFa?: string | null;
  images?: string[];
  /** Rich, bilingual case-study content (only the published case studies). */
  caseStudy?: CaseStudy;
  proofStatus: ProofStatus;
  isFeatured: boolean;
};

/**
 * Source of truth for the categorised project / client layer.
 * Names and logos are the real references already in the repository.
 */
export const projects: Project[] = [
  // ── Flagship / infrastructure ──────────────────────────────────────────────
  {
    slug: 'imam-khomeini-airport',
    titleFa: 'فرودگاه بین‌المللی امام خمینی (ره)',
    titleEn: 'Imam Khomeini Int’l Airport',
    category: 'flagship',
    clientNameFa: 'فرودگاه بین‌المللی امام خمینی (ره)',
    clientNameEn: 'Imam Khomeini Int’l Airport',
    logo: 'imam-khomeini-airport.png',
    sectorFa: 'زیرساخت فرودگاهی',
    sectorEn: 'Airport infrastructure',
    locationFa: null,
    countryFa: null,
    year: null,
    systemTypeFa: null,
    areaM2: null,
    executionHeightM: null,
    challengeFa: null,
    solutionFa: null,
    images: [],
    caseStudy: {
      seo: {
        title: {
          fa: 'سقف کاذب فرودگاه امام خمینی | پروژه سقف فلزی آویزسازه',
          en: 'Imam Khomeini Airport Metal Ceiling | AvizSazeh Project',
        },
        description: {
          fa: 'پرونده پروژه سقف کاذب فرودگاه بین‌المللی امام خمینی؛ چالش سقف فلزی فرودگاهی، منطق سیستم و نقش مهندسی آویزسازه. داده‌های فنی دقیق نیازمند تأیید واحد مهندسی است.',
          en: 'Project record for the Imam Khomeini International Airport metal ceiling — the airport ceiling challenge, system logic and AvizSazeh’s engineering role. Exact technical data is to be confirmed by the engineering team.',
        },
      },
      projectType: { fa: 'پایانه فرودگاهی · زیرساخت حمل‌ونقل', en: 'Airport terminal · transport infrastructure' },
      lead: {
        fa: 'فرودگاه بین‌المللی امام خمینی یکی از مراجع اجرایی ثبت‌شده آویزسازه در حوزه سقف کاذب فرودگاه است. این پرونده، چالش و منطق مهندسی سقف فلزی فرودگاهی را توضیح می‌دهد؛ داده‌های فنی دقیق پس از تأیید واحد مهندسی منتشر می‌شود.',
        en: 'Imam Khomeini International Airport is one of AvizSazeh’s recorded execution references in airport metal ceilings. This record explains the challenge and engineering logic of an airport metal ceiling; exact technical data is published once confirmed by the engineering team.',
      },
      challenge: {
        fa: 'سقف یک پایانه فرودگاهی باید در دهانه‌های بسیار وسیع، ریتم بصری منظم و یکپارچه را حفظ کند و هم‌زمان با روشنایی، تهویه، اعلام و اطفای حریق و علائم مسیریابی هماهنگ شود. نصب در ارتفاع، کنترل تراز و دسترسی بلندمدت به پلنوم، این پروژه را از یک کار نصب ساده به یک مسئله مهندسی تبدیل می‌کند.',
        en: 'The ceiling of an airport terminal must hold a regular, unified visual rhythm across very wide spans while coordinating with lighting, HVAC, fire detection and suppression and wayfinding. Installation at height, level control and long-term plenum access turn the project from a simple fit-out into an engineering problem.',
      },
      systemLogic: {
        fa: 'برای فضاهای فرودگاهی، سیستم‌های سقف خطی فلزی، گریلیوم و تایل فلزی به‌عنوان گزینه‌های اصلی بررسی می‌شوند: سقف خطی برای ریتم و هدایت بصری، گریلیوم برای دسترسی و عمق بصری، و تایل فلزی برای نظم و نگهداری. انتخاب نهایی به هندسه، ارتفاع و الزامات تأسیساتی هر بخش وابسته است.',
        en: 'For airport spaces, linear metal, open cell and metal tile ceilings are evaluated as the main options: linear for rhythm and visual guidance, open cell for access and visual depth, and metal tile for order and maintenance. The final selection depends on the geometry, height and service requirements of each zone.',
      },
      constraints: {
        fa: 'بهره‌برداری پیوسته فرودگاه، اجرا در ارتفاع، الزامات ایمنی و حریق و نیاز به نگهداری بدون اختلال، محدودیت‌های اصلی اجرا هستند. توالی نصب و منطق تعلیق برای کار در ارتفاع و حداقل اختلال طراحی می‌شود.',
        en: 'Continuous airport operation, work at height, safety and fire requirements and the need for non-disruptive maintenance are the main execution constraints. The installation sequence and suspension logic are designed for work at height with minimal disruption.',
      },
      role: {
        fa: 'نقش آویزسازه در پروژه‌هایی از این دست، تعریف سقف به‌عنوان سیستم مهندسی است: تهیه نقشه اجرایی، هماهنگی تأسیسات، تولید سفارشی و کنترل اجرا تا تحویل نتیجه معماری.',
        en: 'In projects of this kind, AvizSazeh’s role is to define the ceiling as an engineered system: shop drawings, service coordination, custom manufacturing and execution control through to handover of the architectural result.',
      },
      dataNote: {
        fa: 'مساحت، ارتفاع، سال اجرا و مشخصات دقیق سیستم این پروژه نیازمند تأیید واحد مهندسی آویزسازه است و پس از تأیید منتشر می‌شود.',
        en: 'The exact area, height, year and system specifications of this project are to be confirmed by the AvizSazeh engineering team and will be published once verified.',
      },
      visualPlaceholders: {
        fa: ['عکس اجرای سقف فلزی در سالن فرودگاه', 'دیتیل اتصال و سیستم تعلیق در ارتفاع', 'نمای هماهنگی سقف با روشنایی و تأسیسات'],
        en: ['Installed metal ceiling in the terminal hall', 'Connection and suspension detail at height', 'Ceiling coordinated with lighting and services'],
      },
      relatedSystems: ['linear-ceiling', 'open-cell', 'metal-tile'],
      relatedApplications: ['airport-ceiling'],
    },
    proofStatus: 'partial',
    isFeatured: true,
  },
  {
    slug: 'arya-sasol',
    titleFa: 'پتروشیمی آریاساسول',
    titleEn: 'Arya Sasol Polymer',
    category: 'industrial',
    clientNameFa: 'پتروشیمی آریاساسول',
    clientNameEn: 'Arya Sasol Polymer',
    logo: 'arya-sasol.jpeg',
    sectorFa: 'صنعتی · پتروشیمی',
    locationFa: null,
    countryFa: null,
    year: null,
    systemTypeFa: null,
    areaM2: null,
    executionHeightM: null,
    challengeFa: null,
    solutionFa: null,
    images: [],
    proofStatus: 'logo-only',
    isFeatured: true,
  },
  {
    slug: 'bushehr-mall',
    titleFa: 'بوشهر مال',
    titleEn: 'Bushehr Mall',
    category: 'commercial',
    clientNameFa: 'بوشهر مال',
    clientNameEn: 'Bushehr Mall',
    logo: 'bushehr-mall.jpeg',
    sectorFa: 'مرکز تجاری',
    sectorEn: 'Commercial centre',
    locationFa: null,
    countryFa: null,
    year: null,
    systemTypeFa: null,
    areaM2: null,
    executionHeightM: null,
    challengeFa: null,
    solutionFa: null,
    images: [],
    caseStudy: {
      seo: {
        title: {
          fa: 'سقف کاذب بوشهر مال | پروژه سقف فلزی تجاری آویزسازه',
          en: 'Bushehr Mall Metal Ceiling | AvizSazeh Commercial Project',
        },
        description: {
          fa: 'پرونده پروژه سقف کاذب تجاری بوشهر مال؛ چالش سقف فلزی مرکز خرید، منطق سیستم و نقش مهندسی آویزسازه. داده‌های فنی دقیق نیازمند تأیید واحد مهندسی است.',
          en: 'Project record for the Bushehr Mall commercial metal ceiling — the mall ceiling challenge, system logic and AvizSazeh’s engineering role. Exact technical data is to be confirmed by the engineering team.',
        },
      },
      projectType: { fa: 'مرکز خرید · فضای تجاری', en: 'Shopping mall · commercial space' },
      lead: {
        fa: 'بوشهر مال یکی از مراجع اجرایی ثبت‌شده آویزسازه در حوزه سقف کاذب تجاری است. این پرونده، چالش و منطق مهندسی سقف فلزی مرکز خرید را توضیح می‌دهد؛ داده‌های فنی دقیق پس از تأیید واحد مهندسی منتشر می‌شود.',
        en: 'Bushehr Mall is one of AvizSazeh’s recorded execution references in commercial metal ceilings. This record explains the challenge and engineering logic of a mall metal ceiling; exact technical data is published once confirmed by the engineering team.',
      },
      challenge: {
        fa: 'سقف یک مرکز خرید باید هم‌زمان هویت بصری فضای تجاری را بسازد و دسترسی سریع به تأسیسات پرتردد را حفظ کند. اجرای یکنواخت در سطوح وسیع، هماهنگی با نورپردازی فروشگاهی و نگهداری بدون اختلال در بهره‌برداری، چالش‌های اصلی این نوع پروژه است.',
        en: 'A mall ceiling must simultaneously build the visual identity of the retail space and keep fast access to high-traffic services. Uniform execution over large areas, coordination with retail lighting and non-disruptive maintenance are the main challenges of this kind of project.',
      },
      systemLogic: {
        fa: 'برای فضاهای تجاری، سقف گریلیوم برای دسترسی و عمق بصری، سقف بافل برای بیان معماری و آکوستیک و سقف خطی فلزی برای ریتم و مسیریابی بررسی می‌شوند. انتخاب نهایی بر پایه مفهوم معماری، بودجه و الزامات اجرا انجام می‌شود.',
        en: 'For commercial spaces, open cell is evaluated for access and visual depth, baffle for architectural expression and acoustics, and the linear metal ceiling for rhythm and wayfinding. The final selection is based on the architectural concept, budget and execution requirements.',
      },
      constraints: {
        fa: 'بهره‌برداری تجاری پیوسته، نیاز به نگهداری بدون توقف، اجرای یکنواخت در سطوح بزرگ و هماهنگی با تأسیسات و نورپردازی، محدودیت‌های اصلی اجرا هستند.',
        en: 'Continuous retail operation, the need for non-stop maintenance, uniform execution over large areas and coordination with services and lighting are the main execution constraints.',
      },
      role: {
        fa: 'آویزسازه سقف کاذب تجاری را به‌صورت سیستم کامل تعریف می‌کند: نقشه اجرایی، هماهنگی تأسیسات، تولید سفارشی و کنترل اجرا تا تحویل نهایی.',
        en: 'AvizSazeh defines the commercial metal ceiling as a complete system: shop drawings, service coordination, custom manufacturing and execution control through to final handover.',
      },
      dataNote: {
        fa: 'مساحت، ارتفاع، سال اجرا و مشخصات دقیق سیستم این پروژه نیازمند تأیید واحد مهندسی آویزسازه است و پس از تأیید منتشر می‌شود.',
        en: 'The exact area, height, year and system specifications of this project are to be confirmed by the AvizSazeh engineering team and will be published once verified.',
      },
      visualPlaceholders: {
        fa: ['عکس اجرای سقف فلزی در فضای تجاری', 'دیتیل دسترسی به پلنوم و تأسیسات', 'نمای هماهنگی سقف با نورپردازی فروشگاهی'],
        en: ['Installed metal ceiling in the retail space', 'Plenum and service access detail', 'Ceiling coordinated with retail lighting'],
      },
      relatedSystems: ['open-cell', 'baffle', 'linear-ceiling'],
      relatedApplications: ['commercial-ceiling'],
    },
    proofStatus: 'partial',
    isFeatured: true,
  },
  {
    slug: 'sairan',
    titleFa: 'صاایران',
    titleEn: 'SAIRAN',
    category: 'flagship',
    clientNameFa: 'صاایران',
    clientNameEn: 'SAIRAN',
    logo: 'sairan.png',
    sectorFa: 'صنعتی · الکترونیک',
    locationFa: null,
    countryFa: null,
    year: null,
    systemTypeFa: null,
    areaM2: null,
    executionHeightM: null,
    challengeFa: null,
    solutionFa: null,
    images: [],
    proofStatus: 'logo-only',
    isFeatured: true,
  },
  {
    slug: 'chadormalu',
    titleFa: 'چادرملو',
    titleEn: 'Chadormalu',
    category: 'industrial',
    clientNameFa: 'چادرملو',
    clientNameEn: 'Chadormalu',
    logo: 'chadormalu.jpeg',
    sectorFa: 'صنعتی · معدن و فولاد',
    locationFa: null,
    countryFa: null,
    year: null,
    systemTypeFa: null,
    areaM2: null,
    executionHeightM: null,
    challengeFa: null,
    solutionFa: null,
    images: [],
    proofStatus: 'logo-only',
    isFeatured: true,
  },
  {
    slug: 'pamidco',
    titleFa: 'پامیدکو',
    titleEn: 'PAMIDCO',
    category: 'industrial',
    clientNameFa: 'پامیدکو',
    clientNameEn: 'PAMIDCO',
    logo: 'pamidco.png',
    sectorFa: 'صنعتی · معدن و فلزات',
    proofStatus: 'logo-only',
    isFeatured: false,
  },

  // ── Public / organisational ─────────────────────────────────────────────────
  {
    slug: 'nezam-mohandesi-qazvin',
    titleFa: 'نظام مهندسی قزوین',
    titleEn: 'Qazvin Construction Eng. Org.',
    category: 'public',
    clientNameFa: 'سازمان نظام مهندسی ساختمان قزوین',
    clientNameEn: 'Qazvin Construction Eng. Org.',
    logo: 'nezam-mohandesi-qazvin.jpeg',
    sectorFa: 'سازمان حرفه‌ای',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'bushehr-heritage',
    titleFa: 'میراث فرهنگی بوشهر',
    titleEn: 'Bushehr Cultural Heritage',
    category: 'public',
    clientNameFa: 'میراث فرهنگی بوشهر',
    clientNameEn: 'Bushehr Cultural Heritage',
    logo: 'bushehr-heritage.png',
    sectorFa: 'سازمان عمومی · فرهنگی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'shahrdari-parand',
    titleFa: 'شهرداری پرند',
    titleEn: 'Parand Municipality',
    category: 'municipal',
    clientNameFa: 'شهرداری پرند',
    clientNameEn: 'Parand Municipality',
    logo: 'shahrdari-parand.jpg',
    sectorFa: 'شهرداری',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'shahrdari-zarrinshahr',
    titleFa: 'شهرداری زرین‌شهر',
    titleEn: 'Zarrin Shahr Municipality',
    category: 'municipal',
    clientNameFa: 'شهرداری زرین‌شهر',
    clientNameEn: 'Zarrin Shahr Municipality',
    logo: 'shahrdari-zarrinshahr.png',
    sectorFa: 'شهرداری',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'shahrdari-sejzi',
    titleFa: 'شهرداری سجزی',
    titleEn: 'Sejzi Municipality',
    category: 'municipal',
    clientNameFa: 'شهرداری سجزی',
    clientNameEn: 'Sejzi Municipality',
    logo: 'shahrdari-sejzi.jpeg',
    sectorFa: 'شهرداری',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'shahrdari-lenjan',
    titleFa: 'شهرداری لنجان',
    titleEn: 'Lenjan Municipality',
    category: 'municipal',
    clientNameFa: 'شهرداری لنجان',
    clientNameEn: 'Lenjan Municipality',
    logo: 'shahrdari-lenjan.jpeg',
    sectorFa: 'شهرداری',
    proofStatus: 'logo-only',
    isFeatured: false,
  },

  // ── Contractors / partner companies ─────────────────────────────────────────
  {
    slug: 'jahad-nasr-arak',
    titleFa: 'جهاد نصر اراک',
    titleEn: 'Jahad Nasr Arak',
    category: 'contractor',
    clientNameFa: 'جهاد نصر اراک',
    clientNameEn: 'Jahad Nasr Arak',
    logo: 'jahad-nasr-arak.png',
    sectorFa: 'پیمانکار عمرانی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'armatur-pardis',
    titleFa: 'آرماتور پردیس',
    titleEn: 'Armatur Pardis',
    category: 'contractor',
    clientNameFa: 'آرماتور پردیس',
    clientNameEn: 'Armatur Pardis',
    logo: 'armatur-pardis.jpeg',
    sectorFa: 'پیمانکار ساختمانی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'aria-omran-pars',
    titleFa: 'آریا عمران پارس',
    titleEn: 'Aria Omran Pars',
    category: 'contractor',
    clientNameFa: 'آریا عمران پارس',
    clientNameEn: 'Aria Omran Pars',
    logo: 'aria-omran-pars.jpeg',
    sectorFa: 'پیمانکار عمرانی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'alphabet-qeshm',
    titleFa: 'آلفابت قشم',
    titleEn: 'Alphabet Qeshm',
    category: 'partner',
    clientNameFa: 'آلفابت قشم',
    clientNameEn: 'Alphabet Qeshm',
    logo: 'alphabet-qeshm.jpg',
    sectorFa: 'شرکت همکار',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'anamis-sazan',
    titleFa: 'آنامیس سازان جرون',
    titleEn: 'Anamis Sazan Jaroon',
    category: 'contractor',
    clientNameFa: 'آنامیس سازان جرون',
    clientNameEn: 'Anamis Sazan Jaroon',
    logo: 'anamis-sazan.jpg',
    sectorFa: 'پیمانکار ساختمانی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'esalat',
    titleFa: 'اصالت',
    titleEn: 'Esalat',
    category: 'partner',
    clientNameFa: 'اصالت',
    clientNameEn: 'Esalat',
    logo: 'esalat.jpg',
    sectorFa: 'شرکت همکار',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'zagros-zarrin-pars',
    titleFa: 'زاگرس زرین پارس',
    titleEn: 'Zagros Zarrin Pars',
    category: 'contractor',
    clientNameFa: 'زاگرس زرین پارس',
    clientNameEn: 'Zagros Zarrin Pars',
    logo: 'zagros-zarrin-pars.jpeg',
    sectorFa: 'پیمانکار ساختمانی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'saman-andishan',
    titleFa: 'سامان اندیشان امرتات',
    titleEn: 'Saman Andishan Amrtat',
    category: 'contractor',
    clientNameFa: 'سامان اندیشان امرتات',
    clientNameEn: 'Saman Andishan Amrtat',
    logo: 'saman-andishan.jpeg',
    sectorFa: 'پیمانکار ساختمانی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'armeh-sazeh-novin',
    titleFa: 'آرمه سازه نوین',
    titleEn: 'Armeh Sazeh Novin',
    category: 'contractor',
    clientNameFa: 'آرمه سازه نوین',
    clientNameEn: 'Armeh Sazeh Novin',
    logo: 'armeh-sazeh-novin.png',
    sectorFa: 'پیمانکار سازه',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'anbouh-gostar-nasr',
    titleFa: 'انبوه‌گستر نصر',
    titleEn: 'Anbouh Gostar Nasr',
    category: 'contractor',
    clientNameFa: 'انبوه‌گستر نصر',
    clientNameEn: 'Anbouh Gostar Nasr',
    logo: 'anbouh-gostar-nasr.jpeg',
    sectorFa: 'انبوه‌ساز',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'pars-gostar',
    titleFa: 'پارس گستر',
    titleEn: 'Pars Gostar',
    category: 'contractor',
    clientNameFa: 'پارس گستر',
    clientNameEn: 'Pars Gostar',
    logo: 'pars-gostar.jpeg',
    sectorFa: 'پیمانکار ساختمانی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'meshkin-part-kish',
    titleFa: 'مشکین‌پارت کیش',
    titleEn: 'Meshkin Part Kish',
    category: 'partner',
    clientNameFa: 'مشکین‌پارت کیش',
    clientNameEn: 'Meshkin Part Kish',
    logo: 'meshkin-part-kish.jpg',
    sectorFa: 'شرکت همکار',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'moghavem-kar',
    titleFa: 'مقاوم‌کار',
    titleEn: 'Moghavem Kar',
    category: 'contractor',
    clientNameFa: 'مقاوم‌کار',
    clientNameEn: 'Moghavem Kar',
    logo: 'moghavem-kar.jpg',
    sectorFa: 'پیمانکار ساختمانی',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'fazapooshan-kerman',
    titleFa: 'فضاپوشان کرمان',
    titleEn: 'Fazapooshan Kerman',
    category: 'contractor',
    clientNameFa: 'فضاپوشان کرمان',
    clientNameEn: 'Fazapooshan Kerman',
    logo: 'fazapooshan-kerman.jpeg',
    sectorFa: 'پیمانکار پوشش سقف',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'vodja',
    titleFa: 'ودجا',
    titleEn: 'VODJA',
    category: 'partner',
    clientNameFa: 'ودجا',
    clientNameEn: 'VODJA',
    logo: 'vodja.jpg',
    sectorFa: 'شرکت همکار',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
  {
    slug: 'vira-tejarat',
    titleFa: 'ویرا تجارت لیدوما',
    titleEn: 'Vira Tejarat Liduma',
    category: 'partner',
    clientNameFa: 'ویرا تجارت لیدوما',
    clientNameEn: 'Vira Tejarat Liduma',
    logo: 'vira-tejarat.jpg',
    sectorFa: 'شرکت همکار',
    proofStatus: 'logo-only',
    isFeatured: false,
  },
];

/** Display buckets for the categorised client wall on the projects page. */
export type ClientGroupKey = 'infrastructure' | 'public' | 'contractor';

const GROUP_OF: Record<ProjectCategory, ClientGroupKey> = {
  flagship: 'infrastructure',
  industrial: 'infrastructure',
  commercial: 'infrastructure',
  public: 'public',
  municipal: 'public',
  contractor: 'contractor',
  partner: 'contractor',
};

export const CLIENT_GROUP_ORDER: ClientGroupKey[] = ['infrastructure', 'public', 'contractor'];

/** Projects shown as flagship records (Persian order preserved). */
export const featuredProjects = projects.filter((p) => p.isFeatured);

/** Group projects into the three credibility buckets for the categorised wall. */
export function projectsByGroup(): Record<ClientGroupKey, Project[]> {
  const groups: Record<ClientGroupKey, Project[]> = {
    infrastructure: [],
    public: [],
    contractor: [],
  };
  for (const p of projects) groups[GROUP_OF[p.category]].push(p);
  return groups;
}

/** A project may link to a case-study page only once it carries real content. */
export function hasCaseStudy(p: Project): boolean {
  return Boolean(
    p.caseStudy ||
      p.challengeFa ||
      p.solutionFa ||
      (p.images && p.images.length > 0) ||
      p.locationFa ||
      p.year ||
      p.systemTypeFa ||
      p.areaM2 ||
      p.executionHeightM,
  );
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Localised display name for a project. */
export function projectName(p: Project, locale: Locale): string {
  return locale === 'en' && p.titleEn ? p.titleEn : p.titleFa;
}

/** Localised sector line (falls back to Persian when no English value exists). */
export function projectSector(p: Project, locale: Locale): string | null {
  if (locale === 'en') return p.sectorEn ?? p.sectorFa ?? null;
  return p.sectorFa ?? null;
}
