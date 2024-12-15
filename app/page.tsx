import {
  Features,
  Hero,
  HowItWorks,
  VendingLocations,
} from '@/components/home';

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-16">
      <Hero />
      <HowItWorks />
      <Features />
      <VendingLocations />
    </div>
  );
}
