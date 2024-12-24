import CatalogClient from '@/components/fragrance/CatalogClient';
import { EMPTY_CATALOG } from '@/constants/states';
import { getPerfumes } from '@/lib/actions/perfume.action';

interface SearchParams {
  searchParams: { [key: string]: string };
}

export default async function CatalogPage({ searchParams }: SearchParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const {
    success,
    data: products,
    error,
  } = await getPerfumes({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  return (
    <CatalogClient
      products={products?.perfumes || []}
      success={success}
      error={error}
      empty={EMPTY_CATALOG}
    />
  );
}
