"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
function page() {
  const [tokenVal, setTokenVal] = useState("");
  const urlParams = useSearchParams();
  const token = urlParams.get("token");
  useEffect(() => {
    if (!token) {
      console.error("Please provide token");
      return;
    }
    setTokenVal(token);
  }, [token]);
  const handleClick = async () => {
    try {
      const response = await axios.post("/api/auth/verifyEmail", {
        token: tokenVal,
      });
      console.log("Email verified successfully: ", response.data);
      signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("error verifying user: ", error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-8 mt-20">
      <h1 className="text-3xl">
        Click on the button below to verify your email
      </h1>
      <button
        onClick={handleClick}
        className="bg-white text-black px-4 py-3 rounded-xl cursor-pointer"
      >
        Verify Email
      </button>
    </div>
  );
}

export default page;
