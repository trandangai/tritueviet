import React, { useState, useMemo } from 'react';
import { ScheduleItem, TeacherItem, CampusItem } from '../types';

interface ScheduleSectionProps {
  schedules: ScheduleItem[];
  teachers: TeacherItem[];
  campuses: CampusItem[];
  onSelectForConsultation: (info: {
    grade?: string;
    campusId?: 'cs1' | 'cs2' | 'cs3';
    subject?: string;
    teacherName?: string;
  }) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  schedules,
  teachers,
  campuses,
  onSelectForConsultation
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'teachers'>('schedule');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Campus map lookup
  const campusMap = useMemo(() => {
    const map: Record<string, CampusItem> = {};
    campuses.forEach((c) => (map[c.id] = c));
    return map;
  }, [campuses]);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules
      .filter((item) => {
        if (selectedCampus !== 'all' && item.campusId !== selectedCampus) {
          return false;
        }
        if (selectedGrade !== 'all' && !item.grade.includes(selectedGrade)) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchSub = item.subject?.toLowerCase().includes(q);
          const matchTeacher = item.teacher?.toLowerCase().includes(q);
          const matchWeekly = item.weeklySchedule?.toLowerCase().includes(q);
          const matchGrade = item.grade?.toLowerCase().includes(q);
          if (!matchSub && !matchTeacher && !matchWeekly && !matchGrade) return false;
        }
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [schedules, selectedCampus, selectedGrade, searchQuery]);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers
      .filter((teacher) => {
        if (selectedCampus !== 'all') {
          if (!teacher.campusIds.includes(selectedCampus as any)) return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = teacher.name.toLowerCase().includes(q);
          const matchSub = teacher.subject.toLowerCase().includes(q);
          const matchExp = teacher.experience.toLowerCase().includes(q);
          if (!matchName && !matchSub && !matchExp) return false;
        }
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [teachers, selectedCampus, searchQuery]);

  return (
    <section id="hoc-them" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0F294A] text-xs font-bold uppercase tracking-wider mb-3">
            <i className="fa-solid fa-graduation-cap text-amber-500"></i>
            Phần 1: Lớp Học Bồi Dưỡng Văn Hóa
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            HỌC THÊM CHẤT LƯỢNG CAO
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Lịch học chi tiết theo từng cơ sở, phân loại khối lớp rõ ràng cùng đội ngũ giáo viên giàu chuyên môn và kinh nghiệm sư phạm.
          </p>

          {/* Sub-Tabs Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveSubTab('schedule')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeSubTab === 'schedule'
                  ? 'bg-[#0F294A] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-calendar-days text-amber-400"></i>
              <span>THỜI KHÓA BIỂU CÁC LỚP</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('teachers')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeSubTab === 'teachers'
                  ? 'bg-[#0F294A] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-chalkboard-user text-amber-400"></i>
              <span>ĐỘI NGŨ GIÁO VIÊN</span>
            </button>
          </div>
        </div>

        {/* Global Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Campus Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-location-dot text-amber-500 mr-1.5"></i>
                Lọc theo Cơ Sở
              </label>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                <option value="all">Tất cả 3 Cơ sở</option>
                <option value="cs1">Cơ sở 1 (Trung Mỹ Tây, Q.12 - Gần THCS Nguyễn An Ninh)</option>
                <option value="cs2">Cơ sở 2 (Hiệp Thành, Q.12 - Gần THPT Võ Trường Toản)</option>
                <option value="cs3">Cơ sở 3 (Bà Điểm, Hóc Môn - Gần THPT Bà Điểm)</option>
              </select>
            </div>

            {/* Grade Selector (only relevant for Schedule) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-layer-group text-blue-500 mr-1.5"></i>
                Lọc theo Khối Lớp
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                <option value="all">Tất cả Khối Lớp (Lớp 6 – 12)</option>
                <option value="6">Lớp 6 (THCS)</option>
                <option value="7">Lớp 7 (THCS)</option>
                <option value="8">Lớp 8 (THCS)</option>
                <option value="9">Lớp 9 (Luyện thi vào 10)</option>
                <option value="10">Lớp 10 (THPT)</option>
                <option value="11">Lớp 11 (THPT)</option>
                <option value="12">Lớp 12 (Luyện thi Đại học)</option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-magnifying-glass text-slate-400 mr-1.5"></i>
                Tìm kiếm môn học, giáo viên, ngày học
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ví dụ: Toán, Thầy Trác, Ca tối, Lớp 10A..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
                <i className="fa-solid fa-search absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SUB-TAB A: THỜI KHÓA BIỂU */}
        {activeSubTab === 'schedule' && (
          <div className="space-y-6">
            {filteredSchedules.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <i className="fa-solid fa-calendar-xmark text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Không tìm thấy lịch học phù hợp</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Vui lòng điều chỉnh lại bộ lọc hoặc liên hệ hotline để được xếp lịch linh hoạt theo thời gian rảnh của học sinh.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCampus('all');
                    setSelectedGrade('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSchedules.map((item) => {
                  const campus = campusMap[item.campusId];
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400/80 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header of Card */}
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-[#0F294A] text-amber-400 font-extrabold text-sm rounded-lg shadow-sm">
                              Lớp {item.grade}
                            </span>
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-semibold text-xs rounded-lg border border-blue-200/60">
                              {campus?.name || item.campusId}
                            </span>
                            {item.startDate && (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-semibold text-xs rounded-lg border border-amber-200/60">
                                <i className="fa-regular fa-clock mr-1 text-[11px]"></i>
                                {item.startDate}
                              </span>
                            )}
                          </div>

                          {item.phone && (
                            <a
                              href={`tel:${item.phone.replace(/\s+/g, '')}`}
                              className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1.5"
                            >
                              <i className="fa-solid fa-phone text-[10px]"></i>
                              {item.phone}
                            </a>
                          )}
                        </div>

                        {/* Subject Title */}
                        <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight">
                          {item.subject}
                        </h3>

                        {/* Teacher & Address info */}
                        <div className="text-xs text-slate-500 mb-4 flex flex-col gap-1">
                          {item.teacher && (
                            <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                              <i className="fa-solid fa-user-tie text-amber-500"></i>
                              Giáo viên phụ trách: <span className="text-[#0F294A] font-bold">{item.teacher}</span>
                            </p>
                          )}
                          <p className="flex items-start gap-1.5">
                            <i className="fa-solid fa-location-dot text-slate-400 mt-0.5"></i>
                            <span>{campus?.address} ({campus?.landmark})</span>
                          </p>
                        </div>

                        {/* Time slots layout */}
                        <div className="space-y-2 bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs sm:text-sm text-slate-700">
                          {item.morningSlot && (
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-amber-700 shrink-0 w-16">
                                <i className="fa-regular fa-sun mr-1"></i>Sáng:
                              </span>
                              <span className="font-medium text-slate-800">{item.morningSlot}</span>
                            </div>
                          )}
                          {item.afternoonSlot && (
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-orange-700 shrink-0 w-16">
                                <i className="fa-solid fa-cloud-sun mr-1"></i>Chiều:
                              </span>
                              <span className="font-medium text-slate-800">{item.afternoonSlot}</span>
                            </div>
                          )}
                          {item.eveningSlot && (
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-indigo-800 shrink-0 w-16">
                                <i className="fa-solid fa-moon mr-1"></i>Tối:
                              </span>
                              <span className="font-medium text-slate-800">{item.eveningSlot}</span>
                            </div>
                          )}
                          {item.weeklySchedule && (
                            <div className="pt-2 border-t border-slate-200/80">
                              <span className="font-bold text-slate-900 block mb-1">
                                <i className="fa-solid fa-timeline mr-1 text-blue-600"></i>
                                Lịch phân ca chi tiết trong tuần:
                              </span>
                              <div className="text-slate-700 font-medium whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60">
                                {item.weeklySchedule}
                              </div>
                            </div>
                          )}
                        </div>

                        {item.notes && (
                          <p className="mt-3 text-xs text-slate-500 italic bg-amber-50/60 text-amber-900 p-2.5 rounded-lg border border-amber-200/40">
                            <i className="fa-solid fa-circle-exclamation mr-1.5 text-amber-600"></i>
                            {item.notes}
                          </p>
                        )}
                      </div>

                      {/* Action Register */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          Hotline hỗ trợ: <strong className="text-slate-700">0988 389 302</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onSelectForConsultation({
                              grade: item.grade,
                              campusId: item.campusId,
                              subject: item.subject,
                              teacherName: item.teacher
                            })
                          }
                          className="inline-flex items-center gap-1.5 bg-[#0F294A] hover:bg-blue-900 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span>Đăng ký xếp lớp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB B: GIÁO VIÊN */}
        {activeSubTab === 'teachers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Teacher Photo */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
                        alt={teacher.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wide inline-block mb-1">
                          {teacher.subject}
                        </span>
                        <h3 className="text-base font-extrabold leading-tight text-white">
                          {teacher.name}
                        </h3>
                      </div>
                    </div>

                    {/* Teacher Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">{teacher.title}</span>
                        <a
                          href={`tel:${teacher.phone.replace(/\s+/g, '')}`}
                          className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition"
                        >
                          <i className="fa-solid fa-phone mr-1 text-[10px]"></i>
                          {teacher.phone}
                        </a>
                      </div>

                      <div className="text-xs text-blue-900 font-semibold bg-blue-50/80 p-2 rounded-lg border border-blue-100">
                        <i className="fa-solid fa-award text-amber-500 mr-1.5"></i>
                        {teacher.experience}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {teacher.description}
                      </p>

                      <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-950">
                        <div className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                          <i className="fa-solid fa-circle-check text-amber-600"></i>
                          Cam kết đầu ra:
                        </div>
                        <p className="text-[11px] leading-snug">{teacher.commitment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectForConsultation({
                          teacherName: teacher.name,
                          subject: teacher.subject,
                          campusId: teacher.campusIds[0]
                        })
                      }
                      className="w-full bg-[#0F294A] hover:bg-blue-900 text-amber-400 font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-user-plus"></i>
                      <span>Đăng ký học Thầy / Cô</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
