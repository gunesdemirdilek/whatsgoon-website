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
