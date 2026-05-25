import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  Sparkles, 
  Trash2, 
  ExternalLink, 
  Plus, 
  ShoppingBag, 
  Clock, 
  Heart,
  ChevronRight,
  User,
  MapPin,
  Send,
  Check,
  RefreshCw,
  CupSoda
} from 'lucide-react';

export default function MenuBoard({ data }) {
  // Default stunning Coffee Shop theme mock data
  const defaultData = {
    personalInfo: {
      name: "Sophia Bennett",
      title: "Senior Full-Stack Developer & Coffee Artisan",
      bio: "Crafting rich, full-bodied web applications with a blend of robust backend APIs and velvety smooth user interfaces. Every line of code is carefully roasted to production-grade perfection.",
      location: "San Francisco, CA / Remote",
      avatar: null,
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    menuCategories: [
      {
        id: "brewed-tech",
        title: "Brewed Tech (Core Skills)",
        description: "Freshly roasted languages and frameworks ready for deployment.",
        items: [
          { id: "skill-1", name: "React / Next.js Latte", price: "$4.50", desc: "Velvety component design layered over robust static-site generation. 100% hydration.", tag: "Frontend", rating: 5, caffeine: "High" },
          { id: "skill-2", name: "Node.js / Express Espresso", price: "$4.00", desc: "A concentrated shot of fast, single-threaded backend event loops. Highly asynchronous.", tag: "Backend", rating: 5, caffeine: "Extreme" },
          { id: "skill-3", name: "TypeScript Pour-Over", price: "$3.50", desc: "Slow-dripped type safety filtering out bugs before runtime. Clean, precise, aromatic.", tag: "Language", rating: 4, caffeine: "Medium" },
          { id: "skill-4", name: "Tailwind CSS Macchiato", price: "$3.00", desc: "A dollop of beautiful utility classes marked over clean, semantic HTML structure.", tag: "Styles", rating: 5, caffeine: "Low" }
        ]
      },
      {
        id: "specialty-blends",
        title: "Specialty Blends (Projects)",
        description: "Handcrafted full-scale applications brewed with passion.",
        items: [
          { id: "proj-1", name: "RoastMaster E-Commerce", price: "$12.00", desc: "Fullbean checkout platform featuring automated subscriptions, real-time inventory, and Stripe payouts.", tag: "Full-Stack", rating: 5, caffeine: "High", link: "https://github.com" },
          { id: "proj-2", name: "CafeSync Live POS", price: "$9.50", desc: "Cozy dashboard using WebSockets for instant table-order sync and live financial telemetry reporting.", tag: "Real-Time", rating: 4.5, caffeine: "High", link: "https://github.com" },
          { id: "proj-3", name: "AromaMatch AI Recommender", price: "$14.00", desc: "Machine learning recommendation system matching flavor notes with user preferences.", tag: "AI / Python", rating: 5, caffeine: "Medium", link: "https://github.com" }
        ]
      },
      {
        id: "add-ons",
        title: "Flavor Add-Ons (DevOps & Databases)",
        description: "Extra toppings to enrich system stability and storage scaling.",
        items: [
          { id: "addon-1", name: "Docker / Kubernetes Foam", price: "$1.50", desc: "Thick container layer keeping microservices isolated, floating, and easy to deploy.", tag: "DevOps", rating: 4, caffeine: "Low" },
          { id: "addon-2", name: "AWS Cloud Syrup", price: "$2.00", desc: "Sweet cloud integration involving ECS, Lambda, CloudFront, and secure S3 buckets.", tag: "Cloud", rating: 4, caffeine: "Medium" },
          { id: "addon-3", name: "PostgreSQL Fine Roast", price: "$1.00", desc: "Rich, highly-structured relational database tables built with optimized index keys.", tag: "Database", rating: 5, caffeine: "Low" }
        ]
      }
    ]
  };

  const profile = data?.personalInfo || defaultData.personalInfo;
  const categories = data?.menuCategories || defaultData.menuCategories;

  // Active Category State - dynamically initialized from categories list
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "brewed-tech");

  // Receipt Order State
  const [orderItems, setOrderItems] = useState([]);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [emailText, setEmailText] = useState("");

  // Coffee Brewer Simulator State
  const [brewBase, setBrewBase] = useState("");
  const [brewFlavor, setBrewFlavor] = useState("");
  const [brewSweetener, setBrewSweetener] = useState("");
  const [isBrewing, setIsBrewing] = useState(false);
  const [brewProgress, setBrewProgress] = useState(0);
  const [brewStageText, setBrewStageText] = useState("");
  const [brewedCup, setBrewedCup] = useState(null);

  // refs for timeout cleanup
  const brewTimeoutsRef = useRef([]);
  const inquiryTimeoutRef = useRef(null);

  // Sync category if external categories list changes
  useEffect(() => {
    if (categories.length > 0 && !categories.some(c => c.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      brewTimeoutsRef.current.forEach(clearTimeout);
      if (inquiryTimeoutRef.current) {
        clearTimeout(inquiryTimeoutRef.current);
      }
    };
  }, []);

  const clearBrewTimeouts = () => {
    brewTimeoutsRef.current.forEach(clearTimeout);
    brewTimeoutsRef.current = [];
  };

  // Add Item to Order (functional updater to avoid stale closure)
  const addToOrder = (item) => {
    setOrderItems((prev) => {
      if (prev.some((o) => o.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  // Remove Item from Order (functional updater to avoid stale closure)
  const removeFromOrder = (id) => {
    setOrderItems((prev) => prev.filter((o) => o.id !== id));
  };

  // Calculate Order Stats
  const calculateTotal = () => {
    const sum = orderItems.reduce((acc, curr) => {
      const numericPrice = parseFloat(curr.price.replace('$', ''));
      return acc + numericPrice;
    }, 0);
    return sum.toFixed(2);
  };

  // Simulate Coffee Brewing
  const handleBrew = () => {
    if (!brewBase || !brewFlavor || !brewSweetener) return;
    clearBrewTimeouts();
    setIsBrewing(true);
    setBrewProgress(0);
    setBrewedCup(null);

    const stages = [
      { text: "Grinding roasted beans...", time: 600 },
      { text: "Compressing espresso puck...", time: 1200 },
      { text: "Extracting rich developers cremas...", time: 1800 },
      { text: "Steaming microfoam milk layer...", time: 2400 },
      { text: "Infusing sweeteners & code...", time: 3000 }
    ];

    stages.forEach((stage, idx) => {
      const tId = setTimeout(() => {
        setBrewStageText(stage.text);
        setBrewProgress((idx + 1) * 20);
        if (idx === stages.length - 1) {
          const innerTId = setTimeout(() => {
            setIsBrewing(false);
            setBrewedCup({
              name: `The ${brewFlavor}-Steamed ${brewBase} ${brewSweetener}`,
              desc: `A robust custom blend perfect for your next project. It pairs a rich ${brewBase} foundation with a high-performance ${brewFlavor} texture and is sweetened with clean, modern ${brewSweetener} guidelines. Perfect for high-frequency user traffic!`,
              temp: "Hot & Ready",
              rating: "⭐⭐⭐⭐⭐"
            });
          }, 600);
          brewTimeoutsRef.current.push(innerTId);
        }
      }, stage.time);
      brewTimeoutsRef.current.push(tId);
    });
  };

  // Handle Inquiry Form Submission
  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!emailText.trim()) return;
    if (inquiryTimeoutRef.current) clearTimeout(inquiryTimeoutRef.current);
    setInquirySubmitted(true);
    inquiryTimeoutRef.current = setTimeout(() => {
      setShowInquiryModal(false);
      setOrderItems([]);
      setInquirySubmitted(false);
      setEmailText("");
      setMessageText("");
    }, 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#110d0a] text-[#ebdcd0] relative overflow-hidden font-sans pb-16">
      
      {/* Background Steam Particles / Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#b9805c] opacity-5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-[#4b3325] opacity-20 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        
        {/* Café Header sign */}
        <header className="text-center mb-16 relative">
          <div className="inline-block border-4 border-[#3e271a] bg-[#1e1510] px-8 py-5 rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] border-double">
            <span className="text-[#d09e7c] text-xs font-mono tracking-[0.3em] uppercase block mb-1">Established Portfolio 2026</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#fdf6f0] font-serif uppercase">
              ☕ {profile.name}
            </h1>
            <p className="text-amber-200/80 text-sm sm:text-base mt-1 font-medium tracking-wide">
              {profile.title}
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto mt-6 px-4">
            <p className="text-[#a48e7e] text-sm sm:text-base leading-relaxed italic">
              "{profile.bio}"
            </p>
            <div className="flex justify-center items-center gap-3 mt-4 text-[#bfab9b] text-xs font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                {profile.location}
              </span>
              <span className="text-amber-800">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Open to Contracts & Full-time Roles
              </span>
            </div>
          </div>
        </header>

        {/* Main Grid: Menu Board & Brewer/Receipt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Chalkboard Menu Board (8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Menu Category Hanger Tags */}
            <div className="flex gap-2 sm:gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide select-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-serif text-sm tracking-wide uppercase transition-all duration-300 relative ${
                    activeCategory === cat.id 
                    ? 'bg-[#1b1713] text-[#f7e6d7] border-t-2 border-amber-600 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]'
                    : 'bg-[#14100d] text-[#8e7a6c] hover:text-[#c4b1a2] hover:bg-[#1a1511]'
                  }`}
                >
                  <Coffee className={`w-4 h-4 ${activeCategory === cat.id ? 'text-amber-500' : 'text-neutral-600'}`} />
                  {cat.title.split(' ')[0]}
                  
                  {activeCategory === cat.id && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* The Chalkboard itself */}
            <div className="bg-[#181512] border-[12px] border-[#332014] rounded-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.7)] relative">
              {/* Wooden frame corners accent */}
              <div className="absolute top-[-10px] left-[-10px] w-5 h-5 border-t-2 border-l-2 border-[#543521] pointer-events-none" />
              <div className="absolute top-[-10px] right-[-10px] w-5 h-5 border-t-2 border-r-2 border-[#543521] pointer-events-none" />
              <div className="absolute bottom-[-10px] left-[-10px] w-5 h-5 border-b-2 border-l-2 border-[#543521] pointer-events-none" />
              <div className="absolute bottom-[-10px] right-[-10px] w-5 h-5 border-b-2 border-r-2 border-[#543521] pointer-events-none" />
              
              {/* Board Header details */}
              <div className="border-b border-[#302720] pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="font-serif text-2xl text-[#f3e5d8] tracking-wide uppercase">
                    {categories.find(c => c.id === activeCategory)?.title}
                  </h2>
                  <p className="text-amber-100/60 text-xs mt-0.5">
                    {categories.find(c => c.id === activeCategory)?.description}
                  </p>
                </div>
                <div className="text-right font-mono text-[10px] text-amber-500/70 tracking-widest uppercase">
                  ⭐ Handcrafted Daily
                </div>
              </div>

              {/* Menu items list */}
              <div className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {categories.find(c => c.id === activeCategory)?.items.map((item) => {
                      const isAdded = orderItems.some(o => o.id === item.id);
                      return (
                        <div 
                          key={item.id}
                          className="border border-[#28211a] hover:border-amber-900/50 hover:bg-[#1e1a16] p-4 rounded-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h3 className="font-serif text-lg text-amber-100 group-hover:text-amber-400 transition-colors font-medium">
                                {item.name}
                              </h3>
                              <span className="font-mono text-base text-amber-500 font-bold ml-2">
                                {item.price}
                              </span>
                            </div>
                            
                            <div className="flex gap-2 items-center mb-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-900/40">
                                {item.tag}
                              </span>
                              {item.caffeine && (
                                <span className="text-[10px] font-mono text-[#a8907b]">
                                  ☕ Caffeine: {item.caffeine}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-[#a28f80] leading-relaxed mb-4">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#231b14] pt-3">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Heart 
                                  key={i} 
                                  className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-amber-500 fill-amber-500' : 'text-neutral-800'}`} 
                                />
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              {item.link && (
                                <a 
                                  href={item.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg border border-[#2d251e] text-[#bfab9b] hover:text-[#f8ebd7] hover:bg-[#28211a] transition-all"
                                  title="View Repo / Live Demo"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => addToOrder(item)}
                                disabled={isAdded}
                                className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all ${
                                  isAdded 
                                  ? 'bg-[#182a1e] text-[#69c088] cursor-default border border-[#1e3d28]'
                                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Ordered
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    Add
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Chalkboard chalkboard dust aesthetics */}
              <div className="absolute bottom-3 right-5 font-mono text-[9px] text-[#423328] select-none uppercase tracking-wider">
                * Prices simulated based on experience level
              </div>
            </div>

            {/* Custom Brewer Simulator Box */}
            <div className="mt-8 bg-[#15110e] border border-[#2b1f17] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {/* Design line decals */}
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-900/20 rounded-tr-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-900/30 text-amber-500">
                  <CupSoda className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-amber-100">Custom Dev-Coffee Brewer</h3>
                  <p className="text-xs text-[#a28f80]">Select ingredients to roast a custom software blend.</p>
                </div>
              </div>

              {/* Brewer Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* 1. Base Select */}
                <div>
                  <label className="block text-xs font-mono text-amber-500 uppercase tracking-wider mb-2">1. Base Blend</label>
                  <select 
                    value={brewBase}
                    onChange={(e) => setBrewBase(e.target.value)}
                    className="w-full bg-[#1b1713] border border-[#362a21] rounded-xl px-3.5 py-2.5 text-sm text-[#e0cbb7] focus:outline-none focus:border-amber-600"
                  >
                    <option value="">-- Choose Base --</option>
                    <option value="Single Page App">Single Page App (SPA)</option>
                    <option value="Server API">RESTful Server API</option>
                    <option value="Full-Stack Application">Full-Stack Blend</option>
                    <option value="Static Website">Jamstack Website</option>
                  </select>
                </div>

                {/* 2. Flavor Select */}
                <div>
                  <label className="block text-xs font-mono text-amber-500 uppercase tracking-wider mb-2">2. Flavor Syrup</label>
                  <select 
                    value={brewFlavor}
                    onChange={(e) => setBrewFlavor(e.target.value)}
                    className="w-full bg-[#1b1713] border border-[#362a21] rounded-xl px-3.5 py-2.5 text-sm text-[#e0cbb7] focus:outline-none focus:border-amber-600"
                  >
                    <option value="">-- Choose Flavor --</option>
                    <option value="React">React (Mild / Interactive)</option>
                    <option value="TypeScript">TypeScript (Robust / Structural)</option>
                    <option value="Node.js">Node.js (Strong / Eventful)</option>
                    <option value="Python">Python (Rich / Scientific)</option>
                    <option value="Golang">Golang (Highly Concentrated)</option>
                  </select>
                </div>

                {/* 3. Sweetener Select */}
                <div>
                  <label className="block text-xs font-mono text-amber-500 uppercase tracking-wider mb-2">3. Sweetener</label>
                  <select 
                    value={brewSweetener}
                    onChange={(e) => setBrewSweetener(e.target.value)}
                    className="w-full bg-[#1b1713] border border-[#362a21] rounded-xl px-3.5 py-2.5 text-sm text-[#e0cbb7] focus:outline-none focus:border-amber-600"
                  >
                    <option value="">-- Choose Sweetener --</option>
                    <option value="Tailwind CSS">Tailwind Drizzle</option>
                    <option value="GraphQL / APIs">GraphQL Sugar</option>
                    <option value="PostgreSQL DB">PostgreSQL Relational Cream</option>
                    <option value="Redux Tooling">Redux State Sprinkles</option>
                  </select>
                </div>
              </div>

              {/* Brewing Action / Progress area */}
              <div className="flex flex-col items-center justify-center border border-dashed border-[#3d2e24] rounded-xl p-6 bg-[#1a1410]">
                {isBrewing ? (
                  <div className="w-full flex flex-col items-center py-4">
                    {/* Animated Coffee Machine Cup */}
                    <div className="relative w-20 h-24 mb-4 flex flex-col items-center justify-end bg-[#130f0c] border border-amber-950 rounded-lg p-2 overflow-hidden shadow-inner">
                      
                      {/* Coffee dripping line */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-12 bg-amber-800 opacity-80 z-10 animate-bounce" />
                      
                      {/* Steam rising */}
                      <div className="absolute top-1 flex gap-1 z-20">
                        <span className="block w-1.5 h-6 bg-white/20 rounded-full blur-[1px] animate-[pulse_1s_infinite] translate-y-[-5px]" />
                        <span className="block w-1 h-5 bg-white/25 rounded-full blur-[1px] animate-[pulse_1.2s_infinite] translate-y-[-10px]" />
                        <span className="block w-1.5 h-6 bg-white/20 rounded-full blur-[1px] animate-[pulse_0.8s_infinite] translate-y-[-8px]" />
                      </div>

                      {/* Liquid filling up */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${brewProgress}%` }}
                        transition={{ duration: 0.3 }}
                        className="w-full bg-amber-900 rounded-b opacity-85 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]"
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-mono text-amber-500 font-bold mb-2 animate-pulse uppercase tracking-wider">{brewStageText}</p>
                      <div className="w-48 bg-[#2d2117] h-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="bg-amber-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${brewProgress}%` }}
                          transition={{ ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : brewedCup ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex flex-col md:flex-row items-center gap-6"
                  >
                    {/* SVG Cup Render */}
                    <div className="relative shrink-0 flex flex-col items-center justify-center p-4 bg-[#14100d] border border-amber-900/40 rounded-2xl">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Steam effect (pure css) */}
                        <div className="absolute top-[-25px] flex gap-1 justify-center w-full">
                          <span className="w-1.5 h-8 bg-amber-100/10 rounded-full blur-[2px] animate-[pulse_1.8s_infinite_alternate]" />
                          <span className="w-1 h-6 bg-amber-100/15 rounded-full blur-[2px] animate-[pulse_1.4s_infinite_alternate]" />
                          <span className="w-1.5 h-8 bg-amber-100/10 rounded-full blur-[2px] animate-[pulse_2.2s_infinite_alternate]" />
                        </div>
                        {/* Cup outline */}
                        <div className="w-20 h-16 bg-amber-50 rounded-b-2xl border-x-4 border-b-4 border-amber-950 relative flex items-center justify-center shadow-lg">
                          {/* Handle */}
                          <div className="absolute right-[-14px] top-[15px] w-6 h-8 border-4 border-amber-950 rounded-r-full" />
                          <Coffee className="w-8 h-8 text-amber-800/80" />
                        </div>
                        {/* Saucer */}
                        <div className="w-24 h-2 bg-amber-950/80 rounded-full mt-2" />
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h4 className="font-serif text-lg text-amber-300 font-bold">{brewedCup.name}</h4>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-900/30 self-start sm:self-center">
                          {brewedCup.temp}
                        </span>
                      </div>
                      <p className="text-xs text-[#b6a190] leading-relaxed mb-4">{brewedCup.desc}</p>
                      
                      <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
                        <button
                          onClick={() => {
                            addToOrder({
                              id: `custom-brew-${Date.now()}`,
                              name: brewedCup.name,
                              price: "$10.00",
                              desc: brewedCup.desc,
                              tag: "Custom Blend",
                              rating: 5
                            });
                          }}
                          className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950/40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add custom brew to order
                        </button>
                        
                        <button
                          onClick={() => setBrewedCup(null)}
                          className="border border-[#3e2e22] hover:bg-[#251d16] text-[#c0ab9b] font-mono text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Brew Another
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-[#8c786a] font-mono max-w-sm leading-relaxed mb-4">
                      Select a Base, Flavor Syrup, and Sweetener in the panel above, then activate the brewer to generate a custom project card recipe.
                    </p>
                    <button
                      onClick={handleBrew}
                      disabled={!brewBase || !brewFlavor || !brewSweetener}
                      className={`font-mono text-sm px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 ${
                        brewBase && brewFlavor && brewSweetener
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/40 active:translate-y-[1px]'
                        : 'bg-[#231b15] text-[#554032] cursor-not-allowed border border-[#31251c]'
                      }`}
                    >
                      🚀 Start Brewing
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: Thermal Receipt Order Ticket (4 cols on desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            
            {/* The Ticket Receipt panel */}
            <div className="relative">
              
              {/* Receipt Clip detail */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-6 bg-[#322c26] border border-[#4d443b] rounded-t-lg z-20 shadow-md flex items-center justify-center">
                <span className="block w-16 h-1 bg-[#1a1613] rounded-full" />
              </div>

              {/* The Receipt slip */}
              <div className="bg-[#faf7f2] text-[#2c2017] pt-8 pb-6 px-6 rounded-b-xl shadow-2xl relative border-t-8 border-[#322c26] overflow-hidden">
                
                {/* Visual barcode background overlay */}
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 border-4 border-dashed border-[#efeae2] rounded-full pointer-events-none" />

                {/* Cafe details inside receipt */}
                <div className="text-center border-b border-dashed border-amber-900/20 pb-4 mb-4">
                  <h3 className="font-serif font-black tracking-widest text-lg uppercase mb-1">COFFEE PORTFOLIO</h3>
                  <p className="text-[10px] font-mono text-amber-900/60 leading-tight uppercase">
                    Sophia's Counter • Terminal #1
                  </p>
                  <p className="text-[9px] font-mono text-neutral-400 mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Items container */}
                <div className="min-h-[180px] flex flex-col justify-between">
                  <div>
                    {orderItems.length === 0 ? (
                      <div className="text-center py-10 flex flex-col items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-amber-950/20 mb-3" />
                        <p className="text-xs font-serif italic text-amber-900/40">Your order is empty</p>
                        <p className="text-[10px] font-mono text-neutral-400 max-w-[180px] leading-normal mt-1">
                          Click "+ Add" on skills or projects to assemble a project inquiry list.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {orderItems.map((item) => (
                          <div 
                            key={item.id}
                            className="flex justify-between items-start gap-2 text-xs group"
                          >
                            <div className="flex-1">
                              <div className="font-serif font-bold text-[#1f1610] flex items-center gap-1">
                                <span className="text-amber-800">•</span>
                                {item.name}
                              </div>
                              <span className="text-[9px] font-mono text-amber-800/60 uppercase block pl-3">
                                {item.tag}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-bold text-[#1f1610]">{item.price}</span>
                              <button 
                                onClick={() => removeFromOrder(item.id)}
                                className="text-neutral-400 hover:text-red-700 transition-colors p-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Calculations */}
                  {orderItems.length > 0 && (
                    <div className="border-t border-dashed border-amber-900/20 pt-4 mt-6">
                      <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                        <span className="uppercase text-amber-900/60">Estimated Cost Index</span>
                        <span className="font-bold">${calculateTotal()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-mono mb-4">
                        <span className="uppercase text-amber-900/60">Total Items selected</span>
                        <span className="font-bold">{orderItems.length} Blends</span>
                      </div>

                      {/* Double dashed lines for Total */}
                      <div className="border-t-2 border-double border-amber-900/30 pt-3 flex justify-between items-center">
                        <span className="font-serif font-black tracking-wide text-sm uppercase">Grand Total</span>
                        <span className="font-mono font-black text-[#1e130c] text-base">${calculateTotal()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Receipt Footer Action */}
                <div className="mt-8">
                  <button
                    disabled={orderItems.length === 0}
                    onClick={() => setShowInquiryModal(true)}
                    className={`w-full font-mono text-xs font-black uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                      orderItems.length > 0
                      ? 'bg-amber-900 text-white hover:bg-amber-800 shadow-md shadow-amber-900/10 active:translate-y-[1px]'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300 shadow-none'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Place Project Order
                  </button>
                </div>

                {/* Realistic Receipt Barcode decoration */}
                <div className="mt-6 flex flex-col items-center pt-4 border-t border-[#f0ebe3]">
                  <div className="h-8 w-full bg-[repeating-linear-gradient(90deg,#302720,#302720_2px,transparent_2px,transparent_6px,#302720_6px,#302720_9px,transparent_9px,transparent_11px)] opacity-80" />
                  <span className="text-[8px] font-mono text-neutral-400 tracking-[0.2em] mt-1.5">SOPHIA-PORTFOLIO-2026</span>
                </div>

                {/* Receipt bottom zigzag cuts */}
                <div className="absolute bottom-0 left-0 w-full h-[6px] bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#110d0a_4px,#110d0a_8px),repeating-linear-gradient(-45deg,transparent,transparent_4px,#110d0a_4px,#110d0a_8px)] opacity-100 pointer-events-none" />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#1c1612] border-2 border-[#433125] max-w-lg w-full rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-hidden text-[#ebdcd0]"
            >
              {/* Coffee beans overlay */}
              <div className="absolute top-0 right-0 opacity-[0.03] select-none pointer-events-none text-7xl font-serif">☕</div>

              <div className="mb-6">
                <h3 className="font-serif text-xl sm:text-2xl text-amber-300 font-bold mb-1">📝 Enter Counter Details</h3>
                <p className="text-xs text-[#a28f80]">
                  Let's discuss the developer brews you've added to your ticket.
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-green-950/70 border border-green-700/60 rounded-full text-green-500 flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-serif text-[#fbf8f5] text-lg font-bold mb-1">Inquiry order received!</h4>
                  <p className="text-xs text-[#b8a291] max-w-xs leading-normal">
                    The barista will review your order ticket and follow up shortly at your email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-mono text-amber-500 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input 
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      className="w-full bg-[#271d18] border border-[#433125] rounded-xl px-4 py-2.5 text-sm text-[#f0e3d8] focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-amber-500 uppercase tracking-wide mb-1.5">Message / Project Spec</label>
                    <textarea 
                      rows={4}
                      placeholder="I'd love to hire you to build some of these brews..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full bg-[#271d18] border border-[#433125] rounded-xl px-4 py-2.5 text-sm text-[#f0e3d8] focus:outline-none focus:border-amber-600 resize-none"
                    />
                  </div>

                  {/* Summary of ordered items */}
                  <div className="p-3 bg-[#130f0c]/60 rounded-xl border border-amber-950/30">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider block mb-1">Receipt Summary ({orderItems.length} items)</span>
                    <p className="text-xs text-[#a28f80] truncate font-serif font-medium">
                      {orderItems.map(o => o.name).join(', ')}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowInquiryModal(false)}
                      className="border border-[#463428] hover:bg-[#2d2019] text-[#c0ab9b] font-mono text-xs px-5 py-2.5 rounded-xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-amber-950/40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Order
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
