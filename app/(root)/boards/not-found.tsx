export default function NotFound() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-bold">Board Not Found</h2>
        <p className="text-muted-foreground">
          The mood board you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
      </div>
    </div>
  );
}
