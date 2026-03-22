
"use client";

import { Suspense } from "react";
import MessagesContent from "./MessagesContent";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}