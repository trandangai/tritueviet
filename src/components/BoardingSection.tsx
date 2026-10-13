import React from 'react';
import { BoardingTimelineItem, BoardingRuleItem } from '../types';

interface BoardingSectionProps {
  timeline: BoardingTimelineItem[];
  rules: BoardingRuleItem[];
  onOpenConsultation: (service?: string) => void;
}

export const BoardingSection: React.FC<BoardingSectionProps> = ({
  timeline,
  rules,
  onOpenConsultation
}) => {
  const sortedTimeline = [...timeline].sort((a, b) => a.order - b.order);
  const sortedRules = [...rules].sort((a, b) => a.order - b.order);

  return (
    <section id="ban-tru" className="py-20 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <i className="fa-solid fa-shield-heart text-emerald-600"></i>
            Phần 2: Chăm Sóc & Quản Lý Toàn Diện
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            NUÔI HỌC SINH BÁN TRÚ
          </h2>
          <p className="mt-2 text-sm sm:text-base font-semibold text-amber-600 uppercase tracking-wide">
            (Áp dụng chuyên sâu tại Cơ sở 1 – Dành cho Học sinh Cấp 1 & Cấp 2)
          </p>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Giải pháp an tâm hàng đầu cho quý phụ huynh bận rộn: xe đưa đón an toàn, bữa trưa giàu dinh dưỡng, ngủ trưa phòng máy lạnh và giáo viên kèm cặp hoàn thành 100% bài vở trên trường.
          </p>
        </div>

        {/* 1. Timeline Sinh Hoạt Trong Ngày */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F294A] flex items-center gap-2.5">
                <i className="fa-solid fa-clock text-amber-500"></i>
                Thời Gian Biểu Sinh Hoạt Trong Ngày
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lịch trình khoa học giúp con vừa tiếp thu tốt kiến thức, vừa được nghỉ ngơi phục hồi thể lực
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
              6h00 – 18h00 Hằng Ngày
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTimeline.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:bg-white hover:shadow-lg transition-all relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-[#0F294A] text-amber-400 font-extrabold text-sm flex items-center justify-center shadow-md">
                      0{index + 1}
                    </span>
                    <span className="text-xs font-black text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300/60">
                      {item.timeRange}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#0F294A] transition mb-2">
                    {item.activity}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-slate-400">
                  <i className={`fa-solid ${item.iconName || 'fa-check'} text-amber-500 mr-2`}></i>
                  <span>Tiêu chuẩn chăm sóc tận tâm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Phương Thức Đưa Đón & Quy Định Điểm Danh Báo Nghỉ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Pickup method card */}
          <div className="bg-gradient-to-br from-blue-950 to-[#0F294A] text-white rounded-3xl p-7 sm:p-9 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl"></div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-bold text-xs uppercase mb-4 border border-amber-400/30">
                <i className="fa-solid fa-van-shuttle"></i>
                Phương Thức Đưa Đón An Toàn
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Đưa Rước Học Sinh Tận Nơi – An Toàn Tuyệt Đối
              </h3>

              <div className="space-y-4 text-sm text-slate-200">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="font-bold text-amber-300 flex items-center gap-2 text-base mb-1">
                    <i className="fa-solid fa-person-walking text-lg"></i>
                    Học sinh Cấp 2 THCS Nguyễn An Ninh
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Trung tâm CS1 nằm <strong>đối diện cổng sau trường THCS Nguyễn An Ninh (đường Song Hành)</strong>. Thầy cô giáo quản nhiệm sẽ trực tiếp dẫn các em đi bộ qua lại an toàn, nhanh chóng trước và sau giờ học.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="font-bold text-amber-300 flex items-center gap-2 text-base mb-1">
                    <i className="fa-solid fa-bus text-lg"></i>
                    Học sinh Cấp 1 (TH Võ Văn Tần & TH Quang Trung)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Trang bị <strong>xe 16 chỗ máy lạnh đời mới</strong> đưa rước 2 chiều. Có quản nhiệm đón tại cổng trường, thắt dây an toàn cho từng bé và bàn giao trực tiếp tại trung tâm.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-200">
              <span>Cam kết không để học sinh phải chờ đợi</span>
              <span className="font-bold">Hotline Điều Phối: 0988 389 302</span>
            </div>
          </div>

          {/* Attendance & Refund rule card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-7 sm:p-9 border border-amber-200/90 shadow-md flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs uppercase mb-4 shadow-sm">
                <i className="fa-solid fa-clipboard-check"></i>
                Nội Quy & Quyền Lợi Phụ Huynh
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                Điểm Danh Chặt Chẽ & Minh Bạch Chi Phí
              </h3>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-base mb-1">
                    <i className="fa-solid fa-bell text-rose-500"></i>
                    Nội quy điểm danh khi đến lớp
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Học sinh đến trung tâm được điểm danh ngay tại sảnh đón. Nếu học sinh vắng mặt không lý do hoặc chưa thấy đến, trung tâm sẽ <strong>gọi điện thoại trực tiếp cho phụ huynh ngay lập tức</strong> để nắm tình hình.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-base mb-1">
                    <i className="fa-solid fa-money-bill-wave text-emerald-600"></i>
                    Chính sách báo nghỉ & Hoàn tiền cơm
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Khi học sinh có việc bận gia đình cần nghỉ bán trú, phụ huynh chỉ cần <strong>báo trước 9h00 sáng</strong>. Trung tâm sẽ không lên thực đơn phần ăn trưa và <strong>hoàn lại 30.000đ/buổi</strong> tiền cơm trưa vào kỳ thanh toán tiếp theo.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <span className="font-semibold">Báo nghỉ qua Zalo: 0988 389 302</span>
              <button
                type="button"
                onClick={() => onOpenConsultation('Bán Trú')}
                className="bg-[#0F294A] hover:bg-blue-900 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer"
              >
                Đăng ký Bán Trú ngay
              </button>
            </div>
          </div>
        </div>

        {/* 3. Tiện ích thực tế & Cơ sở vật chất Bán Trú */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h4 className="text-xl font-bold text-slate-900">
              Tiện Nghi Chuẩn Mực Dành Riêng Cho Bán Trú Tại CS1
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Địa chỉ: 2440/73 Quốc Lộ 1A, Khu phố 5, Phường Trung Mỹ Tây, Q.12
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-3">
                <i className="fa-solid fa-snowflake"></i>
              </div>
              <h5 className="font-bold text-slate-900 text-sm">Phòng Ngủ Máy Lạnh</h5>
              <p className="text-xs text-slate-500 mt-1">
                Khu vực nam - nữ riêng biệt, nệm êm ái, vệ sinh giặt sạch hàng tuần.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-3">
                <i className="fa-solid fa-bowl-rice"></i>
              </div>
              <h5 className="font-bold text-slate-900 text-sm">Bữa Ăn Chuẩn Dinh Dưỡng</h5>
              <p className="text-xs text-slate-500 mt-1">
                Thực đơn thay đổi liên tục, kiểm tra ATTP, sữa chua & trái cây tráng miệng.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mb-3">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <h5 className="font-bold text-slate-900 text-sm">Quản Nhiệm Kèm Sát</h5>
              <p className="text-xs text-slate-500 mt-1">
                Hướng dẫn làm bài tập về nhà, chuẩn bị bài mới cho buổi học hôm sau.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-3">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h5 className="font-bold text-slate-900 text-sm">Camera Giám Sát 24/7</h5>
              <p className="text-xs text-slate-500 mt-1">
                Hệ thống an ninh chặt chẽ, phụ huynh an tâm tuyệt đối suốt cả ngày.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
