# Wedding Recap — content và authoring contract

Wedding Recap là publication surface sau đám cưới, dùng để kể lại câu chuyện, lưu giữ kỷ niệm và trả ảnh cho khách mời. Recap có cảm giác của một wedding website/thiệp cưới điện tử cao cấp kết hợp digital wedding album và editorial photography; không phải một website mời cưới mở rộng.

Tài liệu này khóa **main content/semantic structure** của recap. Cách trình bày, art direction, typography, motion và composition được phép thay đổi theo từng template theo các nguyên tắc authoring chung của [website cưới](../wedding-websites/README.md), [thiệp online](../online-invitations/section-layout-catalog.md) và [thư viện hiệu ứng](../experience-effects-reference.md).

## 1. Nguyên tắc phạm vi

- Recap là một publication surface riêng với `productType = WEDDING_RECAP`, lifecycle draft/published và published snapshot bất biến.
- Nội dung canonical tách khỏi `themeConfig`, `sectionConfig` và renderer; template chỉ quyết định cách diễn giải và trình bày nội dung.
- Sáu section chính bên dưới là semantic backbone. Template không được bỏ section bắt buộc, nhưng được tự chọn layout, nhịp đọc, art direction và cách chuyển tiếp.
- Sáu section optional phải được theme thiết kế và kiểm thử đầy đủ để owner có thể bật/tắt độc lập. Mặc định có thể tắt để trang không bị dài hoặc quá nhiều nội dung.
- Khi section bị tắt, section phải rời DOM và các section kế tiếp tự nối lại; không để khoảng trống hoặc divider mồ côi.
- Footer là chrome kết thúc trang, không nhất thiết là một section trong editor.
- Không đưa RSVP, countdown, dress code, gift registry, contact form hoặc venue information bắt buộc vào recap.

## 2. Sáu section chính

### `hero` — Hero / Cover

Nội dung chính: tên cô dâu/chú rể, ngày cưới và địa điểm nếu owner muốn hiển thị, tagline ngắn, ảnh hero hoặc video mở đầu và CTA bắt đầu xem.

Layout có thể là full-screen cinematic cover, album cover, editorial split, layered collage, invitation card hoặc composition khác phù hợp theme. Hero media chính phải thay thế được; không khóa ảnh couple mẫu trong renderer.

### `ourStory` — Lời dẫn / Our Story

Nội dung chính: lời dẫn ngắn của cặp đôi, một hoặc vài đoạn văn có chủ ý về độ dài, quote nổi bật tùy chọn và một hoặc vài ảnh hỗ trợ.

Đây là section tạo nhịp nghỉ và cảm xúc, không phải nơi chứa bài văn dài. Layout có thể là typography lớn, editorial two-column, quote-centered, story cards hoặc ảnh xen kẽ text.

### `chapters` — Chapters / Timeline

Đây là câu chuyện theo trình tự thời gian. Mỗi chapter có thể gồm ngày/nhãn thời gian, tên chapter, mô tả ngắn, ảnh đại diện, album reference và CTA xem kỷ niệm tùy chọn.

Chapter là danh sách lặp; owner có thể thêm/bớt item trong giới hạn hợp lý do template/UX quy định. Layout có thể là vertical timeline, alternating layout, editorial chapters, horizontal rail, scroll-snap cards hoặc asymmetric composition. Không khóa cứng số lượng chapter hay một kiểu timeline duy nhất.

### `moments` — Moments / Memories

Đây là các nhóm khoảnh khắc theo chủ đề, khác với `chapters` theo thời gian. Ví dụ: Photobooth, Bubble Memories, Friends & Family, Dinner, Dance, Kids, Celebration và Behind the Scenes.

Mỗi item có thể gồm tên nhóm, mô tả ngắn, ảnh cover, album reference và CTA xem album. Owner có thể thêm số lượng item tùy nhu cầu trong giới hạn bảo vệ chiều dài trang, khả năng đọc và hiệu năng.

Layout có thể là multi-column cards, asymmetric grid, editorial feature card, slider, filmstrip, masonry, polaroid stack hoặc horizontal snap. Một theme không bắt buộc dùng cùng layout cho mọi item hoặc mọi template.

### `photoDelivery` — Photo Delivery / Trả ảnh

Đây là điểm khác biệt chức năng của recap: mời khách quay lại tìm và xem ảnh của họ. Section có thể hiển thị lời dẫn ngắn, CTA xem/tải ảnh, danh sách album/category và gallery nội bộ hoặc link album bên ngoài.

Nguồn album cần hỗ trợ hai mode trong content contract:

```text
INTERNAL_ALBUM
EXTERNAL_ALBUM_LINK
```

`INTERNAL_ALBUM` dùng media đã được hệ thống kiểm tra và có thể cung cấp grid/masonry/editorial gallery, fullscreen viewer, previous/next, download và swipe trên mobile.

`EXTERNAL_ALBUM_LINK` cho phép owner gắn link album bên ngoài để CTA redirect trực tiếp, phục vụ trường hợp owner không muốn upload ảnh lên GMM Wedding hoặc đã có album ở dịch vụ khác. URL phải được validate; hành vi mở cùng tab/tab mới là cấu hình của renderer và phải có accessible label. External link không được giả vờ là gallery nội bộ nếu hệ thống không quản lý được ảnh/download.

Theme có thể trình bày photo delivery như CTA tối giản, album index, fullscreen invitation-to-gallery hoặc editorial portal; không bắt buộc mọi theme phải có modal gallery giống nhau.

### `thankYou` — Thank You / Lời cảm ơn

Nội dung chính: lời cảm ơn của cặp đôi, ảnh hoặc video kết thúc, chữ ký/tên cặp đôi và ngày cưới hoặc tagline kết.

Section cần tạo cảm giác lắng lại như trang cuối của album. Layout có thể là full-screen closing image, album back cover, minimal typography finale hoặc layered cinematic scene.

## 3. Sáu section optional

Mọi recap theme phải có layout hợp lệ cho các section sau, dù mặc định có thể tắt:

| Key | Nội dung chính | Ghi chú |
|---|---|---|
| `guestbook` | Lời chúc đã duyệt được owner chọn | Không hiển thị tự động lời chúc chưa moderation |
| `peopleBehindTheDay` | Gia đình, bạn bè, phù dâu/phù rể hoặc nhóm người quan trọng | Tập trung vào con người |
| `weddingFilm` | Video highlight hoặc external video link | Có poster, lazy-load và fallback tĩnh |
| `soundtrack` | Audio nội bộ hoặc external music link | Không autoplay; có thể triển khai như capability/global player |
| `behindTheScenes` | Chuẩn bị, setup, makeup và khoảnh khắc hậu trường | Khác `peopleBehindTheDay`: tập trung vào quá trình |
| `memoryCapsule` | Lời nhắn cho tương lai hoặc “chapter tiếp theo” | Nên ngắn, thường đặt gần phần kết |

Optional section phải có trạng thái bật/tắt, empty state, mobile fallback và reduced-motion fallback. Không ép owner nhập dữ liệu chỉ để template giữ bố cục.

## 4. Layout và theme authoring

Semantic section không đồng nghĩa với một layout cố định. Mỗi template phải khai báo các layout đã được thiết kế và kiểm thử cho từng section, ví dụ:

```text
moments:
  supportedLayouts:
    - editorial-grid
    - asymmetric-cards
    - horizontal-slider
    - masonry
  defaultLayout: editorial-grid
```

Editor chỉ cho chọn layout trong tập mà template hỗ trợ. Layout có thể thay đổi giữa các theme và có thể có nhiều option trong cùng một theme, nhưng không cho phép ghép tùy ý một layout chưa được authoring/test.

Khi authoring:

- Xen kẽ section giàu ảnh, section typography và section có whitespace để tạo nhịp đọc.
- Không dùng cùng một kiểu card, slider hoặc reveal cho toàn trang.
- Không đặt liên tiếp quá nhiều carousel/marquee/horizontal scroll.
- CTA như “Xem kỷ niệm”, “Xem album”, “Xem & tải ảnh” phải rõ ràng nhưng giữ ngôn ngữ editorial, không giống CTA thương mại.
- Chuyển tiếp giữa hai section liền kề phải được audit như một composition chung; crop, background, divider, texture, ánh sáng và decor không được tạo seam đột ngột.
- Mobile ưu tiên native vertical scroll; không hijack scroll để đổi slide nếu không có fallback rõ ràng.
- Motion chậm, nhẹ, có mục đích; reduced motion giữ một composition tĩnh hoàn chỉnh.

## 5. Quy tắc media và thay ảnh

Media của owner là content, không phải theme identity. Đây là yêu cầu bắt buộc cho recap và cần áp dụng ngược lại khi audit invitation/website cũ.

### Media phải thay thế được

- Ảnh/video hero.
- Ảnh Our Story.
- Ảnh đại diện chapter.
- Ảnh Moments và album cover.
- Ảnh/video Thank You.
- Ảnh/video trong các optional section.

Không được hard-code ảnh couple/người mẫu mẫu vào background hoặc composition khiến user chỉ thay được text. Nếu chưa có media user, dùng placeholder trung tính hoặc fallback đã được quy định.

### Media có thể thuộc renderer

Các asset nhận diện theme có thể được giữ cố định nếu chỉ là decorative media: frame/mask, ornament, botanical hoặc stationery prop, texture/grain/paper surface, divider/light leak/dust/mist/ambient particle và background pattern/scene decoration không đại diện cho một couple cụ thể.

Theme phải vượt qua media-independence check: thay toàn bộ ảnh mẫu bằng ảnh trung tính hoặc ảnh user nhưng vẫn nhận diện được qua palette, typography, frame, ornament, divider, texture và ambient scene.

## 6. Content và privacy

- Recap draft tham chiếu media `READY` cùng wedding và wish `APPROVED` được owner chọn.
- Snapshot public không chứa guest ID, contact data, moderation metadata hoặc PII không cần thiết.
- Guestbook chỉ dùng lời chúc đã duyệt và được owner chọn.
- Album nội bộ phải đi qua media authorization/publication contract; không tự động biến mọi media upload thành public.
- External album link phải được kiểm tra URL và hiển thị rõ đây là liên kết ra dịch vụ bên ngoài.
- Empty, loading, failed media và unavailable external link đều cần trạng thái hiển thị có chủ đích.

## 7. Template config và editor contract

Template recap dùng metadata/config shape chung với invitation và wedding website, nhưng có content schema và renderer riêng. `sections` là nơi khai báo semantic section, khả năng toggle/reorder, layout options và field contract.

### `template-config.ts` là nguồn dữ liệu của editor

Mỗi recap template phải có file `template-config.ts` nằm cùng thư mục template. Đây là nguồn dữ liệu chính để:

- Catalog/admin biết metadata, version, `productType`, preview path và capabilities của template.
- Editor sinh danh sách section, label, trạng thái bắt buộc/tùy chọn, thứ tự và các field/form tương ứng.
- Editor chỉ hiển thị các layout option mà template đã khai báo và hỗ trợ.
- Validator kiểm tra content, section config, item count, media role và compatibility trước preview/publish.
- Renderer map `sectionKey` và content payload vào đúng section; không tự tạo một danh sách section khác với config.

Editor không được hard-code danh sách section hoặc field riêng cho từng page nếu thông tin đó đã thuộc template config. Các behavior UI dùng chung như accordion, reorder, save state và validation có thể nằm trong editor framework; còn section nào tồn tại, field nào được nhập và layout nào được chọn phải đến từ `template-config.ts`.

Ví dụ rút gọn:

```ts
export const recapTemplateConfig = {
  productType: 'WEDDING_RECAP',
  capabilities: {
    seo: true,
    share: true,
    download: true,
    externalAlbumLinks: true,
  },
  sections: [
    {
      sectionKey: 'hero',
      required: true,
      canToggle: false,
      canReorder: false,
      layouts: ['cinematic-cover', 'editorial-split'],
    },
    {
      sectionKey: 'moments',
      required: true,
      canToggle: false,
      canReorder: true,
      repeatable: true,
      layouts: ['editorial-grid', 'asymmetric-cards', 'horizontal-slider'],
      itemFields: ['title', 'description', 'coverMedia', 'albumSource'],
    },
    {
      sectionKey: 'guestbook',
      required: false,
      canToggle: true,
      canReorder: true,
      layouts: ['quote-wall', 'polaroid-notes'],
    },
  ],
} as const
```

Tên field/schema thực tế phải tuân theo shared `TemplateConfig` contract và content schema version của repository; ví dụ trên chỉ minh họa quan hệ giữa config, editor và renderer.

Tối thiểu cần mô tả: `sectionKey`, label, thứ tự mặc định, `required`, `canToggle`, `canReorder`, item schema cho chapter/moment/guestbook/album, layout options, media role/source, mobile/reduced-motion fallback và capability như share, SEO, download, video, soundtrack/external links.

Editor phải cho owner sửa text/media, thêm/bớt item lặp trong giới hạn hợp lý, bật/tắt optional section, chọn layout được theme hỗ trợ, chọn album nội bộ hoặc gắn external album link khi capability được bật, preview trước publish và thấy rõ draft khác bản public.

## 8. Baseline và anti-example

Sáu section bắt buộc của contract mới là:

```text
hero
ourStory
chapters
moments
photoDelivery
thankYou
```

Winter Wedding Recap hiện tại **không phải baseline để tham khảo**. Đây là một implementation/anti-example cần tránh vì cấu trúc `opening`, `chapters`, `filmstrip`, `quote`, `finale` không phản ánh đầy đủ semantic contract mới, thiếu `moments` và `photoDelivery`, đồng thời khóa mạnh composition theo một theme duy nhất. Khi tạo recap theme mới, không copy cấu trúc này; hãy map content theo sáu section bắt buộc và khai báo các optional section theo contract ở trên.

## 9. Authoring checklist

- [ ] Có đủ sáu section bắt buộc và có `data-editor-section` tương ứng 1:1.
- [ ] Có layout hợp lệ cho cả sáu optional section; mặc định bật/tắt được.
- [ ] Mỗi repeatable section có empty state, item limit hợp lý và reorder/toggle behavior rõ ràng.
- [ ] Hero, chapter, moments, gallery và finale thay được media chính.
- [ ] Không có couple/model image bị hard-code ở vị trí content.
- [ ] Decor asset có provenance/license và không mang danh tính của couple mẫu.
- [ ] Có ít nhất một layout mobile hoàn chỉnh cho từng section.
- [ ] Reduced motion không làm mất nội dung hoặc CTA.
- [ ] Có internal album và external album-link behavior rõ ràng nếu theme khai báo capability.
- [ ] Đã thử media-independence bằng ảnh trung tính/user thay toàn bộ fixture.
- [ ] Đã audit seam giữa các section liền kề.
- [ ] Preview, share/OG, empty/loading/error và accessibility được kiểm tra trước release.
