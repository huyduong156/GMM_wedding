import type { ForeverData, ForeverSectionConfig } from './content'

const photos = '/assets/images/wedding-couples-examples/couple-001'
export const foreverFixture: ForeverData = {
  hero: { brideName: 'Linh', groomName: 'Huy', eyebrow: 'THE WEDDING OF', headline: 'We found our way', date: '2027-01-10', time: 'Sunday · 10:30 AM', location: 'Đà Lạt, Việt Nam', image: `${photos}/couple-pose-01-standing-portrait.webp`, imageAlt: 'Linh và Huy trong bộ ảnh cưới' },
  announcement: { message: 'Điều đẹp nhất trong ngày này là được có bạn ở đó. Hãy cùng chúng mình bắt đầu một chương mới — thật gần gũi, thật vui, và thật nhiều kỷ niệm.' },
  couple: { image: `${photos}/couple-pose-09-forehead-touch.webp`, bio: 'Tụi mình quen nhau từ những chuyện nhỏ xíu: một lần hỏi thăm, vài buổi cà phê rồi thành người đầu tiên muốn kể mọi chuyện. Giờ thì mời bạn đến ăn cưới, chứng kiến tụi mình nắm tay về chung một nhà nha.' },
  storyHeading: 'Từ lần gặp\nđến ngày cưới.',
  story: [
    { date: '2019-06-08', title: 'Lần đầu gặp nhau', body: 'Bạn chung giới thiệu trong một buổi cà phê. Sau hôm đó, chúng mình bắt đầu nhắn tin và hẹn gặp thêm.' },
    { date: '2020-07-18', title: 'Buổi hẹn đầu tiên', body: 'Chúng mình chọn một quán ăn gần nhà. Buổi tối trôi qua nhẹ nhàng, và là lần đầu cả hai hẹn riêng.' },
    { date: '2026-02-14', title: 'Lời cầu hôn', body: 'Sau bữa tối tại nhà, Huy ngỏ lời. Linh đồng ý, rồi cả hai bắt đầu chọn ngày và chuẩn bị cho đám cưới.' },
  ],
  events: {
    dateEyebrow: 'SAVE THE DATE',
    introEyebrow: 'COME AS YOU ARE',
    introHeading: 'Hẹn gặp bạn|ở {location}.',
    introMessage: 'Một ngày nhỏ, dành cho những người tụi mình thương.',
    agendaHeading: 'LỊCH TRÌNH NGÀY CƯỚI',
    agendaSubheading: 'THE CELEBRATION',
    mapLinkLabel: 'Mở bản đồ ↗',
    summary: { weekday: 'CHỦ NHẬT', date: '10.01.27', arrivalLabel: 'GIỜ ĐÓN KHÁCH', hours: '11:00 — 15:00', venueLabel: 'ĐỊA ĐIỂM', venue: 'THE MIST · ĐÀ LẠT' },
    items: [
    { type: '01 / CEREMONY', title: 'Lễ thành hôn', time: '10:30 sáng', date: 'Chủ Nhật, 10.01.2027', venue: 'Nhà kính The Mist', address: '12 Trần Hưng Đạo, Đà Lạt', mapUrl: 'https://maps.google.com/?q=12+Tran+Hung+Dao+Da+Lat' },
    { type: '02 / CELEBRATION', title: 'Tiệc mừng', time: '11:30 sáng · Đón khách từ 11:00', date: 'Chủ Nhật, 10.01.2027', venue: 'Nhà kính The Mist', address: '12 Trần Hưng Đạo, Đà Lạt', mapUrl: 'https://maps.google.com/?q=12+Tran+Hung+Dao+Da+Lat' },
  ] },
  activities: { heading: 'Những hoạt động|trong buổi tiệc.', items: [{ title: 'Photobooth kỷ niệm', image: `${photos}/couple-pose-10-floral-arch.webp` }, { title: 'Chụp ảnh cùng cô dâu chú rể', image: `${photos}/couple-pose-03-standing-together.webp` }, { title: 'Để lại lời chúc cho hai đứa', image: `${photos}/couple-pose-07-bouquet.webp` }] },
  countdown: { message: 'Tụi mình đang chuẩn bị những điều cuối cùng. Hẹn gặp bạn hôm đó nhé.' },
  venues: { image: `${photos}/couple-pose-06-bride-turns.webp`, heading: 'Đà Lạt,|tháng Một.', note: 'Thời tiết có thể se lạnh vào buổi sáng và tối. Tụi mình chọn một nơi trong nhà kính để mọi người thoải mái tận hưởng cả buổi lễ lẫn tiệc mừng.', address: '12 Trần Hưng Đạo, Đà Lạt', mapUrl: 'https://maps.google.com/?q=12+Tran+Hung+Dao+Da+Lat' },
  gallery: { heading: 'Trước ngày|mình cưới.', images: ['couple-pose-01-standing-portrait.webp', 'couple-pose-06-bride-turns.webp', 'couple-pose-09-forehead-touch.webp', 'bride-profile-left.webp', 'bride-front.webp', 'groom-front.webp', 'groom-profile-right.webp'].map((src, i) => ({ src: `${photos}/${src}`, alt: `Ảnh cưới Linh và Huy — khoảnh khắc ${i + 1}` })) },
  weddingParty: { title: 'Những người luôn ở bên chúng mình', groups: [] },
  dressCode: { heading: 'Thoải mái,|là chính bạn.', message: 'Trang phục thanh lịch với những gam màu trung tính sẽ rất hợp với không khí ngày hôm đó. Nhớ mang theo một chiếc áo khoác nhẹ nhé.', colors: ['#b6b3a7', '#d6c9b9', '#a5aaa1', '#d7d5cc', '#8b8078'] },
  faq: { items: [{ question: 'Có chỗ đậu xe tại địa điểm không?', answer: 'Có khu vực đậu xe cạnh nhà kính. Nếu cần hỗ trợ tìm đường, cứ nhắn tụi mình nhé.' }, { question: 'Mình có thể đưa thêm người đi cùng không?', answer: 'Bạn báo giúp tụi mình số người trong phần xác nhận tham dự để sắp xếp chỗ ngồi chu đáo hơn nha.' }, { question: 'Nếu mình có chế độ ăn đặc biệt thì sao?', answer: 'Ghi chú giúp tụi mình khi xác nhận tham dự, nhà hàng sẽ chuẩn bị phù hợp.' }] },
  rsvp: { heading: 'Bạn đến nhé?', message: 'Cho tụi mình biết trước ngày 20.12 để chuẩn bị chu đáo hơn nha.', note: 'Nếu có câu hỏi về ngày cưới, cứ nhắn tụi mình nhé.' },
  gift: {
    heading: 'Nếu bạn muốn gửi thêm lời chúc',
    message: 'Bạn đến chung vui đã là món quà quý giá với tụi mình. Nếu muốn gửi thêm quà mừng, bạn có thể quét mã bên dưới. Cảm ơn bạn nhiều.',
    qrImage: '',
  },
  guestbook: { heading: 'Một lời chúc cho ngày vui.' },
  footer: { message: 'Thương mến,', signature: 'Linh & Huy', backgroundImage: `${photos}/couple-pose-02-garden-walk.webp` },
  music: { backgroundMusicUrl: '', backgroundMusicName: '', backgroundMusicAutoplay: false },
}

export const foreverSections: ForeverSectionConfig = {
  enabled: ['hero', 'announcement', 'couple', 'story', 'events', 'activities', 'countdown', 'venues', 'gallery', 'dressCode', 'faq', 'rsvp', 'gift', 'guestbook', 'footer', 'music'],
  order: ['hero', 'announcement', 'couple', 'story', 'events', 'activities', 'countdown', 'venues', 'gallery', 'dressCode', 'faq', 'rsvp', 'gift', 'guestbook', 'footer', 'music'],
}
