import { ROUTES } from './routes';

export const DEFAULT_EMPTY = {
  title: 'No Data Found',
  message:
    'Looks like the database is taking a nap. Wake it up with some new entries.',
  button: {
    text: 'Add Data',
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: 'Something Went Wrong',
  message: 'Even our code can have a bad day. Give it another shot.',
  button: {
    text: 'Retry Request',
    href: ROUTES.HOME,
  },
};

export const EMPTY_VENDING_MACHINES = {
  title: 'No Vending Machines Found Nearby',
  message:
    "We haven't placed any perfume vending machines in this area yet. Check back soon as we expand our locations!",
};

export const EMPTY_CATALOG = {
  title: 'No Fragrances Found',
  message:
    "We couldn't find any perfumes matching your search. Try adjusting your filters or exploring our full collection.",
  button: {
    text: 'View All Perfumes',
    href: ROUTES.CATALOG,
  },
};

export const EMPTY_MOODBOARDS = {
  title: 'No Mood Boards Yet',
  message:
    'Create your first mood board to start curating your favorite fragrances and sharing your perfume journey.',
  button: {
    text: 'Create your first moodboard!',
    href: ROUTES.BOARDS_NEW,
  },
};

export const EMPTY_WISHLISTS = {
  title: 'Your Wishlist is Empty',
  message:
    "Start adding perfumes to your wishlist to keep track of fragrances you'd love to try.",
  button: {
    text: 'Create your first wishlist!',
    href: ROUTES.WISHLISTS_NEW,
  },
};

export const EMPTY_COLLECTIONS = {
  title: 'Your Collection is Empty',
  message:
    'Start building your perfume collection by adding fragrances you own or have sampled.',
  button: {
    text: 'Build Your Collection',
    href: ROUTES.CATALOG,
  },
};

export const EMPTY_PERFUME = {
  title: 'No Perfumes Found',
  message: 'Try adjusting your filters or refresh the page.',
};
