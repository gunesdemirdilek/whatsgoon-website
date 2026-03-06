import './style.css'
import { translations } from './translations'

// Theme Toggle Logic
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('#theme-icon');
const html = document.documentElement;

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle?.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme: string) {
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
    // @ts-ignore - Lucide is loaded via CDN
    if (window.lucide) {
      // @ts-ignore
      window.lucide.createIcons();
    }
  }
}

// Language Logic
const langToggle = document.querySelector('#lang-toggle');
let currentLang = localStorage.getItem('lang') || 'en';

function updateLanguage(lang: string) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  if (langToggle) {
    langToggle.textContent = lang === 'en' ? 'TR' : 'EN';
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && translations[lang as keyof typeof translations][key as keyof typeof translations['en']]) {
      const translation = translations[lang as keyof typeof translations][key as keyof typeof translations['en']];
      if (el.tagName === 'TITLE') {
        document.title = translation;
      } else if (el.tagName === 'META' && el.getAttribute('name') === 'description') {
        el.setAttribute('content', translation);
      } else {
        el.innerHTML = translation;
      }
    }
  });

  // Update specific link hrefs based on language
  const termsLink = document.querySelector('a[data-i18n="termsOfService"]');
  if (termsLink) {
    termsLink.setAttribute('href', lang === 'tr' ? '/tr_terms.html' : '/terms.html');
  }

  const privacyLink = document.querySelector('a[data-i18n="privacyPolicy"]') as HTMLAnchorElement | null;
  if (privacyLink) {
    privacyLink.href = '/privacy.html';
    privacyLink.style.display = lang === 'tr' ? 'none' : 'inline';
  }

  // Show KVKK link only in Turkish
  const kvkkLink = document.querySelector('#kvkk-link') as HTMLAnchorElement | null;
  if (kvkkLink) {
    kvkkLink.style.display = lang === 'tr' ? 'inline' : 'none';
  }

  // Swap feature images based on language
  const imageMap: Record<string, string> = {
    'feat_statement_analysis_1772765202681.png': 'tr_home_dashboard.png',
    'feat_receipt_scan_1772765221602.png': 'tr_home_detail.png',
    'feat_subscription_detective_1772765234700.png': 'tr_debt.png',
    'feat_lightning_entry_1772765248506.png': 'tr_welcome.png',
    'feat_free_tier_1772765263637.png': 'tr_login.png',
  };

  document.querySelectorAll('.trio-image img, .feature-image-small img').forEach(el => {
    const img = el as HTMLImageElement;
    // Store original EN src once
    if (!img.dataset.enSrc) {
      img.dataset.enSrc = img.src;
    }
    const filename = img.dataset.enSrc.split('/').pop() || '';
    if (lang === 'tr' && imageMap[filename]) {
      img.src = `/assets/features/tr/${imageMap[filename]}`;
    } else {
      img.src = img.dataset.enSrc;
    }
  });

  // Re-run Lucide to ensure icons in translated strings are rendered (if any)
  // @ts-ignore
  if (window.lucide) {
    // @ts-ignore
    window.lucide.createIcons();
  }
}

langToggle?.addEventListener('click', () => {
  const nextLang = currentLang === 'en' ? 'tr' : 'en';
  updateLanguage(nextLang);
});

// Initialize language on load
updateLanguage(currentLang);

// Scroll Blur Header
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
});

// Smooth Scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const href = (anchor as HTMLAnchorElement).getAttribute('href');
    if (href) {
      const target = document.querySelector(href);
      target?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Contact Form AJAX Submission
const contactForm = document.getElementById('contact-form') as HTMLFormElement;
const formStatus = document.getElementById('form-status');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!formStatus) return;

  const data = new FormData(contactForm);
  const submitBtn = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;

  try {
    submitBtn.disabled = true;
    formStatus.textContent = currentLang === 'en' ? 'Sending...' : 'Gönderiliyor...';
    formStatus.className = 'form-status';

    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      formStatus.textContent = translations[currentLang as keyof typeof translations].formSuccess;
      formStatus.className = 'form-status success';
      contactForm.reset();
    } else {
      const errorData = await response.json();
      formStatus.textContent = errorData.errors?.[0]?.message || (currentLang === 'en' ? 'Oops! Something went wrong.' : 'Hay aksi! Bir şeyler yanlış gitti.');
      formStatus.className = 'form-status error';
    }
  } catch (error) {
    formStatus.textContent = currentLang === 'en' ? 'Oops! There was a problem submitting your form.' : 'Hay aksi! Form gönderilirken bir sorun oluştu.';
    formStatus.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
  }
});

// Re-run Lucide to ensure icons in translated strings are rendered (if any)
// @ts-ignore
if (window.lucide) {
  // @ts-ignore
  window.lucide.createIcons();
}
