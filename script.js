/**
 * Atelier Global — Interactive Studio Logic
 * Error Handling Included
 */

// Global State
const state = {
  activeTab: 'tab-1',
  selectedGarment: null,
  cameraMode: 'turntable',
  selectedRating: 0,
  mapInstance: null,
};

// Massive Dataset of internet fashion trend fabrics & dresses
const garmentDataset = [
  { id: 1, name: 'Obsidian Evening Gown', fabric: 'Silk Satin', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Emerald Velvet Wrap', fabric: 'Deep Velvet', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'French Floral Bodice', fabric: 'Chantilly Lace', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Avant-Garde Blazer', fabric: 'Raw Denim', image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'Nude Tulle Ballgown', fabric: 'Layered Tulle', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'Structured Atelier Coat', fabric: 'Tweed Wool', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80' },
  { id: 7, name: 'Minimalist Column Dress', fabric: 'Organic Linen', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80' },
  { id: 8, name: 'Brocade Royal Corset', fabric: 'Gold Brocade', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80' },
  { id: 9, name: 'Pleated Organza Skirt', fabric: 'Silk Organza', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
  { id: 10, name: 'Contemporary Trench', fabric: 'Italian Leather', image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=600&q=80' },
  { id: 11, name: 'Ribbed Cyber Dress', fabric: 'Synthetic Knit', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80' },
  { id: 12, name: 'Vintage Corduroy Suit', fabric: 'Ribbed Corduroy', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80' }
];

// Initial Seed Reviews
const initialReviews = [
  { name: 'Duchess Isabella', text: 'The silk drape on the custom obsidian gown was immaculate. Arrived right on schedule in Manhattan.', rating: 5, date: 'MMXXVI.08.01' },
  { name: 'Sophia Chen', text: 'The extreme macro zoom camera helped me inspect the brocade weave prior to dispatch. Exceeded expectations.', rating: 5, date: 'MMXXVI.08.04' }
];

// Error Handling Display Utility
function displayError(msg) {
  const banner = document.getElementById('error-banner');
  const messageSpan = document.getElementById('error-message');
  if (banner && messageSpan) {
    messageSpan.textContent = msg;
    banner.classList.remove('hidden');
    setTimeout(() => banner.classList.add('hidden'), 5000);
  } else {
    console.error('Error banner DOM elements missing:', msg);
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  try {
    initNavigation();
    renderCatalog();
    initCameraControls();
    initStarRating();
    initReviewForm();
    renderReviews();
  } catch (err) {
    displayError('Initialization error: ' + err.message);
  }
});

/* ================= 1. TAB NAVIGATION ================= */
function initNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.add('hidden'));

        btn.classList.add('active');
        const activeContainer = document.getElementById(targetTab);
        if (activeContainer) {
          activeContainer.classList.remove('hidden');
          state.activeTab = targetTab;

          // Lazy load map on Tab II selection
          if (targetTab === 'tab-2' && !state.mapInstance) {
            initLeafletMap();
          }
        }
      } catch (err) {
        displayError('Navigation failed: ' + err.message);
      }
    });
  });
}

/* ================= 2. TAB I: CATALOG & CAMERA ================= */
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  grid.innerHTML = '';
  garmentDataset.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `garment-card bg-black/60 border border-stone-800 rounded-lg overflow-hidden cursor-pointer p-2 ${index === 0 ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="h-36 overflow-hidden rounded mb-2">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
      </div>
      <h4 class="font-script text-lg text-nude-pink leading-tight">${item.name}</h4>
      <p class="font-roman text-[10px] text-emerald-400/80 uppercase">${item.fabric}</p>
    `;

    card.addEventListener('click', () => {
      try {
        document.querySelectorAll('.garment-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.selectedGarment = item;

        const viewportImg = document.getElementById('active-viewport-img');
        if (viewportImg) {
          viewportImg.src = item.image;
        }
      } catch (err) {
        displayError('Garment selection failed: ' + err.message);
      }
    });

    grid.appendChild(card);
  });
}

function initCameraControls() {
  const camBtns = document.querySelectorAll('.cam-btn');
  const viewportImg = document.getElementById('active-viewport-img');
  const label = document.getElementById('camera-mode-label');

  camBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        camBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-mode');
        state.cameraMode = mode;

        if (label) label.textContent = btn.textContent.trim();

        if (viewportImg) {
          switch (mode) {
            case 'turntable':
              viewportImg.style.transform = 'scale(1) rotate(0deg)';
              break;
            case 'high-angle':
              viewportImg.style.transform = 'scale(1.15) translateY(-10px)';
              break;
            case 'front-profile':
              viewportImg.style.transform = 'scale(1.05)';
              break;
            case 'macro-zoom':
              viewportImg.style.transform = 'scale(2.2)';
              break;
          }
        }
      } catch (err) {
        displayError('Camera transition error: ' + err.message);
      }
    });
  });
}

/* ================= 3. TAB II: LEAFLET MAP LOGISTICS ================= */
function initLeafletMap() {
  try {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer || typeof L === 'undefined') {
      displayError('Leaflet map SDK failed to load.');
      return;
    }

    // Paris Atelier -> JFK NYC Flight Route Coordinates
    const paris = [48.8566, 2.3522];
    const nyc = [40.7128, -74.0060];

    const map = L.map('leaflet-map').setView([45.0, -35.0], 3);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB',
      maxZoom: 18
    }).addTo(map);

    L.marker(paris).addTo(map).bindPopup('I. Atelier Paris Factory').openPopup();
    L.marker(nyc).addTo(map).bindPopup('IV. NYC Client Destination');

    const polyline = L.polyline([paris, nyc], { color: '#10b981', weight: 2, dashArray: '5, 10' }).addTo(map);

    state.mapInstance = map;
  } catch (err) {
    displayError('Map setup encountered an error: ' + err.message);
  }
}

/* ================= 4. TAB III: CLIENT REVIEWS ================= */
function initStarRating() {
  const stars = document.querySelectorAll('#star-rating-picker .star');
  const ratingInput = document.getElementById('selected-rating');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      try {
        const rating = parseInt(star.getAttribute('data-rating'), 10);
        state.selectedRating = rating;
        if (ratingInput) ratingInput.value = rating;

        stars.forEach((s, idx) => {
          if (idx < rating) {
            s.classList.add('filled');
          } else {
            s.classList.remove('filled');
          }
        });
      } catch (err) {
        displayError('Star score calculation failed: ' + err.message);
      }
    });
  });
}

function initReviewForm() {
  const form = document.getElementById('review-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const name = document.getElementById('client-name').value.trim();
      const text = document.getElementById('review-text').value.trim();
      const rating = state.selectedRating;

      if (!name || !text || rating === 0) {
        displayError('Please complete all form fields and select a star rating score.');
        return;
      }

      const newReview = {
        name,
        text,
        rating,
        date: 'MMXXVI.08.10'
      };

      initialReviews.unshift(newReview);
      renderReviews();

      // Reset form
      form.reset();
      state.selectedRating = 0;
      document.querySelectorAll('#star-rating-picker .star').forEach(s => s.classList.remove('filled'));

    } catch (err) {
      displayError('Review dispatch error: ' + err.message);
    }
  });
}

function renderReviews() {
  const feed = document.getElementById('reviews-feed');
  if (!feed) return;

  feed.innerHTML = '';
  initialReviews.forEach(r => {
    const card = document.createElement('div');
    card.className = 'bg-black/60 border border-stone-800 rounded-lg p-4 backdrop-blur-md space-y-2 font-roman';
    card.innerHTML = `
      <div class="flex justify-between items-center">
        <h4 class="text-sm font-semibold text-nude-pink">${r.name}</h4>
        <span class="text-xs text-stone-500">${r.date}</span>
      </div>
      <div class="text-amber-400 text-xs">
        ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
      </div>
      <p class="text-xs text-stone-300 italic">"${r.text}"</p>
    `;
    feed.appendChild(card);
  });
}