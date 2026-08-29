import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function App() {
  const [videoReady, setVideoReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  useEffect(() => {
    // Safety fallback: in case video onCanPlay takes long or is cached
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { name: 'Services', href: '#' },
    { name: 'Industries', href: '#' },
    { name: 'Company', href: '#' },
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
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

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
              {/* Logo (Left): Stacked CARGOX / GROUP */}
              <motion.a
                href="#"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EXPO_OUT }}
                className="flex flex-col uppercase font-barlow font-extrabold tracking-[-0.01em] leading-[0.9] text-left cursor-pointer group"
                style={{
                  fontSize: 'clamp(22px, min(3.15vh, 2.32vw), 32px)',
                }}
              >
                <span className="text-white group-hover:text-white/90 transition-colors">CARGOX</span>
                <span className="text-[#ffda00] group-hover:brightness-110 transition-all">GROUP</span>
              </motion.a>

              {/* Desktop Nav (Center/Right on md+) */}
              <nav
                className="hidden md:flex items-center"
                style={{
                  gap: 'clamp(20px, 3.8vw, 52px)',
                }}
              >
                {navItems.map((item, idx) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.15 + idx * 0.08,
                      ease: EXPO_OUT,
                    }}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-1.5 text-white hover:text-[#ffda00] font-sans font-medium tracking-[-0.02em] transition-colors cursor-pointer"
                    style={{
                      fontSize: 'clamp(15px, min(1.97vh, 1.45vw), 20px)',
                    }}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </nav>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-[#ffda00] focus:outline-none transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
                  className="absolute inset-0 z-40 bg-[#6682c2] flex flex-col items-center justify-center gap-8 md:hidden"
                >
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-6 right-6 p-2 text-white hover:text-[#ffda00]"
                  >
                    <X size={32} />
                  </button>

                  <div className="flex flex-col items-center gap-6">
                    {navItems.map((item, idx) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.08 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl font-bold text-white hover:text-[#ffda00] transition-colors"
                      >
                        {item.name}
                      </motion.a>
                    ))}

                    <motion.a
                      href="#contact"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-4 px-8 py-3.5 rounded-full bg-[#ffda00] text-[#002a35] font-bold text-lg shadow-lg"
                    >
                      Get in touch
                    </motion.a>
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
              {/* Left Column: Giant Headline */}
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
                    className="text-white"
                  >
                    BEYOND
                  </motion.div>

                  {/* Line 2: BORDERS */}
                  <motion.div
                    initial={{ x: 900, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.85, delay: 0.13, ease: EXPO_OUT }}
                    className="text-[#002a35]"
                    style={{ marginLeft: '0.524em' }}
                  >
                    BORDERS
                  </motion.div>

                  {/* Line 3: AND LIMITS */}
                  <motion.div
                    initial={{ x: -900, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.85, delay: 0.26, ease: EXPO_OUT }}
                    className="text-white"
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
                {/* Tagline Text with word-by-word reveal */}
                <div
                  className="font-sans font-normal text-[#002a35] leading-[0.9] tracking-[-0.02em] flex flex-col"
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
                      className="inline-block origin-bottom font-semibold"
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
                        className="inline-block origin-bottom mr-[0.25em]"
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
                        className="inline-block origin-bottom mr-[0.25em]"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Map Section */}
                <div
                  className="relative w-full overflow-visible"
                  style={{ aspectRatio: '435 / 263' }}
                >
                  {/* Map Image Base */}
                  <img
                    src="https://polo-pecan-73837341.figma.site/_assets/v11/b6d561167283e799453232309bd13dd78b2d1afa.png"
                    alt="CargoX Global Route Map"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
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
                            strokeWidth="2.5"
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
                    whileHover={{ scale: 1.12, y: -4 }}
                    className="absolute bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer"
                    style={{
                      left: '26.0%',
                      top: '28.9%',
                      width: '14.9%',
                      aspectRatio: '1 / 1',
                    }}
                  >
                    <img
                      src="https://image-bottom-92901062.figma.site/_components/v2/142c6a6f3074dd8aee013fa440ff4ff369649d48/08d6a37375d428e07c59e24a8529de89bfee157e.08d6a373.png"
                      alt="Maritime Fleet"
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </motion.div>

                  {/* 2. Car / Road Fleet */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 16,
                      delay: 2.2,
                    }}
                    whileHover={{ scale: 1.12, y: -4 }}
                    className="absolute bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer"
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
                      alt="Road & Urban Fleet"
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
                    whileHover={{ scale: 1.12, y: -4 }}
                    className="absolute bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer"
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

                  {/* Map Description Text */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2.4 }}
                    className="hidden sm:block absolute font-sans font-medium text-[#002a35] leading-tight"
                    style={{
                      left: '55.6%',
                      top: '89%',
                      width: '44%',
                      fontSize: 'clamp(12px, min(1.6vh, 1.2vw), 20px)',
                    }}
                  >
                    We ensure full transparency at every stage to build trust and drive results.
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
              {/* Left: Stat Block */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.45, ease: EXPO_OUT }}
                className="flex items-center gap-3 sm:gap-4 text-left"
              >
                {/* 3M+ Number */}
                <div
                  className="font-barlow font-extrabold uppercase text-[#ffda00] leading-none"
                  style={{
                    fontSize: 'clamp(52px, min(8vh, 6vw), 98px)',
                  }}
                >
                  3M+
                </div>

                {/* Description + Icon */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className="font-sans font-normal text-white leading-[1.25]"
                    style={{
                      fontSize: 'clamp(14px, min(1.6vh, 1.2vw), 20px)',
                    }}
                  >
                    <div>tons of cargo</div>
                    <div>successfully delivered</div>
                    <div className="text-white/80">without delays</div>
                  </div>

                  {/* Small Cargo Icon in White Circle */}
                  <div
                    className="rounded-full bg-white flex items-center justify-center shadow-md shrink-0"
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

              {/* Right: Custom SVG Pill CTA Button */}
              <motion.button
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.5, ease: EXPO_OUT }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setIsCtaHovered(true)}
                onHoverEnd={() => setIsCtaHovered(false)}
                className="relative cursor-pointer flex items-center justify-center focus:outline-none w-full sm:w-auto"
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
                  className="w-full h-full drop-shadow-lg"
                >
                  <path
                    d="M316 0C329.08 0 340.435 7.38674 346.121 18.2162C348.618 22.9736 353.086 26.8535 358.459 26.8535H359.252C364.667 26.8535 369.155 22.9169 371.63 18.1007C377.159 7.34039 388.205 0.00015843 400.931 0C419.195 0 434.001 15.1191 434.001 33.7695L433.99 34.6416C433.537 52.8891 418.909 67.5391 400.931 67.5391C387.96 67.5389 376.734 59.9132 371.317 48.8128C368.923 43.9077 364.427 39.873 358.969 39.873C353.492 39.873 348.986 43.9356 346.589 48.8605C341.074 60.1913 329.449 68 316 68H34.001C15.2233 68 0 52.7777 0 34C0 15.2223 15.2233 0 34.001 0H316ZM400.931 2.44141C384.063 2.44163 370.303 16.419 370.303 33.7695C370.303 51.1201 384.063 65.0974 400.931 65.0977C417.798 65.0977 431.56 51.1202 431.56 33.7695C431.56 16.4189 417.798 2.44141 400.931 2.44141Z"
                    fill="#FFDA00"
                  />
                </svg>

                {/* Button Label (Centered in the left portion) */}
                <div
                  className="absolute left-0 right-[20%] inset-y-0 flex items-center justify-center font-sans font-bold text-[#002a35] tracking-tight whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(14px, min(1.6vh, 1.2vw), 20px)',
                  }}
                >
                  Get in touch
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
                      strokeWidth="2.2"
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
    </div>
  );
}

export default App;
