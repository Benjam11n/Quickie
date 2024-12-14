export default function NotFound() {
  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Board Not Found</h2>
        <p className="text-muted-foreground">
          The mood board you're looking for doesn't exist or has been deleted.
        </p>
      </div>
    </div>
  );
}
