import { Categories } from '@/components/Categories';
import {
  Features,
  Hero,
  HowItWorks,
  FeaturedVendingLocations,
  FeaturedPerfumes,
} from '@/components/home';
import { getVendingMachines } from '@/lib/actions/vending-machine.action';

export default async function Home() {
  const { success, data, error } = await getVendingMachines({
    page: 1,
    pageSize: 3,
    query: '',
    filter: '',
  });

  const { vendingMachines } = data || {};

  return (
    <div className="flex flex-col gap-24 pb-16">
      <Hero />
      <FeaturedPerfumes />
      <Categories />
      <HowItWorks />
      <Features />
      <FeaturedVendingLocations
        success={success}
        vendingMachines={vendingMachines}
        error={error}
      />
    </div>
  );
}
