export interface ScheduleItem {
  id: string;
  campusId: 'cs1' | 'cs2' | 'cs3';
  grade: string; // '6', '7', '8', '9', '10', '10A', '10B', '11', '11A', '11B', '12', '12A', '12B'
  subject: string;
  teacher?: string;
  phone?: string;
  startDate?: string;
  morningSlot?: string;
  afternoonSlot?: string;
  eveningSlot?: string;
  weeklySchedule?: string;
  notes?: string;
  order: number;
}

export interface TeacherItem {
  id: string;
  name: string;
  title: string;
  subject: string;
  phone: string;
  campusIds: ('cs1' | 'cs2' | 'cs3')[];
  experience: string;
  description: string;
  commitment: string;
  avatarUrl?: string;
  order: number;
}

export interface BoardingTimelineItem {
  id: string;
  timeRange: string;
  activity: string;
  detail: string;
  iconName: string;
  order: number;
}

export interface BoardingRuleItem {
  id: string;
  title: string;
  content: string;
  type: 'pickup' | 'attendance' | 'refund' | 'general';
  order: number;
}

export interface CampusItem {
  id: 'cs1' | 'cs2' | 'cs3';
  name: string;
  address: string;
  landmark: string;
  hotlines: string[];
  hasBoarding: boolean;
  featuredImages: string[];
  description: string;
}

export interface FeeItem {
  id: string;
  category: 'mon_le' | 'combo' | 'ban_tru';
  title: string;
  gradeRange: string;
  price: string;
  unit: string;
  highlights: string[];
  popular?: boolean;
  order: number;
}

export interface ConsultationLead {
  id: string;
  parentName: string;
  phone: string;
  studentName?: string;
  grade: string;
  campusId: 'cs1' | 'cs2' | 'cs3';
  services: string[]; // 'Học Thêm', 'Bán Trú'
  notes?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'enrolled';
  calendarEventId?: string;
  syncedToSheets?: boolean;
}

export interface CenterData {
  schedules: ScheduleItem[];
  teachers: TeacherItem[];
  boardingTimeline: BoardingTimelineItem[];
  boardingRules: BoardingRuleItem[];
  campuses: CampusItem[];
  fees: FeeItem[];
  leads: ConsultationLead[];
  adminPasswordHash: string; // Simple hash or string for admin access
  googleSheetsId?: string;
  googleFormsUrl?: string;
}
