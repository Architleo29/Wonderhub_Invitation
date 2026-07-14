/* ============================================================
   i18n.js — English / Bengali Language Toggle
   ============================================================ */

// Bengali translations keyed by a simple string ID
const translations = {
  // Curtain scene
  'curtain-heading': 'কিছু অসাধারণ খুলতে চলেছে',
  'cut-instruction': 'সুতো কাটতে টেনে আনুন',

  // Announcement scene
  'announcement-eyebrow': 'গ্র্যান্ড ওপেনিং শীঘ্রই',
  'announcement-headline': 'শাড়ি থেকে আরও অনেক কিছুর যাত্রা',
  'announcement-body': 'এক ঐতিহ্য, অসংখ্য রূপে পুনর্জীবিত — পোশাক, গয়না, উপহার, এবং একটি প্রাণবন্ত কমিউনিটি যারা হাবকে ভালোবাসে। প্রতিটি সুতো আমাদের এখানে এনেছে — সবার জন্য একটি জায়গা তৈরি করতে ♡।',
  'announcement-script': 'ভালোবাসায় তৈরি, কমিউনিটির জন্য গড়া।',
  'announcement-date': 'উদ্বোধন ২৩শে জুলাই ২০২৬',

  // Countdown labels
  'countdown-days': 'দিন',
  'countdown-hours': 'ঘণ্টা',
  'countdown-minutes': 'মিনিট',
  'countdown-seconds': 'সেকেন্ড',

  // Calendar button
  'calendar-add-btn': 'ক্যালেন্ডারে যোগ করুন',

  // Identity reveal
  'reveal-btn': 'আমাদের পরিচয় জানতে ক্লিক করুন',
  'logo-tagline': 'হাবকে ভালোবাসুন',

  // Store details
  'store-hook': 'হাতে তৈরি কমনীয়তার জাদু অনুভব করুন',
  'store-location': 'আমাদের নতুন দোকানে আসুন — <span>৬ নং গড়িয়া বাস স্ট্যান্ডের কাছে (সেবাঙ্গন নার্সিং হোমের পাশে), কলকাতা-৭০০০৪৭</span>',
  'store-hours': 'প্রতিদিন খোলা: <span>সকাল ১০:০০ — রাত ৮:০০</span>',

  // Social section
  'social-heading': 'যাত্রা শুরুর আগে অনুসরণ করুন।',
  'social-subtext': 'প্রথম দরজার ভিতরে আসুন।',

  // Offers
  'tab-opening': 'গ্র্যান্ড ওপেনিং স্পেশাল',
  'tab-monthly': 'মাসিক পুজো সঞ্চয়',

  'offer-1-badge': 'ফ্ল্যাট ১০% ছাড়',
  'offer-1-desc': 'প্রথম কেনাকাটায়',
  'offer-2-badge': '₹২০০ ছাড়',
  'offer-2-desc': '<strong>₹১,৪৯৯</strong>-এর উপরে কেনাকাটায়',
  'offer-3-badge': 'ফ্রি উপহার',
  'offer-3-desc': '<strong>₹২,৪৯৯</strong>-এর কেনাকাটায় প্রথম <strong>২৫ জন</strong> গ্রাহকের জন্য',

  // Monthly offers
  'promo-eyebrow': 'দুর্গা পুজো পর্যন্ত প্রতি মাসে',
  'promo-get': 'পান',
  'promo-amount': '₹২০০ ছাড়',
  'promo-target': 'নির্দিষ্ট শাড়ি কেনাকাটায়',
  'promo-condition': 'প্রতি মাসের শেষ ৫ দিনে!',

  'calendar-label': 'অফারের সময়কাল',
  'calendar-dates': '২৬ থেকে মাস শেষ',

  'feature-1': 'প্রতি মাসে নতুন কালেকশন',
  'feature-2': 'সীমিত সময়ের অফার',
  'feature-3': 'আপনার পছন্দের সুন্দর শাড়ি',
  'feature-4': 'ওয়ান্ডারহাবের সাথে পুজোর কাউন্টডাউন',

  'offers-validity': 'আপনার ক্যালেন্ডারে চিহ্নিত করুন এবং অফার শেষ হওয়ার আগে কিনুন! ♡',

  // Share
  'share-title': 'আনন্দ ভাগ করুন',
  'share-subtitle': 'যাদের জন্য উদযাপন আরও অর্থবহ, তাদের আমন্ত্রণ জানান',
  'share-btn': 'আপনার প্রিয়জনদের সাথে শেয়ার করুন',

  // Footer
  'footer-brand': 'ওয়ান্ডার হাব',

  // Scroll indicator
  'scroll-text': 'নিচে স্ক্রল করুন',
};

// English originals (populated from the DOM on first load)
const englishOriginals = {};

export class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('wh-lang') || 'en';
    this.toggleBar = document.getElementById('lang-toggle');
    this.btnEn = document.getElementById('lang-en');
    this.btnBn = document.getElementById('lang-bn');

    if (!this.toggleBar) return;

    // Cache English originals from the DOM
    document.querySelectorAll('[data-i18n]').forEach(el => {
      englishOriginals[el.dataset.i18n] = el.innerHTML;
    });

    // Bind events
    this.btnEn.addEventListener('click', () => this.setLang('en'));
    this.btnBn.addEventListener('click', () => this.setLang('bn'));

    // Apply saved language
    if (this.currentLang === 'bn') {
      this.setLang('bn');
    }
  }

  setLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('wh-lang', lang);

    // Update toggle buttons
    this.btnEn.classList.toggle('active', lang === 'en');
    this.btnBn.classList.toggle('active', lang === 'bn');

    // Update html lang attribute
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';

    // Swap text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (lang === 'bn' && translations[key]) {
        el.innerHTML = translations[key];
      } else if (lang === 'en' && englishOriginals[key]) {
        el.innerHTML = englishOriginals[key];
      }
    });
  }
}
