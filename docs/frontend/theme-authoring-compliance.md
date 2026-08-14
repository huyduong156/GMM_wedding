# Theme authoring compliance

Mỗi lần tạo mới hoặc redesign một public theme phải thực hiện hai vòng kiểm tra tài liệu: `preflight` trước art direction/code và `postflight` trước release. Không được dựa vào trí nhớ từ theme trước.

## Required reading manifest

Agent chính phải đọc đầy đủ các tài liệu phù hợp và ghi manifest trong theme specification/PR notes:

```md
## Docs compliance manifest

| Document | Read before design | Rechecked after implementation | Evidence / decision |
|---|---:|---:|---|
| .agents/PROJECT_CONTEXT.md | yes | yes | ... |
| docs/README.md | yes | yes | ... |
| docs/frontend/README.md | yes | yes | ... |
| docs/shared/architecture/system-architecture.md | yes | if contract changed | ... |
| docs/shared/engineering-guidelines.md | yes | yes | ... |
| surface README/catalog/config/checklist | yes | yes | ... |
| experience-effects-reference.md | yes | yes | ... |
| public-theme-runtime-behaviors.md | yes | yes | ... |
| 2-5d-spatial-composition.md | yes | yes | ... |
| relevant motion/visual references | yes | yes | ... |
| assets/ASSET_SOURCES.md | yes | yes | ... |
```

`surface README/catalog/config/checklist` gồm toàn bộ tài liệu được link trực tiếp từ README của loại sản phẩm đang làm: online invitation, wedding website hoặc recap. Đọc thêm design-system/admin docs chỉ khi thay đổi editor/admin. Không nạp backend docs không liên quan tới task frontend; nếu thay đổi cross-system contract thì đọc và cập nhật shared/backend contract theo repository instructions.

Không đánh dấu `yes` nếu chỉ grep, đọc summary hoặc nhớ từ lần trước. Cột evidence phải trỏ tới artifact cụ thể như theme thesis, story spine, section-theme matrix, section composition map, seam/adjacency matrix, motion/living-state map, decor family bible, runtime config, fixture contact sheet, test hoặc source manifest.

## Strong-subject theme gate

Theme có subject nhận diện mạnh—ví dụ Winter, Sakura/Cherry Blossom, Enchanted Forest, Hydrangea Garden, underwater, celestial hoặc một thế giới môi trường cụ thể—bắt buộc có renderer-owned decor family được tạo riêng. Không được chỉ dùng palette, CSS gradient hoặc ảnh user upload để đại diện chủ đề.

Trước code:

1. Gọi `visual_direction_agent` để khóa theme thesis, environmental vocabulary, asset roles và decor family bible.
2. Gọi `decor_image_agent` với skill `generate-wedding-decor` trước khi khóa composition.
3. Tạo tối thiểu 6 artwork decor khác nhau ở ít nhất 4 vai trò cho theme dài: foreground/edge, floating cluster, divider/transition, particle source, prop, atmosphere/background depth hoặc vai trò tương đương.
4. Ghi prompt, output role, usage map và provenance. Không dùng asset chưa qua alpha/edge, border, family-cohesion và contact-sheet review.

Ví dụ Winter có thể cần snow/ice foliage cluster, frost edge, crystal/snow particle source, silver branch/prop, light/aurora atmosphere và transition ornament. Sakura có thể cần hai cụm hoa khác silhouette, petal source, bud/leaf accent, edge canopy/foreground và transition garland/atmosphere. Đây là vai trò gợi ý, không phải composition để copy.

## Preflight block

Không bắt đầu implementation nếu thiếu bất kỳ artifact bắt buộc nào:

- docs compliance manifest;
- theme thesis và story spine;
- section-theme matrix và composition map;
- dynamic adjacency/seam matrix;
- motion và living-state map;
- runtime behavior config;
- decor family bible/asset usage map đối với strong-subject theme;
- fixture-media plan và provenance plan.

## Postflight audit

Sau implementation, đọc lại cùng bộ docs trên và đối chiếu từng rule với code/preview thực tế. Chạy lại media-independence, section reorder/disable, missing-media, mobile, reduced-motion, living-state, runtime, decor-family và asset-source checks. Theme không được release khi manifest còn `no`, evidence trống hoặc code khác quyết định đã ghi mà chưa cập nhật docs.
