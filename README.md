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
