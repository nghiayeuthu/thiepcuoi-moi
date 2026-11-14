// =====================================================================
//  THÔNG TIN THIỆP CƯỚI — chỉ cần sửa file này.
//  Những chỗ có dấu  ✏️  là thông tin mình chưa có, bạn điền giúp nhé.
// =====================================================================
window.WEDDING = {
  // Dán link Web App của Google Apps Script vào đây (xem HUONG-DAN.md, phần 2).
  // Để trống thì form vẫn chạy thử được nhưng không lưu lên Google Sheets.
  scriptUrl: '',

  groom: {
    name: 'Tuấn Nghĩa',
    fullName: '',                            // ✏️ họ tên đầy đủ (để trống thì hiện tên ngắn)
    father: 'Ông …',                          // ✏️
    mother: 'Bà …',                           // ✏️
    address: 'Ngô Quyền, Hải Phòng'           // ✏️
  },
  bride: {
    name: 'Hoài Thu',
    fullName: '',                            // ✏️ họ tên đầy đủ (để trống thì hiện tên ngắn)
    father: 'Ông …',                          // ✏️
    mother: 'Bà …',                           // ✏️
    address: 'An Dương, Hải Phòng'            // ✏️
  },

  // Ngày giờ chính (đếm ngược tới mốc này). Giờ Việt Nam.
  date: { day: 28, month: 11, year: 2026, hour: 11, minute: 0 },
  // Ngày phụ cũng được đánh dấu trái tim trên lịch
  extraDays: [29],

  // Lịch trình ngày chính ✏️ (sửa giờ cho đúng)
  schedule: [
    { time: '10:30', title: 'Đón khách', note: 'Chụp ảnh lưu niệm cùng cô dâu chú rể' },
    { time: '11:00', title: 'Làm lễ thành hôn', note: 'Nghi thức trao nhẫn, rót rượu' },
    { time: '11:30', title: 'Khai tiệc', note: 'Cùng nâng ly chúc mừng' }
  ],

  // Địa điểm (giữ đủ 2 ngày như thiệp cũ)
  venues: [
    {
      label: 'Tiệc cưới · Thứ Bảy 28/11/2026',
      time: '11 giờ 00 trưa',
      name: 'Khách sạn Hải Đăng',
      hall: 'Tầng 2 · Happy Place · Hải Đăng Plaza',
      address: 'Số 19 + 35 Trần Khánh Dư, Ngô Quyền, Hải Phòng',
      map: 'https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20H%E1%BA%A3i%20%C4%90%C4%83ng%20Plaza%2019%20Tr%E1%BA%A7n%20Kh%C3%A1nh%20D%C6%B0%20Ng%C3%B4%20Quy%E1%BB%81n%20H%E1%BA%A3i%20Ph%C3%B2ng',
      photo: 'assets/photos/05.jpg'
    },
    {
      label: 'Tiệc tại nhà gái · Chủ Nhật 29/11/2026',
      time: '10 giờ 00 sáng',
      name: 'Tư gia nhà gái',
      hall: 'Số 15 đường Cây Chè',
      address: 'Số 15 đường Cây Chè, Cách Thượng, Nam Sơn, An Dương, Hải Phòng',
      map: 'https://www.google.com/maps/search/?api=1&query=S%E1%BB%91%2015%20%C4%91%C6%B0%E1%BB%9Dng%20C%C3%A2y%20Ch%C3%A8%2C%20C%C3%A1ch%20Th%C6%B0%E1%BB%A3ng%2C%20Nam%20S%C6%A1n%2C%20An%20D%C6%B0%C6%A1ng%2C%20H%E1%BA%A3i%20Ph%C3%B2ng',
      photo: 'assets/photos/13.jpg'
    }
  ],

  // Câu chuyện tình yêu ✏️ (viết lại bằng chuyện thật của hai bạn)
  story: [
    { when: 'Lần đầu gặp gỡ', text: 'Một buổi chiều rất bình thường, hai người xa lạ bắt chuyện với nhau, chẳng ai nghĩ đó là khởi đầu của cả một hành trình.' },
    { when: 'Những ngày thương nhau', text: 'Cùng nhau đi qua những chuyến đi, những bữa cơm và cả những lần giận hờn, chúng mình hiểu nhau hơn từng ngày.' },
    { when: 'Về chung một nhà', text: 'Và rồi một lời cầu hôn, một cái gật đầu. Chúng mình quyết định nắm tay nhau đi tiếp quãng đời còn lại.' }
  ],

  // Mừng cưới ✏️ (thay ảnh QR trong /assets và số tài khoản)
  gifts: [
    { who: 'Chú rể', name: 'TEN CHU RE', bank: 'Ngân hàng …', account: '0000000000', qr: 'assets/qr-chure.png' },
    { who: 'Cô dâu', name: 'TEN CO DAU', bank: 'Ngân hàng …', account: '0000000000', qr: 'assets/qr-codau.png' }
  ],

  music: 'assets/music.mp3',

  // Ảnh album: assets/photos/01.jpg … 18.jpg (ảnh nhỏ trong assets/photos/thumb)
  photoCount: 18
};
