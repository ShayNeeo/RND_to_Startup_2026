import React from 'react';
import { Tag, Check, Sparkles, ArrowRight } from 'lucide-react';

interface PricingProps {
  onOpenPilotModal: () => void;
}

export const PricingAndPilot: React.FC<PricingProps> = ({ onOpenPilotModal }) => {
  const tiers = [
    {
      name: 'Starter (Khởi Động)',
      desc: 'Phù hợp cho bưu cục nhỏ & đơn vị giao hàng nội thành bước đầu số hóa.',
      price: '1.500.000',
      unit: 'VNĐ / tháng',
      vehicles: 'Tối đa 5 xe hoạt động',
      features: [
        'Thuật toán tối ưu tuyến VRPTW cơ bản',
        'Nhập đơn hàng từ file Excel / Google Sheets',
        'Web Console điều phối viên',
        'Ứng dụng di động Driver App cho 5 tài xế',
        'Báo cáo tổng kết quãng đường & nhiên liệu',
      ],
      highlight: false,
    },
    {
      name: 'Professional (Chuyên Nghiệp)',
      desc: 'Dành cho doanh nghiệp phân phối & bưu cục giao nhận có quy mô trung bình.',
      price: '3.500.000',
      unit: 'VNĐ / tháng',
      vehicles: 'Từ 6 – 20 xe hoạt động',
      features: [
        'Tất cả tính năng của gói Starter',
        'Tích hợp dữ liệu giao thông thời gian thực',
        'Tự động ghép đơn lấy hàng chiều về (Backhaul)',
        'Giám sát GPS Live & cảnh báo trễ hẹn tức thì',
        'Xuất báo cáo kiểm kê CO₂ chuẩn ISO 14083 / ESG',
        'Hỗ trợ kỹ thuật ưu tiên 24/7',
      ],
      highlight: true,
      badge: 'PHỔ BIẾN NHẤT',
    },
    {
      name: 'Enterprise (Doanh Nghiệp)',
      desc: 'Giải pháp tùy biến quy mô lớn cho tập đoàn logistics & chuỗi bán lẻ.',
      price: 'Tùy Chỉnh',
      unit: 'Theo quy mô đội xe',
      vehicles: 'Không giới hạn số lượng xe',
      features: [
        'Tất cả tính năng của gói Professional',
        'Tích hợp API hai chiều với hệ thống ERP / WMS / TMS',
        'Triển khai Private Cloud hoặc On-Premise',
        'Tư vấn tối ưu hóa mạng lưới kho và bưu cục',
        'Cam kết chất lượng dịch vụ SLA 99.9%',
        'Chuyên viên tư vấn & đào tạo onsite riêng biệt',
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-white/5 scroll-mt-24">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-xs font-bold text-[#ffda00] mb-4">
            <Tag className="w-3.5 h-3.5" />
            <span>BẢNG GIÁ MINH BẠCH &amp; LINH HOẠT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Đầu Tư Thông Minh, <span className="text-[#ffda00]">Thu Hồi Vốn Nhanh Chóng</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Mô hình SaaS linh hoạt theo Monthly Active Drivers. Doanh nghiệp chỉ chi trả khi thực sự tạo ra giá trị tiết kiệm.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                tier.highlight
                  ? 'bg-slate-900 border-2 border-[#ffda00] shadow-2xl shadow-[#ffda00]/10 scale-105 relative'
                  : 'bg-slate-900/60 border border-white/10 hover:border-white/20'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#ffda00] text-slate-950 font-extrabold text-[10px] tracking-wider rounded-full shadow-md uppercase">
                  {tier.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed min-h-[36px]">{tier.desc}</p>

                {/* Price Display */}
                <div className="pb-6 mb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">{tier.unit}</span>
                  </div>
                  <div className="text-xs font-bold text-[#ffda00] mt-1.5">{tier.vehicles}</div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenPilotModal}
                className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  tier.highlight
                    ? 'bg-[#ffda00] hover:bg-yellow-300 text-slate-950 shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
                }`}
              >
                <span>Đăng Ký Gói Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Free Pilot Callout Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-[#ffda00]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffda00]/10 border border-[#ffda00]/30 text-xs font-bold text-[#ffda00]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CHƯƠNG TRÌNH DÙNG THỬ PILOT 4–6 TUẦN</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trải Nghiệm Miễn Phí Trên Dữ Liệu Thực Tế
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Dành riêng cho <strong>3–5 doanh nghiệp đầu tiên tại TP.HCM</strong> (đội xe 5–15 phương tiện). Đội ngũ GreenLogix hỗ trợ chuẩn hóa dữ liệu trực tiếp, đo lường chính xác ROI trước khi ký kết.
            </p>
          </div>

          <button
            onClick={onOpenPilotModal}
            className="px-6 sm:px-8 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm text-slate-950 bg-[#ffda00] hover:bg-yellow-300 shadow-xl shrink-0 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Đăng Ký Tham Gia Pilot (Free)</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </section>
  );
};
