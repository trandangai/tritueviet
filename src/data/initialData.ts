import { CenterData } from '../types';

export const initialData: CenterData = {
  campuses: [
    {
      id: 'cs1',
      name: 'Cơ sở 1 (Trung Mỹ Tây)',
      address: '2440/73 Quốc Lộ 1A, Khu phố 5, Phường Trung Mỹ Tây, Quận 12, TP.HCM',
      landmark: 'Đối diện cổng sau trường THCS Nguyễn An Ninh – đường Song Hành',
      hotlines: ['0988389302', '0969620071'],
      hasBoarding: true,
      description: 'Trung tâm tổng hợp Dạy Thêm & Nuôi Học Sinh Bán Trú quy mô lớn nhất hệ thống với phòng học máy lạnh tiêu chuẩn, phòng nghỉ ngơi riêng biệt và bếp ăn dinh dưỡng an toàn thực phẩm.',
      featuredImages: [
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80'
      ]
    },
    {
      id: 'cs2',
      name: 'Cơ sở 2 (Hiệp Thành)',
      address: '94 Nguyễn Thị Đặng, Khu phố 1, Phường Hiệp Thành, Quận 12, TP.HCM',
      landmark: 'Gần trường THPT Võ Trường Toản',
      hotlines: ['0988389302', '0969620071'],
      hasBoarding: false,
      description: 'Chuyên bồi dưỡng văn hóa & luyện thi Đại học chất lượng cao các môn Toán, Lý, Hóa, Anh bởi đội ngũ giáo viên giàu kinh nghiệm giảng dạy tại THPT Võ Trường Toản.',
      featuredImages: [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80'
      ]
    },
    {
      id: 'cs3',
      name: 'Cơ sở 3 (Bà Điểm, Hóc Môn)',
      address: '5/3C Nguyễn Thị Sóc, Ấp Hưng Lân, Xã Bà Điểm, Huyện Hóc Môn, TP.HCM',
      landmark: 'Gần trường THPT Bà Điểm',
      hotlines: ['0988389302', '0969620071'],
      hasBoarding: false,
      description: 'Cơ sở bồi dưỡng kiến thức văn hóa bậc THPT, luyện thi chuyên và tốt nghiệp THPT Quốc Gia với sỉ số giới hạn, phòng học trang bị TV tương tác và máy lạnh 100%.',
      featuredImages: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'
      ]
    }
  ],
  schedules: [
    // --- Cơ sở 1 ---
    {
      id: 's-cs1-6',
      campusId: 'cs1',
      grade: '6',
      subject: 'Toán – Ngữ Văn – Tiếng Anh – KHTN',
      startDate: 'Từ 06/09/2026',
      morningSlot: 'Sáng 7h30 - 10h30 (Toán/Văn/Anh xếp theo lịch trống)',
      afternoonSlot: 'Chiều CN: 14h30 - 17h00 (Văn ca 1)',
      eveningSlot: 'Tối 17h30 - 19h00',
      weeklySchedule: 'Thứ 2: Anh | T3: KHTN | T4: Toán | T5: Anh | T6: KHTN | T7: Toán',
      notes: 'Học sinh được kiểm tra xếp lớp và kèm sát phương pháp học THCS theo chương trình GDPT mới.',
      order: 1
    },
    {
      id: 's-cs1-7',
      campusId: 'cs1',
      grade: '7',
      subject: 'Toán – Ngữ Văn – Tiếng Anh – KHTN',
      startDate: 'Từ 06/09/2026',
      morningSlot: 'Sáng 7h30 - 10h30 (Toán/Văn/Anh ca trống)',
      afternoonSlot: 'Chiều T7: Văn Ca 1 | Chiều CN: Toán Ca 1',
      eveningSlot: 'Tối 17h30 - 19h00',
      weeklySchedule: 'Thứ 2: Anh | T3: Văn Ca 2 | T4: Anh | T5: KHTN | T6: Văn Ca 2 | T7: KHTN',
      notes: 'Bổ trợ kiến thức nâng cao, rèn luyện kỹ năng viết văn cảm thụ và giải toán thực tế.',
      order: 2
    },
    {
      id: 's-cs1-8',
      campusId: 'cs1',
      grade: '8',
      subject: 'Toán – Ngữ Văn – Tiếng Anh – KHTN',
      startDate: 'Từ 07/09/2026',
      morningSlot: 'Sáng CN: KHTN (7h30 - 10h30)',
      afternoonSlot: 'Chiều T7: Văn Ca 2 (14h00 - 17h00)',
      eveningSlot: 'Tối 17h30 - 19h00',
      weeklySchedule: 'Thứ 2: Văn Ca 1 | T3: Toán | T4: Anh | T5: Toán | T6: Anh | T7: Văn Ca 1',
      notes: 'Trọng tâm củng cố kiến thức khoa học tự nhiên chuẩn bị nền tảng bứt phá vào lớp 9.',
      order: 3
    },
    {
      id: 's-cs1-9',
      campusId: 'cs1',
      grade: '9',
      subject: 'Toán – Ngữ Văn – Tiếng Anh – KHTN (Luyện Thi Vào 10)',
      startDate: 'Từ 01/09/2026',
      morningSlot: 'Sáng CN: Văn Ca 1 (7h30 - 9h00)',
      afternoonSlot: 'Chiều CN: KHTN (14h00 - 16h30)',
      eveningSlot: 'Tối 17h30 - 19h00',
      weeklySchedule: 'Thứ 2: Toán | T3: Văn Ca 2 | T4: Văn Ca 1 | T5: Anh & Văn Ca 2 | T6: Toán | T7: Anh',
      notes: 'Chương trình mũi nhọn ôn thi tuyển sinh 10 công lập Quận 12 và các trường chuyên trọng điểm.',
      order: 4
    },
    {
      id: 's-cs1-10',
      campusId: 'cs1',
      grade: '10',
      subject: 'Toán – Vật Lý – Hóa Học – Ngữ Văn – Tiếng Anh',
      startDate: 'Từ 01/08/2026',
      morningSlot: '',
      afternoonSlot: 'Ca 1: 17h45 - 19h15 (T2: Lý | T4: Hóa | T5: Văn | T6: Lý | T7: Hóa)',
      eveningSlot: 'Ca 2: 19h30 - 21h00 (T2: Anh | T3: Toán | T4: Anh | T5: Văn | T6: Toán)',
      weeklySchedule: 'Khối Tự nhiên & Xã hội phân ca linh hoạt không bị trùng lịch',
      notes: 'Bám sát SGK Kết Nối Tri Thức & Cánh Diều, hình thành tư duy học đại trà và nâng cao.',
      order: 5
    },
    {
      id: 's-cs1-11',
      campusId: 'cs1',
      grade: '11',
      subject: 'Toán – Vật Lý – Hóa Học – Tiếng Anh',
      startDate: 'Từ 01/07/2026',
      morningSlot: '',
      afternoonSlot: 'Ca 1: 17h45 - 19h15 (T2: Anh | T3: Hóa | T4: Anh | T5: Hóa)',
      eveningSlot: 'Ca 2: 19h30 - 21h00 (T2: Toán | T3: Lý | T4: Toán | T5: Lý)',
      weeklySchedule: 'Học đều 4 môn cốt lõi, bổ trợ phương pháp tư duy giải toán nhanh',
      notes: 'Tập trung các chuyên đề phân hóa điểm 8-9-10 chuẩn bị cho kỳ thi tốt nghiệp.',
      order: 6
    },
    {
      id: 's-cs1-12',
      campusId: 'cs1',
      grade: '12',
      subject: 'Toán – Vật Lý – Hóa Học – Tiếng Anh (Luyện Thi Đại Học)',
      startDate: 'Từ 01/07/2026',
      morningSlot: '',
      afternoonSlot: 'Ca 1: 17h45 - 19h15 (T2: Toán | T3: Lý | T4: Toán | T5: Lý)',
      eveningSlot: 'Ca 2: 19h30 - 21h00 (T2: Anh | T3: Hóa | T4: Anh | T5: Hóa)',
      weeklySchedule: 'Luyện đề thực chiến bấm giờ, cập nhật cấu trúc đề minh họa mới nhất của Bộ GD&ĐT',
      notes: 'Cam kết tiến bộ vượt bậc, định hướng xét tuyển khối A, A1, B, D01.',
      order: 7
    },

    // --- Cơ sở 2 ---
    {
      id: 's-cs2-ly',
      campusId: 'cs2',
      grade: '10, 11, 12',
      subject: 'Vật Lý',
      teacher: 'Thầy Trác',
      phone: '0902 765 237',
      weeklySchedule: 'Lớp 10: T2 - T6 (17h30 - 19h00)\nLớp 11: T4 (19h30 - 21h00) & T7 (13h30 - 15h00)\nLớp 12: T2 - T6 (19h30 - 21h00)',
      notes: 'Phương pháp phân tích hiện tượng vật lý trực quan, công thức giải trắc nghiệm 30s.',
      order: 8
    },
    {
      id: 's-cs2-hoa',
      campusId: 'cs2',
      grade: '10, 11, 12',
      subject: 'Hóa Học',
      teacher: 'Cô Thắm',
      phone: '0989 762 428',
      weeklySchedule: 'Lớp 10: T7 (15h00 - 17h00)\nLớp 11: T2 - T6 (17h30 - 19h00)\nLớp 12: T3 - T5 (17h30 - 19h00)',
      notes: 'Sơ đồ tư duy chuỗi phản ứng vô cơ & hữu cơ, rèn phản xạ nhận biết và giải bài toán hỗn hợp.',
      order: 9
    },
    {
      id: 's-cs2-anh',
      campusId: 'cs2',
      grade: '10, 11, 12',
      subject: 'Tiếng Anh',
      teacher: 'Cô Châu',
      phone: '0372 148 766',
      weeklySchedule: 'Lớp 10: T3 - T5 (17h30 - 19h00)\nLớp 11: T4 (17h30 - 19h00) & CN (16h00 - 17h30)\nLớp 12: T6 & CN (17h30 - 19h00)',
      notes: 'Củng cố ngữ pháp chuyên sâu, mở rộng vốn từ vựng học thuật, mẹo tránh bẫy bài đọc hiểu.',
      order: 10
    },
    {
      id: 's-cs2-toan',
      campusId: 'cs2',
      grade: '10, 11, 12',
      subject: 'Toán Học',
      teacher: 'Thầy Nam',
      phone: '0907 806 333',
      weeklySchedule: 'Lớp 10A: T4 - T7 (17h30 - 19h00) | Lớp 10B: T4 - T7 (19h30 - 21h00)\nLớp 11A: T3 - T5 (17h30 - 19h00) | Lớp 11B: T2 - T6 (19h30 - 21h00)\nLớp 12A: T2 - T6 (17h30 - 19h30) | Lớp 12B: T3 - T5 (19h00 - 21h00)',
      notes: 'Chia phân ban A/B phù hợp học lực, phát triển tư duy hình không gian và đại số vi tích phân.',
      order: 11
    },

    // --- Cơ sở 3 ---
    {
      id: 's-cs3-10',
      campusId: 'cs3',
      grade: '10',
      subject: 'Toán – Vật Lý – Hóa Học – Tiếng Anh',
      weeklySchedule: 'Toán (Cô Bùi Thị Nguyệt): T2-T6 (17h-18h30) hoặc T4-T7 (17h-18h30)\nToán (Cô Lâm Thị Mỹ Nga): T3-T5 (17h-18h30)\nHóa (Thầy Hấp Minh Cường): T6 (17h-19h) hoặc T7 (16h30-18h30)\nLý: T2-T4 (18h45-20h15)\nTiếng Anh (Thầy Nguyễn Anh Dũng): T3-T5 (17h-18h30)',
      notes: 'Gần trường THPT Bà Điểm, giờ học thuận tiện ngay sau giờ tan trường.',
      order: 12
    },
    {
      id: 's-cs3-11',
      campusId: 'cs3',
      grade: '11',
      subject: 'Toán – Vật Lý – Tiếng Anh',
      weeklySchedule: 'Toán (Cô Bùi Thị Nguyệt): T3-T5 (17h-18h30)\nToán (Cô Lâm Thị Mỹ Nga): T2-T4 (18h45-20h15)\nLý: T6-T7 (17h-18h30)\nTiếng Anh (Thầy Nguyễn Anh Dũng): T2-T4 (17h-18h30)',
      notes: 'Lớp học kèm sát, giải đáp bài tập trên lớp và chuẩn bị bài mới chu đáo.',
      order: 13
    }
  ],
  teachers: [
    {
      id: 't-trac',
      name: 'Thầy Trác',
      title: 'Giáo viên bộ môn Vật Lý',
      subject: 'Vật Lý',
      phone: '0902 765 237',
      campusIds: ['cs2'],
      experience: 'Hơn 12 năm kinh nghiệm giảng dạy & luyện thi THPT Quốc Gia',
      description: 'Giảng viên giàu nhiệt huyết, phong cách giảng dạy trực quan, giúp học sinh nắm vững bản chất hiện tượng vật lý và xử lý nhanh các dạng bài trắc nghiệm điểm 8-9.',
      commitment: 'Cam kết học sinh lấy lại căn bản sau 4 tuần và bứt phá điểm số trong kỳ thi học kỳ & Đại học.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      order: 1
    },
    {
      id: 't-tham',
      name: 'Cô Thắm',
      title: 'Giáo viên bộ môn Hóa Học',
      subject: 'Hóa Học',
      phone: '0989 762 428',
      campusIds: ['cs2'],
      experience: 'Hơn 10 năm chuyên luyện thi môn Hóa bậc THPT',
      description: 'Phương pháp hệ thống hóa sơ đồ tư duy phản ứng và công thức giải nhanh, phân loại dạng bài rõ ràng giúp học sinh không còn sợ môn Hóa.',
      commitment: 'Đảm bảo nắm chắc 100% lý thuyết nền tảng, phản xạ nhanh với các bài tập vận dụng cao.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
      order: 2
    },
    {
      id: 't-chau',
      name: 'Cô Châu',
      title: 'Giáo viên bộ môn Tiếng Anh',
      subject: 'Tiếng Anh',
      phone: '0372 148 766',
      campusIds: ['cs2'],
      experience: 'Cử nhân Sư phạm Anh văn, 8 năm luyện thi vào 10 & THPT',
      description: 'Giảng dạy tận tâm, truyền cảm hứng học tiếng Anh, cung cấp ngân hàng từ vựng học thuật phong phú và bí quyết tránh bẫy bài đọc hiểu, hoàn thành câu.',
      commitment: 'Cải thiện ít nhất 1.5 - 2.5 điểm so với kết quả kiểm tra đầu vào.',
      avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=500&q=80',
      order: 3
    },
    {
      id: 't-nam',
      name: 'Thầy Nam',
      title: 'Giáo viên bộ môn Toán Học',
      subject: 'Toán Học',
      phone: '0907 806 333',
      campusIds: ['cs2'],
      experience: 'Hơn 15 năm giảng dạy Toán THPT & Luyện thi Chuyên',
      description: 'Chuyên gia rèn luyện tư duy logic hình học không gian và phương pháp Casio bấm máy thần tốc, giúp học sinh tiết kiệm tối đa thời gian làm bài.',
      commitment: 'Tỉ lệ học sinh đạt điểm 8+ trong kỳ thi tốt nghiệp THPT luôn trên 85%.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      order: 4
    },
    {
      id: 't-nguyet',
      name: 'Cô Bùi Thị Nguyệt',
      title: 'Giáo viên bộ môn Toán Học',
      subject: 'Toán Học',
      phone: '0988 389 302',
      campusIds: ['cs3'],
      experience: 'Nhiều năm giảng dạy toán THPT tại Hóc Môn',
      description: 'Ân cần, tỉ mỉ, luôn theo sát tiến độ từng em trong lớp, củng cố kiến thức từng bước cho học sinh còn yếu và bồi dưỡng nâng cao cho học sinh khá.',
      commitment: 'Giúp học sinh tự tin giải bài và cải thiện rõ rệt hạnh kiểm, học lực môn Toán.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
      order: 5
    },
    {
      id: 't-nga',
      name: 'Cô Lâm Thị Mỹ Nga',
      title: 'Giáo viên bộ môn Toán Học',
      subject: 'Toán Học',
      phone: '0969 620 071',
      campusIds: ['cs3'],
      experience: 'Giáo viên dạy giỏi cấp quận / huyện',
      description: 'Phương pháp sư phạm hiện đại, bài giảng sinh động, tạo không khí học tập hào hứng, khuyến khích học sinh chủ động đặt câu hỏi.',
      commitment: 'Hiểu bài ngay tại lớp, không bị áp lực bài tập về nhà quá tải.',
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=500&q=80',
      order: 6
    },
    {
      id: 't-cuong',
      name: 'Thầy Hấp Minh Cường',
      title: 'Giáo viên bộ môn Hóa Học',
      subject: 'Hóa Học',
      phone: '0988 389 302',
      campusIds: ['cs3'],
      experience: 'Chuyên gia giảng dạy Hóa lớp 10, 11, 12',
      description: 'Lối dạy súc tích, cô đọng, chú trọng bản chất phản ứng và mẹo nhớ tên hóa chất, phương pháp cân bằng phản ứng oxi hóa khử nhanh.',
      commitment: 'Biến môn Hóa thành môn học gỡ điểm thế mạnh cho học sinh khối Tự nhiên.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
      order: 7
    },
    {
      id: 't-dung',
      name: 'Thầy Nguyễn Anh Dũng',
      title: 'Giáo viên bộ môn Tiếng Anh',
      subject: 'Tiếng Anh',
      phone: '0969 620 071',
      campusIds: ['cs3'],
      experience: 'Hơn 9 năm bồi dưỡng tiếng Anh trung học',
      description: 'Tập trung rèn phát âm chuẩn, cấu trúc câu thi đại học và kỹ năng giải đề sát với đề thi chính thức của Sở Giáo dục TP.HCM.',
      commitment: 'Nâng cao toàn diện phản xạ tiếng Anh và đạt điểm cao trong các bài thi định kỳ.',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
      order: 8
    }
  ],
  boardingTimeline: [
    {
      id: 'bt-1',
      timeRange: '6h00 – 8h00',
      activity: 'Đón học sinh tại trung tâm',
      detail: 'Thầy cô đón học sinh tận nơi, kiểm tra đồng phục, đồ dùng học tập và điểm danh buổi sáng.',
      iconName: 'fa-door-open',
      order: 1
    },
    {
      id: 'bt-2',
      timeRange: '8h00 – 10h30',
      activity: 'Học & Làm bài tập trường giao',
      detail: 'Quản nhiệm kèm cặp trực tiếp, hướng dẫn giải quyết bài tập trên lớp; có 30 phút giải lao thư giãn, uống sữa/trái cây.',
      iconName: 'fa-book-open-reader',
      order: 2
    },
    {
      id: 'bt-3',
      timeRange: '10h30 – 11h30',
      activity: 'Ăn trưa dinh dưỡng',
      detail: 'Bữa trưa nóng sốt đạt chuẩn vệ sinh an toàn thực phẩm (thực đơn 4 món luân phiên mỗi ngày, đủ chất đạm, rau xanh và canh mát).',
      iconName: 'fa-utensils',
      order: 3
    },
    {
      id: 'bt-4',
      timeRange: '11h30 – 14h00',
      activity: 'Ngủ trưa phòng máy lạnh',
      detail: 'Phòng ngủ máy lạnh sạch sẽ, thoáng mát, chia khu vực nam nữ riêng biệt; giáo viên trực quản lý giấc ngủ an toàn, yên tĩnh.',
      iconName: 'fa-bed',
      order: 4
    },
    {
      id: 'bt-5',
      timeRange: '14h00 – 16h30',
      activity: 'Học bài buổi chiều & rèn kỹ năng',
      detail: 'Ôn tập kiến thức bài học mới, rèn chữ đẹp, đọc sách tham khảo và có 30 phút giải lao ăn nhẹ xế chiều.',
      iconName: 'fa-pen-ruler',
      order: 5
    },
    {
      id: 'bt-6',
      timeRange: '16h30 – 18h00',
      activity: 'Trả học sinh về cho phụ huynh',
      detail: 'Bàn giao trực tiếp cho phụ huynh, thông báo tình hình học tập và sức khỏe của con trong ngày.',
      iconName: 'fa-car-side',
      order: 6
    }
  ],
  boardingRules: [
    {
      id: 'br-1',
      title: 'Phương Thức Đưa Đón Học Sinh Cấp 2 (THCS Nguyễn An Ninh)',
      content: 'Do trung tâm CS1 nằm đối diện cổng sau trường THCS Nguyễn An Ninh (đường Song Hành), thầy cô giáo sẽ trực tiếp điểm danh và dẫn các em đi bộ qua lại an toàn tuyệt đối trước và sau giờ học.',
      type: 'pickup',
      order: 1
    },
    {
      id: 'br-2',
      title: 'Phương Thức Đưa Rước Học Sinh Cấp 1 (TH Võ Văn Tần & TH Quang Trung)',
      content: 'Trung tâm bố trí xe 16 chỗ máy lạnh đời mới đưa rước học sinh 2 chiều. Có nhân viên quản nhiệm đi cùng trên xe điểm danh, thắt dây an toàn và hỗ trợ các em lên xuống xe cẩn thận.',
      type: 'pickup',
      order: 2
    },
    {
      id: 'br-3',
      title: 'Nội Quy Điểm Danh Nghiêm Ngặt',
      content: 'Học sinh được điểm danh ngay khi bước chân vào trung tâm. Trường hợp học sinh chưa đến hoặc vắng mặt không lý do, bộ phận giám thị sẽ liên hệ ngay cho phụ huynh qua điện thoại/Zalo để đảm bảo an toàn tuyệt đối cho các con.',
      type: 'attendance',
      order: 3
    },
    {
      id: 'br-4',
      title: 'Chính Sách Báo Nghỉ & Hoàn Tiền Cơm Trưa',
      content: 'Phụ huynh có việc bận cần cho con nghỉ bán trú vui lòng báo trước 9h00 sáng qua Zalo hoặc Hotline 0988389302 – 0969620071 để trung tâm không lên phần ăn trưa. Phụ huynh sẽ được hoàn trả 30.000đ/ngày tiền cơm trưa vào kỳ học phí tiếp theo.',
      type: 'refund',
      order: 4
    }
  ],
  fees: [
    {
      id: 'f-1',
      category: 'mon_le',
      title: 'Học Thêm Môn Lẻ (Khối 6, 7, 8, 9)',
      gradeRange: 'Khối THCS (Lớp 6 – 9)',
      price: '500.000 – 700.000',
      unit: 'VNĐ / môn / tháng',
      highlights: [
        'Thời lượng: 2 - 3 buổi/tuần (90 phút/buổi)',
        'Sỉ số giới hạn 15 - 20 học sinh/lớp',
        'Kèm sát giải bài tập sách giáo khoa & đề cương trường',
        'Kiểm tra định kỳ mỗi tháng gửi kết quả cho phụ huynh'
      ],
      popular: false,
      order: 1
    },
    {
      id: 'f-2',
      category: 'combo',
      title: 'Combo Toàn Diện 3 Môn (Toán – Văn – Anh)',
      gradeRange: 'Khối THCS (Lớp 6 – 9)',
      price: '1.500.000 – 1.800.000',
      unit: 'VNĐ / tháng',
      highlights: [
        'Tiết kiệm từ 200.000đ - 300.000đ so với đăng ký lẻ',
        'Thời khóa biểu sắp xếp tối ưu, không trùng môn',
        'Tập trung luyện thi chuyển cấp và tuyển sinh vào lớp 10',
        'Miễn phí 100% tài liệu ôn tập và đề thi thử'
      ],
      popular: true,
      order: 2
    },
    {
      id: 'f-3',
      category: 'mon_le',
      title: 'Học Thêm Môn Lẻ THPT (Toán, Lý, Hóa, Anh, Văn)',
      gradeRange: 'Khối THPT (Lớp 10 – 12)',
      price: '600.000 – 850.000',
      unit: 'VNĐ / môn / tháng',
      highlights: [
        'Giảng dạy bởi các giáo viên kinh nghiệm THPT & chuyên',
        'Cung cấp phương pháp bấm máy trắc nghiệm giải nhanh',
        'Hệ thống đề thi thử sát với chuẩn ma trận đề Bộ GD&ĐT',
        'Phòng học máy lạnh, máy chiếu tương tác hiện đại'
      ],
      popular: false,
      order: 3
    },
    {
      id: 'f-4',
      category: 'combo',
      title: 'Combo Tổ Hợp Tự Nhiên / Xã Hội THPT',
      gradeRange: 'Khối THPT (Lớp 10 – 12)',
      price: '1.800.000 – 2.400.000',
      unit: 'VNĐ / tháng',
      highlights: [
        'Combo Toán - Lý - Hóa hoặc Toán - Văn - Anh',
        'Lộ trình cá nhân hóa bứt phá điểm số xét tuyển Đại học',
        'Tặng các buổi luyện đề bấm giờ thực chiến cuối tuần',
        'Cố vấn chọn ngành nghề và chọn trường phù hợp'
      ],
      popular: true,
      order: 4
    },
    {
      id: 'f-5',
      category: 'ban_tru',
      title: 'Gói Nuôi Bán Trú Học Sinh Cấp 1',
      gradeRange: 'Tiểu học (TH Võ Văn Tần, TH Quang Trung)',
      price: '2.500.000',
      unit: 'VNĐ / học sinh / tháng',
      highlights: [
        'Xe 16 chỗ máy lạnh đưa rước tận trường an toàn 2 chiều',
        'Bữa trưa nóng sốt đủ dinh dưỡng + bữa phụ xế chiều',
        'Phòng ngủ máy lạnh riêng biệt nam nữ sạch sẽ, an tĩnh',
        'Quản nhiệm kèm cặp hoàn thành toàn bộ bài tập trường',
        'Chính sách báo nghỉ trước 9h hoàn 30.000đ tiền cơm'
      ],
      popular: true,
      order: 5
    },
    {
      id: 'f-6',
      category: 'ban_tru',
      title: 'Gói Nuôi Bán Trú Học Sinh Cấp 2',
      gradeRange: 'THCS (THCS Nguyễn An Ninh)',
      price: '2.200.000',
      unit: 'VNĐ / học sinh / tháng',
      highlights: [
        'Thầy cô dẫn bộ đưa đón qua lại an toàn (đối diện cổng sau)',
        'Suất ăn trưa đầy đủ dinh dưỡng tiêu chuẩn vệ sinh ATTP',
        'Nghỉ ngơi phòng máy lạnh mát mẻ giúp phục hồi năng lượng',
        'Thời gian tự học có giáo viên phụ trách giải đáp thắc mắc',
        'Phối hợp chặt chẽ cùng gia đình quản lý việc học của con'
      ],
      popular: false,
      order: 6
    }
  ],
  leads: [
    {
      id: 'lead-1',
      parentName: 'Nguyễn Thị Bích Ngọc',
      phone: '0918234567',
      studentName: 'Trần Minh Quân',
      grade: '6',
      campusId: 'cs1',
      services: ['Học Thêm', 'Bán Trú'],
      notes: 'Học sinh THCS Nguyễn An Ninh, muốn đăng ký học thêm Toán Văn Anh và bán trú trưa.',
      createdAt: '2026-10-01 09:30',
      status: 'contacted'
    },
    {
      id: 'lead-2',
      parentName: 'Lê Hoàng Nam',
      phone: '0908765432',
      studentName: 'Lê Bảo Anh',
      grade: '10',
      campusId: 'cs2',
      services: ['Học Thêm'],
      notes: 'Quan tâm lớp Lý Thầy Trác và Toán Thầy Nam chuẩn bị vào THPT Võ Trường Toản.',
      createdAt: '2026-10-01 14:15',
      status: 'new'
    },
    {
      id: 'lead-3',
      parentName: 'Phạm Thanh Hà',
      phone: '0937123987',
      studentName: 'Phạm Đức Duy',
      grade: '11',
      campusId: 'cs3',
      services: ['Học Thêm'],
      notes: 'Gần trường Bà Điểm, muốn xếp lớp Toán cô Nguyệt và Tiếng Anh thầy Dũng.',
      createdAt: '2026-10-02 08:00',
      status: 'new'
    }
  ],
  adminPasswordHash: 'admin',
  adminEmails: ['us.documentb@gmail.com'],
  googleSheetsId: '',
  googleFormsUrl: ''
};
