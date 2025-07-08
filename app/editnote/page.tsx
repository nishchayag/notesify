import EditNote from "@/components/EditNote";
import React, { Suspense } from "react";

export default function EditNotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditNote />
    </Suspense>
  );
}
