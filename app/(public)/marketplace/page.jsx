
"use client";

import { Suspense } from "react";
import MarketplaceContent from "./MarketplaceContent";

export const dynamic = "force-dynamic";

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}