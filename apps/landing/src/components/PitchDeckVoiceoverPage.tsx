import { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  Download,
  ArrowLeft,
  Layers,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Monitor,
  Smartphone,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  voiceover: string;
  slideImage: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    title: "Trang bìa",
    subtitle: "Đặt Vấn Đề & Giới Thiệu Nền Tảng EcoMiles",
    duration: "~20s",
    voiceover:
      "“80 đơn hàng cần giao. 10 chiếc xe tải. Và công cụ điều phối duy nhất… là một file Excel. Bạn có thấy quen không? Đó là buổi sáng bình thường của rất nhiều doanh nghiệp vận tải Việt Nam - tuyến chồng chéo, xe chạy vòng, cuối ngày gần một phần ba số xe quay về tay không. Và đó chính là lý do EcoMiles ra đời - tối ưu vận chuyển, tiết kiệm chi phí, kiến tạo tương lai xanh!”",
    slideImage: "/slides/slide-01.jpg"
  },
  {
    id: 2,
    title: "Vấn đề (số liệu)",
    subtitle: "Chi Phí Logistics 17% GDP & Phát Thải CO₂ Giao Thông",
    duration: "~12s",
    voiceover:
      "“Câu chuyện đó không phải cá biệt. Logistics Việt Nam đang tiêu tốn tới 17% GDP - gấp rưỡi mức bình quân thế giới - trong khi 80% phát thải CO₂ ngành giao thông đến từ đường bộ, và có tới 30–35% xe chạy rỗng mỗi ngày.”",
    slideImage: "/slides/slide-02.jpg"
  },
  {
    id: 3,
    title: "Đội ngũ GreenLogix",
    subtitle: "5 Sinh Viên Đa Ngành Cùng Mục Tiêu Xanh Hoá Vận Tải",
    duration: "~10s",
    voiceover:
      "“Đứng sau bài toán đó là 5 sinh viên đa ngành - công nghệ, tài chính, marketing, logistics, thương mại điện tử - cùng chung một mục tiêu: xanh hoá logistics Việt Nam.”",
    slideImage: "/slides/slide-03.jpg"
  },
  {
    id: 4,
    title: "Ý nghĩa & tầm nhìn",
    subtitle: "Đồng Hành Cùng Chiến Lược Quốc Gia Net Zero 2050",
    duration: "~15s",
    voiceover:
      "“Với chúng tôi, logistics xanh không phải một lựa chọn xa xỉ, mà là con đường tất yếu để doanh nghiệp Việt Nam phát triển bền vững. Đó cũng là lý do EcoMiles hướng tới trở thành nền tảng quản trị vận tải và phát thải hàng đầu Việt Nam, đồng hành cùng mục tiêu Net Zero 2050.”",
    slideImage: "/slides/slide-04.jpg"
  },
  {
    id: 5,
    title: "4 tính năng chính",
    subtitle: "Tối Ưu Tuyến, Giảm Chạy Rỗng & Báo Cáo CO₂ GLEC/GHG",
    duration: "~20s",
    voiceover:
      "“Vậy EcoMiles giải quyết bài toán đó như thế nào? Nền tảng tự động sắp tuyến, chủ động cảnh báo lệch tuyến, ghép đơn chiều về để giảm xe chạy rỗng, và tự động đo lường – báo cáo CO₂ theo chuẩn quốc tế GLEC và GHG Protocol - tất cả trên cùng một hệ thống.”",
    slideImage: "/slides/slide-05.jpg"
  },
  {
    id: 6,
    title: "Giao diện quản lý (dashboard)",
    subtitle: "Giao Diện Trực Quan: Phân Nhóm Tuyến, GPS Thời Gian Thực & Xuất Báo Cáo",
    duration: "~15s",
    voiceover:
      "“Toàn bộ được quản lý qua một giao diện trực quan: người quản lý tải đơn hàng lên, hệ thống tự nhóm tuyến, theo dõi vị trí xe theo thời gian thực, và xuất báo cáo phát thải chỉ trong vài cú nhấp chuột.”",
    slideImage: "/slides/slide-06.jpg"
  },
  {
    id: 7,
    title: "So sánh cạnh tranh",
    subtitle: "Khác Biệt Vượt Trội: Kết Hợp Tối Ưu Vận Hành & Đo Lường CO₂ Đơn Lẻ",
    duration: "~15s",
    voiceover:
      "“Không chỉ vậy, khác với cách làm cũ vốn thủ công và không đo lường được phát thải, EcoMiles là nền tảng duy nhất kết hợp đồng thời tối ưu vận hành và đo lường CO₂ minh bạch, truy vết đến từng đơn hàng cụ thể.”",
    slideImage: "/slides/slide-07.jpg"
  },
  {
    id: 8,
    title: "Tính khả thi",
    subtitle: "Mô Phỏng MVP 80 Đơn / 10 Xe — Hoàn Vốn 1.68 Năm, IRR 28%",
    duration: "~20s",
    voiceover:
      "“Quay lại với kho hàng 80 đơn hàng, 10 xe tải ở đầu video - đó chính là kịch bản thực tế mà EcoMiles đã mô phỏng thành công trên MVP tại EcoMiles.w9.nu. Với thời gian hoàn vốn khoảng 1,68 năm, IRR 28%, và lợi nhuận dương từ năm thứ hai, đây là mô hình vừa khả thi, vừa bền vững.”",
    slideImage: "/slides/slide-08.jpg"
  },
  {
    id: 9,
    title: "Thông điệp cộng đồng",
    subtitle: "Tác Động Xã Hội: Giảm Ô Nhiễm Đô Thị & Giảm Áp Lực Cho Tài Xế",
    duration: "~20s",
    voiceover:
      "“Và hơn cả những con số, chúng tôi tin một tuyến đường không chạy rỗng cũng là một hơi thở trong lành hơn cho thành phố, một ngày làm việc nhẹ nhàng hơn cho người tài xế - nơi phát triển kinh tế và bảo vệ môi trường có thể song hành.”",
    slideImage: "/slides/slide-09.jpg"
  },
  {
    id: 10,
    title: "Kết thúc",
    subtitle: "Tối Ưu Vận Chuyển · Tiết Kiệm Chi Phí · Kiến Tạo Tương Lai Xanh",
    duration: "~10s",
    voiceover:
      "“Tối ưu vận chuyển, tiết kiệm chi phí, kiến tạo tương lai xanh - đó là những gì EcoMiles mang lại. Cảm ơn bạn đã dành thời gian đồng hành cùng chúng tôi.”",
    slideImage: "/slides/slide-10.jpg"
  }
];

export function PitchDeckVoiceoverPage({ onBackToHome }: { onBackToHome?: () => void }) {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeDemoTab, setActiveDemoTab] = useState<'dispatcher' | 'driver'>('dispatcher');
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  // Intersection observer to track current active slide while scrolling
  useEffect(() => {
    if (window.location.hash) {
      const match = window.location.hash.match(/slide-(\d+)/);
      if (match) {
        const slideId = parseInt(match[1], 10);
        setTimeout(() => {
          scrollToSlide(slideId);
        }, 300);
      }
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (let i = SLIDES.length - 1; i >= 0; i--) {
        const el = slideRefs.current[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSlide(SLIDES[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        scrollToSlide(Math.min(SLIDES.length, activeSlide + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSlide(Math.max(1, activeSlide - 1));
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 's') {
        setShowCaptions(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlide]);

  const scrollToSlide = (slideId: number) => {
    const targetElement = slideRefs.current[slideId - 1];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-400 selection:text-slate-950 font-sans">
      {/* Floating Presentation Control Bar (Judges Screen Experience) */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl transition-all duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Left: Brand Emblem & Back link */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onBackToHome) {
                  onBackToHome();
                } else {
                  window.location.href = '/';
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-emerald-500/40 hover:text-white transition"
              title="Về trang chủ"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>

            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="font-black text-sm tracking-tight text-white">
                ECO<span className="text-amber-400">MILES</span>
              </span>
              <span className="hidden md:inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                SO 2026 PITCH DECK
              </span>
            </div>
          </div>

          {/* Center: Slide Quick-Jump Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
            {SLIDES.map((slide) => {
              const isActive = activeSlide === slide.id;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollToSlide(slide.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={`Slide ${slide.id}: ${slide.title}`}
                >
                  {slide.id < 10 ? `0${slide.id}` : slide.id}
                </button>
              );
            })}
          </div>

          {/* Right: Presentation Utilities */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCaptions(prev => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                showCaptions
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title="Bật / Tắt hiển thị lời đọc thuyết trình"
            >
              {showCaptions ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Phụ đề</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition"
              title="Toàn màn hình trình chiếu (F)"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
            </button>

            <a
              href="/app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110 transition"
              title="Mở Bàn Điều Hành Trực Tiếp để Demo với Ban Giám Khảo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Demo Live</span>
            </a>

            <a
              href="/slides/EcoMiles_Pitch_Deck_SO2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
              title="Tải Slide PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* Floating Side Dot Tracker (Right Edge) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-2.5 bg-slate-950/60 p-2 rounded-full border border-slate-800/80 backdrop-blur-md">
        {SLIDES.map((s) => {
          const isActive = activeSlide === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSlide(s.id)}
              className={`group relative flex items-center justify-center transition-all ${
                isActive ? 'h-7 w-7' : 'h-3.5 w-3.5'
              }`}
              title={`Slide ${s.id}: ${s.title}`}
            >
              <span
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'h-6 w-6 bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40'
                    : 'h-2 w-2 bg-slate-700 group-hover:bg-slate-400 group-hover:scale-125'
                }`}
              >
                {isActive ? s.id : ''}
              </span>

              {/* Tooltip on Hover */}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                Slide {s.id}: {s.title} ({s.duration})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Presentation Feed: Scrolling Slide Deck */}
      <main className="pt-16 pb-28">
        {SLIDES.map((slide, index) => {
          const isSlide6 = slide.id === 6;

          return (
            <section
              key={slide.id}
              id={`slide-${slide.id}`}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="scroll-mt-16 px-4 py-10 sm:px-6 lg:px-8 border-b border-slate-900 last:border-b-0"
            >
              <div className="mx-auto max-w-6xl">
                {/* Slide Header Indicator */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-sm font-black text-emerald-400">
                      {slide.id < 10 ? `0${slide.id}` : slide.id}
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        {slide.title}
                        {isSlide6 && (
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300 uppercase tracking-wide">
                            Trọng tâm Sản phẩm MVP
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Thời lượng trình bày: <strong className="text-amber-300">{slide.duration}</strong></span>
                    </span>
                  </div>
                </div>

                {/* The Slide Canvas — High-Tech Presentation Frame */}
                <div className="group relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900 to-slate-950 p-2 sm:p-3 shadow-2xl shadow-black/80 transition-all duration-300 hover:border-emerald-500/40">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-950">
                    <img
                      src={slide.slideImage}
                      alt={`Slide ${slide.id}: ${slide.title}`}
                      className="h-full w-full object-contain"
                      loading={slide.id <= 3 ? "eager" : "lazy"}
                    />
                  </div>
                </div>

                {/* SPECIAL ENHANCEMENT FOR SLIDE 6: Direct Post-Rename EcoMiles App Proof */}
                {isSlide6 && (
                  <div className="mt-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900 to-emerald-950/20 p-6 sm:p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>MINH CHỨNG PHẦN MỀM THỰC TẾ · NỀN TẢNG ECOMILES (SO 2026)</span>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">
                          Hình Ảnh Trực Tiếp Từ Hệ Thống EcoMiles Đã Triển Khai
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                          Toàn bộ hệ thống vận hành theo thời gian thực trên Cloudflare Edge 24/7, kết hợp thuật toán tối ưu tuyến VRP đường bộ TP.HCM và phân công tài xế qua PWA.
                        </p>
                      </div>

                      {/* View Switcher Tabs */}
                      <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 self-start md:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveDemoTab('dispatcher')}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                            activeDemoTab === 'dispatcher'
                              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          <span>Bàn Điều Hành (Dispatcher)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDemoTab('driver')}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                            activeDemoTab === 'driver'
                              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>App Tài Xế (Driver PWA)</span>
                        </button>
                      </div>
                    </div>

                    {activeDemoTab === 'dispatcher' ? (
                      <div className="space-y-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl">
                          <img
                            src="/screenshots/dispatcher-ecomiles.png"
                            alt="EcoMiles Dispatcher Console Live Screenshot"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Thương hiệu EcoMiles</span>
                            </div>
                            <p className="text-slate-300 text-[11.5px]">
                              Header định danh chính thức <strong>ECOMILES</strong> kèm nhãn kiểm định <em>Cloudflare Edge 24/7</em>.
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Thuật toán Gom Cụm 80 Đơn</span>
                            </div>
                            <p className="text-slate-300 text-[11.5px]">
                              Tự động phân nhóm 80 điểm giao vào 5 tuyến giao hàng OSRM với điểm trung tâm Depot Tân Bình.
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                            <div className="text-amber-400 font-bold flex items-center gap-1.5 mb-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Báo Cáo CO₂ Chuẩn GLEC</span>
                            </div>
                            <p className="text-slate-300 text-[11.5px]">
                              Đối chuẩn trực tiếp với mô hình cũ: giảm <strong>-88.03% km</strong> và <strong>-88.31% CO₂</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <a
                            href="/app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Mở Bàn Điều Hành Trực Tiếp Tại greenlogix.w9.nu/app</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-5 flex justify-center">
                          <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950 shadow-2xl max-w-[320px]">
                            <img
                              src="/screenshots/driver-ecomiles.png"
                              alt="EcoMiles Driver PWA Live Screenshot"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-7 space-y-3">
                          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 space-y-3">
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-cyan-400" />
                              <span>Ứng Dụng Di Động Dành Cho Tài Xế (Driver PWA)</span>
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Được thiết kế tối ưu hoá cho thao tác 1 tay của tài xế trên đường phố, hiển thị danh sách các điểm giao được phân công theo đúng thứ tự thuật toán tối ưu.
                            </p>

                            <div className="space-y-2 text-xs">
                              <div className="flex items-start gap-2 text-slate-200">
                                <span className="text-cyan-400 font-bold">•</span>
                                <span><strong>ECOMILES TÀI XẾ:</strong> Tự động tải lộ trình được xuất bản cho từng xe (ví dụ <code>51C-000.01</code>).</span>
                              </div>
                              <div className="flex items-start gap-2 text-slate-200">
                                <span className="text-amber-400 font-bold">•</span>
                                <span><strong>Cảnh báo giờ cấm tải TP.HCM:</strong> Tự động cảnh báo điểm giao rơi vào khung giờ cấm theo <em>Quyết định 23/2018/QĐ-UBND</em>.</span>
                              </div>
                              <div className="flex items-start gap-2 text-slate-200">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span><strong>Thao tác 1-chạm:</strong> Bấm <em>Đến nơi</em> hoặc <em>Đã giao</em> để cập nhật trạng thái đơn hàng thời gian thực.</span>
                              </div>
                            </div>

                            <div className="pt-2">
                              <a
                                href="/driver?plate=51C-000.01"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Mở Giao Diện Tài Xế Demo</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Subtitle / Voice-over Banner (Judges Follow-Along & Presenter Speech) */}
                {showCaptions && (
                  <div className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md shadow-lg">
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Lời Thuyết Trình (Voice-over) · Slide {slide.id}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Mục tiêu đọc: <span className="text-amber-300 font-bold">{slide.duration}</span>
                      </span>
                    </div>

                    <p className="text-base sm:text-lg font-medium leading-relaxed sm:leading-relaxed text-slate-100 tracking-wide">
                      {slide.voiceover}
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* Presentation Outro & Judges Note */}
        <section className="px-4 py-16 text-center border-t border-slate-900 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>ECOMILES — DỰ THI OLYMPIC KHỞI NGHIỆP 2026 (SO 2026)</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sẵn Sàng Cho Phần Trả Lời Câu Hỏi Của Ban Giám Khảo (Q&A)
            </h3>

            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Hệ thống MVP đã sẵn sàng trực tiếp để Ban Giám Khảo kiểm chứng dữ liệu mô phỏng, thuật toán phân cụm, và công thức đo lường phát thải carbon theo chuẩn ISO 14083 / GLEC.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <a
                href="/app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/25"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mở Bàn Điều Hành Kiểm Chứng</span>
              </a>

              <a
                href="/slides/EcoMiles_Pitch_Deck_SO2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
              >
                <Download className="w-4 h-4" />
                <span>Tải Toàn Bộ Slide PDF</span>
              </a>
            </div>

            {/* Founding Team Credits */}
            <div className="pt-10 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="font-semibold text-slate-300 mb-2">ĐỘI NGŨ SÁNG LẬP ECOMILES (SO 2026)</div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[12px] text-slate-300">
                <span>Nguyễn Thu Thuỷ (NEU - Quản trị KDQT)</span>
                <span>•</span>
                <span>Phạm Quốc Thanh (IU - VNU - Tech & AI)</span>
                <span>•</span>
                <span>Nguyễn Ngọc Khánh Phương (FTU2 - Marketing & ESG)</span>
                <span>•</span>
                <span>Nguyễn Hồng Phúc (FPT Hà Nội - Tài chính & Vốn)</span>
                <span>•</span>
                <span>Lê Thị Hoàng Ngân (NEU - Thương Mại Điện Tử)</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quick Scroll-To-Top / Next Slide Floating Trigger */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollToSlide(Math.min(SLIDES.length, activeSlide + 1))}
          disabled={activeSlide === SLIDES.length}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 disabled:opacity-40 transition"
          title="Cuộn xuống slide kế tiếp (Phím cách hoặc mũi tên xuống)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {activeSlide > 1 && (
          <button
            type="button"
            onClick={() => scrollToSlide(Math.max(1, activeSlide - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-300 shadow-xl hover:bg-slate-800 transition"
            title="Cuộn lên slide trước (Mũi tên lên)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
