import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenPilotModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPilotModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Giải pháp', href: '#solutions' },
    { name: 'Tính năng MVP', href: '#features' },
    { name: 'Bộ tính ROI & CO₂', href: '#calculator' },
    { name: 'Quy trình', href: '#workflow' },
    { name: 'Tác động ESG', href: '#impact' },
    { name: 'Bảng giá Pilot', href: '#pricing' },
    { name: 'Đội ngũ', href: '#team' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-100 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C7D52] to-[#74b72e] flex items-center justify-center text-white shadow-md shadow-green-900/15 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#111827] flex items-center gap-1.5">
                GREEN<span className="text-[#5C7D52]">LOGIX</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-[#74b72e] uppercase -mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#74b72e] animate-ping"></span>
                Green Logistics Platform
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#4B5563] hover:text-[#5C7D52] transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5C7D52] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#calculator"
              className="text-xs font-semibold px-3.5 py-2 rounded-lg text-[#5C7D52] bg-[#5C7D52]/10 hover:bg-[#5C7D52]/15 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#74b72e]" />
              Tính Tiết Kiệm
            </a>

            <button
              onClick={onOpenPilotModal}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-md shadow-[#5C7D52]/25 hover:shadow-lg hover:shadow-[#5C7D52]/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Đăng Ký Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenPilotModal}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#5C7D52] hover:bg-[#4a6541] flex items-center gap-1 sm:hidden"
            >
              Pilot Free
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 pt-2 border-t border-gray-100 bg-white/95 rounded-2xl p-4 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-700 hover:text-[#5C7D52] hover:bg-green-50/60 px-3 py-2 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPilotModal();
                  }}
                  className="w-full py-3 rounded-xl text-center font-semibold text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-md flex items-center justify-center gap-2"
                >
                  <span>Đăng Ký Tham Gia Pilot (Miễn Phí)</span>
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
