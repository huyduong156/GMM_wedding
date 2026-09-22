import type { AureliaCourtData, AureliaCourtSectionConfig } from './AureliaCourtTypes'

const artwork = '/assets/images/templates/aurelia-court/artwork'

export const aureliaCourtFixture: AureliaCourtData = {
  couple: { brideName: 'An Nhiên', groomName: 'Gia Huy' },
  event: { weddingDate: '18 · 10 · 2026', time: '17:30', venueName: 'Maison de Lumière', venueAddress: '88 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', mapUrl: 'https://maps.google.com', calendarUrl: 'https://calendar.google.com' },
  opening: { eyebrow: 'The wedding invitation', title: 'Một lời mời trang trọng', message: 'Chạm nhẹ để mở tấm thiệp của chúng mình.' },
  cover: { eyebrow: 'Trân trọng kính mời', title: 'Lễ thành hôn', message: 'Trân trọng kính mời bạn đến chung vui cùng chúng mình.', heroMedia: null },
  invitation: { message: 'Sự hiện diện của {guestName} là niềm vinh hạnh lớn đối với gia đình chúng mình trong ngày nên duyên.' },
  families: { title: 'Hai gia đình trân trọng báo tin', subtitle: 'Lễ thành hôn của các con chúng tôi', message: 'Kính mời quý khách cùng chứng kiến khoảnh khắc thiêng liêng của hai gia đình.', brideSide: { label: 'Nhà gái', father: 'Trần Minh Quang', mother: 'Lê Thanh Hà', address: 'Quận 3 · TP. Hồ Chí Minh' }, groomSide: { label: 'Nhà trai', father: 'Nguyễn Quốc Bảo', mother: 'Phạm Thu Vân', address: 'Thủ Đức · TP. Hồ Chí Minh' } },
  eventDetails: { title: 'Lễ thành hôn được cử hành tại tư gia', message: 'Vào lúc 08:00', brideTitle: 'Trưởng nữ', groomTitle: 'Thứ nam' },
  countdown: { enabled: true },
  timeline: { title: 'Lịch trình trong ngày', message: 'Hẹn bạn đi qua từng nghi thức của ngày đặc biệt.', items: [{ time: '16:30', title: 'Đón khách', detail: 'Đón tiếp và lưu giữ những lời chào đầu tiên.' }, { time: '17:30', title: 'Lễ thành hôn', detail: 'Nghi thức thành hôn của hai chúng mình.' }, { time: '18:30', title: 'Tiệc thân mật', detail: 'Cùng nâng ly chúc phúc cho một hành trình mới.' }] },
  venue: { title: 'Địa điểm hôn lễ', name: 'Maison de Lumière', address: '88 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', message: 'Hẹn gặp bạn trong không gian ấm áp của ngày vui.', mapUrl: 'https://maps.google.com', calendarUrl: 'https://calendar.google.com' },
  activities: { title: 'Những điều nhỏ trong ngày vui', message: 'Một vài trải nghiệm thân mật đang chờ được cùng bạn chia sẻ.', items: [{ title: 'Bong bóng cho bé', image: { src: `${artwork}/ac-activity-balloons-v1.png`, alt: 'Góc bong bóng cho bé' } }, { title: 'Phát kẹo cưới', image: { src: `${artwork}/ac-activity-candy-favors-v1.png`, alt: 'Góc phát kẹo cưới' } }, { title: 'Photobooth', image: { src: `${artwork}/ac-activity-photobooth-v1.png`, alt: 'Góc photobooth trong tiệc cưới' } }] },
  gallery: { title: 'Album của đôi mình', message: 'Những khung hình nhỏ, được đặt giữa một ngày thật lớn.', images: [{ src: `${artwork}/ac-gallery-couple-v1.png`, alt: 'Cô dâu chú rể trong khu vườn hoa' }, { src: `${artwork}/ac-gallery-table-v1.png`, alt: 'Bàn tiệc cưới với hoa và ánh nến' }, { src: `${artwork}/ac-gallery-toast-v1.png`, alt: 'Những ly champagne cùng nâng chúc phúc' }] },
  rsvp: { title: 'Xác nhận tham dự', message: 'Vui lòng phản hồi để gia đình chuẩn bị đón tiếp bạn chu đáo.', deadline: '10 · 10 · 2026' },
  guestbook: { title: 'Gửi một lời chúc', message: 'Lời chúc của bạn sẽ là một phần thật đẹp trong ngày vui.' },
  gift: { title: 'Mừng cưới', message: 'Sự hiện diện của bạn đã là món quà ý nghĩa nhất.', thankYouMessage: 'Cảm ơn bạn đã gửi tình cảm đến gia đình.', qrMedia: null },
  music: { title: 'Nhạc nền', trackName: '', backgroundMusicUrl: '', backgroundMusicName: '', backgroundMusicAutoplay: false },
  footer: { title: 'Hẹn gặp bạn trong ngày vui', message: 'Trân trọng cảm ơn bạn đã mở tấm thiệp và gửi lời chúc đến chúng mình.', backgroundMedia: { src: `${artwork}/ac-footer-background-v1.png`, alt: 'Nền hoa champagne cho phần lời cảm ơn cuối thiệp' } },
}

export const aureliaCourtSectionConfig: AureliaCourtSectionConfig = {
  enabled: ['opening', 'cover', 'invitation', 'families', 'eventDetails', 'countdown', 'timeline', 'venue', 'activities', 'gallery', 'rsvp', 'guestbook', 'gift', 'music', 'footer'],
  order: ['opening', 'cover', 'families', 'eventDetails', 'invitation', 'venue', 'countdown', 'timeline', 'activities', 'gallery', 'rsvp', 'guestbook', 'gift', 'music', 'footer'],
}

export const aureliaCourtArtwork = {
  front: `${artwork}/ac-gatefold-front-v1.png`,
  inner: `${artwork}/ac-gatefold-inner-v1.png`,
  corner: `${artwork}/ac-ranunculus-botanical-cluster-v2.png`,
  coverCorner: `${artwork}/ac-ranunculus-corner-v1.png`,
  sprig: `${artwork}/ac-ranunculus-sprig-v1.png`,
  arch: `${artwork}/ac-ranunculus-gatefold-arch-v1.png`,
  cascade: `${artwork}/ac-family-botanical-cascade-v1.png`,
  crest: `${artwork}/ac-royal-crest-v1.png`,
  seal: `${artwork}/ac-wax-seal-v1.png`,
  border: `${artwork}/ac-embossed-border-v1.png`,
  divider: `${artwork}/ac-family-divider-v1.png`,
  royalBust: `${artwork}/ac-royal-marble-bust-v1.png`,
  royalBustMale: `${artwork}/ac-royal-marble-bust-male-v1.png`,
  royalMirror: `${artwork}/ac-ornate-gold-mirror-v1.png`,
  royalColumn: `${artwork}/ac-corinthian-column-v1.png`,
  royalPediment: `${artwork}/ac-royal-architectural-pediment-v1.png`,
  activityBalloons: `${artwork}/ac-activity-balloons-v1.png`,
  activityCandy: `${artwork}/ac-activity-candy-favors-v1.png`,
  activityPhotobooth: `${artwork}/ac-activity-photobooth-v1.png`,
  galleryCouple: `${artwork}/ac-gallery-couple-v1.png`,
  galleryTable: `${artwork}/ac-gallery-table-v1.png`,
  galleryToast: `${artwork}/ac-gallery-toast-v1.png`,
} as const
