import type { ForeverData, ForeverSectionConfig } from './content'

const photos = '/assets/images/wedding-couples-examples/couple-001'
export const foreverFixture: ForeverData = {
  hero: { brideName: 'Linh', groomName: 'Huy', headline: 'We found our way', date: '10 — 01 — 2027', time: 'Sunday · 10:30 AM', location: 'Đà Lạt, Việt Nam', image: `${photos}/couple-pose-01-standing-portrait.webp`, imageAlt: 'Linh và Huy trong bộ ảnh cưới' },
  announcement: { message: 'Điều đẹp nhất trong ngày này là được có bạn ở đó. Hãy cùng chúng mình bắt đầu một chương mới — thật gần gũi, thật vui, và thật nhiều kỷ niệm.', signature: 'Thương mời, Linh & Huy' },
  couple: { image: `${photos}/couple-pose-03-standing-together.webp`, imageAlt: 'Chân dung Linh và Huy', bio: 'Thích những buổi sáng chậm, cà phê không đường và đi thật xa chỉ để tìm một quán ăn ngon. Tụi mình đã tìm thấy ở nhau một người bạn thân nhất — và muốn cùng bạn ăn mừng điều đó.' },
  story: [
    { year: '2019', title: 'Một buổi chiều rất bình thường', body: 'Chúng mình gặp nhau qua một người bạn chung. Không có tia sét nào cả — chỉ là một cuộc trò chuyện cứ kéo dài mãi.' },
    { year: '2021', title: 'Thành phố đầu tiên', body: 'Từ những chuyến đi ngắn cuối tuần đến cảm giác nơi nào cũng thành nhà, miễn là đi cùng nhau.' },
    { year: '2026', title: 'Một lời hẹn dài lâu', body: 'Và rồi, giữa một ngày nắng nhẹ, chúng mình quyết định chọn nhau cho tất cả những ngày sau.' },
  ],
  events: { summary: { weekday: 'CHỦ NHẬT', date: '10.01.27', hours: '11:00 — 15:00', venue: 'THE MIST · ĐÀ LẠT' }, items: [
    { type: '01 / CEREMONY', title: 'Lễ thành hôn', time: '10:30 sáng', date: 'Chủ Nhật, 10.01.2027', venue: 'Nhà kính The Mist', address: '12 Trần Hưng Đạo, Đà Lạt', mapUrl: 'https://maps.google.com/?q=12+Tran+Hung+Dao+Da+Lat' },
    { type: '02 / CELEBRATION', title: 'Tiệc mừng', time: '11:30 sáng · Đón khách từ 11:00', date: 'Chủ Nhật, 10.01.2027', venue: 'Nhà kính The Mist', address: '12 Trần Hưng Đạo, Đà Lạt', mapUrl: 'https://maps.google.com/?q=12+Tran+Hung+Dao+Da+Lat' },
  ] },
  countdown: { message: 'Đếm từng ngày đến lúc gặp bạn', dateLabel: 'tháng 01, 2027', time: '10:30' },
  venues: { image: `${photos}/couple-pose-06-bride-turns.webp`, imageAlt: 'Khoảnh khắc dịu dàng của cô dâu chú rể', heading: 'Đà Lạt,|tháng Một.', note: 'Thời tiết có thể se lạnh vào buổi sáng và tối. Tụi mình chọn một nơi trong nhà kính để mọi người thoải mái tận hưởng cả buổi lễ lẫn tiệc mừng.', address: '12 Trần Hưng Đạo, Đà Lạt', mapUrl: 'https://maps.google.com/?q=12+Tran+Hung+Dao+Da+Lat' },
  gallery: { heading: 'Trước ngày|mình cưới.', images: ['couple-pose-03-standing-together.webp', 'couple-pose-04-looking-at-each-other.webp', 'couple-pose-02-garden-walk.webp', 'couple-pose-05-seated-bench.webp'].map((src, i) => ({ src: `${photos}/${src}`, alt: `Linh và Huy — khoảnh khắc ${i + 1}` })) },
  schedule: { heading: 'Không cần vội.', items: [{ time: '10:30', title: 'Đón khách & chào nhau' }, { time: '11:00', title: 'Lễ thành hôn' }, { time: '11:30', title: 'Dùng tiệc, nâng ly' }, { time: '14:00', title: 'Chụp ảnh & chuyện trò' }] },
  weddingParty: { title: 'Những người luôn ở bên chúng mình', groups: [] },
  dressCode: { heading: 'Thoải mái,|là chính bạn.', message: 'Trang phục thanh lịch với những gam màu trung tính sẽ rất hợp với không khí ngày hôm đó. Nhớ mang theo một chiếc áo khoác nhẹ nhé.', colors: ['#b6b3a7', '#d6c9b9', '#a5aaa1', '#d7d5cc', '#8b8078'] },
  travel: { message: 'Đà Lạt tháng 1 khá đông vào cuối tuần. Nếu có thể, bạn hãy đặt chỗ ở sớm và dành thêm thời gian di chuyển đến địa điểm nhé.', linkLabel: 'Xem khu vực tổ chức', url: 'https://maps.google.com/?q=12+Tran+Hung+Dao+Da+Lat' },
  faq: { items: [{ question: 'Có chỗ đậu xe tại địa điểm không?', answer: 'Có khu vực đậu xe cạnh nhà kính. Nếu cần hỗ trợ tìm đường, cứ nhắn tụi mình nhé.' }, { question: 'Mình có thể đưa thêm người đi cùng không?', answer: 'Bạn báo giúp tụi mình số người trong phần xác nhận tham dự để sắp xếp chỗ ngồi chu đáo hơn nha.' }, { question: 'Nếu mình có chế độ ăn đặc biệt thì sao?', answer: 'Ghi chú giúp tụi mình khi xác nhận tham dự, nhà hàng sẽ chuẩn bị phù hợp.' }] },
  rsvp: { heading: 'Bạn đến nhé?', message: 'Cho tụi mình biết trước ngày 20.12 để chuẩn bị chu đáo hơn nha.', deadline: '20.12', note: 'Nếu có câu hỏi về ngày cưới, cứ nhắn tụi mình nhé.', actionLabel: 'XÁC NHẬN THAM DỰ' },
  gift: { message: 'Sự có mặt của bạn đã là món quà quý nhất với tụi mình.' },
  guestbook: { heading: 'Một lời chúc cho ngày vui.', actionLabel: 'Gửi lời chúc' },
  footer: { message: 'Thương mến,', signature: 'Linh & Huy' },
  music: { musicTrackId: null, autoplay: false, projection: null },
}

export const foreverSections: ForeverSectionConfig = {
  enabled: ['hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery', 'schedule', 'dressCode', 'travel', 'faq', 'rsvp', 'gift', 'guestbook', 'footer'],
  order: ['hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery', 'schedule', 'dressCode', 'travel', 'faq', 'rsvp', 'gift', 'guestbook', 'footer'],
}
