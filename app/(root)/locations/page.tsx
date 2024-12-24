import DataRenderer from '@/components/ui/DataRenderer';
import LocationClient from '@/components/vending-machine/LocationClient';
import { EMPTY_VENDING_MACHINES } from '@/constants/states';
import { getVendingMachines } from '@/lib/actions/vending-machine.action';

interface SearchParams {
  searchParams: { [key: string]: string };
}

const LocationsPage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getVendingMachines({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  const { vendingMachines } = data || {};

  return (
    <DataRenderer
      success={success}
      error={error}
      data={vendingMachines}
      empty={EMPTY_VENDING_MACHINES}
      render={(vendingMachines) => (
        <LocationClient vendingMachines={vendingMachines} />
      )}
    />
  );
};

export default LocationsPage;
