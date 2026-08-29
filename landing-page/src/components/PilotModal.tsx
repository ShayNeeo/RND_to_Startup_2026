import React, { useState } from 'react';
import { X, CheckCircle2, Leaf, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PilotModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    vehiclesCount: '5–15 xe',
    city: 'TP. Hồ Chí Minh',
    phone: '',
    email: '',
    note: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5C7D52', '#74b72e', '#4a6541', '#a7f3d0'],
      });
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      company: '',
      vehiclesCount: '5–15 xe',
      city: 'TP. Hồ Chí Minh',
      phone: '',
      email: '',
      note: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-[#5C7D52] flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#74b72e] uppercase tracking-wider block">
                  CHƯƠNG TRÌNH DÙNG THỬ PILOT 4–6 TUẦN
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Đăng Ký Trải Nghiệm GreenLogix
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Hoàn toàn <strong>miễn phí</strong> cho 3–5 doanh nghiệp đầu tiên. Đội ngũ kỹ thuật sẽ hỗ trợ chuẩn hóa dữ liệu và đào tạo trực tiếp tại bưu cục.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và tên người liên hệ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7D52] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tên Doanh nghiệp / Bưu cục *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="VD: Bưu cục Viettel Post Q.7"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7D52] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7D52] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email công việc *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7D52] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Quy mô đội xe giao hàng
                  </label>
                  <select
                    value={formData.vehiclesCount}
                    onChange={(e) => setFormData({ ...formData, vehiclesCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7D52]"
                  >
                    <option>Dưới 5 xe</option>
                    <option>5–15 xe (Thử nghiệm 1-2 bưu cục)</option>
                    <option>16–30 xe (Thử nghiệm chuỗi)</option>
                    <option>Trên 30 xe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Địa bàn hoạt động chính
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7D52]"
                  >
                    <option>TP. Hồ Chí Minh (Ưu tiên đợt 1)</option>
                    <option>Hà Nội (Đợt 2)</option>
                    <option>Bình Dương / Đồng Nai</option>
                    <option>Đà Nẵng / Khu vực khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Khó khăn điều phối lớn nhất hiện tại (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="VD: Đơn hàng kẹt giờ cao điểm, xe chạy rỗng chiều về, chưa có báo cáo CO2..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C7D52]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#5C7D52] hover:bg-[#4a6541] shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Gửi Thông Tin Đăng Ký Pilot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5C7D52]" />
                <span>Cam kết bảo mật dữ liệu doanh nghiệp theo Nghị định 13/2023/NĐ-CP.</span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-green-100 text-[#5C7D52] flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              Đăng Ký Pilot Thành Công!
            </h3>

            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              Cảm ơn <strong>{formData.fullName}</strong> ({formData.company}). Đội ngũ GreenLogix sẽ liên hệ trực tiếp qua số điện thoại <strong>{formData.phone}</strong> trong vòng 24h để kích hoạt môi trường thử nghiệm cho bưu cục của bạn.
            </p>

            <div className="bg-green-50 rounded-2xl p-4 border border-green-200/80 text-xs text-left max-w-sm mx-auto space-y-1.5 mb-6">
              <div className="text-[#5C7D52] font-bold">📋 Bản tóm tắt đăng ký:</div>
              <div>• Doanh nghiệp: <strong>{formData.company}</strong></div>
              <div>• Quy mô: <strong>{formData.vehiclesCount}</strong> tại <strong>{formData.city}</strong></div>
              <div>• Email: <strong>{formData.email}</strong></div>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#5C7D52] hover:bg-[#4a6541] transition-all"
            >
              Hoàn Tất &amp; Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
