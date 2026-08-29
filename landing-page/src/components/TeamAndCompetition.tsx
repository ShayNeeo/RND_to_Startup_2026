import React from 'react';
import { Award, GraduationCap, Users, Sparkles } from 'lucide-react';

export const TeamAndCompetition: React.FC = () => {
  const members = [
    {
      name: 'Tống Ngọc Khang',
      school: 'Đại học Kinh tế TP.HCM (UEH)',
      role: 'Business Model & Chiến Lược',
      focus: 'Mô hình kinh doanh SaaS, phân tích thị trường logistics đô thị & tiếp cận đối tác.',
    },
    {
      name: 'Phạm Quốc Thanh',
      school: 'Đại học Quốc tế – ĐHQG TP.HCM (HCMIU)',
      role: 'Tech Lead & Kiến Trúc Hệ Thống',
      focus: 'Kiến trúc Cloud, tích hợp dữ liệu bản đồ số, GPS real-time & bảo mật dữ liệu.',
    },
    {
      name: 'Nguyễn Ngọc Khánh Phương',
      school: 'Đại học Ngoại Thương (FTU2 TP.HCM)',
      role: 'Nghiên Cứu Thị Trường & Phát Triển Bền Vững',
      focus: 'Nghiên cứu nhu cầu bưu cục SME, đo lường tác động xã hội & tiêu chuẩn ESG.',
    },
    {
      name: 'Nguyễn Hồng Phúc',
      school: 'Đại học FPT Hà Nội',
      role: 'Mô Hình Tài Chính & Kế Hoạch Vốn',
      focus: 'Cấu trúc CAPEX/OPEX, dự phóng dòng tiền, phân tích điểm hòa vốn & định giá.',
    },
    {
      name: 'Nguyễn Quang Chiến',
      school: 'Đại học Bách Khoa – ĐH Đà Nẵng (DUT)',
      role: 'Thuật Toán & Tối Ưu Tuyến (VRP)',
      focus: 'Xây dựng giải thuật VRPTW, phân cụm địa lý (clustering) & thuật toán ghép đơn chiều về.',
    },
  ];

  return (
    <section id="team" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C7D52]/10 text-[#5C7D52] text-xs font-bold tracking-widest uppercase mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>ĐỘI NGŨ SÁNG LẬP &amp; PHÁT TRIỂN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Sức Mạnh Liên Ngành <span className="text-[#5C7D52]">RnD To Startup 2026</span>
          </h2>
          <p className="text-base text-gray-600">
            Dự án là sự hội tụ năng lực chuyên sâu từ các trường đại học hàng đầu Việt Nam về kinh tế, công nghệ thông tin, ngoại thương và logistics.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-200/80 hover:border-[#5C7D52]/40 hover:shadow-soft-float transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#5C7D52]/10 text-[#5C7D52] font-extrabold flex items-center justify-center text-sm">
                    {member.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {member.name}
                    </h3>
                    <div className="text-xs text-[#5C7D52] font-semibold flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{member.school}</span>
                    </div>
                  </div>
                </div>

                <div className="inline-block text-[11px] font-bold text-gray-700 bg-white px-2.5 py-1 rounded-md border border-gray-200/80 mb-3">
                  {member.role}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {member.focus}
                </p>
              </div>
            </div>
          ))}

          {/* Special Card: Competition & Mission */}
          <div className="bg-gradient-to-br from-[#111827] to-[#1E293B] rounded-2xl p-6 text-white border border-gray-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                GIẢI THƯỞNG KHỞI NGHIỆP
              </span>
              <h3 className="text-lg font-bold text-white mb-2">
                Tuổi Trẻ Startup Award 2026
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Đề tài xuất sắc chuyển hóa từ nghiên cứu khoa học R&amp;D sang giải pháp thương mại hóa thực tiễn cho ngành logistics Việt Nam.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-700/60 text-[11px] text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#74b72e]" />
              <span>Chương trình ươm tạo &amp; tăng tốc RnD to Startup</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
