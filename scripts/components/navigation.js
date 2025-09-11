/*
 * Navigation Component JavaScript
 * Handles mobile navigation toggle and scroll effects
 */

class Navigation {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = this.navMenu?.querySelectorAll('a');
    
    this.init();
  }
  
  init() {
    if (this.navToggle && this.navMenu) {
      this.setupMobileNavigation();
    }
    
    this.setupScrollEffects();
    this.setupActiveLinks();
  }
  
  setupMobileNavigation() {
    // Toggle mobile menu
    this.navToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Close menu when clicking links
    this.navLinks?.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.header.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    const isOpen = this.navMenu.classList.contains('open');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.navMenu.classList.add('open');
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    
    // Prevent scrolling when menu is open
    document.body.style.overflow = 'hidden';
  }
  
  closeMobileMenu() {
    this.navMenu.classList.remove('open');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    
    // Restore scrolling
    document.body.style.overflow = '';
  }
  
  setupScrollEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Add scrolled class for styling
      if (currentScrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
      
      // Hide/show header on scroll (optional)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        this.header.style.transform = 'translateY(-100%)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    });
  }
  
  setupActiveLinks() {
    const currentPath = window.location.pathname;
    
    this.navLinks?.forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      
      if (linkPath === currentPath || 
          (currentPath === '/' && link.textContent.trim() === 'Home') ||
          (currentPath.includes(linkPath) && linkPath !== '/')) {
        link.classList.add('active');
      }
    });
  }
}

// Export for use in main.js
window.Navigation = Navigation;
