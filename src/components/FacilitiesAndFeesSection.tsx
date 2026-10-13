import React, { useState } from 'react';
import { FeeItem, CampusItem } from '../types';

interface FacilitiesAndFeesSectionProps {
  fees: FeeItem[];
  campuses: CampusItem[];
  onOpenConsultation: (service?: string) => void;
}

export const FacilitiesAndFeesSection: React.FC<FacilitiesAndFeesSectionProps> = ({
  fees,
  campuses,
  onOpenConsultation
}) => {
  const [feeCategory, setFeeCategory] = useState<'all' | 'mon_le' | 'combo' | 'ban_tru'>('all');
  const [selectedCampusIndex, setSelectedCampusIndex] = useState<number>(0);

  const filteredFees = fees.filter((f) => {
    if (feeCategory === 'all') return true;
    return f.category === feeCategory;
  });

  const activeCampus = campuses[selectedCampusIndex] || campuses[0];

  return (
    <section id="co-so-hoc-phi" className="py-20 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <i className="fa-solid fa-coins text-amber-600"></i>
            Phần 3: Minh Bạch Tài Chính & Tiêu Chuẩn Cơ Sở
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            CƠ SỞ VẬT CHẤT & BẢNG GIÁ HỌC PHÍ
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Học phí công khai, hợp lý và minh bạch nhất khu vực Quận 12 & Hóc Môn. Cơ sở vật chất đồng bộ, hiện đại tạo môi trường học tập lý tưởng cho học sinh.
          </p>
        </div>

        {/* 1. BẢNG GIÁ HỌC PHÍ */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F294A] flex items-center gap-2.5">
                <i className="fa-solid fa-receipt text-amber-500"></i>
                Bảng Giá Học Phí & Các Gói Dịch Vụ
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lựa chọn môn học đơn lẻ hoặc đăng ký gói combo để hưởng ưu đãi tối đa
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-sm text-xs font-bold">
              <button
                type="button"
                onClick={() => setFeeCategory('all')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  feeCategory === 'all'
                    ? 'bg-[#0F294A] text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFeeCategory('mon_le')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  feeCategory === 'mon_le'
                    ? 'bg-[#0F294A] text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Môn Lẻ
              </button>
              <button
                type="button"
                onClick={() => setFeeCategory('combo')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  feeCategory === 'combo'
                    ? 'bg-[#0F294A] text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Combo Tiết Kiệm
              </button>
              <button
                type="button"
                onClick={() => setFeeCategory('ban_tru')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  feeCategory === 'ban_tru'
                    ? 'bg-[#0F294A] text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gói Bán Trú
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFees.map((fee) => (
              <div
                key={fee.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                  fee.popular
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : 'border-slate-200/90'
                }`}
              >
                {fee.popular && (
                  <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Phổ Biến Nhất ⭐
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/60 inline-block mb-3">
                    {fee.gradeRange}
                  </span>

                  <h4 className="text-lg font-extrabold text-slate-900 leading-snug mb-3">
                    {fee.title}
                  </h4>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-[#0F294A]">
                        {fee.price}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{fee.unit}</span>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 mb-6">
                    {fee.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 shrink-0 text-sm"></i>
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenConsultation(fee.title)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer ${
                    fee.popular
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-[#0F294A] hover:bg-blue-900 text-white'
                  }`}
                >
                  Đăng ký tư vấn gói này
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CƠ SỞ HỌC THÊM & BÁN TRÚ (CHI TIẾT 3 CƠ SỞ) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F294A]">
              Hệ Thống 3 Cơ Sở Dạy Thêm & Bán Trú Trí Tuệ
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Phòng học máy lạnh 100%, trang bị TV thông minh, camera an ninh và bàn ghế đúng chuẩn học đường
            </p>
          </div>

          {/* Campus Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {campuses.map((c, index) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCampusIndex(index)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 border ${
                  selectedCampusIndex === index
                    ? 'bg-[#0F294A] text-amber-400 border-[#0F294A] shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400'
                }`}
              >
                <i className="fa-solid fa-school text-amber-500"></i>
                <span>{c.name}</span>
                {c.hasBoarding && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 font-semibold">
                    Bán trú
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Selected Campus Detail Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Information */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#0F294A] text-amber-400">
                    {activeCampus.name}
                  </span>
                  {activeCampus.hasBoarding && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Trung tâm Dạy Thêm & Nuôi Bán Trú
                    </span>
                  )}
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {activeCampus.landmark}
                </h4>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeCampus.description}
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-map-location-dot text-amber-500 mt-1 shrink-0"></i>
                    <div>
                      <strong>Địa chỉ chính xác:</strong> {activeCampus.address}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-phone text-emerald-600 shrink-0"></i>
                    <div>
                      <strong>Hotline liên hệ:</strong>{' '}
                      <span className="text-emerald-700 font-bold">
                        {activeCampus.hotlines.join(' – ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-clock text-blue-600 shrink-0"></i>
                    <div>
                      <strong>Thời gian mở cửa:</strong> 06h30 – 21h30 (Thứ 2 đến Chủ Nhật)
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      activeCampus.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                  >
                    <i className="fa-solid fa-diamond-turn-right text-blue-600"></i>
                    <span>Xem vị trí trên Google Maps</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onOpenConsultation(`Đăng ký học tại ${activeCampus.name}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F294A] hover:bg-blue-900 text-amber-400 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Đặt lịch tham quan cơ sở</span>
                  </button>
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="lg:col-span-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {activeCampus.featuredImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      className={`relative rounded-2xl overflow-hidden shadow-sm group ${
                        i === 0 ? 'col-span-2 h-56' : 'h-36'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${activeCampus.name} - Ảnh ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-3 text-white text-xs font-semibold">
                        {i === 0
                          ? 'Phòng học máy lạnh & Bảng TV tương tác'
                          : i === 1
                          ? 'Không gian học tập yên tĩnh'
                          : 'Khu vực bán trú & ăn trưa sạch sẽ'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
