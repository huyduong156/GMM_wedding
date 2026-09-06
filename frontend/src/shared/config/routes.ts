export const studioRoutes = {
  home: '/studio',
  inviteThemes: '/studio/invites/themes',
  invites: '/studio/invites',
  siteThemes: '/studio/site/themes',
  siteEditor: '/studio/site/edit',
  site: '/studio/site',
  guests: '/studio/guests',
  guestCategories: '/studio/guests/categories',
  rsvps: '/studio/rsvps',
  wishes: '/studio/wishes',
  todos: '/studio/todos',
  giftLedger: '/studio/gift-ledger',
  recap: '/studio/recap',
  recapReview: '/studio/recap/review',
  recapThemes: '/studio/recap/themes',
  analytics: '/studio/analytics',
  events: '/studio/events',
  settings: '/studio/settings',
  profile: '/studio/profile',
} as const

export const adminRoutes = {
  home: '/gmm_admin',
  login: '/gmm_admin/login',
  users: '/gmm_admin/users',
  subscriptions: '/gmm_admin/subscriptions',
  inviteLibrary: '/gmm_admin/library/invites',
  websiteLibrary: '/gmm_admin/library/websites',
  recapLibrary: '/gmm_admin/library/recaps',
  styles: '/gmm_admin/styles',
  moderation: '/gmm_admin/moderation',
  operations: '/gmm_admin/operations',
  music: '/gmm_admin/music',
} as const

export const legacyStudioRoutes: Record<string, string> = {
  overview: studioRoutes.home,
  templates: studioRoutes.inviteThemes,
  editor: studioRoutes.invites,
  'website-templates': studioRoutes.siteThemes,
  'wedding-site': studioRoutes.site,
  guests: studioRoutes.guests,
  'guest-categories': studioRoutes.guestCategories,
  rsvps: studioRoutes.rsvps,
  wishes: studioRoutes.wishes,
  todos: studioRoutes.todos,
  'gift-ledger': studioRoutes.giftLedger,
  recap: studioRoutes.recap,
  'recap-themes': studioRoutes.recapThemes,
  analytics: studioRoutes.analytics,
  events: studioRoutes.events,
  settings: studioRoutes.settings,
  profile: studioRoutes.profile,
}

export const publicTemplateRoutes = {
  modernLuxePreview: '/templates/invitations/modern-luxe/preview',
  verdantPromisePreview: '/templates/invitations/verdant-promise/preview',
  chibiDaydreamPreview: '/templates/invitations/chibi-daydream/preview',
  peonyVerandaPreview: '/templates/invitations/peony-veranda/preview',
  editorialVowsPreview: '/templates/websites/editorial-vows/preview',
  greenHydrangeaPreview: '/templates/websites/green-hydrangea/preview',
  enchantedForestPreview: '/templates/websites/enchanted-forest/preview',
  cherryBlossomGardenPreview: '/templates/websites/cherry-blossom-garden/preview',
  redSpiderLilyRecapPreview: '/templates/recaps/red-spider-lily/preview',
} as const

export const marketingRoutes = {
  home: '/',
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
} as const

export const statusRoutes = {
  unauthorized: '/401',
  forbidden: '/403',
  notFound: '/404',
  serverError: '/500',
} as const
