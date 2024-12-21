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

  // Mood boards
  PROFILE: (username: string) => `/profile/${username}`,
  PROFILE_SETTINGS: (username: string) => `/profile/${username}/settings`,
  BOARDS_NEW: '/boards/new',
  BOARDS_EDIT: (id: string) => `/boards/${id}/edit`,
  BOARDS_VIEW: (id: string) => `/boards/${id}/view`,

  // Miscellaneous
  PRIVACY: '/privacy',
  TERMS: '/terms',
};
