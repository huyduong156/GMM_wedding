import { publicTemplateRoutes } from '../shared/config/routes'
import type { TemplateConfig } from './template-config'
import { modernLuxeTemplateConfig } from './invitations/modern-luxe/template-config'
import { verdantPromiseTemplateConfig } from './invitations/verdant-promise/template-config'
import { chibiDaydreamTemplateConfig } from './invitations/chibi-daydream/template-config'
import { peonyVerandaTemplateConfig } from './invitations/peony-veranda/template-config'
import { peonyVerandaFixture } from './invitations/peony-veranda/fixture'
import type { ModernLuxeData } from './invitations/modern-luxe/ModernLuxeInvitation'
import { editorialVowsFixture } from './websites/editorial-vows/fixture'
import { editorialVowsTemplateConfig } from './websites/editorial-vows/template-config'
import { greenHydrangeaFixture } from './websites/green-hydrangea/fixture'
import { greenHydrangeaTemplateConfig } from './websites/green-hydrangea/template-config'
import { enchantedForestFixture } from './websites/enchanted-forest/fixture'
import { enchantedForestTemplateConfig } from './websites/enchanted-forest/template-config'
import { cherryBlossomFixture } from './websites/cherry-blossom-garden/fixture'
import { cherryBlossomGardenTemplateConfig } from './websites/cherry-blossom-garden/template-config'

export const modernLuxeEditorFixture: ModernLuxeData = {
  brideName: 'Mai',
  groomName: 'Đức',
  weddingDate: '18 · 10 · 2026',
  eyebrow: 'Trân trọng kính mời',
  invitationTitle: 'Đến chung vui trong ngày thành hôn',
  invitationMessage:
    'Sự hiện diện của bạn là niềm vui và món quà quý giá trong ngày chúng mình bắt đầu một hành trình mới.',
  ceremonyTime: '09:00',
  receptionTime: '11:00',
  venueName: 'The Garden Hall',
  venueAddress: 'Hà Nội',
  brideFatherTitle: 'Ông',
  brideFather: 'Nguyễn Văn An',
  brideMotherTitle: 'Bà',
  brideMother: 'Trần Thu Hà',
  groomFatherTitle: 'Ông',
  groomFather: 'Phạm Văn Minh',
  groomMotherTitle: 'Bà',
  groomMother: 'Lê Ngọc Lan',
  timelineItems: [
    { time: '09:00', title: 'Đón khách', detail: 'Gặp gỡ và chụp ảnh cùng khách mời.' },
    { time: '10:00', title: 'Lễ thành hôn', detail: 'Cùng chứng kiến nghi thức thành hôn.' },
    { time: '11:00', title: 'Khai tiệc', detail: 'Khai tiệc và chung vui cùng hai gia đình.' },
  ],
  activities: [
    {
      title: 'Photobooth kỷ niệm',
      image: '/assets/images/templates/modern-luxe/wedding-detail.jpg',
    },
    {
      title: 'Chụp hình cùng cô dâu chú rể',
      image: '/assets/images/templates/modern-luxe/couple-portrait.jpg',
    },
    { title: 'Góc bong bóng cho bé', image: '/assets/images/login-wedding-luxury.jpg' },
  ],
  activitiesStyle: 'activity-cards',
  galleryStyle: 'deck-3d',
  backgroundMusicAutoplay: true,
  rsvpDeadline: '10.10.2026',
  rsvpMessage: 'Vui lòng xác nhận để chúng mình chuẩn bị đón tiếp bạn thật chu đáo.',
  giftMessage: 'Tình cảm và sự hiện diện của bạn là món quà ý nghĩa nhất.',
  galleryImages: [],
  loveJourney: [
    {
      year: '2019',
      title: 'Lần đầu gặp nhau',
      note: 'Một cuộc gặp nhỏ mở ra câu chuyện thật dài.',
    },
    { year: '2022', title: 'Những chuyến đi', note: 'Mình cùng đi, cùng lớn lên và cùng nhớ.' },
    { year: '2025', title: 'Lời cầu hôn', note: 'Một lời đồng ý cho mọi ngày về sau.' },
    {
      year: '2026',
      title: 'Ngày mình chung nhà',
      note: 'Chương đẹp nhất bắt đầu cùng những người thương.',
    },
  ],
}

export const invitationTemplateRegistry: Record<
  string,
  { config: TemplateConfig; fixture: ModernLuxeData }
> = {
  'modern-luxe': { config: modernLuxeTemplateConfig, fixture: modernLuxeEditorFixture },
  'verdant-promise': { config: verdantPromiseTemplateConfig, fixture: modernLuxeEditorFixture },
  'chibi-daydream': { config: chibiDaydreamTemplateConfig, fixture: modernLuxeEditorFixture },
  'peony-veranda': {
    config: peonyVerandaTemplateConfig,
    fixture: peonyVerandaFixture as ModernLuxeData,
  },
}

export const websiteTemplateRegistry: Record<
  string,
  { config: TemplateConfig; fixture: Record<string, unknown>; previewPath: string }
> = {
  'editorial-vows': {
    config: editorialVowsTemplateConfig,
    fixture: editorialVowsFixture as Record<string, unknown>,
    previewPath: publicTemplateRoutes.editorialVowsPreview,
  },
  'green-hydrangea': {
    config: greenHydrangeaTemplateConfig,
    fixture: greenHydrangeaFixture as Record<string, unknown>,
    previewPath: publicTemplateRoutes.greenHydrangeaPreview,
  },
  'enchanted-forest': {
    config: enchantedForestTemplateConfig,
    fixture: enchantedForestFixture as Record<string, unknown>,
    previewPath: publicTemplateRoutes.enchantedForestPreview,
  },
  'cherry-blossom-garden': {
    config: cherryBlossomGardenTemplateConfig,
    fixture: cherryBlossomFixture as Record<string, unknown>,
    previewPath: publicTemplateRoutes.cherryBlossomGardenPreview,
  },
}

export const getInvitationTemplate = (key: string) => invitationTemplateRegistry[key]
export const getWebsiteTemplate = (key: string) => websiteTemplateRegistry[key]
