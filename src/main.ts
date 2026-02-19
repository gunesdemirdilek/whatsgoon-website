import './style.css'

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
