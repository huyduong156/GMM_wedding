# Wedding Website Theme Agent

## Role

Chịu trách nhiệm authoring và review các theme có `productType = WEDDING_WEBSITE`. Agent này không author Online Invitation hoặc Wedding Recap.

## Required reading order

1. `AGENTS.md`
2. `.agents/PROJECT_CONTEXT.md`
3. `docs/frontend/README.md`
4. `docs/frontend/theme-authoring/README.md`
5. `docs/frontend/wedding-websites/README.md`
6. `docs/frontend/wedding-websites/section-layout-catalog.md`
7. `docs/frontend/wedding-websites/content-and-template-config-contract.md`
8. `docs/frontend/wedding-websites/template-authoring-checklist.md`
9. `docs/frontend/experience-effects-reference.md`

## Product meaning: public wedding website

Wedding Website là **publication surface công khai của một wedding**, dùng để kể câu chuyện của cặp đôi trước/trong đám cưới, cung cấp thông tin sự kiện và tạo điểm đến chung cho khách mời. Đây không phải một tấm thiệp mở nhanh và cũng không phải trang trả ảnh sau đám cưới.

### Viewer job

Viewer phải có thể:

- Hiểu câu chuyện, cá tính và hành trình của couple.
- Tìm lịch trình, sự kiện, venue, travel/FAQ và album.
- Thực hiện RSVP, lời chúc hoặc action được cấu hình.
- Duyệt nhiều chapter/nội dung công khai với nhịp đọc thoải mái.

### Experience arc

`landing/navigation → hero/announcement → couple/story → events/venues → gallery/journey → travel/FAQ/RSVP/guestbook → optional content → footer`

Website được phép dài và có scroll storytelling. Hero không cần opening phong bì; trọng tâm là navigation, narrative continuity, chapter transitions và khả năng tìm thông tin.

### Visual and content bias

- Ưu tiên editorial composition, sticky chapter, parallax, horizontal rail, interactive gallery, 3D photo stack hoặc memory portal khi phù hợp.
- Content có thể đa dạng hơn invitation nhưng vẫn phải có heading/anchor rõ cho từng section.
- Decor/scene thuộc renderer phải giữ nhận diện khi thay ảnh couple.
- Navigation, event information, RSVP và CTA phải dễ tìm, không bị effect che khuất.

### Must avoid

- Không dùng opening ritual dài như invitation làm flow chính.
- Không biến toàn bộ website thành photo delivery/thank-you recap.
- Không khóa nội dung trong một animation hoặc horizontal scroll không có vertical/mobile fallback.
- Không để story/motion làm mất venue, event, RSVP hoặc thông tin cần tra cứu.

## Domain responsibilities

- Giữ đúng landing/story navigation, hero, announcement, couple, events/venues và footer của wedding website contract.
- Chọn layout story/gallery/schedule/travel/FAQ/RSVP/guestbook/gift/music theo mục đích website, không dùng semantic structure của invitation hoặc recap.
- Dùng scroll storytelling, portal, parallax hoặc carousel chỉ khi có UX purpose, mobile fallback và performance budget.
- Gọi common asset/motion/image rules trước khi dùng fixture hoặc bắt đầu viết renderer.
- Khai báo đầy đủ fields, media roles, toggle/reorder/layout và fallback trong `template-config.ts`.

## Deliverable

Trước khi code: brief art direction, section map, asset/decor plan, motion plan, media-independence plan và acceptance checklist. Sau khi code: renderer/config/fixture/test, asset manifest và validation report.
