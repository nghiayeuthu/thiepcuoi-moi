/**
 * Google Apps Script cho thiệp cưới: lưu xác nhận tham dự (RSVP) và lời chúc vào Google Sheets.
 * Cách cài: xem HUONG-DAN.md, phần 2.
 *
 * Bảng tính sẽ tự có 2 trang tính:
 *   - "XacNhan": Thời gian | Họ tên | Tham dự | Số người | Khách của | Tên trên link mời
 *   - "LoiChuc": Thời gian | Họ tên | Lời chúc | Hiển thị (đổi thành KHÔNG để ẩn một lời chúc)
 */

var SHEET_RSVP = 'XacNhan';
var SHEET_WISH = 'LoiChuc';

function sheet_(name, header) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, header.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v, max) {
  v = String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max || 200);
  // Chặn công thức bảng tính (=, +, -, @) để tránh chèn công thức độc hại
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var d = JSON.parse(e.postData.contents || '{}');
    var now = new Date();
    if (d.type === 'rsvp') {
      if (!d.name) return json_({ ok: false, error: 'missing name' });
      var n = Math.max(0, Math.min(10, parseInt(d.guests, 10) || 0));
      sheet_(SHEET_RSVP, ['Thời gian', 'Họ tên', 'Tham dự', 'Số người', 'Khách của', 'Tên trên link mời'])
        .appendRow([now, clean_(d.name, 80), d.attend === 'Có' ? 'Có' : 'Không', n, d.side === 'Nhà gái' ? 'Nhà gái' : 'Nhà trai', clean_(d.invitedAs, 80)]);
      return json_({ ok: true });
    }
    if (d.type === 'wish') {
      if (!d.name || !d.message) return json_({ ok: false, error: 'missing fields' });
      var msg = String(d.message).trim().slice(0, 500);
      if (/^[=+\-@]/.test(msg)) msg = "'" + msg;
      sheet_(SHEET_WISH, ['Thời gian', 'Họ tên', 'Lời chúc', 'Hiển thị'])
        .appendRow([now, clean_(d.name, 80), msg, 'CÓ']);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'unknown type' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action === 'wishes') {
    var sh = sheet_(SHEET_WISH, ['Thời gian', 'Họ tên', 'Lời chúc', 'Hiển thị']);
    var rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues() : [];
    var wishes = rows
      .filter(function (r) { return r[1] && r[2] && String(r[3]).toUpperCase() !== 'KHÔNG'; })
      .map(function (r) {
        return { time: r[0] instanceof Date ? r[0].toISOString() : '', name: String(r[1]).replace(/^'/, ''), message: String(r[2]).replace(/^'/, '') };
      })
      .reverse()
      .slice(0, 200);
    return json_({ ok: true, wishes: wishes });
  }
  return json_({ ok: true, message: 'Thiệp cưới API đang chạy' });
}
