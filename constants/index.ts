import {
  Home,
  Search,
  Scale,
  MapPin,
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
}

type Navlinks = Navlink[];

export const navLinks: Navlinks = [
  { href: ROUTES.HOME, label: 'Home' },
  { href: ROUTES.CATALOG, label: 'Temptations' },
  { href: ROUTES.COMPARE, label: 'Compare' },
  { href: ROUTES.NEWS, label: 'Newsletter' },
  { href: ROUTES.LOCATIONS, label: 'Find Me' },
];

export const getMainNavItems = (user?: User) => [
  { href: ROUTES.HOME, label: 'Home', icon: Home },
  { href: ROUTES.CATALOG, label: 'Explore Perfumes', icon: Search },
  { href: ROUTES.COMPARE, label: 'Compare', icon: Scale },
  { href: ROUTES.LOCATIONS, label: 'Vending Machines', icon: MapPin },
  {
    href: user ? ROUTES.USER_PROFILE : ROUTES.SIGN_IN,
    label: 'My Collection',
    icon: Grid,
  },
];

export const communityNavItems = [
  { href: '/reviews', label: 'Latest Reviews', icon: Star },
  { href: '/trending', label: 'Trending', icon: TrendingUp },
  { href: '/news', label: 'News & Articles', icon: Newspaper },
];
