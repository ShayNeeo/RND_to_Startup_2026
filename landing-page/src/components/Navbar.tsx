import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, ArrowRight, Sparkles, Calculator } from 'lucide-react';

interface NavbarProps {
  onOpenPilotModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPilotModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Giải Pháp', href: '#solutions' },
    { name: 'Tính Năng', href: '#features' },
    { name: 'Tính ROI & CO₂', href: '#calculator' },
    { name: 'Quy Trình', href: '#workflow' },
    { name: 'Tác Động ESG', href: '#impact' },
    { name: 'Bảng Giá', href: '#pricing' },
    { name: 'Đội Ngũ', href: '#team' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-4 px-3 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        {/* Floating Glass Pill Container */}
        <div
          className={`flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.06] border border-gray-200/80 ring-1 ring-black/[0.03]'
              : 'bg-white/80 backdrop-blur-md shadow-md shadow-black/[0.03] border border-white/80'
          }`}
        >
          {/* Left: Brand Emblem & Logo */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#5C7D52] to-[#74b72e] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white/20" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-gray-900">
                GREEN<span className="text-[#5C7D52]">LOGIX</span>
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#74b72e]"></span>
            </div>
          </a>

          {/* Center: Desktop Navigation Links (Pill list, never wraps) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-semibold text-gray-600 hover:text-[#5C7D52] hover:bg-black/[0.04] active:bg-black/[0.07] transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right: Actions CTAs */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 shrink-0">
            <a
              href="#calculator"
              className="whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-bold text-[#5C7D52] bg-[#5C7D52]/10 hover:bg-[#5C7D52]/15 transition-all flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-[#74b72e]" />
              <span>Tính ROI</span>
            </a>

            <button
              onClick={onOpenPilotModal}
              className="whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-md shadow-[#5C7D52]/25 hover:shadow-lg hover:shadow-[#5C7D52]/30 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Đăng Ký Pilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenPilotModal}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-sm sm:hidden"
            >
              Pilot Free
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Glass Card) */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-gray-200/80 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-[#5C7D52] hover:bg-green-50/80 transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 mt-1 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="#calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-[#5C7D52] bg-green-50 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#74b72e]" />
                  <span>Bộ Tính Mức Tiết Kiệm ROI &amp; CO₂</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPilotModal();
                  }}
                  className="w-full py-3 rounded-xl text-center text-xs font-bold text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Đăng Ký Tham Gia Pilot Miễn Phí</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
