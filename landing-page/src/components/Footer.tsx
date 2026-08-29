import React from 'react';
import { Leaf, Mail, Phone, MapPin, Award } from 'lucide-react';

interface FooterProps {
  onOpenPilotModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPilotModal }) => {
  return (
    <footer className="bg-[#111827] text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          
          {/* Col 1: Brand & Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5C7D52] to-[#74b72e] flex items-center justify-center text-white shadow-md">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                GREEN<span className="text-[#74b72e]">LOGIX</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Nền tảng phần mềm tối ưu hóa tuyến đường vận tải đô thị và tự động đo lường phát thải CO₂ theo chuẩn quốc tế GLEC Framework &amp; ISO 14083.
            </p>

            <div className="text-xs text-[#74b72e] font-semibold flex items-center gap-1.5 pt-2">
              <Award className="w-4 h-4" />
              <span>Dự án tham dự Tuổi Trẻ Startup Award 2026</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Giải Pháp
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#solutions" className="hover:text-[#74b72e] transition-colors">Thuật toán VRPTW</a></li>
              <li><a href="#solutions" className="hover:text-[#74b72e] transition-colors">Dữ liệu giao thông live</a></li>
              <li><a href="#solutions" className="hover:text-[#74b72e] transition-colors">Ghép đơn chiều về</a></li>
              <li><a href="#solutions" className="hover:text-[#74b72e] transition-colors">Báo cáo kiểm kê CO₂</a></li>
              <li><a href="#calculator" className="hover:text-[#74b72e] transition-colors">Bộ tính ROI &amp; CO₂</a></li>
            </ul>
          </div>

          {/* Col 3: Product Modules (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Phân Hệ Sản Phẩm
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#features" className="hover:text-[#74b72e] transition-colors">Web Portal Điều phối viên</a></li>
              <li><a href="#features" className="hover:text-[#74b72e] transition-colors">Mobile App Tài xế (Flutter)</a></li>
              <li><a href="#pricing" className="hover:text-[#74b72e] transition-colors">Chương trình Pilot 4–6 tuần</a></li>
              <li><a href="#impact" className="hover:text-[#74b72e] transition-colors">Chuẩn ESG &amp; GLEC Framework</a></li>
              <li><a href="#team" className="hover:text-[#74b72e] transition-colors">Đội ngũ sáng lập</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Pilot CTA (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Liên Hệ &amp; Đăng Ký
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#74b72e] shrink-0" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#74b72e] shrink-0" />
                <span>contact@greenlogix.vn / shayneeo@0.id.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#74b72e] shrink-0" />
                <span>0889.917.555 / 0376.393.999</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPilotModal}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-gray-950 bg-gradient-to-r from-emerald-400 to-[#74b72e] hover:brightness-105 transition-all shadow-sm"
              >
                Đăng Ký Pilot Miễn Phí
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © 2026 GreenLogix. Bản quyền thuộc về đội ngũ RnD To Startup 2026.
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Bảo mật dữ liệu NĐ 13/2023</span>
            <span>•</span>
            <span>Tiêu chuẩn ISO 14083</span>
            <span>•</span>
            <span>Net Zero 2050</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
