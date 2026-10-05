import {
  ArrowRight, CalendarCheck, Camera, CaretDown, CheckCircle, EnvelopeOpen, Gift,
  GlobeHemisphereWest, Heart, ListChecks, Question, UserPlus, UsersThree,
} from '@phosphor-icons/react'
import { marketingRoutes, studioRoutes } from '../../../shared/config/routes'
import { AppLink } from '../../../shared/lib/navigation/AppLink'
import { BrandLogo } from '../../../shared/ui/BrandLogo'
import './faq-page.css'

const features = [
  { icon: EnvelopeOpen, title: 'Thiệp cưới online', description: 'Tạo thiệp cưới trực tuyến để gửi lời mời đến từng vị khách, kèm đầy đủ thời gian, địa điểm và thông tin buổi tiệc.' },
  { icon: GlobeHemisphereWest, title: 'Website cưới', description: 'Một website tổng hợp thông báo về đám cưới để chia sẻ rộng rãi với mọi người, chẳng hạn đăng lên Facebook như một lời báo hỷ.' },
  { icon: UsersThree, title: 'Khách mời & RSVP', description: 'Sắp xếp danh sách khách và theo dõi ai sẽ tham dự mà không cần hỏi lại từng người.' },
  { icon: ListChecks, title: 'Todolist ngày cưới', description: 'Ghi lại những việc cần làm, thời hạn và tiến độ để hai bạn không bỏ sót đầu việc.' },
  { icon: Gift, title: 'Sổ tiền mừng', description: 'Lưu khoản mừng và ghi chú ngay trong Wedding, thuận tiện khi cần xem lại sau buổi tiệc.' },
  { icon: UserPlus, title: 'Cùng nhau quản lý', description: 'Mời người thân hoặc cộng sự vào Wedding để cùng cập nhật công việc và nội dung.' },
  { icon: Camera, title: 'Wedding Recap', description: 'Ghi lại những khoảnh khắc trong ngày cưới thành một trang kỷ niệm và chia sẻ hình ảnh với bạn bè, người thân.' },
  { icon: CalendarCheck, title: 'Lễ và tiệc', description: 'Quản lý nhiều sự kiện với ngày giờ, địa điểm và hướng dẫn riêng cho khách mời.' },
]

const questions = [
  { question: 'Khách mời có cần tạo tài khoản để xem thiệp không?', answer: 'Không. Khách mở đường dẫn được gửi, xem thông tin, xác nhận tham dự và để lại lời chúc trực tiếp mà không cần đăng nhập.' },
  { question: 'Tôi có thể xem trước giao diện trước khi sử dụng không?', answer: 'Có. Kho giao diện cho phép xem mẫu thiệp, website cưới và Wedding Recap trước khi bạn chọn dùng cho Wedding của mình.' },
  { question: 'Thiệp và website có hiển thị tốt trên điện thoại không?', answer: 'Có. Các giao diện được thiết kế ưu tiên điện thoại và có chế độ xem trước để bạn kiểm tra trước khi chia sẻ.' },
  { question: 'Một Wedding có thể có nhiều lễ hoặc buổi tiệc không?', answer: 'Có. Bạn có thể tạo nhiều sự kiện như lễ vu quy, lễ thành hôn hoặc tiệc cưới, mỗi sự kiện có thời gian và địa điểm riêng.' },
  { question: 'Làm sao để biết khách nào sẽ tham dự?', answer: 'Khi khách phản hồi trên thiệp hoặc website, thông tin RSVP được tập trung trong Studio để bạn dễ theo dõi và chuẩn bị số lượng.' },
  { question: 'Tôi có thể mời người khác cùng quản lý Wedding không?', answer: 'Có. Mục Thành viên cho phép bạn mời người thân hoặc cộng sự cùng quản lý. Quyền thao tác phụ thuộc vào vai trò được cấp.' },
  { question: 'Có thể đổi giao diện sau khi đã nhập nội dung không?', answer: 'Bạn có thể chọn giao diện khác. Những nội dung tương thích sẽ được dùng lại; bạn nên xem trước và kiểm tra các phần đặc thù trước khi xuất bản.' },
  { question: 'Danh sách khách mời có giới hạn hiển thị không?', answer: 'Danh sách hiện tải tối đa 50 khách trong một lần để giữ tốc độ ổn định. Bạn vẫn có thể tìm kiếm và lọc theo danh mục khách mời.' },
  { question: 'Dữ liệu đang chỉnh sửa có tự xuất hiện với khách mời không?', answer: 'Không. Nội dung trong trình chỉnh sửa là bản nháp. Chỉ phiên bản bạn chủ động xuất bản mới được dùng trên đường dẫn công khai.' },
  { question: 'Sau ngày cưới tôi còn sử dụng được những gì?', answer: 'Bạn có thể xem lại lời chúc, ảnh, sổ tiền mừng và tạo Wedding Recap để lưu câu chuyện của ngày vui.' },
]

export function FaqPage() {
  return (
    <div className="faq-page">
      <header className="faq-nav">
        <AppLink to={marketingRoutes.home} className="faq-brand" ariaLabel="Ourday - Trang chủ"><BrandLogo /></AppLink>
        <nav aria-label="Điều hướng trang hỏi đáp">
          <AppLink to={marketingRoutes.invitationTemplates}>Giao diện mẫu</AppLink>
          <AppLink to={marketingRoutes.howItWorks}>Cách hoạt động</AppLink>
          <AppLink className="is-active" to={marketingRoutes.faq}>Hỏi đáp</AppLink>
          <AppLink to={marketingRoutes.login}>Đăng nhập</AppLink>
        </nav>
        <AppLink to={studioRoutes.inviteThemes} className="faq-nav-cta">Bắt đầu tạo <ArrowRight size={16} /></AppLink>
      </header>

      <main>
        <section className="faq-hero" aria-labelledby="faq-page-title">
          <div className="faq-hero-copy">
            <span className="faq-eyebrow"><Heart weight="fill" /> Hiểu rõ trước khi bắt đầu</span>
            <h1 id="faq-page-title">Mọi điều bạn cần biết, trong một nơi dễ tìm.</h1>
            <p>Khám phá những gì Ourday có thể giúp hai bạn và tìm câu trả lời nhanh cho các thắc mắc thường gặp trong quá trình chuẩn bị.</p>
          </div>
          <div className="faq-hero-note" aria-hidden="true"><Question weight="duotone" /><span>Câu hỏi nhỏ.<br /><strong>Kế hoạch rõ ràng hơn.</strong></span></div>
        </section>

        <section className="faq-features" aria-labelledby="faq-features-title">
          <div className="faq-section-heading">
            <span className="faq-eyebrow">Bạn có thể làm gì?</span>
            <h2 id="faq-features-title">Một không gian cho cả hành trình cưới</h2>
            <p>Từ lúc chuẩn bị lời mời đến khi lưu lại những kỷ niệm sau ngày vui.</p>
          </div>
          <div className="faq-feature-grid">
            {features.map(({ icon: Icon, title, description }) => <article key={title}><span className="faq-feature-icon"><Icon size={24} /></span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>

        <section className="faq-questions" aria-labelledby="faq-questions-title">
          <div className="faq-question-intro">
            <span className="faq-eyebrow"><Question weight="fill" /> Câu hỏi thường gặp</span>
            <h2 id="faq-questions-title">Có thể bạn đang thắc mắc</h2>
            <p>Những câu trả lời ngắn gọn để bạn biết nên bắt đầu từ đâu và điều gì sẽ xảy ra trong từng bước.</p>
            <AppLink to={marketingRoutes.howItWorks} className="faq-text-link">Xem cách hoạt động <ArrowRight size={16} /></AppLink>
          </div>
          <div className="faq-question-list">
            {questions.map(({ question, answer }, index) => <details key={question} open={index === 0}><summary><span>{question}</span><CaretDown size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="faq-final" aria-labelledby="faq-final-title">
          <CheckCircle weight="fill" size={24} />
          <div><span>Bạn đã sẵn sàng?</span><h2 id="faq-final-title">Bắt đầu bằng một giao diện khiến hai bạn thấy đúng là mình.</h2></div>
          <AppLink to={marketingRoutes.invitationTemplates} className="faq-primary">Xem giao diện mẫu <ArrowRight size={17} /></AppLink>
        </section>
      </main>

      <footer className="faq-footer"><AppLink to={marketingRoutes.home}>Ourday</AppLink><span>Không gian số cho một ngày thật đáng nhớ.</span><AppLink to={studioRoutes.inviteThemes}>Bắt đầu tạo <ArrowRight size={15} /></AppLink></footer>
    </div>
  )
}
