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

// Slider Logic
const track = document.getElementById('slider-track');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
const dots = document.querySelectorAll('.dot');
const slides = document.querySelectorAll('.slide');

let currentIndex = 0;

function updateSlider() {
  if (!track || slides.length === 0) return;

  const gap = 32; // 2rem gap from CSS
  const slideWidth = (slides[0] as HTMLElement).offsetWidth + gap;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

prevBtn?.addEventListener('click', () => {
  const slidesCount = slides.length;
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : slidesCount - 1;
  updateSlider();
});

nextBtn?.addEventListener('click', () => {
  const slidesCount = slides.length;
  currentIndex = (currentIndex < slidesCount - 1) ? currentIndex + 1 : 0;
  updateSlider();
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    updateSlider();
  });
});

// Re-calculate on resize
window.addEventListener('resize', updateSlider);

// Initial positioning
setTimeout(updateSlider, 100);
