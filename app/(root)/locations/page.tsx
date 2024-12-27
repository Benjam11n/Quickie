import LocalSearch from '@/components/search/LocalSearch';
import DataRenderer from '@/components/ui/DataRenderer';
import VendingMachineClient from '@/components/vending-machine/VendingMachineClient';
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
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Static/Server Content */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">
            <span className="holographic-text">Find Your Fix</span>
          </h1>
          <p className="text-muted-foreground">
            Locate our vending machines for instant gratification.
          </p>
        </div>

        <div className="relative">
          <LocalSearch
            route="/locations"
            placeholder="Search vending machines..."
            otherClasses="flex-1"
          />
        </div>

        {/* Client Component */}
        <DataRenderer
          success={success}
          error={error}
          data={vendingMachines}
          empty={EMPTY_VENDING_MACHINES}
          render={(vendingMachines) => (
            <VendingMachineClient vendingMachines={vendingMachines} />
          )}
        />
      </div>
    </div>
  );
};

export default LocationsPage;
