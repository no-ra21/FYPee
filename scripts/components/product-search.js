/*
 * Product Search Component JavaScript
 * Handles product filtering and search functionality
 */

class ProductSearch {
  constructor(selector = '.product-search') {
    this.searchContainer = document.querySelector(selector);
    if (!this.searchContainer) return;
    
    this.searchInput = this.searchContainer.querySelector('input[type="search"], input[type="text"]');
    this.categoryFilter = this.searchContainer.querySelector('select');
    this.products = document.querySelectorAll('.product-card, .product-item');
    this.noResults = document.querySelector('.no-results') || this.createNoResultsElement();
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateResultsCount();
  }
  
  setupEventListeners() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.debounce(() => {
        this.filterProducts();
      }, 300));
    }
    
    // Category filter
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener('change', () => {
        this.filterProducts();
      });
    }
    
    // Clear search button
    const clearButton = this.searchContainer.querySelector('.clear-search');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clearSearch();
      });
    }
  }
  
  filterProducts() {
    const searchTerm = this.searchInput?.value.toLowerCase().trim() || '';
    const selectedCategory = this.categoryFilter?.value || '';
    
    let visibleCount = 0;
    
    this.products.forEach(product => {
      const productName = product.querySelector('.product-card-title, .product-title')?.textContent.toLowerCase() || '';
      const productDescription = product.querySelector('.product-card-description, .product-description')?.textContent.toLowerCase() || '';
      const productCategory = product.dataset.category || '';
      
      // Check if product matches search criteria
      const matchesSearch = !searchTerm || 
        productName.includes(searchTerm) || 
        productDescription.includes(searchTerm);
      
      const matchesCategory = !selectedCategory || 
        productCategory === selectedCategory;
      
      const shouldShow = matchesSearch && matchesCategory;
      
      if (shouldShow) {
        product.style.display = '';
        product.classList.remove('hidden');
        visibleCount++;
        
        // Highlight search terms
        if (searchTerm) {
          this.highlightSearchTerm(product, searchTerm);
        } else {
          this.removeHighlights(product);
        }
      } else {
        product.style.display = 'none';
        product.classList.add('hidden');
      }
    });
    
    this.updateResultsCount(visibleCount);
    this.toggleNoResults(visibleCount === 0);
  }
  
  highlightSearchTerm(product, term) {
    const elements = product.querySelectorAll('.product-card-title, .product-title, .product-card-description, .product-description');
    
    elements.forEach(element => {
      if (!element.dataset.originalText) {
        element.dataset.originalText = element.textContent;
      }
      
      const originalText = element.dataset.originalText;
      const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
      const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
      element.innerHTML = highlightedText;
    });
  }
  
  removeHighlights(product) {
    const elements = product.querySelectorAll('.product-card-title, .product-title, .product-card-description, .product-description');
    
    elements.forEach(element => {
      if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
      }
    });
  }
  
  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    
    if (this.categoryFilter) {
      this.categoryFilter.value = '';
    }
    
    this.filterProducts();
  }
  
  updateResultsCount(count = null) {
    if (count === null) {
      count = Array.from(this.products).filter(p => p.style.display !== 'none').length;
    }
    
    const resultsCounter = document.querySelector('.results-count');
    if (resultsCounter) {
      const totalProducts = this.products.length;
      resultsCounter.textContent = `Showing ${count} of ${totalProducts} products`;
    }
  }
  
  toggleNoResults(show) {
    if (this.noResults) {
      this.noResults.style.display = show ? 'block' : 'none';
    }
  }
  
  createNoResultsElement() {
    const element = document.createElement('div');
    element.className = 'no-results';
    element.style.display = 'none';
    element.innerHTML = `
      <div class="text-center py-xl">
        <h3>No products found</h3>
        <p>Try adjusting your search criteria or browse all products.</p>
        <button type="button" class="btn btn-outline" onclick="productSearch.clearSearch()">
          Clear Search
        </button>
      </div>
    `;
    
    // Insert after the search container
    if (this.searchContainer.parentNode) {
      this.searchContainer.parentNode.insertBefore(element, this.searchContainer.nextSibling);
    }
    
    return element;
  }
  
  // Utility functions
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
  }
  
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Export for use in main.js
window.ProductSearch = ProductSearch;
