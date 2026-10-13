import React, { useState } from 'react';
import {
  CenterData,
  ScheduleItem,
  TeacherItem,
  BoardingTimelineItem,
  BoardingRuleItem,
  CampusItem,
  FeeItem,
  ConsultationLead
} from '../types';
import {
  exportDataAsJSON,
  exportLeadsAsCSV,
  resetCenterData
} from '../services/storage';
import {
  syncLeadsToGoogleSheet,
  backupCenterDataToDrive,
  addConsultationToCalendar,
  createRegistrationGoogleForm
} from '../services/workspace';
import { ConfirmModal } from './ConfirmModal';
import { User } from 'firebase/auth';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CenterData;
  onUpdateData: (newData: CenterData) => void;
  currentUser: User | null;
  onGoogleSignIn: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  data,
  onUpdateData,
  currentUser,
  onGoogleSignIn
}) => {
  // Authentication state for Admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');
  const [newAdminError, setNewAdminError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'schedules' | 'teachers' | 'boarding' | 'fees_campuses' | 'leads' | 'workspace' | 'admin_users'
  >('leads');

  // Whitelist of authorized Google admin emails
  const adminEmails: string[] =
    Array.isArray(data.adminEmails) && data.adminEmails.length > 0
      ? data.adminEmails
      : ['us.documentb@gmail.com'];

  const isUserAuthorizedAdmin = (email?: string | null): boolean => {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    return adminEmails.some((e) => e.trim().toLowerCase() === clean);
  };

  // Automatically authenticate if current user is an authorized admin
  React.useEffect(() => {
    if (currentUser?.email) {
      if (isUserAuthorizedAdmin(currentUser.email)) {
        setIsAuthenticated(true);
        setAuthError('');
      }
    }
  }, [currentUser, data.adminEmails]);

  // Confirmation Modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDestructive?: boolean;
    confirmText?: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {}
  });

  // Loading & status banners
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
    linkUrl?: string;
    linkText?: string;
  }>({ type: null, message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit / Add modal states
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(null);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);

  const [calendarTargetLead, setCalendarTargetLead] = useState<ConsultationLead | null>(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState('');

  if (!isOpen) return null;

  // Handle Google Admin login button click
  const handleGoogleAdminLogin = async () => {
    setAuthError('');
    try {
      await onGoogleSignIn();
    } catch (err: any) {
      setAuthError('Lỗi kết nối Google: ' + (err?.message || 'Vui lòng thử lại sau.'));
    }
  };

  // Add new Google admin email
  const handleAddAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setNewAdminError('');
    const emailToAdd = newAdminEmailInput.trim().toLowerCase();
    if (!emailToAdd) {
      setNewAdminError('Vui lòng nhập địa chỉ email Google.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToAdd)) {
      setNewAdminError('Địa chỉ email không đúng định dạng.');
      return;
    }
    if (adminEmails.map((e) => e.toLowerCase()).includes(emailToAdd)) {
      setNewAdminError('Email này đã có trong danh sách quản trị viên.');
      return;
    }

    const updated = [...adminEmails, emailToAdd];
    onUpdateData({ ...data, adminEmails: updated });
    setNewAdminEmailInput('');
    setSyncStatus({
      type: 'success',
      message: `Đã cấp quyền quản trị thành công cho tài khoản: ${emailToAdd}`
    });
  };

  // Delete Google admin email
  const handleDeleteAdminEmail = (emailToDelete: string) => {
    if (adminEmails.length <= 1) {
      alert('Hệ thống phải có ít nhất 1 tài khoản quản trị viên.');
      return;
    }
    setConfirmState({
      isOpen: true,
      title: 'Thu hồi quyền quản trị?',
      message: `Tài khoản ${emailToDelete} sẽ không thể đăng nhập vào trang quản trị này nữa. Bạn có chắc chắn muốn xóa?`,
      confirmText: 'Thu hồi quyền',
      isDestructive: true,
      action: () => {
        const updated = adminEmails.filter(
          (e) => e.trim().toLowerCase() !== emailToDelete.trim().toLowerCase()
        );
        onUpdateData({ ...data, adminEmails: updated });
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setSyncStatus({
          type: 'info',
          message: `Đã thu hồi quyền quản trị của ${emailToDelete}.`
        });
      }
    });
  };

  // Google Workspace actions
  const triggerGoogleSheetsSync = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập tài khoản Google trước khi thực hiện đồng bộ!');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: 'Đồng bộ Danh sách phụ huynh sang Google Sheets?',
      message: `Thao tác này sẽ cập nhật hoặc tạo mới một bảng tính trên Google Drive của bạn ("TRÍ TUỆ - Danh Sách Phụ Huynh Đăng Ký") và đẩy toàn bộ ${data.leads.length} thông tin liên hệ lên trang tính. Bạn có muốn tiếp tục?`,
      confirmText: 'Đồng bộ ngay',
      isDestructive: false,
      action: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setIsProcessing(true);
        setSyncStatus({ type: 'info', message: 'Đang kết nối Google Sheets API và ghi dữ liệu...' });
        try {
          const res = await syncLeadsToGoogleSheet(data.leads, data.googleSheetsId);
          if (res.id && !data.googleSheetsId) {
            onUpdateData({ ...data, googleSheetsId: res.id });
          }
          setSyncStatus({
            type: 'success',
            message: res.message,
            linkUrl: res.url,
            linkText: 'Mở Google Sheets vừa tạo ↗'
          });
        } catch (err: any) {
          setSyncStatus({
            type: 'error',
            message: `Lỗi đồng bộ Google Sheets: ${err?.message || 'Không thể ghi dữ liệu.'}`
          });
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const triggerGoogleDriveBackup = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập tài khoản Google trước khi sao lưu!');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: 'Sao lưu dữ liệu trung tâm lên Google Drive?',
      message:
        'Hệ thống sẽ đóng gói toàn bộ thời khóa biểu, danh sách giáo viên, chính sách bán trú, bảng giá học phí và danh sách đăng ký thành file JSON và lưu trữ an toàn trong Google Drive của bạn. Bạn có muốn sao lưu?',
      confirmText: 'Sao lưu lên Drive',
      isDestructive: false,
      action: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setIsProcessing(true);
        setSyncStatus({ type: 'info', message: 'Đang tải file sao lưu lên Google Drive...' });
        try {
          const res = await backupCenterDataToDrive(data);
          setSyncStatus({
            type: 'success',
            message: res.message,
            linkUrl: res.url,
            linkText: 'Xem file trên Google Drive ↗'
          });
        } catch (err: any) {
          setSyncStatus({
            type: 'error',
            message: `Lỗi sao lưu Google Drive: ${err?.message || 'Không thể tạo file.'}`
          });
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const triggerGoogleCalendarEvent = (lead: ConsultationLead) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập tài khoản Google để tạo lịch nhắc hẹn!');
      return;
    }
    setCalendarTargetLead(lead);
    // Default tomorrow at 9:00 AM
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    tmr.setHours(9, 0, 0, 0);
    setAppointmentDateTime(tmr.toISOString().slice(0, 16));
  };

  const confirmCreateCalendarEvent = async () => {
    if (!calendarTargetLead) return;
    setIsProcessing(true);
    setSyncStatus({ type: 'info', message: 'Đang tạo sự kiện lịch hẹn trên Google Calendar...' });
    try {
      const res = await addConsultationToCalendar(calendarTargetLead, appointmentDateTime);
      setSyncStatus({
        type: 'success',
        message: res.message,
        linkUrl: res.url,
        linkText: 'Mở Google Calendar ↗'
      });
      // Mark calendar event created
      const updatedLeads = data.leads.map((l) =>
        l.id === calendarTargetLead.id ? { ...l, calendarEventId: res.id } : l
      );
      onUpdateData({ ...data, leads: updatedLeads });
      setCalendarTargetLead(null);
    } catch (err: any) {
      setSyncStatus({
        type: 'error',
        message: `Lỗi tạo lịch Calendar: ${err?.message || 'Không thể kết nối.'}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerCreateGoogleForm = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập Google trước khi tạo biểu mẫu!');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: 'Tạo Google Form tuyển sinh tự động?',
      message:
        'Thao tác này sẽ tự động tạo một biểu mẫu trực tuyến trên Google Forms với đầy đủ câu hỏi: Họ tên phụ huynh, SĐT Zalo, Họ tên học sinh, Khối lớp, Cơ sở quan tâm và Dịch vụ. Bạn có muốn tạo?',
      confirmText: 'Tạo Form ngay',
      isDestructive: false,
      action: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setIsProcessing(true);
        setSyncStatus({ type: 'info', message: 'Đang khởi tạo câu hỏi trên Google Forms...' });
        try {
          const res = await createRegistrationGoogleForm();
          if (res.url) {
            onUpdateData({ ...data, googleFormsUrl: res.url });
          }
          setSyncStatus({
            type: 'success',
            message: res.message,
            linkUrl: res.url,
            linkText: 'Mở biểu mẫu Google Form vừa tạo ↗'
          });
        } catch (err: any) {
          setSyncStatus({
            type: 'error',
            message: `Lỗi tạo Google Form: ${err?.message || 'Không thể tạo biểu mẫu.'}`
          });
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  // Reset to default
  const handleResetData = () => {
    setConfirmState({
      isOpen: true,
      title: 'Khôi phục dữ liệu gốc của trung tâm?',
      message:
        'CẢNH BÁO: Toàn bộ dữ liệu thời khóa biểu, giáo viên và khách hàng chỉnh sửa gần đây sẽ được đưa về giá trị mặc định ban đầu. Bạn có chắc chắn muốn thực hiện?',
      confirmText: 'Khôi phục về mặc định',
      isDestructive: true,
      action: () => {
        const fresh = resetCenterData();
        onUpdateData(fresh);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setSyncStatus({ type: 'success', message: 'Đã khôi phục toàn bộ dữ liệu mẫu ban đầu!' });
      }
    });
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.campuses && parsed.schedules) {
          onUpdateData({ ...data, ...parsed });
          alert('Đã nạp dữ liệu từ file JSON thành công!');
        } else {
          alert('Cấu trúc file JSON không hợp lệ.');
        }
      } catch (err) {
        alert('Lỗi đọc file JSON: ' + err);
      }
    };
    reader.readAsText(file);
  };

  // Lead status change
  const handleUpdateLeadStatus = (leadId: string, status: 'new' | 'contacted' | 'enrolled') => {
    const updated = data.leads.map((l) => (l.id === leadId ? { ...l, status } : l));
    onUpdateData({ ...data, leads: updated });
  };

  const handleDeleteLead = (leadId: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Xóa thông tin phụ huynh đăng ký?',
      message: 'Hành động này sẽ xóa vĩnh viễn thông tin tư vấn này khỏi hệ thống.',
      confirmText: 'Xóa ngay',
      isDestructive: true,
      action: () => {
        const updated = data.leads.filter((l) => l.id !== leadId);
        onUpdateData({ ...data, leads: updated });
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Schedule CRUD
  const handleSaveSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item: ScheduleItem = {
      id: editingSchedule?.id || `s-${Date.now()}`,
      campusId: formData.get('campusId') as any,
      grade: (formData.get('grade') as string) || '6',
      subject: (formData.get('subject') as string) || '',
      teacher: (formData.get('teacher') as string) || '',
      phone: (formData.get('phone') as string) || '',
      startDate: (formData.get('startDate') as string) || '',
      morningSlot: (formData.get('morningSlot') as string) || '',
      afternoonSlot: (formData.get('afternoonSlot') as string) || '',
      eveningSlot: (formData.get('eveningSlot') as string) || '',
      weeklySchedule: (formData.get('weeklySchedule') as string) || '',
      notes: (formData.get('notes') as string) || '',
      order: editingSchedule ? editingSchedule.order : data.schedules.length + 1
    };

    let updatedSchedules: ScheduleItem[];
    if (editingSchedule) {
      updatedSchedules = data.schedules.map((s) => (s.id === item.id ? item : s));
    } else {
      updatedSchedules = [...data.schedules, item];
    }

    onUpdateData({ ...data, schedules: updatedSchedules });
    setEditingSchedule(null);
    setIsAddingSchedule(false);
  };

  const handleDeleteSchedule = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Xóa lịch học này?',
      message: 'Mục thời khóa biểu này sẽ bị gỡ bỏ khỏi bảng hiển thị công khai.',
      confirmText: 'Xóa lịch học',
      isDestructive: true,
      action: () => {
        const updated = data.schedules.filter((s) => s.id !== id);
        onUpdateData({ ...data, schedules: updated });
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Teacher CRUD
  const handleSaveTeacher = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const campusesSelected = (formData.getAll('campuses') as ('cs1' | 'cs2' | 'cs3')[]) || ['cs1'];

    const item: TeacherItem = {
      id: editingTeacher?.id || `t-${Date.now()}`,
      name: (formData.get('name') as string) || '',
      title: (formData.get('title') as string) || '',
      subject: (formData.get('subject') as string) || '',
      phone: (formData.get('phone') as string) || '',
      campusIds: campusesSelected.length > 0 ? campusesSelected : ['cs1'],
      experience: (formData.get('experience') as string) || '',
      description: (formData.get('description') as string) || '',
      commitment: (formData.get('commitment') as string) || '',
      avatarUrl:
        (formData.get('avatarUrl') as string) ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      order: editingTeacher ? editingTeacher.order : data.teachers.length + 1
    };

    let updatedTeachers: TeacherItem[];
    if (editingTeacher) {
      updatedTeachers = data.teachers.map((t) => (t.id === item.id ? item : t));
    } else {
      updatedTeachers = [...data.teachers, item];
    }

    onUpdateData({ ...data, teachers: updatedTeachers });
    setEditingTeacher(null);
    setIsAddingTeacher(false);
  };

  const handleDeleteTeacher = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Xóa thông tin giáo viên?',
      message: 'Giáo viên này sẽ bị gỡ khỏi danh sách hiển thị trên website.',
      confirmText: 'Xóa giáo viên',
      isDestructive: true,
      action: () => {
        const updated = data.teachers.filter((t) => t.id !== id);
        onUpdateData({ ...data, teachers: updated });
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-6xl w-full h-[95vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden">
        {/* Top Navbar */}
        <div className="px-6 py-4 bg-[#0F294A] border-b border-blue-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg">
              <i className="fa-solid fa-sliders"></i>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                HỆ THỐNG QUẢN TRỊ TRUNG TÂM TRÍ TUỆ
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  CMS v2.0
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Thêm, Sửa, Xóa & Đồng bộ Google Workspace trực tiếp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 bg-blue-950 px-3 py-1.5 rounded-xl border border-blue-800 text-xs text-slate-200">
                <i className="fa-brands fa-google text-emerald-400"></i>
                <span className="truncate max-w-[120px]">{currentUser.displayName || currentUser.email}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onGoogleSignIn}
                className="hidden sm:inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold transition"
              >
                <i className="fa-brands fa-google text-red-500"></i>
                <span>Kết nối Google</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Google Authentication Screen */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-4 shadow-lg shadow-amber-500/20">
                <i className="fa-solid fa-user-shield text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Đăng Nhập Quản Trị</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Hệ thống yêu cầu xác thực bằng <strong>Tài Khoản Google</strong> có trong danh sách phân quyền của trung tâm.
              </p>

              {/* Case 1: currentUser is already signed in with Google */}
              {currentUser ? (
                <div className="mb-6 space-y-4">
                  {isUserAuthorizedAdmin(currentUser.email) ? (
                    <div className="bg-emerald-950/60 border border-emerald-800 rounded-2xl p-4 text-left">
                      <div className="flex items-center gap-3 mb-3">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="avatar"
                            className="w-10 h-10 rounded-full border border-emerald-400"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                            {currentUser.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">
                            {currentUser.displayName || 'Quản Trị Viên'}
                          </p>
                          <p className="text-[11px] text-emerald-300 truncate">{currentUser.email}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                          Hợp Lệ
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAuthenticated(true)}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow-md"
                      >
                        <i className="fa-solid fa-arrow-right-to-bracket mr-1.5"></i>
                        Vào Bảng Quản Trị Ngay
                      </button>
                    </div>
                  ) : (
                    <div className="bg-rose-950/60 border border-rose-800 rounded-2xl p-4 text-left space-y-3">
                      <div className="flex items-start gap-2.5 text-xs text-rose-300">
                        <i className="fa-solid fa-circle-xmark text-rose-400 mt-0.5 shrink-0"></i>
                        <div>
                          <strong className="text-white block mb-0.5">Truy Cập Bị Từ Chối</strong>
                          Tài khoản <strong>{currentUser.email}</strong> chưa được cấp quyền quản trị.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleGoogleAdminLogin}
                        className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow"
                      >
                        <i className="fa-brands fa-google text-red-500 mr-1.5"></i>
                        Đổi Sang Tài Khoản Google Khác
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Case 2: currentUser not signed in yet */
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleGoogleAdminLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition shadow-lg cursor-pointer border border-slate-200"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.32 14.27c-.24-.73-.38-1.5-.38-2.27s.14-1.54.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.06-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.18 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.06 3.15c.94-2.83 3.58-4.96 6.68-4.96z"
                      />
                    </svg>
                    <span>Đăng Nhập Quản Trị Bằng Google</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2 italic">
                    Chỉ tài khoản Google được cấp quyền mới có thể truy cập
                  </p>
                </div>
              )}

              {authError && (
                <div className="mb-4 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
                  {authError}
                </div>
              )}

              {/* Security Policy Notice */}
              <div className="pt-4 border-t border-slate-700/60 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-[11px] text-slate-400">
                  <i className="fa-solid fa-shield-halved text-amber-400"></i>
                  <span>Bảo mật tối đa: Chỉ chấp nhận xác thực qua Google OAuth</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sync Status Banner */}
            {syncStatus.type && (
              <div
                className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between shrink-0 ${
                  syncStatus.type === 'success'
                    ? 'bg-emerald-900/80 text-emerald-200 border-b border-emerald-700'
                    : syncStatus.type === 'error'
                    ? 'bg-rose-900/80 text-rose-200 border-b border-rose-700'
                    : 'bg-blue-900/80 text-blue-200 border-b border-blue-700'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <i
                    className={`fa-solid ${
                      syncStatus.type === 'success'
                        ? 'fa-circle-check'
                        : syncStatus.type === 'error'
                        ? 'fa-triangle-exclamation'
                        : 'fa-spinner fa-spin'
                    }`}
                  ></i>
                  <span>{syncStatus.message}</span>
                  {syncStatus.type === 'error' &&
                    (syncStatus.message.includes('AUTH_SCOPE_REQUIRED') ||
                      syncStatus.message.includes('chưa cấp quyền') ||
                      syncStatus.message.includes('insufficient authentication scopes')) && (
                      <button
                        type="button"
                        onClick={onGoogleSignIn}
                        className="ml-2 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shadow transition cursor-pointer"
                      >
                        <i className="fa-brands fa-google mr-1"></i> Bấm để cấp quyền Google ngay
                      </button>
                    )}
                </div>
                {syncStatus.linkUrl && (
                  <a
                    href={syncStatus.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-amber-300 hover:text-white font-bold ml-4"
                  >
                    {syncStatus.linkText || 'Xem liên kết ↗'}
                  </a>
                )}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="bg-slate-800/80 border-b border-slate-700 px-6 py-2 flex items-center justify-between overflow-x-auto shrink-0 gap-2">
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    activeTab === 'leads'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-users"></i>
                  <span>Khách Đăng Ký ({data.leads.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('schedules')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    activeTab === 'schedules'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-calendar-days"></i>
                  <span>Thời Khóa Biểu ({data.schedules.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('teachers')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    activeTab === 'teachers'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-chalkboard-user"></i>
                  <span>Giáo Viên ({data.teachers.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('boarding')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    activeTab === 'boarding'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-shield-heart"></i>
                  <span>Bán Trú & Quy Định</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('fees_campuses')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    activeTab === 'fees_campuses'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-school"></i>
                  <span>Học Phí & 3 Cơ Sở</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('workspace')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    activeTab === 'workspace'
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                      : 'text-blue-300 hover:text-white hover:bg-blue-900/60'
                  }`}
                >
                  <i className="fa-brands fa-google text-amber-400"></i>
                  <span>Google Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('admin_users')}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    activeTab === 'admin_users'
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                      : 'text-amber-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-user-shield"></i>
                  <span>Phân Quyền Admin ({adminEmails.length})</span>
                </button>
              </div>

              {/* Data actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => exportDataAsJSON(data)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-[11px] font-semibold text-slate-200 transition"
                  title="Tải bản sao lưu JSON về máy"
                >
                  <i className="fa-solid fa-download mr-1"></i> Tải JSON
                </button>

                <label className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-[11px] font-semibold text-slate-200 transition cursor-pointer">
                  <i className="fa-solid fa-upload mr-1"></i> Nạp JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-semibold transition cursor-pointer"
                  title="Khôi phục dữ liệu ban đầu"
                >
                  <i className="fa-solid fa-rotate-left mr-1"></i> Reset
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: LEADS (DANH SÁCH KHÁCH ĐĂNG KÝ) */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Danh Sách Phụ Huynh Đăng Ký Tư Vấn ({data.leads.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        Thông tin phụ huynh gửi từ form website hoặc Google Forms
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => exportLeadsAsCSV(data.leads)}
                        className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-file-csv text-emerald-400"></i>
                        <span>Xuất File CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={triggerGoogleSheetsSync}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 disabled:opacity-50"
                      >
                        <i className="fa-solid fa-table"></i>
                        <span>Đồng bộ Google Sheets</span>
                      </button>
                    </div>
                  </div>

                  {data.leads.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/60">
                      <i className="fa-solid fa-inbox text-4xl text-slate-500 mb-2"></i>
                      <p className="text-slate-400 text-sm">Chưa có thông tin đăng ký nào.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto bg-slate-800 rounded-2xl border border-slate-700">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                          <tr>
                            <th className="py-3 px-4">Phụ huynh & SĐT</th>
                            <th className="py-3 px-4">Học sinh / Lớp</th>
                            <th className="py-3 px-4">Cơ sở & Dịch vụ</th>
                            <th className="py-3 px-4">Ghi chú</th>
                            <th className="py-3 px-4">Ngày gửi</th>
                            <th className="py-3 px-4">Trạng thái</th>
                            <th className="py-3 px-4 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/60">
                          {data.leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-750 transition">
                              <td className="py-3 px-4">
                                <div className="font-bold text-white text-sm">
                                  {lead.parentName}
                                </div>
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="text-amber-400 font-semibold hover:underline"
                                >
                                  {lead.phone}
                                </a>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-200">
                                  {lead.studentName || 'Chưa cập nhật'}
                                </div>
                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold text-[10px]">
                                  Lớp {lead.grade}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-amber-300">
                                  {lead.campusId === 'cs1'
                                    ? 'Cơ sở 1 (Trung Mỹ Tây)'
                                    : lead.campusId === 'cs2'
                                    ? 'Cơ sở 2 (Hiệp Thành)'
                                    : 'Cơ sở 3 (Bà Điểm)'}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {(lead.services || []).join(', ')}
                                </div>
                              </td>
                              <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                                {lead.notes || '—'}
                              </td>
                              <td className="py-3 px-4 text-slate-400 text-[11px]">
                                {lead.createdAt}
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={lead.status}
                                  onChange={(e) =>
                                    handleUpdateLeadStatus(lead.id, e.target.value as any)
                                  }
                                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none ${
                                    lead.status === 'new'
                                      ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                                      : lead.status === 'contacted'
                                      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                                  }`}
                                >
                                  <option value="new">Mới gửi</option>
                                  <option value="contacted">Đã liên hệ</option>
                                  <option value="enrolled">Đã nhập học</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Create Google Calendar event */}
                                  <button
                                    type="button"
                                    onClick={() => triggerGoogleCalendarEvent(lead)}
                                    title="Tạo lịch nhắc hẹn tư vấn trên Google Calendar"
                                    className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-300 transition"
                                  >
                                    <i className="fa-solid fa-calendar-plus text-xs"></i>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLead(lead.id)}
                                    title="Xóa lead"
                                    className="p-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-300 transition"
                                  >
                                    <i className="fa-solid fa-trash-can text-xs"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SCHEDULES (QUẢN LÝ THỜI KHÓA BIỂU) */}
              {activeTab === 'schedules' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Quản Lý Thời Khóa Biểu Học Thêm ({data.schedules.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        Cập nhật phân ca sáng, chiều, tối cho từng cơ sở và khối lớp
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSchedule(null);
                        setIsAddingSchedule(true);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Thêm Lịch Học Mới</span>
                    </button>
                  </div>

                  {/* List of Schedules */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.schedules.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-xs">
                                Lớp {item.grade}
                              </span>
                              <span className="text-xs font-semibold text-blue-300">
                                {item.campusId === 'cs1'
                                  ? 'Cơ sở 1'
                                  : item.campusId === 'cs2'
                                  ? 'Cơ sở 2'
                                  : 'Cơ sở 3'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">{item.startDate}</span>
                          </div>

                          <h4 className="font-bold text-white text-sm mb-1">{item.subject}</h4>
                          {item.teacher && (
                            <p className="text-xs text-amber-300 font-medium mb-2">
                              Giáo viên: {item.teacher} {item.phone && `(${item.phone})`}
                            </p>
                          )}

                          <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl space-y-1 mb-2">
                            {item.morningSlot && <div><strong>Sáng:</strong> {item.morningSlot}</div>}
                            {item.afternoonSlot && <div><strong>Chiều:</strong> {item.afternoonSlot}</div>}
                            {item.eveningSlot && <div><strong>Tối:</strong> {item.eveningSlot}</div>}
                            {item.weeklySchedule && (
                              <div className="text-slate-400 text-[11px] whitespace-pre-line border-t border-slate-800 pt-1 mt-1">
                                {item.weeklySchedule}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSchedule(item);
                              setIsAddingSchedule(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 text-xs font-semibold"
                          >
                            <i className="fa-solid fa-pen mr-1"></i> Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSchedule(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs font-semibold"
                          >
                            <i className="fa-solid fa-trash mr-1"></i> Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TEACHERS (QUẢN LÝ GIÁO VIÊN) */}
              {activeTab === 'teachers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Đội Ngũ Giáo Viên Phụ Trách ({data.teachers.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        Cập nhật bộ môn, kinh nghiệm giảng dạy và cam kết điểm số
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeacher(null);
                        setIsAddingTeacher(true);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <i className="fa-solid fa-user-plus"></i>
                      <span>Thêm Giáo Viên Mới</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
                              alt={teacher.name}
                              className="w-12 h-12 rounded-xl object-cover border border-amber-400/40"
                            />
                            <div>
                              <h4 className="font-extrabold text-white text-sm">{teacher.name}</h4>
                              <span className="text-xs text-amber-400 font-semibold">
                                {teacher.subject} • {teacher.phone}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-300 space-y-1.5 mb-3">
                            <p className="text-blue-300 font-medium">{teacher.experience}</p>
                            <p className="text-slate-400 text-[11px] line-clamp-2">
                              {teacher.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setIsAddingTeacher(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 text-xs font-semibold"
                          >
                            <i className="fa-solid fa-pen mr-1"></i> Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs font-semibold"
                          >
                            <i className="fa-solid fa-trash mr-1"></i> Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: BOARDING (QUẢN LÝ BÁN TRÚ) */}
              {activeTab === 'boarding' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <h3 className="text-base font-bold text-white">
                      Mốc Giờ Timeline Sinh Hoạt Trong Ngày (Cơ sở 1)
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Tự do chỉnh sửa giờ giấc và nội dung hoạt động cho các con
                    </p>

                    <div className="space-y-3">
                      {data.boardingTimeline.map((item, idx) => (
                        <div
                          key={item.id}
                          className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-amber-400 shrink-0 w-24">
                              {item.timeRange}
                            </span>
                            <div>
                              <strong className="text-white block">{item.activity}</strong>
                              <span className="text-slate-400 text-[11px]">{item.detail}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const newTime = prompt('Sửa khung giờ:', item.timeRange);
                              const newAct = prompt('Sửa hoạt động:', item.activity);
                              const newDet = prompt('Sửa chi tiết:', item.detail);
                              if (newTime && newAct) {
                                const updated = data.boardingTimeline.map((t) =>
                                  t.id === item.id
                                    ? {
                                        ...t,
                                        timeRange: newTime,
                                        activity: newAct,
                                        detail: newDet || t.detail
                                      }
                                    : t
                                );
                                onUpdateData({ ...data, boardingTimeline: updated });
                              }
                            }}
                            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0"
                          >
                            <i className="fa-solid fa-pen mr-1"></i> Sửa mốc giờ
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <h3 className="text-base font-bold text-white mb-3">
                      Chính Sách Xe Đưa Đón & Quy Định Điểm Danh Báo Nghỉ
                    </h3>
                    <div className="space-y-3">
                      {data.boardingRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-700 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-amber-300 font-bold">{rule.title}</strong>
                            <button
                              type="button"
                              onClick={() => {
                                const newContent = prompt('Chỉnh sửa nội dung quy định:', rule.content);
                                if (newContent) {
                                  const updated = data.boardingRules.map((r) =>
                                    r.id === rule.id ? { ...r, content: newContent } : r
                                  );
                                  onUpdateData({ ...data, boardingRules: updated });
                                }
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                              <i className="fa-solid fa-pen mr-1"></i> Sửa
                            </button>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{rule.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: FEES & CAMPUSES (HỌC PHÍ & 3 CƠ SỞ) */}
              {activeTab === 'fees_campuses' && (
                <div className="space-y-6">
                  {/* Fees */}
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <h3 className="text-base font-bold text-white mb-2">Bảng Giá Học Phí & Combo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {data.fees.map((f) => (
                        <div
                          key={f.id}
                          className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-amber-400">{f.title}</span>
                              <span className="text-slate-400 text-[10px]">{f.gradeRange}</span>
                            </div>
                            <div className="text-white font-extrabold text-sm mb-2">
                              {f.price} <span className="text-xs font-normal text-slate-400">{f.unit}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newPrice = prompt('Nhập giá mới (VD: 600.000 – 800.000):', f.price);
                              if (newPrice) {
                                const updated = data.fees.map((item) =>
                                  item.id === f.id ? { ...item, price: newPrice } : item
                                );
                                onUpdateData({ ...data, fees: updated });
                              }
                            }}
                            className="mt-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded text-center"
                          >
                            <i className="fa-solid fa-pen mr-1"></i> Sửa học phí
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campuses */}
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <h3 className="text-base font-bold text-white mb-2">Thông Tin 3 Cơ Sở</h3>
                    <div className="space-y-3 text-xs">
                      {data.campuses.map((c) => (
                        <div
                          key={c.id}
                          className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-amber-400 text-sm">{c.name}</strong>
                            <span className="text-emerald-400 font-bold">
                              Hotlines: {c.hotlines.join(' – ')}
                            </span>
                          </div>
                          <p className="text-slate-300">
                            <strong>Địa chỉ:</strong> {c.address}
                          </p>
                          <p className="text-slate-400 italic">
                            <strong>Mốc gần kề:</strong> {c.landmark}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: GOOGLE WORKSPACE */}
              {activeTab === 'workspace' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-950 via-slate-800 to-blue-950 p-6 rounded-3xl border border-blue-800 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-2xl shadow-md">
                        <i className="fa-brands fa-google text-blue-600"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">
                          Tích Hợp Google Workspace Trực Tiếp
                        </h3>
                        <p className="text-xs text-slate-300">
                          Kết nối an toàn qua Google OAuth để tự động hóa quản lý trung tâm
                        </p>
                      </div>
                    </div>

                    {!currentUser ? (
                      <div className="bg-blue-900/40 border border-blue-700/60 rounded-2xl p-4 text-xs text-slate-200 mb-6 flex items-center justify-between">
                        <span>Chưa đăng nhập Google Workspace. Vui lòng bấm kết nối bên phải:</span>
                        <button
                          type="button"
                          onClick={onGoogleSignIn}
                          className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs shadow"
                        >
                          Đăng nhập Google ngay
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-950/60 border border-emerald-800 rounded-2xl p-3.5 text-xs text-emerald-200 mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-circle-check text-emerald-400"></i>
                          <span>Đã liên kết tài khoản: <strong>{currentUser.email}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={onGoogleSignIn}
                            className="px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Mở lại màn hình xác nhận quyền Google Sheets/Drive"
                          >
                            <i className="fa-solid fa-key mr-1"></i> Cấp lại quyền Google
                          </button>
                          <span className="text-[11px] bg-emerald-900 px-2 py-1 rounded text-emerald-300 font-semibold">
                            Sẵn sàng đồng bộ
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 4 Workspace Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Google Sheets */}
                      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                            <i className="fa-solid fa-table text-lg"></i>
                            <h4>Google Sheets (Trang Tính)</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Tự động đồng bộ toàn bộ danh sách phụ huynh đăng ký tư vấn sang Google Sheets. Ban tuyển sinh có thể theo dõi và phân công chăm sóc trực tiếp.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={triggerGoogleSheetsSync}
                          disabled={isProcessing}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                          <span>Đồng bộ Leads sang Google Sheets</span>
                        </button>
                      </div>

                      {/* 2. Google Drive */}
                      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                            <i className="fa-brands fa-google-drive text-lg"></i>
                            <h4>Google Drive (Lưu Trữ Đám Mây)</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Sao lưu toàn bộ cơ sở dữ liệu trung tâm (thời khóa biểu, giáo viên, học phí, lịch sử học sinh) lên thư mục Google Drive của bạn dưới dạng JSON an toàn.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={triggerGoogleDriveBackup}
                          disabled={isProcessing}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <i className="fa-solid fa-hard-drive"></i>
                          <span>Sao lưu lên Google Drive</span>
                        </button>
                      </div>

                      {/* 3. Google Calendar */}
                      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                            <i className="fa-solid fa-calendar-check text-lg"></i>
                            <h4>Google Calendar (Lịch Nhắc Hẹn)</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Tạo lịch nhắc hẹn tư vấn hoặc kiểm tra năng lực đầu vào cho từng học sinh trực tiếp vào Google Calendar cá nhân kèm thông báo chuông.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (data.leads.length === 0) {
                              alert('Chưa có lead nào để tạo lịch hẹn.');
                              return;
                            }
                            triggerGoogleCalendarEvent(data.leads[0]);
                          }}
                          disabled={isProcessing}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <i className="fa-solid fa-clock"></i>
                          <span>Tạo lịch hẹn trên Google Calendar</span>
                        </button>
                      </div>

                      {/* 4. Google Forms */}
                      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
                            <i className="fa-solid fa-square-poll-vertical text-lg"></i>
                            <h4>Google Forms (Biểu Mẫu Tuyển Sinh)</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Khởi tạo tự động một Google Form tuyển sinh chính thức gồm đầy đủ câu hỏi để gửi qua Zalo hoặc nhúng vào trang mạng xã hội của trung tâm.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={triggerCreateGoogleForm}
                          disabled={isProcessing}
                          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <i className="fa-solid fa-file-circle-plus"></i>
                          <span>Tạo Google Form Tuyển Sinh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: ADMIN USERS (TÀI KHOẢN QUẢN TRỊ GOOGLE) */}
              {activeTab === 'admin_users' && (
                <div className="space-y-6">
                  {/* Overview Banner */}
                  <div className="bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 p-6 rounded-3xl border border-blue-800/80 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl shadow-md">
                          <i className="fa-solid fa-users-gear"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white">
                            Quản Lý Tài Khoản Quản Trị Google
                          </h3>
                          <p className="text-xs text-slate-300">
                            Chỉ những tài khoản Gmail có trong danh sách này mới có quyền đăng nhập và chỉnh sửa dữ liệu trung tâm
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-900/40 border border-blue-700/60 px-4 py-2 rounded-2xl text-xs flex items-center gap-2">
                        <span className="text-slate-300">Tổng số Admin:</span>
                        <span className="font-extrabold text-amber-300 text-sm">{adminEmails.length}</span>
                      </div>
                    </div>

                    {/* Add new Admin Form */}
                    <form onSubmit={handleAddAdminEmail} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <i className="fa-solid fa-user-plus"></i>
                        <span>Thêm Tài Khoản Quản Trị Viên Mới</span>
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <i className="fa-brands fa-google absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                          <input
                            type="email"
                            placeholder="Nhập địa chỉ Gmail (VD: giaovien.quanly@gmail.com)..."
                            value={newAdminEmailInput}
                            onChange={(e) => setNewAdminEmailInput(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
                        >
                          <i className="fa-solid fa-plus"></i>
                          <span>Cấp Quyền Quản Trị</span>
                        </button>
                      </div>
                      {newAdminError && (
                        <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <span>{newAdminError}</span>
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400">
                        * Tài khoản sau khi thêm có thể vào trang quản trị ngay bằng nút "Đăng Nhập Quản Trị Bằng Google".
                      </p>
                    </form>
                  </div>

                  {/* List of Admins */}
                  <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-shield-halved text-amber-400"></i>
                        Danh Sách Quản Trị Viên Được Cấp Phép ({adminEmails.length})
                      </span>
                    </h4>

                    <div className="space-y-3">
                      {adminEmails.map((email, index) => {
                        const isCurrent = currentUser?.email?.toLowerCase() === email.toLowerCase();
                        const isPrimary = index === 0;
                        return (
                          <div
                            key={email}
                            className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isCurrent
                                ? 'bg-blue-950/70 border-blue-700'
                                : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow">
                                {email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white">{email}</span>
                                  {isPrimary && (
                                    <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                                      Super Admin
                                    </span>
                                  )}
                                  {isCurrent && (
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                                      Bạn đang dùng
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {isPrimary
                                    ? 'Tài khoản quản trị viên chính của trung tâm'
                                    : 'Quản trị viên được phân quyền đầy đủ'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              {adminEmails.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdminEmail(email)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                                  title="Thu hồi quyền quản trị"
                                >
                                  <i className="fa-solid fa-trash-can text-xs"></i>
                                  <span>Xóa Quyền</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500 italic">
                                  (Quản trị viên duy nhất)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule Add/Edit Modal */}
        {isAddingSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full p-6 border border-slate-700 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">
                  {editingSchedule ? 'Chỉnh Sửa Lịch Học' : 'Thêm Lịch Học Mới'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingSchedule(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cơ sở</label>
                  <select
                    name="campusId"
                    defaultValue={editingSchedule?.campusId || 'cs1'}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="cs1">Cơ sở 1 (Trung Mỹ Tây, Q.12)</option>
                    <option value="cs2">Cơ sở 2 (Hiệp Thành, Q.12)</option>
                    <option value="cs3">Cơ sở 3 (Bà Điểm, Hóc Môn)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Khối lớp</label>
                    <input
                      name="grade"
                      defaultValue={editingSchedule?.grade || '6'}
                      placeholder="VD: 6 hoặc 10A"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Ngày bắt đầu</label>
                    <input
                      name="startDate"
                      defaultValue={editingSchedule?.startDate || 'Từ 06/09/2026'}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tên môn học / Chương trình</label>
                  <input
                    name="subject"
                    defaultValue={editingSchedule?.subject || ''}
                    placeholder="VD: Toán – Lý – Hóa"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Giáo viên</label>
                    <input
                      name="teacher"
                      defaultValue={editingSchedule?.teacher || ''}
                      placeholder="VD: Thầy Nam"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Số điện thoại</label>
                    <input
                      name="phone"
                      defaultValue={editingSchedule?.phone || ''}
                      placeholder="VD: 0907 806 333"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ca Sáng</label>
                  <input
                    name="morningSlot"
                    defaultValue={editingSchedule?.morningSlot || ''}
                    placeholder="VD: Sáng 7h30 - 10h30 (Toán/Văn/Anh)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ca Chiều</label>
                  <input
                    name="afternoonSlot"
                    defaultValue={editingSchedule?.afternoonSlot || ''}
                    placeholder="VD: Chiều CN 14h30 - 17h00 (Văn ca 1)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ca Tối</label>
                  <input
                    name="eveningSlot"
                    defaultValue={editingSchedule?.eveningSlot || ''}
                    placeholder="VD: Tối 17h30 - 19h00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lịch phân ca chi tiết</label>
                  <textarea
                    name="weeklySchedule"
                    rows={2}
                    defaultValue={editingSchedule?.weeklySchedule || ''}
                    placeholder="VD: Thứ 2: Anh | T3: KHTN | T4: Toán..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ghi chú thêm</label>
                  <input
                    name="notes"
                    defaultValue={editingSchedule?.notes || ''}
                    placeholder="Ghi chú về tài liệu, xếp lớp..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingSchedule(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                  >
                    Lưu lịch học
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teacher Add/Edit Modal */}
        {isAddingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full p-6 border border-slate-700 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">
                  {editingTeacher ? 'Chỉnh Sửa Giáo Viên' : 'Thêm Giáo Viên Mới'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingTeacher(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <form onSubmit={handleSaveTeacher} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Họ tên Thầy / Cô</label>
                    <input
                      name="name"
                      defaultValue={editingTeacher?.name || ''}
                      placeholder="VD: Thầy Trác"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Số điện thoại</label>
                    <input
                      name="phone"
                      defaultValue={editingTeacher?.phone || ''}
                      placeholder="VD: 0902 765 237"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Bộ môn giảng dạy</label>
                    <input
                      name="subject"
                      defaultValue={editingTeacher?.subject || ''}
                      placeholder="VD: Vật Lý, Hóa Học..."
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Chức danh / Tiêu đề</label>
                    <input
                      name="title"
                      defaultValue={editingTeacher?.title || 'Giáo viên bộ môn'}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cơ sở giảng dạy</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-slate-300">
                      <input
                        type="checkbox"
                        name="campuses"
                        value="cs1"
                        defaultChecked={editingTeacher?.campusIds.includes('cs1') ?? false}
                      />
                      <span>Cơ sở 1</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-slate-300">
                      <input
                        type="checkbox"
                        name="campuses"
                        value="cs2"
                        defaultChecked={editingTeacher?.campusIds.includes('cs2') ?? true}
                      />
                      <span>Cơ sở 2</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-slate-300">
                      <input
                        type="checkbox"
                        name="campuses"
                        value="cs3"
                        defaultChecked={editingTeacher?.campusIds.includes('cs3') ?? false}
                      />
                      <span>Cơ sở 3</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kinh nghiệm giảng dạy</label>
                  <input
                    name="experience"
                    defaultValue={editingTeacher?.experience || ''}
                    placeholder="VD: Hơn 10 năm luyện thi THPT Quốc Gia"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phương pháp & Giới thiệu</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editingTeacher?.description || ''}
                    placeholder="Mô tả phong cách sư phạm, phương pháp rèn tư duy..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cam kết đầu ra</label>
                  <input
                    name="commitment"
                    defaultValue={editingTeacher?.commitment || ''}
                    placeholder="VD: Cam kết điểm 8+ trong kỳ thi tốt nghiệp"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Link ảnh đại diện (URL)</label>
                  <input
                    name="avatarUrl"
                    defaultValue={editingTeacher?.avatarUrl || ''}
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingTeacher(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                  >
                    Lưu giáo viên
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Calendar Appointment Quick Modal */}
        {calendarTargetLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl">
              <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                <i className="fa-solid fa-calendar-plus text-amber-400"></i>
                <span>Tạo Lịch Hẹn Tư Vấn (Google Calendar)</span>
              </h3>
              <p className="text-xs text-slate-300 mb-4">
                Phụ huynh: <strong>{calendarTargetLead.parentName}</strong> ({calendarTargetLead.phone}) - Lớp {calendarTargetLead.grade}
              </p>

              <div className="space-y-3 text-xs mb-5">
                <div>
                  <label className="block text-slate-400 mb-1">Chọn ngày & giờ hẹn tư vấn:</label>
                  <input
                    type="datetime-local"
                    value={appointmentDateTime}
                    onChange={(e) => setAppointmentDateTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCalendarTargetLead(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={confirmCreateCalendarEvent}
                  disabled={isProcessing}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
                >
                  {isProcessing ? 'Đang tạo...' : 'Tạo sự kiện Calendar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Destructive or Mutating Confirm Dialog */}
        <ConfirmModal
          isOpen={confirmState.isOpen}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          isDestructive={confirmState.isDestructive}
          onConfirm={confirmState.action}
          onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
};
