// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initScrollToTop();
    initScrollEffects();
});

// ===================================
// NAVBAR FUNCTIONALITY
// ===================================

function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// MOBILE MENU TOGGLE
// ===================================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    // Select all links with hashes
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ignore if href is just "#"
            if (href === '#') return;

            e.preventDefault();

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .product-card, .blog-card, .contact-item'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// SCROLL EFFECTS
// ===================================

function initScrollEffects() {
    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateParallaxEffect();
                updateActiveNavLink();
                ticking = false;
            });

            ticking = true;
        }
    });
}

// ===================================
// PARALLAX EFFECT (Subtle)
// ===================================

function updateParallaxEffect() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
}

// ===================================
// ACTIVE NAV LINK HIGHLIGHT
// ===================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.getElementById('navbar').offsetHeight;

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop &&
            window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === current) {
            link.classList.add('active');
        }
    });
}

// ===================================
// PRODUCT CARD INTERACTIONS
// ===================================

// Add ripple effect to buttons (optional enhancement)
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ===================================
// LAZY LOADING IMAGES (Optional)
// ===================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll percentage
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
}

// ===================================
// CONTACT FORM HANDLING (If needed later)
// ===================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);

            // Add your form submission logic here
            console.log('Form submitted:', Object.fromEntries(formData));

            // Show success message
            alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');

            // Reset form
            this.reset();
        });
    }
}

// ===================================
// ANALYTICS TRACKING (Optional)
// ===================================

// Track button clicks
document.querySelectorAll('.btn-call, .btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function () {
        const buttonText = this.textContent.trim();
        console.log('Button clicked:', buttonText);

        // Add your analytics tracking here
        // Example: gtag('event', 'button_click', { button_name: buttonText });
    });
});

// Track product card clicks
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function () {
        const productName = this.querySelector('.product-name').textContent;
        console.log('Product viewed:', productName);

        // Add your analytics tracking here
    });
});

// ===================================
// DARK MODE TOGGLE (Future enhancement)
// ===================================

function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function () {
            document.body.classList.toggle('light-mode');

            // Save preference to localStorage
            const isLightMode = document.body.classList.contains('light-mode');
            localStorage.setItem('lightMode', isLightMode);
        });

        // Load saved preference
        const savedMode = localStorage.getItem('lightMode');
        if (savedMode === 'true') {
            document.body.classList.add('light-mode');
        }
    }
}

// ===================================
// LOADING ANIMATION
// ===================================

window.addEventListener('load', function () {
    // Hide loading screen if exists
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }

    // Trigger animations
    document.body.classList.add('loaded');
});

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', function (e) {
    console.error('An error occurred:', e.error);
    // You can add error reporting here
});

// ===================================
// BROWSER COMPATIBILITY
// ===================================

// Check for smooth scroll support
if (!('scrollBehavior' in document.documentElement.style)) {
    // Add polyfill or alternative implementation
    console.warn('Smooth scroll not supported in this browser');
}

// Check for IntersectionObserver support
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, loading polyfill...');
    // Load polyfill or use alternative
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🛡️ BẠT ĐÊM CAO CẤP', 'color: #0ea5e9; font-size: 24px; font-weight: bold;');
console.log('%cWebsite được thiết kế và phát triển với ❤️', 'color: #64748b; font-size: 14px;');
console.log('%cĐể biết thêm thông tin, vui lòng liên hệ: 0987 654 321', 'color: #94a3b8; font-size: 12px;');

// ===================================
// EXPORT FOR DEBUGGING (Development only)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavbar,
        initMobileMenu,
        initSmoothScroll,
        initScrollAnimations,
        initScrollToTop,
        debounce,
        throttle
    };
}