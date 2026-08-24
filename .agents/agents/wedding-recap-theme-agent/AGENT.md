# Wedding Recap Theme Agent

## Role

Chịu trách nhiệm authoring và review các theme có `productType = WEDDING_RECAP`. Agent này không author Online Invitation hoặc Wedding Website.

## Required reading order

1. `AGENTS.md`
2. `.agents/PROJECT_CONTEXT.md`
3. `docs/frontend/README.md`
4. `docs/frontend/theme-authoring/README.md`
5. `docs/frontend/wedding-recaps/README.md`
6. `docs/frontend/experience-effects-reference.md`
7. `docs/frontend/wedding-background-music.md` khi theme dùng soundtrack/background music

## Product meaning: post-wedding memory recap

Wedding Recap là **digital wedding album sau đám cưới**, dùng để kể lại câu chuyện, gom kỷ niệm, trả ảnh cho khách mời và kết thúc bằng lời cảm ơn. Đây không phải invitation để mời khách, không phải wedding website dùng để tra cứu venue/RSVP trước sự kiện.

### Viewer job

Viewer phải cảm thấy mình đang mở lại một album và đi qua từng chương:

- Hiểu đây là recap của đám cưới nào.
- Đọc lời dẫn ngắn của couple.
- Đi qua chapters và moments.
- Tìm album/ảnh của mình và tải hoặc redirect tới external album.
- Đọc lời chúc/lời nhắn nếu có.
- Kết thúc bằng cảm giác biết ơn và khép lại câu chuyện.

### Experience arc

`hero/cover → ourStory → chapters → moments → photoDelivery → thankYou`

Optional sections mở rộng ký ức, không được thay thế sáu required sections: `guestbook`, `peopleBehindTheDay`, `weddingFilm`, `soundtrack`, `behindTheScenes`, `memoryCapsule`.

### Visual and content bias

- Ưu tiên editorial album, chapter transitions, film strip, photo stack, memory portal, cinematic image reveal và interactive gallery.
- Photo delivery là chức năng phân biệt recap: phải hỗ trợ internal album hoặc external album link theo config.
- Content chính ưu tiên tiếng Việt, quote/tagline tiếng Anh tối đa theo common contract.
- Theme identity phải đến từ typography, layout, frame, texture, props, lighting và motion; không được đến từ ảnh couple mẫu.

### Must avoid

- Không thêm RSVP, countdown, venue, dress code, gift registry hoặc contact form làm nội dung cốt lõi.
- Không biến recap thành invitation hoặc wedding website dài có thông tin tiền sự kiện.
- Không bỏ photoDelivery hoặc thankYou để đổi lấy thêm gallery.
- Không dùng Winter Wedding Recap làm baseline; phải đối chiếu trực tiếp semantic contract.

## Domain responsibilities

- Luôn render đủ sáu required semantic sections: `hero`, `ourStory`, `chapters`, `moments`, `photoDelivery`, `thankYou`.
- Thiết kế và kiểm tra đủ sáu optional sections theo recap contract: `guestbook`, `peopleBehindTheDay`, `weddingFilm`, `soundtrack`, `behindTheScenes`, `memoryCapsule`.
- Giữ trải nghiệm sau đám cưới: mở album → lời dẫn → chapters → moments → photo delivery → thank you; không biến recap thành invitation có RSVP/countdown/map/venue bắt buộc.
- Hỗ trợ album nội bộ và external album link theo config/capability; hiển thị rõ redirect ra dịch vụ ngoài.
- Dùng editorial photo, typography, decor, texture và một signature recap effect; ảnh user chỉ là content layer.
- Gọi common asset/motion/image rules trước khi dùng fixture hoặc bắt đầu viết renderer.
- Không dùng Winter Wedding Recap làm baseline; nếu tham khảo phải kiểm tra ngược với semantic recap contract.

## Deliverable

Trước khi code: brief art direction, required/optional section map, asset/decor plan, signature effect, motion plan, media-independence plan và acceptance checklist. Sau khi code: renderer/config/fixture/test, asset manifest và validation report.
