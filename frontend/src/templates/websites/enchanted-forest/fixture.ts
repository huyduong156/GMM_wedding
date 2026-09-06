import type { EnchantedForestData, EnchantedForestSectionConfig } from './content'
const forest = '/assets/images/templates/enchanted-forest',
  hydrangea = '/assets/images/templates/green-hydrangea'
export const enchantedForestFixture: EnchantedForestData = {
  hero: {
    brideName: 'Linh Chi',
    groomName: 'Đức Anh',
    date: '06 · 11 · 2027',
    venue: 'The Ancient Grove',
    image: `${hydrangea}/couple-hero.png`,
  },
  announcement: {
    title: 'A vow beneath the canopy',
    message:
      'Giữa những tầng cây cổ thụ, mùi rêu sau mưa và vệt nắng xuyên qua tán lá, chúng mình chọn trao nhau lời hẹn về một hành trình dài. Không cần một sân khấu thật lớn — chỉ cần gia đình, những người thương và khu rừng cùng làm chứng.',
  },
  couple: {
    bride: {
      name: 'Linh Chi',
      bio: 'Chi yêu rừng sau mưa, những trang sách cũ và sự bình yên trong các điều giản dị. Với Chi, tình yêu là cảm giác được trở về, là một người vẫn lắng nghe cả những câu chuyện đã kể nhiều lần và cùng biến căn nhà nhỏ thành nơi đầy ánh sáng.',
      image: `${hydrangea}/bride-portrait.png`,
    },
    groom: {
      name: 'Đức Anh',
      bio: 'Anh tin tình yêu đẹp nhất khi hai người cùng lớn lên, như hai nhánh cây tìm thấy ánh sáng mà không che khuất nhau. Anh thích những chuyến đi không lên kế hoạch, bữa tối nấu chậm và khoảnh khắc Chi cười trước mọi điều rất đỗi bình thường.',
      image: `${hydrangea}/groom-portrait.png`,
    },
  },
  story: [
    {
      year: '2021',
      title: 'Chạm nhau giữa mùa xanh',
      body: 'Một chuyến đi ngắn qua rừng thông đã mở ra câu chuyện dài hơn mọi dự định. Buổi chiều ấy có mưa, hai người trú dưới một mái hiên gỗ, chia nhau ly cà phê nóng và nhận ra cuộc trò chuyện chẳng muốn dừng lại.',
      image: `${forest}/forest-hero.png`,
    },
    {
      year: '2024',
      title: 'Những ngày vun trồng',
      body: 'Từ căn bếp nhỏ đến những cung đường xa, chúng mình học cách cùng nhau tạo nên một mái nhà. Có những mùa rất vui, cũng có lúc chông chênh, nhưng sau mỗi ngày vẫn là lời hỏi quen thuộc: hôm nay của mình thế nào?',
      image: `${hydrangea}/couple-hero.png`,
    },
    {
      year: '2027',
      title: 'Lời hẹn dưới cổ thụ',
      body: 'Ngày hôm nay, dưới tán rừng đã đi qua nhiều thế hệ, chúng mình bắt đầu chương mới. Một lời hứa không phải về những ngày hoàn hảo, mà về việc luôn nắm tay nhau đi qua mọi mùa của cuộc đời.',
      image: `${forest}/forest-hero.png`,
    },
  ],
  events: [
    {
      date: '06.11.2027',
      time: '16:00',
      title: 'Forest ceremony',
      venue: 'The Ancient Grove',
      address: 'Khu rừng Ánh Sáng, Đà Lạt',
    },
    {
      date: '06.11.2027',
      time: '18:30',
      title: 'Woodland dinner',
      venue: 'Moss Garden Hall',
      address: 'Bên hồ Rêu Xanh, The Ancient Grove',
    },
  ],
  gallery: [
    { src: `${hydrangea}/bride-portrait.png`, alt: 'Linh Chi trong khu vườn trước giờ làm lễ' },
    { src: `${forest}/forest-hero.png`, alt: 'Khu rừng cổ thụ đón ánh nắng cuối ngày' },
    { src: `${hydrangea}/couple-hero.png`, alt: 'Một khoảnh khắc bình yên của hai chúng mình' },
    { src: `${hydrangea}/groom-portrait.png`, alt: 'Đức Anh giữa lối đi phủ đầy màu xanh' },
    { src: `${hydrangea}/couple-hero.png`, alt: 'Cùng nhau bước vào chương mới' },
    { src: `${forest}/forest-hero.png`, alt: 'Nơi lời hẹn sẽ vang lên dưới tán rừng' },
  ],
  schedule: [
    {
      time: '15:30',
      title: 'Welcome tea',
      detail: 'Đón nhau bằng trà thảo mộc, bánh nhỏ và một vòng dạo bước chậm trong rừng.',
    },
    {
      time: '16:00',
      title: 'Nghi lễ',
      detail: 'Gia đình cùng chứng kiến khoảnh khắc trao nhẫn và lời thề dưới cây cổ thụ.',
    },
    {
      time: '17:15',
      title: 'Golden-hour portraits',
      detail: 'Khách dùng canapé, trò chuyện và chụp ảnh khi nắng cuối ngày xuyên qua tán lá.',
    },
    {
      time: '18:30',
      title: 'Tiệc tối',
      detail: 'Bữa tối theo mùa dưới ánh nến, cùng những lời phát biểu từ gia đình và bạn bè.',
    },
    {
      time: '20:30',
      title: 'Forest afterglow',
      detail: 'Âm nhạc, champagne và điệu nhảy đầu tiên bên mặt hồ phủ sương.',
    },
  ],
  dressCode: {
    title: 'Forest formal',
    message: 'Forest green, moss, olive, nâu gỗ và ivory sẽ hòa cùng cảnh sắc của buổi lễ.',
    colors: ['#18372d', '#355443', '#71805a', '#9a896b', '#f3efe3'],
  },
  faq: [
    {
      question: 'Buổi lễ có ở ngoài trời?',
      answer:
        'Nghi lễ diễn ra dưới tán rừng; khu tiệc có mái kính và phương án mưa. Chúng mình sẽ cập nhật thời tiết và phương án cuối cùng trước ngày cưới 48 giờ.',
    },
    {
      question: 'Nên chọn giày thế nào?',
      answer:
        'Lối đi chính đã được lát phẳng, nhưng giày đế vuông, đế thấp hoặc giày loafer sẽ thoải mái hơn khi di chuyển trên lối rêu và bãi cỏ.',
    },
    {
      question: 'Có xe đưa đón không?',
      answer:
        'Xe đón khách khởi hành từ trung tâm Đà Lạt lúc 14:45 và quay về lúc 22:30. Vui lòng ghi nhu cầu xe trong phần xác nhận tham dự.',
    },
    {
      question: 'Trẻ em có thể tham dự?',
      answer:
        'Các bạn nhỏ luôn được chào đón. Khu tiệc có một góc hoạt động yên tĩnh và ghế ăn riêng; bạn hãy cho chúng mình biết độ tuổi của bé khi RSVP.',
    },
    {
      question: 'Có cần mang theo áo khoác?',
      answer:
        'Nhiệt độ trong rừng có thể xuống thấp sau 19:00. Một chiếc áo khoác mỏng màu trung tính sẽ phù hợp với dress code và giúp bạn thoải mái suốt buổi tối.',
    },
  ],
  guestbook: [
    {
      author: 'Gia đình Minh Hà',
      message: 'Chúc hai con bền bỉ như rễ cây và luôn tìm thấy ánh sáng trong nhau.',
    },
    {
      author: 'Nhóm Wander',
      message: 'Mong cuộc đời phía trước của hai bạn luôn xanh, sâu và đầy điều kỳ diệu.',
    },
  ],
  footer: {
    message: 'Cảm ơn bạn đã bước vào khu rừng và ở lại trong ngày đặc biệt này.',
    signature: 'Linh Chi & Đức Anh',
  },
}
export const enchantedForestSections: EnchantedForestSectionConfig = {
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
