"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderThree } from "./ui/LoaderThree";
import { toast } from "sonner";
const ResetPassword = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tokenVal, setTokenVal] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    if (!token) {
      console.error("please provide token");
      return;
    }
    setTokenVal(token);
  }, [token]);

  useEffect(() => {
    if (password.length === 0 || confirmPassword.length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (password.length === 0 || confirmPassword.length === 0) {
        toast.error("Please provide required fields");
        if (process.env.NODE_ENV !== "production") {
          console.error("Please provide required fields");
        }
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Please ensure password and confirm password are the same");
        if (process.env.NODE_ENV !== "production") {
          console.error("please ensure password and confirm password are same");
        }
        return;
      }
      await axios.post("/api/auth/resetPassword", {
        token: tokenVal,
        password,
      });

      toast.success(
        "Password reset successfully! Please login with your new password."
      );
      router.push("/login");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      if (process.env.NODE_ENV !== "production") {
        console.error("Error resetting password: ", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderThree />;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 mt-20">
      <h1 className="text-3xl">Enter new password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <label htmlFor="password" className="text-xl">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="border px-3 py-2 rounded-xl w-100"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword" className="text-xl">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="border px-3 py-2 rounded-xl w-100"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className={`bg-white text-black px-4 py-3 rounded-xl ${
            isDisabled ? `cursor-not-allowed` : `cursor-pointer`
          }`}
          disabled={isDisabled}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
