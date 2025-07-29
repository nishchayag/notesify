import EditNote from "@/components/EditNote";
import { LoaderThree } from "@/components/ui/LoaderThree";
import React, { Suspense } from "react";

export default function EditNotePage() {
  return (
    <Suspense fallback={<LoaderThree />}>
      <EditNote />
    </Suspense>
  );
}
