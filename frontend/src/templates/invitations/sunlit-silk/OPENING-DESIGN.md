# Nắng Trên Lụa — Opening design

Phase: 2.5 pre-production (opening direction only)  
Product: `ONLINE_INVITATION`  
Preview shell: `/templates/invitations/sunlit-silk/preview`

## Ý tưởng đã chọn

### Tháo đai lụa bằng khóa đồng

Opening bắt đầu như một tấm thiệp cotton được bọc bằng một dải lụa chéo. Một khóa đồng nhỏ nằm tại điểm giao của dải lụa; người nhận chạm vào khóa để tháo đai, dải lụa trượt khỏi mặt thiệp và lộ lời mời bên dưới.

Đây là một nghi thức mở thiệp, không phải hero landing page. Điểm ghi nhớ duy nhất là **đường lụa di chuyển theo đường chéo và khóa đồng bật mở**.

## Đối chiếu với template cũ

| Template cũ | Signature opening | Điều `Nắng Trên Lụa` giữ lại | Điều không lặp |
| --- | --- | --- | --- |
| Élan d’Amour / Modern Luxe | Folio, ảnh couture, seal | Cảm giác chạm vào một vật phẩm thật | Không dùng polaroid, champagne salon hoặc ảnh làm nguồn nhận diện |
| Verdant Promise | Aperture, khu vườn và ánh sáng | Một động tác mở có chiều sâu | Không dùng cửa vòm, botanical orbit hoặc particle garden |
| Aurelia Court | Card, crest và seal | Sự trang trọng của một tấm thiệp | Không dùng khung cung điện, hoa rơi hoặc card artwork dày |
| Astral Vow | Envelope/eclipse ritual | Trạng thái `closed → opened` rõ ràng | Không dùng nền đêm, quỹ đạo hoặc cosmic reveal |

## Spatial composition

Canvas giữ giới hạn `480px`, opening chiếm tối thiểu `100dvh` trên mobile và nằm hoàn toàn trong `.ss-stage`.

```text
┌──────────────────────────────┐
│  bóng nắng qua rèm           │  renderer-owned, aria-hidden
│                              │
│       TRÂN TRỌNG GỬI         │  eyebrow
│                              │
│       ┌──────────────┐       │
│       │  MINH AN     │       │  paper invitation surface
│       │      ×       │       │
│       │  THU HÀ      │       │
│       │  16 · 01     │       │
│       └──────╲───────┘       │
│              ◉               │  brass clasp, one interactive target
│       Chạm để mở thiệp       │  semantic CTA
│                              │
└──────────────────────────────┘
```

- Nền: `#F5EFE4` với linen grain rất nhẹ; không dùng ảnh couple làm background.
- Dải lụa: `#C8B38E`, phủ mờ vừa đủ để thấy typography bên dưới nhưng vẫn tạo cảm giác đang niêm.
- Khóa: `#9A8058`, hình tròn dẹt với viền `#584B3F`; không phải icon trang trí, đây là CTA.
- Chữ: `Cormorant Garamond GMM` cho tên; `Be Vietnam Pro GMM` cho eyebrow, ngày và CTA.
- Tên nằm trong vùng an toàn trung tâm; dải lụa được phép che một phần tên ở trạng thái đóng nhưng không che accessible text.

## States và choreography

### `closed`

- Dải lụa nằm chéo khoảng `-7deg`, khóa đồng ở giao điểm.
- Tên cặp đôi, ngày và eyebrow hiển thị rõ; nội dung không phụ thuộc animation để đọc.
- Khóa có focus ring 2px màu `#282521`, target tối thiểu `44px`.

### `opening`

Trigger bằng click/tap, Enter hoặc Space. Khóa xoay tối đa `18deg` và trượt 6px; dải lụa rời khỏi trục chéo bằng `transform` và `opacity`, không animate layout. Thời lượng `980ms`, ease `[0.22, 1, 0.36, 1]`; khóa thao tác lặp trong transition.

### `opened`

- Dải lụa nằm gọn ở cạnh dưới của card như một dải ribbon đã tháo.
- Lời mời chính trở thành semantic focus đầu tiên.
- Opening hoàn tất trong tối đa `1.2s`; không chặn nội dung lâu hơn.
- Smooth scroll chỉ được bật sau khi opening hoàn tất trên desktop fine-pointer.

### Reduced motion và lỗi

- `prefers-reduced-motion`: chuyển thẳng sang `opened`, delay bằng `0`, không xoay/trượt/parallax; dải lụa tĩnh nằm ở cạnh dưới.
- Nếu CSS/asset decorative lỗi: giữ paper surface, tên, ngày và nút `Mở thiệp`; không để CTA phụ thuộc khóa hoặc artwork.
- Nếu người dùng tab tới CTA, Enter/Space phải mở được mà không cần hover.

## Motion ownership

- `.ss-opening__clasp` sở hữu transform của khóa.
- `.ss-opening__ribbon` sở hữu transform/opacity của dải lụa.
- Semantic copy và CTA dùng `motion/react` với target tường minh; không query `:scope > *`.
- Decorative sunlight, grain và stitch không nhận inline transform từ Motion; chúng chỉ dùng CSS/effect riêng.
- Mỗi hidden state có đúng một owner khôi phục visibility.

## Asset boundary

Opening này ưu tiên code-native CSS/DOM; chưa cần generated raster. Các vai trò renderer-owned cần duyệt ở Phase 2.5 đầy đủ sau này:

- ribbon band và folded end;
- brass clasp/seal;
- linen/paper texture;
- sunlight shadow pass;
- stitch line và closing knot.

Không expose các vai trò trên thành image input. Ảnh cover nếu có ở phase media chỉ nằm trong card phụ sau opening, không thay thế ribbon/clasp identity.

## Acceptance checklist

- [ ] Opening nhận diện được chỉ bằng ribbon chéo + khóa đồng, kể cả khi không có ảnh.
- [ ] `closed → opening → opened` không double-open và khóa thao tác lặp.
- [ ] Click, tap, Enter và Space đều mở được.
- [ ] CTA/focus ring đạt target tối thiểu 44px và không bị dải lụa che.
- [ ] Opening nằm trong `.ss-stage`, không tạo horizontal overflow ở 375/390/480px hoặc desktop.
- [ ] Full motion dùng 980ms ease-out; reduced motion mở tức thời và vẫn đọc đủ nội dung.
- [ ] Lỗi decor vẫn để lại paper surface, tên, ngày và CTA hoạt động.
- [ ] Không dùng folio, aperture, botanical, cosmic, seal artwork hoặc ảnh couple làm signature lặp lại template cũ.
- [ ] Chỉ sau khi brief này được duyệt mới tạo artwork/preview sheet hoặc đưa opening vào section renderer.
