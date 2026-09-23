# Shared motion styles

## Scroll reveal

`reveal-animations.css` đã được loại bỏ sau khi không còn consumer. Entrance effects dùng `motion/react`; `template-motion.css` cung cấp trạng thái đầu cho target tường minh. Không khôi phục bộ class legacy bên dưới.

Các class đã ngừng sử dụng:

- `reveal--fade-up`
- `reveal--slide-left`
- `reveal--slide-right`
- `reveal--slide-down`
- `reveal--slide-up`
- `reveal--zoom-in`
- `reveal--fade-only`

Timing dùng token riêng của template (`duration`, `stagger`, `listStagger`, `ease`); Motion sở hữu trạng thái hiển thị và phải hỗ trợ reduced motion.

## Interaction effects

Import `interaction-effects.css` and add `interaction-ripple` to a positioned button or link. The ripple respects `prefers-reduced-motion`.

Public templates use `useSmoothTemplateScroll`; entrance CSS must not introduce a second global smooth-scroll owner.
