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
    fullName: 'Vũ Tuấn Nghĩa',                            // ✏️ họ tên đầy đủ (để trống thì hiện tên ngắn)
    father: 'Ông Vũ Đức Tùng',
    mother: 'Bà Trần Thị Tuyết',
    address: 'Ngô Quyền, Hải Phòng'           // ✏️
  },
  bride: {
    name: 'Hoài Thu',
    fullName: 'Phạm Hoài Thu',                            // ✏️ họ tên đầy đủ (để trống thì hiện tên ngắn)
    father: 'Ông Phạm Văn Thành',
    mother: 'Bà Hoàng Thị Thơ',
    address: 'Phường An Dương, TP. Hải Phòng'
  },

  // Ngày giờ chính (đếm ngược tới mốc này). Giờ Việt Nam.
  date: { day: 28, month: 11, year: 2026, hour: 11, minute: 0,
    place: { name: 'Khách sạn Hải Đăng', address: 'Cung Happy Place, tầng 1, Trung tâm tiệc cưới Hải Đăng, Số 19 Trần Khánh Dư, Ngô Quyền, Hải Phòng' } },
  // Ngày thứ hai: tiệc tại tư gia nhà gái (cùng tháng, năm với ngày chính)
  secondDay: { day: 29, hour: 10, minute: 30,
    place: { name: 'Tư gia nhà gái', address: 'Số nhà 15, đường Cây Chè, TDP Cách Thượng, phường An Dương, TP. Hải Phòng' } },
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
      photo: 'assets/photos/82.jpg', photoPos: '50% 62%'
    },
    {
      label: 'Lễ Vu Quy · Chủ Nhật 29/11/2026',
      time: '10 giờ 30 sáng',
      name: 'Tư gia nhà gái',
      hall: 'Số nhà 15 · Đường Cây Chè · TDP Cách Thượng',
      address: 'Số nhà 15, đường Cây Chè, TDP Cách Thượng, phường An Dương, TP. Hải Phòng',
      map: 'https://www.google.com/maps/search/?api=1&query=S%E1%BB%91%2015%20%C4%91%C6%B0%E1%BB%9Dng%20C%C3%A2y%20Ch%C3%A8%2C%20C%C3%A1ch%20Th%C6%B0%E1%BB%A3ng%2C%20An%20D%C6%B0%C6%A1ng%2C%20H%E1%BA%A3i%20Ph%C3%B2ng',
      photo: 'assets/photos/73.jpg', photoPos: '50% 48%'
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
      date: { day: 29, hour: 10, minute: 30,
        place: { name: 'Tư gia nhà gái', address: 'Số nhà 15, đường Cây Chè, TDP Cách Thượng, phường An Dương, TP. Hải Phòng' } },
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

  // Love story dạng tin nhắn Messenger (b = Thu, g = Nghĩa)
  chat: [
    { from: 'b', text: 'Anh ơi, mình quen nhau ở Nhật được bao lâu rồi nhỉ? 🤔' },
    { from: 'g', text: '7 năm rồi đó em. Từ hôm hai đứa tình cờ gặp nhau nơi xứ người 🇯🇵' },
    { from: 'b', text: 'Bảy mùa hoa anh đào, bảy mùa tuyết trắng… nhanh ghê 🌸❄️' },
    { from: 'g', text: 'Cùng học, cùng làm, cùng đi qua cả những lúc nhớ nhà 🏠' },
    { from: 'g', text: 'Giờ anh muốn cùng em đi tiếp cả đời. Em đồng ý nhé? 💍' },
    { from: 'b', text: 'Em đồng ý! ❤️', react: '❤️' },
    { from: 'g', text: 'Vậy mời cả nhà tới chung vui với tụi mình nha 🥂🎉' }
  ],

  // Tin (story) kiểu Facebook / Instagram: mỗi nhóm vài ảnh
  stories: [
    { name: 'Cầu hôn 💍', photos: ['64', '65', '63'] },
    { name: 'Song hỷ 囍', photos: ['67', '66', '68', '69'] },
    { name: 'Vườn hoa 🌸', photos: ['73', '61', '72', '70', '71'] },
    { name: 'Garden 🤍', photos: ['62', '74', '76', '75'] },
    { name: 'Hoàng hôn 🌇', photos: ['82', '78', '79'] }
  ],

  // Mừng cưới ✏️ (thay ảnh QR trong /assets và số tài khoản)
  gifts: [
    { who: 'Chú rể', side: 'trai', name: 'TEN CHU RE', bank: 'Ngân hàng …', account: '0000000000', qr: 'assets/qr-chure.png' },
    { who: 'Cô dâu', side: 'gai', name: 'PHAM THI HOAI THU', bank: 'Vietcombank', account: '1033762689', qr: 'assets/qr-codau.png' }
  ],

  // Lời chúc mẫu hiện kiểu livestream cho thiệp rộn ràng (không ghi vào Google Sheets)
  seedWishes: [
    { name: 'Minh Anh', message: 'Chúc hai bạn trăm năm hạnh phúc, mãi yêu nhau như ngày đầu nhé!' },
    { name: 'Chị Hằng', message: 'Chúc mừng em gái, cuối cùng cũng về chung một nhà rồi 🥰' },
    { name: 'Hội bạn Tokyo', message: '7 năm ở Nhật cùng nhau, giờ là cả đời. Chúc mừng hai đứa!' },
    { name: 'Anh Đức', message: 'Chúc hai em hạnh phúc, sớm có tin vui nha!' },
    { name: 'Ngọc Lan', message: 'Đẹp đôi quá trời luôn, chúc mừng Thu nhé ❤️' },
    { name: 'Hoàng Nam', message: 'Chúc mừng Nghĩa, cưới được vợ xinh thế này thì phải thương thật nhiều đấy!' },
    { name: 'Cô Mai', message: 'Chúc các con bách niên giai lão, sắt son trọn đời.' },
    { name: 'Thảo Vy', message: 'Ảnh cưới đẹp như phim, chúc hai bạn mãi rạng rỡ thế này 💐' },
    { name: 'Quang Huy', message: 'Happy wedding! Chúc vợ chồng son luôn vui vẻ, hạnh phúc.' },
    { name: 'Bác Hùng', message: 'Chúc hai cháu thuận vợ thuận chồng, tát biển Đông cũng cạn.' },
    { name: 'Phương Thảo', message: 'Từ Nhật về Việt Nam, chúc tình yêu của hai bạn luôn nở hoa 🌸' },
    { name: 'Linh Chi', message: 'Khóc mất thôi, chúc mừng Thu nhiều nhiều 😭❤️' },
    { name: 'Đức Anh', message: 'Chúc mừng hai bạn, hẹn gặp ở tiệc cưới nhé!' },
    { name: 'Chị Nga', message: 'Chúc hai em luôn yêu thương, nhường nhịn và hạnh phúc.' },
    { name: 'Tuấn Kiệt', message: 'Chúc mừng ông bạn, cuối cùng cũng chốt đơn thành công 🎉' },
    { name: 'Hà My', message: 'Chúc cô dâu xinh đẹp và chú rể đẹp trai mãi bên nhau nhé!' },
    { name: 'Anh Long', message: 'Chúc gia đình nhỏ luôn đầm ấm, tràn ngập tiếng cười.' },
    { name: 'Thu Trang', message: 'Bảy năm yêu nhau, giờ thì cưới thôi! Chúc mừng hai bạn 💕' },
    { name: 'Gia đình chú Bình', message: 'Chúc hai cháu hạnh phúc viên mãn, sớm sinh quý tử.' },
    { name: 'Mai Phương', message: 'Đáng yêu quá đi, chúc hai bạn luôn nắm tay nhau như thế này.' },
    { name: 'Bảo Ngọc', message: 'Chúc mừng hạnh phúc! Nhớ mời mình ăn kẹo cưới nha 🍬' },
    { name: 'Khánh Linh', message: 'Chúc hai bạn có một đám cưới thật trọn vẹn và đáng nhớ.' },
    { name: 'Anh Sơn', message: 'Chúc mừng Nghĩa và Thu, hạnh phúc nhé hai em!' },
    { name: 'Yến Nhi', message: 'Chúc vợ chồng mình luôn yêu nhau, hiểu nhau và cùng nhau đi thật xa.' },
    { name: 'Chị Thu Hà', message: 'Chúc em có một gia đình thật ấm áp, hạnh phúc.' },
    { name: 'Việt Hoàng', message: 'Chúc mừng đám cưới! Hai bạn sinh ra là để dành cho nhau.' },
    { name: 'Kim Oanh', message: 'Ôi xinh quá, chúc cô dâu hạnh phúc ngập tràn 💐' },
    { name: 'Anh Phong', message: 'Chúc hai em trăm năm hòa hợp, vạn sự như ý.' },
    { name: 'Diệu Linh', message: 'Chúc mừng hai bạn, cảm ơn vì đã cho mình tin vui này!' },
    { name: 'Minh Quân', message: 'Chúc mừng hạnh phúc, hẹn gặp hai bạn ngày vui nhé!' },
    { name: 'Cô Hoa', message: 'Chúc các con luôn yêu thương, chăm sóc nhau suốt cuộc đời.' },
    { name: 'Ngân Hà', message: 'Chúc hai bạn mãi hạnh phúc như những bức ảnh này 🥰' },
    { name: 'Trung Kiên', message: 'Chúc mừng ông anh, vợ xinh thế này thì sướng nhất rồi!' },
    { name: 'Thanh Tâm', message: 'Chúc gia đình nhỏ luôn bình an, hạnh phúc và đủ đầy.' },
    { name: 'Hồng Nhung', message: 'Chúc mừng Thu nhé, cô dâu đẹp nhất năm nay luôn ❤️' },
    { name: 'Anh Quốc', message: 'Chúc mừng hai em, chúc mọi điều tốt đẹp nhất!' },
    { name: 'Lan Hương', message: 'Chúc hai bạn luôn giữ được nụ cười rạng rỡ như hôm nay.' },
  ],

  music: 'assets/music-2.mp3',
};
