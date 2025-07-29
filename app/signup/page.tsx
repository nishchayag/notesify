"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

function SignupPage() {
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const isValid =
      form.email.trim() !== "" &&
      form.password.trim() !== "" &&
      form.confirmPassword.trim() !== "";
    setIsDisabled(!isValid);
  }, [form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Simulated request
    setTimeout(() => {
      toast.success("Account created successfully!");
      setLoading(false);
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-6 text-center"
        >
          Create your account ✨
        </motion.h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium block mb-1"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium block mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              {passwordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: !isDisabled && !loading ? 1.01 : 1 }}
            type="submit"
            disabled={isDisabled || loading}
            className={`w-full py-3 rounded-xl transition font-medium ${
              isDisabled
                ? "bg-gray-300 dark:bg-neutral-700 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-500 hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default SignupPage;
