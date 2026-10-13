import React from 'react';
import { CampusItem } from '../types';

interface FooterProps {
  campuses: CampusItem[];
  onOpenConsultation: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  campuses,
  onOpenConsultation,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#0A1D36] text-slate-300 border-t border-blue-900/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#0F294A] shadow-md">
                <i className="fa-solid fa-graduation-cap text-2xl"></i>
              </div>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Hệ Thống Giáo Dục
                </span>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  TRÍ TUỆ <span className="text-amber-400">DẠY THÊM & BÁN TRÚ</span>
                </span>
              </div>
            </div>

            <p className="text-amber-400 font-bold text-sm tracking-wide">
              ✨ Đồng Hành Cùng Tri Thức – Kiến Tạo Tương Lai ✨
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Trung tâm chuyên bồi dưỡng văn hóa, luyện thi tuyển sinh vào lớp 10, luyện thi Đại học chất lượng cao và nuôi học sinh bán trú an toàn, chu đáo tại Quận 12 và Hóc Môn.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
              >
                <i className="fa-solid fa-pen-nib mr-1.5"></i> Đăng Ký Tư Vấn
              </button>
            </div>
          </div>

          {/* 3 Campuses Directory */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-amber-400">
              <i className="fa-solid fa-location-dot mr-2"></i>
              Hệ Thống 3 Cơ Sở Trực Thuộc
            </h4>

            <div className="space-y-3.5 text-xs">
              {campuses.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <strong className="text-white text-sm font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      {c.name}
                    </strong>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Hotlines:</span>
                      <a
                        href={`tel:${c.hotlines[0]}`}
                        className="text-amber-400 font-bold hover:underline"
                      >
                        {c.hotlines.join(' – ')}
                      </a>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-snug">
                    <i className="fa-solid fa-map-pin text-slate-500 mr-1.5"></i>
                    {c.address}
                  </p>
                  <p className="text-slate-400 italic text-[11px] mt-0.5">
                    ({c.landmark})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} TRUNG TÂM DẠY THÊM – NUÔI HỌC SINH BÁN TRÚ TRÍ TUỆ. All rights reserved.</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              title="Đăng nhập quản trị"
              className="text-slate-600 hover:text-amber-400 p-0.5 transition cursor-pointer"
            >
              <i className="fa-solid fa-lock text-[10px]"></i>
            </button>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Hotline: 0988 389 302 – 0969 620 071</span>
            <span>•</span>
            <a href="#hoc-them" className="hover:text-amber-400 transition">Thời khóa biểu</a>
            <span>•</span>
            <a href="#ban-tru" className="hover:text-amber-400 transition">Bán trú</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
