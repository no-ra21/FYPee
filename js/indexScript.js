// Initializes the hero slider on the index page, allowing users to navigate through slides with pagination dots
document.addEventListener('DOMContentLoaded', () => {
  // Hero slider on index page
  initHeroSlider();
});


// Initializes the hero slider functionality, including autoplay and pagination
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