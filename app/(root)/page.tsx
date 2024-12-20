import { auth } from '@/auth';
import { Categories } from '@/components/categories';
import {
  Features,
  Hero,
  HowItWorks,
  VendingLocations,
  FeaturedPerfumes,
} from '@/components/home';

export default async function Home() {
  const session = await auth();
  console.log(session);

  return (
    <div className="flex flex-col gap-24 pb-16">
      <Hero />
      <FeaturedPerfumes />
      <Categories />
      <HowItWorks />
      <Features />
      <VendingLocations />
    </div>
  );
}
