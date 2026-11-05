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
const filmStripPhotos = [
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-01-studio-standing.webp',
    '',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-02-back-to-back.webp',
    '',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-03-walking.webp',
    '',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-04-opposed-cubes.webp',
    '',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-05-seated-groom-front.webp',
    '',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-06-groom-seated.webp',
    '',
  ),
  image(
    '/assets/images/wedding-couples-examples/couple-002/couple-pose-08-backlit-profile.webp',
    '',
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
      title: 'Nhà mình',
      momentLabel: 'CÙNG GIA ĐÌNH',
      description: 'Những cái ôm chặt hơn mọi lời chúc.',
      cover: momentPhotos[0],
    },
    {
      id: 'friends',
      title: 'Hội bạn thân',
      momentLabel: 'CÙNG BẠN THÂN',
      description: 'Người đã biết tụi mình từ trước cả khi tụi mình biết nhau.',
      cover: momentPhotos[1],
    },
    {
      id: 'end-of-night',
      title: 'Đến tận cuối đêm',
      momentLabel: 'CUỐI BUỔI TIỆC',
      description: 'Vẫn còn một bài nữa mà. Ở lại thêm chút nhé.',
      cover: momentPhotos[2],
    },
  ],
  filmStrip: filmStripPhotos,
  photoDelivery: {
    eyebrow: '03 — Album ảnh ngày cưới',
    title: 'Những tấm còn lại đang chờ bạn.',
    body: 'Tụi mình đã chọn những bức ảnh của ngày hôm ấy vào một album riêng. Nếu bạn có mặt hôm ấy, mong bạn sẽ tìm thấy mình và những người thân quen trong đó.',
    ctaLabel: 'Mở album ảnh',
    marker: 'ALBUM 01',
    albums: [],
  },
  optionalIndex: {
    eyebrow: 'Những trang có thể thêm',
    title: 'Những điều còn thương.',
    body: 'Thêm vài lời nhắn, giai điệu yêu thích và những người đã làm nên ngày hôm ấy.',
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
      eyebrow: '01 / Những người thân thương',
      title: 'People behind the day',
      intro: 'Gia đình, bạn bè và ekip đã góp phần làm nên ngày hôm đó.',
      people: [],
    },
    soundtrack: {
      enabled: true,
      eyebrow: '02 / Giai điệu',
      title: 'Soundtrack',
      intro: 'Ca khúc vẫn làm tụi mình nhớ ngay đến buổi tối ấy.',
    },
    behindTheScenes: {
      enabled: true,
      eyebrow: '03 / Hậu trường',
      title: 'Behind the scenes',
      intro: 'Những khoảnh khắc tự nhiên nhất lại giống tụi mình nhất.',
      items: [],
    },
    weddingFilm: {
      enabled: true,
      eyebrow: '04 — Ngày ấy qua những chuyển động',
      title: 'Những điều vẫn còn chuyển động.',
      body: 'Tiếng nhạc, lời chúc và những cái nắm tay làm ngày hôm ấy sống động theo một cách rất riêng. Bấm play để cùng xem lại nhé.',
      poster: image(
        '/assets/images/wedding-couples-examples/couple-002/couple-pose-08-backlit-profile.webp',
        'Khoảnh khắc trong lễ cưới',
      ),
      playLabel: 'PLAY THE MEMORY',
      linkLabel: 'Xem video ngày cưới ↗',
    },
    guestbook: {
      enabled: true,
      eyebrow: '05 — Lời mọi người gửi lại',
      title: 'Đọc lại mà vẫn thấy vui.',
      intro: 'Ba lời chúc tụi mình muốn giữ lại.',
      wishes: [
        {
          id: 'wish-one',
          author: '— MỘT NGƯỜI BẠN THÂN',
          message: '“Từ nay nhà mình có thêm một người về phe mình rồi.”',
        },
        {
          id: 'wish-two',
          author: '— GIA ĐÌNH',
          message: '“Chúc hai con ngày nào cũng có lý do để cùng cười.”',
        },
        {
          id: 'wish-three',
          author: '— HỘI BẠN',
          message: '“Giờ xem ảnh mới biết tối đó mình đã nhảy nhiều đến vậy.”',
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
