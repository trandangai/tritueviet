import React, { useState, useEffect } from 'react';
import { ConsultationLead } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Omit<ConsultationLead, 'id' | 'createdAt' | 'status'>) => void;
  prefill?: {
    grade?: string;
    campusId?: 'cs1' | 'cs2' | 'cs3';
    subject?: string;
    teacherName?: string;
    service?: string;
  };
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  prefill
}) => {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('6');
  const [campusId, setCampusId] = useState<'cs1' | 'cs2' | 'cs3'>('cs1');
  const [services, setServices] = useState<string[]>(['Học Thêm']);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefill) {
      if (prefill.grade) setGrade(prefill.grade.split(',')[0].trim());
      if (prefill.campusId) setCampusId(prefill.campusId);
      if (prefill.service) {
        if (prefill.service.toLowerCase().includes('bán trú')) {
          setServices(['Bán Trú']);
          setCampusId('cs1');
        } else {
          setServices(['Học Thêm']);
        }
      }
      let noteParts = [];
      if (prefill.subject) noteParts.push(`Môn: ${prefill.subject}`);
      if (prefill.teacherName) noteParts.push(`Giáo viên: ${prefill.teacherName}`);
      if (prefill.service) noteParts.push(`Gói: ${prefill.service}`);
      if (noteParts.length > 0) {
        setNotes(noteParts.join(' | '));
      }
    }
  }, [prefill, isOpen]);

  if (!isOpen) return null;

  const handleToggleService = (svc: string) => {
    if (services.includes(svc)) {
      if (services.length > 1) {
        setServices(services.filter((s) => s !== svc));
      }
    } else {
      setServices([...services, svc]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim()) {
      alert('Vui lòng nhập họ tên phụ huynh và số điện thoại liên hệ.');
      return;
    }

    onSubmit({
      parentName: parentName.trim(),
      phone: phone.trim(),
      studentName: studentName.trim(),
      grade,
      campusId,
      services,
      notes: notes.trim()
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setParentName('');
    setPhone('');
    setStudentName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
              <i className="fa-solid fa-check"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Đăng Ký Tư Vấn Thành Công!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Bộ phận tuyển sinh Trung Tâm Trí Tuệ đã nhận được thông tin của phụ huynh{' '}
              <strong className="text-slate-900">{parentName}</strong>. Chúng tôi sẽ liên hệ qua số điện thoại{' '}
              <strong className="text-slate-900">{phone}</strong> trong vòng 30 phút để hỗ trợ sắp xếp lớp học phù hợp nhất.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 mb-6 text-left">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-sm text-amber-950">
                <i className="fa-solid fa-phone text-emerald-600"></i>
                Cần hỗ trợ tư vấn gấp:
              </div>
              <p>Quý phụ huynh có thể gọi trực tiếp hoặc nhắn Zalo đến Hotline:</p>
              <div className="mt-2 flex items-center gap-3 font-extrabold text-sm text-[#0F294A]">
                <a href="tel:0988389302" className="hover:underline">
                  0988 389 302
                </a>
                <span>–</span>
                <a href="tel:0969620071" className="hover:underline">
                  0969 620 071
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-6 py-2.5 bg-[#0F294A] text-amber-400 font-bold rounded-xl text-sm transition shadow-md cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                Tư Vấn Miễn Phí & Xếp Lớp
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Đăng Ký Học Thêm & Nuôi Bán Trú
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Điền thông tin bên dưới để nhận thời khóa biểu chi tiết và lịch học thử miễn phí.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Parent Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên Phụ huynh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Thị Bích"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0988 389 302"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              {/* Student Name & Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên Học sinh
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Văn An"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khối lớp học sinh <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="Cấp 1">Cấp 1 (Tiểu học bán trú)</option>
                    <option value="6">Lớp 6 (THCS)</option>
                    <option value="7">Lớp 7 (THCS)</option>
                    <option value="8">Lớp 8 (THCS)</option>
                    <option value="9">Lớp 9 (Luyện thi vào 10)</option>
                    <option value="10">Lớp 10 (THPT)</option>
                    <option value="11">Lớp 11 (THPT)</option>
                    <option value="12">Lớp 12 (Luyện thi Đại học)</option>
                  </select>
                </div>
              </div>

              {/* Campus Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cơ sở thuận tiện cho con theo học <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="campusChoice"
                      value="cs1"
                      checked={campusId === 'cs1'}
                      onChange={() => setCampusId('cs1')}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <div>
                      <strong className="text-slate-900">Cơ sở 1 (Trung Mỹ Tây, Q.12):</strong>{' '}
                      2440/73 Quốc Lộ 1A (Đối diện THCS Nguyễn An Ninh) - Có Bán Trú & Học Thêm
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="campusChoice"
                      value="cs2"
                      checked={campusId === 'cs2'}
                      onChange={() => setCampusId('cs2')}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <div>
                      <strong className="text-slate-900">Cơ sở 2 (Hiệp Thành, Q.12):</strong> 94
                      Nguyễn Thị Đặng (Gần THPT Võ Trường Toản)
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="campusChoice"
                      value="cs3"
                      checked={campusId === 'cs3'}
                      onChange={() => setCampusId('cs3')}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <div>
                      <strong className="text-slate-900">Cơ sở 3 (Bà Điểm, Hóc Môn):</strong> 5/3C
                      Nguyễn Thị Sóc (Gần THPT Bà Điểm)
                    </div>
                  </label>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dịch vụ gia đình quan tâm
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Học Thêm', 'Bán Trú'].map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => handleToggleService(svc)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        services.includes(svc)
                          ? 'bg-[#0F294A] text-amber-400 border-[#0F294A]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          services.includes(svc) ? 'fa-check' : 'fa-plus'
                        } mr-1.5`}
                      ></i>
                      {svc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú hoặc câu hỏi dành cho trung tâm
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Muốn đăng ký học thử môn Toán, đăng ký xe đưa rước trường Võ Văn Tần..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Gửi Thông Tin Đăng Ký Tư Vấn
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
