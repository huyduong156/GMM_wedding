# Nhạc nền cưới trên frontend

Status: Planned; renderer/editor demo đã có, catalog và persistence API chưa nối.

Tài liệu này mô tả ba bề mặt frontend dùng chung catalog nhạc nền: platform admin quản lý kho nhạc, owner chọn nhạc trong editor và khách nghe nhạc trên thiệp/website đã publish. HTTP DTO và persistence thuộc tài liệu backend.

## Platform admin: kho nhạc dùng chung

- Route dự kiến: `/gmm_admin/music`; chỉ hiển thị sau khi admin session/guard đã xác thực.
- Danh sách compact gồm tên hiển thị, nghệ sĩ/nguồn, thời lượng, dung lượng, trạng thái `Draft/Active/Retired`, quyền sử dụng, ngày cập nhật và người upload.
- Admin có thể tìm kiếm, lọc trạng thái, nghe thử, tạo upload intent, upload file, nhập metadata/quyền sử dụng rồi kích hoạt track.
- Chỉ cho kích hoạt khi asset đã `READY`, metadata bắt buộc hợp lệ và có bằng chứng/quyền sử dụng. Không cho public URL hoặc owner chọn track `Draft/Retired`.
- Retire không xóa ngay file đang được snapshot live tham chiếu. UI phải cảnh báo số wedding/snapshot đang dùng trước thao tác và không dùng hard delete làm hành động mặc định.
- Upload hiển thị tiến trình, lỗi MIME/dung lượng, trạng thái xử lý và retry. Không giả báo thành công trước khi backend complete/validate asset.

## Owner: chọn nhạc trong editor

- `Nhạc nền` là section tùy chọn của từng publication surface, không phải dữ liệu bắt buộc của `Wedding`.
- Editor mở picker từ catalog `Active`, có search, preview play/pause, tên track, thời lượng và credit khi cần. Owner chọn một `musicTrackId`, bật/tắt nhạc và cấu hình yêu cầu tự động phát.
- Trạng thái lưu gồm `musicTrackId | null`, `enabled` và `autoplayRequested`; không lưu data URL hoặc URL object storage lâu dài trong content.
- Nếu track đã retire nhưng draft/snapshot cũ còn tham chiếu, editor hiển thị “Không còn phân phối” và yêu cầu chọn track khác trước lần publish tiếp theo; không âm thầm đổi bài.
- Demo hiện tại tại `/studio/invites` đã có upload audio cục bộ tối đa 15MB, bật/tắt autoplay và preview renderer. Đây chỉ là proof of interaction; khi nối API, UI upload trực tiếp của owner được thay bằng catalog picker trừ khi sản phẩm mở riêng tính năng nhạc cá nhân sau này.

## Khách mời: phát nhạc an toàn

- Renderer chỉ tạo audio control khi snapshot có track hợp lệ và section nhạc đang bật.
- Browser có thể chặn autoplay có âm thanh. `autoplayRequested` chỉ là yêu cầu thử phát sau tương tác mở thiệp; luôn có nút phát/tạm dừng với accessible name và không hiển thị lỗi kỹ thuật cho khách.
- Audio lặp lại khi phát, preload tối đa metadata trước tương tác và không chặn first render/LCP. Tắt nhạc không làm mất vị trí đọc thiệp.
- Tôn trọng data-saver/network error: trang vẫn dùng được hoàn toàn khi audio không tải. `prefers-reduced-motion` không tự tắt âm thanh, nhưng renderer không được tự suy luận consent từ setting này.
- Public payload chỉ chứa DTO phát tối thiểu (`trackId`, `displayName`, `durationSeconds`, playback URL/asset reference đã được backend cho phép và credit nếu bắt buộc), không chứa storage key nội bộ hay metadata quyền riêng tư.

## State và accessibility checklist

- Loading, empty catalog, no-results, upload/processing, error/retry, permission denied và retired-reference đều có copy riêng.
- Chỉ một track preview phát tại một thời điểm; đổi track dừng preview cũ.
- Play/pause, chọn/xóa track và switch autoplay dùng được bằng keyboard; trạng thái không truyền đạt chỉ bằng icon/màu.
- Mobile control đạt tối thiểu `44 × 44px`; picker dùng sheet/dialog có focus trap và restore focus.
- Không tự phát nhạc trong màn hình catalog/admin. Preview chỉ phát sau thao tác rõ ràng của người dùng.

## Acceptance và trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Renderer Élan d’Amour có audio loop, autoplay fallback và nút play/pause | Đã có demo |
| Editor có section nhạc và đồng bộ live qua iframe | Đã có demo; chưa nối API nhạc |
| Validation file audio cục bộ 15MB | Đã có demo, chưa phải contract server |
| Admin route/kho nhạc dùng chung | Chưa triển khai |
| Catalog picker cho owner | Chưa triển khai |
| Upload/complete/activate/retire API và typed client | Chưa triển khai |
| Lưu `musicTrackId` cùng revision của surface | Chưa triển khai |
| Publish validation và public snapshot/playback URL | Chưa triển khai |
| Test component, integration và E2E autoplay-blocked/network failure | Chưa triển khai |
