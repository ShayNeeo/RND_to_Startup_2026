import React, { useState, useMemo } from 'react';
import { Calculator, Leaf, DollarSign, Fuel, Truck, Sparkles, ArrowRight } from 'lucide-react';

interface CalculatorProps {
  onOpenPilotModal: () => void;
}

export const InteractiveSavingsCalculator: React.FC<CalculatorProps> = ({ onOpenPilotModal }) => {
  const [vehicles, setVehicles] = useState<number>(15);
  const [kmPerDay, setKmPerDay] = useState<number>(75);
  const [fuelType, setFuelType] = useState<'diesel' | 'gasoline'>('diesel');
  const [reductionRate, setReductionRate] = useState<number>(11); // 11% average

  // Pricing constants (VND)
  const DIESEL_PRICE = 21000;
  const GASOLINE_PRICE = 23000;
  const WORKING_DAYS_PER_MONTH = 26;
  
  // Fuel consumption: average 11 liters per 100km for urban delivery vans/small trucks
  const FUEL_CONSUMPTION_PER_100KM = 11;
  
  // Emission factors (GLEC Framework / IPCC):
  // Diesel: 2.68 kg CO2e / liter
  // Gasoline: 2.31 kg CO2e / liter
  const DIESEL_EMISSION_FACTOR = 2.68;
  const GASOLINE_EMISSION_FACTOR = 2.31;

  const calculations = useMemo(() => {
    const fuelPrice = fuelType === 'diesel' ? DIESEL_PRICE : GASOLINE_PRICE;
    const emissionFactor = fuelType === 'diesel' ? DIESEL_EMISSION_FACTOR : GASOLINE_EMISSION_FACTOR;

    const totalKmPerMonth = vehicles * kmPerDay * WORKING_DAYS_PER_MONTH;
    const totalFuelLitersPerMonth = (totalKmPerMonth * FUEL_CONSUMPTION_PER_100KM) / 100;
    const baselineMonthlyFuelCost = totalFuelLitersPerMonth * fuelPrice;
    
    // Savings calculation
    const monthlyFuelCostSavings = baselineMonthlyFuelCost * (reductionRate / 100);
    const yearlyFuelCostSavings = monthlyFuelCostSavings * 12;

    const monthlyKmSaved = totalKmPerMonth * (reductionRate / 100);
    const yearlyKmSaved = monthlyKmSaved * 12;

    const monthlyCO2SavedKg = (monthlyKmSaved * FUEL_CONSUMPTION_PER_100KM / 100) * emissionFactor;
    const yearlyCO2SavedTons = (monthlyCO2SavedKg * 12) / 1000;

    // 1 adult urban tree absorbs roughly 22 kg CO2 per year
    const treesEquivalent = Math.round((yearlyCO2SavedTons * 1000) / 22);

    return {
      baselineMonthlyFuelCost,
      monthlyFuelCostSavings,
      yearlyFuelCostSavings,
      monthlyKmSaved,
      yearlyKmSaved,
      monthlyCO2SavedKg,
      yearlyCO2SavedTons,
      treesEquivalent,
    };
  }, [vehicles, kmPerDay, fuelType, reductionRate]);

  return (
    <section id="calculator" className="py-20 sm:py-24 bg-white relative overflow-hidden border-y border-gray-100">
      {/* Background radial accent */}
      <div className="absolute top-1/2 -right-40 w-72 sm:w-96 h-72 sm:h-96 bg-[#5C7D52]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-72 sm:w-96 h-72 sm:h-96 bg-[#74b72e]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5C7D52]/10 text-[#5C7D52] text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>MÔ PHỎNG LỢI ÍCH TÀI CHÍNH &amp; MÔI TRƯỜNG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight mb-3 sm:mb-4">
            Đội Xe Của Bạn Sẽ <span className="text-[#5C7D52]">Tiết Kiệm Bao Nhiêu</span> Mỗi Năm?
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Kéo các thanh trượt theo quy mô thực tế của doanh nghiệp để ước tính lượng chi phí nhiên liệu cắt giảm và số tấn CO₂ giảm phát thải theo chuẩn <strong className="font-semibold text-gray-800">GLEC Framework</strong>.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Inputs Panel (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAFAFA] rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Truck className="w-5 h-5 text-[#5C7D52]" />
                <span>Thông Số Đội Xe Của Bạn</span>
              </h3>

              {/* Input 1: Number of vehicles */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Số lượng phương tiện:</label>
                  <span className="text-sm sm:text-base font-extrabold text-[#5C7D52] bg-green-50 px-3 py-1 rounded-lg border border-green-200/60">
                    {vehicles} xe
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="80"
                  step="1"
                  value={vehicles}
                  onChange={(e) => setVehicles(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5C7D52]"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] text-gray-400 mt-1">
                  <span>2 xe (Pilot nhỏ)</span>
                  <span>40 xe</span>
                  <span>80 xe (Đội xe lớn)</span>
                </div>
              </div>

              {/* Input 2: Average km per vehicle per day */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Quãng đường TB / xe / ngày:</label>
                  <span className="text-sm sm:text-base font-extrabold text-[#5C7D52] bg-green-50 px-3 py-1 rounded-lg border border-green-200/60">
                    {kmPerDay} km
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="160"
                  step="5"
                  value={kmPerDay}
                  onChange={(e) => setKmPerDay(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5C7D52]"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] text-gray-400 mt-1">
                  <span>30 km/ngày (Nội thành hẹp)</span>
                  <span>100 km</span>
                  <span>160 km/ngày (Liên quận)</span>
                </div>
              </div>

              {/* Input 3: Fuel Type */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Loại nhiên liệu chính:</label>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setFuelType('diesel')}
                    className={`py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                      fuelType === 'diesel'
                        ? 'bg-[#5C7D52] text-white border-[#5C7D52] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Fuel className="w-4 h-4" />
                    <span>Dầu Diesel (0.05S)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFuelType('gasoline')}
                    className={`py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                      fuelType === 'gasoline'
                        ? 'bg-[#5C7D52] text-white border-[#5C7D52] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Fuel className="w-4 h-4" />
                    <span>Xăng RON 95</span>
                  </button>
                </div>
              </div>

              {/* Input 4: Expected Reduction Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">% Quãng đường tối ưu dự kiến:</label>
                  <span className="text-xs sm:text-sm font-extrabold text-[#74b72e] bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    {reductionRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="15"
                  step="0.5"
                  value={reductionRate}
                  onChange={(e) => setReductionRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#74b72e]"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] text-gray-400 mt-1">
                  <span>8% (Thấp nhất)</span>
                  <span>11% (Mục tiêu thực tế)</span>
                  <span>15% (Tối ưu cao)</span>
                </div>
              </div>
            </div>

            {/* Subnote */}
            <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-gray-200 text-[10px] sm:text-[11px] text-gray-500">
              * Dựa trên định mức tiêu hao trung bình 11 lít/100km và hệ số phát thải GLEC v3.0 quốc tế.
            </div>
          </div>

          {/* Right Results Panel (7 cols) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#111827] via-[#1E293B] to-[#0F172A] rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#74b72e]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-gray-700/60 pb-3 sm:pb-4 mb-6 sm:mb-8">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#74b72e] tracking-widest uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    KẾT QUẢ DỰ PHÓNG TIẾT KIỆM
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold text-white mt-1">Giá Trị Kép (Kinh Tế &amp; Môi Trường)</h4>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[11px] text-gray-400">Thời gian tính:</span>
                  <div className="text-xs font-semibold text-gray-200">1 Năm vận hành</div>
                </div>
              </div>

              {/* Highlight Big Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                
                {/* Card 1: Yearly Money Saved */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-300 text-xs font-semibold mb-2">
                    <span>Tiết kiệm nhiên liệu / Năm</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                      {Math.round(calculations.yearlyFuelCostSavings).toLocaleString('vi-VN')} <span className="text-xs sm:text-sm font-normal text-amber-200">VNĐ</span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-400 mt-1">
                      ~{Math.round(calculations.monthlyFuelCostSavings).toLocaleString('vi-VN')} VNĐ / tháng
                    </div>
                  </div>
                </div>

                {/* Card 2: Yearly CO2 Saved */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-300 text-xs font-semibold mb-2">
                    <span>Giảm phát thải CO₂ / Năm</span>
                    <Leaf className="w-4 h-4 text-[#74b72e]" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#74b72e] tracking-tight">
                      {calculations.yearlyCO2SavedTons.toFixed(1)} <span className="text-xs sm:text-sm font-normal text-emerald-200">Tấn CO₂e</span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-400 mt-1">
                      ~{Math.round(calculations.monthlyCO2SavedKg).toLocaleString('vi-VN')} kg CO₂ / tháng
                    </div>
                  </div>
                </div>

              </div>

              {/* Secondary Metrics Row */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                <div className="bg-black/30 rounded-xl p-3 sm:p-3.5 border border-white/5">
                  <div className="text-[10px] sm:text-[11px] text-gray-400">Quãng đường cắt giảm:</div>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-100">
                    {Math.round(calculations.yearlyKmSaved).toLocaleString('vi-VN')} km / năm
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 sm:p-3.5 border border-white/5">
                  <div className="text-[10px] sm:text-[11px] text-gray-400">Tương đương trồng mới:</div>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-emerald-400 flex items-center gap-1">
                    <span>🌲 {calculations.treesEquivalent.toLocaleString('vi-VN')}</span>
                    <span className="text-[10px] sm:text-xs text-gray-300">cây/năm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA within Result Box */}
            <div className="pt-3.5 sm:pt-4 border-t border-gray-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="text-[11px] sm:text-xs text-gray-300 text-center sm:text-left">
                Bạn muốn áp dụng thử nghiệm miễn phí trên các tuyến bưu cục thực tế?
              </div>
              <button
                onClick={onOpenPilotModal}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-gray-950 bg-gradient-to-r from-emerald-400 to-[#74b72e] hover:brightness-105 shadow-md shadow-emerald-900/30 flex items-center justify-center gap-2 shrink-0 transition-all"
              >
                <span>Nhận Kế Hoạch Pilot Riêng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
