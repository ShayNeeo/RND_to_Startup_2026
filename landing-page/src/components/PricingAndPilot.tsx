import React from 'react';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface PricingProps {
  onOpenPilotModal: () => void;
}

export const PricingAndPilot: React.FC<PricingProps> = ({ onOpenPilotModal }) => {
  const tiers = [
    {
      name: 'CHƯƠNG TRÌNH PILOT',
      badge: 'Đang Mở Tuyển 3–5 Doanh Nghiệp',
      price: '0',
      unit: 'VNĐ / 4–6 Tuần',
      desc: 'Dành cho các đơn vị vận chuyển & bưu cục muốn kiểm chứng thực tế hiệu quả giảm chi phí & CO₂.',
      isFeatured: true,
      buttonText: 'Đăng Ký Tham Gia Pilot',
      features: [
        'Thử nghiệm trên 2–4 bưu cục thực tế',
        'Tối ưu cho 20–50 tài xế / xe giao hàng',
        'Hỗ trợ kỹ thuật onsite & đào tạo trực tiếp',
        'Làm sạch & chuẩn hóa dữ liệu bưu cục',
        'Báo cáo đối chứng Trước vs. Sau hoàn toàn miễn phí',
        'Báo cáo kiểm kê phát thải CO₂ giai đoạn thử nghiệm',
      ],
    },
    {
      name: 'GÓI TIÊU CHUẨN (STANDARD)',
      badge: 'Mô hình Hybrid Linh hoạt',
      price: '800.000',
      unit: 'VNĐ / Admin / Tháng',
      addon: '+ 40.000 VNĐ / tài xế active / tháng',
      desc: 'Phù hợp cho bưu cục độc lập hoặc doanh nghiệp vận tải quy mô 10–30 phương tiện.',
      isFeatured: false,
      buttonText: 'Liên Hệ Báo Giá',
      features: [
        '1 Tài khoản Quản trị / Điều phối viên (Web Portal)',
        'Ứng dụng tài xế không giới hạn lượt tải',
        'Thuật toán tối ưu tuyến VRPTW không giới hạn đơn',
        'Tích hợp bản đồ & dữ liệu giao thông real-time',
        'Tự động ghép đơn chiều về (Backhaul matching)',
        'Xuất báo cáo phát thải CO₂ định kỳ',
        'Hỗ trợ kỹ thuật qua Hotline/Zalo/Slack',
      ],
    },
    {
      name: 'GÓI DOANH NGHIỆP (ENTERPRISE)',
      badge: 'Tùy biến theo chuỗi',
      price: '1.800.000',
      unit: 'VNĐ / Admin / Tháng',
      addon: 'Chiết khấu tài xế theo số lượng lớn',
      desc: 'Dành cho chuỗi logistics, sàn TMĐT lớn có nhu cầu tích hợp sâu hệ thống ERP/TMS có sẵn.',
      isFeatured: false,
      buttonText: 'Tư Vấn Giải Pháp',
      features: [
        'Không giới hạn tài khoản điều phối viên & bưu cục',
        'Tích hợp API hai chiều với hệ thống ERP/WMS/TMS sẵn có',
        'Báo cáo ESG chuyên sâu phục vụ kiểm toán độc lập',
        'Mô hình máy chủ riêng (Private Cloud Dedicated)',
        'Cam kết chất lượng dịch vụ SLA 99.9%',
        'Chuyên gia tư vấn tối ưu chuỗi cung ứng riêng',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C7D52]/10 text-[#5C7D52] text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHÍNH SÁCH GIÁ &amp; CHƯƠNG TRÌNH THỬ NGHIỆM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-4">
            Lựa Chọn Gói Dịch Vụ Phù Hợp <span className="text-[#5C7D52]">Quy Mô Đội Xe</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Chính sách giá minh bạch, linh hoạt theo mô hình SaaS kết hợp phí tài xế hoạt động giúp tối ưu chi phí đầu tư cho doanh nghiệp.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12 sm:mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.isFeatured
                  ? 'bg-white border-2 border-[#5C7D52] shadow-xl shadow-green-900/10 lg:-translate-y-2 z-20'
                  : 'bg-white border border-gray-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              {tier.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5C7D52] text-white text-[10px] sm:text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                  Chương Trình Khuyên Dùng
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-wider">
                    {tier.name}
                  </h3>
                </div>

                <div className="inline-block text-[10px] sm:text-[11px] font-semibold text-[#5C7D52] bg-green-50 px-2.5 py-0.5 rounded-md mb-3 sm:mb-4 border border-green-200/50">
                  {tier.badge}
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {tier.unit}
                    </span>
                  </div>
                  {tier.addon && (
                    <div className="text-xs font-semibold text-[#74b72e] mt-1">
                      {tier.addon}
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5 sm:mb-6 border-b border-gray-100 pb-4">
                  {tier.desc}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-900 uppercase tracking-wider block">
                    Quyền lợi bao gồm:
                  </span>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-green-100 text-[#5C7D52] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenPilotModal}
                className={`w-full py-3 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                  tier.isFeatured
                    ? 'bg-[#5C7D52] hover:bg-[#4a6541] text-white shadow-md shadow-green-900/20 hover:shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <span>{tier.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* FAQ or Assurance note */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-[#5C7D52] flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            <strong className="text-gray-900 font-semibold">Doanh nghiệp chưa có dữ liệu chuẩn?</strong> Đội ngũ kỹ thuật GreenLogix sẽ trực tiếp hỗ trợ bưu cục bạn chuyển đổi từ bảng tính Excel/Google Sheets trong suốt 4–6 tuần pilot.
          </div>
        </div>

      </div>
    </section>
  );
};
