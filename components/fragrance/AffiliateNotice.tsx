import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';

const AffiliateNotice = ({ children }: { children: React.ReactNode }) => {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side="top" className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-500">
              External Purchase
            </h4>
            <p className="text-sm text-muted-foreground">
              We currently don&apos;t sell perfumes directly. You&apos;ll be
              redirected to a trusted external retailer to complete your
              purchase.
            </p>
          </div>
          <div className="space-y-1 border-t pt-2">
            <p className="text-xs text-muted-foreground">
              Note: Prices and availability may vary on external sites.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AffiliateNotice;
