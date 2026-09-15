import type { RoseGardenData, RoseGardenSectionConfig } from './RoseGardenTypes'

const demoCoupleMedia = {
  hero: {
    src: '/assets/images/templates/red-spider-lily/demo/asian-couple-arch.jpg',
    alt: 'Ảnh demo cặp đôi dưới vòm hoa',
    mediaAssetId: 'demo-couple-arch',
    role: 'hero',
  },
  portrait: {
    src: '/assets/images/templates/red-spider-lily/demo/asian-couple-portrait.jpg',
    alt: 'Ảnh demo chân dung cặp đôi',
    mediaAssetId: 'demo-couple-portrait',
    role: 'invitation-memory',
  },
  gardenWalk: {
    src: '/assets/images/templates/cherry-blossom-garden/couple-garden-walk.png',
    alt: 'Ảnh demo cặp đôi dạo trong vườn',
    mediaAssetId: 'demo-couple-garden-walk',
    role: 'invitation-memory',
  },
  moonGate: {
    src: '/assets/images/templates/cherry-blossom-garden/couple-moon-gate.png',
    alt: 'Ảnh demo cặp đôi bên cổng vườn',
    mediaAssetId: 'demo-couple-moon-gate',
    role: 'invitation-memory',
  },
} as const

export const roseGardenFixture: RoseGardenData = {
  couple: {
    brideName: 'Mai Anh',
    groomName: 'Minh Khang',
  },
  event: {
    weddingDate: '18 · 10 · 2026',
    time: '17:30',
    venueName: 'The Rose Garden Hall',
    venueAddress: '12 Phan Đình Phùng, Ba Đình, Hà Nội',
    mapUrl: 'https://maps.google.com',
  },
  opening: {
    title: 'Một lời hẹn trong vườn hồng',
    message: 'Chạm nhẹ để mở tấm thiệp của chúng mình.',
  },
  openingMediaBack: null,
  openingMediaFront: null,
  cover: {
    eyebrow: 'Trân trọng kính mời',
    title: 'Ngày mình chung đôi',
    message: 'Một khu vườn nhỏ, một lời hẹn lớn và những người thương yêu nhất.',
  },
  heroMedia: demoCoupleMedia.hero,
  invitation: {
    title: 'Kính mời {guestName} đến chung vui',
    message:
      'Sự hiện diện của {guestName} là niềm vui quý giá, để chúng mình được cùng nhau ghi nhớ ngày bắt đầu một chặng đường mới.',
  },
  invitationMemoryImage1: demoCoupleMedia.portrait,
  invitationMemoryImage2: demoCoupleMedia.gardenWalk,
  invitationMemoryImage3: demoCoupleMedia.moonGate,
  families: {
    title: 'Hai gia đình trân trọng báo tin',
    subtitle: 'Lễ thành hôn của các con chúng tôi',
    message: 'Kính mời {guestName} đến chung vui và chứng kiến khoảnh khắc hai gia đình kết duyên.',
    brideSide: {
      label: 'Nhà gái',
      fatherTitle: 'Ông',
      father: 'Nguyễn Văn Bình',
      motherTitle: 'Bà',
      mother: 'Trần Thu Hà',
      address: 'Ba Đình · Hà Nội',
    },
    groomSide: {
      label: 'Nhà trai',
      fatherTitle: 'Ông',
      father: 'Phạm Văn Minh',
      motherTitle: 'Bà',
      mother: 'Lê Ngọc Lan',
      address: 'Tây Hồ · Hà Nội',
    },
  },
  eventDetails: {
    title: 'Ngày vui của chúng mình',
    date: 'Chủ nhật · 18 tháng 10, 2026',
    items: [
      { time: '17:00', title: 'Đón khách' },
      { time: '17:30', title: 'Lễ thành hôn' },
      { time: '18:30', title: 'Khai tiệc' },
    ],
    message: 'Hẹn gặp bạn trong buổi chiều dịu dàng giữa khu vườn đầy hoa.',
    calendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Le%20thanh%20hon%20Mai%20Anh%20va%20Minh%20Khang',
  },
  eventDetailsMedia: null,
  countdown: { enabled: true },
  timeline: {
    items: [
      {
        time: '17:00',
        title: 'Đón khách',
        description: 'Trà hoa, một góc chụp ảnh và những lời chúc đầu tiên.',
        image: demoCoupleMedia.gardenWalk,
      },
      {
        time: '17:30',
        title: 'Lễ thành hôn',
        description: 'Cùng chứng kiến lời hẹn trăm năm của hai chúng mình.',
        image: demoCoupleMedia.portrait,
      },
      {
        time: '18:30',
        title: 'Tiệc thân mật',
        description: 'Nâng ly, dùng tiệc và ở lại thật lâu cùng gia đình.',
        image: demoCoupleMedia.moonGate,
      },
    ],
  },
  venue: {
    title: 'Hẹn bạn tại khu vườn',
    name: 'The Rose Garden Hall',
    address: '12 Phan Đình Phùng, Ba Đình, Hà Nội',
    mapUrl: 'https://maps.google.com',
    message: 'Một không gian ấm áp để chúng mình được đón tiếp những người thương.',
  },
  gallery: {
    title: 'Những mảnh vườn ký ức',
    message: 'Album ảnh sẽ được cập nhật từ những khoảnh khắc của hai chúng mình.',
  },
  galleryImages: [demoCoupleMedia.portrait, demoCoupleMedia.gardenWalk, demoCoupleMedia.moonGate],
  rsvp: {
    title: 'Bạn sẽ đến chung vui cùng chúng mình chứ?',
    message: 'Vui lòng phản hồi để gia đình chuẩn bị đón tiếp bạn chu đáo.',
    deadline: '10 · 10 · 2026',
    successMessage: 'Cảm ơn bạn đã gửi phản hồi cho chúng mình.',
    attendingLabel: 'Mình sẽ tham dự',
    notAttendingLabel: 'Mình chưa thể tham dự',
  },
  guestbook: {
    title: 'Gửi một lời chúc đến chúng mình',
    message: 'Lời chúc sẽ được lấy tự động từ danh sách lời chúc đã duyệt.',
    successMessage: 'Cảm ơn bạn đã gửi lời chúc.',
  },
  gift: {
    title: 'Mừng cưới',
    message: 'Tình cảm và sự hiện diện của bạn đã là món quà ý nghĩa nhất.',
    thankYouMessage: 'Cảm ơn bạn đã gửi tình cảm và lời chúc tốt đẹp cho chúng mình.',
  },
  giftQrMedia: null,
  music: {
    backgroundMusicUrl: '',
    backgroundMusicName: '',
    backgroundMusicAutoplay: false,
  },
  footer: {
    title: 'Hẹn gặp bạn trong ngày vui',
    message: 'Cảm ơn bạn đã mở tấm thiệp và trở thành một phần trong ngày đặc biệt của chúng mình.',
  },
  footerMedia: demoCoupleMedia.portrait,
}

export const roseGardenSectionConfig: RoseGardenSectionConfig = {
  enabled: [
    'opening',
    'cover',
    'invitation',
    'families',
    'eventDetails',
    'countdown',
    'timeline',
    'venue',
    'gallery',
    'rsvp',
    'guestbook',
    'gift',
    'music',
    'footer',
  ],
  order: [
    'opening',
    'cover',
    'invitation',
    'families',
    'eventDetails',
    'countdown',
    'timeline',
    'venue',
    'gallery',
    'rsvp',
    'guestbook',
    'gift',
    'music',
    'footer',
  ],
}
