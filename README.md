# Quickie - Perfume Discovery Platform

A modern web application built with Next.js for exploring, comparing, and discovering perfumes.

## Features

- **Perfume Catalog**: Browse and search through an extensive collection of perfumes
- **User Collections**: Create and manage your personal perfume collection
- **Compare Tool**: Side-by-side comparison of different perfumes
- **Location Finder**: Find perfume vending machines near you
- **Authentication**: Secure user authentication with Next Auth
- **Responsive Design**: Full mobile and desktop support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **State Management**:
  - React Query for server state
  - Zustand for client state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Maps**: Leaflet for location features
- **Charts**: Recharts for data visualization

## Prerequisites

- Node.js 18+
- pnpm
- MongoDB database

## Getting Started

1. Clone the repository:

```bash
git clone git@github.com:Benjam11n/Quickie.git
cd quickie
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Required environment variables:

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `AUTH_GITHUB_ID`: For GitHub OAuth authentication
- `AUTH_GITHUB_SECRET`: For GitHub OAuth authentication
- `AUTH_GOOGLE_ID`: For Google OAuth authentication
- `AUTH_GOOGLE_SECRET`: For Google OAuth authentication
- `RESEND_API_KEY`: To test emails through the Resend service

See Environment Variables Setup Guide below for detailed instructions.

4. Run the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
quickie/
├── app/                   # Next.js app directory
├──    (root)/             # Next.js main app
├──    (auth)/             # For signing in/ out
├──    (admin)/            # For admin purposes(to be removed)
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── database/              # Mongoose models
├── public/                # Static assets
├── styles/                # Global styles
└── types/                 # TypeScript type definitions
```

## Features in Detail

### Authentication

- Email/Password authentication
- OAuth providers support (configurable)
- Protected routes and API endpoints

### User Features

- Personal perfume collections
- Profile customization
- Privacy settings
- Favorite perfumes management

### Perfume Management

- Comprehensive perfume database
- Advanced search and filtering
- Note categorization
- Brand management

### Location Services

- Interactive map interface
- Vending machine locations
- Distance calculations
- Location filtering

## Database Models

Key models include:

- User
- Perfume
- Note
- Brand
- Location
- Collection
- ...

## Development

### Commands

- `pnpm run dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm run lint`: Run ESLint
- `pnpm seed`: Seed database with initial data

## Testing

- React Testing Library (planned)
- End-to-end testing (planned)

## Deployment

- Vercel (likely)

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) for the database solution

# Quickie Data Management Guide

## Server Actions

Use server actions for:

- Initial page data fetching where SEO is important
- Static or rarely changing data
- Public-facing content
- Data that needs server-side caching
- Complex database operations that don't need immediate UI updates

Example use cases:

```typescript
// Product catalog initial load
// Blog posts
// Static pages
// Search results initial load
async function getProducts(params: ProductParams) {
  // Server-side fetching with caching
  return await db.products.findMany(params);
}
```

## React Query

Use React Query for:

- Data that needs real-time updates
- Resources that are frequently mutated
- When you need cache invalidation
- User-specific data that changes often
- When you need optimistic updates

Example use cases:

```typescript
// User reviews
// Shopping cart
// Likes/reactions
// User collections
// Comments
const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(productId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

## Zustand

Use Zustand for:

- UI state management
- Cross-component communication
- Temporary state that needs to persist across page navigation
- Complex state that doesn't need server persistence
- Feature-specific state management

Example use cases:

```typescript
// Theme preferences
// Comparison selections
// Filter/modal states
// Shopping cart UI state
// Multi-step form state
const useComparisonStore = create((set) => ({
  selectedItems: [],
  addItem: (id: string) =>
    set((state) => ({
      selectedItems: [...state.selectedItems, id],
    })),
}));
```

## URL State

Use URL state (searchParams) for:

- Filtering
- Sorting
- Pagination
- Search queries
- Anything that needs to be shareable or bookmarkable

Example:

```typescript
/catalog?page=1&sort=price-asc&filter=brand:nike
```

## Common Patterns

### Data Fetching with Mutations

```typescript
// Combine Server Action with React Query
const useUpdateProduct = () => {
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
};
```

### Hybrid Approach

```typescript
// Server-side initial data + React Query hydration
export default async function ProductPage() {
  const initialData = await getProduct(id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductClient initialData={initialData} />
    </HydrationBoundary>
  );
}
```

## Best Practices

### Server Actions

- Use for initial data fetching
- Implement caching strategies
- Handle errors gracefully
- Return structured responses

### React Query

- Set appropriate staleTime
- Implement error boundaries
- Use suspense for loading states
- Configure retry logic
- Set up proper cache invalidation

### Zustand

- Keep stores small and focused
- Implement proper cleanup
- Use selectors for performance
- Consider persistence when needed

## Error Handling

```typescript
// Server Actions
export async function serverAction() {
  try {
    // Operation
    return { success: true, data };
  } catch (error) {
    return handleError(error);
  }
}

// React Query
const { data, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
  onError: (error) => {
    toast.error(error.message);
  },
});

// Zustand
const useStore = create((set) => ({
  error: null,
  setError: (error: Error) => set({ error }),
  clearError: () => set({ error: null }),
}));
```

## State Management Decision Tree

1. Does the data need SEO? → Server Actions
2. Is it frequently updated? → React Query
3. Is it UI/temporary state? → Zustand
4. Should it be shareable? → URL State

Remember:

- Server Actions for static/SEO data
- React Query for dynamic/real-time data
- Zustand for UI state
- URL for shareable state

This organization provides a clear separation of concerns and makes it easier to maintain and scale your application.

# Environment Variables Setup Guide

Below is a guide for setting up each required environment variable:

## Core Variables

### MONGODB_URI

- **Purpose**: Connects your application to MongoDB database
- **How to get**:
  1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
  2. Create a new cluster
  3. Click "Connect" and choose "Connect your application"
  4. Copy the connection string
- **Required for**: Database functionality (all features)

### NEXTAUTH_SECRET

- **Purpose**: Encrypts authentication tokens and cookies
- **How to get**: You can generate a secure random string using:
  ```bash
  openssl rand -base64 32
  ```
- **Required for**: All authentication features

## OAuth Providers

### GitHub Authentication (AUTH_GITHUB_ID & AUTH_GITHUB_SECRET)

- **Purpose**: Enables "Login with GitHub" functionality
- **How to get**:
  1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
  2. Create a new OAuth application
  3. Set homepage URL to `http://localhost:3000` for development
  4. Set callback URL to `http://localhost:3000/api/auth/callback/github`
  5. Copy Client ID (AUTH_GITHUB_ID) and Client Secret (AUTH_GITHUB_SECRET)
- **Required for**: GitHub authentication feature
- **Testing**: Create a GitHub account if you don't have one

### Google Authentication (AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET)

- **Purpose**: Enables "Login with Google" functionality
- **How to get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project
  3. Enable OAuth2 API
  4. Configure OAuth consent screen
  5. Create OAuth 2.0 Client ID
  6. Set authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
  7. Copy Client ID (AUTH_GOOGLE_ID) and Client Secret (AUTH_GOOGLE_SECRET)
- **Required for**: Google authentication feature
- **Testing**: Need a Google account

## Email Service

### RESEND_API_KEY

- **Purpose**: Enables sending emails (verification, notifications)
- **How to get**:
  1. Create account at [Resend](https://resend.com)
  2. Generate API key from dashboard
- **Required for**: Email functionality
- **Testing**: Need to verify domain ownership for production use, but can use test emails in development

## Notes

- For local development, you need at least MONGODB_URI and NEXTAUTH_SECRET
- OAuth providers (GitHub/Google) are optional but recommended for testing social login
- Email functionality can be tested with Resend's test domain in development
- For production, update all callback URLs to your production domain
