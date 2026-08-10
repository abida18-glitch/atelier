/**
 * ATELIER HAUTE — APPLICATION LOGIC & DATA ENGINE
 * Features tab switching, 100-item fabric catalog, 3D camera behaviors, designer portfolio, map tracking, chat, checkout, & review system.
 */

// Application State
const STATE = {
  currentTab: 'catalog',
  selectedRating: 0,
  appliedCoupon: false,
  basePrice: 2100.00,
  snapshots: [],
  reviews: [
    {
      author: "Duchess de Rose",
      rating: 5,
      text: "The silk drape and 3D rendering precision matched the couture gown perfectly.",
      date: "MMXXVI"
    },
    {
      author: "Baroness Clara",
      rating: 4,
      text: "Exquisite velvet texture rendition in macro mode. Order delivery was tracked smoothly.",
      date: "MMXXVI"
    }
  ]
};

// 100 FABRICS DATASET GENERATION
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
      const image = FABRIC_IMAGES[i % FABRIC_IMAGES.length];
      catalogData.push({
        id: i,
        name: `Atelier Garment #${i} — ${type}`,
        type: type,
        image: image,
        price: (1100 + (i * 20)).toFixed(2)
      });
    }
  } catch (err) {
    showNotification("Failed to compile 100-fabric dataset.", "error");
  }
}

function renderCatalog(items) {
  const grid = document.getElementById('fabric-grid');
  if (!grid) return;

  grid.innerHTML = '';
  if (items.length === 0) {
    grid.innerHTML = `<p class="col-span-full font-roman text-stone-400 text-center py-8">No matching textiles found.</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = "bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all group font-roman";
    card.innerHTML = `
      <div class="h-44 overflow-hidden bg-slate-950 relative">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
        <span class="absolute top-2 right-2 text-[10px] bg-slate-950/80 border border-slate-700 px-2 py-0.5 rounded text-emerald-300">${item.type}</span>
      </div>
      <div class="p-3 space-y-1">
        <h4 class="text-xs text-stone-200 truncate">${item.name}</h4>
        <p class="text-xs text-emerald-400 font-bold">$${item.price}</p>
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('fabric-count').innerText = items.length;
}

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
    showNotification("Error filtering fabric options.", "error");
  }
}

// TAB SWITCHING LOGIC
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

      if (tabId === 'tracker' && window.atelierMap) {
        setTimeout(() => window.atelierMap.invalidateSize(), 200);
      }
    }
  } catch (err) {
    showNotification("Error switching view tabs.", "error");
  }
}

// 3D CAMERA BEHAVIORS
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
      tag.innerText = "MODE: III. EYE-LEVEL STUDIO PROFILE";
      break;
    case 'macro':
      img.classList.add('scale-150');
      tag.innerText = "MODE: IV. EXTREME MACRO TEXTURE CLOSE-UP";
      break;
  }
}

function enableLiveCamera() {
  const video = document.getElementById('webcam-video');
  const img = document.getElementById('viewport-image');
  const tag = document.getElementById('camera-overlay-tag');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.classList.remove('hidden');
        img.classList.add('hidden');
        tag.innerText = "MODE: LIVE CAMERA FEED ACTIVE";
        showNotification("Live webcam feed initialized.", "success");
      })
      .catch(() => {
        showNotification("Webcam permission denied or unavailable.", "error");
      });
  } else {
    showNotification("Webcam stream API not supported.", "error");
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
    showNotification("Studio snapshot captured.", "success");
  } catch (err) {
    showNotification("Unable to process snapshot.", "error");
  }
}

function generateAIImage() {
  const img = document.getElementById('viewport-image');
  img.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
  showNotification("Generated new AI dress render.", "success");
}

function toggleMeasurementModal(show) {
  const modal = document.getElementById('modal-measurement');
  if (modal) modal.classList.toggle('hidden', !show);
}

// DESIGNER PORTFOLIO SHOWCASE
function handleBgUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('profile-bg').style.backgroundImage = `url(${event.target.result})`;
      document.getElementById('profile-bg').style.backgroundSize = 'cover';
      showNotification("Designer background updated.", "success");
    };
    reader.readAsDataURL(file);
  }
}

function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('profile-avatar').src = event.target.result;
      showNotification("Designer photo updated.", "success");
    };
    reader.readAsDataURL(file);
  }
}

function switchCategory(cat) {
  const grid = document.getElementById('portfolio-content-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const sampleImgs = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=80'
  ];

  sampleImgs.forEach((src) => {
    const card = document.createElement('div');
    card.className = "h-28 bg-slate-950 rounded-lg overflow-hidden border border-slate-800";
    card.innerHTML = `<img src="${src}" class="w-full h-full object-cover" />`;
    grid.appendChild(card);
  });

  showNotification(`Loaded category: ${cat.toUpperCase()}`, "info");
}

function triggerLiveStream() {
  showNotification("Live streaming broadcast initialized for followers.", "success");
}

// CHAT & COMMUNICATION
function triggerCall(type) {
  showNotification(`Initializing ${type} session with Atelier Manufacturer...`, "info");
}

function handleSendMessage(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const chat = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = "bg-emerald-950/80 border border-emerald-700/60 p-3 rounded-lg max-w-md ml-auto text-stone-200";
  msg.innerHTML = `<p>${text}</p><span class="text-[10px] text-emerald-400 block mt-1 text-right">Just now</span>`;
  
  chat.appendChild(msg);
  input.value = '';
  chat.scrollTop = chat.scrollHeight;
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    showNotification(`File attached: ${file.name}`, "success");
  }
}

function requestOrderUpdate() {
  showNotification("Order update request transmitted to manufacturer.", "success");
}

// PACKAGE TRACKING MAP
function initMap() {
  try {
    if (!document.getElementById('map')) return;

    const map = L.map('map').setView([48.8566, 2.3522], 4);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    L.marker([48.8566, 2.3522]).addTo(map).bindPopup('STAGE I. Factory Assembly');
    L.marker([50.8503, 4.3517]).addTo(map).bindPopup('STAGE III. Transit Route');

    window.atelierMap = map;
  } catch (err) {
    console.warn("Leaflet map initialization skipped.", err);
  }
}

// CHECKOUT ENGINE
function setAuthMethod(method) {
  const buttons = document.querySelectorAll('.auth-btn');
  buttons.forEach(btn => btn.classList.remove('active-auth', 'bg-emerald-950/80', 'border-emerald-500'));
  event.target.classList.add('active-auth', 'bg-emerald-950/80', 'border-emerald-500');
  showNotification(`Account method selected: ${method.toUpperCase()}`, "info");
}

function applyCoupon() {
  const code = document.getElementById('coupon-code').value.trim().toUpperCase();
  const status = document.getElementById('coupon-status');

  if (code === 'ATELIER2026') {
    STATE.appliedCoupon = true;
    status.innerText = "PROMO APPLIED: 20% DISCOUNT";
    status.className = "text-[10px] text-emerald-400 mt-1";
    
    const discount = STATE.basePrice * 0.20;
    const finalPrice = STATE.basePrice - discount;
    document.getElementById('discount-val').innerText = `-$${discount.toFixed(2)}`;
    document.getElementById('total-val').innerText = `$${finalPrice.toFixed(2)}`;
  } else {
    status.innerText = "INVALID COUPON CODE";
    status.className = "text-[10px] text-rose-400 mt-1";
  }
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  try {
    const fname = document.getElementById('cust-firstname').value;
    if (!fname) throw new Error("Please enter mandatory contact info.");

    showNotification(`Checkout Complete! Order confirmed for ${fname}.`, "success");
  } catch (err) {
    showNotification(err.message || "Checkout submission failed.", "error");
  }
}

// REVIEWS & STAR RATING
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
    card.className = "bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 font-roman text-xs";
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
      throw new Error("Please select a star rating score.");
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
    showNotification("Review published to dashboard.", "success");
  } catch (err) {
    showNotification(err.message || "Failed to submit review.", "error");
  }
}

// NOTIFICATION DISPLAY HELPER
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
  }, 3500);
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  generateCatalogData();
  renderCatalog(catalogData);
  switchCategory('posts');
  renderReviews();
  initMap();
});