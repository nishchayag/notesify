import { Suspense } from "react";
import ResetPassword from "@/components/ResetPasswordComp";
import { LoaderThree } from "@/components/ui/LoaderThree";
export default function ResetPasswordSuspense() {
  return (
    <Suspense fallback={<LoaderThree />}>
      <ResetPassword />
    </Suspense>
  );
}
