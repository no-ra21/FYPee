/*
 * ArkVision Website - Main JavaScript Entry Point
 * Initializes all components and handles global functionality
 * 
 * Author: Development Team
 * Version: 1.0.0
 * Last Updated: September 2025
 */



class ArkVisionWebsite {
  constructor() {
    this.components = {};
    this.isInitialized = false;
    
    this.init();
  }
  
  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      // Initialize navigation
      if (window.Navigation) {
        this.components.navigation = new window.Navigation();
      }
      
      // Initialize hero slider (only on pages with hero section)
      if (document.querySelector('.hero') && window.HeroSlider) {
        this.components.heroSlider = new window.HeroSlider();
      }
      
      // Initialize product search (only on products page)
      if (document.querySelector('.product-search') && window.ProductSearch) {
        this.components.productSearch = new window.ProductSearch();
        window.productSearch = this.components.productSearch; // Global reference for buttons
      }
      
      // Initialize contact form (only on contact page)
      if (document.querySelector('.contact-form') && window.ContactForm) {
        this.components.contactForm = new window.ContactForm();
      }
      
      // Initialize global features
      this.initializeGlobalFeatures();
      
      this.isInitialized = true;
      console.log('ArkVision Website initialized successfully');
      
    } catch (error) {
      console.error('Error initializing website components:', error);
    }
  }
  
  initializeGlobalFeatures() {
    // Smooth scrolling for anchor links
    this.initializeSmoothScrolling();
    
    // Form enhancements
    this.initializeFormEnhancements();
    
    // Lazy loading for images
    this.initializeLazyLoading();
    
    // Intersection observer for animations
    this.initializeScrollAnimations();
    
    // Skip to content link
    this.initializeAccessibilityFeatures();
    
    // Email links
    this.initializeEmailLinks();
    
    // Performance monitoring
    this.initializePerformanceMonitoring();
  }
  
  initializeSmoothScrolling() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link || !link.hash) return;
      
      e.preventDefault();
      const target = document.querySelector(link.hash);
      
      if (target && window.Utils) {
        const offset = document.querySelector('.site-header')?.offsetHeight || 70;
        window.Utils.scrollTo(target, offset);
      } else if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  initializeEmailLinks() {
    // Handle email links to ensure they work properly
    document.addEventListener('click', (e) => {
      const emailLink = e.target.closest('a[href^="mailto:"]');
      if (!emailLink) return;
      
      // Get the email address
      const email = emailLink.getAttribute('href').replace('mailto:', '');
      
      // For desktop: Open Gmail compose
      if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Desktop - try to open Gmail
        window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
      } else {
        // Mobile - use native mailto: (opens default email app)
        window.location.href = emailLink.getAttribute('href');
      }
      
      e.preventDefault();
    });
  }
  
  initializeFormEnhancements() {
    // Add floating labels
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    inputs.forEach(input => {
      if (input.value) {
        input.classList.add('has-value');
      }
      
      input.addEventListener('input', () => {
        if (input.value) {
          input.classList.add('has-value');
        } else {
          input.classList.remove('has-value');
        }
      });
      
      input.addEventListener('focus', () => {
        input.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.classList.remove('focused');
      });
    });
    
    // Real-time character count for textareas
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
      const maxLength = textarea.getAttribute('maxlength');
      const counter = document.createElement('div');
      counter.className = 'character-counter';
      counter.style.fontSize = '0.75rem';
      counter.style.color = 'var(--muted)';
      counter.style.textAlign = 'right';
      counter.style.marginTop = '0.25rem';
      
      textarea.parentNode.appendChild(counter);
      
      const updateCounter = () => {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} characters remaining`;
        
        if (remaining < 50) {
          counter.style.color = '#ff4757';
        } else {
          counter.style.color = 'var(--muted)';
        }
      };
      
      textarea.addEventListener('input', updateCounter);
      updateCounter();
    });
  }
  
  initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.classList.remove('lazy');
              img.classList.add('loaded');
            }
            
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  initializeScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
      });
    }
  }
  
  initializeAccessibilityFeatures() {
    // Ensure main content has ID
    const mainContent = document.querySelector('main, .main-content');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
    
    // Focus management for modals and overlays
    this.setupFocusManagement();
  }
  
  setupFocusManagement() {
    let lastFocusedElement = null;
    
    document.addEventListener('focusin', (e) => {
      if (!e.target.closest('.modal, .overlay')) {
        lastFocusedElement = e.target;
      }
    });
    
    // Return focus when modal closes
    document.addEventListener('modal:close', () => {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    });
  }
  
  initializePerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', () => {
      if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        // You could send this data to analytics
        if (loadTime > 3000) {
          console.warn('Page load time is over 3 seconds');
        }
      }
    });
    
    // Monitor Core Web Vitals if available
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              console.log(`LCP: ${entry.startTime}ms`);
            }
            if (entry.entryType === 'first-input') {
              console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
            }
          });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }

initScrollToTop() {
  const btn = document.createElement("button");
  btn.id = "scrollToTopBtn";
  btn.className = "btn btn-primary";
  btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  // Style
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.display = "none";
  btn.style.zIndex = "1000";
  btn.style.borderRadius = "50%";
  btn.style.color="#f7f3f4ff"
  btn.style.width = "60px";
  btn.style.height = "60px";
  btn.style.fontSize = "25px";
  btn.style.padding = "0";

  // ✅ inject into body
  document.body.appendChild(btn);

  // Show/hide on scroll
  window.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop > 300 || document.body.scrollTop > 300) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });

  // Scroll to top when clicked
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

  
  // Public methods for external use
  getComponent(name) {
    return this.components[name];
  }
  
  reinitialize() {
    this.components = {};
    this.initializeComponents();
  }
  
  destroy() {
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components = {};
    this.isInitialized = false;
  }
}

// Initialize the website
const arkVisionWebsite = new ArkVisionWebsite();

// Make it globally available for debugging
window.arkVisionWebsite = arkVisionWebsite;

// Legacy compatibility - maintain the original function structure

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle (legacy)
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Hero slider initialization (legacy)
  if (typeof initHeroSlider === 'undefined') {
    window.initHeroSlider = function() {
      if (arkVisionWebsite.components.heroSlider) {
        return;
      }
      if (window.HeroSlider) {
        arkVisionWebsite.components.heroSlider = new window.HeroSlider();
      }
    };
  }

  // Product search initialization (legacy)
  if (typeof initProductSearch === 'undefined') {
    window.initProductSearch = function() {
      if (arkVisionWebsite.components.productSearch) {
        return;
      }
      if (window.ProductSearch) {
        arkVisionWebsite.components.productSearch = new window.ProductSearch();
        window.productSearch = arkVisionWebsite.components.productSearch;
      }
    };
  }

  // Contact form initialization (legacy)
  if (typeof initContactForm === 'undefined') {
    window.initContactForm = function() {
      if (arkVisionWebsite.components.contactForm) {
        return;
      }
      if (window.ContactForm) {
        arkVisionWebsite.components.contactForm = new window.ContactForm();
      }
    };
  }

  // ✅ FIXED: Call method from arkVisionWebsite instance
  arkVisionWebsite.initScrollToTop();
});


