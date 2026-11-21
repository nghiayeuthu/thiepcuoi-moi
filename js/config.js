// =====================================================================
//  THÔNG TIN THIỆP CƯỚI — chỉ cần sửa file này.
//  Những chỗ có dấu  ✏️  là thông tin mình chưa có, bạn điền giúp nhé.
// =====================================================================
window.WEDDING = {
  // Dán link Web App của Google Apps Script vào đây (xem HUONG-DAN.md, phần 2).
  // Để trống thì form vẫn chạy thử được nhưng không lưu lên Google Sheets.
  scriptUrl: 'https://script.google.com/macros/s/AKfycbzkedR9zNyRqJ-CzBlVRV4Tlm3oGkeZzOqHQSySFAK6IMfG_Nf6nWZ2YwWiRPWM2WAdFw/exec',

  groom: {
    name: 'Tuấn Nghĩa',
    fullName: '',                            // ✏️ họ tên đầy đủ (để trống thì hiện tên ngắn)
    father: 'Ông Vũ Đức Tùng',
    mother: 'Bà Trần Thị Tuyết',
    address: 'Ngô Quyền, Hải Phòng'           // ✏️
  },
  bride: {
    name: 'Hoài Thu',
    fullName: '',                            // ✏️ họ tên đầy đủ (để trống thì hiện tên ngắn)
    father: 'Ông Phạm Văn Thành',
    mother: 'Bà Hoàng Thị Thơ',
    address: 'An Dương, Hải Phòng'            // ✏️
  },

  // Ngày giờ chính (đếm ngược tới mốc này). Giờ Việt Nam.
  date: { day: 28, month: 11, year: 2026, hour: 11, minute: 0,
    place: { name: 'Khách sạn Hải Đăng', address: 'Cung Happy Place, tầng 1, Trung tâm tiệc cưới Hải Đăng, Số 19 Trần Khánh Dư, Ngô Quyền, Hải Phòng' } },
  // Ngày thứ hai: tiệc tại tư gia nhà gái (cùng tháng, năm với ngày chính)
  secondDay: { day: 29, hour: 10, minute: 0,
    place: { name: 'Tư gia nhà gái', address: 'Số 15 đường Cây Chè, Cách Thượng, Nam Sơn, An Dương, Hải Phòng' } },
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
      hall: 'Cung Happy Place · Tầng 1 · Trung tâm tiệc cưới Hải Đăng',
      address: 'Số 19 Trần Khánh Dư, Ngô Quyền, Hải Phòng',
      copy: 'Cung Happy Place, tầng 1, Trung tâm tiệc cưới Hải Đăng, Số 19 Trần Khánh Dư, Ngô Quyền, Hải Phòng',
      map: 'https://www.google.com/maps/search/?api=1&query=Trung%20t%C3%A2m%20ti%E1%BB%87c%20c%C6%B0%E1%BB%9Bi%20H%E1%BA%A3i%20%C4%90%C4%83ng%2C%20S%E1%BB%91%2019%20Tr%E1%BA%A7n%20Kh%C3%A1nh%20D%C6%B0%2C%20Ng%C3%B4%20Quy%E1%BB%81n%2C%20H%E1%BA%A3i%20Ph%C3%B2ng',
      photo: 'assets/photos/59.jpg', photoPos: '50% 62%'
    },
    {
      label: 'Tiệc tại nhà gái · Chủ Nhật 29/11/2026',
      time: '10 giờ 00 sáng',
      name: 'Tư gia nhà gái',
      hall: 'Số 15 đường Cây Chè',
      address: 'Số 15 đường Cây Chè, Cách Thượng, Nam Sơn, An Dương, Hải Phòng',
      map: 'https://www.google.com/maps/search/?api=1&query=S%E1%BB%91%2015%20%C4%91%C6%B0%E1%BB%9Dng%20C%C3%A2y%20Ch%C3%A8%2C%20C%C3%A1ch%20Th%C6%B0%E1%BB%A3ng%2C%20Nam%20S%C6%A1n%2C%20An%20D%C6%B0%C6%A1ng%2C%20H%E1%BA%A3i%20Ph%C3%B2ng',
      photo: 'assets/photos/60.jpg', photoPos: '50% 62%'
    }
  ],

  // Thiệp riêng cho từng bên: …/nha-trai/ và …/nha-gai/
  // Mỗi bên chỉ hiện một ngày, một địa điểm (venues: số thứ tự trong danh sách venues ở trên, bắt đầu từ 0).
  sides: {
    trai: {
      name: 'Nhà trai',
      date: { day: 28, hour: 11, minute: 0,
        place: { name: 'Khách sạn Hải Đăng', address: 'Cung Happy Place, tầng 1, Trung tâm tiệc cưới Hải Đăng, Số 19 Trần Khánh Dư, Ngô Quyền, Hải Phòng' } },
      venues: [0]
      // schedule: dùng lịch trình chung ở trên
    },
    gai: {
      name: 'Nhà gái',
      date: { day: 29, hour: 10, minute: 0,
        place: { name: 'Tư gia nhà gái', address: 'Số 15 đường Cây Chè, Cách Thượng, Nam Sơn, An Dương, Hải Phòng' } },
      venues: [1],
      schedule: []                                // ✏️ lịch trình ngày 29 (để trống thì ẩn phần Lịch trình)
    }
  },

  // Câu chuyện tình yêu ✏️ (viết lại bằng chuyện thật của hai bạn)
  story: [
    { when: 'Gặp nhau nơi xứ người', text: 'Hai người Việt xa quê, tình cờ gặp nhau trên đất Nhật. Giữa nơi xa lạ, chúng mình tìm thấy một người thật quen.' },
    { when: '7 năm bên nhau ở Nhật', text: 'Bảy mùa hoa anh đào, bảy mùa đông tuyết trắng. Chúng mình cùng học, cùng làm, cùng đi qua những ngày vui và cả những lúc nhớ nhà.' },
    { when: 'Lời cầu hôn', text: 'Rồi một ngày, anh ngỏ lời và em gật đầu. Sau 7 năm, chúng mình về chung một nhà.' }
  ],

  // Mừng cưới ✏️ (thay ảnh QR trong /assets và số tài khoản)
  gifts: [
    { who: 'Chú rể', name: 'TEN CHU RE', bank: 'Ngân hàng …', account: '0000000000', qr: 'assets/qr-chure.png' },
    { who: 'Cô dâu', name: 'TEN CO DAU', bank: 'Ngân hàng …', account: '0000000000', qr: 'assets/qr-codau.png' }
  ],

  music: 'assets/music.mp3',
};
