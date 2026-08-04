# 0002 - Frontend theo Feature-Sliced Design

Status: Accepted
Date: 2026-07-29

## Context

Frontend ban đầu chia theo `components/` và `pages/`. Khi bổ sung editor, guest management, RSVP và platform admin, cách chia theo loại file sẽ làm business boundary mờ, mock/model trộn vào UI và import chéo khó kiểm soát.

## Decision

Dùng Feature-Sliced Design cho `frontend/src` với các layer theo thứ tự phụ thuộc:

```text
app → pages → widgets → features → entities → shared
```

- `app`: composition, provider và global styles.
- `pages`: route-level UI và model chỉ thuộc route.
- `widgets`: khối UI lớn tự đủ như app shell.
- `features`: user interaction mang business intent; chỉ tạo khi feature được triển khai.
- `entities`: domain model/UI có thể tái sử dụng.
- `shared`: primitive, infrastructure và helper không chứa business rule.

Layer thấp không import layer cao. Slice chỉ tạo segment `ui`, `model`, `api`, `lib` khi có nội dung thực; không scaffold thư mục rỗng.

## Alternatives considered

- Giữ `components/ + pages/`: đơn giản cho prototype nhưng không thể hiện business boundary khi số module tăng.
- Chia theo domain thuần túy: boundary tốt nhưng khó phân biệt app composition, route và reusable UI.
- Atomic Design: hữu ích cho UI taxonomy nhưng không quy định dependency và business slicing.

## Consequences

- Import path dài hơn cho đến khi cần alias, nhưng dependency direction rõ và dễ enforce.
- Code cũ được di chuyển sang `app`, `pages`, `widgets`, `shared`; `features` và `entities` chỉ xuất hiện khi có use case/domain reusable thực.
- Review phải từ chối import ngược layer và shared component chứa business rule.
