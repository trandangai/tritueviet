import { ConsultationLead, CenterData } from '../types';
import { getAccessToken } from './auth';

export interface SyncResult {
  success: boolean;
  message: string;
  url?: string;
  id?: string;
}

/**
 * Syncs consultation leads to a Google Spreadsheet.
 * If existingSpreadsheetId is provided, appends or updates it; otherwise creates a new one.
 */
export const syncLeadsToGoogleSheet = async (
  leads: ConsultationLead[],
  existingSpreadsheetId?: string
): Promise<SyncResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  let spreadsheetId = existingSpreadsheetId;
  let spreadsheetUrl = '';

  // 1. Create a new spreadsheet if not provided
  if (!spreadsheetId) {
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: `TRÍ TUỆ - Danh Sách Phụ Huynh Đăng Ký (${new Date().toLocaleDateString('vi-VN')})`
        },
        sheets: [
          {
            properties: {
              title: 'Danh Sách Đăng Ký',
              gridProperties: { rowCount: 100, columnCount: 10 }
            }
          }
        ]
      })
    });

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}));
      const errMsg = errData?.error?.message || '';
      if (createRes.status === 403 || errMsg.toLowerCase().includes('insufficient authentication scopes')) {
        throw new Error('AUTH_SCOPE_REQUIRED: Tài khoản Google chưa cấp quyền "Google Sheets". Vui lòng bấm "Đăng nhập lại" để cấp quyền trên màn hình Google.');
      }
      throw new Error(errMsg || 'Không thể tạo mới bảng tính Google Sheets.');
    }

    const createdSheet = await createRes.json();
    spreadsheetId = createdSheet.spreadsheetId;
    spreadsheetUrl = createdSheet.spreadsheetUrl;

    // Add Header Row
    const headerRow = [
      'Mã Đăng Ký',
      'Họ Tên Phụ Huynh',
      'Số Điện Thoại',
      'Họ Tên Học Sinh',
      'Khối Lớp',
      'Cơ Sở Quan Tâm',
      'Dịch Vụ Đăng Ký',
      'Ghi Chú Yêu Cầu',
      'Thời Gian Gửi',
      'Trạng Thái'
    ];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Danh Sách Đăng Ký!A1:J1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [headerRow]
        })
      }
    );
  } else {
    spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  }

  // 2. Prepare lead rows
  const campusMap: Record<string, string> = {
    cs1: 'Cơ sở 1 (Trung Mỹ Tây, Q12)',
    cs2: 'Cơ sở 2 (Hiệp Thành, Q12)',
    cs3: 'Cơ sở 3 (Bà Điểm, Hóc Môn)'
  };

  const statusMap: Record<string, string> = {
    new: 'Mới gửi',
    contacted: 'Đã liên hệ tư vấn',
    enrolled: 'Đã đăng ký nhập học'
  };

  const rows = leads.map((l) => [
    l.id,
    l.parentName || '',
    l.phone || '',
    l.studentName || '',
    `Lớp ${l.grade || ''}`,
    campusMap[l.campusId] || l.campusId,
    (l.services || []).join(', '),
    l.notes || '',
    l.createdAt || '',
    statusMap[l.status] || l.status
  ]);

  if (rows.length > 0) {
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Danh Sách Đăng Ký!A2:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: rows
        })
      }
    );

    if (!appendRes.ok) {
      const errData = await appendRes.json().catch(() => ({}));
      const errMsg = errData?.error?.message || '';
      if (appendRes.status === 403 || errMsg.toLowerCase().includes('insufficient authentication scopes')) {
        throw new Error('AUTH_SCOPE_REQUIRED: Tài khoản Google chưa cấp quyền "Google Sheets". Vui lòng bấm "Đăng nhập lại" để cấp quyền trên màn hình Google.');
      }
      throw new Error(errMsg || 'Không thể đồng bộ dữ liệu vào Google Sheets.');
    }
  }

  return {
    success: true,
    message: `Đã đồng bộ thành công ${leads.length} thông tin phụ huynh lên Google Sheets!`,
    id: spreadsheetId,
    url: spreadsheetUrl
  };
};

/**
 * Backups the whole CenterData JSON directly to Google Drive in the user's account.
 */
export const backupCenterDataToDrive = async (data: CenterData): Promise<SyncResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `SaoLuu_TrungTamTriTue_${dateStr}.json`;
  const fileContent = JSON.stringify(data, null, 2);

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: 'Bản sao lưu cấu hình và dữ liệu Trung Tâm Dạy Thêm - Bán Trú Trí Tuệ'
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const errMsg = errData?.error?.message || '';
    if (res.status === 403 || errMsg.toLowerCase().includes('insufficient authentication scopes')) {
      throw new Error('AUTH_SCOPE_REQUIRED: Tài khoản Google chưa cấp quyền "Google Drive". Vui lòng bấm "Đăng nhập lại" để cấp quyền trên màn hình Google.');
    }
    throw new Error(errMsg || 'Không thể sao lưu file lên Google Drive.');
  }

  const result = await res.json();
  return {
    success: true,
    message: `Đã sao lưu thành công file "${fileName}" lên Google Drive!`,
    id: result.id,
    url: result.webViewLink
  };
};

/**
 * Creates a consultation appointment reminder in Google Calendar
 */
export const addConsultationToCalendar = async (
  lead: ConsultationLead,
  appointmentDate?: string
): Promise<SyncResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  // Default appointment: tomorrow at 09:00 AM or user selected date
  const startDateTime = appointmentDate
    ? new Date(appointmentDate)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  if (isNaN(startDateTime.getTime())) {
    throw new Error('Thời gian hẹn tư vấn không hợp lệ.');
  }

  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

  const campusMap: Record<string, string> = {
    cs1: 'Cơ sở 1: 2440/73 Quốc Lộ 1A, P. Trung Mỹ Tây, Q12',
    cs2: 'Cơ sở 2: 94 Nguyễn Thị Đặng, P. Hiệp Thành, Q12',
    cs3: 'Cơ sở 3: 5/3C Nguyễn Thị Sóc, Xã Bà Điểm, Hóc Môn'
  };

  const eventPayload = {
    summary: `[Trí Tuệ] Tư vấn tuyển sinh: Phụ huynh ${lead.parentName} (Lớp ${lead.grade})`,
    description: `Họ tên phụ huynh: ${lead.parentName}\nSố điện thoại: ${lead.phone}\nHọc sinh: ${lead.studentName || 'Chưa rõ'}\nKhối lớp: ${lead.grade}\nDịch vụ: ${lead.services.join(', ')}\nĐịa điểm/Cơ sở: ${campusMap[lead.campusId] || lead.campusId}\nGhi chú: ${lead.notes || 'Không có'}\nHotline trung tâm: 0988389302 – 0969620071`,
    location: campusMap[lead.campusId] || 'Trung Tâm Trí Tuệ',
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Asia/Ho_Chi_Minh'
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Asia/Ho_Chi_Minh'
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },
        { method: 'popup', minutes: 120 }
      ]
    }
  };

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventPayload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const errMsg = errData?.error?.message || '';
    if (res.status === 403 || errMsg.toLowerCase().includes('insufficient authentication scopes')) {
      throw new Error('AUTH_SCOPE_REQUIRED: Tài khoản Google chưa cấp quyền "Google Calendar". Vui lòng bấm "Đăng nhập lại" để cấp quyền trên màn hình Google.');
    }
    throw new Error(errData?.error?.message || 'Không thể tạo sự kiện hẹn trên Google Calendar.');
  }

  const result = await res.json();
  return {
    success: true,
    message: `Đã tạo lịch nhắc hẹn tư vấn cho phụ huynh ${lead.parentName} trên Google Calendar!`,
    id: result.id,
    url: result.htmlLink
  };
};

/**
 * Creates an official Google Form for online registration
 */
export const createRegistrationGoogleForm = async (): Promise<SyncResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  // 1. Create the Form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: {
        title: 'TRUNG TÂM DẠY THÊM – BÁN TRÚ TRÍ TUỆ: Phiếu Đăng Ký Tư Vấn & Nhập Học',
        documentTitle: 'Phiếu Đăng Ký Tuyển Sinh - Trí Tuệ'
      }
    })
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Không thể tạo biểu mẫu Google Forms.');
  }

  const form = await createRes.json();
  const formId = form.formId;

  // 2. Add question items to the Form via batchUpdate
  const batchRequests = [
    {
      createItem: {
        item: {
          title: 'Họ và tên Phụ huynh',
          questionItem: {
            question: {
              required: true,
              textQuestion: { paragraph: false }
            }
          }
        },
        location: { index: 0 }
      }
    },
    {
      createItem: {
        item: {
          title: 'Số điện thoại liên hệ (Zalo)',
          questionItem: {
            question: {
              required: true,
              textQuestion: { paragraph: false }
            }
          }
        },
        location: { index: 1 }
      }
    },
    {
      createItem: {
        item: {
          title: 'Họ và tên Học sinh',
          questionItem: {
            question: {
              required: false,
              textQuestion: { paragraph: false }
            }
          }
        },
        location: { index: 2 }
      }
    },
    {
      createItem: {
        item: {
          title: 'Khối lớp của học sinh',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: 'Lớp 6' },
                  { value: 'Lớp 7' },
                  { value: 'Lớp 8' },
                  { value: 'Lớp 9 (Luyện thi vào 10)' },
                  { value: 'Lớp 10' },
                  { value: 'Lớp 11' },
                  { value: 'Lớp 12 (Luyện thi Đại học)' },
                  { value: 'Cấp 1 (Tiểu học bán trú)' }
                ]
              }
            }
          }
        },
        location: { index: 3 }
      }
    },
    {
      createItem: {
        item: {
          title: 'Cơ sở phụ huynh mong muốn học',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: 'Cơ sở 1: 2440/73 QL1A, P. Trung Mỹ Tây, Q.12 (Gần THCS Nguyễn An Ninh)' },
                  { value: 'Cơ sở 2: 94 Nguyễn Thị Đặng, P. Hiệp Thành, Q.12 (Gần THPT Võ Trường Toản)' },
                  { value: 'Cơ sở 3: 5/3C Nguyễn Thị Sóc, Bà Điểm, Hóc Môn (Gần THPT Bà Điểm)' }
                ]
              }
            }
          }
        },
        location: { index: 4 }
      }
    },
    {
      createItem: {
        item: {
          title: 'Dịch vụ quan tâm',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'CHECKBOX',
                options: [
                  { value: 'Học thêm văn hóa (Toán, Văn, Anh, Lý, Hóa, KHTN)' },
                  { value: 'Nuôi học sinh bán trú (Cơm trưa, nghỉ máy lạnh, kèm bài vở, đưa đón)' },
                  { value: 'Combo toàn diện vừa Học Thêm vừa Bán Trú' }
                ]
              }
            }
          }
        },
        location: { index: 5 }
      }
    },
    {
      createItem: {
        item: {
          title: 'Ghi chú thêm hoặc mong muốn của gia đình',
          questionItem: {
            question: {
              required: false,
              textQuestion: { paragraph: true }
            }
          }
        },
        location: { index: 6 }
      }
    }
  ];

  await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests: batchRequests })
  });

  const responderUri = form.responderUri || `https://docs.google.com/forms/d/${formId}/viewform`;

  return {
    success: true,
    message: 'Đã tạo thành công Google Form tuyển sinh chính thức!',
    id: formId,
    url: responderUri
  };
};
