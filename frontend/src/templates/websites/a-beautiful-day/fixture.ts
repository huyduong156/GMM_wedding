import type { ABeautifulDayPreviewData, ABeautifulDaySectionConfig } from './content'

const neutralPhoto = '/assets/images/templates/modern-luxe/couple-portrait.jpg'
const detailPhoto = '/assets/images/templates/modern-luxe/wedding-detail.jpg'

export const aBeautifulDayFixture: ABeautifulDayPreviewData = {
  content: {
    seo: {
      title: 'Mai & An — A Beautiful Day',
      description: 'Câu chuyện và thông tin ngày cưới của Mai và An.',
      ogImageId: null,
    },
    hero: {
      eyebrow: 'MỘT NGÀY MÌNH CHỜ ĐỢI',
      brideName: 'Mai Anh',
      groomName: 'Quang An',
      headline: 'Ngày vui của chúng mình',
      primaryEventId: 'event-reception',
      heroMediaId: 'media-hero',
    },
    announcement: {
      title: 'Gửi những người thương',
      message:
        'Sau những ngày bình thường thật đẹp, chúng mình sẽ cùng bước sang một chương mới. Thật vui nếu ngày ấy có bạn ở bên.',
    },
    couple: {
      bride: {
        displayName: 'Mai Anh',
        biography: 'Yêu những buổi sáng chậm, những nhành hoa mới nở và căn nhà có tiếng cười.',
        portraitMediaId: 'media-bride',
        socialLinks: [],
      },
      groom: {
        displayName: 'Quang An',
        biography: 'Tin rằng hành trình đẹp nhất là hành trình được cùng nhau đi qua từng ngày.',
        portraitMediaId: 'media-groom',
        socialLinks: [],
      },
    },
    story: {
      title: 'Chuyện chúng mình',
      introduction: 'Một vài dấu mốc nhỏ đã đưa chúng mình đến ngày hôm nay.',
      milestones: [
        {
          id: 'story-first-meeting',
          date: '2020',
          title: 'Lần đầu gặp gỡ',
          body: 'Một cuộc trò chuyện tình cờ kéo dài hơn dự định và mở ra rất nhiều điều sau đó.',
          mediaId: 'media-story-one',
        },
        {
          id: 'story-home',
          date: '2023',
          title: 'Những ngày bình yên',
          body: 'Chúng mình học cách biến những điều giản dị thành một nơi để trở về.',
          mediaId: null,
        },
        {
          id: 'story-promise',
          date: '2026',
          title: 'Một lời hẹn dài lâu',
          body: 'Và rồi ngày hôm nay trở thành khởi đầu của hành trình tiếp theo.',
          mediaId: 'media-story-two',
        },
      ],
    },
    events: {
      title: 'Lịch trình ngày vui',
      eventIds: [{ eventId: 'event-ceremony' }, { eventId: 'event-reception' }],
      introduction: 'Chúng mình mong được đón bạn trong những khoảnh khắc này.',
    },
    countdown: { eventId: 'event-reception' },
    venues: {
      title: 'Hẹn gặp bạn tại đây',
      eventIds: [{ eventId: 'event-ceremony' }, { eventId: 'event-reception' }],
      travelNote: 'Nếu cần hỗ trợ đường đi, bạn có thể liên hệ với gia đình trong ngày cưới.',
    },
    gallery: {
      title: 'Những khoảnh khắc thân quen',
      introduction: 'Một vài khung hình trong hành trình của chúng mình.',
      mediaIds: ['media-hero', 'media-bride', 'media-story-one', 'media-groom'],
    },
    schedule: {
      title: 'Từng khoảnh khắc trong ngày',
      items: [
        { id: 'schedule-welcome', eventId: 'event-ceremony', time: '16:00', title: 'Đón khách', detail: 'Trà nhẹ và chụp hình cùng gia đình.' },
        { id: 'schedule-ceremony', eventId: 'event-ceremony', time: '16:30', title: 'Lễ thành hôn', detail: 'Nghi thức thân mật cùng người thân.' },
        { id: 'schedule-dinner', eventId: 'event-reception', time: '18:30', title: 'Khai tiệc', detail: 'Bữa tối và những câu chuyện thân tình.' },
      ],
    },
    weddingParty: {
      title: 'Những người đồng hành',
      groups: [
        {
          id: 'party-friends',
          title: 'Bạn thân',
          members: [
            { id: 'party-vy', name: 'Thảo Vy', role: 'Phù dâu', mediaId: null },
            { id: 'party-huy', name: 'Gia Huy', role: 'Phù rể', mediaId: null },
          ],
        },
      ],
    },
    dressCode: {
      title: 'Một chút sắc màu cho ngày vui',
      message: 'Tông màu kem, hồng phấn hoặc xanh lá dịu sẽ hòa cùng không khí buổi tiệc.',
      colors: [
        { id: 'dress-ivory', label: 'Kem', hex: '#E9DDCC' },
        { id: 'dress-blush', label: 'Hồng phấn', hex: '#D7AAA1' },
        { id: 'dress-sage', label: 'Xanh sage', hex: '#89907A' },
      ],
    },
    travel: {
      title: 'Gợi ý cho chuyến đi',
      items: [
        { id: 'travel-parking', type: 'PARKING', title: 'Đậu xe', detail: 'Có bãi giữ xe trong khuôn viên; nhân viên sẽ hướng dẫn tại cổng.' },
        { id: 'travel-taxi', type: 'TRANSPORT', title: 'Di chuyển', detail: 'Taxi và xe công nghệ có thể đón trả khách tại sảnh chính.' },
      ],
    },
    faq: {
      title: 'Bạn có thể đang thắc mắc',
      items: [
        { id: 'faq-arrival', question: 'Mình nên đến lúc nào?', answer: 'Bạn có thể đến trước giờ nghi lễ khoảng 30 phút để thong thả gặp gỡ mọi người.' },
        { id: 'faq-parking', question: 'Có chỗ đậu xe không?', answer: 'Có, bãi xe nằm cạnh sảnh tiệc và có nhân viên hướng dẫn.' },
      ],
    },
    rsvp: {
      title: 'Bạn sẽ đến chứ?',
      message: 'Hãy cho chúng mình biết bạn có thể cùng chung vui nhé.',
      deadline: '2026-12-10',
      eventIds: [{ eventId: 'event-ceremony' }, { eventId: 'event-reception' }],
    },
    guestbook: {
      title: 'Gửi chúng mình một lời chúc',
      message: 'Những lời thương của bạn sẽ ở lại cùng chúng mình.',
    },
    gift: { title: 'Mừng vui ngày cưới', message: 'Sự hiện diện của bạn đã là món quà quý nhất.', accounts: [] },
    footer: {
      message: 'Cảm ơn bạn đã cùng chúng mình tạo nên một ngày thật đẹp.',
      signature: 'Mai Anh & Quang An',
    },
    music: { musicTrackId: null, autoplay: false },
  },
  events: [
    {
      id: 'event-ceremony',
      name: 'Lễ thành hôn',
      startsAt: '2026-12-20T16:30:00+07:00',
      timezone: 'Asia/Ho_Chi_Minh',
      venueName: 'Nhà hàng An Viên',
      addressLine: '28 Đường Hoa Sứ, Quận 3, TP. Hồ Chí Minh',
      mapUrl: 'https://maps.google.com/?q=28+Duong+Hoa+Su+Quan+3',
      isPublic: true,
    },
    {
      id: 'event-reception',
      name: 'Tiệc cưới',
      startsAt: '2026-12-20T18:30:00+07:00',
      timezone: 'Asia/Ho_Chi_Minh',
      venueName: 'Nhà hàng An Viên',
      addressLine: '28 Đường Hoa Sứ, Quận 3, TP. Hồ Chí Minh',
      mapUrl: 'https://maps.google.com/?q=28+Duong+Hoa+Su+Quan+3',
      isPublic: true,
    },
  ],
  media: [
    { id: 'media-hero', publicUrl: neutralPhoto, status: 'READY', altText: 'Ảnh cưới của Mai Anh và Quang An' },
    { id: 'media-bride', publicUrl: detailPhoto, status: 'READY', altText: 'Chân dung cô dâu Mai Anh' },
    { id: 'media-groom', publicUrl: neutralPhoto, status: 'READY', altText: 'Chân dung chú rể Quang An' },
    { id: 'media-story-one', publicUrl: detailPhoto, status: 'READY', altText: 'Một khoảnh khắc trong hành trình của đôi bạn' },
    { id: 'media-story-two', publicUrl: neutralPhoto, status: 'READY', altText: 'Cặp đôi trong buổi chụp ảnh cưới' },
  ],
  approvedWishes: [],
  guestName: null,
}

export const aBeautifulDaySections: ABeautifulDaySectionConfig = {
  enabled: [
    'navigation', 'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues',
    'gallery', 'schedule', 'rsvp', 'guestbook', 'footer',
  ],
  order: [
    'navigation', 'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues',
    'gallery', 'schedule', 'weddingParty', 'dressCode', 'travel', 'faq', 'rsvp', 'guestbook', 'gift', 'footer',
  ],
}
