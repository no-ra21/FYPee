/*
 * Front‑end interactivity for the ArkVision website.
 *
 * Features:
 *  - Responsive navigation toggle for mobile devices.
 *  - Hero image slider on the home page with autoplay and pagination.
 *  - Product search filter on the products page.
 *  - Contact form validation and submission via fetch API.
 *  - Prefilling contact form product field based on query parameters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    // Close menu when clicking a link (for single page transitions)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Hero slider on index page
  initHeroSlider();

  // Product search filter on products page
  initProductSearch();

  // Prefill contact product field and handle submission
  initContactForm();
});

function initHeroSlider() {
  const hero = document.querySelector('.hero');
  if (!hero) return; // not on home page
  const slides = hero.querySelectorAll('.hero-slide');
  const paginationContainer = document.getElementById('heroPagination');
  let currentIndex = 0;
  const total = slides.length;

  // Create pagination dots
  if (paginationContainer) {
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
        resetTimer();
      });
      paginationContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
    const dots = paginationContainer?.children;
    if (dots) {
      Array.from(dots).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  }
  updateSlider();

  // Autoplay every 7 seconds
  let timer = setInterval(nextSlide, 7000);
  function nextSlide() {
    currentIndex = (currentIndex + 1) % total;
    updateSlider();
  }
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 7000);
  }
}

function initProductSearch() {
  const searchInput = document.getElementById('productSearch');
  const grid = document.getElementById('productGrid');
  if (!searchInput || !grid) return;
  const items = grid.querySelectorAll('.product-item');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    items.forEach((item) => {
      const name = item.getAttribute('data-name');
      if (!name) return;
      if (name.toLowerCase().includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const productField = document.getElementById('product');
  const responseEl = document.getElementById('formResponse');
  if (productField) {
    // Prefill product field from query string
    const params = new URLSearchParams(window.location.search);
    const productParam = params.get('product');
    if (productParam) {
      productField.value = decodeURIComponent(productParam.replace(/\+/g, ' '));
    }
  }
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const company = form.company.value.trim();
    const product = form.product.value.trim();
    const message = form.message.value.trim();
    let valid = true;
    // Basic validation
    if (!name) {
      showError('nameError', 'Please enter your name');
      valid = false;
    }
    if (!email || !validateEmail(email)) {
      showError('emailError', 'Please enter a valid email');
      valid = false;
    }
    if (!message) {
      showError('messageError', 'Please enter a message');
      valid = false;
    }
    if (!valid) return;
    // Send data
    const payload = { name, email, company, product, message };
    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        responseEl.textContent = 'Thank you for contacting us. We will reply shortly.';
        responseEl.style.color = '#6dd56d';
        form.reset();
      } else {
        responseEl.textContent = 'Sorry, there was an error submitting your message. Please try again later.';
        responseEl.style.color = '#ff7b7b';
      }
    } catch (err) {
      responseEl.textContent = 'Network error. Please check your connection and try again.';
      responseEl.style.color = '#ff7b7b';
    }
  });

  function showError(id, message) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = message;
      el.style.display = 'block';
    }
  }
  function clearErrors() {
    ['nameError', 'emailError', 'messageError'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = '';
        el.style.display = 'none';
      }
    });
    if (responseEl) {
      responseEl.textContent = '';
    }
  }
  function validateEmail(email) {
    // simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}