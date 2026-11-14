# Thiệp cưới online · Tuấn Nghĩa & Hoài Thu

## Cấu trúc thư mục

```
thiepcuoi-moi/
├── index.html            Trang thiệp
├── admin.html            Trang tạo link mời riêng cho từng khách
├── css/style.css         Giao diện
├── js/config.js          ← THÔNG TIN THIỆP (chỉ cần sửa file này)
├── js/main.js            Xử lý (phong bì, nhạc, lịch, form, album…)
├── js/lunar.js           Đổi ngày dương sang âm lịch
├── assets/
│   ├── photos/01…18.jpg  18 ảnh đã chọn (ảnh lớn)
│   ├── photos/thumb/     Ảnh nhỏ cho album và các khung ảnh
│   ├── og.jpg            Ảnh xem trước khi share Facebook/Zalo (1200×630)
│   ├── qr-chure.png      ← QR tạm, cần thay
│   ├── qr-codau.png      ← QR tạm, cần thay
│   └── music.mp3         ← chưa có, cần thêm
└── apps-script/Code.gs   Code dán vào Google Apps Script
```

## 1. Thay file và điền thông tin

| File | Việc cần làm |
|---|---|
| `assets/music.mp3` | Thêm một bài nhạc nền mp3, khoảng 3–5 MB. Chưa có file thì nút nhạc tự ẩn. |
| `assets/qr-chure.png`, `assets/qr-codau.png` | Thay bằng ảnh QR ngân hàng thật. Lấy trong app ngân hàng, phần “Mã QR nhận tiền”, rồi lưu ảnh. Giữ nguyên tên file. |
| `js/config.js` | Điền tên bố mẹ, địa chỉ hai nhà, họ tên đầy đủ, giờ lịch trình, câu chuyện tình yêu, số tài khoản và tên ngân hàng. Các chỗ cần điền có dấu ✏️. |
| `assets/og.jpg` | Không bắt buộc. Muốn đổi ảnh xem trước thì thay bằng ảnh ngang 1200×630. |
| `assets/photos/` | Không bắt buộc. Muốn đổi ảnh thì giữ tên `01.jpg`… và ảnh nhỏ cùng tên trong `thumb/`. Nếu đổi số lượng ảnh thì sửa `photoCount` trong config. |

Ảnh dùng ở các vị trí:
- Ảnh bìa: `01`
- Chú rể và cô dâu: `thumb/08`, `thumb/10`
- Phần đếm ngược: `thumb/17`
- Hai địa điểm: `05`, `13`
- Lời cảm ơn: `18`

Muốn đổi ảnh ở vị trí nào thì sửa tên file trong `index.html` hoặc `js/config.js`.

## 2. Nối Google Sheets (lưu xác nhận tham dự và lời chúc)

1. Vào https://sheets.new để tạo một bảng tính mới, đặt tên, ví dụ “Thiệp cưới – Khách mời”.
2. Trên thanh menu, chọn **Tiện ích mở rộng → Apps Script**.
3. Xóa hết code có sẵn, dán toàn bộ nội dung file `apps-script/Code.gs` vào, rồi bấm 💾 **Lưu**.
4. Bấm **Triển khai → Tùy chọn triển khai mới**:
   - Bấm ⚙️ cạnh “Chọn loại”, chọn **Ứng dụng web**.
   - **Thực thi dưới tên:** *Tôi*.
   - **Người có quyền truy cập:** *Bất kỳ ai*.
   - Bấm **Triển khai**.
5. Google sẽ hỏi cấp quyền. Bấm **Cho phép truy cập**, chọn tài khoản của bạn. Nếu thấy dòng “Google chưa xác minh ứng dụng này” thì bấm **Nâng cao → Đi tới … (không an toàn)**. Đây là script của chính bạn nên bấm tiếp là an toàn.
6. Sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/…/exec`).
7. Mở `js/config.js` và dán URL vào dòng: `scriptUrl: 'https://script.google.com/macros/s/…/exec',`
8. Kiểm tra: mở URL đó kèm `?action=wishes` trên trình duyệt. Thấy `{"ok":true,"wishes":[]}` là chạy được.

Sau khi khách gửi, bảng tính tự có 2 trang tính:
- **XacNhan**: thời gian, họ tên, có tham dự không, số người, khách nhà trai hay nhà gái, tên trên link mời.
- **LoiChuc**: thời gian, họ tên, lời chúc, cột “Hiển thị”. Muốn ẩn một lời chúc khỏi thiệp thì gõ `KHÔNG` vào cột này.

> Nếu sau này sửa `Code.gs`, phải vào **Triển khai → Quản lý các bản triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai**, thì bản sửa mới có hiệu lực. URL giữ nguyên.

## 3. Deploy lên GitHub Pages (miễn phí)

Tài khoản GitHub `nghiayeuthu` của bạn đã dùng cho thiệp cũ, nên làm tương tự:

1. Vào https://github.com/new
   - **Repository name:** `thiepcuoi-moi`
   - Chọn **Public**. GitHub Pages miễn phí cần repo public. Trang đã có thẻ `noindex` nên Google sẽ không hiện thiệp trong kết quả tìm kiếm.
   - Bấm **Create repository**.
2. Đưa code lên. Mở Terminal và chạy lần lượt:

   ```bash
   cd ~/Downloads/thiepcuoi-moi
   git init -b main
   git add .
   git commit -m "Thiệp cưới online"
   git remote add origin https://github.com/nghiayeuthu/thiepcuoi-moi.git
   git push -u origin main
   ```

   Nếu không quen Terminal: ở trang repo vừa tạo, bấm **uploading an existing file**, rồi kéo thả **toàn bộ nội dung** trong thư mục `thiepcuoi-moi` (không kéo cả thư mục ngoài) và bấm **Commit changes**.
3. Trong repo, vào **Settings → Pages**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`, thư mục `/ (root)`, bấm **Save**.
4. Đợi 1–2 phút. Thiệp sẽ có tại `https://nghiayeuthu.github.io/thiepcuoi-moi/` và trang tạo link tại `https://nghiayeuthu.github.io/thiepcuoi-moi/admin.html`.
5. Kiểm tra ảnh xem trước khi share: dán link vào https://developers.facebook.com/tools/debug/ và bấm **Scrape Again**. Zalo thường cập nhật sau vài giờ.

Nếu bạn đặt tên repo khác, sửa 2 dòng `og:url` và `og:image` trong `index.html` cho đúng địa chỉ mới.

**Cập nhật về sau:** sửa file rồi chạy `git add . && git commit -m "Cập nhật" && git push`. Trang sẽ tự cập nhật sau khoảng 1 phút.

### Cách khác: Netlify

Vào https://app.netlify.com/drop rồi kéo thả cả thư mục `thiepcuoi-moi`. Netlify sẽ cho ngay một link. Nhớ sửa `og:url` và `og:image` theo link mới.

## 4. Gửi thiệp cho khách

1. Mở `…/admin.html`.
2. Dán danh sách khách, mỗi dòng một người (ví dụ `Anh Hùng và gia đình`), rồi bấm **Tạo link**.
3. Bấm **Sao chép** ở từng dòng để gửi qua Zalo hoặc Messenger, hoặc bấm **Sao chép tất cả**.

Link có dạng `…/?guestName=Anh%20H%C3%B9ng…` và thiệp sẽ hiện “Trân trọng kính mời Anh Hùng và gia đình”. Mở link không kèm tên thì thiệp hiện “Trân trọng kính mời quý khách”. Link cũ dạng `?to=…` vẫn dùng được.

## 5. Chạy thử trên máy

```bash
cd ~/Downloads/thiepcuoi-moi && python3 -m http.server 8765
```

Sau đó mở http://localhost:8765. Khi chưa có `scriptUrl`, form vẫn gửi được ở chế độ chạy thử nhưng không lưu lên Google Sheets.
