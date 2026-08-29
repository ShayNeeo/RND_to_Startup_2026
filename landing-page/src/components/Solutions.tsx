import React from 'react';
import { Route, Navigation, Repeat, Leaf, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SolutionsProps {
  onOpenPilotModal: () => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ onOpenPilotModal }) => {
  const solutions = [
    {
      id: 'vrp-engine',
      title: 'Thuật Toán VRP Đa Ràng Buộc',
      subtitle: 'Smart VRPTW Engine',
      description:
        'Tự động gom cụm đơn hàng (Clustering) và phân bổ tải trọng xe tối ưu theo khung giờ giao cam kết (Time Windows), loại bỏ hoàn toàn việc phân tuyến thủ công.',
      icon: Route,
      badge: 'Lõi Thuật Toán',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Xử lý 50–500 đơn hàng trong <10 giây',
        'Tối ưu tải trọng xe máy & xe tải nhỏ',
        'Cân bằng khối lượng công việc giữa các tài xế',
      ],
    },
    {
      id: 'traffic-navigation',
      title: 'Điều Hướng Giao Thông Real-time',
      subtitle: 'Live Traffic Navigation',
      description:
        'Tích hợp dữ liệu giao thông đô thị thời gian thực từ Goong/Mapbox API, tự động cảnh báo điểm ùn tắc và tái định tuyến linh hoạt cho tài xế.',
      icon: Navigation,
      badge: 'Bản Đồ Số & GPS',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Cập nhật mật độ xe & kẹt xe theo thời gian thực',
        'Chỉ đường 1-chạm tích hợp trên App tài xế',
        'Cảnh báo sớm đơn hàng có nguy cơ trễ',
      ],
    },
    {
      id: 'circular-backhaul',
      title: 'Ghép Đơn Chiều Về (Logistics Tuần Hoàn)',
      subtitle: 'Circular Backhaul Matching',
      description:
        'Tự động quét và đề xuất các đơn hàng cần lấy hoặc trả hàng trên lộ trình quay về của xe, triệt tiêu tình trạng xe chạy rỗng lãng phí nhiên liệu.',
      icon: Repeat,
      badge: 'Kinh Tế Tuần Hoàn',
      image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Cắt giảm 10–20% quãng đường xe chạy rỗng',
        'Tăng thêm doanh thu trên cùng một chuyến xe',
        'Tận dụng tối đa tải trọng cả 2 chiều di chuyển',
      ],
    },
    {
      id: 'carbon-accounting',
      title: 'Đo Lường CO₂ & Báo Cáo ESG Chuẩn Hóa',
      subtitle: 'Automated Carbon Accounting',
      description:
        'Hệ thống tự động tính toán lượng phát thải CO₂ trên từng đơn hàng và chuyến xe theo chuẩn quốc tế GLEC Framework & ISO 14083 phục vụ kiểm toán ESG.',
      icon: Leaf,
      badge: 'ESG & Kiểm Kê Xanh',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Đo lường CO₂ chuẩn GLEC Framework v3.0 / Scope 3',
        'So sánh trực quan mức tiết kiệm Trước vs. Sau',
        'Xuất báo cáo ESG cho đối tác xuất khẩu',
      ],
    },
  ];

  return (
    <section id="solutions" className="py-28 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background Dotted Radial Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#5C7D52 2px, transparent 2px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative Circular Accent Rings */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[1.5px] border-[#5C7D52]/20 pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full border-[1.5px] border-[#5C7D52]/15 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border-[1.5px] border-[#5C7D52]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-[#5C7D52]/20 shadow-sm mb-5">
            <span className="h-px w-6 bg-[#5C7D52]"></span>
            <span className="text-xs font-extrabold tracking-widest text-[#5C7D52] uppercase flex items-center gap-1.5">
              GIẢI PHÁP CỐT LÕI <Leaf className="w-3.5 h-3.5 text-[#74b72e] fill-current inline" /> GREENLOGIX
            </span>
            <span className="h-px w-6 bg-[#5C7D52]"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#111827] leading-tight tracking-tight mb-5">
            Tiên Phong Công Nghệ <span className="text-[#5C7D52]">Logistics Bền Vững</span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Sự kết hợp hoàn hảo giữa toán học tối ưu vận tải và công nghệ đo lường khí nhà kính, giúp doanh nghiệp vận hành thông minh hơn mỗi ngày.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch pt-4">
          {solutions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-white rounded-[2rem] border-b-[6px] border-[#5C7D52] shadow-soft-float hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Floating Icon at -top-7 left-8 */}
                <div className="relative">
                  <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Badge top right of image */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#5C7D52] shadow-sm">
                      {item.badge}
                    </div>

                    {/* Curved SVG Mask cutting image bottom into white card body */}
                    <svg
                      className="absolute -bottom-[1px] left-0 right-0 w-full h-10 text-white fill-current"
                      viewBox="0 0 400 40"
                      preserveAspectRatio="none"
                    >
                      <path d="M0,40 C150,0 250,0 400,40 L400,40 L0,40 Z" />
                    </svg>
                  </div>

                  {/* Floating Icon Button */}
                  <div className="absolute top-4 left-6 w-14 h-14 rounded-2xl bg-[#5C7D52] group-hover:bg-[#4a6541] group-hover:-translate-y-1 text-white flex items-center justify-center shadow-lg shadow-green-900/30 transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#74b72e] uppercase tracking-wider block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                      {item.description}
                    </p>

                    {/* Benefit Checklist */}
                    <ul className="space-y-2 border-t border-gray-100 pt-4 mb-6">
                      {item.highlights.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-[#5C7D52] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Action */}
                  <button
                    onClick={onOpenPilotModal}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#5C7D52] bg-green-50/80 hover:bg-[#5C7D52] hover:text-white border border-green-200/60 transition-all flex items-center justify-center gap-1.5 group-hover:shadow-sm"
                  >
                    <span>Khám Phá Tính Năng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
