import type { TheWeddingRollRecapContent } from './content'

const image = (src: string, alt: string) => ({ src, alt })

const cover = image(
  '/assets/images/wedding-couples-examples/couple-002/couple-pose-03-walking.webp',
  'Cặp đôi trong ngày cưới dưới nắng chiều',
)
const storyPhoto = image(
  '/assets/images/wedding-couples-examples/couple-002/couple-pose-08-backlit-profile.webp',
  'Khoảnh khắc thân mật của đôi uyên ương',
)
const chapterPhotos = [
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-01-studio-standing.webp',
    'Chuẩn bị trước lễ cưới',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-09-kneeling-hand.webp',
    'Nghi thức trao lời hẹn ước',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-10-back-view.webp',
    'Tiệc cưới buổi tối',
  ),
]
const momentPhotos = [
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-05-seated-groom-front.webp',
    'Bức ảnh cùng gia đình',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-06-groom-seated.webp',
    'Bạn bè cùng nâng ly',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-07-overhead.webp',
    'Niềm vui trong tiệc cưới',
  ),
]
/** The original standalone concept copy and demo imagery, now mapped to recap content fields. */
export const theWeddingRollRecapFixture: TheWeddingRollRecapContent = {
  hero: {
    couple: 'Minh Anh & Gia Bảo',
    date: '18.10.2026',
    issueLabel: 'MỘT NGÀY ĐÁNG NHỚ · SỐ 01',
    titleLines: ['Ngày mình', 'chọn nhau', 'trọn đời.'],
    emphasisLine: 1,
    tagline:
      'Một ngày có thể trôi qua thật nhanh. Nhưng lời hẹn ước, những cái ôm và nụ cười của mọi người sẽ còn ở lại thật lâu.',
    ctaLabel: 'Mở & tải ảnh',
    secondaryCtaLabel: 'Lật từng trang',
    cover,
    frameNote: 'Những người mình thương · ngày cưới',
    stampLabel: 'MỘT NGÀY',
    stampCount: '01',
    stampCaption: 'ĐÁNG NHỚ',
  },
  ourStory: {
    eyebrow: '00 — Lời dẫn',
    quote: '“Chúng mình đã có một ngày thật vui và trọn vẹn, nhờ có mọi người ở bên.”',
    body: 'Từ những khoảnh khắc gần gũi bên gia đình, những lời chúc chân thành của bạn bè đến sự giúp đỡ lặng lẽ trong suốt ngày cưới, tất cả đã làm nên một ngày mà chúng mình sẽ luôn trân trọng. Cảm ơn mọi người đã cùng chia sẻ niềm vui và dành cho chúng mình thật nhiều yêu thương.',
    media: storyPhoto,
    mediaLabel: 'TRƯỚC LỜI HẸN ƯỚC · 06',
  },
  tickerItems: [
    'một ngày thật dài',
    'những người mình thương',
    'tiếng cười còn đây',
    'vẫn còn nguyên ở đây',
    'điều đáng nhớ nhất',
  ],
  chaptersIntro: {
    eyebrow: '01 — Dòng thời gian',
    title: 'Chúng mình vẫn nhớ ngày hôm ấy.',
    description: 'Từ lúc chuẩn bị, đến buổi lễ và bữa tiệc bên mọi người — khoảnh khắc nào chúng mình cũng nhớ.',
  },
  chapters: [
    {
      id: 'before-the-ceremony',
      dateLabel: '01 / 09:12',
      title: 'Trước giờ G',
      description: 'Chúng mình hồi hộp thấy rõ, nhưng có gia đình bên cạnh nên cũng yên tâm hơn nhiều.',
      gallery: [chapterPhotos[0]],
    },
    {
      id: 'the-vow',
      dateLabel: '02 / 15:30',
      title: 'Đến giờ làm lễ',
      description: 'Chúng mình trao nhau lời đồng ý trước gia đình và bạn bè. Vừa run, vừa vui không tả được.',
      gallery: [chapterPhotos[1]],
    },
    {
      id: 'the-evening',
      dateLabel: '03 / 18:45',
      title: 'Vào tiệc thôi',
      description: 'Được gặp mọi người, nghe lời chúc và cùng cười vui — đây là phần chúng mình mong nhất.',
      gallery: [chapterPhotos[2]],
    },
  ],
  momentsIntro: {
    eyebrow: '02 — Bộ sưu tập khoảnh khắc',
    title: 'Những khoảnh khắc đáng nhớ',
    description: 'Ảnh gia đình, hội bạn rồi đến lúc nhập tiệc — xem thử bạn góp mặt ở đâu nha!',
  },
  moments: [
    {
      id: 'family',
      title: 'Cùng gia đình',
      momentLabel: 'FAMILY TIME',
      description: 'Một tấm ảnh đủ mặt những người thân trong ngày vui.',
      cover: momentPhotos[0],
    },
    {
      id: 'friends',
      title: 'Hội bạn thân',
      momentLabel: 'TEAM BẠN THÂN',
      description: 'Lên hình cùng hội bạn, lưu lại nguyên team hôm đó.',
      cover: momentPhotos[1],
    },
    {
      id: 'wedding-party',
      title: 'Tiệc cưới lên đèn',
      momentLabel: "LET'S PARTY",
      description: 'Nhạc lên là cả hội cùng nhập tiệc và vui hết mình.',
      cover: momentPhotos[2],
    },
  ],
  photoDelivery: {
    eyebrow: '03 — Album ảnh ngày cưới',
    title: 'Xem và tải ảnh ngày cưới',
    body: 'Chọn nút bên dưới để xem ảnh nổi bật hoặc mở album đầy đủ.',
    marker: 'ALBUM 01',
    albums: [],
    featuredPhotos: momentPhotos,
    externalAlbumUrl: '',
  },
  thankYou: {
    eyebrow: 'Cảm ơn · 18.10.2026',
    title: 'Cảm ơn vì đã cùng chúng mình tạo nên ngày hôm ấy.',
    body: 'Ngày hôm đó đẹp hơn vì có bạn.',
    signature: 'M & B',
    date: 'Minh Anh & Gia Bảo · 18.10.2026',
    footerNote: 'Được giữ lại bằng thương mến',
  },
  optional: {
    peopleBehindTheDay: {
      enabled: true,
      title: 'Ngày vui ấy trọn vẹn vì có mọi người.',
      intro:
        'Chúng mình đã có một ngày thật vui. Nhìn lại những tấm hình này, chúng mình nhớ đến gia đình, bạn bè và ekip — những người đã ở bên, giúp đỡ và cùng làm nên từng khoảnh khắc. Cảm ơn mọi người đã cùng chúng mình làm nên ngày hôm ấy.',
      groups: [
        {
          id: 'family',
          title: 'Gia đình',
          caption:
            'Từng việc nhỏ được lo chu toàn, để chúng mình chỉ cần vui hết mình trong ngày ấy.',
          photos: [momentPhotos[0]],
        },
        {
          id: 'behind-the-scenes',
          title: 'Hậu trường',
          caption:
            'Có người đến từ sớm, chuẩn bị từng góc nhỏ trước khi buổi tiệc bắt đầu.',
          photos: [momentPhotos[1]],
        },
        {
          id: 'friends',
          title: 'Bạn bè',
          caption:
            'Cảm ơn hội bạn đã ở bên từ những ngày đầu và mang theo thật nhiều năng lượng vui.',
          photos: [momentPhotos[2]],
        },
        {
          id: 'crew',
          title: 'Ekip',
          caption:
            'Từ ánh sáng, âm thanh đến từng khung hình, mọi người đã giúp chúng mình tận hưởng trọn vẹn ngày vui.',
          photos: [chapterPhotos[0]],
        },
      ],
    },
    soundtrack: {
      enabled: true,
      eyebrow: 'GIAI ĐIỆU NGÀY HÔM ẤY',
      title: 'Bài hát của ngày vui',
      intro:
        'Chỉ cần nghe lại giai điệu này, chúng mình như được trở về ngày vui có mọi người ở bên.',
    },
    behindTheScenes: {
      enabled: true,
      eyebrow: '03 / Hậu trường',
      title: 'Behind the scenes',
      intro: 'Những khoảnh khắc tự nhiên nhất lại giống tụi mình nhất.',
      items: [],
    },
    guestbook: {
      enabled: true,
      eyebrow: '05 — Lời mọi người gửi lại',
      title: 'Đọc lại mà vẫn thấy vui.',
      intro: 'Năm lời nhắn từ những người đã làm ngày vui của chúng mình thêm trọn vẹn.',
      wishes: [
        {
          id: 'wish-demo-thu-ha',
          author: 'Thu Hà · Bạn cô dâu',
          message: 'Chúc hai bạn lúc nào cũng tìm được niềm vui trong những điều nhỏ xíu mỗi ngày.',
        },
        {
          id: 'wish-demo-minh-khang',
          author: 'Minh Khang · Bạn chú rể',
          message: 'Hôm đó vui quá, về nhà mới nhận ra mình chụp gần hai trăm tấm. Chúc hai bạn cứ vui như vậy hoài nha.',
        },
        {
          id: 'wish-demo-co-lan',
          author: 'Cô Lan · Mẹ cô dâu',
          message: 'Cảm ơn hai con đã cho cả nhà một ngày thật nhiều tiếng cười. Chúc hai con luôn thương và nhường nhau.',
        },
        {
          id: 'wish-demo-quoc-bao',
          author: 'Quốc Bảo · Anh họ',
          message: 'Chúc gia đình nhỏ của hai đứa lúc nào cũng đông vui, có chuyện gì cũng cùng nhau giải quyết.',
        },
        {
          id: 'wish-demo-phuong-thao',
          author: 'Phương Thảo · Ekip chụp ảnh',
          message: 'Cảm ơn hai bạn đã luôn cười thật tươi trước ống kính. Chúc hành trình phía trước có thêm thật nhiều khoảnh khắc đẹp.',
        },
      ],
    },
    memoryCapsule: {
      enabled: true,
      eyebrow: '06 — Mở vào một ngày khác',
      title: 'Gửi hai đứa của mai sau',
      message:
        '“Mong là tụi mình vẫn nhớ cảm giác của ngày hôm nay — không phải vì mọi thứ hoàn hảo, mà vì đã có thật nhiều người ở đây cùng mình.”',
    },
  },
}
