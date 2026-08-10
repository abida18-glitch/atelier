import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Sparkles, Camera, MapPin, CreditCard, 
  UserCheck, MessageSquare, Star, Video, Upload, Send,
  CheckCircle, Play, Image as ImageIcon, Search
} from 'lucide-react';

// --- DATASETS & DATA GENERATION ---
const FABRIC_TYPES = [
  'Satin', 'Silk', 'Lace', 'Velvet', 'Denim', 'Corduroy', 
  'Chiffon', 'Brocade', 'Organza', 'Tulle', 'Linen', 'Tweed', 
  'Leather', 'Synthetic Knits'
];

// Generate 100 dresses for the catalog
const DRESS_CATALOG = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Haute Couture Spec #${100 + i}`,
  fabric: FABRIC_TYPES[i % FABRIC_TYPES.length],
  price: (1200 + (i * 35)).toFixed(2),
  image: `https://images.unsplash.com/photo-${1515886657613 + (i % 5)}-9f3515b0c78f?auto=format&fit=crop&w=600&q=80`
}));

// Generate 1,000+ Fabric Options
const FABRIC_OPTIONS = Array.from({ length: 1050 }, (_, i) => ({
  id: `FAB-${i + 1}`,
  name: `Option ${i + 1}: ${FABRIC_TYPES[i % FABRIC_TYPES.length]} Grade-${(i % 5) + 1}`
}));

// Generate 10,000+ Sparkle / Sequin Options
const SPARKLE_OPTIONS = Array.from({ length: 10000 }, (_, i) => ({
  id: `SPK-${i + 1}`,
  name: `Accent #${i + 1}: Micro-Sequin ${['Rose Gold', 'Pearl', 'Emerald', 'Opal', 'Champagne'][i % 5]}`
}));

export default function FashionStudioApp() {
  const [activeTab, setActiveTab] = useState('dresses');
  const [notification, setNotification] = useState('');

  // Helper notification handler
  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] via-[#f7f3ec] to-[#e8dccf] text-[#2b2623] font-serif flex flex-col md:flex-row antialiased">
      
      {/* ==================== STICKY LEFT SIDEBAR NAVIGATION ==================== */}
      <aside className="w-full md:w-80 bg-[#fdfbf7]/90 backdrop-blur-md border-r border-[#d1c4b6]/50 md:h-screen md:sticky top-0 z-50 flex flex-col justify-between p-6">
        <div>
          {/* Header Title with Script Typography */}
          <div className="mb-8 border-b border-[#d1c4b6]/50 pb-4">
            <h1 className="font-['Great_Vibes',cursive] text-5xl text-[#3d2f26] drop-shadow-sm">
              Atelier Haute
            </h1>
            <p className="text-[10px] tracking-widest text-[#2c4434] uppercase mt-2 font-mono">
              I. 3D Studio & E-Commerce
            </p>
          </div>

          {/* Tab Navigation Menu */}
          <nav className="space-y-2">
            {[
              { id: 'dresses', label: 'Dresses Catalog', icon: ShoppingBag, num: 'I.' },
              { id: 'custom', label: 'Create Your Dress', icon: Sparkles, num: 'II.' },
              { id: 'camera', label: 'AI Camera Studio', icon: Camera, num: 'III.' },
              { id: 'tracker', label: 'Live Package Tracker', icon: MapPin, num: 'IV.' },
              { id: 'checkout', label: 'Boutique Checkout', icon: CreditCard, num: 'V.' },
              { id: 'designers', label: 'Designers Portfolio', icon: UserCheck, num: 'VI.' },
              { id: 'chat', label: 'Atelier Direct Chat', icon: MessageSquare, num: 'VII.' },
              { id: 'reviews', label: 'Designer Reviews', icon: Star, num: 'VIII.' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3d5a45] to-[#2c4434] text-white shadow-md'
                      : 'bg-white/60 border border-[#d1c4b6]/40 text-[#52463e] hover:bg-[#f0e8dd]'
                  }`}
                >
                  <span className={`text-xs font-bold ${isActive ? 'text-[#e6d7c3]' : 'text-[#3d5a45]'}`}>
                    {item.num}
                  </span>
                  <Icon className="w-4 h-4 opacity-80" />
                  <span className="font-['Great_Vibes',cursive] text-2xl leading-none pt-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-[#d1c4b6]/50 text-[10px] text-[#6e6259]">
          <p>SYSTEM STATUS: <span className="text-[#2c4434] font-bold">ONLINE</span></p>
          <p className="mt-1">MMXXVI © Atelier Haute Couture</p>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6 overflow-x-hidden">
        
        {/* Global Notification Banner */}
        {notification && (
          <div className="p-4 rounded-xl bg-[#2c4434] text-[#fdfbf7] border border-[#3d5a45] text-xs font-sans transition-all duration-300 shadow-md">
            {notification}
          </div>
        )}

        {/* SECTION I: DRESSES CATALOG */}
        {activeTab === 'dresses' && <DressesCatalogSection notify={notify} />}

        {/* SECTION II: CREATE YOUR OWN DRESS */}
        {activeTab === 'custom' && <CreateDressSection notify={notify} />}

        {/* SECTION III: AI CAMERA STUDIO */}
        {activeTab === 'camera' && <AICameraSection notify={notify} />}

        {/* SECTION IV: LIVE PACKAGE TRACKER */}
        {activeTab === 'tracker' && <LivePackageTrackerSection />}

        {/* SECTION V: BOUTIQUE CHECKOUT */}
        {activeTab === 'checkout' && <CheckoutSection notify={notify} />}

        {/* SECTION VI: DESIGNERS PORTFOLIO */}
        {activeTab === 'designers' && <DesignersSection notify={notify} />}

        {/* SECTION VII: COMMUNICATION / CHATBOT */}
        {activeTab === 'chat' && <ChatSection notify={notify} />}

        {/* SECTION VIII: DESIGNER REVIEWS */}
        {activeTab === 'reviews' && <ReviewsSection notify={notify} />}

      </main>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

// --- I. DRESSES CATALOG ---
function DressesCatalogSection({ notify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [fabricFilter, setFabricFilter] = useState('ALL');

  const filteredCatalog = DRESS_CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFabric = fabricFilter === 'ALL' || item.fabric === fabricFilter;
    return matchesSearch && matchesFabric;
  });

  return (
    <div className="space-y-6">
      <header className="border-b border-[#d1c4b6]/60 pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="font-['Great_Vibes',cursive] text-6xl text-[#3d2f26]">Couture Catalog</h2>
          <p className="text-xs text-[#6e6259] tracking-wider uppercase mt-1">
            I. Real-World Dress Options & Fabric Trends
          </p>
        </div>
        <div className="text-xs bg-white/80 px-4 py-2 rounded-lg border border-[#d1c4b6]/60 text-[#2b2623]">
          ACTIVE SELECTIONS: <span className="text-[#2c4434] font-bold">{filteredCatalog.length}</span>
        </div>
      </header>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-[#6e6259] mb-1 uppercase tracking-wide">Search Collection</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search dress styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 border border-[#d1c4b6] rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#3d5a45]"
            />
            <Search className="w-4 h-4 text-[#6e6259] absolute left-3 top-2.5" />
          </div>
        </div>
        <div>
          <label className="block text-[#6e6259] mb-1 uppercase tracking-wide">Filter Textile Variety</label>
          <select
            value={fabricFilter}
            onChange={(e) => setFabricFilter(e.target.value)}
            className="w-full bg-white/80 border border-[#d1c4b6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3d5a45]"
          >
            <option value="ALL">All Textiles ({FABRIC_TYPES.length} Types)</option>
            {FABRIC_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dress Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
        {filteredCatalog.slice(0, 24).map((item) => (
          <div
            key={item.id}
            className="bg-white/80 border border-[#d1c4b6]/60 rounded-xl overflow-hidden hover:border-[#3d5a45] transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="h-56 overflow-hidden bg-[#faf8f5] relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute top-2 right-2 text-[10px] bg-white/90 border border-[#d1c4b6] px-2 py-0.5 rounded text-[#2c4434] font-bold">
                {item.fabric}
              </span>
            </div>
            <div className="p-3 space-y-1">
              <h4 className="text-xs text-[#2b2623] truncate font-semibold">{item.name}</h4>
              <p className="text-xs text-[#3d2f26] font-bold">${item.price}</p>
              <button 
                onClick={() => notify(`Added ${item.name} to studio workspace.`)}
                className="w-full mt-2 bg-[#f0e8dd] hover:bg-[#3d5a45] hover:text-white text-[#2b2623] text-[10px] py-1.5 rounded transition-colors uppercase font-sans tracking-wider"
              >
                Select Design
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- II. CREATE YOUR OWN DRESS ---
function CreateDressSection({ notify }) {
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedSparkle, setSelectedSparkle] = useState('None');
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFabric || !deliveryDate) {
      notify('Error: Please complete all required configuration fields.');
      return;
    }
    notify(`Bespoke design created! Guaranteed target delivery by: ${deliveryDate}`);
  };

  return (
    <div className="space-y-6 text-xs">
      <header className="border-b border-[#d1c4b6]/60 pb-4">
        <h2 className="font-['Great_Vibes',cursive] text-6xl text-[#3d2f26]">Create Your Dress</h2>
        <p className="text-xs text-[#6e6259] tracking-wider uppercase mt-1">
          II. Configure 1,000+ Textiles, 10,000+ Accents & Target Delivery
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-6 shadow-sm">
        
        {/* Required Fabric Selection (1000+) */}
        <div className="space-y-2">
          <label className="block text-[#3d2f26] font-bold uppercase tracking-wider">
            I. Required Fabric Selection (1,000+ Available Options) *
          </label>
          <select
            value={selectedFabric}
            onChange={(e) => setSelectedFabric(e.target.value)}
            required
            className="w-full bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-3 text-sm text-[#2b2623] focus:outline-none focus:border-[#3d5a45]"
          >
            <option value="">-- Select Required Fabric from Fashion Trend Dataset --</option>
            {FABRIC_OPTIONS.slice(0, 100).map((fab) => (
              <option key={fab.id} value={fab.id}>{fab.name}</option>
            ))}
          </select>
          <p className="text-[10px] text-[#6e6259]">Showing top available textile variants from dataset.</p>
        </div>

        {/* Optional Sparkles Selection (10000+) */}
        <div className="space-y-2">
          <label className="block text-[#3d2f26] font-bold uppercase tracking-wider">
            II. Sparkles & Sequins Accent (10,000+ Options - Optional)
          </label>
          <select
            value={selectedSparkle}
            onChange={(e) => setSelectedSparkle(e.target.value)}
            className="w-full bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-3 text-sm text-[#2b2623] focus:outline-none focus:border-[#3d5a45]"
          >
            <option value="None">None (Classic Matte Finish)</option>
            {SPARKLE_OPTIONS.slice(0, 100).map((spk) => (
              <option key={spk.id} value={spk.id}>{spk.name}</option>
            ))}
          </select>
        </div>

        {/* Required Delivery Date */}
        <div className="space-y-2">
          <label className="block text-[#3d2f26] font-bold uppercase tracking-wider">
            III. Target Delivery Date *
          </label>
          <input
            type="date"
            required
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-3 text-sm text-[#2b2623] focus:outline-none focus:border-[#3d5a45]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#2c4434] hover:bg-[#3d5a45] text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow"
        >
          Save Custom Design Specifications
        </button>
      </form>
    </div>
  );
}

// --- III. AI CAMERA STUDIO ---
function AICameraSection({ notify }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [sizeDetected, setSizeDetected] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        notify('Live AI camera feed online.');
      }
    } catch (err) {
      notify('Camera access denied or unequipped.');
    }
  };

  const processSize = () => {
    notify('Analyzing spatial points for sizing...');
    setTimeout(() => {
      setSizeDetected('EU 38 / US M (Waist: 68cm, Bust: 88cm)');
      notify('Body size detection complete.');
    }, 1500);
  };

  const takeSnapshot = () => {
    setSnapshots([...snapshots, `Snapshot #${snapshots.length + 1}`]);
    notify('Design snapshot captured to studio workspace.');
  };

  return (
    <div className="space-y-6 text-xs">
      <header className="border-b border-[#d1c4b6]/60 pb-4">
        <h2 className="font-['Great_Vibes',cursive] text-6xl text-[#3d2f26]">AI Camera Studio</h2>
        <p className="text-xs text-[#6e6259] tracking-wider uppercase mt-1">
          III. Virtual Camera Controls, Size Processing & Snapshot Generation
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Viewport Box */}
        <div className="lg:col-span-2 bg-white/80 border border-[#d1c4b6]/60 rounded-2xl p-4 flex flex-col items-center shadow-sm">
          <div className="relative w-full h-80 bg-[#f7f3ec] rounded-xl overflow-hidden flex items-center justify-center border border-[#d1c4b6]">
            {cameraActive ? (
              <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-2 p-4">
                <Camera className="w-10 h-10 text-[#6e6259] mx-auto opacity-50" />
                <p className="text-[#6e6259]">Camera Inactive. Click 'Enable Camera' below.</p>
              </div>
            )}
            <span className="absolute top-3 left-3 text-[10px] bg-white/90 border border-[#d1c4b6] px-3 py-1 rounded-full text-[#2c4434] font-bold">
              {cameraActive ? 'FEED: LIVE' : 'FEED: STANDBY'}
            </span>
          </div>

          {/* Camera Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-4">
            <button
              onClick={startCamera}
              className="py-2.5 px-3 bg-[#faf8f5] border border-[#d1c4b6] hover:border-[#3d5a45] rounded-lg transition-all text-center font-sans font-medium"
            >
              I. Enable Camera
            </button>
            <button
              onClick={takeSnapshot}
              className="py-2.5 px-3 bg-[#faf8f5] border border-[#d1c4b6] hover:border-[#3d5a45] rounded-lg transition-all text-center font-sans font-medium"
            >
              II. Take Snapshot
            </button>
            <button
              onClick={() => notify('AI image variant generated.')}
              className="py-2.5 px-3 bg-[#faf8f5] border border-[#d1c4b6] hover:border-[#3d5a45] rounded-lg transition-all text-center font-sans font-medium"
            >
              III. AI Look Gen
            </button>
            <button
              onClick={processSize}
              className="py-2.5 px-3 bg-[#2c4434] text-white hover:bg-[#3d5a45] rounded-lg transition-all text-center font-sans font-medium"
            >
              IV. Process Size
            </button>
          </div>
        </div>

        {/* Side Info Cards */}
        <div className="space-y-6">
          <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-3 shadow-sm">
            <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#3d2f26]">Fit Detection</h3>
            <p className="text-[#6e6259]">AUTOMATED MEASUREMENT RESULT:</p>
            <div className="p-3 bg-[#faf8f5] border border-[#d1c4b6] rounded-lg text-[#2c4434] font-bold text-center">
              {sizeDetected || 'READY FOR CAMERA SCAN'}
            </div>
            <button
              onClick={() => setShowTutorial(true)}
              className="w-full bg-[#f0e8dd] hover:bg-[#d1c4b6] text-[#2b2623] py-2 rounded-lg transition-all font-sans text-xs"
            >
              Watch Measurement Tutorial
            </button>
          </div>

          <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-3 shadow-sm">
            <h4 className="text-[#3d2f26] uppercase font-bold tracking-wider">Captured Snapshots</h4>
            <div className="min-h-[80px] border border-dashed border-[#d1c4b6] rounded-lg p-2 flex flex-wrap gap-2 items-center justify-center text-[#6e6259]">
              {snapshots.length === 0 ? (
                'No snapshots stored.'
              ) : (
                snapshots.map((s, idx) => (
                  <span key={idx} className="bg-[#f0e8dd] px-2 py-1 rounded text-[10px] border border-[#d1c4b6]">
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fdfbf7] border border-[#d1c4b6] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#d1c4b6] pb-2">
              <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#3d2f26]">Measurement Tutorial</h3>
              <button onClick={() => setShowTutorial(false)} className="text-[#6e6259]">✕</button>
            </div>
            <div className="aspect-video bg-[#f0e8dd] rounded-lg flex items-center justify-center border border-[#d1c4b6]">
              <Play className="w-10 h-10 text-[#3d2f26] opacity-60" />
            </div>
            <div className="space-y-2 text-[#2b2623]">
              <p><strong>I. Bust:</strong> Wrap measurement tape under arms around fullest bust point.</p>
              <p><strong>II. Waist:</strong> Measure around narrowest natural waistline point.</p>
              <p><strong>III. Hips:</strong> Wrap tape around fullest hip curve area.</p>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full bg-[#2c4434] text-white py-2 rounded-xl font-sans"
            >
              Close Tutorial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- IV. LIVE PACKAGE TRACKER ---
function LivePackageTrackerSection() {
  return (
    <div className="space-y-6 text-xs">
      <header className="border-b border-[#d1c4b6]/60 pb-4">
        <h2 className="font-['Great_Vibes',cursive] text-6xl text-[#3d2f26]">Package Tracker</h2>
        <p className="text-xs text-[#6e6259] tracking-wider uppercase mt-1">
          IV. Real-Time Transit Map & Roman Milestone Status
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Visualization Simulation Panel */}
        <div className="lg:col-span-2 bg-white/80 border border-[#d1c4b6]/60 rounded-2xl p-4 h-96 flex flex-col items-center justify-center relative shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-[#f0e8dd]/40 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="w-12 h-12 text-[#2c4434] mx-auto animate-bounce" />
              <p className="font-bold text-[#3d2f26]">TRANSIT ROUTE ACTIVE: PARIS ATELIER ➔ NEW YORK</p>
              <p className="text-[10px] text-[#6e6259]">Current Lat/Long Coordinates: 48.8566° N, 2.3522° E</p>
            </div>
          </div>
        </div>

        {/* Milestone Timeline Panel */}
        <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#3d2f26]">Milestone Timeline</h3>
          <div className="space-y-6 border-l-2 border-[#d1c4b6] pl-4">
            <div className="relative">
              <span className="absolute -left-[23px] top-0 w-3 h-3 bg-[#2c4434] rounded-full" />
              <p className="font-bold text-[#2c4434]">MILESTONE I. FACTORY ASSEMBLY</p>
              <p className="text-[#6e6259]">Quality Inspection Passed in Tailoring Lab</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[23px] top-0 w-3 h-3 bg-[#2c4434] rounded-full" />
              <p className="font-bold text-[#2c4434]">MILESTONE II. CUSTOMS CLEARANCE</p>
              <p className="text-[#6e6259]">Export Manifests Processed</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[23px] top-0 w-3 h-3 bg-[#3d2f26] rounded-full animate-ping" />
              <p className="font-bold text-[#3d2f26]">MILESTONE III. IN TRANSIT</p>
              <p className="text-[#6e6259]">Regional Logistics Express Active</p>
            </div>
            <div className="relative opacity-50">
              <span class="absolute -left-[23px] top-0 w-3 h-3 bg-[#d1c4b6] rounded-full" />
              <p className="font-bold text-[#6e6259]">MILESTONE IV. FINAL DELIVERY</p>
              <p className="text-[#6e6259]">Scheduled Arrival Expected Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- V. BOUTIQUE CHECKOUT ---
function CheckoutSection({ notify }) {
  const [authMethod, setAuthMethod] = useState('guest');
  const [coupon, setCoupon] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    notify('Checkout successful! Order confirmed.');
  };

  return (
    <div className="space-y-6 text-xs">
      <header className="border-b border-[#d1c4b6]/60 pb-4">
        <h2 className="font-['Great_Vibes',cursive] text-6xl text-[#3d2f26]">Boutique Checkout</h2>
        <p class="text-xs text-[#6e6259] tracking-wider uppercase mt-1">
          V. Registration Options, Contact Details & Express Payment
        </p>
      </header>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Options */}
          <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-3 shadow-sm">
            <h3 className="text-[#3d2f26] uppercase tracking-wider font-bold">I. Account Options</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['google', 'email', 'phone', 'guest'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAuthMethod(m)}
                  className={`py-2 px-3 rounded-lg border capitalize font-sans ${
                    authMethod === m
                      ? 'bg-[#2c4434] text-white border-[#2c4434]'
                      : 'bg-[#faf8f5] border-[#d1c4b6] text-[#2b2623]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-[#3d2f26] uppercase tracking-wider font-bold">II. Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#6e6259] mb-1">First Name *</label>
                <input required type="text" className="w-full bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-2.5 focus:outline-none focus:border-[#3d5a45]" />
              </div>
              <div>
                <label className="block text-[#6e6259] mb-1">Last Name *</label>
                <input required type="text" className="w-full bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-2.5 focus:outline-none focus:border-[#3d5a45]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#6e6259] mb-1">Email or Phone Number *</label>
                <input required type="text" className="w-full bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-2.5 focus:outline-none focus:border-[#3d5a45]" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-3 shadow-sm">
            <h3 className="text-[#3d2f26] uppercase tracking-wider font-bold">III. Payment Methods</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Credit Card', 'Debit Card', 'Cash App', 'Venmo'].map((pay, i) => (
                <label key={pay} className="border border-[#d1c4b6] p-3 rounded-xl flex items-center space-x-2 cursor-pointer bg-[#faf8f5]">
                  <input type="radio" name="payment" defaultChecked={i === 0} className="accent-[#2c4434]" />
                  <span className="font-sans font-medium">{pay}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Side Card */}
        <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-6 h-fit shadow-sm">
          <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#3d2f26]">Order Summary</h3>
          <div className="space-y-2 border-b border-[#d1c4b6] pb-4">
            <div className="flex justify-between">
              <span>Bespoke Dress Spec</span>
              <span className="font-bold">$2,400.00</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[#6e6259]">Coupon Discount Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ATELIER2026"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-2 uppercase"
              />
              <button
                type="button"
                onClick={() => {
                  if (coupon.toUpperCase() === 'ATELIER2026') {
                    setDiscountApplied(true);
                    notify('Coupon code applied!');
                  } else {
                    notify('Invalid coupon code.');
                  }
                }}
                className="bg-[#f0e8dd] hover:bg-[#d1c4b6] text-[#2b2623] px-3 py-2 rounded-lg font-sans"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#d1c4b6] pt-4 text-sm">
            <div className="flex justify-between text-[#6e6259]">
              <span>Subtotal</span>
              <span>$2,400.00</span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-[#2c4434]">
                <span>Discount (20%)</span>
                <span>-$480.00</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-[#3d2f26] border-t border-[#d1c4b6] pt-2">
              <span>Total</span>
              <span>${discountApplied ? '1,920.00' : '2,400.00'}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2c4434] hover:bg-[#3d5a45] text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all"
          >
            Proceed to Checkout
          </button>
        </div>
      </form>
    </div>
  );
}

// --- VI. DESIGNERS PORTFOLIO ---
function DesignersSection({ notify }) {
  const [category, setCategory] = useState('posts');

  return (
    <div className="space-y-6 text-xs">
      <header className="border-b border-[#d1c4b6]/60 pb-4 flex justify-between items-end">
        <div>
          <h2 className="font-['Great_Vibes',cursive] text-6xl text-[#3d2f26]">Designer Portfolio</h2>
          <p className="text-xs text-[#6e6259] tracking-wider uppercase mt-1">
            VI. Custom Profiles, Multi-Category Archives & Live Broadcasting
          </p>
        </div>
        <button
          onClick={() => notify('Live Stream broadcast initiated for followers.')}
          className="bg-[#2c4434] hover:bg-[#3d5a45] text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all font-sans"
        >
          <Video className="w-4 h-4" />
          <span>GO LIVE STREAM</span>
        </button>
      </header>

      {/* Profile Header */}
      <div className="bg-white/80 border border-[#d1c4b6]/60 rounded-2xl p-6 relative overflow-hidden space-y-4 shadow-sm">
        <div className="h-32 rounded-xl bg-gradient-to-r from-[#e8dccf] to-[#f0e8dd] border border-[#d1c4b6] flex items-end p-4 justify-between">
          <label className="bg-white/90 border border-[#d1c4b6] px-3 py-1 rounded-lg cursor-pointer hover:bg-[#f0e8dd] transition-all font-sans">
            Add Background Photo
            <input type="file" className="hidden" onChange={() => notify('Background updated.')} />
          </label>
        </div>
        <div className="flex items-center space-x-4 -mt-10 px-4">
          <div className="w-20 h-20 rounded-full border-2 border-[#2c4434] overflow-hidden bg-white shadow-md">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#3d2f26]">Atelier Lead Master Tailor</h3>
            <p className="text-[#6e6259]">Haute Couture Pattern Specialist & Designer</p>
          </div>
        </div>
      </div>

      {/* Category Tabs & Grid */}
      <div className="space-y-4">
        <div className="flex border-b border-[#d1c4b6] space-x-6">
          {['posts', 'reels', 'tagged'].map((cat, idx) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`pb-2 uppercase font-bold tracking-wider ${
                category === cat
                  ? 'border-b-2 border-[#2c4434] text-[#2c4434]'
                  : 'text-[#6e6259]'
              }`}
            >
              {idx + 1}) {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[#f0e8dd] rounded-lg border border-[#d1c4b6] overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80`}
                alt="Portfolio Item"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- VII. ATELIER DIRECT CHAT ---
function ChatSection({ notify }) {
  const [messages, setMessages] = useState([
    { sender: 'Tailor', text: 'Welcome to Atelier Direct Messaging. How can we refine your design order?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([...messages, { sender: 'Client', text: inputMsg }]);
    setInputMsg('');
  };

  return (
    <div className="space-y-6 text-xs">
      <header className="border-b border-[#d1c4b6]/60 pb-4">
        <h2 className="font-['Great_Vibes',cursive] text-6xl text-[#3d2f26]">Atelier Direct Chat</h2>
        <p className="text-xs text-[#6e6259] tracking-wider uppercase mt-1">
          VII. FaceTime Consultation, Direct Messaging & File Attachments
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/80 border border-[#d1c4b6]/60 rounded-2xl p-6 flex flex-col h-96 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#d1c4b6] pb-3 mb-3">
            <span className="font-bold text-[#2b2623]">Connection: Master Tailor Desk</span>
            <div className="space-x-2 font-sans">
              <button
                onClick={() => notify('Initiating FaceTime Video Stream...')}
                className="bg-[#2c4434] text-white px-3 py-1 rounded-lg text-[10px]"
              >
                FaceTime
              </button>
              <button
                onClick={() => notify('Calling Master Tailor...')}
                className="bg-[#f0e8dd] text-[#2b2623] px-3 py-1 rounded-lg text-[10px]"
              >
                Voice Call
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-xs ${
                  m.sender === 'Client'
                    ? 'ml-auto bg-[#2c4434] text-white'
                    : 'bg-[#f0e8dd] text-[#2b2623]'
                }`}
              >
                <p>{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-[#d1c4b6]">
            <input
              type="text"
              placeholder="Type message or file details..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-[#faf8f5] border border-[#d1c4b6] rounded-lg px-3 py-2 text-xs focus:outline-none"
            />
            <button type="submit" className="bg-[#2c4434] text-white px-4 py-2 rounded-lg font-sans">
              Send
            </button>
          </form>
        </div>

        <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-[#3d2f26] uppercase font-bold tracking-wider">Order Status</h3>
          <div className="p-3 bg-[#faf8f5] rounded-lg border border-[#d1c4b6] space-y-1">
            <p><strong>Order Ref:</strong> #ATH-2026-99</p>
            <p><strong>Stage:</strong> Silk Cutting & Trimming</p>
          </div>
          <button
            onClick={() => notify('Order update request dispatched.')}
            className="w-full bg-[#f0e8dd] hover:bg-[#d1c4b6] text-[#2b2623] py-2 rounded-lg font-sans"
          >
            Request Rapid Update
          </button>
        </div>
      </div>
    </div>
  );
}

// --- VIII. DESIGNER REVIEWS ---
function ReviewsSection({ notify }) {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([
    { name: 'Duchess de Rose', rating: 5, text: 'The tailored fit from the AI measurement scan was immaculate.' },
    { name: 'Baroness Clara', rating: 4, text: 'Extensive choice of 1000+ fabrics. Delivered on target date.' }
  ]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      notify('Error: Please click to select a star score.');
      return;
    }
    setReviews([{ name: author, rating, text }, ...reviews]);
    setAuthor('');
    setText('');
    setRating(0);
    notify('Review published to dashboard.');
  };

  return (
    <div className="space-y-6 text-xs">
      <header className="border-b border-[#d1c4b6]/60 pb-4">
        <h2 className="font-['Great_Vibes',cursive] text-6xl text-[#3d2f26]">Designer Reviews</h2>
        <p className="text-xs text-[#6e6259] tracking-wider uppercase mt-1">
          VIII. Dynamic Star Tally Component & Dashboard Feedback Form
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit Form */}
        <div className="bg-white/80 border border-[#d1c4b6]/60 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-['Great_Vibes',cursive] text-4xl text-[#3d2f26]">Submit Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#6e6259] mb-1">I. Client Name *</label>
              <input
                required
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-2.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#6e6259] mb-1">II. Star Rating *</label>
              <div className="flex space-x-1 text-2xl text-[#d1c4b6] cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={star <= rating ? 'text-[#3d2f26]' : ''}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[#6e6259] mb-1">III. Client Critique *</label>
              <textarea
                required
                rows="3"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#d1c4b6] rounded-lg p-2.5 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2c4434] hover:bg-[#3d5a45] text-white font-bold py-3 rounded-xl uppercase tracking-wider font-sans"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Live Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[#3d2f26] uppercase tracking-wider font-bold">IV. Live Review Feed</h3>
          <div className="space-y-3">
            {reviews.map((r, idx) => (
              <div key={idx} className="bg-white/80 border border-[#d1c4b6]/60 p-4 rounded-xl space-y-1 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#2b2623]">{r.name}</span>
                  <span className="text-[#3d2f26]">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-[#6e6259] italic">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}