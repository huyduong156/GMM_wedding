# 0001 - Frontend navigation bằng History API

Status: Accepted
Date: 2026-07-28

## Context

Owner Workspace cần deep link, back/forward và navigation không reload. Khi scaffold, các dải React Router v6/v7 khả dụng đồng thời chịu nhiều npm security advisory; bản vá cho advisory cũ lại nằm trong dải chịu advisory RSC mới. Ứng dụng hiện chỉ có routing phẳng trong một wedding workspace và không dùng data router/RSC.

## Decision

Dùng navigation adapter nhỏ dựa trên browser History API và React context. Tất cả link nội bộ đi qua `AppLink`; page composition đọc pathname từ `NavigationProvider`. Nginx fallback mọi route về `index.html`.

## Alternatives considered

- Giữ React Router và chấp nhận audit warning: từ chối vì production dependency phải sạch advisory đã biết.
- Dùng một router khác: chưa cần thiết cho route scope hiện tại và làm tăng dependency.
- Full page navigation bằng anchor: đơn giản nhưng trải nghiệm kém hơn và mất client state.

## Consequences

- Production audit không còn dependency vulnerability từ router.
- Adapter phải có test cho deep link, back/forward và active navigation.
- Chưa hỗ trợ nested route loader, blocker hay search-param schema nâng cao.
- Đánh giá lại router package khi route complexity tăng hoặc có release đã vá phù hợp; UI không được gọi History API trực tiếp ngoài adapter.
