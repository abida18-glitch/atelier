/**
 * ATELIER HAUTE — CORE APPLICATION LOGIC
 * Includes Data Generation, Virtual Camera Controls, Map Integration, Checkout, & Reviews with Error Handling
 */

// ================= GLOBAL STATE =================
const STATE = {
  currentTab: 'catalog',
  selectedRating: 0,
  appliedCoupon: false,
  basePrice: 2450.00,
  cartTotal: 2450.00,
  snapshots: [],
  reviews: [
    {
      author: "Duchess de Rose",
      rating: 5,
      text: "The silk drape and precise 3D rendering matched the physical couture gown flawlessly. Truly revolutionary craftsmanship.",
      date: "MMXXVI"
    },
    {
      author: "Elena Rostova",
      rating: 4,
      text: "Exquisite velvet texture rendition in the macro viewer. Delivery was tracked accurately across all stages.",
      date: "MMXXVI"
    }
  ]
};

// ================= FABRIC CATALOG DATASET GENERATOR (100 ITEMS) =================
const FABRIC_TYPES = ['Satin', 'Silk', 'Lace', 'Velvet', 'Denim', 'Corduroy', 'Chiffon', 'Brocade', 'Organza', 'Tulle', 'Linen', 'Tweed', 'Leather', 'Technical Synthetic'];
const FABRIC_IMAGES = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80'
];

let catalogData = [];

function generateCatalogData() {
  try {
    for (let i = 1; i <= 100; i++) {
      const type = FABRIC_TYPES[i % FABRIC_TYPES.length];
      const img = FABRIC_IMAGES[i % FABRIC_IMAGES.length];
      catalogData.push({
        id: i,
        name: `Atelier Model ${i} — ${type}`,
        type: type,
        image: img,
        price: (1200 + (i * 25)).toFixed(2)
      });
    }
  } catch (error) {
    showNotification("Failed to generate fabric catalog dataset.", "error");
  }
}

// Render Catalog Grid
function renderCatalog(items) {
  const grid = document.getElementById('fabric-grid');
  if (!grid) return;

  grid.innerHTML = '';
  if (items.length === 0) {
    grid.innerHTML = `<p class="col-span-full font-roman text-stone-400 text-center py-8">No matching fabrics found.</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = "bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all group";
    card.innerHTML = `
      <div class="h-48 overflow-hidden bg-slate-950 relative">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
        <span class="absolute top-2 right-2 font-roman text-[10px] bg-slate-950/80 border border-slate-700 px-2 py-0.5 rounded text-emerald-300">${item.type}</span>
      </div>
      <div class="p-3 font-roman space-y-1">
        <h4 class="text-xs text-stone-200 truncate">${item.name}</h4>
        <p class="text-xs text-emerald-400 font-bold">$${item.price}</p>
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('fabric-count').innerText = items.length;
}

// Filter Catalog Engine
function filterCatalog() {
  try {
    const query = document.getElementById('catalog-search').value.toLowerCase();
    const category = document.getElementById('catalog-filter').value;

    const filtered = catalogData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(query) || item.type.toLowerCase().includes(query);
      const matchesCategory = category === 'ALL' || item.type === category;
      return matchesSearch && matchesCategory;
    });

    renderCatalog(filtered);
  } catch (err) {
    showNotification("Error filtering catalog items.", "error");
  }
}

// ================= NAVIGATION SYSTEM =================
function switchTab(tabId) {
  try {
    const contents = document.querySelectorAll('.tab-content');
    const navBtns = document.querySelectorAll('.nav-btn');

    contents.forEach(el => el.classList.add('hidden'));
    navBtns.forEach(btn => btn.classList.remove('active-tab'));

    const targetSection = document.getElementById(`section-${tabId}`);
    const targetTab = document.getElementById(`tab-${tabId}`);

    if (targetSection && targetTab) {
      targetSection.classList.remove('hidden');
      targetTab.classList.add('active-tab');
      STATE.currentTab = tabId;

      // Leaflet Map Needs Resize Invalidation when tab is switched
      if (tabId === 'tracker' && window.atelierMap) {
        setTimeout(() => window.atelierMap.invalidateSize(), 200);
      }
    }
  } catch (err) {
    showNotification("Error switching view tabs.", "error");
  }
}

// ================= VIRTUAL AI CAMERA CONTROLS =================
function setCameraMode(mode) {
  const img = document.getElementById('viewport-image');
  const tag = document.getElementById('camera-overlay-tag');
  if (!img || !tag) return;

  img.className = "h-full object-contain transition-all duration-700 transform";

  switch (mode) {
    case 'turntable':
      img.classList.add('animate-pulse', 'scale-100');
      tag.innerText = "MODE: I. 360° AUTOMATIC TURNTABLE";
      break;
    case 'highangle':
      img.classList.add('rotate-6', 'scale-90');
      tag.innerText = "MODE: II. HIGH-ANGLE STRUCTURAL VIEW";
      break;
    case 'eyelevel':
      img.classList.add('scale-100');
      tag.innerText = "MODE: III. EYE-LEVEL STUDIO FRONT";
      break;
    case 'macro':
      img.classList.add('scale-150');
      tag.innerText = "MODE: IV. EXTREME MACRO TEXTURE CLOSE-UP";
      break;
  }
}

function takeSnapshot() {
  try {
    const gallery = document.getElementById('snapshot-gallery');
    const imgUrl = document.getElementById('viewport-image').src;

    if (STATE.snapshots.length === 0) gallery.innerHTML = '';

    STATE.snapshots.push(imgUrl);
    
    const snapThumb = document.createElement('img');
    snapThumb.src = imgUrl;
    snapThumb.className = "w-full h-16 object-cover rounded border border-emerald-500/50 shadow-md";
    
    gallery.appendChild(snapThumb);
    showNotification("Snapshot render successfully saved to gallery.", "success");
  } catch (err) {
    showNotification("Unable to process camera snapshot.", "error");
  }
}

function toggleMeasurementModal(show) {
  const modal = document.getElementById('modal-measurement');
  if (modal) {
    modal.classList.toggle('hidden', !show);
  }
}

// ================= LIVE PACKAGE MAP TRACKER =================
function initMap() {
  try {
    if (!document.getElementById('map')) return;

    // Center coordinates (e.g. Paris to New York route)
    const map = L.map('map').setView([48.8566, 2.3522], 4);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    // Marker Locations
    const atelierMarker = L.marker([48.8566, 2.3522]).addTo(map).bindPopup('I. Atelier Paris Workshop');
    const transitMarker = L.marker([50.8503, 4.3517]).addTo(map).bindPopup('III. Transit Hub in Progress');

    window.atelierMap = map;
  } catch (err) {
    console.warn("Leaflet Map failed to initialize.", err);
  }
}

// ================= CHECKOUT & PROMO ENGINE =================
function setAuthMethod(method) {
  const buttons = document.querySelectorAll('.auth-btn');
  buttons.forEach(btn => btn.classList.remove('active-auth', 'bg-emerald-950/80', 'border-emerald-500'));
  
  event.target.classList.add('active-auth', 'bg-emerald-950/80', 'border-emerald-500');
  showNotification(`Account method set to: ${method.toUpperCase()}`, "info");
}

function applyCoupon() {
  const code = document.getElementById('coupon-code').value.trim().toUpperCase();
  const status = document.getElementById('coupon-status');
  
  if (code === 'ATELIER2026') {
    STATE.appliedCoupon = true;
    status.innerText = "PROMO CODE APPLIED: 20% DISCOUNT";
    status.className = "text-[10px] text-emerald-400 mt-1";
    updateTotals();
  } else {
    status.innerText = "INVALID COUPON CODE";
    status.className = "text-[10px] text-rose-400 mt-1";
  }
}

function updateTotals() {
  let discount = STATE.appliedCoupon ? STATE.basePrice * 0.20 : 0;
  STATE.cartTotal = STATE.basePrice - discount;

  document.getElementById('discount-val').innerText = `-$${discount.toFixed(2)}`;
  document.getElementById('total-val').innerText = `$${STATE.cartTotal.toFixed(2)}`;
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  try {
    const name = document.getElementById('cust-firstname').value;
    if (!name) throw new Error("Please complete required contact details.");

    showNotification(`Order placed successfully! Thank you, ${name}.`, "success");
  } catch (err) {
    showNotification(err.message || "Error processing checkout transaction.", "error");
  }
}

// ================= CLIENT REVIEW SYSTEM =================
function setRating(score) {
  STATE.selectedRating = score;
  const stars = document.querySelectorAll('#star-rating .star');
  stars.forEach((star, idx) => {
    if (idx < score) {
      star.classList.add('text-amber-400');
      star.classList.remove('text-stone-600');
    } else {
      star.classList.remove('text-amber-400');
      star.classList.add('text-stone-600');
    }
  });
}

function renderReviews() {
  const feed = document.getElementById('reviews-feed');
  if (!feed) return;

  feed.innerHTML = '';
  STATE.reviews.forEach(rev => {
    const starsStr = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
    const card = document.createElement('div');
    card.className = "bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2 font-roman text-xs";
    card.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-bold text-stone-200">${rev.author}</span>
        <span class="text-amber-400 tracking-wider text-sm">${starsStr}</span>
      </div>
      <p class="text-stone-400 italic">"${rev.text}"</p>
      <span class="text-[10px] text-stone-600 block text-right">${rev.date}</span>
    `;
    feed.appendChild(card);
  });
}

function handleReviewSubmit(e) {
  e.preventDefault();
  try {
    const author = document.getElementById('review-author').value.trim();
    const text = document.getElementById('review-text').value.trim();

    if (STATE.selectedRating === 0) {
      throw new Error("Please select a star rating before submitting.");
    }

    STATE.reviews.unshift({
      author: author,
      rating: STATE.selectedRating,
      text: text,
      date: "MMXXVI"
    });

    renderReviews();
    document.getElementById('review-form').reset();
    setRating(0);
    showNotification("Critique successfully added to public feed.", "success");
  } catch (err) {
    showNotification(err.message || "Failed to post review.", "error");
  }
}

// ================= GLOBAL NOTIFICATION SYSTEM =================
function showNotification(msg, type = 'info') {
  const bar = document.getElementById('notification-bar');
  if (!bar) return;

  bar.innerText = msg;
  bar.classList.remove('hidden', 'bg-emerald-950', 'border-emerald-500', 'text-emerald-200', 'bg-rose-950', 'border-rose-500', 'text-rose-200');

  if (type === 'error') {
    bar.classList.add('bg-rose-950', 'border-rose-500', 'text-rose-200');
  } else {
    bar.classList.add('bg-emerald-950', 'border-emerald-500', 'text-emerald-200');
  }

  setTimeout(() => {
    bar.classList.add('hidden');
  }, 4000);
}

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  generateCatalogData();
  renderCatalog(catalogData);
  renderReviews();
  initMap();
});