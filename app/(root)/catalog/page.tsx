import CatalogClient from '@/components/fragrance/CatalogClient';
import DataRenderer from '@/components/ui/DataRenderer';
import { EMPTY_CATALOG } from '@/constants/states';
import { getPerfumes } from '@/lib/actions/perfume.action';

interface SearchParams {
  searchParams: { [key: string]: string };
}

export default async function CatalogPage({ searchParams }: SearchParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getPerfumes({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  const { perfumes } = data || {};

  return (
    <DataRenderer
      success={success}
      error={error}
      data={perfumes}
      empty={EMPTY_CATALOG}
      render={(perfumes) => <CatalogClient perfumes={perfumes} />}
    />
  );
}
