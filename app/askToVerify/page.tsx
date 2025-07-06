import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  return (
    <h1 className="text-center text-3xl mt-20">
      Please verify your email to start creating notes. <br /> Check your email
      inbox for the verification email.
    </h1>
  );
};

export default page;
