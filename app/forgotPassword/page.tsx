"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (email.length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [email]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await axios.post("/api/auth/forgotPassword", { email });

      toast.success("Password reset email sent successfully!");
      if (process.env.NODE_ENV !== "production") {
        console.log("Password reset email sent successfully.");
      }

      router.push("/resetEmailSent");
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.");
      if (process.env.NODE_ENV !== "production") {
        console.error("Error while requesting password reset:", error);
      }
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h1 className="text-3xl">Forgot Password?</h1>
      <form
        className="flex flex-col gap-4 justify-center items-center mt-10"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email" className="text-xl">
          Enter Email
        </label>
        <input
          className="border px-3 py-2 rounded-xl w-100"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className={`bg-white text-black px-4 py-3 rounded-xl  ${
            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={isDisabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
