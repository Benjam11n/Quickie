import {
  Home,
  Search,
  Scale,
  MapPin,
  Heart,
  Star,
  Grid,
  TrendingUp,
  Newspaper,
} from 'lucide-react';
import { User } from 'next-auth';

import { ROUTES } from './routes';

interface Navlink {
  href: string;
  label: string;
  active: (pathname: string) => boolean;
}

type Navlinks = Navlink[];

export const navLinks: Navlinks = [
  {
    href: ROUTES.HOME,
    label: 'Home',
    active: (pathname: string) => pathname === '/',
  },
  {
    href: ROUTES.CATALOG,
    label: 'Temptations',
    active: (pathname: string) => pathname === '/catalog',
  },
  {
    href: ROUTES.COMPARE,
    label: 'Compare',
    active: (pathname: string) => pathname === '/compare',
  },
  {
    href: ROUTES.NEWS,
    label: 'Newsletter',
    active: (pathname: string) => pathname === '/news',
  },
  {
    href: ROUTES.LOCATIONS,
    label: 'Find Me',
    active: (pathname: string) => pathname === '/locations',
  },
];

export const getMainNavItems = (user?: User) => [
  { href: ROUTES.HOME, label: 'Home', icon: Home },
  { href: ROUTES.CATALOG, label: 'Explore Perfumes', icon: Search },
  { href: ROUTES.COMPARE, label: 'Compare', icon: Scale },
  { href: ROUTES.LOCATIONS, label: 'Vending Machines', icon: MapPin },
  {
    href: user?.name ? ROUTES.PROFILE(user.name) : '/sign-in',
    label: 'My Collection',
    icon: Grid,
  },
  {
    href: user?.name
      ? `${ROUTES.PROFILE(user.name)}?tab=favorites`
      : '/sign-in',
    label: 'Wishlist',
    icon: Heart,
  },
];

export const communityNavItems = [
  { href: '/reviews', label: 'Latest Reviews', icon: Star },
  { href: '/trending', label: 'Trending', icon: TrendingUp },
  { href: '/news', label: 'News & Articles', icon: Newspaper },
];
