import type { SunlitSilkData, SunlitSilkSectionConfig } from './SunlitSilkTypes'

const demoMedia = {
  portrait: {
    src: '/assets/images/templates/red-spider-lily/demo/asian-couple-portrait.jpg',
    alt: 'Ảnh chân dung cô dâu và chú rể',
    mediaAssetId: 'sunlit-silk-demo-portrait',
    role: 'gallery',
  },
  garden: {
    src: '/assets/images/templates/cherry-blossom-garden/couple-garden-walk.png',
    alt: 'Cô dâu và chú rể dạo trong vườn',
    mediaAssetId: 'sunlit-silk-demo-garden',
    role: 'gallery',
  },
  gate: {
    src: '/assets/images/templates/cherry-blossom-garden/couple-moon-gate.png',
    alt: 'Cô dâu và chú rể bên cổng vườn',
    mediaAssetId: 'sunlit-silk-demo-gate',
    role: 'gallery',
  },
} as const

export const sunlitSilkFixture: SunlitSilkData = {
  couple: {
    brideName: 'Thu Hà',
    brideRole: 'Trưởng nữ',
    brideMedia: {
      src: '/assets/images/templates/green-hydrangea/bride-portrait.png',
      alt: 'Ảnh demo cô dâu',
      mediaAssetId: 'sunlit-silk-demo-bride',
      role: 'cover-bride',
    },
    groomName: 'Minh An',
    groomRole: 'Trưởng nam',
    groomMedia: {
      src: '/assets/images/templates/green-hydrangea/groom-portrait.png',
      alt: 'Ảnh demo chú rể',
      mediaAssetId: 'sunlit-silk-demo-groom',
      role: 'cover-groom',
    },
  },
  event: {
    weddingDate: '16.01.2027',
    time: '09:00',
    venueName: 'The Coastal Garden',
    venueAddress: '12 Đường Biển Xanh, TP. Hồ Chí Minh',
    mapUrl: 'https://maps.google.com',
  },
  opening: {
    title: 'Nắng Trên Lụa',
    message: 'Thân Mời Quý Khách',
  },
  cover: {
    eyebrow: 'Lễ Thành Hôn',
    message: 'Một ngày dịu nắng. Hai gia đình. Một lời hẹn trăm năm.',
  },
  invitation: {
    title: 'Trân trọng kính mời {guestName}',
    message: 'Đến chung vui và chứng kiến khoảnh khắc chúng mình chính thức về chung một nhà.',
  },
  families: {
    title: 'Hai gia đình trân trọng báo tin',
    message:
      'Sự hiện diện của {guestName} là niềm vui quý giá trong ngày thành hôn của các con chúng tôi.',
    brideSide: {
      label: 'Nhà gái',
      fatherTitle: 'Ông',
      father: 'Nguyễn Văn Hải',
      motherTitle: 'Bà',
      mother: 'Trần Thu Lan',
      address: 'Quận 3, TP. Hồ Chí Minh',
    },
    groomSide: {
      label: 'Nhà trai',
      fatherTitle: 'Ông',
      father: 'Lê Minh Quang',
      motherTitle: 'Bà',
      mother: 'Phạm Ngọc Mai',
      address: 'Thủ Đức, TP. Hồ Chí Minh',
    },
  },
  eventDetails: {
    title: 'Ngày chúng mình thành đôi',
    ceremonyLabel: 'Lễ Thành Hôn',
    ceremonyTime: '09:00',
    receptionLabel: 'Tiệc Chung Vui',
    receptionTime: '11:00',
  },
  calendar: { month: 'Tháng Một', year: '2027', day: 16 },
  timeline: {
    title: 'Một buổi sáng bên nhau',
    message: 'Mỗi dấu mốc được may lại bằng một đường chỉ nhỏ trên nền lụa.',
    items: [
      {
        time: '08:30',
        title: 'Đón khách',
        description: 'Gặp nhau bên hiên nắng và lưu lại những khung hình đầu tiên.',
      },
      {
        time: '09:00',
        title: 'Lễ Thành Hôn',
        description: 'Hai gia đình cùng chứng kiến lời hẹn trăm năm.',
      },
      {
        time: '11:00',
        title: 'Khai tiệc',
        description: 'Nâng ly và cùng nhau tận hưởng buổi trưa thân mật.',
      },
    ],
  },
  venue: {
    title: 'Nơi chúng mình đón bạn',
    name: 'The Coastal Garden',
    address: '12 Đường Biển Xanh, TP. Hồ Chí Minh',
    mapUrl: 'https://maps.google.com',
    message: 'Một khu vườn gần biển, nơi nắng sớm đi qua những tấm rèm linen.',
  },
  activities: {
    title: 'Dành một khoảng vui cho bạn',
    items: [
      { title: 'Góc ảnh dưới nắng' },
      { title: 'Bàn viết lời chúc' },
      { title: 'Tiệc trà bên hiên' },
    ],
  },
  gallery: {
    title: 'Chúng mình trong những ngày đầy nắng',
    message: 'Ba lát cắt nhỏ trước khi hành trình mới bắt đầu.',
  },
  galleryImages: [demoMedia.portrait, demoMedia.garden, demoMedia.gate],
  rsvp: {
    title: 'Bạn sẽ đến chung vui chứ?',
    message: 'Một lời hồi đáp giúp hai gia đình chuẩn bị đón bạn chu đáo hơn.',
    deadline: '05.01.2027',
    successMessage: 'Cảm ơn bạn. Phản hồi đã được gửi đến hai gia đình.',
    attendingLabel: 'Mình sẽ tham dự',
    notAttendingLabel: 'Mình chưa thể tham dự',
  },
  guestbook: {
    title: 'Gửi chúng mình một lời chúc',
    message: 'Mỗi lời nhắn sẽ được giữ lại như một mảnh giấy nhỏ trong hộp kỷ niệm.',
    successMessage: 'Cảm ơn bạn đã gửi một lời chúc thật đẹp.',
  },
  gift: {
    title: 'Gửi lời chúc từ xa',
    message: 'Tình cảm và sự hiện diện của bạn đã là món quà quý giá.',
    thankYouMessage: 'Cảm ơn bạn đã dành tình cảm cho ngày vui của chúng mình.',
  },
  music: { backgroundMusicUrl: '', backgroundMusicName: '', backgroundMusicAutoplay: false },
  footer: {
    title: 'Hẹn gặp bạn trong ngày vui',
    message: 'Thu Hà và Minh An chân thành cảm ơn bạn đã mở tấm thiệp này.',
  },
}

export const sunlitSilkSectionConfig: SunlitSilkSectionConfig = {
  enabled: [
    'opening',
    'cover',
    'invitation',
    'families',
    'eventDetails',
    'countdown',
    'calendar',
    'timeline',
    'venue',
    'activities',
    'gallery',
    'rsvp',
    'guestbook',
    'footer',
  ],
  order: [
    'opening',
    'cover',
    'invitation',
    'families',
    'eventDetails',
    'countdown',
    'calendar',
    'timeline',
    'venue',
    'activities',
    'gallery',
    'rsvp',
    'guestbook',
    'gift',
    'music',
    'footer',
  ],
}
