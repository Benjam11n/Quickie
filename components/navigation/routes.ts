export const routes = [
  {
    href: '/',
    label: 'Home',
    active: (pathname: string) => pathname === '/',
  },
  {
    href: '/catalog',
    label: 'Temptations',
    active: (pathname: string) => pathname === '/catalog',
  },
  {
    href: '/compare',
    label: 'Compare',
    active: (pathname: string) => pathname === '/compare',
  },
  {
    href: '/locations',
    label: 'Find Me',
    active: (pathname: string) => pathname === '/locations',
  },
  {
    href: '/news',
    label: 'Newsletter',
    active: (pathname: string) => pathname === '/news',
  },
] as const;
