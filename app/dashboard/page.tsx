"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
function Dashboard() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (name.length === 0 && password.length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [name, password]);
  const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (name.length === 0 && password.length === 0) {
        console.error(
          "please enter required fields, either name or password whichever you want to change"
        );
      }
      await axios.post("/api/auth/editusersettings", {
        email: session!.user.email,
        name,
        password,
      });

      toast.success("User details updated successfully!");
      if (process.env.NODE_ENV !== "production") {
        console.log("User details updated successfully.");
      }

      signOut();
      router.push("/login");
    } catch (error) {
      toast.error("Failed to update user details. Please try again.");
      console.error("error changing details: ", error);
    }
  };

  return (
    <div className="mt-20 flex flex-col justify-center items-center px-4 gap-10">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-neutral-800 dark:text-white">
        User Details for {session?.user.email}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 justify-center items-center w-full max-w-xl"
      >
        <div className="w-full">
          <label
            htmlFor="name"
            className="text-lg font-medium text-neutral-700 dark:text-neutral-200"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-2 w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="password"
            className="text-lg font-medium text-neutral-700 dark:text-neutral-200"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-2 w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition ${
            isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={isDisabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
