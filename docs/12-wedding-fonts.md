# Font chữ cho thiệp cưới

## Mục tiêu

Bộ font self-host phải hiển thị đầy đủ dấu tiếng Việt, có giấy phép cho phép dùng thương mại/redistribution và có vai trò rõ ràng. Không tải font từ nguồn tổng hợp không xác minh được license.

## Bộ font chuẩn

### Cormorant Garamond

- Vai trò: display serif cho tên cặp đôi, tiêu đề section, ngày lớn và nội dung trang trọng từ khoảng 28px trở lên.
- File: normal variable 300–700 và italic variable 300–700.
- Tác giả: Christian Thalmann.
- License: SIL Open Font License 1.1, được lưu cùng font.
- Nguồn chính thức: https://github.com/google/fonts/tree/main/ofl/cormorantgaramond
- Metadata Google Fonts khai báo subset `vietnamese`.

### Dancing Script

- Vai trò: điểm nhấn lãng mạn ngắn như `With love`, dấu nối tên hoặc một câu 2–5 từ.
- Không dùng cho body, địa chỉ, nút, ngày giờ hoặc đoạn văn dài vì nét nối làm dấu tiếng Việt khó đọc ở kích thước nhỏ.
- File: variable 400–700.
- Tác giả: Impallari Type.
- License: SIL Open Font License 1.1.
- Nguồn chính thức: https://github.com/google/fonts/tree/main/ofl/dancingscript
- Metadata Google Fonts khai báo subset `vietnamese`.

### Be Vietnam Pro

- Vai trò: body, lời mời dài, địa chỉ, lịch trình, form, nút và metadata trong template.
- File: Regular 400, Medium 500, SemiBold 600.
- Tác giả: Lâm Bảo, Tony Le và ViệtAnh Nguyễn.
- License: SIL Open Font License 1.1.
- Nguồn chính thức: https://github.com/google/fonts/tree/main/ofl/bevietnampro
- Đây là family được thiết kế cho tiếng Việt; metadata Google Fonts khai báo subset `vietnamese`.

## Thư viện mở rộng

| Font | Vai trò phù hợp | Hướng thiệp | Weight nên dùng |
|---|---|---|---|
| Playfair Display | Display serif tương phản cao | Editorial, black tie, luxury | 500–700 |
| Lora | Serif đọc nội dung ấm áp | Thư tay, kể chuyện, rustic | 400 body, 600–700 heading |
| Fraunces | Display serif mềm và biểu cảm | Botanical, artistic, garden | 500–700 |
| Phudu | Display do type designer Việt Nam thiết kế | Truyền thống mới, song hỷ hiện đại | 500–700 |
| Montserrat | Geometric sans | Tối giản, modern, city wedding | 400–700 |
| Nunito Sans | Humanist sans bo tròn nhẹ | Trẻ trung, thân thiện, botanical | 400–700 |
| Patrick Hand | Handwriting dễ đọc | Lưu bút, lời nhắn thân mật | 400, điểm nhấn ngắn |
| Tapestry | Display trang trí | Heritage, cổ điển, ornamental | 400, từ 30px |

Tất cả family trên được tải từ repository Google Fonts chính thức, metadata khai báo `vietnamese` và sử dụng SIL Open Font License 1.1. License được lưu trong từng folder.

## Token frontend

Khai báo tại `frontend/src/app/styles/fonts.css`:

```css
--font-wedding-display: 'Cormorant Garamond GMM', Georgia, serif;
--font-wedding-script: 'Dancing Script GMM', cursive;
--font-wedding-body: 'Be Vietnam Pro GMM', Inter, ui-sans-serif, system-ui, sans-serif;
--font-wedding-editorial: 'Playfair Display GMM', Georgia, serif;
--font-wedding-warm-serif: 'Lora GMM', Georgia, serif;
--font-wedding-expressive: 'Fraunces GMM', Georgia, serif;
--font-wedding-vietnamese-display: 'Phudu GMM', sans-serif;
--font-wedding-geometric: 'Montserrat GMM', sans-serif;
--font-wedding-soft-sans: 'Nunito Sans GMM', sans-serif;
--font-wedding-handwritten: 'Patrick Hand GMM', cursive;
--font-wedding-ornamental: 'Tapestry GMM', serif;
```

Admin/operational UI tiếp tục dùng Inter theo design system. Wedding font chỉ áp dụng cho renderer, thumbnail hoặc brand moment có chủ đích.

## Quy tắc kiểm thử

- Luôn thử các chuỗi: `Trân trọng kính mời`, `Nguyễn & Đỗ`, `Lễ Thành Hôn`, `Thứ Bảy`, `Địa điểm tổ chức`.
- Kiểm tra tên dài, chữ hoa có dấu, italic và các weight thực dùng.
- `font-display: swap` bắt buộc; fallback phải giữ layout gần tương đương.
- Không dùng script dưới 28px; display serif không dùng cho đoạn văn dài.
- Khi thêm font mới phải ghi tác giả, license, source URL, Vietnamese coverage và thêm license file vào cùng thư mục.
- Mỗi template chỉ chọn một display, một body và tối đa một accent; trình duyệt không nên tải toàn bộ thư viện cho một thiệp.

## Pairing khuyến nghị

- Editorial Luxe: Playfair Display + Montserrat + Dancing Script.
- Vietnamese Heritage: Phudu + Be Vietnam Pro + Patrick Hand.
- Botanical Soft: Fraunces + Nunito Sans + Dancing Script.
- Classic Letter: Cormorant Garamond + Lora + Dancing Script.
- Ornamental Vow: Tapestry + Be Vietnam Pro + Patrick Hand.

Registry dùng cho editor/template picker nằm tại `frontend/src/shared/config/wedding-fonts.ts`.

## Vị trí file

- `frontend/public/assets/fonts/cormorant-garamond/`
- `frontend/public/assets/fonts/dancing-script/`
- `frontend/public/assets/fonts/be-vietnam-pro/`
- `frontend/public/assets/fonts/playfair-display/`
- `frontend/public/assets/fonts/lora/`
- `frontend/public/assets/fonts/fraunces/`
- `frontend/public/assets/fonts/phudu/`
- `frontend/public/assets/fonts/montserrat/`
- `frontend/public/assets/fonts/nunito-sans/`
- `frontend/public/assets/fonts/patrick-hand/`
- `frontend/public/assets/fonts/tapestry/`

Mỗi folder chứa file font và bản sao `OFL.txt` tương ứng.
