# Shared runtime behavior cho public theme

Tài liệu này định nghĩa capability JavaScript dùng chung cho thiệp online, website cưới và recap. Renderer theme chỉ cung cấp config/tokens; không tự triển khai lại listener, audio lifecycle hoặc auto-scroll loop riêng.

## Mobile first-load auto-scroll

Public theme trên mobile mặc định yêu cầu auto-scroll một lần khi vừa mount để giới thiệu nhịp trang. Đây là progressive enhancement, không phải scroll hijacking lâu dài.

```ts
type FirstLoadAutoScrollConfig = {
  enabled: true;
  mobileOnly: true;
  startDelayMs: 1200;
  speedPxPerSecond: 22;
  minSpeedPxPerSecond: 16;
  maxSpeedPxPerSecond: 28;
  stopOnFirstIntent: true;
};
```

- Chỉ chạy trên public renderer với viewport mobile/coarse pointer; không chạy trong editor, admin, preview iframe đang edit hoặc desktop.
- Chỉ khởi động khi trang ở đầu, document đủ cao để scroll và không có deep link/hash target, restored scroll position, modal/opening chưa xử lý hoặc focus nằm trong control.
- Chờ font/hero layout ổn định, rồi tăng tốc nhẹ tới tốc độ cấu hình; dùng time-based RAF hoặc shared scroll controller, không dùng timer cộng pixel cố định.
- Dừng vĩnh viễn cho lần mount hiện tại ngay tại vị trí đang xem khi nhận `touchstart`, `pointerdown`, drag/pan, `wheel`, scroll do user, phím điều hướng, focus vào control/form, mở modal/lightbox/menu hoặc thao tác với audio/gallery.
- Không tự chạy lại sau khi user nhấc tay, đóng modal, đổi orientation hoặc quay lại tab. Route cleanup phải hủy RAF/listener.
- Tắt hoàn toàn với `prefers-reduced-motion`, data-saver/low-power policy hoặc khi browser không bảo đảm scroll ổn định.
- Không thay đổi URL, history, focus hay scroll restoration. Luôn giữ native touch scrolling và không gọi `preventDefault()` trên gesture dừng.
- Test với nội dung ngắn/dài, ảnh load chậm, opening overlay, hash link, back navigation, iOS overscroll và section reorder/disable.

## Shared music control

Khi publication có track hợp lệ, preference mặc định là `enabled`, autoplay được yêu cầu và âm lượng khởi tạo thấp. Preference không đồng nghĩa playback chắc chắn đang chạy.

```ts
type PublicMusicRuntimeConfig = {
  enabledByDefault: true;
  autoplayRequested: true;
  initialVolume: 0.22;
  maxInitialVolume: 0.30;
  loop: true;
  controlPlacement: 'viewport-bottom-left';
};

type MusicPlayback = 'idle' | 'attempting' | 'playing' | 'blocked' | 'error';
```

- Shared player gọi `audio.play()` một lần và xử lý Promise. Nếu bị `NotAllowedError`, chuyển sang `blocked`, hiển thị “Chạm để phát nhạc” và retry trực tiếp trong user gesture hợp lệ đầu tiên; không giả vờ audio đang phát.
- Nút nhạc nằm trong viewport overlay cố định, control của theme được absolute trong overlay ở góc trái dưới: `left: max(16px, env(safe-area-inset-left))`, `bottom: max(16px, env(safe-area-inset-bottom))`. Không đặt trong document flow hoặc để trôi theo section.
- Nút tối thiểu 44×44px, có icon cùng accessible name `Bật nhạc`/`Tắt nhạc`, focus visible và trạng thái không chỉ dựa vào animation/màu.
- Fade âm lượng khi bắt đầu/dừng; mặc định `0.22`, không khởi tạo quá `0.30`. Không tự tăng hoặc tự phát lại sau khi user chủ động chỉnh/tắt.
- Một publication chỉ có một audio instance/shared controller. Auto-scroll hay JavaScript mô phỏng không được coi là user gesture mở khóa audio.
- Auto-scroll dừng ngay khi user chạm nút nhạc. Music control không bị decor, canvas hoặc foreground layer che/chặn pointer.

## Fixture media cho slot user upload

Ảnh demo đại diện cho slot user upload phải là ảnh cưới/cặp đôi hợp lý, không dùng decor, phong cảnh ngẫu nhiên, vật thể không liên quan hoặc ảnh “cho đủ chỗ”.

- Trong một fixture/theme, dùng cùng một cặp đôi hư cấu xuyên hero, couple, story và gallery để câu chuyện nhất quán.
- Giữa các theme, đa dạng cặp đôi, dáng chụp, trang phục cưới, nghi lễ, bối cảnh, framing và điều kiện ánh sáng; ưu tiên hình ảnh phù hợp thị trường Việt Nam mà không biến một kiểu ngoại hình thành mặc định duy nhất.
- Dùng ảnh có license/provenance rõ hoặc ảnh nguyên bản được tạo cho GMM; không dùng PII thật, watermark hoặc chữ đọc được.
- Mỗi fixture có portrait, full/medium couple shot, candid/story moment và wedding-detail/event image phù hợp vai trò. Không lặp một ảnh cho mọi slot.
- Media user vẫn là content, không gánh theme identity. Khi thay toàn bộ fixture bằng ảnh cưới trung tính khác, renderer-owned decor/palette/type/texture/motion vẫn giữ đúng theme.

## Release gate

- Shared auto-scroll chỉ có một controller và dừng ở thao tác đầu tiên.
- Shared music control đúng vị trí, không bị che, volume thấp và thể hiện đúng trạng thái autoplay bị chặn.
- Fixture media review bằng contact sheet theo từng theme và toàn catalog; loại ảnh không phải cặp đôi/đám cưới hoặc sai vai trò.
- Mobile, reduced motion, keyboard, autoplay-blocked và route cleanup đều có test.

## Browser policy references

- [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay)
- [WebKit autoplay policy for macOS](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)
- [WebKit video/audio policy for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)
- [Firefox autoplay controls](https://support.mozilla.org/en-US/kb/block-autoplay)
