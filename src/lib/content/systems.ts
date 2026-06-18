import type { Locale } from '@/i18n/routing';

export type SpecRow = { label: Record<Locale, string>; value: Record<Locale, string> };

export type CeilingSystem = {
  slug: string;
  order: number;
  iconKey: 'linear' | 'grid' | 'tile' | 'baffle';
  name: Record<Locale, string>;
  /** engineering category framing */
  category: Record<Locale, string>;
  /** Level 1 — system definition (one structured sentence) */
  definition: Record<Locale, string>;
  /** Level 2 — engineering logic */
  logic: Record<Locale, string[]>;
  /** application zones */
  useCases: Record<Locale, string[]>;
  /** technical parameters (real spec sheet data) */
  specs: SpecRow[];
  cover: string;
  gallery: string[];
};

/**
 * The four executed ceiling systems of AvizSazeh, framed as engineering systems.
 * Specifications are the real spec-sheet values from avizsazeh.ir (source/CONTENT.md).
 */
export const systems: CeilingSystem[] = [
  {
    slug: 'linear-ceiling',
    order: 1,
    iconKey: 'linear',
    name: { fa: 'سیستم سقف خطی', en: 'Linear Ceiling System' },
    category: { fa: 'سیستم نواری جهت‌دار', en: 'Directional strip system' },
    definition: {
      fa: 'یک سیستم سقف کاذب نواری ماژولار از تسمه‌های آلومینیومی که در کنار هم الگوهای خطی، مورب یا شعاعی می‌سازد.',
      en: 'A modular strip ceiling system of aluminium profiles arranged side by side to form linear, diagonal, or radial patterns.',
    },
    logic: {
      fa: [
        'توزیع بار در راستای محورهای خطی و موازی',
        'تسمه‌های آلومینیومی با پوشش رنگ پلی‌استر — مقاوم به رطوبت و عوامل جوی',
        'دسترسی کامل به فضای پلنوم برای روشنایی، تهویه و سیستم‌های اعلام/اطفای حریق',
        'تنوع ابعاد، ارتفاع تسمه و رنگ برای کنترل ریتم بصری فضا',
      ],
      en: [
        'Load distribution along parallel, linear axes',
        'Polyester-coated aluminium strips — moisture- and weather-resistant',
        'Full plenum access for lighting, HVAC, and fire detection / suppression',
        'Variable strip width, height, and colour to control the spatial rhythm',
      ],
    },
    useCases: {
      fa: ['فرودگاه‌ها و پایانه‌های حمل‌ونقل', 'راهروهای صنعتی و طولانی', 'فضاهای تجاری و اداری'],
      en: ['Airports & transport terminals', 'Industrial & elongated corridors', 'Commercial & office spaces'],
    },
    specs: [
      { label: { fa: 'نوع سیستم', en: 'System type' }, value: { fa: 'نواری', en: 'Strip' } },
      { label: { fa: 'متریال', en: 'Material' }, value: { fa: 'آلومینیوم', en: 'Aluminium' } },
      { label: { fa: 'پوشش رنگ', en: 'Finish' }, value: { fa: 'رنگ پلی‌استر الکترواستاتیک', en: 'Electrostatic polyester coat' } },
      { label: { fa: 'الگو', en: 'Pattern' }, value: { fa: 'خطی / مورب / شعاعی', en: 'Linear / diagonal / radial' } },
    ],
    cover: '/systems/linear-1.webp',
    gallery: ['/systems/linear-1.webp', '/systems/linear-2.jpg'],
  },
  {
    slug: 'open-cell',
    order: 2,
    iconKey: 'grid',
    name: { fa: 'سیستم سقف سلول‌باز (گریلیوم)', en: 'Open Cell System (Grilliom)' },
    category: { fa: 'سیستم شبکه‌ای دوبعدی', en: 'Two-dimensional grid system' },
    definition: {
      fa: 'یک سیستم شبکه‌ای ماژولار از پروفیل‌های U نر و ماده که ساختار سلولی باز برای عبور نور و هوا ایجاد می‌کند.',
      en: 'A modular orthogonal grid assembled from interlocking U-profiles into an open cellular structure that lets light and air pass through.',
    },
    logic: {
      fa: [
        'توزیع بار دوبعدی و تعادل یکنواخت در کل شبکه',
        'انعطاف بالا برای یکپارچه‌سازی تأسیسات مکانیکی و برقی (MEP)',
        'پنل‌های فلزی سبک با مقاومت مکانیکی بالا و نصب سریع',
        'دسترسی کامل و فوری به فضای پلنوم',
      ],
      en: [
        '2D load distribution with uniform balance across the grid',
        'High flexibility for MEP integration',
        'Lightweight metal panels with high mechanical resistance and fast install',
        'Immediate, full plenum access',
      ],
    },
    useCases: {
      fa: ['مراکز تجاری و مال‌ها', 'پایانه‌های حمل‌ونقل', 'فضاهای عمومی پرتردد'],
      en: ['Malls & commercial centres', 'Transport hubs', 'High-traffic public spaces'],
    },
    specs: [
      { label: { fa: 'نوع سیستم', en: 'System type' }, value: { fa: 'شبکه‌ای', en: 'Grid' } },
      { label: { fa: 'متریال', en: 'Material' }, value: { fa: 'آلومینیوم', en: 'Aluminium' } },
      { label: { fa: 'ضخامت ورق', en: 'Sheet thickness' }, value: { fa: '۰٫۵ میلی‌متر', en: '0.5 mm' } },
      { label: { fa: 'پوشش رنگ', en: 'Finish' }, value: { fa: 'پودری الکترواستاتیک، ۲۵ میکرون', en: 'Electrostatic powder coat, 25 µm' } },
      { label: { fa: 'ابعاد', en: 'Dimensions' }, value: { fa: '۶۰۰×۶۰۰ میلی‌متر', en: '600×600 mm' } },
      { label: { fa: 'الگو', en: 'Pattern' }, value: { fa: 'ساده / مشبک', en: 'Plain / patterned' } },
    ],
    cover: '/systems/opencell-1.jpg',
    gallery: ['/systems/opencell-1.jpg', '/systems/opencell-2.jpg', '/systems/opencell-3.jpg', '/systems/opencell-4.jpg'],
  },
  {
    slug: 'metal-tile',
    order: 3,
    iconKey: 'tile',
    name: { fa: 'سیستم تایل فلزی', en: 'Metal Tile System' },
    category: { fa: 'سیستم شبکه‌ای پنلی', en: 'Panelised grid system' },
    definition: {
      fa: 'یک سیستم پنلی از تایل‌های فولاد گالوانیزه یا آلومینیوم با پوشش رنگ پودری الکترواستاتیک پلی‌استر.',
      en: 'A panelised system of galvanised-steel or aluminium tiles finished with electrostatic polyester powder coating.',
    },
    logic: {
      fa: [
        'نصب سریع در مرحله ساخت و دسترسی آسان به پلنوم در بهره‌برداری',
        'مقاومت بالا در برابر رطوبت، سایش و خوردگی با سطح یکنواخت و بادوام',
        'طراحی پانچ ویژه به همراه پشم‌سنگ برای عملکرد آکوستیک',
        'سازگاری کامل با سیستم‌های تابشی CBI Europe',
      ],
      en: [
        'Fast install during construction, easy plenum access in use',
        'High resistance to moisture, abrasion, and corrosion with a uniform durable surface',
        'Special punching + rock wool for acoustic performance',
        'Fully integrable with CBI Europe radiant systems',
      ],
    },
    useCases: {
      fa: ['فضاهای عمومی بزرگ: سالن، مال، فرودگاه، بانک', 'فضاهای استریل: اتاق عمل، بیمارستان', 'فضاهای داخلی و خارجی'],
      en: ['Large public spaces: halls, malls, airports, banks', 'Sterile spaces: operating rooms, hospitals', 'Interior & exterior'],
    },
    specs: [
      { label: { fa: 'نوع سیستم', en: 'System type' }, value: { fa: 'شبکه‌ای', en: 'Grid' } },
      { label: { fa: 'متریال', en: 'Material' }, value: { fa: 'گالوانیزه / آلومینیوم', en: 'Galvanised / Aluminium' } },
      { label: { fa: 'ضخامت ورق', en: 'Sheet thickness' }, value: { fa: '۰٫۵ / ۰٫۶ / ۰٫۷ میلی‌متر', en: '0.5 / 0.6 / 0.7 mm' } },
      { label: { fa: 'پوشش رنگ', en: 'Finish' }, value: { fa: 'پودری الکترواستاتیک، ۲۵ میکرون', en: 'Electrostatic powder coat, 25 µm' } },
      { label: { fa: 'ابعاد', en: 'Dimensions' }, value: { fa: '۶۰۰×۶۰۰ / ۶۰۰×۱۲۰ میلی‌متر', en: '600×600 / 600×120 mm' } },
      { label: { fa: 'الگو', en: 'Pattern' }, value: { fa: 'ساده / مشبک', en: 'Plain / patterned' } },
    ],
    cover: '/systems/tile-3.webp',
    gallery: ['/systems/tile-1.jpg', '/systems/tile-2.jpg', '/systems/tile-3.webp', '/systems/tile-4.webp'],
  },
  {
    slug: 'baffle',
    order: 4,
    iconKey: 'baffle',
    name: { fa: 'سیستم بافل', en: 'Baffle System' },
    category: { fa: 'سیستم خطی عمودی / آکوستیک', en: 'Vertical-fin / acoustic system' },
    definition: {
      fa: 'یک سیستم سقف باز با المان‌های خطی و عمودی که ریتم بصری و عمق فضایی می‌سازد و سقف اصلی را قابل‌مشاهده نگه می‌دارد.',
      en: 'An open-ceiling system of linear vertical fins that creates visual rhythm and spatial depth while keeping the main slab visible.',
    },
    logic: {
      fa: [
        'المان‌های خطی و عمودی با امکان اجرای مستقیم، منحنی یا موج‌دار',
        'فاصله‌گذاری هوشمند برای دسترسی به پلنوم و جانمایی روشنایی، تهویه و اطفای حریق',
        'بافل آکوستیک برای جذب صدا و کنترل بازتاب در فضاهای حساس',
        'تنوع متریال و رنگ — ساده، ویژه و طرح چوب',
      ],
      en: [
        'Linear / vertical elements that can run straight, curved, or wavy',
        'Smart spacing for plenum access and placement of lighting, HVAC, fire suppression',
        'Acoustic baffles that absorb sound and control reflection in sensitive spaces',
        'Wide material & colour range — plain, special, and wood-pattern',
      ],
    },
    useCases: {
      fa: ['مدارس و کتابخانه‌ها', 'مال‌ها و سالن‌های انتظار', 'فضاهای اداری و تجاری حساس به آکوستیک'],
      en: ['Schools & libraries', 'Malls & waiting halls', 'Acoustically sensitive office & retail spaces'],
    },
    specs: [
      { label: { fa: 'نوع سیستم', en: 'System type' }, value: { fa: 'نواری', en: 'Strip' } },
      { label: { fa: 'متریال', en: 'Material' }, value: { fa: 'گالوانیزه / آلومینیوم', en: 'Galvanised / Aluminium' } },
      { label: { fa: 'ضخامت ورق', en: 'Sheet thickness' }, value: { fa: '۰٫۵ میلی‌متر', en: '0.5 mm' } },
      { label: { fa: 'عرض / طول', en: 'Width / length' }, value: { fa: 'عرض ۲۰–۵۰ میلی‌متر، طول تا ۳۰۰۰ میلی‌متر', en: 'Width 20–50 mm, length up to 3000 mm' } },
      { label: { fa: 'پوشش رنگ', en: 'Finish' }, value: { fa: 'پودری الکترواستاتیک، ۲۵ میکرون', en: 'Electrostatic powder coat, 25 µm' } },
    ],
    cover: '/systems/baffle-2.webp',
    gallery: ['/systems/baffle-1.jpg', '/systems/baffle-2.webp'],
  },
];

export const systemSlugs = systems.map((s) => s.slug);

export function getSystem(slug: string): CeilingSystem | undefined {
  return systems.find((s) => s.slug === slug);
}
