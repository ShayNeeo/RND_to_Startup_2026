import React from 'react';
import { Route, Clock, RefreshCw, BarChart3, Cpu, CheckCircle } from 'lucide-react';

export const Solutions: React.FC = () => {
  const solutions = [
    {
      id: '01',
      icon: <Route className="w-6 h-6 text-[#ffda00]" />,
      badge: 'Thuật Toán Cốt Lõi',
      title: 'Tối Ưu Tuyến Đường Đa Ràng Buộc (VRPTW)',
      description:
        'Tự động gom nhóm đơn hàng theo cụm địa lý, tính toán tải trọng phương tiện (500kg - 2 tấn) và khung giờ giao hàng cam kết để tạo lộ trình tối ưu chỉ trong vài giây.',
      metrics: ['Giảm 8–15% tổng quãng đường', 'Tránh chồng chéo điểm giao', 'Tiết kiệm 5–10% nhiên liệu'],
      gradient: 'from-amber-500/10 to-yellow-500/5',
    },
    {
      id: '02',
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      badge: 'Thời Gian Thực',
      title: 'Tích Hợp Dữ Liệu Giao Thông Trực Tuyến Live',
      description:
        'Cập nhật mật độ xe và điểm ùn tắc thời gian thực theo từng cung đường đô thị tại TP.HCM & Hà Nội, chủ động đề xuất lộ trình thay thế tránh kẹt xe giờ cao điểm.',
      metrics: ['Tăng tỷ lệ giao đúng hẹn 98.8%', 'Giảm thời gian chờ tài xế', 'Cảnh báo lệch tuyến tức thì'],
      gradient: 'from-emerald-500/10 to-teal-500/5',
    },
    {
      id: '03',
      icon: <RefreshCw className="w-6 h-6 text-cyan-400" />,
      badge: 'Logistics Tuần Hoàn',
      title: 'Tự Động Ghép Đơn Hàng Chiều Về (Backhaul)',
      description:
        'Phát hiện và ghép các đơn lấy hàng chiều về ngay khi xe vừa hoàn thành tuyến giao tại điểm đích, giải quyết triệt để vấn đề xe chạy rỗng lãng phí.',
      metrics: ['Giảm 10–20% xe chạy rỗng', 'Tận dụng 100% tải trọng xe', 'Tăng thu nhập chuyến xe'],
      gradient: 'from-cyan-500/10 to-blue-500/5',
    },
    {
      id: '04',
      icon: <BarChart3 className="w-6 h-6 text-[#ffda00]" />,
      badge: 'ESG & Kiểm Kê',
      title: 'Đo Lường Phát Thải CO₂ Chuẩn Quốc Tế ISO 14083',
      description:
        'Tự động định lượng lượng khí CO₂ phát thải trên từng chuyến xe và đơn hàng theo chuẩn GLEC Framework, sẵn sàng xuất báo cáo ESG cho đối tác chuỗi cung ứng.',
      metrics: ['Cắt giảm 5–12% CO₂ / đơn hàng', 'Báo cáo chuẩn ESG xuất khẩu', 'Chuẩn hóa lộ trình chuyển đổi xe điện'],
      gradient: 'from-amber-500/10 to-emerald-500/5',
    },
  ];

  return (
    <section id="solutions" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950/80 border-t border-white/5 scroll-mt-24">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ffda00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-xs font-bold text-[#ffda00] mb-4 shadow-sm">
            <Cpu className="w-3.5 h-3.5" />
            <span>NỀN TẢNG CÔNG NGHỆ B2B TIÊN PHONG</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Giải Quyết Triệt Để Lãng Phí Vận Hành Với <span className="text-[#ffda00]">4 Trụ Cột Đột Phá</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Chuyển đổi từ phương thức điều phối thủ công trên Excel/Google Sheets sang mô hình điều hành tự động hóa thông minh, giúp doanh nghiệp vận chuyển ít lãng phí hơn, tiết kiệm nhiều hơn và phát triển xanh hơn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {solutions.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-3xl p-8 sm:p-9 bg-gradient-to-br ${item.gradient} bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-[#ffda00]/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-black/30 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 bg-slate-800/60 border border-white/10 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#ffda00] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 border-t border-white/10 space-y-2.5">
                {item.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <CheckCircle className="w-4 h-4 text-[#ffda00] shrink-0" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
