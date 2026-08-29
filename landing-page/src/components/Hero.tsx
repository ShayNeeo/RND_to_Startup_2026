import React from 'react';
import { ArrowRight, Leaf, Sparkles, Navigation, Award, CheckCircle2, Calculator } from 'lucide-react';

interface HeroProps {
  onOpenPilotModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPilotModal }) => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#F2F7F0]/60 via-[#F8FAF8] to-white flex items-center">
      {/* Decorative Background Gradients */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#74b72e]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#5C7D52]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column (approx 58%) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Overline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C7D52]/10 border border-[#5C7D52]/20 text-[#5C7D52] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#74b72e]" />
              <span>TIÊN PHONG LOGISTICS XANH & TỐI ƯU TUYẾN ĐƯỜNG</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-extrabold text-[#111827] leading-[1.08] tracking-tight mb-6">
              Vận Chuyển <span className="text-[#5C7D52]">Ít Lãng Phí</span>, Tiết Kiệm Nhiều Hơn &amp; <span className="text-gradient-green">Phát Triển Xanh</span>
            </h1>

            {/* Sub-paragraph */}
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl mb-8">
              Nền tảng công nghệ số tiên phong tại Việt Nam tích hợp thuật toán tối ưu hóa tuyến đường đa ràng buộc (<strong className="text-gray-900 font-semibold">VRPTW</strong>) với hệ thống tự động đo lường và kiểm kê phát thải CO₂ theo chuẩn quốc tế <strong className="text-gray-900 font-semibold">GLEC Framework &amp; ISO 14083</strong>.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenPilotModal}
                className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
              >
                <span>Trải Nghiệm Pilot 4-6 Tuần (Free)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#calculator"
                className="px-6 py-4 rounded-xl text-base font-semibold text-[#374151] bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#5C7D52]/40 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
              >
                <Calculator className="w-5 h-5 text-[#5C7D52] group-hover:scale-110 transition-transform" />
                <span>Tính Mức Tiết Kiệm (ROI)</span>
              </a>
            </div>

            {/* Key Value Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200/80 w-full mb-8">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#5C7D52] tracking-tight">8–15%</span>
                <span className="text-xs text-gray-500 font-medium">Giảm quãng đường</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#74b72e] tracking-tight">5–12%</span>
                <span className="text-xs text-gray-500 font-medium">Cắt giảm CO₂/đơn</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#5C7D52] tracking-tight">10–20%</span>
                <span className="text-xs text-gray-500 font-medium">Giảm xe chạy rỗng</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">100%</span>
                <span className="text-xs text-gray-500 font-medium">Báo cáo chuẩn ESG</span>
              </div>
            </div>

            {/* Ecosystem & Alignment Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-500 font-medium">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#5C7D52]" />
                Đồng hành &amp; Định hướng:
              </span>
              <span className="bg-gray-100/80 px-2.5 py-1 rounded-md text-gray-600">QĐ 2229/QĐ-TTg Logistics Số</span>
              <span className="bg-gray-100/80 px-2.5 py-1 rounded-md text-gray-600">QĐ 876/QĐ-TTg Net Zero 2050</span>
              <span className="bg-green-50 px-2.5 py-1 rounded-md text-[#5C7D52] font-semibold">Tuổi Trẻ Startup Award 2026</span>
            </div>
          </div>

          {/* Right Visual Column (approx 42%) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Backing Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5C7D52]/20 to-[#74b72e]/20 rounded-3xl blur-2xl transform rotate-3 scale-95 -z-10" />

            {/* 3D Floating Video Container */}
            <div className="relative w-full max-w-[520px] aspect-square flex items-center justify-center">
              <video
                src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/floating_island_bg_hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain mix-blend-multiply pointer-events-none drop-shadow-2xl scale-105"
              />

              {/* Floating Live Telemetry Badge 1 (Top Left) */}
              <div className="absolute -top-4 -left-2 sm:left-2 glass-panel rounded-2xl p-3.5 shadow-soft-float animate-float-slow border border-white/90 max-w-[210px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-[#5C7D52] shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-900 leading-tight">80/80 Đơn Tối Ưu</div>
                    <div className="text-[10px] text-green-700 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      10 Xe giao hàng đô thị
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Live Telemetry Badge 2 (Bottom Right) */}
              <div className="absolute -bottom-5 right-0 sm:right-2 glass-panel rounded-2xl p-3.5 shadow-soft-float animate-float-slow [animation-delay:2s] border border-white/90 max-w-[230px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-[#74b72e] shrink-0">
                    <Leaf className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-900 leading-tight">-142.8 kg CO₂ / ngày</div>
                    <div className="text-[10px] text-gray-500 font-medium">Tương đương 7 cây xanh 🌲</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 3 (Middle Right) */}
              <div className="hidden sm:flex absolute top-1/2 -right-4 -translate-y-1/2 glass-panel rounded-xl px-3 py-2 shadow-md border border-white/90 items-center gap-2 animate-float-slow [animation-delay:1s]">
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
