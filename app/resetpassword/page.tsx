"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const page = () => {
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
    console.log(tokenVal);

    try {
      setLoading(true);
      if (password.length === 0 || confirmPassword.length === 0) {
        console.error("Please provide required fields");
        alert("Please provide required fields");
      }
      if (password !== confirmPassword) {
        console.error("please ensure password and confirm password are same");
        alert("please ensure password and confirm password are same");
      }
      const response = await axios.post("/api/auth/resetPassword", {
        token: tokenVal,
        password,
      });
      console.log("password reset successful");
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1 className="text-3xl text-center">Loading...</h1>;
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

export default page;
