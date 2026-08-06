# 0008 - Invitation-first Wedding scope

Status: Accepted
Date: 2026-08-05

## Context

GMM Wedding phục vụ trực tiếp cô dâu/chú rể, phần lớn không phải người tổ chức cưới chuyên nghiệp. Sản phẩm cần giữ onboarding/editor đơn giản trong khi vẫn cung cấp Todo, ngân sách và sổ tiền mừng như các công cụ trọng tâm. Giá trị công khai chính là thiệp online, website cưới và Wedding Recap có thể xuất bản/chia sẻ/SEO; các công cụ companion không được trộn vào luồng publish bắt buộc.

Việc yêu cầu user sắp xếp section trước khi chọn template cũng tách cấu hình khỏi ngữ cảnh trực quan: mỗi template đã có art direction, section hỗ trợ và bố cục mặc định khác nhau.

## Decision

- Sản phẩm áp dụng hướng invitation-first. Ba publication surface ưu tiên là thiệp online, website cưới và Wedding Recap.
- `Wedding` trong MVP là hồ sơ gốc tối giản: tên/cặp đôi, ngày cưới chính, locale/timezone, ảnh/setting cơ bản và liên kết tới event, publication, guest, RSVP, wish và media.
- Một Wedding có thể có nhiều lễ/tiệc. `WeddingEvent` chỉ lưu dữ liệu ngày giờ/địa điểm/map/hiển thị để các surface và RSVP dùng lại; không tạo workspace hay planning workflow riêng cho từng event.
- Luồng MVP là owner-only. `WeddingMember` và role hiện hữu được giữ làm điểm mở rộng nhưng chưa triển khai UI/API quản trị cộng tác viên.
- User chọn template trước. Template áp dụng section/theme/thứ tự mặc định; sau đó user bật/tắt, sắp xếp và chỉnh nội dung trực tiếp trong editor/preview của chính template đó.
- Canonical semantic content tiếp tục tách khỏi presentation để đổi template không làm mất dữ liệu. Ở MVP, đổi template áp dụng default config của template mới; không migration bố cục tùy chỉnh cũ.
- Todo/checklist, ngân sách cơ bản và sổ tiền mừng là các module trọng tâm, được triển khai theo phase và mở bằng progressive disclosure; user không phải cấu hình chúng để tạo/publish thiệp. Quản lý vendor/hợp đồng/nhân sự/timeline vận hành chuyên nghiệp vẫn là Post-MVP.
- Wedding Recap vẫn được ưu tiên vì là publication surface sau ngày cưới; ADR này chỉ hạ ưu tiên phần planner của ADR 0005, không hạ ưu tiên recap.

## Alternatives considered

- Trộn toàn bộ planner vào onboarding/editor: loại vì tăng khái niệm và workflow không phục vụ trực tiếp publish thiệp/web. Các module companion vẫn tồn tại độc lập.
- Chỉ hỗ trợ một ngày/địa điểm: loại vì nghi thức cưới Việt Nam thường có vu quy, thành hôn và tiệc khác thời gian/địa điểm.
- Cấu hình section trước rồi mới chọn template: loại vì user không thấy tác động trực quan và cấu hình có thể không tương thích template.

## Consequences

- Wedding API đầu tiên chỉ cần CRUD owner-only, basic settings và CRUD event tối giản. Todo, ngân sách và ledger có vertical slice riêng sau publication foundation; membership management chưa nằm trong acceptance criteria.
- Frontend onboarding ngắn hơn và dẫn thẳng từ tạo wedding sang chọn template/editor.
- Template config phải cung cấp default section order hợp lệ; editor lưu override theo publication surface sau khi template được chọn.
- Docs/API mới phải phân biệt dữ liệu Wedding/Event với presentation config và publication lifecycle.
- Navigation/dashboard dùng progressive disclosure: các module Todo, ngân sách và tiền mừng có điểm vào rõ ràng nhưng không làm dài onboarding hoặc cản publish lần đầu.
