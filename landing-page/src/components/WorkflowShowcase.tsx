import React, { useState } from 'react';
import { 
  FileSpreadsheet, Truck, Layers, Route, Repeat, Smartphone, 
  MapPin, BarChart3, CheckCircle2, XCircle, ArrowRight, Sparkles, AlertTriangle
} from 'lucide-react';

interface WorkflowProps {
  onOpenPilotModal: () => void;
}

export const WorkflowShowcase: React.FC<WorkflowProps> = ({ onOpenPilotModal }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Tiếp Nhận Đơn Hàng',
      desc: 'Nhập đơn hàng nhanh chóng qua file Excel, Google Sheets hoặc đồng bộ tự động từ phần mềm quản lý kho/bán hàng.',
      icon: FileSpreadsheet,
      details: 'Địa chỉ người nhận, khối lượng (kg), kích thước, khung giờ hẹn giao và yêu cầu bảo quản hàng hóa.',
    },
    {
      num: '02',
      title: 'Khai Báo Đội Xe',
      desc: 'Cập nhật danh sách phương tiện hiện có, tải trọng cho phép (500kg - 2 tấn) và định mức tiêu hao nhiên liệu.',
      icon: Truck,
      details: 'Hệ thống tự động ghi nhận vị trí xuất phát từ kho/bưu cục và trạng thái sẵn sàng của từng xe.',
    },
    {
      num: '03',
      title: 'Phân Cụm Địa Lý Thông Minh',
      desc: 'Hệ thống tự động gom các đơn gần nhau thành các cụm quận/huyện (Q1-Q3, Bình Thạnh-Phú Nhuận, Q7-Nhà Bè...).',
      icon: Layers,
      details: 'Giảm tải độ phức tạp tính toán, phân bổ tải trọng tương thích từng loại xe máy/xe tải.',
    },
    {
      num: '04',
      title: 'Tối Ưu Tuyến Đường (VRP Engine)',
      desc: 'Thuật toán đề xuất lộ trình tối ưu đa điểm, sắp xếp thứ tự giao hợp lý theo khung giờ giao sớm và cấm tải đô thị.',
      icon: Route,
      details: 'Tránh tối đa việc xe chạy lòng vòng, tránh điểm nghẽn giao thông giờ cao điểm.',
    },
    {
      num: '05',
      title: 'Ghép Đơn Hàng Chiều Về',
      desc: 'Khi xe hoàn thành giao đơn cuối tại điểm xa, hệ thống tự động tìm đơn hàng cần lấy về kho trên đường quay lại.',
      icon: Repeat,
      details: 'Một chuyến xe phục vụ cả chiều đi và chiều về, triệt tiêu tình trạng xe chạy rỗng lãng phí.',
    },
    {
      num: '06',
      title: 'Gửi Lộ Trình Sang App Tài Xế',
      desc: 'Tài xế nhận toàn bộ lộ trình giao trong ngày trên ứng dụng di động Flutter với chỉ dẫn điều hướng chi tiết.',
      icon: Smartphone,
      details: 'Bản đồ dẫn đường 1-chạm (Google Maps), cập nhật trạng thái đã giao và chụp ảnh ký nhận (POD).',
    },
    {
      num: '07',
      title: 'Giám Sát GPS & Cảnh Báo Real-time',
      desc: 'Điều phối viên theo dõi toàn bộ tiến độ đội xe trên Dashboard: vị trí xe, số đơn hoàn thành, cảnh báo trễ hạn.',
      icon: MapPin,
      details: 'Tự động phát hiện khi xe đi lệch tuyến hoặc tuyến phía trước bị ùn tắc để đề xuất lộ trình thay thế.',
    },
    {
      num: '08',
      title: 'Báo Cáo Hiệu Quả & Kiểm Kê CO₂',
      desc: 'Sau ca làm việc, hệ thống tự động tổng hợp quãng đường, nhiên liệu tiết kiệm và lượng CO₂ đã cắt giảm.',
      icon: BarChart3,
      details: 'Tự động xuất báo cáo định kỳ theo chuẩn GLEC Framework phục vụ kiểm toán bền vững ESG.',
    },
  ];

  return (
    <section id="workflow" className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5C7D52]/10 text-[#5C7D52] text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QUY TRÌNH VẬN HÀNH 8 BƯỚC KHÉP KÍN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-4">
            Cách GreenLogix <span className="text-[#5C7D52]">Tự Động Hóa</span> Hoạt Động Giao Hàng
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Từ khâu nhập đơn hàng đầu vào đến khi hoàn thành chuyến và xuất báo cáo phát thải CO₂, toàn bộ quy trình được số hóa minh bạch và thông minh.
          </p>
        </div>

        {/* 8-Step Interactive Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch mb-16 sm:mb-20">
          
          {/* Steps List (Left 6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-start gap-3 w-full ${
                    isActive
                      ? 'bg-green-50/90 border-[#5C7D52] shadow-sm ring-1 ring-[#5C7D52]/30 scale-[1.01]'
                      : 'bg-[#FAFAFA] border-gray-200/70 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-[#5C7D52] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold ${isActive ? 'text-[#5C7D52]' : 'text-gray-400'}`}>
                        BƯỚC {step.num}
                      </span>
                    </div>
                    <h4 className={`text-xs sm:text-sm font-bold leading-snug mt-0.5 ${isActive ? 'text-gray-950' : 'text-gray-800'}`}>
                      {step.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Detail Spotlight Card (Right 6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#111827] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden border border-gray-800 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#5C7D52]/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-gray-700/60 pb-3 sm:pb-4 mb-5 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-bold text-[#74b72e] tracking-widest uppercase">
                  CHI TIẾT NGHIỆP VỤ BƯỚC {steps[activeStep].num}
                </span>
                <div className="flex items-center gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`h-2 rounded-full transition-all ${
                        activeStep === i ? 'w-5 sm:w-6 bg-[#74b72e]' : 'w-2 bg-gray-600 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#5C7D52] flex items-center justify-center text-white shadow-md shrink-0">
                  {React.createElement(steps[activeStep].icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {steps[activeStep].title}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed mb-5 sm:mb-6">
                {steps[activeStep].desc}
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10 mb-6">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Dữ liệu &amp; Tham số xử lý:
                </span>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  {steps[activeStep].details}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-2 transition-colors"
              >
                ← Bước trước
              </button>
              <button
                onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                className="text-xs font-bold text-[#74b72e] hover:text-emerald-300 bg-white/10 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <span>Bước tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Before vs. After Comparison Table */}
        <div className="bg-[#FAFAFA] rounded-3xl p-5 sm:p-8 lg:p-10 border border-gray-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-bold text-[#5C7D52] uppercase tracking-widest block mb-1">
              SO SÁNH ĐỐI CHỨNG TRỰC QUAN
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900">
              Phương Thức Cũ vs. Nền Tảng GreenLogix
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            
            {/* Traditional Method Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-red-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm lg:text-base">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>Điều Phối Thủ Công (Cách Cũ)</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Excel &amp; Kinh nghiệm</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                    <span><strong>Mất 2–3 giờ/ngày</strong> chia đơn thủ công trên Excel, phụ thuộc vào nhân viên điều phối.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                    <span>Tuyến đường bị <strong>chồng chéo</strong>, xe phải quay lại cùng một khu vực nhiều lần trong ngày.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                    <span>Xe thường xuyên <strong>chạy rỗng chiều về</strong> sau khi giao xong tại điểm xa.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                    <span><strong>Hoàn toàn không có dữ liệu</strong> về lượng phát thải CO₂ từng chuyến để báo cáo ESG.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-100 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Chi phí nhiên liệu cao, lãng phí 15–20% km di chuyển</span>
              </div>
            </div>

            {/* GreenLogix Method Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-[#5C7D52] shadow-soft-float flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#5C7D52] text-white text-[9px] sm:text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl">
                Khuyên Dùng
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-[#5C7D52] font-bold text-xs sm:text-sm lg:text-base">
                    <CheckCircle2 className="w-5 h-5 text-[#74b72e] shrink-0" />
                    <span>Giải Pháp Tối Ưu Hóa GreenLogix</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5C7D52] mt-0.5 shrink-0" />
                    <span><strong>Tự động phân tuyến trong 10 giây</strong>, giải phóng 90% thời gian cho đội ngũ điều phối.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5C7D52] mt-0.5 shrink-0" />
                    <span>Thuật toán VRPTW <strong>cắt giảm 8–15% tổng quãng đường</strong> và tối ưu thứ tự giao theo giờ hẹn.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5C7D52] mt-0.5 shrink-0" />
                    <span><strong>Tự động ghép đơn chiều về</strong>, tăng hệ số sử dụng phương tiện và triệt tiêu xe chạy rỗng.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5C7D52] mt-0.5 shrink-0" />
                    <span><strong>Tự động lập báo cáo kiểm kê CO₂</strong> theo chuẩn quốc tế GLEC &amp; ISO 14083 chỉ với 1 click.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                <span className="text-[11px] sm:text-xs font-bold text-[#5C7D52]">
                  Tiết kiệm chi phí + Nâng cao năng lực cạnh tranh xanh
                </span>
                <button
                  onClick={onOpenPilotModal}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-sm flex items-center gap-1 shrink-0"
                >
                  <span>Dùng Thử</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
