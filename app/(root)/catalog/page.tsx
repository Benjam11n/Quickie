import { auth } from '@/auth';
import CatalogClient from '@/components/fragrance/CatalogClient';
import { getPerfumesPaginated } from '@/lib/actions/perfume.action';

interface SearchParams {
  searchParams: { [key: string]: string };
}

export default async function CatalogPage({ searchParams }: SearchParams) {
  const session = await auth();
  const { page, pageSize, query, notes, priceRange, tags, brands, sortBy } =
    await searchParams;

  const { success, data, error } = await getPerfumesPaginated({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 12,
    query: query || '',
    brands: brands || '',
    notes: notes || '',
    priceRange: priceRange || '',
    tags: tags || '',
    sortBy: sortBy || '',
  });

  const { perfumes, isNext } = data || {};

  return (
    <CatalogClient
      userId={session?.user.id}
      perfumes={perfumes}
      isNext={isNext}
      success={success}
      error={error}
    />
  );
}
