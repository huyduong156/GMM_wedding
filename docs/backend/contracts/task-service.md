# Task service contract

## Phạm vi MVP

Todo thuộc một Wedding nhưng giữ wedding-scoped API để mở rộng multi-wedding sau này.
Hiện tại owner là người quản lý duy nhất; chưa expose assignee/member dù schema vẫn
giữ khả năng mở rộng.

## Task model

- `title`, `description?`, `dueAt?`, `priority`, `status`, `sortOrder`, `revision`.
- `eventId?` liên kết tới `WeddingEvent` từ `/weddings/{weddingId}/events`; task chung có thể bỏ trống.
- `parentTaskId?` tạo task con tối đa một cấp. Task con luôn có `eventId = null` và kế thừa event của task cha khi hiển thị; task con không thể làm parent của task khác.
- `DONE` tự lưu `completedAt` và `completedById`; chuyển khỏi `DONE` sẽ xóa completion metadata.
- Xóa task là soft-delete. Khi xóa task cha, task con được chuyển thành task gốc để không mất dữ liệu.

## Owner API

| Method | Path | Mục đích |
|---|---|---|
| GET/POST | `/weddings/{weddingId}/tasks` | List/filter hoặc tạo task |
| GET/PATCH/DELETE | `/weddings/{weddingId}/tasks/{taskId}` | Đọc/cập nhật/xóa mềm |
| POST | `/weddings/{weddingId}/tasks/reorder` | Reorder tối đa 200 task |
| POST | `/weddings/{weddingId}/tasks/bulk-status` | Đổi status tối đa 200 task |
| POST | `/weddings/{weddingId}/tasks/apply-template` | Copy template thành task độc lập |
| GET | `/task-checklist-templates` | List template `ACTIVE` |

Mọi mutation kiểm tra owner của wedding. PATCH bắt buộc `revision` và trả `409`
khi phát hiện lost update. `eventId` phải là event active cùng wedding. `parentTaskId`
phải là task active cùng wedding và không được có parent. Khi root task được chuyển
thành task con, event của nó bị xóa và các child cũ được promote thành root task,
đồng thời xóa event context cũ.

## Checklist template

Template có version/status `DRAFT|ACTIVE|RETIRED`; user chỉ đọc template `ACTIVE`.
Apply template chạy trong transaction, copy title/description/priority và
source template key/version vào task. `relativeDueDayOffset` được tính từ `baseDate`
hoặc `Wedding.primaryDate` nếu có; task tạo ra vẫn chỉnh sửa độc lập.

Không có category field/CRUD, assignee, comment, dependency, recurring task, reminder,
subtask nhiều cấp hoặc notification trong MVP.
