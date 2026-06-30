import type { LocalizedString } from '@/lib/site';

export type Client = {
  file: string;
  name: LocalizedString;
};

/** 28 real clients/projects (logos sourced from avizsazeh.ir). No fabricated entries. */
export const clients: Client[] = [
  { file: 'imam-khomeini-airport.png', name: { fa: 'فرودگاه بین‌المللی امام خمینی (ره)', en: 'Imam Khomeini Int’l Airport', ar: 'مطار الإمام الخميني الدولي' } },
  { file: 'chadormalu.jpeg', name: { fa: 'چادرملو', en: 'Chadormalu', ar: 'چادرملو' } },
  { file: 'arya-sasol.jpeg', name: { fa: 'پتروشیمی آریاساسول', en: 'Arya Sasol Polymer', ar: 'آريا ساسول للبتروكيماويات' } },
  { file: 'sairan.png', name: { fa: 'صاایران', en: 'SAIRAN', ar: 'صا إيران' } },
  { file: 'bushehr-mall.jpeg', name: { fa: 'بوشهر مال', en: 'Bushehr Mall', ar: 'بوشهر مول' } },
  { file: 'pamidco.png', name: { fa: 'پامیدکو', en: 'PAMIDCO', ar: 'باميدكو' } },
  { file: 'jahad-nasr-arak.png', name: { fa: 'جهاد نصر اراک', en: 'Jahad Nasr Arak', ar: 'جهاد نصر أراك' } },
  { file: 'nezam-mohandesi-qazvin.jpeg', name: { fa: 'نظام مهندسی قزوین', en: 'Qazvin Construction Eng. Org.', ar: 'منظمة هندسة البناء في قزوين' } },
  { file: 'bushehr-heritage.png', name: { fa: 'میراث فرهنگی بوشهر', en: 'Bushehr Cultural Heritage' } },
  { file: 'armatur-pardis.jpeg', name: { fa: 'آرماتور پردیس', en: 'Armatur Pardis' } },
  { file: 'aria-omran-pars.jpeg', name: { fa: 'آریا عمران پارس', en: 'Aria Omran Pars' } },
  { file: 'alphabet-qeshm.jpg', name: { fa: 'آلفابت قشم', en: 'Alphabet Qeshm' } },
  { file: 'anamis-sazan.jpg', name: { fa: 'آنامیس سازان جرون', en: 'Anamis Sazan Jaroon' } },
  { file: 'esalat.jpg', name: { fa: 'اصالت', en: 'Esalat' } },
  { file: 'zagros-zarrin-pars.jpeg', name: { fa: 'زاگرس زرین پارس', en: 'Zagros Zarrin Pars' } },
  { file: 'saman-andishan.jpeg', name: { fa: 'سامان اندیشان امرتات', en: 'Saman Andishan Amrtat' } },
  { file: 'armeh-sazeh-novin.png', name: { fa: 'آرمه سازه نوین', en: 'Armeh Sazeh Novin' } },
  { file: 'anbouh-gostar-nasr.jpeg', name: { fa: 'انبوه‌گستر نصر', en: 'Anbouh Gostar Nasr' } },
  { file: 'pars-gostar.jpeg', name: { fa: 'پارس گستر', en: 'Pars Gostar' } },
  { file: 'meshkin-part-kish.jpg', name: { fa: 'مشکین‌پارت کیش', en: 'Meshkin Part Kish' } },
  { file: 'moghavem-kar.jpg', name: { fa: 'مقاوم‌کار', en: 'Moghavem Kar' } },
  { file: 'shahrdari-parand.jpg', name: { fa: 'شهرداری پرند', en: 'Parand Municipality' } },
  { file: 'shahrdari-zarrinshahr.png', name: { fa: 'شهرداری زرین‌شهر', en: 'Zarrin Shahr Municipality' } },
  { file: 'shahrdari-sejzi.jpeg', name: { fa: 'شهرداری سجزی', en: 'Sejzi Municipality' } },
  { file: 'shahrdari-lenjan.jpeg', name: { fa: 'شهرداری لنجان', en: 'Lenjan Municipality' } },
  { file: 'fazapooshan-kerman.jpeg', name: { fa: 'فضاپوشان کرمان', en: 'Fazapooshan Kerman' } },
  { file: 'vodja.jpg', name: { fa: 'ودجا', en: 'VODJA' } },
  { file: 'vira-tejarat.jpg', name: { fa: 'ویرا تجارت لیدوما', en: 'Vira Tejarat Liduma' } },
];
