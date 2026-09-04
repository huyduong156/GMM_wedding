# Woodland artwork candidates

Các asset trong thư mục này là ứng viên artwork renderer-owned cho Woodland Letterpress, được tạo để duyệt trước Phase 3. Chưa được import vào renderer và chưa phải release asset.

## Candidate list

| File | Role | Section | Alpha/background | Planned use |
|---|---|---|---|---|
| `woodland-folio-cover-v1.png` | Hero/cover decoration | `cover` | Transparent PNG | Bìa folio mở thiệp |
| `woodland-seal-medallion-v1.png` | Standalone decoration | `cover`, `event-countdown`, `calendar` | Transparent PNG | Seal opening hoặc marker ngày |
| `woodland-botanical-divider-v1.png` | Divider decoration | `invitation-letter`, `event-countdown`, `venue`, `footer` | Transparent PNG | Chuyển tiếp giữa các khối nội dung |

## Source and provenance

- Tool: built-in OpenAI image generation capability.
- Generated: 2026-09-04.
- External reference: none.
- License/source note: original generated artwork for this repository theme; no external asset was used.
- Constraints applied: no people, no couple, no text, no logo, no watermark, no PII.

## Review notes

- Folio cover: đúng hướng Woodland Letterpress, có giấy birch, xanh thông, dây và seal botanical. Bản candidate được tách nền transparent ở lượt chỉnh sửa thứ hai.
- Seal medallion: phù hợp làm marker độc lập và giữ motif pine/cone.
- Botanical divider: phù hợp làm divider ngang trong canvas 450px; cần kiểm tra kích thước tải và crop khi tích hợp.
- Ambient sprite sheet thử nghiệm bị loại khỏi candidate set vì có nền ánh sáng liền mạch, không đạt yêu cầu asset trong suốt.

## Additional candidates

- `woodland-folio-cover-v2.png` - transparent replacement candidate for the cover folio.
- `woodland-calendar-marker-v1.png` - small date marker.
- `woodland-venue-signpost-v2.png` - venue signpost decoration.
- `woodland-botanical-wreath-v1.png` - open botanical wreath for section framing.
- `woodland-pinecone-spray-v1.png` - larger pine and pinecone spray.
- `woodland-icon-pinecone-v1.png`, `woodland-icon-leaf-v1.png`, `woodland-icon-firefly-v1.png`, `woodland-icon-berry-v1.png` - four independent small ambient icons; no sprite sheet.

The requested large foliage cluster with small wildflowers is not approved yet. Current generated versions still contain a visible glow/background and are excluded until a clean alpha version is available.

## Approval gate

Chỉ sau khi duyệt candidate mới được đổi tên/copy vào asset path chính, ghi decor map cuối cùng và chuyển sang Phase 3. Candidate bị từ chối phải được thay bằng bản version mới, không ghi đè bản cũ.
