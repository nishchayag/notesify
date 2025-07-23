"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(form.email.trim() === "" || form.password.trim() === "");
  }, [form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const response = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (response?.ok) {
      toast.success("Logged in successfully!");
      router.push("/notes");
    } else {
      toast.error("Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              className="w-full px-4 py-2 border rounded-xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium block mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isDisabled || loading}
            className={`w-full py-3 rounded-xl transition font-medium ${
              isDisabled
                ? "bg-gray-300 dark:bg-neutral-700 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          <button
            onClick={() => router.push("/forgotPassword")}
            className="text-red-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-red-500 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
