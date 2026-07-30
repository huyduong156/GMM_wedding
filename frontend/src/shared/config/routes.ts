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
  analytics: '/studio/analytics',
  settings: '/studio/settings',
} as const

export const adminRoutes = {
  home: '/admin',
  users: '/admin/users',
  weddings: '/admin/weddings',
  themes: '/admin/themes',
  moderation: '/admin/moderation',
  operations: '/admin/operations',
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
  analytics: studioRoutes.analytics,
  settings: studioRoutes.settings,
}
