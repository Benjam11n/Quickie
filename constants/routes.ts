export const ROUTES = {
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  CATALOG: '/catalog',
  COMPARE: '/compare',
  LOCATIONS: '/locations',
  NEWS: '/news',
  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
  PROFILE: (username: string) => `/profile/${username}`,
  BOARDS_NEW: '/boards/new',
  BOARDS_EDIT: (id: string) => `/boards/${id}/edit`,
  BOARDS_VIEW: (id: string) => `/boards/${id}/view`,
};
