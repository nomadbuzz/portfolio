const THEME_KEY = 'baz-portfolio-theme';

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function setMetaTheme(theme) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#f1f5f9' : '#050508');
}

function syncThemeToggle() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  document.querySelectorAll('[data-theme-icon]').forEach((el) => {
    const want = el.getAttribute('data-theme-icon');
    el.classList.toggle('hidden', want !== theme);
  });
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.setAttribute(
      'aria-label',
      theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
    );
  });
  setMetaTheme(theme);
}

function toggleTheme() {
  const next =
    document.documentElement.getAttribute('data-theme') === 'light'
      ? 'dark'
      : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  syncThemeToggle();
}

document.querySelectorAll('.theme-toggle').forEach((btn) => {
  btn.addEventListener('click', toggleTheme);
});

syncThemeToggle();

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute(
      'aria-expanded',
      mobileMenu.classList.contains('hidden') ? 'false' : 'true'
    );
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const y = targetElement.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
      mobileMenu?.classList.add('hidden');
      menuBtn?.setAttribute('aria-expanded', 'false');
    }
  });
});

const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  if (window.scrollY > 12) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { rootMargin: '0px 0px -8%', threshold: 0.08 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelector('#contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#name')?.value?.trim();
  const email = form.querySelector('#email')?.value?.trim();
  const message = form.querySelector('#message')?.value?.trim();
  if (!name || !email || !message) return;
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
  window.location.href = `mailto:baz.coding@gmail.com?subject=${subject}&body=${body}`;
});
