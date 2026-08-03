# Wedding Motion Design Catalog

Catalog này là bộ pattern motion dùng lại cho thiệp cưới online. Mỗi pattern ghi rõ mood, trigger, ngân sách chuyển động, mobile fallback và những điều cần tránh để hiệu ứng hỗ trợ câu chuyện thay vì che lấp nội dung.

## Nhóm pattern

- [Ambient motion](./ambient-motion.md)
- [Entrance reveal](./entrance-reveal.md)
- [Typography motion](./typography-motion.md)
- [Gallery motion](./gallery-motion.md)
- [Romantic interactions](./romantic-interactions.md)
- [Cinematic effects](./cinematic-effects.md)
- [Mobile performance](./mobile-performance.md)
- [Reduced motion](./reduced-motion.md)

## Quy tắc phối

- Mỗi theme chỉ có một signature effect, tối đa hai đến ba ambient layer nhẹ.
- Ưu tiên `transform` và `opacity`; không chạy animation làm thay đổi layout liên tục.
- Nội dung, CTA, focus ring và trạng thái semantic không được phụ thuộc vào animation.
- Mobile dùng native scroll và motion tier nhẹ; reduced motion vẫn giữ art direction bằng hình tĩnh.
- Chỉ thêm Rive/GSAP khi feature không thể đạt chất lượng tương đương bằng CSS/Motion hiện có.

## Nguồn nghiên cứu

Truy cập ngày 02/08/2026: [Motion React](https://motion.dev/docs/react), [Motion layout](https://motion.dev/docs/react-layout-animations), [MotionConfig](https://motion.dev/docs/react-motion-config), [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Rive state machines](https://rive.app/docs/runtimes/state-machines), [Rive best practices](https://rive.app/docs/getting-started/best-practices), [tsParticles React](https://particles.js.org/guides/react), [Lenis](https://github.com/darkroomengineering/lenis), [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion), [web.dev animation performance](https://web.dev/articles/animations-and-performance).

Các capability là thông tin từ tài liệu chính thức; tên pattern, thời lượng và art direction là khuyến nghị nội bộ cho GMM Wedding.
