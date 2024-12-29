import { auth } from '@/auth';
import CatalogClient from '@/components/fragrance/CatalogClient';
import { getPerfumesPaginated } from '@/lib/actions/perfume.action';

interface SearchParams {
  searchParams: { [key: string]: string };
}

export default async function CatalogPage({ searchParams }: SearchParams) {
  const session = await auth();
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getPerfumesPaginated({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  const { perfumes } = data || {};

  return (
    <CatalogClient
      userId={session?.user.id}
      perfumes={perfumes}
      success={success}
      error={error}
    />
  );
}
