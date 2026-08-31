import React from 'react';
import { Tag, Check, Sparkles, ArrowRight } from 'lucide-react';

interface PricingProps {
  onOpenPilotModal: () => void;
}

export const PricingAndPilot: React.FC<PricingProps> = ({ onOpenPilotModal }) => {
  const tiers = [
    {
      name: 'Gói Starter',
      desc: 'Mức khởi đầu dễ tiếp cận cho đơn vị mới đưa hoạt động giao nhận lên hệ thống.',
      price: '1,5 – 2,5 triệu',
      unit: '/ tháng',
      vehicles: 'Tối đa 10 tài xế',
      features: [
        'Tự động sắp xếp tuyến giao hàng cơ bản',
        'Nhập đơn hàng từ bảng tính',
        'Hỗ trợ thiết lập và bắt đầu sử dụng',
      ],
      highlight: false,
    },
    {
      name: 'Gói Nhỏ',
      desc: 'Phù hợp với đội giao nhận nhỏ cần theo dõi đơn hàng và tài xế tập trung.',
      price: '3 – 5 triệu',
      unit: '/ tháng',
      vehicles: 'Từ 11 – 20 tài xế',
      features: [
        'Tất cả tính năng của gói Starter',
        'Tích hợp dữ liệu giao thông thời gian thực',
        'Theo dõi tài xế và tiến độ đơn hàng',
      ],
      highlight: true,
      badge: 'PHỔ BIẾN NHẤT',
    },
    {
      name: 'Gói Vừa',
      desc: 'Dành cho doanh nghiệp có nhiều tuyến và cần kiểm soát hiệu quả vận hành sâu hơn.',
      price: '8 – 15 triệu',
      unit: '/ tháng',
      vehicles: 'Từ 21 – 100 tài xế',
      features: [
        'Tất cả tính năng của gói Nhỏ',
        'Tự động ghép đơn cho chiều xe quay về',
        'Báo cáo nhiên liệu và lượng CO₂',
      ],
      highlight: false,
    },
    {
      name: 'Gói Lớn',
      desc: 'Giải pháp linh hoạt cho mạng lưới giao nhận lớn hoặc có yêu cầu vận hành riêng.',
      price: '20 – 40 triệu',
      unit: '/ tháng',
      vehicles: 'Trên 100 tài xế • Có thể thỏa thuận',
      features: [
        'Tùy chỉnh kết nối với hệ thống hiện có',
        'Hạ tầng vận hành theo nhu cầu doanh nghiệp',
        'Hỗ trợ kỹ thuật và đào tạo ưu tiên',
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-white/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-xs font-bold text-greenlogix-lime mb-4">
            <Tag className="w-3.5 h-3.5" />
            <span>BẢNG GIÁ MINH BẠCH &amp; LINH HOẠT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Đầu Tư Thông Minh, <span className="text-greenlogix-lime">Thu Hồi Vốn Nhanh Chóng</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Chọn gói theo số lượng tài xế hoạt động mỗi tháng. Doanh nghiệp có thể bắt đầu nhỏ và nâng cấp khi nhu cầu tăng.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mb-16 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-6 sm:p-8 xl:p-6 flex flex-col justify-between transition-all duration-300 ${
                tier.highlight
                  ? 'bg-slate-900 border-2 border-greenlogix-lime shadow-2xl shadow-greenlogix-lime/10 relative'
                  : 'bg-slate-900/60 border border-white/10 hover:border-white/20'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-greenlogix-lime text-slate-950 font-extrabold text-[10px] tracking-wider rounded-full shadow-md uppercase">
                  {tier.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="mb-6 text-xs leading-relaxed text-slate-400">{tier.desc}</p>

                {/* Price Display */}
                <div className="pb-6 mb-6 border-b border-white/10">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">{tier.unit}</span>
                  </div>
                  <div className="text-xs font-bold text-greenlogix-lime mt-1.5">{tier.vehicles}</div>
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
                    ? 'bg-greenlogix-lime hover:bg-yellow-300 text-slate-950 shadow-lg'
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
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-greenlogix-lime/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-greenlogix-lime/10 border border-greenlogix-lime/30 text-xs font-bold text-greenlogix-lime">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CHƯƠNG TRÌNH DÙNG THỬ MIỄN PHÍ 4–6 TUẦN</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trải Nghiệm Miễn Phí Trên Dữ Liệu Thực Tế
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Dành cho <strong>3–5 doanh nghiệp đầu tiên tại TP.HCM</strong> có đội xe từ 5–15 phương tiện. GreenLogix sẽ hỗ trợ chuẩn bị dữ liệu và đo mức tiết kiệm thực tế trước khi doanh nghiệp quyết định sử dụng.
            </p>
          </div>

          <button
            onClick={onOpenPilotModal}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-greenlogix-lime px-6 py-3.5 text-xs font-extrabold text-slate-950 shadow-xl transition-all hover:bg-yellow-300 sm:w-auto sm:px-8 sm:text-sm md:shrink-0"
          >
            <span>Đăng Ký Dùng Thử Miễn Phí</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </section>
  );
};
