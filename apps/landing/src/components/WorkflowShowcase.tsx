import React, { useState } from 'react';
import { Layers, FileSpreadsheet, Truck, MapPin, Route, RefreshCw, Smartphone, Navigation, FileCheck2, Check } from 'lucide-react';

export const WorkflowShowcase: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Tiếp Nhận Đơn Hàng',
      icon: <FileSpreadsheet className="w-5 h-5 text-[#ffda00]" />,
      summary: 'Nhập nhanh danh sách 80+ đơn hàng qua Excel, Google Sheets hoặc API mở.',
      details:
        'Hệ thống tự động đọc và chuẩn hóa địa chỉ, khối lượng hàng, khung giờ cam kết (Time Windows) và yêu cầu bảo quản hàng hóa.',
      badge: 'Đầu Vào Đơn Hàng',
    },
    {
      num: '02',
      title: 'Khai Báo Đội Phương Tiện',
      icon: <Truck className="w-5 h-5 text-emerald-400" />,
      summary: 'Khai báo thông số kỹ thuật 10+ xe: tải trọng 500kg – 2 tấn, loại nhiên liệu.',
      details:
        'Ghi nhận vị trí xuất phát hiện tại của xe, mức tiêu thụ lít/km và thời gian làm việc quy định của tài xế theo luật giao thông 2024.',
      badge: 'Cấu Hình Đội Xe',
    },
    {
      num: '03',
      title: 'Tự Động Phân Cụm Địa Lý',
      icon: <MapPin className="w-5 h-5 text-cyan-400" />,
      summary: 'Thuật toán gom nhóm các điểm giao gần nhau thành cụm khoa học.',
      details:
        'Ví dụ: Cụm Q.1 – Q.3 (15 đơn), Cụm Bình Thạnh – Phú Nhuận (18 đơn), Cụm Q.7 – Nhà Bè (17 đơn), Cụm Thủ Đức (20 đơn).',
      badge: 'Clustering Engine',
    },
    {
      num: '04',
      title: 'Tối Ưu Tuyến & Phân Bổ Xe',
      icon: <Route className="w-5 h-5 text-[#ffda00]" />,
      summary: 'Giải bài toán VRPTW đa ràng buộc chỉ trong 3 giây.',
      details:
        'Tự động phân xe phù hợp nhất cho từng cụm, tối ưu thứ tự điểm giao để không chạy lặp vòng và ưu tiên đơn có khung giờ giao gấp.',
      badge: 'VRPTW Solver',
    },
    {
      num: '05',
      title: 'Tự Động Ghép Đơn Chiều Về',
      icon: <RefreshCw className="w-5 h-5 text-emerald-400" />,
      summary: 'Tìm kiếm đơn lấy hàng trên cung đường quay về kho.',
      details:
        'Ví dụ: Xe giao xong tại Thủ Đức lúc 14:00, hệ thống phát hiện đơn lấy từ Thủ Đức về Bình Thạnh → ghép ngay cho xe thực hiện, triệt tiêu xe chạy rỗng.',
      badge: 'Backhaul Matching',
    },
    {
      num: '06',
      title: 'Tài Xế Nhận Tuyến Trên App',
      icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
      summary: 'Lộ trình tối ưu gửi trực tiếp xuống Mobile App của tài xế.',
      details:
        'Chỉ dẫn từng ngã rẽ chi tiết, hỗ trợ cập nhật trạng thái đơn (đang giao, đã giao, chụp ảnh chứng từ giao hàng POD, chữ ký điện tử).',
      badge: 'Driver Mobile App',
    },
    {
      num: '07',
      title: 'Theo Dõi GPS & Tránh Kẹt Xe',
      icon: <Navigation className="w-5 h-5 text-[#ffda00]" />,
      summary: 'Điều phối viên giám sát toàn bộ đội xe trên Web Console thời gian thực.',
      details:
        'Theo dõi xe đang ở đâu, tiến độ giao bao nhiêu đơn, xe nào trễ hẹn. Nếu tuyến phía trước ùn tắc, hệ thống gợi ý tuyến thay thế ngay.',
      badge: 'Live Dispatch Console',
    },
    {
      num: '08',
      title: 'Báo Cáo Chuyến & Đo Lường CO₂',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      summary: 'Tự động tổng hợp báo cáo sau chuyến kèm kiểm kê phát thải chuẩn ISO 14083.',
      details:
        'So sánh trực tiếp km thực tế, lượng dầu tiết kiệm, số kg CO₂ cắt giảm và đối chiếu rõ nét mức tiết kiệm so với phương án thủ công cũ.',
      badge: 'ESG Post-Trip Report',
    },
  ];

  return (
    <section id="workflow" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-white/5 scroll-mt-24">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-xs font-bold text-[#ffda00] mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>QUY TRÌNH VẬN HÀNH 8 BƯỚC KHÉP KÍN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Từ Nhận Đơn Đến <span className="text-[#ffda00]">Báo Cáo CO₂ Chuẩn Hóa</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Case study thực tế: Doanh nghiệp phân phối thực phẩm tại TP.HCM giải bài toán 80 đơn hàng/ngày với 10 phương tiện qua hệ thống GreenLogix.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {steps.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                activeStep === idx
                  ? 'bg-slate-900 border-[#ffda00] ring-2 ring-[#ffda00]/30 shadow-lg shadow-[#ffda00]/10'
                  : 'bg-slate-900/40 border-white/5 hover:bg-slate-900/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-barlow font-bold text-lg ${
                    activeStep === idx ? 'text-[#ffda00]' : 'text-slate-500'
                  }`}
                >
                  {item.num}
                </span>
                {item.icon}
              </div>
              <div
                className={`text-xs font-bold truncate ${
                  activeStep === idx ? 'text-white' : 'text-slate-300'
                }`}
              >
                {item.title}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-inner">
                {steps[activeStep].icon}
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ffda00] bg-[#ffda00]/10 px-2.5 py-0.5 rounded-full border border-[#ffda00]/20">
                  Bước {steps[activeStep].num} • {steps[activeStep].badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {steps[activeStep].title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Bước {activeStep + 1} / 8</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-2">
                Mô Tả Nghiệp Vụ:
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {steps[activeStep].summary}
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-400 block mb-1">Cách Thức Triển Khai:</strong>
                {steps[activeStep].details}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3 text-xs">
              <div className="font-bold text-[#ffda00] uppercase tracking-wider text-[11px]">
                Giá Trị Đạt Được Tại Bước Này
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tiết kiệm 85% thời gian điều phối viên mỗi ngày</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Loại bỏ hoàn toàn sai sót do phân bổ bằng tay</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Đồng bộ tức thì giữa Web Điều Phối và App Tài Xế</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-3xl p-6 sm:p-9 border border-white/10">
          <h3 className="text-xl font-bold text-white text-center mb-6">
            So Sánh Hiệu Quả: <span className="text-slate-400">Phương Án Cũ</span> vs <span className="text-[#ffda00]">GreenLogix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 px-4">Hạng Mục</th>
                  <th className="py-3 px-4">Phương Án Cũ (Thủ Công / Excel)</th>
                  <th className="py-3 px-4 text-[#ffda00]">Phương Án Tối Ưu GreenLogix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Thời gian lập tuyến</td>
                  <td className="py-3 px-4 text-rose-400">1.5 – 2 giờ/ngày (Phụ thuộc kinh nghiệm)</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">3 – 5 giây (Tự động 100%)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Tổng quãng đường di chuyển</td>
                  <td className="py-3 px-4 text-rose-400">Chồng chéo, nhiều km thừa</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">Cắt giảm 8 – 15% tổng km</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Tỷ lệ xe chạy rỗng chiều về</td>
                  <td className="py-3 px-4 text-rose-400">30 – 40% xe chạy rỗng sau khi giao</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">Tự động ghép đơn, giảm 10–20% xe rỗng</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Đo lường phát thải CO₂</td>
                  <td className="py-3 px-4 text-rose-400">Không có dữ liệu / Không tính được</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">Tự động xuất báo cáo chuẩn ISO 14083 / ESG</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
