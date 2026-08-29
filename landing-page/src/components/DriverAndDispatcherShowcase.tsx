import React, { useState } from 'react';
import { LayoutDashboard, Smartphone, MapPin, Navigation, Camera, Bell, CheckCircle2, Clock, BarChart2 } from 'lucide-react';

export const DriverAndDispatcherShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dispatcher' | 'driver'>('dispatcher');

  return (
    <section id="features" className="py-24 bg-[#F8FAF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C7D52]/10 text-[#5C7D52] text-xs font-bold tracking-widest uppercase mb-4">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>HAI PHÂN HỆ SẢN PHẨM HOÀN CHỈNH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Thiết Kế Chuyên Biệt Cho <span className="text-[#5C7D52]">Điều Phối Viên &amp; Tài Xế</span>
          </h2>
          <p className="text-base text-gray-600">
            Trải nghiệm đồng bộ mượt mà giữa Web Portal trung tâm điều hành và Ứng dụng di động thực thi dành cho tài xế giao nhận.
          </p>

          {/* Tab Switcher Buttons */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm mt-8">
            <button
              onClick={() => setActiveTab('dispatcher')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dispatcher'
                  ? 'bg-[#5C7D52] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Web Portal Điều Phối (Dispatcher)</span>
            </button>

            <button
              onClick={() => setActiveTab('driver')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'driver'
                  ? 'bg-[#5C7D52] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile App Tài Xế (Driver App)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content Showcase */}
        {activeTab === 'dispatcher' ? (
          /* Dispatcher Portal Content */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-soft-float">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Features Description (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-block px-3 py-1 rounded-md bg-green-50 text-[#5C7D52] text-xs font-bold uppercase">
                  Dành cho Chủ Doanh nghiệp &amp; Quản lý bưu cục
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                  Trung Tâm Điều Hành &amp; Giám Sát Vận Tải Thông Minh
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Giao diện tiếng Việt trực quan, dễ dàng nhập dữ liệu từ file Excel/Google Sheets, xem bản đồ lộ trình thời gian thực và quản lý toàn bộ đội xe chỉ trong 1 màn hình.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-[#5C7D52] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Bản Đồ Giám Sát GPS Trực Tuyến</h4>
                      <p className="text-xs text-gray-500">Xem chính xác vị trí các xe, tiến độ giao hàng và cảnh báo khi xe chạy lệch tuyến.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-[#5C7D52] flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Cảnh Báo Đơn Trễ Hạn Thông Minh</h4>
                      <p className="text-xs text-gray-500">Tự động phát hiện nguy cơ trễ giao theo khung giờ hẹn (Time Windows) để kịp thời hỗ trợ.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-[#5C7D52] flex items-center justify-center shrink-0 mt-0.5">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Dashboard Báo Cáo Phát Thải CO₂</h4>
                      <p className="text-xs text-gray-500">Tự động xuất báo cáo ESG, tổng hợp km cắt giảm và lượng nhiên liệu tiết kiệm sau mỗi ca.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Mockup Representation (7 cols) */}
              <div className="lg:col-span-7 bg-[#111827] rounded-2xl p-4 sm:p-6 text-white border border-gray-800 shadow-2xl relative overflow-hidden">
                {/* Mockup Topbar */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                    <span className="text-xs text-gray-400 font-mono ml-2">portal.greenlogix.vn/dispatch</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live GPS Stream
                  </span>
                </div>

                {/* Dashboard Inner Grid */}
                <div className="space-y-4">
                  {/* Summary Stat Mini-cards */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/40">
                      <div className="text-[10px] text-gray-400">Tổng đơn hôm nay</div>
                      <div className="text-base sm:text-lg font-bold text-white">80 / 80 đơn</div>
                    </div>
                    <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/40">
                      <div className="text-[10px] text-gray-400">Đang lưu thông</div>
                      <div className="text-base sm:text-lg font-bold text-emerald-400">10 / 10 xe</div>
                    </div>
                    <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/40">
                      <div className="text-[10px] text-gray-400">CO₂ Tiết giảm</div>
                      <div className="text-base sm:text-lg font-bold text-[#74b72e]">-14.2%</div>
                    </div>
                  </div>

                  {/* Route List Preview */}
                  <div className="bg-gray-900/80 rounded-xl p-3.5 border border-gray-800">
                    <div className="text-xs font-bold text-gray-300 mb-2 flex justify-between">
                      <span>Lộ trình đang hoạt động:</span>
                      <span className="text-[#74b72e] text-[11px]">Đã tối ưu VRPTW</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-gray-800/80 p-2.5 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="font-semibold text-gray-200">Xe 01 (500kg - BKS 59C-124.89)</span>
                        </div>
                        <span className="text-gray-400 text-[11px]">Kho → Q7 → Nhà Bè → Kho (17 đơn)</span>
                      </div>
                      <div className="bg-gray-800/80 p-2.5 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="font-semibold text-gray-200">Xe 02 (1 Tấn - BKS 59C-458.12)</span>
                        </div>
                        <span className="text-gray-400 text-[11px]">Kho → Q1 → Q3 → Phú Nhuận (18 đơn)</span>
                      </div>
                      <div className="bg-gray-800/80 p-2.5 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span className="font-semibold text-gray-200">Xe 03 (Ghép đơn chiều về)</span>
                        </div>
                        <span className="text-emerald-400 text-[11px] font-semibold">Tận dụng chiều về Thủ Đức → Bình Thạnh</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* Driver Mobile App Content */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-soft-float">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left App Features (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-[#74b72e] text-xs font-bold uppercase">
                  Dành cho Tài xế xe máy &amp; xe tải giao hàng
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                  Ứng Dụng Di Động Thông Minh &amp; Đơn Giản Cho Tài Xế
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Thiết kế tối giản, dễ sử dụng ngay cả khi đang chạy trên đường. Không yêu cầu đào tạo phức tạp, chỉ 1-chạm để nhận tuyến và bắt đầu giao hàng.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#74b72e] flex items-center justify-center shrink-0 mt-0.5">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Dẫn Đường 1-Chạm</h4>
                      <p className="text-xs text-gray-500">Mở trực tiếp Google Maps hoặc Apple Maps với tọa độ chính xác từng điểm dừng.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#74b72e] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Hiển Thị Giờ Hẹn &amp; Ghi Chú Đơn</h4>
                      <p className="text-xs text-gray-500">Xem danh sách thứ tự ưu tiên, số điện thoại người nhận và ghi chú gọi trước.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#74b72e] flex items-center justify-center shrink-0 mt-0.5">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Chụp Ảnh Ký Nhận (Proof of Delivery)</h4>
                      <p className="text-xs text-gray-500">Chụp ảnh biên nhận hoặc hàng hóa tại điểm giao để đối soát minh bạch.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Phone Mockup (7 cols) */}
              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-[320px] bg-gray-900 rounded-[2.5rem] p-3 border-4 border-gray-800 shadow-2xl">
                  {/* Phone Screen */}
                  <div className="bg-white rounded-[2rem] p-4 text-gray-900 overflow-hidden min-h-[460px] flex flex-col justify-between">
                    <div>
                      {/* Driver App Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#5C7D52] text-white flex items-center justify-center font-bold text-xs">
                            GL
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">Nguyễn Văn Tài</div>
                            <div className="text-[10px] text-gray-500">Xe 03 • 59C-882.19</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#5C7D52] bg-green-50 px-2 py-0.5 rounded-full">
                          12/15 Đơn
                        </span>
                      </div>

                      {/* Next Stop Card */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
                        <div className="flex justify-between items-center text-[10px] text-[#5C7D52] font-bold uppercase mb-1">
                          <span>Điểm tiếp theo (#13)</span>
                          <span className="text-emerald-700 font-extrabold">Hẹn: 14:30 - 15:00</span>
                        </div>
                        <div className="text-xs font-bold text-gray-900">142 Nguyễn Thị Minh Khai, Q.3</div>
                        <div className="text-[11px] text-gray-600 mt-0.5">Anh Hoàng • 0903.xxx.xxx</div>

                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-green-200/60">
                          <button className="flex-1 py-1.5 rounded-lg bg-[#5C7D52] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm">
                            <Navigation className="w-3 h-3" />
                            <span>Chỉ Đường</span>
                          </button>
                          <button className="flex-1 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-[11px] font-bold flex items-center justify-center gap-1">
                            <Camera className="w-3 h-3" />
                            <span>Chụp Ảnh</span>
                          </button>
                        </div>
                      </div>

                      {/* Backhaul Suggestion Card */}
                      <div className="bg-emerald-950 text-white rounded-xl p-3 mb-2 border border-emerald-700/50">
                        <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
                          <span>ĐƠN CHIỀU VỀ GỢI Ý 🔥</span>
                          <span>+85.000đ</span>
                        </div>
                        <div className="text-xs font-semibold">Lấy hàng từ Q.3 về Bưu cục Kho</div>
                        <div className="text-[10px] text-gray-300 mt-0.5">Cách vị trí hiện tại 450m • Nhận lúc 15:15</div>
                      </div>
                    </div>

                    {/* Bottom Status Update */}
                    <button className="w-full py-2.5 rounded-xl bg-[#5C7D52] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác Nhận Đã Giao Thành Công</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
