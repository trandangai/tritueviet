import React from 'react';
import { CampusItem } from '../types';

interface HeroProps {
  campuses: CampusItem[];
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ campuses, onOpenConsultation }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0F294A] via-[#13335c] to-slate-900 text-white pt-12 pb-20 border-b border-blue-900/50">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 tracking-wide shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            HỆ THỐNG GIÁO DỤC CHẤT LƯỢNG CAO QUẬN 12 & HÓC MÔN
          </div>

          {/* Slogan */}
          <h2 className="text-amber-400 font-extrabold text-lg sm:text-2xl tracking-wider uppercase drop-shadow-sm mb-2 font-['Plus_Jakarta_Sans',sans-serif]">
            ✨ Đồng Hành Cùng Tri Thức – Kiến Tạo Tương Lai ✨
          </h2>

          {/* Official Center Name */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight sm:leading-snug mb-6 tracking-tight">
            TRUNG TÂM DẠY THÊM – NUÔI HỌC SINH BÁN TRÚ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              TRÍ TUỆ
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            Chuyên bồi dưỡng văn hóa, luyện thi tuyển sinh vào lớp 10, luyện thi Đại học khối A, A1, B, D01 và nuôi học sinh bán trú an toàn, chu đáo cho học sinh Cấp 1 & Cấp 2.
          </p>

          {/* Hotlines Banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-gradient-to-r from-blue-950/80 via-blue-900/60 to-blue-950/80 border border-amber-400/40 px-6 py-3 rounded-2xl mb-8 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
              <i className="fa-solid fa-headset text-lg animate-bounce"></i>
              <span>HOTLINE HỆ THỐNG:</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:0988389302"
                className="text-white hover:text-amber-300 font-extrabold text-base sm:text-lg tracking-wide transition hover:underline"
              >
                0988 389 302
              </a>
              <span className="text-amber-400/60">•</span>
              <a
                href="tel:0969620071"
                className="text-white hover:text-amber-300 font-extrabold text-base sm:text-lg tracking-wide transition hover:underline"
              >
                0969 620 071
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#hoc-them"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-base shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <i className="fa-solid fa-calendar-days"></i>
              <span>Xem Thời Khóa Biểu</span>
            </a>
            <button
              type="button"
              onClick={onOpenConsultation}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-xl text-base border border-white/20 transition cursor-pointer"
            >
              <i className="fa-solid fa-file-pen text-amber-400"></i>
              <span>Đăng Ký Tư Vấn Ngay</span>
            </button>
            <a
              href="#ban-tru"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-900/60 hover:bg-blue-800 text-amber-300 font-bold px-6 py-3.5 rounded-xl text-base border border-blue-700/50 transition"
            >
              <i className="fa-solid fa-utensils"></i>
              <span>Gói Bán Trú</span>
            </a>
          </div>
        </div>

        {/* 3 Campuses Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {campuses.map((campus, idx) => (
            <div
              key={campus.id}
              className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-xl hover:border-amber-400/60 transition group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {campus.name}
                </span>
                {campus.hasBoarding && (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <i className="fa-solid fa-house-chimney-medical text-[10px]"></i>
                    Có Bán Trú
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                <p className="flex items-start gap-2">
                  <i className="fa-solid fa-location-dot text-amber-400 mt-1 shrink-0"></i>
                  <span className="leading-snug">{campus.address}</span>
                </p>
                <p className="flex items-start gap-2 text-slate-400 text-xs italic">
                  <i className="fa-solid fa-circle-info text-blue-400 mt-0.5 shrink-0"></i>
                  <span>({campus.landmark})</span>
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-700/50 text-xs">
                  <span className="text-slate-400 font-medium">Hotline tư vấn:</span>
                  <a
                    href={`tel:${campus.hotlines[0]}`}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    {campus.hotlines.join(' – ')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-snowflake text-lg"></i>
            </div>
            <div>
              <div className="text-xs text-slate-400">Trang thiết bị</div>
              <div className="text-sm font-bold text-white">Máy lạnh & TV tương tác</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-van-shuttle text-lg"></i>
            </div>
            <div>
              <div className="text-xs text-slate-400">Đưa đón an toàn</div>
              <div className="text-sm font-bold text-white">Xe 16 chỗ & Quản nhiệm</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-user-tie text-lg"></i>
            </div>
            <div>
              <div className="text-xs text-slate-400">Đội ngũ nhà giáo</div>
              <div className="text-sm font-bold text-white">Dạy giỏi cấp Quận & THPT</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-chart-line text-lg"></i>
            </div>
            <div>
              <div className="text-xs text-slate-400">Mục tiêu cam kết</div>
              <div className="text-sm font-bold text-white">Bứt phá điểm 8+ và vào 10</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
