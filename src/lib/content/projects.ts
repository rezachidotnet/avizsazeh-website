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
  locationFa?: string | null;
  countryFa?: string | null;
  year?: string | null;
  systemTypeFa?: string | null;
  areaM2?: string | null;
  executionHeightM?: string | null;
  challengeFa?: string | null;
  solutionFa?: string | null;
  images?: string[];
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
