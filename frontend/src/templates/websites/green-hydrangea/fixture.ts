import type { GreenHydrangeaData, GreenHydrangeaSectionConfig } from './content'

const root = '/assets/images/templates/green-hydrangea'
export const greenHydrangeaFixture: GreenHydrangeaData = {
  hero: {
    brideName: 'An Nhiên',
    groomName: 'Minh Khang',
    eyebrow: 'GREEN HYDRANGEA WEDDING',
    date: '18 · 04 · 2027',
    venue: 'The Garden Conservatory',
    image: `${root}/couple-hero.png`,
  },
  announcement: {
    title: 'Một ngày dịu dàng',
    message:
      'Giữa khu vườn xanh và những mùa hoa nở, chúng mình chọn ở lại bên nhau. Thật vui khi ngày bắt đầu ấy có bạn cùng sẻ chia.',
  },
  couple: {
    bride: {
      name: 'An Nhiên',
      role: 'Cô dâu',
      bio: 'Yêu những buổi sớm có nắng, hoa cẩm tú cầu và căn nhà luôn đầy tiếng nhạc.',
      image: `${root}/bride-portrait.png`,
    },
    groom: {
      name: 'Minh Khang',
      role: 'Chú rể',
      bio: 'Tin vào những điều bền lâu được vun trồng từ sự tử tế và những ngày bình thường bên nhau.',
      image: `${root}/groom-portrait.png`,
    },
  },
  story: [
    {
      year: '2020',
      title: 'Lần đầu gặp gỡ',
      body: 'Một chiều tháng tư, cuộc trò chuyện ngắn bên hiên cây xanh đã trở thành khởi đầu cho rất nhiều ngày sau đó.',
      image: `${root}/couple-hero.png`,
    },
    {
      year: '2024',
      title: 'Ngôi nhà nhỏ',
      body: 'Chúng mình học cách chăm một khu vườn, nấu bữa tối và biến những điều giản dị thành kỷ niệm.',
      image: `${root}/bride-portrait.png`,
    },
    {
      year: '2026',
      title: 'Lời hẹn dưới tán cây',
      body: 'Không cần một sân khấu lớn, chỉ cần hai người cùng tin vào một hành trình dài phía trước.',
      image: `${root}/groom-portrait.png`,
    },
  ],
  venues: {
    title: 'The Garden Conservatory',
    address: '12 Đường Lá Xanh, Thảo Điền, TP.HCM',
    mapUrl: 'https://maps.google.com',
  },
  rsvp: {
    title: 'Bạn sẽ đến chứ?',
    message: 'Hãy cho chúng mình biết bạn có thể cùng chung vui nhé.',
    deadline: '2027-04-10',
  },
  events: [
    {
      date: '18.04.2027',
      time: '16:30',
      title: 'Lễ thành hôn',
      venue: 'The Garden Conservatory',
      address: '12 Đường Lá Xanh, Thảo Điền, TP.HCM',
    },
    {
      date: '18.04.2027',
      time: '18:00',
      title: 'Tiệc tối trong vườn',
      venue: 'Hydrangea Lawn',
      address: 'Khu vườn phía Đông, The Garden Conservatory',
    },
  ],
  gallery: [
    { src: `${root}/bride-portrait.png`, alt: 'Chân dung cô dâu bên hoa cẩm tú cầu' },
    { src: `${root}/couple-hero.png`, alt: 'Cặp đôi trong khu vườn ngày cưới' },
    { src: `${root}/groom-portrait.png`, alt: 'Chân dung chú rể trong khu vườn' },
  ],
  schedule: [
    { time: '16:00', title: 'Đón khách', detail: 'Trà hoa và chụp ảnh trong vườn' },
    { time: '16:30', title: 'Nghi lễ', detail: 'Trao lời hẹn dưới vòm cẩm tú cầu' },
    { time: '18:00', title: 'Tiệc tối', detail: 'Bữa tối thân mật cùng gia đình và bạn bè' },
    { time: '20:00', title: 'Garden dance', detail: 'Âm nhạc và những khoảnh khắc cuối ngày' },
  ],
  dressCode: {
    title: 'Soft garden palette',
    message: 'Một nét sage, kem hoặc pastel trong trang phục sẽ hòa cùng khu vườn của chúng mình.',
    colors: ['#74846c', '#aab69c', '#d8dfcf', '#e5e8dc', '#fffdf7'],
  },
  faq: [
    {
      question: 'Mình nên đến lúc nào?',
      answer: 'Bạn có thể đến từ 16:00 để dùng trà và chụp ảnh trước nghi lễ.',
    },
    {
      question: 'Tiệc có ở ngoài trời không?',
      answer: 'Nghi lễ ở vườn; khu tiệc có mái kính và phương án dự phòng khi trời mưa.',
    },
    {
      question: 'Có chỗ đậu xe không?',
      answer: 'Có bãi xe ngay cổng chính và nhân viên hướng dẫn tại lối vào.',
    },
  ],
  guestbook: [
    {
      author: 'Gia đình Thu Hà',
      message: 'Chúc hai con luôn dịu dàng với nhau như khu vườn trong ngày hôm nay.',
    },
    {
      author: 'Nhóm Nhà Xanh',
      message: 'Mong hành trình mới của hai bạn luôn đầy nắng, tiếng cười và những mùa hoa.',
    },
  ],
  footer: {
    message: 'Cảm ơn bạn đã cùng chúng mình làm nên một ngày xanh thật đẹp.',
    signature: 'An Nhiên & Minh Khang',
  },
}
export const greenHydrangeaSections: GreenHydrangeaSectionConfig = {
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
