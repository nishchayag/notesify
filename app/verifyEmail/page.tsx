import VerifyEmail from "@/components/verifyEmailComp";
import { Suspense } from "react";

export default function VerifyEmailSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
