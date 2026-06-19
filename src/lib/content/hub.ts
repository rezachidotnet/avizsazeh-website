import type { Locale } from '@/i18n/routing';
import type { Faq } from './systems';

/**
 * Category hub content — the primary Persian/English SEO hub for
 * "سقف کاذب فلزی" / "metal suspended ceiling". This page is the centre of the
 * topic cluster and links out to every system, the two application pages, the
 * comparison matrix and the RFQ. Engineering-led voice, no fabricated values.
 */

type TitledBody = { title: Record<Locale, string>; body: Record<Locale, string> };

export const hub = {
  seo: {
    title: {
      fa: 'سقف کاذب فلزی | طراحی، تولید و اجرای سیستم سقف فلزی آویزسازه',
      en: 'Metal Suspended Ceiling Systems | Design, Engineering & Execution | AvizSazeh',
    },
    description: {
      fa: 'مرجع سقف کاذب فلزی آویزسازه؛ طراحی، تولید و اجرای سقف خطی فلزی، سقف کاذب گریلیوم، تایل سقفی فلزی و سقف بافل برای پروژه‌های فرودگاهی، تجاری و معماری داخلی به‌صورت سیستم مهندسی.',
      en: 'The AvizSazeh metal suspended ceiling hub — design, engineering and execution of linear metal ceilings, open cell (grilliom), metal ceiling tiles and baffle ceilings for airport, commercial and architectural projects, delivered as engineered systems.',
    },
  },
  eyebrow: { fa: 'مرجع دسته‌بندی · سقف کاذب فلزی', en: 'Category hub · Metal suspended ceiling' },
  h1: {
    fa: 'سقف کاذب فلزی؛ از طراحی مهندسی تا تولید و اجرا',
    en: 'Metal Suspended Ceiling Systems — Engineered from Design to Execution',
  },
  lead: {
    fa: 'سقف کاذب فلزی یک سیستم سقفی آویزان از جنس آلومینیوم یا فولاد است که زیر سازه اصلی نصب می‌شود و هم‌زمان هویت معماری، یکپارچگی تأسیسات و دسترسی به پلنوم را تأمین می‌کند. آویزسازه سقف کاذب فلزی را به‌عنوان سیستم مهندسی — شامل سقف خطی فلزی، سقف کاذب گریلیوم، تایل سقفی فلزی و سقف بافل — طراحی، تولید و اجرا می‌کند.',
    en: 'A metal suspended ceiling is an aluminium or steel ceiling system hung below the main slab that simultaneously delivers architectural identity, service integration and plenum access. AvizSazeh designs, manufactures and installs the metal suspended ceiling as an engineered system — including the linear metal ceiling, open cell (grilliom), metal ceiling tile and baffle ceiling.',
  },
  whatIs: {
    title: { fa: 'سقف کاذب فلزی چیست؟', en: 'What is a metal suspended ceiling?' },
    body: {
      fa: 'سقف کاذب فلزی سطحی است که با سیستم تعلیق (آویز و کریر) زیر سقف اصلی اجرا می‌شود و فضای پلنوم را برای روشنایی، تهویه، اعلام و اطفای حریق و سایر تأسیسات در اختیار می‌گذارد. برخلاف سقف‌های گچی، سقف فلزی بادوام، قابل بازرسی و قابل تعویض است و امکان اجرای الگوهای خطی، شبکه‌ای، پنلی و بافل را فراهم می‌کند.',
      en: 'A metal suspended ceiling is a surface installed below the main slab on a suspension system (hangers and carriers), opening the plenum void for lighting, HVAC, fire detection and suppression and other services. Unlike plasterboard ceilings, a metal ceiling is durable, inspectable and replaceable, and supports linear, grid, panel and baffle patterns.',
    },
  } as TitledBody,
  whyEngineering: {
    title: { fa: 'چرا سقف فلزی به مهندسی نیاز دارد', en: 'Why metal ceiling systems need engineering' },
    body: {
      fa: 'سقف فلزی صرفاً یک محصول نیست؛ نتیجه نهایی به نقشه اجرایی، هماهنگی تأسیسات، کنترل تراز و اتصالات و توالی نصب وابسته است. خرید مصالح بدون مهندسی، ریسک تراز نادرست، تداخل تأسیسات و کیفیت ضعیف را به پروژه منتقل می‌کند.',
      en: 'A metal ceiling is not just a product; the final result depends on shop drawings, service coordination, level and connection control and installation sequence. Buying materials without engineering transfers the risk of poor alignment, service clashes and weak quality onto the project.',
    },
    bullets: {
      fa: [
        'نقشه اجرایی اختصاصی برای هندسه و ماژول هر پروژه',
        'هماهنگی با روشنایی، تهویه و سیستم‌های حریق',
        'کنترل تراز، اتصالات، آویزها و تلرانس اجرا',
        'انتخاب متریال و پوشش متناسب با محیط و دوام',
      ],
      en: [
        'Dedicated shop drawings for each project’s geometry and module',
        'Coordination with lighting, HVAC and fire-safety systems',
        'Control of level, connections, hangers and execution tolerance',
        'Material and finish selection matched to environment and durability',
      ],
    },
  },
  typesTitle: { fa: 'انواع سیستم‌های سقف فلزی آویزسازه', en: 'Types of AvizSazeh metal ceiling systems' },
  typesIntro: {
    fa: 'چهار سیستم سقف کاذب فلزی آویزسازه؛ هر کدام برای هندسه، عملکرد و بیان معماری متفاوتی تخصیص می‌یابد.',
    en: 'The four AvizSazeh metal suspended ceiling systems — each specified for a different geometry, function and architectural expression.',
  },
  comparisonTitle: { fa: 'مقایسه سیستم‌ها: خطی، گریلیوم، تایل، بافل', en: 'Comparison: linear, grilliom, tile, baffle' },
  applicationsTitle: { fa: 'کاربردها', en: 'Applications' },
  applicationsIntro: {
    fa: 'سقف کاذب فلزی در فرودگاه‌ها، مراکز خرید، فضاهای تجاری، اداری و پایانه‌های حمل‌ونقل کاربرد دارد.',
    en: 'Metal suspended ceilings are used in airports, malls, commercial and office spaces and transport terminals.',
  },
  /** application items: those with `href` link to a dedicated landing page */
  applications: [
    { label: { fa: 'سقف کاذب فرودگاه', en: 'Airport ceiling' }, href: '/applications/airport-ceiling' },
    { label: { fa: 'سقف کاذب تجاری', en: 'Commercial ceiling' }, href: '/applications/commercial-ceiling' },
    { label: { fa: 'سقف کاذب مرکز خرید (مال)', en: 'Shopping mall ceiling' }, href: '/applications/commercial-ceiling' },
    { label: { fa: 'فضاهای اداری', en: 'Office spaces' }, href: null },
    { label: { fa: 'پایانه‌های حمل‌ونقل', en: 'Transport terminals' }, href: '/applications/airport-ceiling' },
  ] as { label: Record<Locale, string>; href: string | null }[],
  processTitle: { fa: 'فرآیند مهندسی و اجرا', en: 'Engineering and execution process' },
  process: [
    {
      title: { fa: 'طراحی و انتخاب سیستم', en: 'Design & system selection' },
      body: { fa: 'بازبینی خواست معماری و انتخاب سیستم سقف بر پایه هندسه، بار و کاربری.', en: 'Reviewing architectural intent and selecting the ceiling system from geometry, load and use.' },
    },
    {
      title: { fa: 'مهندسی و نقشه اجرایی', en: 'Engineering & shop drawings' },
      body: { fa: 'تهیه نقشه اجرایی، هماهنگی تأسیسات و کنترل دیتیل و تراز.', en: 'Producing shop drawings, coordinating services and controlling detailing and level.' },
    },
    {
      title: { fa: 'تولید سفارشی', en: 'Custom manufacturing' },
      body: { fa: 'تولید قطعات مطابق نقشه و شرایط واقعی پروژه با کنترل کیفیت.', en: 'Manufacturing parts to the drawings and real project conditions, quality controlled.' },
    },
    {
      title: { fa: 'اجرا و تحویل', en: 'Execution & handover' },
      body: { fa: 'نصب کنترل‌شده، کنترل کیفیت و تحویل نتیجه معماری.', en: 'Controlled installation, quality control and handover of the architectural result.' },
    },
  ] as TitledBody[],
  mistakesTitle: { fa: 'اشتباه رایج: خرید فقط مصالح', en: 'Common mistakes when buying only materials' },
  mistakes: {
    fa: [
      'واگذاری طراحی دیتیل و هماهنگی تأسیسات به کارگاه، بدون نقشه اجرایی',
      'نادیده‌گرفتن کنترل تراز، اتصالات و توالی نصب در ارتفاع',
      'انتخاب متریال بدون توجه به محیط، دوام و الزامات حریق',
      'انتقال مسئولیت کیفیت نهایی به پیمانکار و کارفرما',
    ],
    en: [
      'Leaving detailing and service coordination to the site, with no shop drawings',
      'Ignoring level control, connections and installation sequence at height',
      'Selecting material without regard to environment, durability and fire requirements',
      'Transferring responsibility for final quality onto the contractor and owner',
    ],
  },
  faqTitle: { fa: 'پرسش‌های متداول', en: 'Frequently asked questions' },
  faq: [
    {
      q: { fa: 'سقف کاذب فلزی بهتر است یا سقف گچی؟', en: 'Is a metal suspended ceiling better than plasterboard?' },
      a: {
        fa: 'سقف فلزی در دوام، قابلیت بازرسی، تعویض‌پذیری و یکپارچگی با تأسیسات برتری دارد و برای فضاهای بزرگ‌مقیاس، پرتردد و معماری مناسب‌تر است. سقف گچی برای سطوح کاملاً بسته و یکدست ساده‌تر است. انتخاب نهایی به کاربری و الزامات پروژه بستگی دارد.',
        en: 'A metal ceiling is superior in durability, inspectability, replaceability and service integration, and fits large-scale, high-traffic and architectural spaces better. Plasterboard is simpler for fully closed, seamless surfaces. The final choice depends on the use and project requirements.',
      },
    },
    {
      q: { fa: 'کدام سیستم سقف فلزی برای پروژه من مناسب است؟', en: 'Which metal ceiling system suits my project?' },
      a: {
        fa: 'سقف خطی فلزی برای ریتم و فضاهای کشیده، گریلیوم برای دسترسی و عمق بصری، تایل سقفی فلزی برای نظم و نگهداری، و سقف بافل برای آکوستیک و بیان معماری مناسب است. ماتریس مقایسه و بررسی مهندسی، انتخاب را قطعی می‌کند.',
        en: 'A linear metal ceiling suits rhythm and elongated spaces, open cell suits access and visual depth, a metal ceiling tile suits order and maintenance, and a baffle suits acoustics and architectural expression. The comparison matrix and an engineering review finalise the choice.',
      },
    },
    {
      q: { fa: 'آیا آویزسازه طراحی، تولید و اجرا را با هم انجام می‌دهد؟', en: 'Does AvizSazeh handle design, manufacturing and installation together?' },
      a: {
        fa: 'بله. آویزسازه سقف کاذب فلزی را به‌صورت سیستم کامل از طراحی و نقشه اجرایی تا تولید سفارشی و نصب کنترل‌شده تحویل می‌دهد و مسئولیت نتیجه نهایی را بر عهده می‌گیرد.',
        en: 'Yes. AvizSazeh delivers the metal suspended ceiling as a complete system, from design and shop drawings to custom manufacturing and controlled installation, and takes responsibility for the final result.',
      },
    },
    {
      q: { fa: 'سقف فلزی تا چه ارتفاعی قابل اجراست؟', en: 'To what height can a metal ceiling be installed?' },
      a: {
        fa: 'آویزسازه تجربه اجرای سقف فلزی در ارتفاع‌های زیاد را دارد و نصب در ارتفاع را با منطق تعلیق و کنترل تراز مدیریت می‌کند. ارتفاع دقیق هر پروژه پس از بررسی نقشه تأیید می‌شود.',
        en: 'AvizSazeh has experience installing metal ceilings at significant heights and manages installation at height with a defined suspension logic and level control. The exact height is confirmed per project after drawing review.',
      },
    },
  ] as Faq[],
  ctaTitle: { fa: 'سقف کاذب فلزی پروژه خود را به‌عنوان یک سیستم مهندسی تعریف کنید', en: 'Define your metal suspended ceiling as an engineered system' },
  ctaText: {
    fa: 'نقشه و مشخصات پروژه را ارسال کنید تا تیم مهندسی آویزسازه سیستم مناسب، مسیر تولید و اجرا و ریسک‌های پروژه را بررسی کند.',
    en: 'Send your drawings and project details so the AvizSazeh engineering team can review the right system, the production and execution path and the project risks.',
  },
  cover: '/design-system/hero-home.png',
  coverAlt: {
    fa: 'سقف کاذب فلزی مهندسی‌شده آویزسازه در فضای معماری بزرگ‌مقیاس',
    en: 'AvizSazeh engineered metal suspended ceiling in a large-scale architectural space',
  },
};
