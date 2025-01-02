export const ROUTES = {
  // NavBar
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  CATALOG: '/catalog',
  COMPARE: '/compare',
  LOCATIONS: '/locations',
  NEWS: '/news',
  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,

  // Products
  PRODUCT: (id: string) => `/product/${id}`,

  // Comparisons
  FULL_COMPARE: (ids: string) => `/compare/${ids}`,
  NOTES_COMPARE: (ids: string) => `/compare/notes/${ids}`,

  // Recommendations
  RECOMMENDATION: '/recommendations',

  // Mood boards
  USER_PROFILE: `/profile`,
  PROFILE: (username: string) => `/profile/${username}`,
  PROFILE_SETTINGS: `/profile/settings`,
  BOARDS_NEW: '/boards/new',
  BOARDS_EDIT: (id: string) => `/boards/${id}/edit`,
  BOARDS_VIEW: (id: string) => `/boards/${id}`,

  // Wishlists
  WISHLISTS: 'wishlists',
  WISHLISTS_VIEW: (id: string) => `/wishlists/${id}`,
  WISHLISTS_NEW: '/wishlists/new',

  // Miscellaneous
  PRIVACY: '/privacy',
  TERMS: '/terms',
};
