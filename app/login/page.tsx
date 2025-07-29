"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
function LoginPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
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
    if (!form.email || !form.password) {
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }
    try {
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
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred while logging in.");
      setLoading(false);
    }
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
          Welcome back 👋
        </motion.h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="identifier"
              className="text-sm font-medium block mb-1"
            >
              Email
            </label>
            <Input
              id="identifier"
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
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-sm text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-red-500 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
