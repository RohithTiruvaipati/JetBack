import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plane, Clock, AlertTriangle, Hotel, Bell, Search, ChevronRight,
  CheckCircle2, Star, MapPin, MessageSquare, Send, ArrowRight,
  ArrowUpDown, DollarSign, Timer, X, Plus, Bookmark, BookmarkCheck,
  Shield, Scale, Banknote, Luggage, Globe, Users, BellRing, Info,
  ChevronDown, ChevronUp, User, Loader2, Phone, BellDot, CreditCard,
  PlaneTakeoff, PlaneLanding, CircleDot, Zap
} from 'lucide-react';

// ─── MOCK DATA ───────────────────────────────────────────────
const FLIGHTS_DB = {
  'AA1234': {
    id: 'AA1234', airline: 'American Airlines', from: 'DFW', to: 'LAX',
    fromFull: 'Dallas/Fort Worth', toFull: 'Los Angeles',
    departs: '3:45 PM', arrives: '5:10 PM', gate: 'B22', terminal: 'B',
    status: 'DELAYED', delayMin: 90, newDeparts: '5:15 PM', newArrives: '6:40 PM',
    compensation: '$150 meal voucher', compAmount: 150,
    updates: [
      { time: '2:30 PM', msg: 'Flight delayed due to weather in Dallas area.' },
      { time: '2:45 PM', msg: 'New estimated departure: 5:15 PM.' },
      { time: '3:00 PM', msg: 'Gate changed from B20 to B22.' },
      { time: '3:15 PM', msg: 'Meal vouchers available at gate B22 desk.' },
    ]
  },
  'UA456': {
    id: 'UA456', airline: 'United Airlines', from: 'DFW', to: 'ORD',
    fromFull: 'Dallas/Fort Worth', toFull: 'Chicago O\'Hare',
    departs: '6:00 PM', arrives: '9:15 PM', gate: 'C14', terminal: 'C',
    status: 'ON TIME', delayMin: 0,
    updates: [
      { time: '5:00 PM', msg: 'Boarding begins at 5:30 PM.' },
      { time: '5:15 PM', msg: 'On-time departure confirmed.' },
    ]
  },
  'DL789': {
    id: 'DL789', airline: 'Delta Air Lines', from: 'DFW', to: 'JFK',
    fromFull: 'Dallas/Fort Worth', toFull: 'New York JFK',
    departs: '8:30 AM', arrives: '2:45 PM', gate: '—', terminal: 'E',
    status: 'CANCELLED', delayMin: 0,
    compensation: 'Full refund + $200 travel credit',
    compAmount: 200,
    updates: [
      { time: '7:00 AM', msg: 'Flight cancelled due to mechanical issue.' },
      { time: '7:15 AM', msg: 'Rebooking assistance available at gate E12.' },
      { time: '7:30 AM', msg: 'Hotel vouchers being issued for overnight passengers.' },
    ]
  }
};

const REBOOK_OPTIONS = [
  { id: 'AA1250', airline: 'American Airlines', from: 'DFW', to: 'LAX', departs: '5:30 PM', arrives: '7:05 PM', price: 0, duration: '3h 35m', stops: 0 },
  { id: 'AA1302', airline: 'American Airlines', from: 'DFW', to: 'LAX', departs: '7:45 PM', arrives: '9:20 PM', price: 0, duration: '3h 35m', stops: 0 },
  { id: 'UA890', airline: 'United Airlines', from: 'DFW', to: 'LAX', departs: '6:15 PM', arrives: '8:00 PM', price: 45, duration: '3h 45m', stops: 0 },
  { id: 'SW234', airline: 'Southwest Airlines', from: 'DFW', to: 'LAX', departs: '9:00 PM', arrives: '11:30 PM', price: 25, duration: '4h 30m', stops: 1 },
];

const HOTELS = [
  { id: 1, name: 'Hyatt Regency DFW', distance: '0.2 mi', price: 189, stars: 4.5, amenities: ['Pool', 'Gym', 'Restaurant'] },
  { id: 2, name: 'Marriott DFW Airport', distance: '0.4 mi', price: 165, stars: 4.2, amenities: ['Gym', 'Bar', 'Shuttle'] },
  { id: 3, name: 'Hilton Garden Inn', distance: '0.8 mi', price: 129, stars: 4.0, amenities: ['Pool', 'Breakfast', 'Shuttle'] },
  { id: 4, name: 'La Quinta by Wyndham', distance: '1.2 mi', price: 89, stars: 3.5, amenities: ['Breakfast', 'Parking', 'WiFi'] },
];

const RIGHTS = [
  { icon: Banknote, title: 'Compensation for Delays', desc: 'For delays over 3 hours on domestic flights, airlines must provide meal vouchers and rebooking. EU-origin flights may qualify for up to €600.', titleEs: 'Compensación por Retrasos', descEs: 'Para retrasos de más de 3 horas en vuelos nacionales, las aerolíneas deben ofrecer cupones de comida y opciones de cambio.' },
  { icon: CreditCard, title: 'Refund Rights', desc: 'If your flight is cancelled, you are entitled to a full refund to the original payment method within 7 business days.', titleEs: 'Derechos de Reembolso', descEs: 'Si su vuelo es cancelado, tiene derecho a un reembolso completo en 7 días hábiles.' },
  { icon: Hotel, title: 'Overnight Accommodations', desc: 'For overnight delays caused by the airline, carriers must provide hotel accommodations and ground transportation.', titleEs: 'Alojamiento Nocturno', descEs: 'Para retrasos nocturnos causados por la aerolínea, deben proporcionar alojamiento en hotel.' },
  { icon: Luggage, title: 'Baggage Delays', desc: 'Airlines must compensate for reasonable expenses if your baggage is delayed. File a claim within 21 days.', titleEs: 'Retraso de Equipaje', descEs: 'Las aerolíneas deben compensar gastos razonables si su equipaje se retrasa.' },
  { icon: Shield, title: 'Tarmac Delay Protection', desc: 'Airlines cannot keep you on the tarmac for more than 3 hours (domestic) or 4 hours (international) without offering to deplane.', titleEs: 'Protección por Retraso en Pista', descEs: 'Las aerolíneas no pueden mantenerlo en la pista más de 3 horas sin ofrecer desembarcar.' },
  { icon: Scale, title: 'Involuntary Bumping', desc: 'If bumped involuntarily, you may be entitled to 200-400% of your one-way fare, up to $1,550.', titleEs: 'Denegación de Embarque', descEs: 'Si le niegan el embarque involuntariamente, puede recibir 200-400% de su tarifa.' },
];

const CHAT_RESPONSES = {
  delay: "Your flight AA1234 is currently delayed by 90 minutes due to weather conditions in the Dallas area. The new estimated departure is 5:15 PM. You're eligible for a $150 meal voucher — I can help you claim that right away.",
  rebook: "I can help you rebook! There are 4 alternative flights available today:\n\n• AA1250 at 5:30 PM (no change fee)\n• AA1302 at 7:45 PM (no change fee)\n• UA890 at 6:15 PM ($45 upgrade)\n• SW234 at 9:00 PM ($25, 1 stop)\n\nWould you like me to book one of these?",
  hotel: "Here are hotels near DFW Airport:\n\n🏨 Hyatt Regency — $189/night (0.2 mi)\n🏨 Marriott DFW — $165/night (0.4 mi)\n🏨 Hilton Garden Inn — $129/night (0.8 mi)\n\nYour meal voucher can be applied toward a hotel stay. Want me to book one?",
  compensation: "Based on DOT regulations, you're entitled to:\n\n✅ Full meal voucher ($150) for delays over 2 hours\n✅ Rebooking on the next available flight at no cost\n✅ If overnight: hotel accommodation + ground transport\n✅ You can also request a full refund if you choose not to fly\n\nWould you like me to file a compensation claim?",
  default: "I'd be happy to help! I can assist with:\n\n• Checking flight delay status\n• Rebooking your flight\n• Finding nearby hotels\n• Understanding your compensation rights\n\nWhat would you like to know?"
};

const LABELS = {
  en: {
    search: 'Search flights', home: 'Home', rebook: 'Rebook', hotels: 'Hotels', chat: 'Chat', myFlights: 'My Flights',
    flightNumber: 'Flight Number', searchBtn: 'Search', saveFlight: 'Save Flight', saved: 'Saved',
    notifications: 'Notifications', liveUpdates: 'Live Updates', rebookFlight: 'Rebook Flight',
    selectConfirm: 'Select & Confirm', bookVoucher: 'Book with Voucher', knowRights: 'Know Your Rights',
    delayed: 'DELAYED', onTime: 'ON TIME', cancelled: 'CANCELLED', departure: 'Departure', arrival: 'Arrival',
    gate: 'Gate', terminal: 'Terminal', compensation: 'Compensation', status: 'Status',
    connectHuman: 'Connect to Human Agent', estWait: 'Est. wait: 8 min', typeMessage: 'Type a message...',
    quickAdd: 'Quick Add', demoMode: 'Demo Mode', forceDelay: 'Force Status Change',
    language: 'Language', priceRange: 'Price Range', sortBy: 'Sort by', price: 'Price',
    duration: 'Duration', departureTime: 'Departure Time', perNight: '/night',
    jointVoucher: 'Joint Voucher (Group/Family)', voucherBalance: 'Remaining voucher balance',
    bankNote: 'Unused funds will be deposited to your bank account',
    greeting: 'Hi Alex! 👋 I\'m JetBack AI. How can I help you today?',
    passengerRights: 'Passenger Rights & Protections',
  },
  es: {
    search: 'Buscar vuelos', home: 'Inicio', rebook: 'Cambiar', hotels: 'Hoteles', chat: 'Chat', myFlights: 'Mis Vuelos',
    flightNumber: 'Número de Vuelo', searchBtn: 'Buscar', saveFlight: 'Guardar Vuelo', saved: 'Guardado',
    notifications: 'Notificaciones', liveUpdates: 'Actualizaciones', rebookFlight: 'Cambiar Vuelo',
    selectConfirm: 'Seleccionar', bookVoucher: 'Reservar con Cupón', knowRights: 'Tus Derechos',
    delayed: 'RETRASADO', onTime: 'A TIEMPO', cancelled: 'CANCELADO', departure: 'Salida', arrival: 'Llegada',
    gate: 'Puerta', terminal: 'Terminal', compensation: 'Compensación', status: 'Estado',
    connectHuman: 'Hablar con Agente', estWait: 'Espera: 8 min', typeMessage: 'Escribe un mensaje...',
    quickAdd: 'Agregar', demoMode: 'Demo', forceDelay: 'Simular Cambio',
    language: 'Idioma', priceRange: 'Rango de Precio', sortBy: 'Ordenar por', price: 'Precio',
    duration: 'Duración', departureTime: 'Hora de Salida', perNight: '/noche',
    jointVoucher: 'Cupón Conjunto (Grupo/Familia)', voucherBalance: 'Saldo restante del cupón',
    bankNote: 'Los fondos no utilizados se depositarán en su cuenta',
    greeting: '¡Hola Alex! 👋 Soy JetBack AI. ¿Cómo puedo ayudarte?',
    passengerRights: 'Derechos del Pasajero',
  }
};

// ─── UTILITY COMPONENTS ──────────────────────────────────────

function StatusBadge({ status, lang }) {
  const l = LABELS[lang];
  const cfg = {
    'ON TIME': { bg: 'bg-jet-green-light', text: 'text-jet-green', border: 'border-jet-green/20', label: l.onTime, icon: CheckCircle2 },
    'DELAYED': { bg: 'bg-jet-amber-light', text: 'text-amber-700', border: 'border-amber-300/40', label: l.delayed, icon: Clock },
    'CANCELLED': { bg: 'bg-jet-red-light', text: 'text-jet-red', border: 'border-jet-red/20', label: l.cancelled, icon: AlertTriangle },
  };
  const c = cfg[status] || cfg['ON TIME'];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${c.bg} ${c.text} ${c.border}`}>
      <Icon size={12} /> {c.label}
    </span>
  );
}

function Toast({ message, visible, onClose }) {
  if (!visible) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-jet-navy text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm">
        <CheckCircle2 size={20} className="text-green-400 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:bg-white/10 rounded-full p-0.5">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function NotificationBanner({ message, visible, type = 'info' }) {
  if (!visible) return null;
  const colors = type === 'warning'
    ? 'bg-amber-50 border-amber-300 text-amber-800'
    : 'bg-jet-blue-light border-jet-blue/30 text-jet-blue-dark';
  return (
    <div className={`mx-4 mb-3 p-3 rounded-xl border ${colors} flex items-center gap-2 text-sm font-medium animate-slide-down`}>
      <BellRing size={16} className="shrink-0" />
      {message}
    </div>
  );
}

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-4">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
            ${i <= current ? 'bg-jet-blue text-white' : 'bg-jet-gray-200 text-jet-gray-500'}`}>
            {i < current ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 transition-all duration-300 ${i < current ? 'bg-jet-blue' : 'bg-jet-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFlight, setActiveFlight] = useState(null);
  const [savedFlights, setSavedFlights] = useState([]);
  const [notifEnabled, setNotifEnabled] = useState({});
  const [showUpdates, setShowUpdates] = useState(false);
  const [showRights, setShowRights] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'info' });
  const [statusOverrides, setStatusOverrides] = useState({});
  const [hasNotifBadge, setHasNotifBadge] = useState(false);

  // Rebook state
  const [rebookStep, setRebookStep] = useState(0);
  const [rebookSort, setRebookSort] = useState('price');
  const [selectedRebook, setSelectedRebook] = useState(null);

  // Hotel state
  const [priceRange, setPriceRange] = useState(250);
  const [hotelBooking, setHotelBooking] = useState(null);
  const [jointVoucher, setJointVoucher] = useState(false);
  const [hotelStep, setHotelStep] = useState(0);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Quick add
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddInput, setQuickAddInput] = useState('');

  const l = LABELS[lang];

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }, []);

  const showNotif = useCallback((message, type = 'info') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification({ visible: false, message: '', type: 'info' }), 5000);
  }, []);

  // Init chat
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{ role: 'bot', text: l.greeting, time: 'Now' }]);
    }
  }, []);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getFlightStatus = (id) => statusOverrides[id] || FLIGHTS_DB[id]?.status || 'ON TIME';

  const handleSearch = (e) => {
    e.preventDefault();
    const key = searchQuery.toUpperCase().replace(/\s/g, '');
    if (FLIGHTS_DB[key]) {
      setActiveFlight(key);
    } else {
      showToast('Flight not found. Try AA1234, UA456, or DL789.');
    }
  };

  const handleSaveFlight = (id) => {
    if (!savedFlights.includes(id)) {
      setSavedFlights(prev => [...prev, id]);
      showToast(`${id} saved to My Flights`);
    }
  };

  const handleForceDelay = () => {
    const flightId = 'UA456';
    setStatusOverrides(prev => ({
      ...prev,
      [flightId]: prev[flightId] === 'DELAYED' ? 'ON TIME' : 'DELAYED'
    }));
    const newStatus = statusOverrides[flightId] === 'DELAYED' ? 'ON TIME' : 'DELAYED';
    showNotif(`⚠️ UA456 status changed to ${newStatus}`, 'warning');
    if (savedFlights.includes(flightId)) {
      setHasNotifBadge(true);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, time: 'Now' }]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = CHAT_RESPONSES.default;
      if (lower.includes('delay') || lower.includes('late') || lower.includes('status')) response = CHAT_RESPONSES.delay;
      else if (lower.includes('rebook') || lower.includes('change') || lower.includes('alternative')) response = CHAT_RESPONSES.rebook;
      else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('sleep')) response = CHAT_RESPONSES.hotel;
      else if (lower.includes('compensation') || lower.includes('rights') || lower.includes('refund') || lower.includes('money')) response = CHAT_RESPONSES.compensation;

      setChatTyping(false);
      setChatMessages(prev => [...prev, { role: 'bot', text: response, time: 'Now' }]);
    }, 1500);
  };

  const sortedRebookOptions = [...REBOOK_OPTIONS].sort((a, b) => {
    if (rebookSort === 'price') return a.price - b.price;
    if (rebookSort === 'duration') return a.duration.localeCompare(b.duration);
    if (rebookSort === 'departs') return a.departs.localeCompare(b.departs);
    return 0;
  });

  const filteredHotels = HOTELS.filter(h => h.price <= priceRange);

  // ─── RENDER SCREENS ─────────────────────────────────────────

  const renderHome = () => {
    const flight = activeFlight ? FLIGHTS_DB[activeFlight] : null;
    const currentStatus = flight ? getFlightStatus(flight.id) : null;
    const isDisrupted = currentStatus === 'DELAYED' || currentStatus === 'CANCELLED';

    return (
      <div className="pb-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="px-4 mb-5">
          <label className="text-sm font-semibold text-jet-gray-700 mb-1.5 block">{l.flightNumber}</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jet-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. AA1234"
                className="w-full pl-10 pr-4 py-3 bg-white border border-jet-gray-200 rounded-xl text-sm font-medium
                  placeholder:text-jet-gray-400 focus:outline-none focus:ring-2 focus:ring-jet-blue/30 focus:border-jet-blue
                  transition-all"
                id="flight-search-input"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-jet-blue text-white rounded-xl text-sm font-bold hover:bg-jet-blue-dark
                active:scale-95 transition-all shadow-sm"
              id="flight-search-btn"
            >
              {l.searchBtn}
            </button>
          </div>
        </form>

        {/* Flight Card */}
        {flight && (
          <div className="px-4 space-y-3 animate-fade-in">
            {/* Status Banner for disruptions */}
            {isDisrupted && (
              <div className={`p-4 rounded-2xl border ${currentStatus === 'CANCELLED'
                ? 'bg-red-50 border-red-200'
                : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={22} className={currentStatus === 'CANCELLED' ? 'text-jet-red' : 'text-amber-600'} />
                  <div className="flex-1">
                    <div className="font-bold text-lg">
                      {currentStatus === 'CANCELLED' ? 'Flight Cancelled' : `Delayed ${flight.delayMin} Minutes`}
                    </div>
                    <div className="text-sm mt-1 opacity-80">
                      {currentStatus === 'CANCELLED'
                        ? 'This flight has been cancelled. You are entitled to a full refund or rebooking.'
                        : `New departure: ${flight.newDeparts} • Arrival: ${flight.newArrives}`
                      }
                    </div>
                    {flight.compensation && (
                      <div className="flex items-center gap-2 mt-2 bg-white/60 rounded-lg px-3 py-2">
                        <DollarSign size={16} className="text-jet-green" />
                        <span className="text-sm font-semibold">{l.compensation}: {flight.compensation}</span>
                      </div>
                    )}
                    <button
                      onClick={() => { setActiveTab('rebook'); setRebookStep(0); setSelectedRebook(null); }}
                      className="mt-3 w-full py-2.5 bg-jet-blue text-white rounded-xl text-sm font-bold
                        hover:bg-jet-blue-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      id="rebook-cta-btn"
                    >
                      <Plane size={16} /> {l.rebookFlight}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main flight info card */}
            <div className="bg-white rounded-2xl border border-jet-gray-200 shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Plane size={18} className="text-jet-blue" />
                    <span className="text-xl font-extrabold text-jet-gray-900">{flight.id}</span>
                    <span className="text-xs text-jet-gray-500 font-medium">{flight.airline}</span>
                  </div>
                  <StatusBadge status={currentStatus} lang={lang} />
                </div>

                {/* Route visualization */}
                <div className="flex items-center gap-3 mt-4 mb-2">
                  <div className="text-center flex-1">
                    <div className="text-2xl font-black text-jet-gray-900">{flight.from}</div>
                    <div className="text-xs text-jet-gray-500 font-medium mt-0.5">{flight.fromFull}</div>
                    <div className="text-sm font-bold text-jet-gray-700 mt-1">
                      {isDisrupted && flight.newDeparts ? (
                        <>
                          <span className="line-through text-jet-gray-400 mr-1">{flight.departs}</span>
                          <span className="text-jet-red">{flight.newDeparts}</span>
                        </>
                      ) : flight.departs}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 relative py-2">
                    <div className="h-0.5 bg-jet-gray-200 w-full relative">
                      <div className={`absolute top-0 left-0 h-full ${isDisrupted ? 'bg-jet-amber w-1/4' : 'bg-jet-green w-0'}`} />
                      <div className={`absolute -top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow
                        ${isDisrupted ? 'bg-jet-amber left-1/4' : 'bg-jet-blue left-0'}`} />
                    </div>
                    <div className="text-center mt-2">
                      <PlaneTakeoff size={14} className="inline text-jet-gray-400" />
                    </div>
                  </div>

                  <div className="text-center flex-1">
                    <div className="text-2xl font-black text-jet-gray-900">{flight.to}</div>
                    <div className="text-xs text-jet-gray-500 font-medium mt-0.5">{flight.toFull}</div>
                    <div className="text-sm font-bold text-jet-gray-700 mt-1">
                      {isDisrupted && flight.newArrives ? (
                        <>
                          <span className="line-through text-jet-gray-400 mr-1">{flight.arrives}</span>
                          <span className="text-jet-red">{flight.newArrives}</span>
                        </>
                      ) : flight.arrives}
                    </div>
                  </div>
                </div>

                {/* Gate & Terminal */}
                <div className="flex gap-3 mt-4">
                  <div className="flex-1 bg-jet-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-jet-gray-500 font-medium">{l.gate}</div>
                    <div className="text-lg font-extrabold text-jet-gray-900 mt-0.5">{flight.gate}</div>
                  </div>
                  <div className="flex-1 bg-jet-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-jet-gray-500 font-medium">{l.terminal}</div>
                    <div className="text-lg font-extrabold text-jet-gray-900 mt-0.5">{flight.terminal}</div>
                  </div>
                  <div className="flex-1 bg-jet-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xs text-jet-gray-500 font-medium">{l.status}</div>
                    <div className="text-xs font-bold mt-1">
                      <StatusBadge status={currentStatus} lang={lang} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-jet-gray-100 p-3 flex gap-2">
                <button
                  onClick={() => handleSaveFlight(flight.id)}
                  disabled={savedFlights.includes(flight.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all
                    ${savedFlights.includes(flight.id)
                      ? 'bg-jet-green-light text-jet-green'
                      : 'bg-jet-gray-50 text-jet-gray-700 hover:bg-jet-gray-100 active:scale-95'
                    }`}
                  id="save-flight-btn"
                >
                  {savedFlights.includes(flight.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  {savedFlights.includes(flight.id) ? l.saved : l.saveFlight}
                </button>
                <button
                  onClick={() => {
                    setNotifEnabled(prev => ({ ...prev, [flight.id]: !prev[flight.id] }));
                    showToast(notifEnabled[flight.id] ? 'Notifications disabled' : 'Notifications enabled');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all
                    ${notifEnabled[flight.id]
                      ? 'bg-jet-blue-light text-jet-blue'
                      : 'bg-jet-gray-50 text-jet-gray-700 hover:bg-jet-gray-100 active:scale-95'
                    }`}
                  id="notif-toggle-btn"
                >
                  {notifEnabled[flight.id] ? <BellRing size={14} /> : <Bell size={14} />}
                  {l.notifications}
                </button>
                <button
                  onClick={() => setShowUpdates(!showUpdates)}
                  className="flex-1 py-2.5 bg-jet-gray-50 text-jet-gray-700 rounded-xl text-xs font-bold
                    flex items-center justify-center gap-1.5 hover:bg-jet-gray-100 active:scale-95 transition-all"
                  id="live-updates-btn"
                >
                  <Zap size={14} /> {l.liveUpdates}
                </button>
              </div>
            </div>

            {/* Live Updates Feed */}
            {showUpdates && flight.updates && (
              <div className="bg-white rounded-2xl border border-jet-gray-200 shadow-sm p-4 animate-fade-in">
                <h3 className="font-bold text-sm text-jet-gray-900 mb-3 flex items-center gap-2">
                  <Zap size={16} className="text-jet-blue" /> {l.liveUpdates}
                </h3>
                <div className="space-y-3">
                  {flight.updates.map((u, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-jet-blue' : 'bg-jet-gray-300'}`} />
                        {i < flight.updates.length - 1 && <div className="w-0.5 flex-1 bg-jet-gray-200 mt-1" />}
                      </div>
                      <div className="pb-3">
                        <div className="text-xs font-bold text-jet-gray-500">{u.time}</div>
                        <div className="text-sm text-jet-gray-700 mt-0.5">{u.msg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Know Your Rights Button */}
            <button
              onClick={() => setShowRights(true)}
              className="w-full py-3.5 bg-jet-navy/5 border border-jet-navy/10 rounded-2xl text-sm font-bold
                text-jet-navy flex items-center justify-center gap-2 hover:bg-jet-navy/10 active:scale-[0.98] transition-all"
              id="know-rights-btn"
            >
              <Shield size={16} /> {l.knowRights}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!activeFlight && (
          <div className="px-4 mt-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-jet-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane size={36} className="text-jet-blue" />
            </div>
            <h2 className="text-xl font-extrabold text-jet-gray-900 mb-2">Track Your Flight</h2>
            <p className="text-sm text-jet-gray-500 max-w-xs mx-auto">
              Enter a flight number above to check status, get delay alerts, and manage disruptions.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {Object.keys(FLIGHTS_DB).map(id => (
                <button
                  key={id}
                  onClick={() => { setSearchQuery(id); setActiveFlight(id); }}
                  className="px-3 py-1.5 bg-white border border-jet-gray-200 rounded-full text-xs font-bold
                    text-jet-gray-600 hover:bg-jet-blue-light hover:text-jet-blue hover:border-jet-blue/20 transition-all"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRebook = () => {
    if (rebookStep === 2) {
      return (
        <div className="px-4 py-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-jet-green-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-jet-green" />
          </div>
          <h2 className="text-2xl font-extrabold text-jet-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-sm text-jet-gray-500 mb-4">
            You've been rebooked on flight {selectedRebook?.id}.
          </p>
          <div className="bg-white rounded-2xl border border-jet-gray-200 p-4 text-left mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">{selectedRebook?.id}</span>
              <StatusBadge status="ON TIME" lang={lang} />
            </div>
            <div className="text-sm text-jet-gray-600">
              {selectedRebook?.from} → {selectedRebook?.to}
            </div>
            <div className="text-sm text-jet-gray-600">
              Departs {selectedRebook?.departs} • Arrives {selectedRebook?.arrives}
            </div>
            {selectedRebook?.price === 0 && (
              <div className="mt-2 text-xs font-bold text-jet-green flex items-center gap-1">
                <CheckCircle2 size={12} /> No change fee applied
              </div>
            )}
          </div>
          <button
            onClick={() => { setRebookStep(0); setSelectedRebook(null); setActiveTab('home'); }}
            className="w-full py-3 bg-jet-blue text-white rounded-xl font-bold text-sm hover:bg-jet-blue-dark
              active:scale-[0.98] transition-all"
          >
            Back to Home
          </button>
        </div>
      );
    }

    return (
      <div className="px-4 pb-4 animate-fade-in">
        <StepIndicator steps={['Select Flight', 'Review', 'Confirmed']} current={rebookStep} />

        {rebookStep === 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-jet-gray-900">Alternative Flights</h2>
              <div className="flex items-center gap-1.5">
                <ArrowUpDown size={14} className="text-jet-gray-400" />
                <select
                  value={rebookSort}
                  onChange={(e) => setRebookSort(e.target.value)}
                  className="text-xs font-bold text-jet-gray-600 bg-jet-gray-50 border border-jet-gray-200
                    rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-jet-blue/30"
                  id="rebook-sort-select"
                >
                  <option value="price">{l.price}</option>
                  <option value="duration">{l.duration}</option>
                  <option value="departs">{l.departureTime}</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {sortedRebookOptions.map((opt) => (
                <div key={opt.id} className="bg-white rounded-2xl border border-jet-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Plane size={16} className="text-jet-blue" />
                      <span className="font-bold text-jet-gray-900">{opt.id}</span>
                      <span className="text-xs text-jet-gray-500">{opt.airline}</span>
                    </div>
                    <div className="text-right">
                      {opt.price === 0 ? (
                        <span className="text-sm font-bold text-jet-green">No Fee</span>
                      ) : (
                        <span className="text-sm font-bold text-jet-gray-900">${opt.price} upgrade</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-bold text-jet-gray-800">{opt.departs}</span>
                      <span className="text-jet-gray-400 mx-2">→</span>
                      <span className="font-bold text-jet-gray-800">{opt.arrives}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-jet-gray-500">
                      <span className="flex items-center gap-1"><Timer size={12} />{opt.duration}</span>
                      <span>{opt.stops === 0 ? 'Nonstop' : `${opt.stops} stop`}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedRebook(opt); setRebookStep(1); }}
                    className="mt-3 w-full py-2.5 bg-jet-blue text-white rounded-xl text-sm font-bold
                      hover:bg-jet-blue-dark active:scale-[0.98] transition-all"
                  >
                    {l.selectConfirm}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {rebookStep === 1 && selectedRebook && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-extrabold text-jet-gray-900 mb-4">Review Your Selection</h2>
            <div className="bg-white rounded-2xl border border-jet-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Plane size={18} className="text-jet-blue" />
                <span className="text-xl font-extrabold">{selectedRebook.id}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-jet-gray-500">{l.departure}</span>
                  <span className="font-bold">{selectedRebook.departs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-jet-gray-500">{l.arrival}</span>
                  <span className="font-bold">{selectedRebook.arrives}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-jet-gray-500">{l.duration}</span>
                  <span className="font-bold">{selectedRebook.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-jet-gray-500">{l.price}</span>
                  <span className="font-bold text-jet-green">{selectedRebook.price === 0 ? 'Free' : `$${selectedRebook.price}`}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRebookStep(0)}
                className="flex-1 py-3 bg-jet-gray-100 text-jet-gray-700 rounded-xl font-bold text-sm
                  hover:bg-jet-gray-200 active:scale-[0.98] transition-all"
              >
                Back
              </button>
              <button
                onClick={() => { setRebookStep(2); showToast('Flight rebooked successfully!'); }}
                className="flex-1 py-3 bg-jet-blue text-white rounded-xl font-bold text-sm
                  hover:bg-jet-blue-dark active:scale-[0.98] transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHotels = () => {
    if (hotelStep === 2 && hotelBooking) {
      const voucher = 150;
      const remaining = Math.max(0, voucher - hotelBooking.price);
      return (
        <div className="px-4 py-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-jet-green-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-jet-green" />
          </div>
          <h2 className="text-2xl font-extrabold text-jet-gray-900 mb-2">Hotel Booked!</h2>
          <p className="text-sm text-jet-gray-500 mb-4">{hotelBooking.name}</p>
          <div className="bg-white rounded-2xl border border-jet-gray-200 p-4 text-left mb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-jet-gray-500">{l.price}</span>
              <span className="font-bold">${hotelBooking.price}{l.perNight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-jet-gray-500">Voucher Applied</span>
              <span className="font-bold text-jet-green">-${Math.min(voucher, hotelBooking.price)}</span>
            </div>
            <div className="border-t border-jet-gray-100 pt-2 flex justify-between">
              <span className="text-jet-gray-500 font-semibold">{l.voucherBalance}</span>
              <span className="font-bold">${remaining}</span>
            </div>
          </div>
          {remaining > 0 && (
            <div className="bg-jet-blue-light rounded-xl p-3 text-xs text-jet-blue font-medium flex items-center gap-2 mb-4">
              <Info size={14} /> {l.bankNote}
            </div>
          )}
          <button
            onClick={() => { setHotelStep(0); setHotelBooking(null); setActiveTab('home'); }}
            className="w-full py-3 bg-jet-blue text-white rounded-xl font-bold text-sm hover:bg-jet-blue-dark
              active:scale-[0.98] transition-all"
          >
            Back to Home
          </button>
        </div>
      );
    }

    if (hotelStep === 1 && hotelBooking) {
      return (
        <div className="px-4 pb-4 animate-fade-in">
          <StepIndicator steps={['Browse', 'Review', 'Confirmed']} current={1} />
          <h2 className="text-lg font-extrabold text-jet-gray-900 mb-4">Confirm Hotel Booking</h2>
          <div className="bg-white rounded-2xl border border-jet-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <Hotel size={18} className="text-jet-blue" />
              <span className="text-lg font-extrabold">{hotelBooking.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-jet-gray-500 mb-3">
              <MapPin size={12} /> {hotelBooking.distance} from DFW
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-jet-gray-500">{l.price}</span>
                <span className="font-bold">${hotelBooking.price}{l.perNight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-jet-gray-500">Rating</span>
                <span className="font-bold flex items-center gap-1">{hotelBooking.stars} <Star size={12} className="text-amber-400 fill-amber-400" /></span>
              </div>
            </div>
            {/* Joint Voucher Toggle */}
            <div className="mt-4 pt-3 border-t border-jet-gray-100">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-jet-gray-600" />
                  <span className="text-sm font-semibold text-jet-gray-700">{l.jointVoucher}</span>
                </div>
                <div
                  onClick={() => setJointVoucher(!jointVoucher)}
                  className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${jointVoucher ? 'bg-jet-blue' : 'bg-jet-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm
                    ${jointVoucher ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setHotelStep(0)}
              className="flex-1 py-3 bg-jet-gray-100 text-jet-gray-700 rounded-xl font-bold text-sm
                hover:bg-jet-gray-200 active:scale-[0.98] transition-all"
            >
              Back
            </button>
            <button
              onClick={() => { setHotelStep(2); showToast('Hotel booked successfully!'); }}
              className="flex-1 py-3 bg-jet-blue text-white rounded-xl font-bold text-sm
                hover:bg-jet-blue-dark active:scale-[0.98] transition-all"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 pb-4 animate-fade-in">
        <StepIndicator steps={['Browse', 'Review', 'Confirmed']} current={0} />

        {/* Price Filter */}
        <div className="bg-white rounded-2xl border border-jet-gray-200 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-jet-gray-700 flex items-center gap-1.5">
              <DollarSign size={14} className="text-jet-blue" /> {l.priceRange}
            </label>
            <span className="text-sm font-extrabold text-jet-blue">${priceRange}/night</span>
          </div>
          <input
            type="range"
            min="50"
            max="250"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-jet-blue"
            id="hotel-price-slider"
          />
          <div className="flex justify-between text-xs text-jet-gray-400 mt-1">
            <span>$50</span><span>$250</span>
          </div>
        </div>

        {/* Hotel Cards */}
        <div className="space-y-3">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl border border-jet-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Hotel size={16} className="text-jet-blue" />
                    <h3 className="font-bold text-jet-gray-900">{hotel.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-xs text-jet-gray-500">
                      <MapPin size={11} /> {hotel.distance}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-600 font-medium">
                      <Star size={11} className="fill-amber-400 text-amber-400" /> {hotel.stars}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-jet-gray-900">${hotel.price}</div>
                  <div className="text-xs text-jet-gray-500">{l.perNight}</div>
                </div>
              </div>
              <div className="flex gap-1.5 mt-2 mb-3">
                {hotel.amenities.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 bg-jet-gray-50 text-jet-gray-600 rounded-md text-xs font-medium">{a}</span>
                ))}
              </div>
              <button
                onClick={() => { setHotelBooking(hotel); setHotelStep(1); }}
                className="w-full py-2.5 bg-jet-blue text-white rounded-xl text-sm font-bold
                  hover:bg-jet-blue-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <CreditCard size={14} /> {l.bookVoucher}
              </button>
            </div>
          ))}
          {filteredHotels.length === 0 && (
            <div className="text-center py-8 text-jet-gray-400 text-sm">
              No hotels in this price range. Try increasing the budget.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChat = () => (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] animate-fade-in">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-jet-blue text-white rounded-br-md'
                : 'bg-white border border-jet-gray-200 text-jet-gray-800 rounded-bl-md shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {chatTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-jet-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-jet-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-jet-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-jet-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Connect to human */}
      <div className="px-4 py-2">
        <button
          onClick={() => showToast('Connecting you to a human agent...')}
          className="w-full py-2.5 bg-jet-gray-50 border border-jet-gray-200 rounded-xl text-xs font-bold
            text-jet-gray-600 flex items-center justify-center gap-2 hover:bg-jet-gray-100 transition-all"
          id="connect-human-btn"
        >
          <Phone size={14} /> {l.connectHuman}
          <span className="text-jet-gray-400 font-medium">• {l.estWait}</span>
        </button>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-jet-gray-100 bg-white">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={l.typeMessage}
            className="flex-1 px-4 py-2.5 bg-jet-gray-50 border border-jet-gray-200 rounded-xl text-sm
              placeholder:text-jet-gray-400 focus:outline-none focus:ring-2 focus:ring-jet-blue/30 focus:border-jet-blue"
            id="chat-input"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="p-2.5 bg-jet-blue text-white rounded-xl hover:bg-jet-blue-dark active:scale-95
              transition-all disabled:opacity-40 disabled:pointer-events-none"
            id="chat-send-btn"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );

  const renderMyFlights = () => (
    <div className="px-4 pb-4 animate-fade-in">
      {savedFlights.length > 0 ? (
        <div className="space-y-3">
          {savedFlights.map((id) => {
            const f = FLIGHTS_DB[id];
            if (!f) return null;
            const st = getFlightStatus(id);
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveFlight(id);
                  setActiveTab('home');
                  setSearchQuery(id);
                  if (hasNotifBadge) setHasNotifBadge(false);
                }}
                className="w-full bg-white rounded-2xl border border-jet-gray-200 shadow-sm p-4 text-left
                  hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Plane size={16} className="text-jet-blue" />
                    <span className="font-extrabold text-jet-gray-900 text-lg">{f.id}</span>
                  </div>
                  <StatusBadge status={st} lang={lang} />
                </div>
                <div className="flex items-center gap-2 text-sm text-jet-gray-600">
                  <span className="font-bold">{f.from}</span>
                  <ArrowRight size={14} className="text-jet-gray-400" />
                  <span className="font-bold">{f.to}</span>
                  <span className="text-jet-gray-400 ml-auto">{f.departs}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-jet-gray-500">
                  <span>{l.gate} {f.gate}</span>
                  <span>•</span>
                  <span>{l.terminal} {f.terminal}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-jet-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark size={28} className="text-jet-gray-400" />
          </div>
          <h3 className="font-bold text-jet-gray-700 mb-1">No Saved Flights</h3>
          <p className="text-sm text-jet-gray-500">Search for a flight and save it to track here.</p>
        </div>
      )}

      {/* Quick Add */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className="mt-4 w-full py-3 border-2 border-dashed border-jet-gray-300 rounded-2xl text-sm font-bold
          text-jet-gray-500 flex items-center justify-center gap-2 hover:border-jet-blue hover:text-jet-blue transition-all"
        id="quick-add-btn"
      >
        <Plus size={16} /> {l.quickAdd}
      </button>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in" onClick={() => setShowQuickAdd(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-extrabold text-jet-gray-900 mb-4">{l.quickAdd} Flight</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const key = quickAddInput.toUpperCase().replace(/\s/g, '');
              if (FLIGHTS_DB[key]) {
                handleSaveFlight(key);
                setShowQuickAdd(false);
                setQuickAddInput('');
              } else {
                showToast('Flight not found. Try AA1234, UA456, or DL789.');
              }
            }}>
              <input
                type="text"
                value={quickAddInput}
                onChange={(e) => setQuickAddInput(e.target.value)}
                placeholder="e.g. AA1234"
                className="w-full px-4 py-3 bg-jet-gray-50 border border-jet-gray-200 rounded-xl text-sm
                  placeholder:text-jet-gray-400 focus:outline-none focus:ring-2 focus:ring-jet-blue/30 focus:border-jet-blue mb-3"
                autoFocus
                id="quick-add-input"
              />
              <button
                type="submit"
                className="w-full py-3 bg-jet-blue text-white rounded-xl font-bold text-sm hover:bg-jet-blue-dark
                  active:scale-[0.98] transition-all"
              >
                Add Flight
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderRightsModal = () => {
    if (!showRights) return null;
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in" onClick={() => setShowRights(false)}>
        <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white px-6 pt-6 pb-3 border-b border-jet-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-jet-gray-900 flex items-center gap-2">
                <Shield size={20} className="text-jet-blue" /> {l.passengerRights}
              </h3>
              <button onClick={() => setShowRights(false)} className="p-1.5 hover:bg-jet-gray-100 rounded-full transition-colors">
                <X size={20} className="text-jet-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {RIGHTS.map((right, i) => {
              const Icon = right.icon;
              return (
                <div key={i} className="flex gap-3 pb-4 border-b border-jet-gray-100 last:border-0">
                  <div className="w-10 h-10 bg-jet-blue-light rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-jet-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-jet-gray-900 text-sm">{lang === 'es' ? right.titleEs : right.title}</h4>
                    <p className="text-xs text-jet-gray-600 mt-1 leading-relaxed">{lang === 'es' ? right.descEs : right.desc}</p>
                  </div>
                </div>
              );
            })}
            <div className="bg-jet-blue-light rounded-xl p-3 text-xs text-jet-blue font-medium flex items-start gap-2">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>These rights are based on U.S. DOT regulations. International flights may have additional protections under EU261 or other frameworks.</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const screens = { home: renderHome, rebook: renderRebook, hotels: renderHotels, chat: renderChat, myFlights: renderMyFlights };

  const tabs = [
    { id: 'home', icon: Plane, label: l.home },
    { id: 'rebook', icon: ArrowUpDown, label: l.rebook },
    { id: 'hotels', icon: Hotel, label: l.hotels },
    { id: 'chat', icon: MessageSquare, label: l.chat },
    { id: 'myFlights', icon: Bookmark, label: l.myFlights },
  ];

  return (
    <div className="min-h-screen bg-jet-gray-50 font-sans max-w-md mx-auto relative">
      {/* Animations via <style> tag for Tailwind v4 compatibility */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-down { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-jet-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-jet-blue rounded-lg flex items-center justify-center">
              <Plane size={18} className="text-white -rotate-45" />
            </div>
            <span className="text-lg font-extrabold text-jet-gray-900 tracking-tight">JetBack</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Demo Mode Chip */}
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">
              {l.demoMode}
            </span>
            {/* Force Delay Button */}
            <button
              onClick={handleForceDelay}
              className="px-2 py-1 bg-jet-gray-100 text-jet-gray-600 rounded-lg text-xs font-bold
                hover:bg-jet-gray-200 transition-all flex items-center gap-1"
              id="force-delay-btn"
              title="Simulate a status change on UA456"
            >
              <Zap size={12} /> {l.forceDelay}
            </button>
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="px-2 py-1 bg-jet-gray-100 text-jet-gray-600 rounded-lg text-xs font-bold
                hover:bg-jet-gray-200 transition-all flex items-center gap-1"
              id="lang-toggle-btn"
            >
              <Globe size={12} /> {lang === 'en' ? 'ES' : 'EN'}
            </button>
            {/* User */}
            <div className="w-8 h-8 bg-jet-blue-light rounded-full flex items-center justify-center">
              <User size={16} className="text-jet-blue" />
            </div>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      <NotificationBanner message={notification.message} visible={notification.visible} type={notification.type} />

      {/* Screen Content */}
      <main className="pt-2 pb-20">
        {screens[activeTab]?.()}
      </main>

      {/* Rights Modal */}
      {renderRightsModal()}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-jet-gray-100
        shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="flex items-center justify-around py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const showBadge = tab.id === 'myFlights' && hasNotifBadge;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'myFlights') setHasNotifBadge(false);
                }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative
                  ${isActive ? 'text-jet-blue' : 'text-jet-gray-400 hover:text-jet-gray-600'}`}
                id={`nav-${tab.id}`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {showBadge && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-jet-red rounded-full border-2 border-white" />
                  )}
                </div>
                <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                {isActive && <div className="absolute -bottom-1.5 w-5 h-0.5 bg-jet-blue rounded-full" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
