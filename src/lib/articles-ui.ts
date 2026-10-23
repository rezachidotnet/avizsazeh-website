import type { Locale } from '@/i18n/routing';

/** UI copy for the articles section (kept here rather than in messages/*.json). */
const copy = {
  fa: {
    eyebrow: 'مقالات مهندسی',
    title: 'مقالات تخصصی سقف کاذب فلزی',
    intro:
      'راهنماهای فنی آویزسازه درباره انتخاب، طراحی و اجرای سیستم‌های سقف فلزی؛ از منطق مهندسی و هماهنگی تأسیسات تا نکات اجرایی و مقررات روز ساختمان.',
    metaTitle: 'مقالات سقف کاذب فلزی | راهنمای فنی آویزسازه',
    metaDescription:
      'مقالات تخصصی آویزسازه درباره سقف کاذب فلزی، سقف خطی، گریلیوم، تایل فلزی، بافل و اکسپندد متال؛ راهنمای انتخاب، طراحی، اجرا و مقررات ساختمان.',
    empty: 'هنوز مقاله‌ای منتشر نشده است.',
    readMore: 'مطالعه مقاله',
    minutes: 'دقیقه مطالعه',
    published: 'انتشار',
    updated: 'به‌روزرسانی',
    toc: 'فهرست مطالب',
    relatedSystems: 'سیستم‌های مرتبط',
    relatedArticles: 'مقالات مرتبط',
    faq: 'پرسش‌های متداول',
    sources: 'منابع',
    ctaTitle: 'پروژه‌ای در دست طراحی دارید؟',
    ctaText: 'مشخصات پروژه را ثبت کنید تا تیم مهندسی آویزسازه سیستم سقف مناسب را بررسی کند.',
    latestOnSystem: 'مقالات مرتبط با این سیستم',
    allArticles: 'همه مقالات',
    feed: 'خوراک RSS',
    otherLanguageNote: '',
  },
  en: {
    eyebrow: 'Engineering articles',
    title: 'Metal ceiling engineering articles',
    intro:
      'Technical guides from AvizSazeh on selecting, designing and executing metal ceiling systems. Articles are currently published in Persian.',
    metaTitle: 'Metal Ceiling Articles | AvizSazeh Technical Guides',
    metaDescription:
      'AvizSazeh technical articles on metal suspended ceilings — linear, open cell, metal tile, baffle and expanded metal systems.',
    empty: 'English articles are coming soon. Our current articles are published in Persian:',
    readMore: 'Read article',
    minutes: 'min read',
    published: 'Published',
    updated: 'Updated',
    toc: 'Contents',
    relatedSystems: 'Related systems',
    relatedArticles: 'Related articles',
    faq: 'FAQ',
    sources: 'Sources',
    ctaTitle: 'Designing a project?',
    ctaText: 'Submit your project specifications for an AvizSazeh engineering review.',
    latestOnSystem: 'Articles about this system',
    allArticles: 'All articles',
    feed: 'RSS feed',
    otherLanguageNote: 'Persian',
  },
  ar: {
    eyebrow: 'مقالات هندسية',
    title: 'مقالات تقنية عن الأسقف المعدنية',
    intro:
      'أدلة تقنية من آویزسازه حول اختيار وتصميم وتنفيذ أنظمة الأسقف المعدنية. تُنشر المقالات حالياً باللغة الفارسية.',
    metaTitle: 'مقالات الأسقف المعدنية | آویزسازه',
    metaDescription:
      'مقالات آویزسازه التقنية حول الأسقف المعدنية المعلّقة: الخطي، الجريليوم، البلاطات، البافل والمعدن الممدد.',
    empty: 'المقالات العربية قريباً. المقالات الحالية منشورة بالفارسية:',
    readMore: 'قراءة المقال',
    minutes: 'دقائق قراءة',
    published: 'النشر',
    updated: 'التحديث',
    toc: 'المحتويات',
    relatedSystems: 'أنظمة مرتبطة',
    relatedArticles: 'مقالات مرتبطة',
    faq: 'الأسئلة الشائعة',
    sources: 'المصادر',
    ctaTitle: 'هل لديك مشروع قيد التصميم؟',
    ctaText: 'أرسل مواصفات مشروعك ليقيّمها فريق الهندسة في آویزسازه.',
    latestOnSystem: 'مقالات حول هذا النظام',
    allArticles: 'كل المقالات',
    feed: 'RSS',
    otherLanguageNote: 'الفارسية',
  },
} as const;

export type ArticlesCopy = (typeof copy)['fa'];

export function articlesCopy(locale: Locale): ArticlesCopy {
  return (copy[locale] ?? copy.fa) as ArticlesCopy;
}
