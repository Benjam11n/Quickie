interface Navlink {
  href: string;
  label: string;
  active: (pathname: string) => boolean;
}

type Navlinks = Navlink[];

export const navLinks: Navlinks = [
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
    href: '/news',
    label: 'Newsletter',
    active: (pathname: string) => pathname === '/news',
  },
  {
    href: '/locations',
    label: 'Find Me',
    active: (pathname: string) => pathname === '/locations',
  },
];
