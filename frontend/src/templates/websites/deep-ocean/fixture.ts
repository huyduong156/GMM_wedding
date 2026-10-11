import type { DeepOceanData, DeepOceanSectionConfig } from './content'

const image = (src: string, alt: string, position = 'center') => ({ src, alt, position })
const couple = '/assets/images/templates/modern-luxe/couple-portrait.jpg'
const detail = '/assets/images/templates/modern-luxe/wedding-detail.jpg'
const venue = '/assets/images/login-wedding-luxury.jpg'

export const deepOceanFixture: DeepOceanData = {
  music: {
    backgroundMusicUrl: '',
    backgroundMusicName: '',
    backgroundMusicAutoplay: false,
  },
  hero: {
    brideName: 'Mai Anh',
    groomName: 'Hải Đăng',
    eyebrow: 'A WEDDING BY THE SEA',
    date: '18 · 04 · 2027',
    tagline: 'Our love runs deeper than the sea.',
    background: image(couple, 'Mai Anh và Hải Đăng trong ngày cưới', 'center 35%'),
  },
  story: {
    eyebrow: 'OUR STORY',
    title: 'Từ một cuộc gặp, đến một đời đồng hành.',
    body: 'Giữa rất nhiều người trên thế giới, chúng mình đã gặp nhau, ở lại và cùng viết nên một câu chuyện thật dịu dàng.',
    image: image(couple, 'Khoảnh khắc của Mai Anh và Hải Đăng', 'center'),
  },
  timeline: [
    { date: '2019', title: 'The first wave', body: 'Lần đầu chúng mình gặp nhau.' },
    { date: '2022', title: 'A shared horizon', body: 'Cùng nhau bắt đầu một hành trình mới.' },
    { date: '2026', title: 'The promise', body: 'Một lời hứa cho những ngày phía trước.' },
    { date: '2027', title: 'Our wedding day', body: 'Ngày chúng mình nói lời đồng ý.' },
  ],
  weddingDay: {
    eyebrow: 'THE WEDDING DAY',
    title: 'Hẹn gặp bạn bên bờ bình yên.',
    date: 'Thứ Bảy, 18 tháng 04, 2027',
    time: '16:30 — 20:30',
    venue: 'The Pearl House',
    address: 'Đà Nẵng, Việt Nam',
    background: image(venue, 'Không gian tiệc cưới', 'center 55%'),
  },
  gallery: [
    image(couple, 'Mai Anh và Hải Đăng', 'center 32%'),
    image(detail, 'Chi tiết ngày cưới', 'center'),
    image(venue, 'Không gian tiệc cưới', 'center'),
    image(couple, 'Khoảnh khắc bên nhau', 'center 65%'),
    image(detail, 'Kỷ niệm nhỏ', 'center'),
    image(venue, 'Ánh sáng trong ngày cưới', 'center 40%'),
  ],
  memories: {
    eyebrow: 'UNDERWATER MEMORIES',
    title: 'Những điều nhỏ bé làm nên một ngày thật lớn.',
    body: 'Một bó hoa, một ánh nhìn, một cái nắm tay. Có những ký ức không cần ồn ào vẫn ở lại rất lâu.',
    images: [image(detail, 'Bó hoa cưới', 'center'), image(couple, 'Nụ cười trong ngày cưới', 'center 42%')],
  },
  people: [
    { name: 'Gia đình hai bên', role: 'Những người luôn ở bên chúng mình', image: image(venue, 'Gia đình và người thân', 'center') },
    { name: 'Những người bạn thân', role: 'Những người làm ngày vui thêm đầy', image: image(couple, 'Bạn bè trong ngày cưới', 'center 58%') },
  ],
  film: {
    title: 'A day to remember',
    message: 'Một vài phút để trở về ngày chúng mình đã nói lời đồng ý.',
    poster: image(couple, 'Poster wedding film', 'center 35%'),
    videoUrl: '',
  },
  wishes: [
    { author: 'An & Minh', message: 'Chúc hai bạn luôn tìm thấy bình yên trong nhau.' },
    { author: 'Gia đình', message: 'Thương chúc hai con một đời cùng nhìn về một phía.' },
  ],
  capsule: {
    eyebrow: 'MEMORY CAPSULE',
    title: 'Still choosing you, through every tide.',
    message: 'Gửi chúng mình của những năm về sau: cảm ơn vì đã luôn chọn nhau, qua mọi mùa và mọi con sóng.',
  },
  footer: {
    message: 'Cảm ơn bạn đã ở lại trong câu chuyện của chúng mình.',
    signature: 'Mai Anh & Hải Đăng',
    background: image(venue, 'Ánh sáng cuối ngày', 'center 62%'),
  },
}

export const deepOceanSections: DeepOceanSectionConfig = {
  enabled: ['navigation', 'hero', 'story', 'timeline', 'weddingDay', 'gallery', 'memories', 'people', 'film', 'wishes', 'capsule', 'footer'],
  order: ['navigation', 'hero', 'story', 'timeline', 'weddingDay', 'gallery', 'memories', 'people', 'film', 'wishes', 'capsule', 'footer'],
}
