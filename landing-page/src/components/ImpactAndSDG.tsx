import React from 'react';
import { Leaf, Globe } from 'lucide-react';

export const ImpactAndSDG: React.FC = () => {
  const sdgs = [
    {
      num: 'SDG 9',
      title: 'Công Nghiệp, Sáng Tạo & Hạ Tầng',
      desc: 'Thúc đẩy chuyển đổi số và ứng dụng thuật toán toán học tiên tiến vào hiện đại hóa hạ tầng logistics quốc gia.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      num: 'SDG 11',
      title: 'Đô Thị & Cộng Đồng Bền Vững',
      desc: 'Giảm bớt mật độ chuyến xe thừa, hạn chế ùn tắc giao thông giờ cao điểm và giảm ô nhiễm tiếng ồn tại TP.HCM & Hà Nội.',
      color: 'from-emerald-500 to-green-600',
    },
    {
      num: 'SDG 12',
      title: 'Sản Xuất & Tiêu Dùng Có Trách Nhiệm',
      desc: 'Tối ưu chuỗi cung ứng, giảm hao phí nhiên liệu và xây dựng mô hình logistics tuần hoàn thông qua ghép đơn chiều về.',
      color: 'from-teal-500 to-cyan-600',
    },
    {
      num: 'SDG 13',
      title: 'Hành Động Vì Khí Hậu',
      desc: 'Định lượng và cắt giảm trực tiếp 5–12% lượng phát thải CO₂ trên mỗi đơn hàng, đóng góp vào mục tiêu Net Zero 2050.',
      color: 'from-green-600 to-emerald-700',
    },
  ];

  return (
    <section id="impact" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C7D52]/10 text-[#5C7D52] text-xs font-bold tracking-widest uppercase mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>TÁC ĐỘNG MÔI TRƯỜNG &amp; XÃ HỘI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Đồng Hành Cùng Mục Tiêu <span className="text-[#5C7D52]">Net Zero 2050</span>
          </h2>
          <p className="text-base text-gray-600">
            GreenLogix không chỉ là một phần mềm tối ưu kinh tế, mà còn là công cụ giúp doanh nghiệp logistics đáp ứng các tiêu chuẩn xuất khẩu và phát triển bền vững.
          </p>
        </div>

        {/* 4 SDGs Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {sdgs.map((item) => (
            <div
              key={item.num}
              className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-200/80 hover:border-[#5C7D52]/40 hover:shadow-soft-float transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`inline-block px-3 py-1 rounded-lg text-white font-extrabold text-xs bg-gradient-to-r ${item.color} shadow-sm mb-4`}>
                  {item.num}
                </div>
                <h4 className="text-base font-bold text-gray-900 leading-snug mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-[#5C7D52]">
                <Leaf className="w-3 h-3" />
                <span>Chuẩn Bền Vững LHQ</span>
              </div>
            </div>
          ))}
        </div>

        {/* National Policy Alignment Box */}
        <div className="bg-gradient-to-r from-[#F2F7F0] via-white to-[#F2F7F0] rounded-3xl p-8 sm:p-10 border border-[#5C7D52]/20 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4">
              <span className="text-xs font-bold text-[#5C7D52] uppercase tracking-widest block mb-1">
                CHÍNH SÁCH QUỐC GIA
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
                Bám Sát Các Quyết Định Của Thủ Tướng Chính Phủ
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Dự án được xây dựng phù hợp tuyệt đối với định hướng chuyển đổi xanh và số hóa của ngành giao thông vận tải Việt Nam.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-sm">
                <div className="text-xs font-bold text-gray-900 mb-1">Quyết định 2229/QĐ-TTg</div>
                <div className="text-[11px] text-emerald-700 font-semibold mb-2">Chiến Lược Logistics 2025–2035</div>
                <p className="text-xs text-gray-500">Xác định chuyển đổi số và tối ưu chuỗi cung ứng là trụ cột chiến lược quốc gia.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-sm">
                <div className="text-xs font-bold text-gray-900 mb-1">Quyết định 876/QĐ-TTg</div>
                <div className="text-[11px] text-emerald-700 font-semibold mb-2">Giao Thông Xanh &amp; Net Zero</div>
                <p className="text-xs text-gray-500">Mục tiêu giảm 45,62 triệu tấn CO₂ ngành GTVT đến năm 2030, hướng tới Net Zero 2050.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-sm">
                <div className="text-xs font-bold text-gray-900 mb-1">Quyết định 1658/QĐ-TTg</div>
                <div className="text-[11px] text-emerald-700 font-semibold mb-2">Tăng Trưởng Xanh Quốc Gia</div>
                <p className="text-xs text-gray-500">Xác định dịch vụ logistics và vận tải xanh là 1 trong 18 chủ đề trọng yếu.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
