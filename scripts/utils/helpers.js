/*
 * Utility Functions
 * Common helper functions used throughout the application
 */

const Utils = {
  /**
   * Debounce function to limit the rate of function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function to limit function execution frequency
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Check if an element is in the viewport
   * @param {Element} element - DOM element to check
   * @param {number} threshold - Percentage of element that should be visible (0-1)
   * @returns {boolean} True if element is in viewport
   */
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const elementHeight = rect.bottom - rect.top;
    const elementWidth = rect.right - rect.left;
    
    return (
      rect.top <= window.innerHeight - (elementHeight * threshold) &&
      rect.bottom >= (elementHeight * threshold) &&
      rect.left <= window.innerWidth - (elementWidth * threshold) &&
      rect.right >= (elementWidth * threshold)
    );
  },

  /**
   * Smooth scroll to element
   * @param {Element|string} target - Element or selector to scroll to
   * @param {number} offset - Offset from top in pixels
   * @param {number} duration - Animation duration in milliseconds
   */
  scrollTo(target, offset = 0, duration = 800) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = Utils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  },

  /**
   * Easing function for smooth animations
   * @param {number} t - Current time
   * @param {number} b - Start value
   * @param {number} c - Change in value
   * @param {number} d - Duration
   * @returns {number} Eased value
   */
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  },

  /**
   * Get query parameter from URL
   * @param {string} param - Parameter name
   * @returns {string|null} Parameter value or null
   */
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * Set query parameter in URL without page reload
   * @param {string} param - Parameter name
   * @param {string} value - Parameter value
   */
  setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
  },

  /**
   * Format text for URL slug
   * @param {string} text - Text to format
   * @returns {string} URL-friendly slug
   */
  slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Capitalize first letter of string
   * @param {string} string - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  /**
   * Format number with thousands separator
   * @param {number} num - Number to format
   * @param {string} separator - Thousands separator
   * @returns {string} Formatted number
   */
  formatNumber(num, separator = ',') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  },

  /**
   * Check if device is mobile
   * @returns {boolean} True if mobile device
   */
  isMobile() {
    return window.innerWidth <= 768;
  },

  /**
   * Check if device is tablet
   * @returns {boolean} True if tablet device
   */
  isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  },

  /**
   * Check if device is desktop
   * @returns {boolean} True if desktop device
   */
  isDesktop() {
    return window.innerWidth > 1024;
  },

  /**
   * Get device type
   * @returns {string} Device type: 'mobile', 'tablet', or 'desktop'
   */
  getDeviceType() {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  },

  /**
   * Load image with promise
   * @param {string} src - Image source URL
   * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
   */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Promise that resolves to true if successful
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  },

  /**
   * Simple localStorage wrapper with error handling
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('localStorage not available:', e);
        return false;
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('localStorage not available:', e);
        return defaultValue;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn('localStorage not available:', e);
        return false;
      }
    }
  }
};

// Export for use in main.js
window.Utils = Utils;
