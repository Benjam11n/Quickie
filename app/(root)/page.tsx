import { auth } from '@/auth';
import {
  Features,
  Hero,
  HowItWorks,
  FeaturedVendingLocations,
  FeaturedPerfumes,
} from '@/components/home';
import { getVendingMachines } from '@/lib/actions/vending-machine.action';

export default async function Home() {
  const session = await auth();
  const { success, data, error } = await getVendingMachines({
    page: 1,
    pageSize: 3,
    query: '',
  });

  const { vendingMachines } = data || {};

  return (
    <div className="flex flex-col gap-24 pb-16">
      <Hero userId={session?.user.id} />
      <FeaturedPerfumes />
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
