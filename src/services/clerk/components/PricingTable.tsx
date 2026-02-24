import { PricingTable as OriginalPricingTable } from "@clerk/nextjs";

export function PricingTable() {
  return <OriginalPricingTable newSubscriptionRedirectUrl="/app" />;
}
