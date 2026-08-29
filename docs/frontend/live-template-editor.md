# Live template editor

Tài liệu này ghi lại nền editor dùng chung cho thiệp online, website cưới và wedding recap. Mục tiêu là dùng đúng renderer production trong editor, tránh duy trì một bản preview HTML/CSS thứ hai.

## Luồng hiển thị

1. Editor nhúng route preview bằng `iframe` cùng origin và chỉ tải iframe một lần.
2. Renderer gửi event `GMM_LIVE_EDITOR_READY` phiên bản `1` khi listener đã sẵn sàng.
3. Parent gửi `GMM_LIVE_EDITOR_UPDATE` chứa toàn bộ state render hiện tại: content, theme và section config.
4. Renderer báo `GMM_LIVE_EDITOR_HYDRATED` sau khi payload đã được áp dụng và React đã render; parent chỉ ẩn loading sau event này.\n5. Mọi thay đổi tiếp theo chỉ gửi state mới bằng `postMessage`; iframe cập nhật React state, không reload và không gọi server.
6. Khi chọn hoặc focus phần chỉnh sửa, parent gửi `GMM_LIVE_EDITOR_SCROLL_TO_SECTION`; renderer cuộn mượt đến phần tử có `data-editor-section` tương ứng.

Parent và iframe phải kiểm tra `event.origin`, `event.source`, `type` và `version`. Không nhận event tùy ý và không sửa DOM renderer trực tiếp từ parent.

## Phần dùng chung

`frontend/src/shared/lib/live-template-editor.ts` cung cấp:

- Protocol event và type generic cho update/scroll.
- `useLiveEditorBridge`: quản lý iframe ref, handshake ready, truyền state và cuộn section.
- `useEditorSections`: selected, enabled, order, move và toggle section.
- `readEditorImages`: validate và đọc ảnh cục bộ cho demo.

Mỗi sản phẩm chỉ cần cung cấp payload/schema riêng, danh sách section, form field và route renderer. Renderer gắn `data-editor-section` lên từng section có thể điều hướng.

Các field presentation như kiểu album hoặc kiểu hiển thị hoạt động phải lấy options từ template config. Editor không hard-code một catalog hiệu ứng dùng cho mọi theme; chỉ render lựa chọn mà renderer hiện tại thực sự hỗ trợ, gồm cả mobile và reduced-motion fallback.

Section key trong template config, card accordion và `data-editor-section` phải ánh xạ `1:1`. Field thuộc section nào phải nằm trong card của chính section đó; không gộp field `families` vào card `invitation` dù hai section đứng gần nhau trong thiết kế. Khi một cụm hình ảnh chứa nhiều section con, renderer vẫn phải gắn target riêng cho từng section để event scroll tìm đúng nội dung.

## Quy ước trải nghiệm

- Preview mặc định ở kích thước mobile; user có thể chuyển desktop.
- Desktop dùng hai vùng: accordion section chứa trực tiếp form bên trái `45%` và preview bên phải `55%`. Không tách property panel thứ ba.
- Device preview dùng viewport logic cố định rồi scale vào container: desktop `1200 × 800` (tỷ lệ `4.5:3`), mobile `550 × 950`. Không dùng trực tiếp chiều rộng cột làm viewport iframe vì sẽ kích hoạt sai breakpoint của renderer. Mini-preview mobile rộng khoảng `1/3.4` chiều rộng màn hình user.
- Chọn section hoặc focus field phải cuộn preview đến đúng section.
- Cuộn section phải dùng vị trí scroll nội bộ của document renderer; tránh `scrollIntoView` nếu nó có thể tạo scroll chaining và kéo viewport editor bên ngoài. Khung workspace desktop/tablet giữ chiều cao theo viewport và để accordion tự cuộn, kể cả khi card album hoặc danh sách động mở rộng.
- Đổi thứ tự/bật tắt section phải phản ánh trực tiếp trong renderer thật.
- Khả năng sắp xếp phải lấy từ template config (`canReorder`), không hard-code theo editor. Section `canReorder: false` là anchor: ẩn nút move và không cho section khác đi xuyên qua làm thay đổi vị trí anchor. Bìa thường là `canReorder: false` để luôn đứng đầu; template designer phải quyết định rule này cho từng section khi tạo template.
- Ảnh demo dùng data URL trong bộ nhớ trình duyệt. Khi nối API, upload media trước rồi thay data URL bằng asset reference trả về từ server.
- Nhạc nền demo cũng chỉ dùng data URL cục bộ; giới hạn dung lượng trước khi đọc file. Renderer hỗ trợ cấu hình tự động phát nhưng phải xử lý trường hợp browser từ chối autoplay có âm thanh và luôn cung cấp nút phát/tạm dừng có accessible name. Khi nối API, lưu asset reference thay vì chuỗi data URL trong content.
- Trạng thái chưa lưu phải hiển thị rõ; không bật nút lưu khi persistence chưa được nối.
- Mobile hiển thị accordion form toàn màn hình; preview là cửa sổ nổi nhỏ có thể mở rộng. Khi vào editor trên mobile, hiển thị lời khuyên dùng máy tính nhưng phải cho phép đóng và tiếp tục chỉnh sửa.
- Trên viewport editor mobile, preview luôn dùng cấu hình mobile `550 × 950`; không hiển thị lựa chọn desktop để tránh renderer và khung nổi lệch mục tiêu thiết kế mobile-first.

## Contract recap editor theo template config

Recap editor đọc section config theo các quy ước sau:

- Field cấp section nằm trong \`sections[].fields\`; dùng \`contentKey\` khi path content không trùng \`<sectionKey>.<fieldKey>\`.
- Field \`type: "items"\` khai báo danh sách card; \`itemFields\` khai báo field của từng card.
- Với section lặp, có thể khai báo trực tiếp \`repeatable\`, \`minItems\`, \`maxItems\`, \`itemMediaField\`, \`galleryField\`, \`maxMediaPerItem\`; editor dùng các metadata này để tạo card và mở media manager.
- Field ảnh dùng \`type: "image"\` hoặc \`"images"\`; \`mediaRole\` hoặc \`sections[].mediaRoles\` xác định role gửi tới media manager.
- Boolean, select, URL, text và date/time được render từ type/label/options/maxLength/required; editor không cần thêm nhánh theo template key.
- Preview route vẫn phải được renderer registry của ứng dụng đăng ký; đây là wiring của renderer, không phải logic form editor.

## Hướng mở rộng

Website cưới và recap tái sử dụng protocol/hook trên, nhưng giữ payload và renderer riêng. Nếu cần thêm event, thêm tên event cụ thể và tăng version khi thay đổi không tương thích; không dùng event chung chung hoặc truyền script thực thi vào iframe.

## Website editor (2026-08-17)

Website editor dùng cùng live bridge và production renderer với invitation editor. Editor hỗ trợ tải draft theo wedding đang chọn, chỉnh nội dung theo section, bật/tắt và sắp xếp section theo template config, undo/redo, preview desktop/mobile, full preview và lưu có revision conflict.

Các preview website (`editorial-vows`, `green-hydrangea`, `enchanted-forest`, `cherry-blossom-garden`) đều nhận update qua `postMessage`; route `/studio/site/themes` có nút đi thẳng tới `/studio/site/edit`. Publish/unpublish website tiếp tục được nối ở phạm vi riêng.

## Checklist rà soát invitation editor (2026-08-11)

| Hạng mục | Trạng thái |
|---|---|
| Renderer production trong iframe cùng origin, handshake/update không reload | Đã làm |
| Mobile mặc định; desktop/mobile viewport logic và preview nổi trên mobile | Đã làm |
| Accordion form cho content, gia đình, timeline, venue, RSVP và quà | Đã làm |
| Palette và display style lấy theo template config | Đã làm |
| Upload ảnh/ảnh hoạt động cục bộ, giới hạn count/size | Đã làm ở mức demo |
| Bật/tắt, reorder và khóa anchor theo `canReorder` | Đã làm |
| Section nhạc, autoplay fallback và play/pause trong renderer | Đã làm ở mức demo; chưa nối API nhạc |
| Test hiện có cho iframe, viewport, mobile advice, album và reorder anchor | Đã làm một phần |
| Load draft thật từ `GET /weddings/{id}/content` | Đã làm cho invitation editor |
| Upload ảnh qua media API và thay data URL bằng asset reference | Đã làm cho gallery/activities |
| Chọn nhạc từ catalog admin và lưu `musicTrackId` | Còn thiếu |
| Manual save, dirty-state baseline, cảnh báo rời trang và revision conflict | Đã làm; chỉ gửi PUT khi user xác nhận lưu, không autosave theo từng input |
| Full preview, publish/unpublish và kiểm tra slug | Đã làm cho thiệp online |
| Preview/publish validation với media/music `READY` | Chờ hoàn thiện upload ảnh và catalog nhạc theo phạm vi riêng |
| Test API integration, schema editor, autosave/conflict và error states | Đang được duy trì cùng test suite frontend |

Chi tiết UX nhạc cho admin, owner và khách xem [Nhạc nền cưới trên frontend](./wedding-background-music.md).

