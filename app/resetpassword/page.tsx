import { Suspense } from "react";
import ResetPassword from "@/components/ResetPasswordComp";
export default function ResetPasswordSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
