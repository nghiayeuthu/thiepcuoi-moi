#!/usr/bin/env python3
"""Tạo thiệp riêng nhà trai / nhà gái từ index.html.

Chạy lại mỗi khi sửa index.html:
    python3 tools/build_sides.py

Kết quả: nha-trai/index.html và nha-gai/index.html. Hai trang này dùng chung
ảnh, CSS, JS với thiệp chính (nhờ thẻ <base href="../">), chỉ khác thuộc tính
data-side và phần mô tả khi chia sẻ link. Ngày, địa điểm của từng bên sửa trong
js/config.js, mục sides.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_URL = 'https://nghiayeuthu.github.io/thiepcuoi-moi/'

SIDES = {
    'trai': {
        'dir': 'nha-trai',
        'og_title': 'Thiệp cưới Tuấn Nghĩa &amp; Hoài Thu · 28.11.2026',
        'desc': 'Thân mời bạn tới chung vui đám cưới Tuấn Nghĩa &amp; Hoài Thu: 11 giờ trưa Thứ Bảy 28/11/2026 tại Khách sạn Hải Đăng, Ngô Quyền, Hải Phòng.',
    },
    'gai': {
        'dir': 'nha-gai',
        'og_title': 'Thiệp cưới Hoài Thu &amp; Tuấn Nghĩa · 29.11.2026',
        'desc': 'Thân mời bạn tới chung vui đám cưới Hoài Thu &amp; Tuấn Nghĩa: 10 giờ 30 sáng Chủ Nhật 29/11/2026, tiệc cưới tại tư gia nhà gái, phường An Dương, TP. Hải Phòng.',
    },
}


def sub(pattern, repl, s):
    out, n = re.subn(pattern, repl, s, count=1)
    if n != 1:
        raise SystemExit('Không tìm thấy: ' + pattern)
    return out


def main():
    src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    for side, cfg in SIDES.items():
        s = src
        s = sub(r'<html lang="vi">', '<html lang="vi" data-side="%s">' % side, s)
        s = sub(r'(<meta charset="utf-8">)', r'\1\n<base href="../">', s)
        s = sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % cfg['desc'], s)
        s = sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="%s">' % cfg['og_title'], s)
        s = sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="%s">' % cfg['desc'], s)
        s = s.replace('<!-- Open Graph:', '<!-- TỰ SINH từ index.html bằng tools/build_sides.py, đừng sửa trực tiếp. -->\n<!-- Open Graph:', 1)
        d = os.path.join(ROOT, cfg['dir'])
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(s)
        print('Đã tạo', cfg['dir'] + '/index.html')


if __name__ == '__main__':
    main()
