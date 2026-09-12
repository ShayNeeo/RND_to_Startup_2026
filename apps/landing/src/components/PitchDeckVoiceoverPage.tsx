import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Download,
  ArrowLeft,
  Layers,
  Clock,
  Sparkles,
  ShieldCheck,
  Maximize2,
  X,
  FileText,
  Smartphone,
  Monitor,
  Table as TableIcon,
  LayoutGrid,
  Volume2
} from 'lucide-react';

interface SlideItem {
  id: number;
  title: string;
  duration: string;
  durationSec: number;
  voiceover: string;
  slideImage: string;
  focusHighlights: string[];
  appScreenshot?: string;
  appScreenshotTitle?: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    title: "Trang bìa",
    duration: "~20s",
    durationSec: 20,
    voiceover:
      "“80 đơn hàng cần giao. 10 chiếc xe tải. Và công cụ điều phối duy nhất… là một file Excel. Bạn có thấy quen không? Đó là buổi sáng bình thường của rất nhiều doanh nghiệp vận tải Việt Nam - tuyến chồng chéo, xe chạy vòng, cuối ngày gần một phần ba số xe quay về tay không. Và đó chính là lý do EcoMiles ra đời - tối ưu vận chuyển, tiết kiệm chi phí, kiến tạo tương lai xanh!”",
    slideImage: "/slides/slide-01.jpg",
    focusHighlights: ["80 đơn hàng", "10 chiếc xe tải", "file Excel", "EcoMiles", "tối ưu vận chuyển", "kiến tạo tương lai xanh"]
  },
  {
    id: 2,
    title: "Vấn đề (số liệu)",
    duration: "~12s",
    durationSec: 12,
    voiceover:
      "“Câu chuyện đó không phải cá biệt. Logistics Việt Nam đang tiêu tốn tới 17% GDP - gấp rưỡi mức bình quân thế giới - trong khi 80% phát thải CO₂ ngành giao thông đến từ đường bộ, và có tới 30–35% xe chạy rỗng mỗi ngày.”",
    slideImage: "/slides/slide-02.jpg",
    focusHighlights: ["17% GDP", "80% phát thải CO₂", "30–35% xe chạy rỗng"]
  },
  {
    id: 3,
    title: "Đội ngũ GreenLogix",
    duration: "~10s",
    durationSec: 10,
    voiceover:
      "“Đứng sau bài toán đó là 5 sinh viên đa ngành - công nghệ, tài chính, marketing, logistics, thương mại điện tử - cùng chung một mục tiêu: xanh hoá logistics Việt Nam.”",
    slideImage: "/slides/slide-03.jpg",
    focusHighlights: ["5 sinh viên đa ngành", "công nghệ", "tài chính", "marketing", "logistics", "thương mại điện tử", "xanh hoá logistics Việt Nam"]
  },
  {
    id: 4,
    title: "Ý nghĩa & tầm nhìn",
    duration: "~15s",
    durationSec: 15,
    voiceover:
      "“Với chúng tôi, logistics xanh không phải một lựa chọn xa xỉ, mà là con đường tất yếu để doanh nghiệp Việt Nam phát triển bền vững. Đó cũng là lý do EcoMiles hướng tới trở thành nền tảng quản trị vận tải và phát thải hàng đầu Việt Nam, đồng hành cùng mục tiêu Net Zero 2050.”",
    slideImage: "/slides/slide-04.jpg",
    focusHighlights: ["logistics xanh", "phát triển bền vững", "EcoMiles", "hàng đầu Việt Nam", "Net Zero 2050"]
  },
  {
    id: 5,
    title: "4 tính năng chính",
    duration: "~20s",
    durationSec: 20,
    voiceover:
      "“Vậy EcoMiles giải quyết bài toán đó như thế nào? Nền tảng tự động sắp tuyến, chủ động cảnh báo lệch tuyến, ghép đơn chiều về để giảm xe chạy rỗng, và tự động đo lường – báo cáo CO₂ theo chuẩn quốc tế GLEC và GHG Protocol - tất cả trên cùng một hệ thống.”",
    slideImage: "/slides/slide-05.jpg",
    focusHighlights: ["tự động sắp tuyến", "cảnh báo lệch tuyến", "ghép đơn chiều về", "chuẩn quốc tế GLEC và GHG Protocol"]
  },
  {
    id: 6,
    title: "Giao diện quản lý (dashboard)",
    duration: "~15s",
    durationSec: 15,
    voiceover:
      "“Toàn bộ được quản lý qua một giao diện trực quan: người quản lý tải đơn hàng lên, hệ thống tự nhóm tuyến, theo dõi vị trí xe theo thời gian thực, và xuất báo cáo phát thải chỉ trong vài cú nhấp chuột.”",
    slideImage: "/slides/slide-06.jpg",
    appScreenshot: "/screenshots/dispatcher-ecomiles.png",
    appScreenshotTitle: "Bàn điều hành EcoMiles (Dispatcher Console) — Bản đồ OSRM & Phân cụm 80 đơn hàng / 5 tuyến",
    focusHighlights: ["giao diện trực quan", "tự nhóm tuyến", "thời gian thực", "xuất báo cáo phát thải"]
  },
  {
    id: 7,
    title: "So sánh cạnh tranh",
    duration: "~15s",
    durationSec: 15,
    voiceover:
      "“Không chỉ vậy, khác với cách làm cũ vốn thủ công và không đo lường được phát thải, EcoMiles là nền tảng duy nhất kết hợp đồng thời tối ưu vận hành và đo lường CO₂ minh bạch, truy vết đến từng đơn hàng cụ thể.”",
    slideImage: "/slides/slide-07.jpg",
    focusHighlights: ["nền tảng duy nhất", "tối ưu vận hành", "đo lường CO₂ minh bạch", "truy vết từng đơn hàng"]
  },
  {
    id: 8,
    title: "Tính khả thi",
    duration: "~20s",
    durationSec: 20,
    voiceover:
      "“Quay lại với kho hàng 80 đơn hàng, 10 xe tải ở đầu video - đó chính là kịch bản thực tế mà EcoMiles đã mô phỏng thành công trên MVP tại EcoMiles.w9.nu. Với thời gian hoàn vốn khoảng 1,68 năm, IRR 28%, và lợi nhuận dương từ năm thứ hai, đây là mô hình vừa khả thi, vừa bền vững.”",
    slideImage: "/slides/slide-08.jpg",
    focusHighlights: ["80 đơn hàng, 10 xe tải", "MVP tại EcoMiles.w9.nu", "hoàn vốn 1,68 năm", "IRR 28%", "lợi nhuận dương từ năm 2"]
  },
  {
    id: 9,
    title: "Thông điệp cộng đồng",
    duration: "~20s",
    durationSec: 20,
    voiceover:
      "“Và hơn cả những con số, chúng tôi tin một tuyến đường không chạy rỗng cũng là một hơi thở trong lành hơn cho thành phố, một ngày làm việc nhẹ nhàng hơn cho người tài xế - nơi phát triển kinh tế và bảo vệ môi trường có thể song hành.”",
    slideImage: "/slides/slide-09.jpg",
    focusHighlights: ["không chạy rỗng", "hơi thở trong lành hơn", "người tài xế", "kinh tế và bảo vệ môi trường song hành"]
  },
  {
    id: 10,
    title: "Kết thúc",
    duration: "~10s",
    durationSec: 10,
    voiceover:
      "“Tối ưu vận chuyển, tiết kiệm chi phí, kiến tạo tương lai xanh - đó là những gì EcoMiles mang lại. Cảm ơn bạn đã dành thời gian đồng hành cùng chúng tôi.”",
    slideImage: "/slides/slide-10.jpg",
    focusHighlights: ["Tối ưu vận chuyển", "tiết kiệm chi phí", "kiến tạo tương lai xanh", "EcoMiles"]
  }
];

export function PitchDeckVoiceoverPage({ onBackToHome }: { onBackToHome?: () => void }) {
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'teleprompter'>('cards');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [copiedSlideId, setCopiedSlideId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const [activeAppTab, setActiveAppTab] = useState<'dispatcher' | 'driver'>('dispatcher');

  // Interactive Stopwatch per slide
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (!timerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleCopySlide = (slide: SlideItem) => {
    navigator.clipboard.writeText(slide.voiceover);
    setCopiedSlideId(slide.id);
    setTimeout(() => setCopiedSlideId(null), 2000);
  };

  const handleCopyAllScript = () => {
    const fullText = SLIDES.map(
      s => `Slide ${s.id} - ${s.title} (${s.duration}):\n${s.voiceover}\n`
    ).join("\n----------------------------------------\n\n");
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadTxt = () => {
    const fullText = `KỊCH BẢN LỒNG TIẾNG THEO PITCH DECK - DỰ ÁN ECOMILES (SO 2026)\n` +
      `Cuộc thi: Olympic Khởi nghiệp 2026\n` +
      `Đơn vị tổ chức: Trường Đại học Kinh tế Quốc dân (NEU) & CICN\n` +
      `Tổng thời lượng dự kiến: ~157s (khoảng 2 phút 37 giây)\n\n` +
      SLIDES.map(
        s => `Slide ${s.id}: ${s.title} [${s.duration}]\n${s.voiceover}\n`
      ).join("\n------------------------------------------------------------\n\n");

    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Kich_Ban_Long_Tieng_EcoMiles_SO2026.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-400 selection:text-slate-950 font-sans">
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-h-[95vh] max-w-[95vw] overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-slate-950/80">
              <span className="font-semibold text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {lightboxImage.title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 flex items-center justify-center bg-slate-950 max-h-[85vh] overflow-auto">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[80vh] w-auto rounded-lg object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
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
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Trang chủ EcoMiles</span>
              <span className="sm:hidden">Trang chủ</span>
            </button>

            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <Layers className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-white">ECO<span className="text-amber-400">MILES</span></span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">SO 2026</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Olympic Khởi Nghiệp</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/slides/EcoMiles_Pitch_Deck_SO2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
              title="Xem và tải Slide PDF chính thức"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Tải Slide PDF</span>
            </a>

            <button
              type="button"
              onClick={handleCopyAllScript}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
              title="Sao chép toàn bộ 10 slide lời thoại"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copiedAll ? "Đã copy 10 slide!" : "Copy kịch bản"}</span>
            </button>

            <a
              href="/app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở App Live</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner Title */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 sm:p-10 shadow-2xl shadow-emerald-950/30">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>HỒ SƠ VOICE-OVER CHUẨN SO 2026 · ĐẠI HỌC KINH TẾ QUỐC DÂN (NEU)</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              KỊCH BẢN LỒNG TIẾNG <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">THEO PITCH DECK</span>
            </h1>

            <p className="mt-3 max-w-3xl text-base text-slate-300 sm:text-lg">
              Kịch bản đọc mẫu từng slide được biên soạn theo thời lượng chuẩn cuộc thi Olympic Khởi nghiệp 2026, đi kèm ảnh chụp thực tế màn hình phần mềm điều hành vận tải xanh <strong>EcoMiles</strong> sau khi đổi tên.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-medium text-slate-400">Số lượng Slide</div>
                <div className="mt-1 text-2xl font-black text-white">10 Slide</div>
                <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">Hoàn chỉnh 100%</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-medium text-slate-400">Tổng thời lượng</div>
                <div className="mt-1 text-2xl font-black text-amber-300">~157 giây</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Khoảng 2 phút 37 giây</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-medium text-slate-400">Tổng số từ (Word Count)</div>
                <div className="mt-1 text-2xl font-black text-cyan-300">418 từ</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Tốc độ ~160 từ/phút chuẩn MC</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-medium text-slate-400">Trạng thái Phần mềm</div>
                <div className="mt-1 text-2xl font-black text-emerald-400">EcoMiles Live</div>
                <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">Edge 24/7 + D1 Database</div>
              </div>
            </div>
          </div>
        </div>

        {/* Post-Rename App Showcase Section */}
        <section className="mb-14 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Minh chứng Thực nghiệm · App Đã Đổi Tên Thành EcoMiles</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Giao Diện Thực Tế Của Nền Tảng EcoMiles
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Hình ảnh chụp trực tiếp từ Bàn điều hành OSRM và App tài xế trên Cloudflare Edge 24/7 mang thương hiệu chính thức <strong>EcoMiles</strong>.
              </p>
            </div>

            {/* Sub-tab Switcher */}
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveAppTab('dispatcher')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeAppTab === 'dispatcher'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Bàn điều hành (Dispatcher)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveAppTab('driver')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeAppTab === 'driver'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Ứng dụng Tài xế (Driver PWA)</span>
              </button>
            </div>
          </div>

          {activeAppTab === 'dispatcher' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl transition hover:border-emerald-500/50"
                  onClick={() =>
                    setLightboxImage({
                      src: "/screenshots/dispatcher-ecomiles.png",
                      title: "EcoMiles Dispatcher Console — Bàn Điều Phối Trung Tâm"
                    })
                  }
                >
                  <img
                    src="/screenshots/dispatcher-ecomiles.png"
                    alt="Bàn điều hành EcoMiles"
                    className="w-full h-auto object-cover transition duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="text-xs font-medium text-white flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-emerald-400" />
                      Bấm để phóng to xem chi tiết bản đồ
                    </span>
                    <span className="rounded-md bg-emerald-500/20 px-2 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/40">
                      ECOMILES CLOUDFLARE 24/7
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Đặc tính nổi bật</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">EcoMiles Dispatcher Console</h3>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                      <span><strong>Thương hiệu ECOMILES</strong> trên header cùng nhãn xác thực <em>Cloudflare 24/7</em>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                      <span>Phân cụm <strong>80 điểm giao hàng</strong> thành 5 tuyến tối ưu bằng thuật toán VRPTW + 2-Opt.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                      <span>Bảng đối chuẩn tiết kiệm: <strong>-88.03% km</strong>, <strong>-89.17% nhiên liệu</strong> và <strong>-88.31% CO₂</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                      <span>Nút bấm 1-chạm <strong>Publish tài xế</strong> đồng bộ dữ liệu lộ trình sang Cloudflare D1.</span>
                    </li>
                  </ul>
                  <div className="pt-2 flex gap-2">
                    <a
                      href="/app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Truy cập Bàn điều hành live</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 flex justify-center">
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950 shadow-2xl transition hover:border-emerald-500/50 max-w-[340px]"
                  onClick={() =>
                    setLightboxImage({
                      src: "/screenshots/driver-ecomiles.png",
                      title: "EcoMiles Driver PWA — Ứng Dụng Tài Xế Di Động"
                    })
                  }
                >
                  <img
                    src="/screenshots/driver-ecomiles.png"
                    alt="App tài xế EcoMiles"
                    className="w-full h-auto object-contain transition duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="text-xs font-medium text-white flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-emerald-400" />
                      Phóng to xem màn hình điện thoại
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Ứng dụng di động</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">EcoMiles Driver Mobile PWA</h3>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">✓</div>
                      <span>Biển hiệu <strong>ECOMILES TÀI XẾ</strong> tích hợp bộ chọn xe theo thời gian thực (ví dụ <code>51C-000.01</code>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">✓</div>
                      <span>Thẻ điểm dừng rõ ràng: Thứ tự điểm giao, địa chỉ, số điện thoại khách hàng (bấm gọi ngay), khung giờ cam kết và tải trọng.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">✓</div>
                      <span>Cảnh báo cấm tải thông minh: Tự động phát hiện giờ cấm xe tải theo <strong>Quyết định 23/2018/QĐ-UBND</strong> TP.HCM.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                      <span>Thao tác 1-chạm: <em>Đến nơi</em>, <em>Đã giao</em>, <em>Báo hoãn</em> ghi nhận trạng thái tức thì về máy chủ.</span>
                    </li>
                  </ul>
                  <div className="pt-2 flex gap-2">
                    <a
                      href="/driver?plate=51C-000.01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Trải nghiệm App Tài Xế Demo</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* View Mode & Utility Control Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Chế độ hiển thị:</span>
            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'cards'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Thẻ chi tiết</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'table'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Bảng tổng hợp</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('teleprompter')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'teleprompter'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Luyện đọc (MC Prompter)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Tải file .TXT</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAllScript}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedAll ? "Đã chép!" : "Copy tất cả"}</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Detailed Cards */}
        {viewMode === 'cards' && (
          <div className="space-y-6">
            {SLIDES.map((slide) => {
              const isCopied = copiedSlideId === slide.id;
              const isSlide6 = slide.id === 6;

              return (
                <div
                  key={slide.id}
                  id={`slide-${slide.id}`}
                  className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                    isSlide6
                      ? 'border-emerald-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-emerald-950/30 ring-1 ring-emerald-500/20 shadow-xl'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                  } p-6 sm:p-8`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column: Visual Slide Preview */}
                    <div className="lg:w-72 xl:w-80 shrink-0">
                      <div
                        className="group/img relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 transition hover:border-emerald-500/60 shadow-lg"
                        onClick={() =>
                          setLightboxImage({
                            src: slide.slideImage,
                            title: `Slide ${slide.id}: ${slide.title}`
                          })
                        }
                      >
                        <img
                          src={slide.slideImage}
                          alt={`Slide ${slide.id} - ${slide.title}`}
                          className="w-full h-auto aspect-[16/9] object-cover transition duration-300 group-hover/img:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="rounded-lg bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
                            <Maximize2 className="w-3.5 h-3.5" />
                            Phóng to slide
                          </span>
                        </div>
                        <div className="absolute top-2 left-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-800">
                          SLIDE {slide.id}
                        </div>
                      </div>

                      {/* If Slide 6, offer a mini thumbnail to the Dispatcher Screenshot */}
                      {isSlide6 && (
                        <div className="mt-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-300">Live App Console</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxImage({
                                src: "/screenshots/dispatcher-ecomiles.png",
                                title: "EcoMiles Dispatcher Console — Bàn điều hành"
                              })
                            }
                            className="text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <span>Xem ảnh app</span>
                            <Maximize2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Slide Content, Voice-over & Teleprompter Typography */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Slide Meta Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-black text-emerald-400">
                              {slide.id}
                            </span>
                            <h3 className="text-xl font-bold text-white tracking-tight">
                              {slide.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              {slide.duration}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleCopySlide(slide)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition"
                              title="Copy đoạn lời thoại này"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                              <span>{isCopied ? "Đã copy" : "Copy"}</span>
                            </button>
                          </div>
                        </div>

                        {/* High-Contrast Voice-over Paragraph */}
                        <div className="relative rounded-2xl bg-slate-950/60 p-5 border border-slate-800/80">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Lời đọc (Voice-over)</span>
                          </div>
                          <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium tracking-wide">
                            {slide.voiceover}
                          </p>
                        </div>

                        {/* Keyword Highlight Tags */}
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-slate-400 mr-1">Điểm nhấn:</span>
                          {slide.focusHighlights.map((hl, i) => (
                            <span
                              key={i}
                              className="rounded-lg bg-slate-800/80 border border-slate-700/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-300"
                            >
                              {hl}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Tip / Direct link */}
                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                        <span>Tốc độ đọc ước tính: <strong>{(slide.voiceover.split(/\s+/).length / (slide.durationSec / 60)).toFixed(0)} từ/phút</strong></span>
                        {isSlide6 && (
                          <span className="text-emerald-400 font-medium">★ Slide trọng tâm trình diễn trực tiếp MVP EcoMiles</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode 2: Master Structured Table */}
        {viewMode === 'table' && (
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th scope="col" className="px-4 py-4 font-bold text-center w-16">Slide</th>
                    <th scope="col" className="px-4 py-4 font-bold w-48">Tiêu đề slide</th>
                    <th scope="col" className="px-4 py-4 font-bold text-center w-28">Thời lượng</th>
                    <th scope="col" className="px-6 py-4 font-bold">Lời đọc (Voice-over)</th>
                    <th scope="col" className="px-4 py-4 font-bold text-center w-36">Minh hoạ</th>
                    <th scope="col" className="px-4 py-4 font-bold text-center w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {SLIDES.map((slide) => {
                    const isCopied = copiedSlideId === slide.id;
                    const isSlide6 = slide.id === 6;

                    return (
                      <tr
                        key={slide.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isSlide6 ? 'bg-emerald-950/10' : ''
                        }`}
                      >
                        <td className="px-4 py-4 text-center font-black text-emerald-400">
                          {slide.id}
                        </td>
                        <td className="px-4 py-4 font-bold text-white">
                          <div>{slide.title}</div>
                          {isSlide6 && (
                            <span className="mt-1 inline-block rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                              DEMO APP
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-block rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                            {slide.duration}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-200 leading-relaxed font-normal">
                          {slide.voiceover}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxImage({
                                src: slide.slideImage,
                                title: `Slide ${slide.id}: ${slide.title}`
                              })
                            }
                            className="group relative inline-block overflow-hidden rounded-lg border border-slate-700 bg-slate-950 hover:border-emerald-500/50 transition"
                          >
                            <img
                              src={slide.slideImage}
                              alt={slide.title}
                              className="h-12 w-20 object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Maximize2 className="w-3.5 h-3.5 text-white" />
                            </div>
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleCopySlide(slide)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? "Đã copy" : "Copy"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode 3: Interactive Teleprompter Practice Studio */}
        {viewMode === 'teleprompter' && (
          <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Step / Slide Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setActiveSlideIndex(idx);
                    resetTimer();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    activeSlideIndex === idx
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>Slide {slide.id}</span>
                  <span className="opacity-75 text-[10px]">({slide.duration})</span>
                </button>
              ))}
            </div>

            {/* Active Slide Prompter Card */}
            {(() => {
              const currentSlide = SLIDES[activeSlideIndex];
              const targetSec = currentSlide.durationSec;
              const isOvertime = timerSeconds > targetSec;
              const progressPct = Math.min(100, (timerSeconds / targetSec) * 100);

              return (
                <div className="max-w-4xl mx-auto">
                  {/* Timer & Prompter Controls */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-medium text-slate-400">Đồng hồ luyện đọc:</div>
                      <div className={`text-2xl font-black font-mono ${isOvertime ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                        {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                        <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">
                          / mục tiêu {targetSec}s
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTimerRunning(!timerRunning)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                          timerRunning
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        }`}
                      >
                        {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{timerRunning ? 'Tạm dừng' : 'Bắt đầu đọc'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={resetTimer}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Đặt lại</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOvertime ? 'bg-rose-500' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Teleprompter Text Display */}
                  <div className="rounded-3xl border border-slate-700/80 bg-slate-950/90 p-8 sm:p-12 shadow-2xl text-center space-y-6">
                    <div className="flex items-center justify-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-400">
                        SLIDE {currentSlide.id} / 10
                      </span>
                      <span className="text-slate-400 text-sm font-medium">
                        {currentSlide.title}
                      </span>
                    </div>

                    <p className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-relaxed sm:leading-relaxed text-slate-100 tracking-wide">
                      {currentSlide.voiceover}
                    </p>

                    <div className="pt-4 flex items-center justify-center gap-4">
                      <button
                        type="button"
                        disabled={activeSlideIndex === 0}
                        onClick={() => {
                          setActiveSlideIndex(prev => Math.max(0, prev - 1));
                          resetTimer();
                        }}
                        className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition"
                      >
                        ← Slide trước
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopySlide(currentSlide)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-emerald-500/30 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-slate-800 transition"
                      >
                        {copiedSlideId === currentSlide.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>Sao chép câu này</span>
                      </button>

                      <button
                        type="button"
                        disabled={activeSlideIndex === SLIDES.length - 1}
                        onClick={() => {
                          setActiveSlideIndex(prev => Math.min(SLIDES.length - 1, prev + 1));
                          resetTimer();
                        }}
                        className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-30 transition"
                      >
                        Slide kế tiếp →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Footer Credit & Official NEU SO 2026 Attribution */}
        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-xs text-slate-400 space-y-2">
          <p>
            Dự án <strong>EcoMiles</strong> — Phần mềm tối ưu tuyến đường vận tải đô thị & đo lường phát thải carbon theo chuẩn quốc tế.
          </p>
          <p className="text-slate-400">
            Hồ sơ dự thi <strong>Olympic Khởi nghiệp 2026 (SO 2026)</strong> · Trường Đại học Kinh tế Quốc dân (NEU).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-400">
            <span>Nguyễn Thu Thuỷ (NEU)</span>
            <span>•</span>
            <span>Phạm Quốc Thanh (IU - VNU)</span>
            <span>•</span>
            <span>Nguyễn N. Khánh Phương (FTU2)</span>
            <span>•</span>
            <span>Nguyễn Hồng Phúc (FPT Hà Nội)</span>
            <span>•</span>
            <span>Lê Thị Hoàng Ngân (NEU)</span>
          </div>
        </div>
      </main>
    </div>
  );
}
