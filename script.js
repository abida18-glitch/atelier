/**
 * AURA 3D Couture Studio Application Logic
 * Implements full tab navigation, 100-fabric dataset generator, camera switcher,
 * live interactive review star-rating, express checkout, and robust error handling.
 */

// Global Application State
const state = {
  activeTab: 'tab-1',
  selectedFabric: null,
  cameraMode: 'eye-level',
  selectedRating: 5,
  authMethod: 'google',
  discountApplied: false,
  basePrice: 1250,
  fabrics: []
};

// Error Handler Wrapper
function safeExecute(fn, errorMessage = 'An unexpected error occurred.') {
  try {
    fn();
  } catch (error) {
    console.error(`[Aura Error]: ${errorMessage}`, error);
    showToast(`Error: ${errorMessage}`, 'error');
  }
}

// System Toast Notification Utility
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-900/90 border-red-500' : 'bg-stone-900/90 border-amber-500/50';
  
  toast.className = `${bgColor} border text-stone-200 font-roman text-xs px-4 py-3 rounded-lg shadow-xl backdrop-blur-md pointer-events-auto transition-all duration-300 transform translate-x-5 opacity-0`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-x-5', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  safeExecute(() => {
    generateFabricDataset();
    renderFabricCatalog(state.fabrics);
    renderInitialReviews();
    setRating(5);
  }, 'Failed to initialize Aura Studio application');
});

// Tab Navigation Logic
function switchTab(tabId) {
  safeExecute(() => {
    const tabs = document.querySelectorAll('.tab-content');
    const navBtns = document.querySelectorAll('.nav-tab');

    tabs.forEach(tab => tab.classList.add('hidden'));
    navBtns.forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (!targetTab) throw new Error(`Tab content #${tabId} not found`);

    targetTab.classList.remove('hidden');
    state.activeTab = tabId;

    // Highlight button
    const btnMap = { 'tab-1': 1, 'tab-2': 2, 'tab-3': 3, 'tab-4': 4 };
    const activeBtn = document.getElementById(`tab-btn-${btnMap[tabId]}`);
    if (activeBtn) activeBtn.classList.add('active');
  }, 'Failed switching navigation tabs');
}

// Generate 100 Couture Fabrics Dataset
function generateFabricDataset() {
  const categories = [
    'Satin', 'Silk', 'Lace', 'Denim', 'Velvet', 'Corduroy', 
    'Chiffon', 'Brocade', 'Organza', 'Tulle', 'Linen', 'Tweed', 
    'Leather', 'Synthetic Knit'
  ];

  const sampleImages = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80'
  ];

  state.fabrics = Array.from({ length: 100 }, (_, index) => {
    const category = categories[index % categories.length];
    return {
      id: index + 1,
      name: `${category} Couture #${index + 1}`,
      category: category,
      image: sampleImages[index % sampleImages.length]
    };
  });
}

// Render 100 Fabric Cards into Tab 1
function renderFabricCatalog(fabricList) {
  const grid = document.getElementById('fabric-grid');
  if (!grid) return;

  grid.innerHTML = '';

  fabricList.forEach(fabric => {
    const card = document.createElement('div');
    card.className = 'bg-stone-900/60 border border-stone-800 rounded-xl p-3 hover:border-amber-500/50 cursor-pointer transition flex flex-col items-center group';
    card.onclick = () => selectFabric(fabric);

    card.innerHTML = `
      <div class="w-full h-28 rounded-lg bg-cover bg-center mb-2 transition transform group-hover:scale-105" style="background-image: url('${fabric.image}');"></div>
      <p class="font-roman text-[11px] text-stone-200 font-semibold text-center truncate w-full">${fabric.name}</p>
      <span class="text-[9px] font-roman text-amber-200/60 uppercase">${fabric.category}</span>
    `;

    grid.appendChild(card);
  });

  const countElem = document.getElementById('fabric-count');
  if (countElem) countElem.innerText = fabricList.length;
}

// Filter Fabric Catalog Input Search
function filterFabrics() {
  safeExecute(() => {
    const query = document.getElementById('fabric-search').value.toLowerCase().trim();
    const filtered = state.fabrics.filter(f => 
      f.name.toLowerCase().includes(query) || f.category.toLowerCase().includes(query)
    );
    renderFabricCatalog(filtered);
  }, 'Error filtering fabric library');
}

// Select Fabric and Project on Virtual Viewport
function selectFabric(fabric) {
  safeExecute(() => {
    state.selectedFabric = fabric;

    const badge = document.getElementById('selected-fabric-badge');
    if (badge) badge.innerText = `Selected: ${fabric.name}`;

    const modelDisplay = document.getElementById('model-display');
    if (modelDisplay) {
      modelDisplay.style.backgroundImage = `url('${fabric.image}')`;
    }

    showToast(`Applied ${fabric.name} to 3D Viewport model!`);
  }, 'Error selecting fabric pattern');
}

// Camera Modes Switcher
function setCameraMode(mode) {
  safeExecute(() => {
    state.cameraMode = mode;
    const viewport = document.getElementById('viewport-stage');
    const status = document.getElementById('camera-status');

    if (!viewport) return;

    // Reset styles
    viewport.className = 'my-8 flex flex-col items-center justify-center transition-all duration-700';

    if (mode === 'turntable') {
      viewport.classList.add('animate-spin');
      if (status) status.innerText = 'Mode: 360° Automatic Turntable';
    } else if (mode === 'high-angle') {
      viewport.classList.add('scale-90', '-rotate-3');
      if (status) status.innerText = 'Mode: High-Angle Structural View';
    } else if (mode === 'eye-level') {
      if (status) status.innerText = 'Mode: Studio Front Profile (Eye-Level)';
    } else if (mode === 'macro') {
      viewport.classList.add('scale-125');
      if (status) status.innerText = 'Mode: Extreme Macro Texture Close-up';
    }

    showToast(`Camera switched to ${mode.toUpperCase()} view.`);
  }, 'Error changing virtual camera angle');
}

// AI Camera Snapshot
function captureSnapshot() {
  safeExecute(() => {
    showToast('📸 Snapshot saved to studio library!');
  }, 'Failed taking snapshot');
}

// Body Measurement Guide Modal Controls
function openMeasurementGuide() {
  const modal = document.getElementById('modal-tutorial');
  if (modal) modal.classList.remove('hidden');
}

function closeMeasurementGuide() {
  const modal = document.getElementById('modal-tutorial');
  if (modal) modal.classList.add('hidden');
}

// Authorization Switcher in Checkout
function selectAuth(method) {
  safeExecute(() => {
    state.authMethod = method;
    const buttons = document.querySelectorAll('.auth-opt');
    buttons.forEach(btn => {
      btn.classList.remove('border-amber-500/50', 'bg-amber-900/30', 'text-amber-200');
      btn.classList.add('border-stone-700', 'bg-stone-800', 'text-stone-300');
    });

    const activeBtn = document.getElementById(`auth-${method}`);
    if (activeBtn) {
      activeBtn.classList.remove('border-stone-700', 'bg-stone-800', 'text-stone-300');
      activeBtn.classList.add('border-amber-500/50', 'bg-amber-900/30', 'text-amber-200');
    }

    showToast(`Account Mode set to ${method.toUpperCase()}`);
  }, 'Failed switching authorization method');
}

// Apply Coupon Code
function applyCoupon() {
  safeExecute(() => {
    const codeInput = document.getElementById('coupon-code');
    const msg = document.getElementById('coupon-message');
    const totalDisplay = document.getElementById('total-price');

    if (!codeInput || !msg) return;

    const code = codeInput.value.trim().toUpperCase();

    if (code === 'AURA20') {
      if (state.discountApplied) {
        msg.innerText = 'I. Coupon code already applied.';
        msg.className = 'font-roman text-[11px] mt-1 text-amber-400';
        return;
      }
      state.discountApplied = true;
      const discounted = state.basePrice * 0.8;
      totalDisplay.innerText = `$${discounted.toFixed(2)} USD`;
      msg.innerText = 'I. Success: 20% Atelier discount applied!';
      msg.className = 'font-roman text-[11px] mt-1 text-emerald-400';
      showToast('20% Discount code applied!');
    } else {
      msg.innerText = 'I. Invalid promotional coupon code.';
      msg.className = 'font-roman text-[11px] mt-1 text-red-400';
    }
  }, 'Error applying coupon code');
}

// Checkout Form Submission
function handleCheckout(event) {
  event.preventDefault();
  safeExecute(() => {
    const name = document.getElementById('cust-name').value;
    const contact = document.getElementById('cust-contact').value;
    const payment = document.querySelector('input[name="payment"]:checked')?.value || 'Credit Card';

    if (!name || !contact) {
      showToast('Please fill out all contact fields.', 'error');
      return;
    }

    showToast(`Order Confirmed! Thank you, ${name}. Paid via ${payment}.`);
    
    // Reset Form
    document.getElementById('checkout-form').reset();
    state.discountApplied = false;
    document.getElementById('total-price').innerText = `$${state.basePrice.toFixed(2)} USD`;
    document.getElementById('coupon-message').innerText = '';
  }, 'Checkout processing error');
}

// Star Rating Interactive Selection
function setRating(rating) {
  safeExecute(() => {
    state.selectedRating = rating;
    const stars = document.querySelectorAll('#star-rating .star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('text-amber-400');
        star.classList.remove('text-stone-600');
      } else {
        star.classList.remove('text-amber-400');
        star.classList.add('text-stone-600');
      }
    });
  }, 'Error setting star rating');
}

// Render Initial Mock Reviews
function renderInitialReviews() {
  const reviews = [
    { name: 'Duchess Genevieve', rating: 5, text: 'The 3D silk draping texture visualizer is unmatched in clarity. Exquisite experience.' },
    { name: 'Baroness Alexandra', rating: 5, text: 'Seamless checkout and real-time package logistics tracking updates. Exceptional luxury service.' }
  ];

  const container = document.getElementById('reviews-container');
  if (!container) return;

  reviews.forEach(r => appendReview(r.name, r.rating, r.text));
}

// Append Single Review
function appendReview(name, rating, text) {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  const card = document.createElement('div');
  card.className = 'bg-stone-950/80 border border-stone-800 rounded-xl p-4 space-y-2';

  const starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  card.innerHTML = `
    <div class="flex justify-between items-center">
      <span class="font-roman text-xs font-bold text-amber-200">I. ${name}</span>
      <span class="text-amber-400 text-sm tracking-wider">${starsHtml}</span>
    </div>
    <p class="font-roman text-xs text-stone-300 italic">"${text}"</p>
  `;

  container.prepend(card);
}

// Review Submission
function submitReview(event) {
  event.preventDefault();
  safeExecute(() => {
    const nameInput = document.getElementById('reviewer-name');
    const textInput = document.getElementById('reviewer-text');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
      showToast('Please complete all review fields.', 'error');
      return;
    }

    appendReview(name, state.selectedRating, text);
    showToast('Your testimonial has been published!');

    nameInput.value = '';
    textInput.value = '';
    setRating(5);
  }, 'Failed to submit review');
}