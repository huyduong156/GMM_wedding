# 0011 - Owner-private Wedding data boundary
Status: Accepted
Date: 2026-08-18

## Context

Wedding là hồ sơ thuộc owner, chứa thông tin của cặp đôi, ngày cưới, sự kiện,
nội dung publication, khách mời và các dữ liệu liên quan. Đây không phải là
đối tượng mà platform admin cần quản lý thường xuyên để vận hành sản phẩm.

Việc tạo một màn hình quản lý Wedding cho admin sẽ mở rộng quyền truy cập vào
dữ liệu cá nhân và làm platform administration phức tạp hơn nhu cầu thực tế.

## Decision

- Wedding management là workspace của owner, không phải một module quản trị
  thường xuyên của platform admin.
- Owner được tạo, sửa, archive và quản lý Wedding của mình theo Wedding
  service contract. Các module con như events, invitations, website, guests,
  RSVP và recap dùng Wedding làm context nhưng có giao diện riêng.
- Platform admin quản lý User/account và các capability cấp nền tảng như
  templates, moderation, operations và audit.
- MVP không có route hoặc màn hình `/gmm_admin/weddings`.
- User detail của admin chỉ có thể hiển thị metadata tối thiểu như số lượng
  Wedding đang sở hữu nếu cần cho vận hành; không hiển thị nội dung Wedding,
  địa điểm, khách mời, RSVP, lời chúc, media hoặc gift ledger.
- Truy cập Wedding cho support, legal hoặc security incident là exception
  flow riêng, phải có lý do, phạm vi giới hạn và audit log. Đây không phải
  quyền mặc định hay workflow hằng ngày của admin.

## Alternatives considered

- Xây dựng full Wedding admin: loại vì không có giá trị vận hành tương xứng
  với chi phí privacy và độ phức tạp.
- Cho admin xem toàn bộ nhưng ẩn PII mặc định: loại vì vẫn tạo quyền truy cập
  rộng và dễ mở rộng sai trong các feature sau.
- Xóa hoàn toàn khả năng support access: chưa chọn vì có thể cần xử lý report,
  incident hoặc yêu cầu pháp lý; thay vào đó dùng exception flow có kiểm soát.

## Consequences

- Admin IA gọn hơn: Users, Templates, Moderation, Operations và các capability
  nền tảng khác; không có Wedding management navigation trong MVP.
- Backend vẫn giữ Wedding authorization theo owner/member và các API owner
  hiện có; quyết định này không yêu cầu bỏ Wedding resource hoặc dữ liệu nội bộ.
- Khi thêm support access, cần có contract riêng cho quyền tạm thời, audit và
  privacy policy trước khi triển khai.
