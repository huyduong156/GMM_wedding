# Admin/editor action feedback

Mọi thao tác có side effect phải cho admin/editor biết rõ kết quả. Việc gọi API thành công không phải là UX hoàn chỉnh.

## Bắt buộc cho mọi mutation

- Hiển thị trạng thái đang xử lý trên control; khóa nút để chống double-submit.
- Khi thành công, hiển thị thông báo rõ hành động nào đã hoàn tất và đối tượng nào bị ảnh hưởng.
- Invalidate/refetch query hoặc cập nhật cache để UI phản ánh dữ liệu mới sau response.
- Khi thất bại, giữ nguyên dữ liệu chưa commit, hiển thị lỗi thân thiện và action `Thử lại`, `Tải lại` hoặc `Xem chi tiết`.
- Feedback ngắn dùng toast/alert với `aria-live="polite"`; trạng thái quan trọng cần có inline status để admin có thể xem lại.
- Tác vụ lâu hơn 300ms dùng progress/skeleton; không để button đứng im hoặc chỉ log ra console.

## Template sync/release

Sau khi sync template invitation, UI phải:

1. Hiển thị `Đang đồng bộ...` và khóa action.
2. Hiển thị summary kết quả: số version tạo mới, không đổi và lỗi nếu có.
3. Refresh/invalidate danh sách template và `pendingReviewCount`.
4. Hiển thị lỗi chung cho admin; nếu lỗi có `requestId` thì cho phép copy request ID để tra backend log.
5. Có action mở audit hoặc tải lại danh sách khi cần xác nhận.

Các nguyên tắc tương tự áp dụng cho release, deprecate, publish, import, bulk action và delete.
