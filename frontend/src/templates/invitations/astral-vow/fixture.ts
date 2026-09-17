import type { AstralVowData, AstralVowSectionConfig } from './AstralVowTypes'

const demoCoupleMedia = {
  portrait: { src: '/assets/images/templates/red-spider-lily/demo/asian-couple-portrait.jpg', alt: 'Ảnh demo chân dung cặp đôi', mediaAssetId: 'astral-demo-couple-portrait', role: 'invitation-memory' },
  gardenWalk: { src: '/assets/images/templates/cherry-blossom-garden/couple-garden-walk.png', alt: 'Ảnh demo cặp đôi dạo trong vườn', mediaAssetId: 'astral-demo-couple-garden-walk', role: 'invitation-memory' },
  moonGate: { src: '/assets/images/templates/cherry-blossom-garden/couple-moon-gate.png', alt: 'Ảnh demo cặp đôi bên cổng vườn', mediaAssetId: 'astral-demo-couple-moon-gate', role: 'invitation-memory' },
} as const

export const astralVowFixture: AstralVowData = {
  couple: { brideName: 'An Nhiên', groomName: 'Gia Huy' },
  event: { weddingDate: '18 · 10 · 2026', time: '17:30', venueName: 'Stellarium Event Hall', venueAddress: '88 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', mapUrl: 'https://maps.google.com' },
  opening: { title: 'Một lời hẹn dưới dải ngân hà', message: 'Chạm nhẹ để mở lá thư của chúng mình.' }, openingMediaBack: null, openingMediaFront: null,
  cover: { eyebrow: 'Trân trọng kính mời', title: 'Gặp nhau dưới cùng một bầu trời', message: 'Khi hai vì sao chọn cùng một quỹ đạo.' }, heroMedia: null,
  invitation: { title: 'Kính mời {guestName} đến chung vui', message: 'Giữa muôn vàn vì tinh tú, sự hiện diện của {guestName} là ánh sáng quý giá trong ngày chúng mình nên duyên.' },
  invitationMemoryImage1: demoCoupleMedia.portrait, invitationMemoryImage2: demoCoupleMedia.gardenWalk, invitationMemoryImage3: demoCoupleMedia.moonGate,
  families: { title: 'Hai gia đình trân trọng báo tin', subtitle: 'Lễ thành hôn của các con chúng tôi', message: 'Kính mời {guestName} cùng chứng kiến khoảnh khắc hai quỹ đạo gặp nhau.', brideSide: { label: 'Nhà gái', fatherTitle: 'Ông', father: 'Trần Minh Quang', motherTitle: 'Bà', mother: 'Lê Thanh Hà', address: 'Quận 3 · TP. Hồ Chí Minh' }, groomSide: { label: 'Nhà trai', fatherTitle: 'Ông', father: 'Nguyễn Quốc Bảo', motherTitle: 'Bà', mother: 'Phạm Thu Vân', address: 'Thủ Đức · TP. Hồ Chí Minh' } },
  countdown: { enabled: true }, venue: { title: 'Đài quan sát của chúng mình', name: 'Stellarium Event Hall', address: '88 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', mapUrl: 'https://maps.google.com', message: 'Hẹn bạn tại nơi ánh đèn và những vì sao cùng lấp lánh.' }, timeline: { title: 'Lịch trình', message: 'Cùng chúng mình đi qua từng cột mốc của ngày đặc biệt.', items: [{ time: '17:00', title: 'Đón khách', description: 'Cùng nhau bắt đầu một đêm đầy sao.' }, { time: '17:30', title: 'Lễ thành hôn', description: 'Lời hẹn trăm năm dưới cùng một bầu trời.' }, { time: '18:30', title: 'Tiệc thân mật', description: 'Nâng ly và lưu giữ những điều dịu dàng.' }] },
  gallery: { title: 'Chòm sao ký ức', message: 'Những mảnh sáng nhỏ trên hành trình của chúng mình.' }, galleryImages: [demoCoupleMedia.portrait, demoCoupleMedia.gardenWalk, demoCoupleMedia.moonGate],
  rsvp: { title: 'Bạn sẽ đến chung vui chứ?', message: 'Vui lòng phản hồi để gia đình chuẩn bị đón tiếp bạn chu đáo.', deadline: '10 · 10 · 2026', successMessage: 'Cảm ơn bạn đã gửi phản hồi cho chúng mình.', attendingLabel: 'Mình sẽ tham dự', notAttendingLabel: 'Mình chưa thể tham dự' },
  guestbook: { title: 'Gửi một lời chúc đến chúng mình', message: 'Đôi lời của bạn sẽ trở thành một vì sao trong đêm đặc biệt này.', successMessage: 'Cảm ơn bạn đã gửi lời chúc.' },
  gift: { title: 'Mừng cưới', message: 'Tình cảm và sự hiện diện của bạn đã là món quà ý nghĩa nhất.', thankYouMessage: 'Cảm ơn bạn đã gửi tình cảm và lời chúc tốt đẹp.' }, giftQrMedia: null,
  music: { backgroundMusicUrl: '', backgroundMusicName: '', backgroundMusicAutoplay: false }, footer: { title: 'Hẹn gặp bạn dưới cùng một bầu trời', message: 'Cảm ơn bạn đã mở lá thư và trở thành một phần của đêm đặc biệt này.' }, footerMedia: demoCoupleMedia.moonGate,
}
export const astralVowSectionConfig: AstralVowSectionConfig = { enabled: ['opening', 'cover', 'invitation', 'families', 'countdown', 'timeline', 'venue', 'gallery', 'rsvp', 'guestbook', 'gift', 'music', 'footer'], order: ['opening', 'cover', 'invitation', 'families', 'countdown', 'timeline', 'venue', 'gallery', 'rsvp', 'guestbook', 'gift', 'music', 'footer'] }
