import { redSpiderLilyRecapContent } from './content'
import { redSpiderLilyMediaContract } from './media-contract'

export const redSpiderLilyRecapFixture = {
  content: redSpiderLilyRecapContent,
  mode: 'phase-2-media-contract',
  mediaState: 'empty-user-media',
  albumMode: 'external-or-internal',
  mediaContract: redSpiderLilyMediaContract,
  independenceAudit: {
    neutralReplacementSet: redSpiderLilyMediaContract.independenceAudit.replacementSet,
    expectedIdentitySources: redSpiderLilyMediaContract.independenceAudit.identityMustRemainIn,
    forbiddenDependencies: redSpiderLilyMediaContract.independenceAudit.forbiddenDependencies,
  },
  externalAlbumExample: { type: 'EXTERNAL_ALBUM_LINK' as const, href: 'https://example.com/minh-anh-album', label: 'Mở album ảnh bên ngoài' },
} as const
