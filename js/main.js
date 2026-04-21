/* ============================================
   BẠT ĐỆM HOAN THANH – Main JavaScript
   js/main.js
   ============================================

   Chức năng chính:
   1. Tải ảnh từ thư mục images/ theo key cố định
   2. Navigation: active state khi scroll, mobile menu
   3. Hiệu ứng fade-in khi scroll (Intersection Observer)
   4. Ticker, Header shadow
   ============================================ */

/* ============================================
   1. IMAGE CONFIG
   ============================================

   Đặt tên file ảnh vào cột `file`.
   Ảnh phải nằm trong thư mục images/ của dự án.

   Ví dụ cấu trúc thư mục:
     images/
       hero-main.jpg
       hero-bat-dua.jpg
       hero-bat-oto.jpg
       about.jpg
       bat-dua-xanh-cam.jpg
       bat-ke-soc.jpg
       bat-da-o-to.jpg
       bat-xanh-non-chuoi.jpg
       va-bat.jpg
       tui-chuyen-dung.jpg
*/

const IMAGE_CONFIG = [
  { key: 'hero-main',          file: 'trangchinh.jpg',          alt: 'Ảnh banner chính' },
  { key: 'hero-bat-dua',       file: 'batdua-hero.jpg',       alt: 'Hero – Bạt dứa' },
  { key: 'hero-bat-oto',       file: 'batoto-hero.jpg',       alt: 'Hero – Bạt ô tô' },
  { key: 'about',              file: 'about.jpg',              alt: 'Ảnh xưởng / cửa hàng' },
  { key: 'bat-dua-xanh-cam',   file: 'bat-dua-xanh-cam.jpg',   alt: 'Bạt Dứa Xanh Cam' },
  { key: 'bat-ke-soc',         file: 'bat-ke-soc.jpg',         alt: 'Bạt Kẻ Sọc' },
  { key: 'bat-da-o-to',        file: 'bat-da-o-to.jpg',        alt: 'Bạt Da Ô Tô' },
  { key: 'bat-xanh-non-chuoi', file: 'batxanhnonchuoi.jpg', alt: 'Bạt Xanh Nõn Chuối' },
  { key: 'bat-ghi-xam',       file: 'bat-ghi-xam.jpg',    alt: 'Bạt ghi xám' },
  { key: 'bat-phu-o-to',       file: 'bat-phu-o-to.jpg',    alt: 'Bạt phủ ô tô' },
  { key: 'va-bat',             file: 'va-bat.jpg',             alt: 'Dịch vụ Vá Bạt Ép Nhiệt' },
  { key: 'tui-chuyen-dung',    file: 'tui-chuyen-dung.jpg',    alt: 'Túi Đồ Chuyên Dụng' },
];

/** Thư mục chứa ảnh (tính từ gốc website) */
const IMAGES_DIR = 'images/';

/**
 * Gán ảnh vào container từ đường dẫn file.
 * Nếu file không tồn tại, container giữ nguyên (không lỗi vỡ layout).
 * @param {HTMLElement} container
 * @param {string} src - đường dẫn ảnh
 * @param {string} alt
 */
function setContainerImage(container, src, alt) {
  let img = container.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    container.prepend(img);
  }
  img.alt = alt;
  img.src = src;
  img.onload = () => img.classList.add('loaded');
  img.onerror = () => {
    // Ảnh chưa có – giữ nguyên placeholder, không hiển thị broken icon
    img.remove();
    console.info(`[HoanThanh] Chưa có ảnh: ${src}`);
  };
}

/**
 * Load tất cả ảnh từ thư mục images/ theo IMAGE_CONFIG
 */
function initImages() {
  IMAGE_CONFIG.forEach(cfg => {
    const container = document.querySelector(`[data-img-key="${cfg.key}"]`);
    if (!container) return;
    setContainerImage(container, IMAGES_DIR + cfg.file, cfg.alt);
  });
}


/* ============================================
   2. NAVIGATION
   ============================================ */

/**
 * Highlight nav link tương ứng với section đang hiển thị
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));

  // Trang chủ (top) không có section id
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      navLinks.forEach(a => a.classList.remove('active'));
      const home = document.querySelector('nav a[href="#"]');
      if (home) home.classList.add('active');
    }
  });
}

/**
 * Mobile menu toggle
 */
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  const isOpen = menu.style.display === 'block';
  menu.style.display = isOpen ? 'none' : 'block';
}

// Đóng menu khi click link
function initMobileMenuClose() {
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      const menu = document.getElementById('mobile-menu');
      if (menu) menu.style.display = 'none';
    });
  });
}


/* ============================================
   3. SCROLL FADE-IN ANIMATION
   ============================================ */

function initFadeIn() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.product-card, .why-card, .feature-card, .contact-card, .about-grid, .hero-stats .stat-item'
  );
  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = (i % 4) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}


/* ============================================
   4. TICKER DUPLICATE (đảm bảo loop mượt)
   ============================================ */

function initTicker() {
  const track = document.getElementById('ticker');
  if (!track) return;
  const clone = track.innerHTML;
  track.innerHTML = clone + clone;
}


/* ============================================
   5. HEADER SHADOW KHI SCROLL
   ============================================ */

function initHeaderShadow() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.12)'
      : '0 2px 12px rgba(0,0,0,0.06)';
  });
}


/* ============================================
   KHỞI CHẠY KHI DOM SẴN SÀNG
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initImages();
  initScrollSpy();
  initMobileMenuClose();
  initFadeIn();
  initTicker();
  initHeaderShadow();

  // Expose toggleMenu ra global cho onclick trong HTML
  window.toggleMenu = toggleMenu;

  console.log('%c🟠 Bạt Đệm Hoan Thanh – Website loaded', 'color:#E8610A;font-weight:bold;font-size:14px');
  console.log('%c🖼️  Đặt ảnh vào thư mục images/ theo tên trong IMAGE_CONFIG', 'color:#0A3D6B');
});