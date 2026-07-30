export const studioRoutes = {
  home: '/studio',
  inviteThemes: '/studio/invites/themes',
  invites: '/studio/invites',
  siteThemes: '/studio/site/themes',
  site: '/studio/site',
  guests: '/studio/guests',
  guestCategories: '/studio/guests/categories',
  rsvps: '/studio/rsvps',
  wishes: '/studio/wishes',
  todos: '/studio/todos',
  giftLedger: '/studio/gift-ledger',
  recap: '/studio/recap',
  recapThemes: '/studio/recap/themes',
  analytics: '/studio/analytics',
  settings: '/studio/settings',
} as const

export const adminRoutes = {
  home: '/gmm_admin',
  login: '/gmm_admin/login',
  users: '/gmm_admin/users',
  weddings: '/gmm_admin/weddings',
  subscriptions: '/gmm_admin/subscriptions',
  inviteLibrary: '/gmm_admin/library/invites',
  websiteLibrary: '/gmm_admin/library/websites',
  inviteStyles: '/gmm_admin/styles/invites',
  websiteStyles: '/gmm_admin/styles/websites',
  moderation: '/gmm_admin/moderation',
  operations: '/gmm_admin/operations',
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
  settings: studioRoutes.settings,
}

export const publicTemplateRoutes = {
  modernLuxePreview: '/templates/invitations/modern-luxe/preview',
} as const
