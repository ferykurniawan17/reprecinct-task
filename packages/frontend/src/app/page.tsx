"use client";

import AttributesPage from "@/components/AttributesPage";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttributesPage />
    </Suspense>
  );
}
