import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { CenterData } from '../types';
import { initialData } from '../data/initialData';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const STORAGE_KEY = 'TRITUE_CENTER_DATA_V1';
const FIRESTORE_COLLECTION = 'center_config';
const FIRESTORE_DOC_PATH = 'main';

export const loadCenterData = (): CenterData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCenterData(initialData);
      return initialData;
    }
    const parsed = JSON.parse(raw);
    // Ensure all keys exist
    return {
      ...initialData,
      ...parsed,
      campuses: parsed.campuses || initialData.campuses,
      schedules: parsed.schedules || initialData.schedules,
      teachers: parsed.teachers || initialData.teachers,
      boardingTimeline: parsed.boardingTimeline || initialData.boardingTimeline,
      boardingRules: parsed.boardingRules || initialData.boardingRules,
      fees: parsed.fees || initialData.fees,
      leads: parsed.leads || initialData.leads,
      adminEmails:
        Array.isArray(parsed.adminEmails) && parsed.adminEmails.length > 0
          ? parsed.adminEmails
          : initialData.adminEmails
    };
  } catch (err) {
    console.error('Failed to parse center data from localStorage, using initial:', err);
    return initialData;
  }
};

export const saveCenterData = (data: CenterData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save center data to localStorage:', err);
  }

  // Also persist to Cloud Firestore for multi-device sync
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_PATH);
    setDoc(docRef, data, { merge: true }).catch((err) => {
      console.warn('Firestore background sync warning:', err);
    });
  } catch (err) {
    console.warn('Firestore sync failed:', err);
  }
};

/**
 * Subscribes to realtime updates from Cloud Firestore
 */
export const subscribeToCenterData = (onUpdate: (data: CenterData) => void) => {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_PATH);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as Partial<CenterData>;
          const merged: CenterData = {
            ...initialData,
            ...cloudData,
            campuses: cloudData.campuses || initialData.campuses,
            schedules: cloudData.schedules || initialData.schedules,
            teachers: cloudData.teachers || initialData.teachers,
            boardingTimeline: cloudData.boardingTimeline || initialData.boardingTimeline,
            boardingRules: cloudData.boardingRules || initialData.boardingRules,
            fees: cloudData.fees || initialData.fees,
            leads: cloudData.leads || initialData.leads,
            adminEmails:
              Array.isArray(cloudData.adminEmails) && cloudData.adminEmails.length > 0
                ? cloudData.adminEmails
                : initialData.adminEmails
          };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {}
          onUpdate(merged);
        } else {
          // Initialize doc with initialData on first read
          setDoc(docRef, initialData).catch(() => {});
        }
      },
      (err) => {
        console.warn('Firestore subscription notice (using localStorage fallback):', err);
      }
    );
  } catch (err) {
    console.warn('Could not initialize Firestore realtime listener:', err);
    return () => {};
  }
};

export const resetCenterData = (): CenterData => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  } catch (err) {
    console.error('Failed to reset center data:', err);
  }
  return initialData;
};

export const exportDataAsJSON = (data: CenterData): void => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute(
    'download',
    `TriTue_Center_Data_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const exportLeadsAsCSV = (leads: CenterData['leads']): void => {
  const headers = [
    'Mã Lead',
    'Họ Tên Phụ Huynh',
    'Số Điện Thoại',
    'Họ Tên Học Sinh',
    'Khối Lớp',
    'Cơ Sở Quan Tâm',
    'Dịch Vụ',
    'Ghi Chú',
    'Thời Gian Đăng Ký',
    'Trạng Thái'
  ];

  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${l.parentName || ''}"`,
    `"${l.phone || ''}"`,
    `"${l.studentName || ''}"`,
    `"Lớp ${l.grade || ''}"`,
    `"${l.campusId === 'cs1' ? 'Cơ sở 1 (Trung Mỹ Tây)' : l.campusId === 'cs2' ? 'Cơ sở 2 (Hiệp Thành)' : 'Cơ sở 3 (Bà Điểm)'}"`,
    `"${(l.services || []).join(', ')}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
    `"${l.createdAt || ''}"`,
    `"${l.status === 'new' ? 'Mới' : l.status === 'contacted' ? 'Đã liên hệ' : 'Đã nhập học'}"`
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `TriTue_DanhSachDangKy_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
};
