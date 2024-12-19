import { SprayLoader } from '@/components/Loader';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <SprayLoader />
    </div>
  );
};

export default Loading;
