import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ScheduleSection } from './components/ScheduleSection';
import { BoardingSection } from './components/BoardingSection';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminModal } from './components/AdminModal';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { CenterData, ConsultationLead } from './types';
import { loadCenterData, saveCenterData, subscribeToCenterData } from './services/storage';
import { initAuth, googleSignIn, logout } from './services/auth';

export default function App() {
  const [centerData, setCenterData] = useState<CenterData>(() => loadCenterData());

  // Consultation modal state
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationPrefill, setConsultationPrefill] = useState<{
    grade?: string;
    campusId?: 'cs1' | 'cs2' | 'cs3';
    subject?: string;
    teacherName?: string;
    service?: string;
  }>({});

  // Admin modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Firebase Auth state for Google Workspace features
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Realtime Cloud Firestore sync
    const unsubData = subscribeToCenterData((cloudData) => {
      setCenterData(cloudData);
    });

    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );

    // Support opening admin via secret keyboard shortcut (Ctrl+Shift+A) or ?admin=true query parameter
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    if (typeof window !== 'undefined' && window.location.search.includes('admin=true')) {
      setIsAdminOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubData();
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update center data & persist to localStorage
  const handleUpdateData = (newData: CenterData) => {
    setCenterData(newData);
    saveCenterData(newData);
  };

  // Handle consultation submission from parents
  const handleConsultationSubmit = (
    leadData: Omit<ConsultationLead, 'id' | 'createdAt' | 'status'>
  ) => {
    const newLead: ConsultationLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'new'
    };

    const updatedLeads = [newLead, ...centerData.leads];
    handleUpdateData({
      ...centerData,
      leads: updatedLeads
    });
  };

  // Google sign in trigger
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setCurrentUser(res.user);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        return;
      }
      console.error('Lỗi kết nối Google Workspace:', err);
      alert('Không thể kết nối tài khoản Google: ' + (err.message || 'Vui lòng thử lại sau.'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  // Trigger consultation with prefilled intent
  const openConsultationWithInfo = (info: {
    grade?: string;
    campusId?: 'cs1' | 'cs2' | 'cs3';
    subject?: string;
    teacherName?: string;
    service?: string;
  }) => {
    setConsultationPrefill(info);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Be_Vietnam_Pro',sans-serif]">
      {/* Header */}
      <Header
        onOpenConsultation={() => openConsultationWithInfo({})}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentUser={currentUser}
        onGoogleSignIn={handleGoogleSignIn}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      {/* Main Public SPA Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          campuses={centerData.campuses}
          onOpenConsultation={() => openConsultationWithInfo({})}
        />

        {/* SECTION 1: HỌC THÊM (Thời Khóa Biểu & Giáo Viên) */}
        <ScheduleSection
          schedules={centerData.schedules}
          teachers={centerData.teachers}
          campuses={centerData.campuses}
          onSelectForConsultation={openConsultationWithInfo}
        />

        {/* SECTION 2: BÁN TRÚ (Timeline, Đưa đón, Điểm danh báo nghỉ) */}
        <BoardingSection
          timeline={centerData.boardingTimeline}
          rules={centerData.boardingRules}
          onOpenConsultation={(svc) => openConsultationWithInfo({ service: svc || 'Bán Trú' })}
        />
      </main>

      {/* Footer */}
      <Footer
        campuses={centerData.campuses}
        onOpenConsultation={() => openConsultationWithInfo({})}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Actions (Hotline, Zalo, Scroll to top) */}
      <FloatingActions />

      {/* Parent Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        onSubmit={handleConsultationSubmit}
        prefill={consultationPrefill}
      />

      {/* Admin Portal CMS Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={centerData}
        onUpdateData={handleUpdateData}
        currentUser={currentUser}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
}
