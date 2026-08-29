import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, CheckCircle2, ShieldCheck, Sparkles, Building2, Phone, Mail, User, Truck } from 'lucide-react';

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function App() {
  const [videoReady, setVideoReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    fleetSize: '5-15 xe',
    area: 'TP. Hồ Chí Minh (Ưu tiên đợt 1)',
    notes: '',
  });

  useEffect(() => {
    // Safety fallback: in case video onCanPlay takes long
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { name: 'Thuật Toán VRPTW', href: '#vrptw' },
    { name: 'Quy Trình 8 Bước', href: '#workflow' },
    { name: 'Kiểm Kê CO₂ & ESG', href: '#esg' },
    { name: 'Chương Trình Pilot', href: '#pilot' },
  ];

  const mapPaths = [
    'M128.161 74.6764C79.9989 130.001 71.9994 46.0005 20.9815 111.737',
    'M216.999 9.99985C260.499 12.4998 222.499 71.9998 291.999 58.9998',
    'M130.102 70.9998C144.499 -32.0002 183.852 70.2739 219.999 3.99985',
    'M14.4999 16.9998C111 20.9998 -53.0003 73.4998 21.4999 107',
  ];

  const stopDots = [
    { cx: 9.519, cy: 15.519 },
    { cx: 289.519, cy: 59.518 },
    { cx: 220.519, cy: 9.519 },
    { cx: 125.518, cy: 78.519 },
    { cx: 19.519, cy: 104.519 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col bg-[#1a1a2e] select-none">
      {/* Background Video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260620_185230_f7f71ef4-6655-469f-b9c6-efbdc1f7684a.mp4"
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-95"
      />

      {/* High-legibility vignette gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60 z-0 pointer-events-none" />

      {/* Main Content Layer (Fades in when video is ready) */}
      <AnimatePresence>
        {videoReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col flex-1 w-full h-full justify-between overflow-hidden"
          >
            {/* 1. Header (z-50, relative) */}
            <header
              className="relative z-50 flex items-center justify-between w-full"
              style={{
                padding: 'clamp(16px, 4vh, 40px) clamp(16px, 3vw, 48px) 0',
              }}
            >
              {/* Logo (Left): Stacked GREENLOGIX / GROUP (B2B Green Logistics) */}
              <motion.a
                href="#"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EXPO_OUT }}
                className="flex flex-col uppercase font-barlow font-extrabold tracking-[-0.01em] leading-[0.9] text-left cursor-pointer group drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                style={{
                  fontSize: 'clamp(22px, min(3.15vh, 2.32vw), 32px)',
                }}
              >
                <span className="text-white group-hover:text-white/90 transition-colors">GREENLOGIX</span>
                <span className="text-[#ffda00] group-hover:brightness-110 transition-all flex items-center gap-1.5">
                  GROUP <span className="text-[11px] lowercase tracking-normal font-sans font-semibold text-emerald-300 bg-black/40 border border-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">B2B SaaS</span>
                </span>
              </motion.a>

              {/* Desktop Nav (Glass pill container for supreme legibility) */}
              <nav
                className="hidden md:flex items-center bg-black/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 shadow-lg shadow-black/20"
                style={{
                  gap: 'clamp(16px, 2.8vw, 36px)',
                }}
              >
                {navItems.map((item, idx) => (
                  <motion.button
                    key={item.name}
                    onClick={() => setPilotModalOpen(true)}
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.15 + idx * 0.08,
                      ease: EXPO_OUT,
                    }}
                    whileHover={{ scale: 1.04, y: -1 }}
                    className="flex items-center gap-1.5 text-white/95 hover:text-[#ffda00] font-sans font-semibold tracking-tight transition-colors cursor-pointer drop-shadow-sm"
                    style={{
                      fontSize: 'clamp(13px, min(1.8vh, 1.35vw), 16px)',
                    }}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </nav>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:text-[#ffda00] focus:outline-none transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-40 bg-[#002a35]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
                >
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-6 right-6 p-2 text-white hover:text-[#ffda00]"
                  >
                    <X size={32} />
                  </button>

                  <div className="flex flex-col items-center gap-6">
                    {navItems.map((item, idx) => (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.08 }}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setPilotModalOpen(true);
                        }}
                        className="text-2xl font-bold text-white hover:text-[#ffda00] transition-colors"
                      >
                        {item.name}
                      </motion.button>
                    ))}

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setPilotModalOpen(true);
                      }}
                      className="mt-4 px-8 py-3.5 rounded-full bg-[#ffda00] text-[#002a35] font-extrabold text-lg shadow-xl"
                    >
                      Đăng Ký Pilot 4–6 Tuần
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Main Content (z-10, relative) */}
            <main
              className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[2.17fr_1fr] items-center w-full"
              style={{
                padding: 'clamp(24px, 8vh, 120px) clamp(16px, 3vw, 48px) 0',
                gap: 'clamp(20px, 4vh, 48px)',
              }}
            >
              {/* Left Column: Giant Headline adapted to GreenLogix & Net Zero 2050 */}
              <div className="overflow-clip flex flex-col justify-center text-left">
                <div
                  className="font-barlow font-extrabold uppercase leading-[0.78] tracking-[-0.01em] flex flex-col"
                  style={{
                    fontSize: 'clamp(86px, min(14vh, 11vw), 220px)',
                  }}
                >
                  {/* Line 1: BEYOND */}
                  <motion.div
                    initial={{ x: -900, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.85, delay: 0, ease: EXPO_OUT }}
                    className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                  >
                    BEYOND
                  </motion.div>

                  {/* Line 2: BORDERS with high-contrast shadow */}
                  <motion.div
                    initial={{ x: 900, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.85, delay: 0.13, ease: EXPO_OUT }}
                    className="text-[#002a35] drop-shadow-[0_3px_10px_rgba(255,255,255,0.4)]"
                    style={{ marginLeft: '0.524em' }}
                  >
                    BORDERS
                  </motion.div>

                  {/* Line 3: AND LIMITS */}
                  <motion.div
                    initial={{ x: -900, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.85, delay: 0.26, ease: EXPO_OUT }}
                    className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                  >
                    AND LIMITS
                  </motion.div>
                </div>
              </div>

              {/* Right Column: Tagline & Interactive Route Map */}
              <div
                className="flex flex-col justify-center w-full max-w-[540px] lg:max-w-none"
                style={{
                  gap: 'clamp(16px, 2.66vh, 32px)',
                }}
              >
                {/* Tagline Text with crystal-clear high contrast */}
                <div
                  className="font-sans font-normal leading-[0.92] tracking-[-0.02em] flex flex-col drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  style={{
                    fontSize: 'clamp(24px, min(4vh, 3vw), 52px)',
                  }}
                >
                  {/* Line 1: Logistics */}
                  <div className="overflow-hidden" style={{ marginLeft: 0 }}>
                    <motion.span
                      initial={{ y: '100%', rotateX: 45 }}
                      animate={{ y: 0, rotateX: 0 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: EXPO_OUT }}
                      className="inline-block origin-bottom font-extrabold text-white"
                    >
                      Logistics
                    </motion.span>
                  </div>

                  {/* Line 2: shaped by scale */}
                  <div className="overflow-hidden" style={{ marginLeft: '1.5em' }}>
                    {['shaped', 'by', 'scale'].map((word, i) => (
                      <motion.span
                        key={word}
                        initial={{ y: '100%', rotateX: 45 }}
                        animate={{ y: 0, rotateX: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: EXPO_OUT }}
                        className="inline-block origin-bottom mr-[0.25em] font-bold text-white/95"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>

                  {/* Line 3: powered by precision */}
                  <div className="overflow-hidden" style={{ marginLeft: 0 }}>
                    {['powered', 'by', 'precision'].map((word, i) => (
                      <motion.span
                        key={word}
                        initial={{ y: '100%', rotateX: 45 }}
                        animate={{ y: 0, rotateX: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 + i * 0.08, ease: EXPO_OUT }}
                        className="inline-block origin-bottom mr-[0.25em] font-extrabold text-[#ffda00]"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Map Section (VRPTW Live Multi-modal Route Network) */}
                <div
                  className="relative w-full overflow-visible"
                  style={{ aspectRatio: '435 / 263' }}
                >
                  {/* Map Image Base */}
                  <img
                    src="https://polo-pecan-73837341.figma.site/_assets/v11/b6d561167283e799453232309bd13dd78b2d1afa.png"
                    alt="VRPTW Urban & Regional Route Network"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                  />

                  {/* Route Lines SVG Overlay */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: '13.8%',
                      top: '24.3%',
                      width: '68.7%',
                      aspectRatio: '299 / 143',
                    }}
                  >
                    <svg
                      viewBox="0 0 299.037 142.509"
                      className="w-full h-full overflow-visible"
                    >
                      {/* 4 Animated Bezier Curve Paths */}
                      {mapPaths.map((pathD, idx) => (
                        <g key={idx}>
                          {/* Animated Path */}
                          <motion.path
                            d={pathD}
                            fill="none"
                            stroke="#FFDA00"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              duration: 1.1,
                              delay: 0.55 + idx * 0.12,
                              ease: EXPO_OUT,
                            }}
                          />

                          {/* Animated Moving Arrow */}
                          <polygon points="0,-4 8,0 0,4" fill="#FFDA00">
                            <animateMotion
                              path={pathD}
                              dur={`${2.5 + idx * 0.3}s`}
                              repeatCount="indefinite"
                              rotate="auto"
                            />
                          </polygon>
                        </g>
                      ))}

                      {/* 5 Stop Dots with Spring Animation */}
                      {stopDots.map((dot, idx) => (
                        <motion.g
                          key={idx}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 14,
                            delay: 0.9 + idx * 0.1,
                          }}
                        >
                          <circle cx={dot.cx} cy={dot.cy} r={9.519} fill="#FFDA00" />
                          <circle cx={dot.cx} cy={dot.cy} r={3.389} fill="#002A35" />
                        </motion.g>
                      ))}
                    </svg>
                  </div>

                  {/* 3 Transport Icons */}
                  {/* 1. Ship */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 16,
                      delay: 2.1,
                    }}
                    whileHover={{ scale: 1.15, y: -4 }}
                    className="absolute bg-white rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.3)] ring-2 ring-[#ffda00]/50 cursor-pointer"
                    style={{
                      left: '26.0%',
                      top: '28.9%',
                      width: '14.9%',
                      aspectRatio: '1 / 1',
                    }}
                  >
                    <img
                      src="https://image-bottom-92901062.figma.site/_components/v2/142c6a6f3074dd8aee013fa440ff4ff369649d48/08d6a37375d428e07c59e24a8529de89bfee157e.08d6a373.png"
                      alt="Maritime Logistics"
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </motion.div>

                  {/* 2. Car / Road Fleet (GreenLogix Delivery Hub) */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 16,
                      delay: 2.2,
                    }}
                    whileHover={{ scale: 1.15, y: -4 }}
                    className="absolute bg-white rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.3)] ring-2 ring-[#ffda00]/50 cursor-pointer"
                    style={{
                      left: '70.8%',
                      top: '15.6%',
                      width: '14.9%',
                      aspectRatio: '1 / 1',
                      transform: 'rotate(9.73deg)',
                    }}
                  >
                    <img
                      src="https://image-bottom-92901062.figma.site/_components/v2/142c6a6f3074dd8aee013fa440ff4ff369649d48/7d6f50a87e1427d9b4d1a9c9f1c064ff04b2b3f9.7d6f50a8.png"
                      alt="Urban Delivery Van"
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </motion.div>

                  {/* 3. Plane */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 16,
                      delay: 2.3,
                    }}
                    whileHover={{ scale: 1.15, y: -4 }}
                    className="absolute bg-white rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.3)] ring-2 ring-[#ffda00]/50 cursor-pointer"
                    style={{
                      left: '55.2%',
                      top: '52.1%',
                      width: '14.9%',
                      aspectRatio: '1 / 1',
                      transform: 'rotate(180deg) scaleY(-1)',
                    }}
                  >
                    <img
                      src="https://image-bottom-92901062.figma.site/_components/v2/142c6a6f3074dd8aee013fa440ff4ff369649d48/0e0282ab1c70db03d437b0d01875ce45557d49f6.0e0282ab.png"
                      alt="Air Cargo Freight"
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </motion.div>

                  {/* Map Description Text - Enhanced Glass Pill for supreme legibility */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.4 }}
                    className="hidden sm:inline-flex items-center gap-2 absolute bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-lg text-white font-sans font-medium leading-tight"
                    style={{
                      left: '35%',
                      top: '84%',
                      maxWidth: '65%',
                      fontSize: 'clamp(11px, min(1.5vh, 1.1vw), 14px)',
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#ffda00] shrink-0 animate-pulse"></span>
                    <span className="text-white/95">
                      Tối ưu VRPTW đa ràng buộc &amp; đo CO₂ chuẩn <strong>ISO 14083</strong>.
                    </span>
                  </motion.div>
                </div>
              </div>
            </main>

            {/* 3. Footer (z-10, relative) */}
            <footer
              className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full gap-4"
              style={{
                padding: 'clamp(12px, 3vh, 32px) clamp(16px, 3vw, 48px) clamp(16px, 5vh, 66px)',
              }}
            >
              {/* Left: Stat Block (BRAINSTORM_IDEA.md: 3M+ / 8-15% distance saved) */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.45, ease: EXPO_OUT }}
                className="flex items-center gap-3 sm:gap-4 text-left bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 shadow-xl"
              >
                {/* 3M+ Stat Number */}
                <div
                  className="font-barlow font-extrabold uppercase text-[#ffda00] leading-none drop-shadow-[0_2px_8px_rgba(255,218,0,0.3)]"
                  style={{
                    fontSize: 'clamp(52px, min(8vh, 6vw), 98px)',
                  }}
                >
                  3M+
                </div>

                {/* Description + Icon */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className="font-sans font-medium text-white leading-[1.25] drop-shadow-sm"
                    style={{
                      fontSize: 'clamp(13px, min(1.55vh, 1.15vw), 18px)',
                    }}
                  >
                    <div className="text-white font-bold">tấn hàng hóa tối ưu tuyến</div>
                    <div className="text-emerald-300">cắt 5–12% CO₂ / đơn hàng</div>
                    <div className="text-white/90">giảm 10–20% xe chạy rỗng</div>
                  </div>

                  {/* Small Cargo Icon in White Circle */}
                  <div
                    className="rounded-full bg-white flex items-center justify-center shadow-lg ring-2 ring-white/30 shrink-0"
                    style={{
                      width: 'clamp(40px, min(5.5vh, 4vw), 67px)',
                      height: 'clamp(40px, min(5.5vh, 4vw), 67px)',
                    }}
                  >
                    <img
                      src="https://image-bottom-92901062.figma.site/_components/v2/142c6a6f3074dd8aee013fa440ff4ff369649d48/b343ed71e721488b90c407df666fd6dc3f5f70b1.b343ed71.png"
                      alt="Cargo Delivered Icon"
                      className="w-[55%] h-[55%] object-contain"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Right: Custom SVG Pill CTA Button with Interactive Pilot Trigger */}
              <motion.button
                onClick={() => setPilotModalOpen(true)}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.5, ease: EXPO_OUT }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setIsCtaHovered(true)}
                onHoverEnd={() => setIsCtaHovered(false)}
                className="relative cursor-pointer flex items-center justify-center focus:outline-none w-full sm:w-auto drop-shadow-2xl"
                style={{
                  height: 'clamp(48px, min(6vh, 4.5vw), 68px)',
                  aspectRatio: '434 / 68',
                }}
              >
                {/* Custom SVG Pill Shape with Circle Cutout */}
                <svg
                  viewBox="0 0 434.001 68"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  className="w-full h-full drop-shadow-xl"
                >
                  <path
                    d="M316 0C329.08 0 340.435 7.38674 346.121 18.2162C348.618 22.9736 353.086 26.8535 358.459 26.8535H359.252C364.667 26.8535 369.155 22.9169 371.63 18.1007C377.159 7.34039 388.205 0.00015843 400.931 0C419.195 0 434.001 15.1191 434.001 33.7695L433.99 34.6416C433.537 52.8891 418.909 67.5391 400.931 67.5391C387.96 67.5389 376.734 59.9132 371.317 48.8128C368.923 43.9077 364.427 39.873 358.969 39.873C353.492 39.873 348.986 43.9356 346.589 48.8605C341.074 60.1913 329.449 68 316 68H34.001C15.2233 68 0 52.7777 0 34C0 15.2223 15.2233 0 34.001 0H316ZM400.931 2.44141C384.063 2.44163 370.303 16.419 370.303 33.7695C370.303 51.1201 384.063 65.0974 400.931 65.0977C417.798 65.0977 431.56 51.1202 431.56 33.7695C431.56 16.4189 417.798 2.44141 400.931 2.44141Z"
                    fill="#FFDA00"
                  />
                </svg>

                {/* Button Label (Centered in the left portion) */}
                <div
                  className="absolute left-0 right-[20%] inset-y-0 flex items-center justify-center font-sans font-extrabold text-[#002a35] tracking-tight whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(14px, min(1.6vh, 1.2vw), 20px)',
                  }}
                >
                  Đăng Ký Pilot Free
                </div>

                {/* Rotating Arrow inside the Right Circle Cutout */}
                <div
                  className="absolute right-[1.5%] top-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{
                    width: '15%',
                    aspectRatio: '1 / 1',
                  }}
                >
                  <motion.svg
                    viewBox="0 0 16.89 20.37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ rotate: isCtaHovered ? -90 : -135 }}
                    transition={{ duration: 0.35, ease: EXPO_OUT }}
                    className="w-[45%] h-[45%]"
                  >
                    <path
                      d="M8.445 1.5V18.87M8.445 1.5L1.5 8.445M8.445 1.5L15.39 8.445"
                      stroke="#FFFFFF"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </div>
              </motion.button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pilot Program Registration Modal (Connected to BRAINSTORM_IDEA.md) */}
      <AnimatePresence>
        {pilotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white text-gray-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setPilotModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#002a35] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Thử Nghiệm Pilot 4–6 Tuần (Miễn Phí)
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">Đăng Ký Tham Gia GreenLogix</h3>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                    Dành riêng cho <strong>3–5 doanh nghiệp đầu tiên tại TP.HCM</strong> (Viettel Post, GHN, phân phối FMCG/F&amp;B). Đội ngũ kỹ thuật hỗ trợ chuẩn hóa dữ liệu và vận hành trực tiếp.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Họ và tên người liên hệ *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="VD: Nguyễn Văn A"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002a35]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Doanh nghiệp / Bưu cục *
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="VD: Bưu cục GHN Q. Bình Thạnh"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002a35]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Số điện thoại *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            placeholder="09xx xxx xxx"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002a35]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Email công việc *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            required
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002a35]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Quy mô đội xe giao hàng
                        </label>
                        <div className="relative">
                          <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <select
                            value={formData.fleetSize}
                            onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002a35] bg-white"
                          >
                            <option value="Dưới 5 xe">Dưới 5 xe</option>
                            <option value="5-15 xe">5–15 xe (Phù hợp Pilot)</option>
                            <option value="15-50 xe">15–50 xe</option>
                            <option value="Trên 50 xe">Trên 50 xe</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Khu vực vận hành chính
                        </label>
                        <select
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002a35] bg-white"
                        >
                          <option value="TP. Hồ Chí Minh (Ưu tiên đợt 1)">TP. Hồ Chí Minh (Đợt 1)</option>
                          <option value="Hà Nội (Đợt 2)">Hà Nội (Đợt 2)</option>
                          <option value="Bình Dương / Đồng Nai">Bình Dương / Đồng Nai</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-xl font-bold text-xs sm:text-sm text-gray-900 bg-[#ffda00] hover:bg-[#ebd01e] shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Gửi Thông Tin Đăng Ký Pilot Miễn Phí</span>
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cam kết bảo mật dữ liệu theo Nghị định 13/2023/NĐ-CP</span>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng Ký Pilot Thành Công!</h3>
                  <p className="text-xs text-gray-600 mb-6 leading-relaxed max-w-sm mx-auto">
                    Cảm ơn bạn. Đội ngũ GreenLogix sẽ liên hệ trực tiếp trong vòng 24h để khảo sát mô hình bưu cục và khởi tạo tài khoản trải nghiệm.
                  </p>
                  <button
                    onClick={() => {
                      setPilotModalOpen(false);
                      setSubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#002a35] hover:bg-black transition-all"
                  >
                    Hoàn Tất &amp; Đóng
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
