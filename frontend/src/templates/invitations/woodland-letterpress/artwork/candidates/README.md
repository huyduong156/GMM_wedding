# Woodland artwork candidates

Các asset còn lại trong thư mục này là candidate artwork renderer-owned cho Woodland Letterpress. Bộ đã duyệt được copy vào thư mục `../` để làm input cố định cho Phase 3/4; chưa import vào renderer.

## Candidate list

| File | Role | Section | Alpha/background | Planned use |
|---|---|---|---|---|
| `woodland-folio-cover-v1.png` | Hero/cover decoration | `cover` | Transparent PNG | Bìa folio mở thiệp |

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

## New generation batch

- Generated with built-in OpenAI image generation capability, 2026-09-06.
- Cụm hoa/cỏ lớn được định hướng như bó trang trí gia tiên cưới: nhiều lớp cành, cỏ, hoa màu kem/terracotta và foliage xanh moss; không dùng người, chữ, logo hoặc couple sample.
- Các asset mới đã được duyệt và dời trực tiếp vào thư mục `artwork/`; không còn nằm trong candidate set.
- Các chi tiết nhỏ đã được tách thành bốn PNG độc lập để renderer điều khiển vị trí, kích thước, opacity và animation riêng.

## Additional candidates

- `woodland-pinecone-spray-v1.png` - larger pine and pinecone spray.
- `woodland-icon-pinecone-v1.png`, `woodland-icon-leaf-v1.png`, `woodland-icon-firefly-v1.png`, `woodland-icon-berry-v1.png` - four independent small ambient icons; no sprite sheet.

The requested large foliage cluster with small wildflowers is not approved yet. Current generated versions still contain a visible glow/background and are excluded until a clean alpha version is available.

## Approval gate

Các asset đã duyệt được copy vào asset path `artwork/` và đã có decor placement map trong `phase-3-composition.md`. Candidate bị từ chối phải được thay bằng bản version mới, không ghi đè bản cũ.
