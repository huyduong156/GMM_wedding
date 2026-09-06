import type { CherryBlossomData, CherrySectionConfig } from './content'
const photos = [
  '/assets/images/templates/cherry-blossom-garden/couple-garden-walk.png',
  '/assets/images/templates/cherry-blossom-garden/couple-moon-gate.png',
  '/assets/images/templates/cherry-blossom-garden/rings-sakura.png',
  '/assets/images/templates/cherry-blossom-garden/garden-hero.png',
  '/assets/images/templates/cherry-blossom-garden/moon-pavilion.png',
  '/assets/images/templates/cherry-blossom-garden/chrome-portal.png',
]
export const cherryBlossomFixture: CherryBlossomData = {
  hero: {
    brideName: 'Mai Anh',
    groomName: 'Hải Đăng',
    date: '20 · 03 · 2027',
    venue: 'Vườn Sakura · Đà Lạt',
  },
  announcement: {
    title: 'Một lời hẹn giữa mùa hoa',
    message:
      'Giữa khu vườn ngập nắng và những cánh hoa bay, chúng mình chọn trao nhau lời hứa trọn đời. Thật hạnh phúc khi có bạn ở đó, cùng chứng kiến chương mới dịu dàng nhất của chúng mình.',
  },
  couple: [
    {
      name: 'Mai Anh',
      role: 'Cô dâu',
      bio: 'Cô gái yêu những sáng mùa xuân, trà nóng và những điều bé nhỏ được làm bằng cả trái tim.',
      image: photos[0],
    },
    {
      name: 'Hải Đăng',
      role: 'Chú rể',
      bio: 'Chàng trai luôn tin rằng nhà không phải một nơi chốn, mà là người mình muốn trở về.',
      image: photos[1],
    },
  ],
  story: [
    {
      year: '2019',
      title: 'Ngày mình gặp nhau',
      body: 'Một chiều tháng ba rất đỗi bình thường bỗng trở thành ngày đáng nhớ nhất.',
      image: photos[2],
    },
    {
      year: '2023',
      title: 'Lời hẹn dưới tán cây',
      body: 'Qua những mùa mưa nắng, chúng mình vẫn chọn nắm tay và đi về cùng một phía.',
      image: photos[3],
    },
  ],
  events: [
    {
      date: '20.03.2027',
      time: '16:30',
      title: 'Lễ thành hôn',
      venue: 'Sakura Garden',
      address: 'Đồi Mộng Mơ, Đà Lạt',
    },
    {
      date: '20.03.2027',
      time: '18:00',
      title: 'Tiệc tối dưới hoa',
      venue: 'Glasshouse Pavilion',
      address: 'Sakura Garden, Đà Lạt',
    },
  ],
  gallery: photos.map((src, i) => ({ src, alt: `Khoảnh khắc của Mai Anh và Hải Đăng ${i + 1}` })),
  schedule: [
    { time: '16:00', title: 'Đón khách', detail: 'Trà hoa và những giai điệu acoustic.' },
    { time: '16:30', title: 'Lễ thành hôn', detail: 'Trao lời thề dưới vòm anh đào.' },
    { time: '18:00', title: 'Garden dinner', detail: 'Bữa tối, rượu vang và khiêu vũ.' },
  ],
  faq: [
    {
      question: 'Trang phục phù hợp?',
      answer: 'Trang phục thanh lịch với bảng màu pastel, ivory hoặc xanh non.',
    },
    {
      question: 'Khu vườn có chỗ đỗ xe?',
      answer: 'Có khu vực đỗ xe và xe điện đưa khách đến nơi tổ chức.',
    },
  ],
  guestbook: [
    {
      author: 'Minh & Thư',
      message: 'Chúc hai bạn một đời dịu dàng như chính khu vườn ngày hôm ấy.',
    },
    { author: 'Gia đình', message: 'Mong mỗi mùa hoa nở đều nhắc hai con nhớ về lời hẹn hôm nay.' },
  ],
  footer: { message: 'Hẹn gặp bạn, ở nơi mùa xuân bắt đầu.', signature: 'Mai Anh & Hải Đăng' },
}
export const cherryBlossomSections: CherrySectionConfig = {
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
    'dressCode',
    'faq',
    'rsvp',
    'guestbook',
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
    'dressCode',
    'faq',
    'rsvp',
    'guestbook',
    'footer',
  ],
}
