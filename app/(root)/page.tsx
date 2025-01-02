import { auth } from '@/auth';
import {
  Features,
  Hero,
  HowItWorks,
  FeaturedVendingLocations,
  FeaturedPerfumes,
} from '@/components/home';
import { getPerfumesPaginated } from '@/lib/actions/perfume.action';
import { getVendingMachines } from '@/lib/actions/vending-machine.action';

export default async function Home() {
  const session = await auth();
  const {
    success: machineSuccess,
    data: machineResponse,
    error: machineError,
  } = await getVendingMachines({
    page: 1,
    pageSize: 3,
    query: '',
  });
  const {
    success: perfumeSuccess,
    data: perfumeResponse,
    error: perfumeError,
  } = await getPerfumesPaginated({
    page: 1,
    pageSize: 7,
    query: '',
  });

  const { vendingMachines } = machineResponse || {};
  const { perfumes } = perfumeResponse || {};

  return (
    <div className="flex flex-col gap-24 pb-16">
      <Hero userId={session?.user.id} />
      <FeaturedPerfumes
        perfumes={perfumes}
        success={perfumeSuccess}
        error={perfumeError}
      />
      <HowItWorks />
      <Features />
      <FeaturedVendingLocations
        vendingMachines={vendingMachines}
        success={machineSuccess}
        error={machineError}
      />
    </div>
  );
}
