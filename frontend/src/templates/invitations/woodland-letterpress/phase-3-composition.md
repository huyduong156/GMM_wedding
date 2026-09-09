# Woodland Letterpress - Phase 3 composition

## Canvas shell

- One invitation canvas: `width: min(100%, 450px)`.
- The outer viewport owns the simple `desktop-gutter` color. No desktop composition is created.
- The canvas uses one vertical reading flow. Sections do not become full-width desktop panels.
- Base section spacing is 72-104px, with 32-48px spacing inside paper compositions.
- Each section has one content anchor and one visual focal point. Artwork never carries meaning alone.

## Section composition map

| Order | Section key | Composition family | Content anchor | Focal point |
|---:|---|---|---|---|
| 1 | `cover` | Interactive folio cover | Couple names, date, open action | Folio, seal, cord |
| 2 | `banner` | Tall editorial nameplate | Couple names and wedding date | Botanical frame and monogram |
| 3 | `invitation-letter` | Layered paper letter | Announcement, families, `{guestName}` invitation | Letter copy and family columns |
| 4 | `event-countdown` | Date plaque plus metric row | Ceremony date/time and countdown | Terracotta date mark |
| 5 | `calendar` | Woodcut month card | Month, year and marked date | Circular date seal |
| 6 | `venue` | Signpost and address card | Venue, address, maps CTA | Signpost artwork |
| 7 | `timeline` | Vertical woodland trail | Ordered milestones | Trail line and markers |
| 8 | `activities` | Vertical layered field notes | Activity title and image | Alternating image crops |
| 9 | `gallery` | 3D photo deck | Album and previous/next controls | Active photo card |
| 10 | `rsvp` | Folded response card | Attendance question and form | Paper response panel |
| 11 | `guestbook` | Hanging note stack | Approved wishes and wish form | Notes on a branch |
| 12 | `gift` | Small paper card | Gift message and QR | QR media with contain |
| 13 | `footer` | Closing paper leaf | Thank-you and monogram | Closing branch ornament |

`cover`, `banner`, `invitation-letter`, `event-countdown`, `calendar`, `venue` and `footer` are core. `timeline`, `activities`, `gallery`, `rsvp`, `guestbook` and `gift` are independently optional. Disabled sections leave the DOM and never move their data into another section.

## Layout and transition map

| From | To | Transition | Purpose |
|---|---|---|---|
| `cover` | `banner` | Folio fades away into paper reveal | Complete opening action |
| `banner` | `invitation-letter` | Botanical rule dissolves into paper seam | Move from identity to invitation |
| `invitation-letter` | `event-countdown` | Short vertical paper fold | Move from people to ceremony time |
| `event-countdown` | `calendar` | Date mark repeats as woodcut accent | Keep date recognition continuous |
| `calendar` | `venue` | Branch/divider seam | Move from when to where |
| `venue` | first enabled optional | Soft paper seam | Preserve flow after optional content |
| optional section | next enabled section | Same seam without placeholder gap | Respect independent toggles |
| last enabled | `footer` | Closing branch enters from edge | Return focus to thank-you |

## Responsive and fallback composition

- Validate at 375px, 390px, 430px and 450px. Content stays inside `padding-inline: 20-28px`.
- Family blocks stack below 390px and may use two columns at 390px+ only when names fit.
- Timeline and activities stay vertical on touch devices.
- Gallery uses the 3D deck only when supported; otherwise it becomes a 2D slider with buttons and scroll-snap.
- Transparent artwork uses `contain`, scales down, and cannot create horizontal overflow.
- Long names and addresses wrap inside the paper surface without changing canvas width.
- Reduced motion removes folio choreography, parallax, perspective, spin and autoplay while retaining geometry and controls.

## Approved decor placement map

Artwork đã duyệt được map theo vị trí, không đặt theo kiểu phủ đều toàn trang:

| Asset | Vị trí mặc định | Xoay/định hướng | Quy tắc an toàn |
|---|---|---|---|
| `woodland-ceremonial-cluster-left-v1.png` | Góc trên trái của `banner` hoặc góc dưới trái của `invitation-letter` | Xoay nhẹ `-8deg` nếu cần theo flow cành | Không đặt giữa canvas; phần cành chìa vào nội dung tối đa 20–24%; luôn nằm ngoài content anchor |
| `woodland-ceremonial-cluster-right-v1.png` | Góc trên phải của `venue` hoặc góc dưới phải của `footer` | Xoay nhẹ `8deg` hoặc lật ngang theo composition | Không dùng đồng thời hai cụm ở cùng một trục; không để mép cutout chọc vào viền đọc |
| `woodland-folio-cover-v2.png` | Cover, lệch tâm theo folio | Giữ orientation gốc | Không crop seal/cord; CTA vẫn là focal point |
| `woodland-folio-open-v1.png` | Cover opened state, dưới content opening | Giữ orientation gốc | Không dùng thay cho content page; không che tên/ngày/CTA |
| `woodland-botanical-divider-v1.png` | Seam giữa các paper section | Xoay `0deg` | Không kéo vượt canvas 450px |
| Small ornaments | Các góc/card marker/section edge | Xoay từng asset `-12deg` đến `12deg` | Không đặt ở trung tâm trang; `pointer-events: none`; giữ clear space quanh chữ và form |

Decor layer phải có `position: absolute`, `transform-origin` hợp lý và breakpoint riêng cho 375/390/430/450px. Ở mobile hẹp, cụm góc được scale xuống hoặc dịch ra ngoài mép trong giới hạn overflow hidden; không dùng rotation làm cho artwork chọc ra gutter/viền viewport. Reduced motion giữ nguyên vị trí tĩnh và tắt mọi drift/float.
## Phase 3 gate

- [x] Core and optional section order defined.
- [x] Distinct composition family and content anchor assigned to every section.
- [x] Independent optional toggle behavior defined.
- [x] Section transitions and skipped-section seams defined.
- [x] Mobile canvas, long-content and reduced-motion fallbacks defined.
- [x] Config skeleton mapped to these section keys.

Phase 3 chưa đóng cho tới khi skeleton renderer, fixture và test mapping được tạo. Sau đó Phase 4 mới định nghĩa technique và motion choreography; advanced parallax, 3D gallery, ambient motion và entrance choreography phải chờ tới phase đó.
