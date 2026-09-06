import type { EditorialVowsData, EditorialVowsSectionConfig } from './content'

const portrait = '/assets/images/templates/modern-luxe/couple-portrait.jpg'
const detail = '/assets/images/templates/modern-luxe/wedding-detail.jpg'
const ceremony = '/assets/images/login-wedding-luxury.jpg'

export const editorialVowsFixture: EditorialVowsData = {
  hero: {
    brideName: 'Minh Anh',
    groomName: 'Hoàng Nam',
    eyebrow: 'MỘT LỜI HẸN · MỘT ĐỜI',
    headline: 'Chúng mình chọn nhau, giữa muôn vàn dịu dàng.',
    date: '20 · 12 · 2026',
    venue: 'The Reverie Saigon',
    image: portrait,
  },
  announcement: {
    title: 'Ngày mình gọi nhau là nhà',
    message:
      'Sau những mùa thành phố đổi màu, chúng mình sẽ cùng bước vào một chương mới. Thật vui khi ngày ấy có bạn ở bên.',
  },
  couple: {
    bride: {
      name: 'Minh Anh',
      role: 'Cô dâu',
      bio: 'Yêu những buổi sáng chậm, hoa trắng và các cuốn sách còn gấp dở.',
      image: portrait,
    },
    groom: {
      name: 'Hoàng Nam',
      role: 'Chú rể',
      bio: 'Tin rằng mọi hành trình đẹp đều bắt đầu bằng một người đồng hành đúng.',
      image: detail,
    },
  },
  story: [
    {
      year: '2019',
      title: 'Một bàn cạnh cửa sổ',
      body: 'Cuộc gặp tình cờ trong quán cà phê nhỏ đã kéo dài hơn dự định — thêm bảy năm và còn tiếp.',
      image: ceremony,
    },
    {
      year: '2022',
      title: 'Thành phố của chúng mình',
      body: 'Từ hai lịch trình khác nhau, chúng mình học cách dành ra một khoảng trời chung.',
      image: detail,
    },
    {
      year: '2025',
      title: 'Lời hẹn dưới mưa',
      body: 'Không có sân khấu lớn, chỉ có một câu hỏi nhỏ và câu trả lời chắc chắn nhất.',
      image: portrait,
    },
  ],
  events: [
    {
      date: '20.12.2026',
      time: '09:00',
      title: 'Lễ thành hôn',
      venue: 'Tư gia nhà gái',
      address: '28 Đường Hoa Sứ, Quận 3, TP.HCM',
    },
    {
      date: '20.12.2026',
      time: '18:00',
      title: 'Tiệc cưới',
      venue: 'The Reverie Saigon',
      address: '22 Nguyễn Huệ, Quận 1, TP.HCM',
    },
  ],
  gallery: [
    { src: portrait, alt: 'Cặp đôi trong bộ ảnh cưới' },
    { src: detail, alt: 'Chi tiết váy cưới' },
    { src: ceremony, alt: 'Không gian lễ cưới' },
    { src: portrait, alt: 'Khoảnh khắc của cặp đôi' },
    { src: detail, alt: 'Chi tiết ngày cưới' },
  ],
  schedule: [
    { time: '17:30', title: 'Đón khách', detail: 'Cocktail và chụp ảnh' },
    { time: '18:30', title: 'Nghi thức', detail: 'Khoảnh khắc chúng mình nói lời hẹn ước' },
    { time: '19:00', title: 'Khai tiệc', detail: 'Bữa tối và những câu chuyện thân tình' },
    { time: '20:30', title: 'Afterglow', detail: 'Âm nhạc, bánh cưới và khiêu vũ' },
  ],
  weddingParty: [
    { name: 'Thảo Vy', role: 'Phù dâu' },
    { name: 'Gia Huy', role: 'Phù rể' },
    { name: 'Khánh Linh', role: 'Người giữ nhẫn' },
    { name: 'Tuấn Kiệt', role: 'Best man' },
  ],
  dressCode: {
    title: 'Evening in blue',
    message: 'Một nét xanh trong trang phục của bạn sẽ làm bức ảnh chung thật đẹp.',
    colors: ['#10254f', '#3454d1', '#8ba4dd', '#dce4f5', '#f7f7f3'],
  },
  travel: [
    {
      title: 'Di chuyển',
      detail: 'Sảnh tiệc nằm ngay phố đi bộ Nguyễn Huệ; taxi là lựa chọn thuận tiện nhất.',
    },
    { title: 'Đậu xe', detail: 'Bãi xe ô tô tại tầng hầm Times Square, lối vào đường Đồng Khởi.' },
    {
      title: 'Lưu trú',
      detail: 'Khách từ xa có thể chọn các khách sạn trong bán kính 1 km quanh phố đi bộ.',
    },
  ],
  faq: [
    {
      question: 'Mình nên đến lúc nào?',
      answer: 'Bạn đến trước giờ khai tiệc khoảng 30 phút để cùng chụp ảnh nhé.',
    },
    {
      question: 'Có thể đưa trẻ em theo không?',
      answer: 'Có. Hãy ghi số bé trong phần lời nhắn RSVP để chúng mình chuẩn bị ghế.',
    },
    {
      question: 'Tiệc có tổ chức trong nhà?',
      answer: 'Toàn bộ nghi thức và tiệc tối diễn ra trong ballroom.',
    },
  ],
  guestbook: [
    {
      author: 'Thu & Dũng',
      message: 'Chúc hai bạn luôn nhìn nhau với ánh mắt dịu dàng như ngày hôm nay.',
    },
    { author: 'Nhóm Sunday', message: 'Hẹn gặp hai bạn trên mọi chuyến đi đẹp nhất phía trước!' },
  ],
  footer: {
    message: 'Cảm ơn bạn đã là một phần trong câu chuyện của chúng mình.',
    signature: 'Minh Anh & Hoàng Nam',
  },
}

export const editorialVowsSections: EditorialVowsSectionConfig = {
  enabled: [
    'navigation',
    'hero',
    'announcement',
    'couple',
    'story',
    'events',
    'countdown',
    'venues',
    'gallery',
    'schedule',
    'weddingParty',
    'dressCode',
    'travel',
    'faq',
    'rsvp',
    'guestbook',
    'gift',
    'footer',
  ],
  order: [
    'navigation',
    'hero',
    'announcement',
    'couple',
    'story',
    'events',
    'countdown',
    'venues',
    'gallery',
    'schedule',
    'weddingParty',
    'dressCode',
    'travel',
    'faq',
    'rsvp',
    'guestbook',
    'gift',
    'footer',
  ],
}
