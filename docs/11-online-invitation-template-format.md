# Format chuẩn cho thiệp cưới online

## 1. Mục đích và ranh giới sản phẩm

Thiệp cưới online là một **thiệp mời tương tác dành cho người nhận**, không phải website cưới kể chuyện dài. Trải nghiệm phải tạo cảm giác nhận và mở một tấm thiệp thật, sau đó cung cấp nhanh thông tin cần thiết để khách quyết định tham dự, xem đường đi, lưu lịch, RSVP và gửi lời chúc.

Website cưới là sản phẩm riêng, có thể ưu tiên câu chuyện tình yêu, album lớn, bài viết, nhiều chapter và nội dung công khai. Không dùng cấu trúc website cưới để thay thế thiệp mời.

Tài liệu này là contract thiết kế cho mọi template thiệp sau này. Template được phép thay đổi art direction, typography, motion và cách sắp xếp; không được làm mất dữ liệu cốt lõi. Các section tùy chọn phải bật/tắt độc lập theo lựa chọn user mà không phá bố cục hoặc validation của section khác.

## 2. Luồng trải nghiệm chuẩn

1. **Opening popup:** khi vừa tải trang, phủ một lớp mở đầu có vật thể thiệp hoặc phong bì, tên cặp đôi, ngày cưới, tên khách nếu được cá nhân hóa và CTA “Mở thiệp”. Popup phải mang đúng chất liệu, màu sắc, typography và họa tiết của template, không dùng một modal đại trà cho mọi mẫu.
2. **Opening transition:** click/tap/keyboard kích hoạt chuỗi motion 600-1200 ms mô phỏng mở phong bì, lật thiệp, kéo rèm, nở hoa hoặc một chuyển cảnh phù hợp concept. Khóa double activation, không tự phát âm thanh trước user gesture và không làm mất nội dung nếu animation lỗi.
3. **Opened banner:** popup rời khỏi luồng, focus chuyển vào banner đầu thiệp. Banner luôn ghi tên cô dâu, chú rể, ngày cưới và có composition riêng của template; không được tái sử dụng nguyên một hero chung chỉ đổi màu.
4. **Invitation:** tiếp tục theo thứ tự lời báo hỷ, hai gia đình, thông tin cô dâu chú rể, nghi lễ và tiệc cưới như nội dung của một thiệp giấy.
5. **Action:** Google Maps, thêm lịch và RSVP dễ tìm, touch target tối thiểu 44px.
6. **Memory:** album, sổ lưu bút/lời chúc, thông tin quà mừng và lời cảm ơn hoàn tất trải nghiệm.

Mọi motion phải dùng transform/opacity khi có thể và có `prefers-reduced-motion`. Thiệp phải sử dụng được bằng bàn phím, không khóa zoom và không phụ thuộc hover.

## 3. Section contract

| Section | Mặc định | Bắt buộc | Có thể đổi thứ tự | Nội dung chính |
|---|---:|---:|---:|---|
| Popup / opening | Bật | Có | Không | Tên cặp đôi, ngày cưới, khách/nhóm khách nếu cá nhân hóa, CTA mở thiệp và motion riêng theo concept |
| Banner sau khi mở | Bật | Có | Không | Tên cô dâu chú rể, ngày cưới, key visual và composition riêng của template |
| Lời báo hỷ | Bật | Có | Không | “Trân trọng báo tin lễ thành hôn của con chúng tôi” hoặc nội dung tùy chỉnh tương đương |
| Hai bên gia đình | Bật | Có khả năng hiển thị | Có | Nhà trai/nhà gái, ông bà hoặc người đại diện, địa chỉ/quê quán; cho phép ẩn từng trường thiếu dữ liệu |
| Cô dâu và chú rể | Bật | Có | Không | Họ tên, vai vế như trưởng nam/thứ nam/trưởng nữ/thứ nữ/con út hoặc nhãn tùy chỉnh |
| Ngày và giờ | Bật | Có | Không | Ngày dương lịch, thứ, giờ đón khách, giờ nghi lễ/khai tiệc |
| Countdown | Bật | Không | Có | Số ngày/giờ còn lại; hết hạn chuyển sang trạng thái “Hôm nay” hoặc “Đã diễn ra” |
| Nghi lễ thành hôn | Bật | Có | Có | “Được cử hành tại”, địa điểm, ngày giờ âm/dương lịch nếu user cung cấp và ghi chú trang phục tùy chọn |
| Thông tin tiệc cưới | Bật | Có | Có | “Kính mời {tên khách}” hoặc “Kính mời Quý khách”, giờ đón khách, giờ khai tiệc, nơi tổ chức và địa chỉ |
| Lịch trực quan | Bật | Có khả năng hiển thị | Có | Tháng/năm dạng calendar, đánh dấu ngày cưới; visual phải biến đổi theo template |
| Lịch trình | Bật | Có khả năng hiển thị | Có | Các mốc đón khách, nghi lễ, khai tiệc và hoạt động tùy chỉnh |
| Địa điểm và Google Maps | Bật | Có khả năng hiển thị | Có | Địa chỉ dạng text, embed map, nút mở Google Maps và fallback khi iframe lỗi |
| Thêm vào lịch | Bật | Có khả năng hiển thị | Đi cùng ngày giờ | Google Calendar và file ICS ở giai đoạn backend |
| Album/slideshow | Bật | Có khả năng hiển thị | Có | 3-12 ảnh; layout có thể là coverflow, film strip, fade, stack hoặc Ken Burns theo concept |
| RSVP | Bật | Có khả năng hiển thị | Có | Tên khách, tham dự/không tham dự, số người, sự kiện, ghi chú, hạn phản hồi và trạng thái gửi |
| Sổ lưu bút | Bật | Có khả năng hiển thị | Có | Một số lời chúc đã duyệt, form hoặc CTA gửi lời chúc bên dưới; moderation/rate limit ở backend |
| Quà mừng | Tắt | Có khả năng hiển thị | Có | Lời nhắn, QR và thông tin tài khoản do chủ thiệp chủ động bật; không dùng fixture chứa dữ liệu thật |
| Lời cảm ơn/footer | Bật | Có | Cuối | Lời cảm ơn khách đã dành thời gian chung vui, tên cặp đôi và thương hiệu tối giản |

“Có khả năng hiển thị” nghĩa là template bắt buộc phải thiết kế và triển khai section đó. Chủ thiệp có quyền bật/tắt khi cấu hình. Khi tắt, section phải rời DOM và bố cục tự nối lại. Popup, banner, lời báo hỷ, tên cặp đôi, ngày giờ chính và lời cảm ơn là xương sống, không được bỏ khỏi một template thiệp cơ bản.

## 4. Dữ liệu cốt lõi

- Cặp đôi: tên hiển thị, tên đầy đủ, monogram, đại từ/xưng hô và vai vế tùy chọn. Vai vế là free-text có preset, không hard-code giới tính hay thứ tự con.
- Hai gia đình: nhãn nhà trai/nhà gái hoặc cách gọi tùy chỉnh; ông, bà, người đại diện, địa chỉ hoặc quê quán. Mỗi người và mỗi địa chỉ có thể vắng mặt độc lập.
- Nội dung nghi lễ: câu báo hỷ, câu “được cử hành tại”, ngày âm/dương lịch, giờ làm lễ và ghi chú tùy chọn.
- Tiệc cưới: lời kính mời có placeholder người nhận, giờ đón khách, giờ khai tiệc, địa điểm, địa chỉ và dress code tùy chọn.
- Sự kiện: loại sự kiện, ngày, múi giờ, giờ bắt đầu/kết thúc, địa điểm và lịch trình. Một thiệp có thể có lễ gia tiên, lễ thành hôn và tiệc ở các thời điểm/địa điểm khác nhau.
- Người nhận: tên hiển thị/nhóm khách chỉ lấy qua invite token; không đưa PII vào published snapshot.
- Media: ảnh có alt text, focal point, kích thước dự kiến và attribution/license nội bộ. Mỗi template định nghĩa kiểu slideshow riêng nhưng nhận cùng một danh sách media.
- RSVP/lời chúc: gửi qua API public có token, validation, rate limit, moderation và trạng thái phản hồi rõ ràng.
- Quà mừng: section opt-in; QR là media riêng cho từng bên hoặc từng tài khoản, có alt text, nhãn người nhận và trạng thái ẩn/hiện. Không đưa dữ liệu ngân hàng vào fixture hoặc log.

## 5. Motion và decoration contract

Mỗi template phải có một motion direction riêng, không chỉ đổi màu trên cùng bộ animation. Motion phục vụ bốn mục tiêu: mở thiệp, dẫn thứ tự đọc, phản hồi thao tác và tạo chiều sâu cho concept.

- **Opening:** animation chính 600-1200 ms, có trạng thái `closed`, `opening`, `opened`; hỗ trợ click, Enter và Space; khóa thao tác lặp trong lúc chuyển cảnh.
- **Banner:** key visual có chuyển động nhẹ như parallax nhiều lớp, camera drift, frame breathing, ánh sáng đổi chậm hoặc vật liệu 3D nghiêng rất nhẹ. Không để chữ rung hoặc di chuyển liên tục.
- **Section reveal:** dùng IntersectionObserver, CSS scroll-driven animation, Motion hoặc GSAP ScrollTrigger. Không dùng React state cập nhật theo từng frame scroll.
- **Album:** kiểu chuyển ảnh phải hợp concept và luôn có điều khiển thủ công. Autoplay dừng khi hover, focus, tab ẩn hoặc bật reduced motion.
- **Decoration:** hoa, lá, giấy, lụa, hạt sáng, con dấu, khung và vật phẩm phải là asset rõ nguồn hoặc do GMM tạo. Dùng nhiều lớp foreground/midground/background, ưu tiên transform/opacity và không chặn pointer event.
- **Background:** không dùng một màu phẳng cho toàn trang nếu concept cần chiều sâu. Có thể dùng texture giấy, botanical shadow, grain nhẹ, gradient ánh sáng, ảnh nền hoặc canvas/WebGL được lazy-load; phải giữ độ tương phản nội dung và không gây CLS.
- **3D:** ưu tiên CSS 3D hoặc Motion cho tilt/card/depth đơn giản. Three.js chỉ dùng khi canvas thật sự là key visual, phải lazy-load, có ảnh fallback và tắt vòng lặp khi tab ẩn hoặc reduced motion.
- **Âm thanh:** mặc định tắt. Chỉ phát sau thao tác rõ ràng của khách, có nút tắt/mở và ghi nhớ lựa chọn trong phiên.
- **Ngân sách:** animation liên tục chỉ áp dụng cho ít lớp trang trí; target 60 fps trên mobile phổ thông, không animate layout property, không để hiệu ứng làm trì hoãn thông tin chính.

## 6. Quy tắc thiết kế theo concept

- Canvas thiệp ưu tiên chiều dọc, desktop đặt giữa một stage có khoảng thở; mobile có thể chạm hai mép màn hình.
- Phần đầu phải nhìn giống thiệp mời, không giống hero SaaS hoặc landing page.
- Hierarchy đọc: ai mời → mời ai → dịp gì → ai kết hôn → khi nào → ở đâu → cần phản hồi gì.
- Typography trang trọng nhưng phải đọc được tiếng Việt; script font chỉ dùng điểm nhấn ngắn. Dùng registry tại `frontend/src/shared/config/wedding-fonts.ts`.
- Mỗi template khóa một palette, một hệ radius/chất liệu và một motion language. Không trộn hiệu ứng chỉ vì thư viện có sẵn.
- Decoration không che nội dung, không chiếm pointer event và không gây CLS.
- Palette là token của template; preview shell có thể đổi palette nhưng không trở thành navbar bên trong thiệp public.
- Slider có nút, dots, trạng thái hiện tại, autoplay dừng khi hover/focus và hỗ trợ swipe khi triển khai gesture.
- Map không được là cách duy nhất truyền địa chỉ. Luôn hiển thị địa chỉ dạng text và link mở bản đồ.
- Sổ lưu bút chỉ hiển thị lời chúc đã duyệt trên bản public; demo có thể dùng fixture giả, không dùng PII thật.

## 7. Trạng thái và lỗi bắt buộc

- Thiếu ảnh: giữ khung ổn định và dùng art direction không ảnh hoặc placeholder nội bộ.
- Map/iframe lỗi: vẫn có địa chỉ và link chỉ đường.
- Calendar không hỗ trợ: cung cấp link Google Calendar; backend sau này sinh `.ics` chuẩn múi giờ.
- RSVP/lời chúc: idle, submitting, success, validation error, rate-limited và offline/retry.
- Popup mở đầu: nếu asset hoặc animation lỗi, CTA vẫn mở thiệp ngay; khi refresh không bắt buộc nhớ trạng thái đã mở.
- QR quà mừng lỗi: giữ lời nhắn và ẩn vùng QR lỗi, không hiển thị URL ảnh hoặc dữ liệu tài khoản thô ngoài phần user đã cho phép.
- Sự kiện đã qua: countdown không âm; CTA RSVP có thể đóng và hiển thị thông báo.
- Section tắt: xóa khỏi DOM và khoảng cách phải tự nối lại, không để vùng trống.

## 8. Bảo mật và quyền riêng tư

- Không render email, số điện thoại, thông tin ngân hàng hoặc danh sách khách trong snapshot công khai mặc định.
- Invite cá nhân sử dụng opaque token; backend lưu hash và authorize theo wedding/invite.
- RSVP và lời chúc cần chống spam, rate limit, validation độ dài và moderation.
- Google Maps/Calendar là dịch vụ ngoài; production cần privacy notice phù hợp và tránh đưa PII vào query URL.
- Thông tin quà mừng là opt-in và phải được review trước publish.

## 9. Acceptance checklist cho template mới

- Cover mở được bằng click, Enter và Space; không double-open.
- Popup và banner có art direction/motion riêng, banner hiện đúng tên cô dâu chú rể sau khi mở.
- Nội dung đọc theo cấu trúc thiệp giấy: người báo tin, hai gia đình, vai vế, cặp đôi, nghi lễ, tiệc, ngày giờ và địa điểm.
- Template triển khai đủ album, calendar, RSVP, map, lịch trình, lời chúc, quà mừng và cảm ơn; kiểm thử trạng thái bật/tắt độc lập.
- Mobile 375px, tablet 768px và desktop không có horizontal overflow.
- Tên dài, thiếu tên phụ huynh, nhiều sự kiện và địa chỉ dài không phá layout.
- Palette đạt tương phản đọc được; focus visible và touch target đạt 44px.
- Map/link lịch/RSVP/lời chúc có accessible name và fallback.
- Slideshow không gây CLS, không autoplay khi reduced motion và có điều khiển thủ công.
- Motion có mục đích, chỉ animate transform/opacity khi có thể, không chặn đọc nội dung và có reduced-motion fallback.
- Background và decoration đúng concept, không che chữ, không chặn pointer và asset có nguồn/license.
- Mọi section optional được thử cả trạng thái bật và tắt.
- Fixture không chứa dữ liệu thật; asset có nguồn/license; không hotlink asset của website tham khảo.

### 9.8. Family focal và thời gian thực

`families` là section bắt buộc, không được tắt ở mọi thiệp online. Đây là khối thông tin trọng yếu theo tập quán thiệp cưới Việt Nam nên phải có hierarchy rõ hơn section nội dung thường: phân biệt nhà gái/nhà trai, đại diện cha mẹ, vai vế và họ tên cô dâu/chú rể, tư gia/địa chỉ và lời kính mời. Danh xưng như `Ông`, `Bà`, `Trưởng nam`, `Trưởng nữ` phải nằm trên dòng nhãn riêng, không ghép cùng dòng họ tên. Trên mobile, hai gia đình xếp dọc, dấu kết duyên nằm giữa nhưng không che chữ; typography ưu tiên khả năng đọc thay vì phóng đại trang trí. Dấu kết duyên có thể dùng ripple chậm, giới hạn hai vòng lan và phản hồi hover/tap; reduced motion phải giữ dấu ở trạng thái tĩnh.

Theme có countdown phải tính lại từ timestamp sự kiện mỗi giây và hiển thị đủ ngày, giờ, phút, giây bằng tabular numerals. Calendar theo đúng art direction nên được giữ hoặc bổ sung cạnh countdown; timer dùng `aria-live="off"` để tránh screen reader đọc lại mỗi giây, tự dừng ở 0 và không phụ thuộc animation nên vẫn chính xác dưới reduced motion.

## 10. Các mẫu hiện có

`Élan d’Amour` v2.3 là implementation đầu tiên theo contract này. Key kỹ thuật và route tương thích vẫn là `modern-luxe` và `/templates/invitations/modern-luxe/preview`. Art direction “couture champagne salon” dùng 2.5D có chọn lọc: opening dạng layered folio, hero paper theatre nhiều mặt phẳng, invitation card gần toàn màn hình mobile với artwork couture tạo riêng, các floating-memory polaroid drift chậm ở mép trang, vellum date plane, date diptych và floating photo deck; các section nội dung giảm dần chiều sâu để giữ khả năng đọc. Tên trong invitation card được tiết chế trên mobile. `families` là focal section bắt buộc với hai family card, vai vế, cha mẹ, tư gia và lời kính mời. `loveJourney` là section tùy chọn/reorderable chính thức. Calendar couture tháng 12 được đặt cạnh countdown realtime đủ ngày–giờ–phút–giây. Pointer parallax chỉ áp dụng cho chuột; reduced motion giữ composition tĩnh nhưng timer vẫn chính xác. Những dữ liệu tương tác hiện là fixture/client prototype; API, moderation, token cá nhân và file ICS chưa được kết nối.

`Verdant Promise` v1.3 là implementation thứ hai, dùng art direction vườn kính nguyên bản, background và botanical frame do GMM tạo mới. Route preview là `/templates/invitations/verdant-promise/preview`. Mẫu có opening “khu vườn thức giấc”, parallax nhiều lớp, botanical edge rail, masked name reveal, living gallery matte, dappled light và RSVP bloom. `vp-families` là focal section bắt buộc dạng hai botanical family card với hierarchy lớn hơn, đủ cha mẹ, vai vế, họ tên cô dâu/chú rể, tư gia và quê quán. Date card được giữ, countdown chuyển sang realtime đủ ngày–giờ–phút–giây. Lenis chỉ chạy trên desktop/fine-pointer; mobile giữ native scroll và reduced motion giữ composition tĩnh.

`Mây Hồng Có Đôi` v1.1 là implementation chibi storybook tại `/templates/invitations/chibi-daydream/preview`. Mẫu dùng coral, powder blue và ivory; popup phong bì 3D, ảnh cặp đôi/album do GMM tạo và vật phẩm từ `assets/icons/chibi`. Family announcement là section bắt buộc với hai card chibi tách biệt, dấu trái tim kết duyên, vai vế và tư gia rõ ràng. Calendar giấy được giữ và bổ sung countdown realtime đủ ngày–giờ–phút–giây; slideshow, RSVP, Maps, sổ lưu bút, QR minh họa và reduced-motion fallback tiếp tục được hỗ trợ.

Các mẫu hiện tại cần tiếp tục được đối chiếu với contract mở rộng ở tài liệu này. Việc một section đang có fixture UI không đồng nghĩa API, cá nhân hóa invite token, moderation, upload QR hoặc lưu RSVP đã hoàn tất.

## 11. Nguồn tham khảo UX

- Chung Đôi, mẫu Vườn Kính Xanh: https://chungdoi.com/vi/mau-thiep/vuonkinh-xanh/demo — truy cập 31/07/2026.
- Chỉ học cấu trúc và interaction pattern. Không sao chép ảnh, font, họa tiết, nội dung hoặc mã nguồn của template tham khảo.
