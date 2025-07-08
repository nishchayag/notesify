"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (form.email.length == 0 || form.password.length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (form.email.length == 0 || form.password.length === 0) {
        console.error(
          "Missing required fields, please enter email and password to login"
        );
      }
      const response = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: true,
        callbackUrl: "/notes",
      });
      console.log(response);
      if (response?.ok) {
        router.push("/notes");
      } else {
        console.error("error signing in: ");
      }
    } catch (error) {
      console.error("error signing in: ", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <h1 className="text-center text-3xl">Loading...</h1>;
  }
  return (
    <div className="mt-20">
      <h1 className="text-5xl text-center">LOGIN</h1>
      <form
        className="flex flex-col gap-4 justify-center items-center mt-10"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label htmlFor="email" className="text-xl">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="border px-3 py-2 rounded-xl w-100"
          placeholder="example@email.com"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label htmlFor="password" className="text-xl">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="border px-3 py-2 rounded-xl w-100"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className={`bg-white text-black px-4 py-3 rounded-xl ${
            isDisabled ? `cursor-not-allowed` : `cursor-pointer`
          }`}
          disabled={isDisabled}
        >
          Log in
        </button>
      </form>
      <div className="flex justify-center mt-2">
        <button
          onClick={() => router.push("/forgotPassword")}
          className="bg-white text-black px-4 py-3 rounded-xl cursor-pointer"
        >
          Forgot Password
        </button>
      </div>

      <p className="text-center text-xl mt-10">
        Dont have an account?{" "}
        <Link href="/signup" className="hover:underline">
          Sign-Up
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
