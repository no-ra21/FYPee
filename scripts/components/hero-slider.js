/*
 * Hero Slider Component JavaScript
 * Handles hero image slider with autoplay and pagination
 */

class HeroSlider {
  constructor(selector = '.hero') {
    this.hero = document.querySelector(selector);
    if (!this.hero) return;
    
    this.slides = this.hero.querySelectorAll('.hero-slide');
    this.paginationContainer = document.getElementById('heroPagination');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoplayTimer = null;
    this.autoplayDelay = 5000; // 5 seconds
    this.isPlaying = true;
    
    this.init();
  }
  
  init() {
    if (this.totalSlides <= 1) return;
    
    this.createPagination();
    this.setupEventListeners();
    this.showSlide(0);
    this.startAutoplay();
  }
  
  createPagination() {
    if (!this.paginationContainer) {
      // Create pagination container if it doesn't exist
      this.paginationContainer = document.createElement('div');
      this.paginationContainer.className = 'hero-pagination';
      this.paginationContainer.id = 'heroPagination';
      this.hero.appendChild(this.paginationContainer);
    }
    
    // Clear existing pagination
    this.paginationContainer.innerHTML = '';
    
    // Create pagination dots
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'pagination-dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.paginationContainer.appendChild(dot);
    }
    
    this.paginationDots = this.paginationContainer.querySelectorAll('.pagination-dot');
  }
  
  setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.hero.matches(':hover')) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          this.toggleAutoplay();
          break;
      }
    });
    
    // Pause on hover
    this.hero.addEventListener('mouseenter', () => {
      this.pauseAutoplay();
    });
    
    this.hero.addEventListener('mouseleave', () => {
      if (this.isPlaying) {
        this.startAutoplay();
      }
    });
    
    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else if (this.isPlaying) {
        this.startAutoplay();
      }
    });
    
    // Touch/swipe support
    this.setupTouchEvents();
  }
  
  setupTouchEvents() {
    let startX = 0;
    let endX = 0;
    const minSwipeDistance = 50;
    
    this.hero.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    this.hero.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const distance = Math.abs(startX - endX);
      
      if (distance >= minSwipeDistance) {
        if (startX > endX) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    }, { passive: true });
  }
  
  showSlide(index) {
    // Remove active class from all slides
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.paginationDots?.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide
    this.slides[index].classList.add('active');
    this.paginationDots?.[index]?.classList.add('active');
    
    this.currentIndex = index;
  }
  
  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    this.showSlide(nextIndex);
  }
  
  previousSlide() {
    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(prevIndex);
  }
  
  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.showSlide(index);
      this.restartAutoplay();
    }
  }
  
  startAutoplay() {
    this.pauseAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }
  
  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
  
  toggleAutoplay() {
    this.isPlaying = !this.isPlaying;
    
    if (this.isPlaying) {
      this.startAutoplay();
    } else {
      this.pauseAutoplay();
    }
  }
  
  restartAutoplay() {
    if (this.isPlaying) {
      this.startAutoplay();
    }
  }
  
  destroy() {
    this.pauseAutoplay();
    // Remove event listeners and clean up
  }
}

// Export for use in main.js
window.HeroSlider = HeroSlider;
