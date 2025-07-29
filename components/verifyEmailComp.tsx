"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
function VerifyEmail() {
  const [tokenVal, setTokenVal] = useState("");
  const urlParams = useSearchParams();
  const token = urlParams.get("token");
  useEffect(() => {
    if (!token) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Please provide token");
      }
      return;
    }
    setTokenVal(token);
  }, [token]);
  const handleClick = async () => {
    try {
      await axios.post("/api/auth/verifyEmail", {
        token: tokenVal,
      });

      toast.success("Email verified successfully! Please login again.");
      signOut({ callbackUrl: "/login" });
    } catch (error) {
      toast.error(
        "Failed to verify email. Please check your token and try again."
      );
      if (process.env.NODE_ENV !== "production") {
        console.error("error verifying user: ", error);
      }
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

export default VerifyEmail;
