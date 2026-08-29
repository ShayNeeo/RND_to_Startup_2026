import React from 'react';
import { ArrowRight, Leaf, Sparkles, Navigation, Award, CheckCircle2, Calculator } from 'lucide-react';

interface HeroProps {
  onOpenPilotModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPilotModal }) => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F2F7F0]/70 via-[#F8FAF8] to-white flex items-center">
      {/* Decorative Background Gradients */}
      <div className="absolute top-12 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#74b72e]/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#5C7D52]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Content Column (approx 58%) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Overline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C7D52]/10 border border-[#5C7D52]/20 text-[#5C7D52] text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-5 sm:mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#74b72e] shrink-0" />
              <span>TIÊN PHONG LOGISTICS XANH &amp; TỐI ƯU TUYẾN ĐƯỜNG</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.15rem] font-extrabold text-[#111827] leading-[1.12] lg:leading-[1.08] tracking-tight mb-5 sm:mb-6">
              Vận Chuyển <span className="text-[#5C7D52]">Ít Lãng Phí</span>, Tiết Kiệm Nhiều Hơn &amp; <span className="text-gradient-green">Phát Triển Xanh</span>
            </h1>

            {/* Sub-paragraph */}
            <p className="text-sm sm:text-base lg:text-lg text-[#4B5563] leading-relaxed max-w-2xl mb-7 sm:mb-8">
              Nền tảng công nghệ số tiên phong tại Việt Nam tích hợp thuật toán tối ưu hóa tuyến đường đa ràng buộc (<strong className="text-gray-900 font-semibold">VRPTW</strong>) với hệ thống tự động đo lường và kiểm kê phát thải CO₂ theo chuẩn quốc tế <strong className="text-gray-900 font-semibold">GLEC Framework &amp; ISO 14083</strong>.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10">
              <button
                onClick={onOpenPilotModal}
                className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>Trải Nghiệm Pilot 4-6 Tuần (Free)</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#calculator"
                className="px-6 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold text-[#374151] bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#5C7D52]/40 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-[#5C7D52] group-hover:scale-110 transition-transform" />
                <span>Tính Mức Tiết Kiệm (ROI)</span>
              </a>
            </div>

            {/* Key Value Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-gray-200/80 w-full mb-6 sm:mb-8">
              <div className="flex flex-col bg-white/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-gray-100 sm:border-0">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#5C7D52] tracking-tight">8–15%</span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Giảm quãng đường</span>
              </div>
              <div className="flex flex-col bg-white/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-gray-100 sm:border-0">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#74b72e] tracking-tight">5–12%</span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Cắt giảm CO₂/đơn</span>
              </div>
              <div className="flex flex-col bg-white/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-gray-100 sm:border-0">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#5C7D52] tracking-tight">10–20%</span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Giảm xe chạy rỗng</span>
              </div>
              <div className="flex flex-col bg-white/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-gray-100 sm:border-0">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">100%</span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Báo cáo chuẩn ESG</span>
              </div>
            </div>

            {/* Ecosystem & Alignment Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-y-2 sm:gap-x-4 text-[11px] sm:text-xs text-gray-500 font-medium">
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#5C7D52]" />
                Đồng hành &amp; Định hướng:
              </span>
              <span className="bg-gray-100/90 px-2.5 py-0.5 rounded-md text-gray-600">QĐ 2229/QĐ-TTg Logistics Số</span>
              <span className="bg-gray-100/90 px-2.5 py-0.5 rounded-md text-gray-600">QĐ 876/QĐ-TTg Net Zero 2050</span>
              <span className="bg-green-50 px-2.5 py-0.5 rounded-md text-[#5C7D52] font-semibold border border-green-200/50">Tuổi Trẻ Startup Award 2026</span>
            </div>
          </div>

          {/* Right Visual Column (approx 42%) */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-4 lg:mt-0">
            {/* Ambient Backing Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5C7D52]/20 via-[#74b72e]/15 to-transparent rounded-full blur-3xl transform rotate-3 scale-95 -z-10" />

            {/* 3D Floating Video Container with Smooth Feather Mask */}
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] aspect-square flex items-center justify-center">
              
              <div 
                className="w-full h-full relative overflow-hidden rounded-full flex items-center justify-center"
                style={{
                  maskImage: 'radial-gradient(circle at center, black 65%, transparent 95%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 95%)',
                }}
              >
                <video
                  src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/floating_island_bg_hero.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain mix-blend-multiply pointer-events-none scale-105"
                />
              </div>

              {/* Floating Live Telemetry Badge 1 (Top Left) */}
              <div className="absolute top-2 -left-2 sm:top-2 sm:left-2 glass-panel rounded-2xl p-3 sm:p-3.5 shadow-soft-float animate-float-slow border border-white/90 max-w-[190px] sm:max-w-[210px] z-20">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 flex items-center justify-center text-[#5C7D52] shrink-0">
                    <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-tight">80/80 Đơn Tối Ưu</div>
                    <div className="text-[9px] sm:text-[10px] text-green-700 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      10 Xe giao hàng đô thị
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Live Telemetry Badge 2 (Bottom Right) */}
              <div className="absolute bottom-2 -right-2 sm:bottom-4 sm:right-2 glass-panel rounded-2xl p-3 sm:p-3.5 shadow-soft-float animate-float-slow [animation-delay:2s] border border-white/90 max-w-[200px] sm:max-w-[230px] z-20">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-[#74b72e] shrink-0">
                    <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 leading-tight">-142.8 kg CO₂ / ngày</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500 font-medium mt-0.5">Tương đương 7 cây xanh 🌲</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 3 (Middle Right) */}
              <div className="hidden sm:flex absolute top-1/2 -right-4 -translate-y-1/2 glass-panel rounded-xl px-3 py-2 shadow-md border border-white/90 items-center gap-2 animate-float-slow [animation-delay:1s] z-20">
                <CheckCircle2 className="w-4 h-4 text-[#5C7D52]" />
                <span className="text-xs font-bold text-gray-800">98.8% Giao đúng hẹn</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
