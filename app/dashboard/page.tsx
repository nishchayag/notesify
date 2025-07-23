"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
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
      const response = await axios.post("/api/auth/editusersettings", {
        email: session!.user.email,
        name,
        password,
      });

      signOut();
      router.push("/login");
    } catch (error) {
      console.error("error changing details: ", error);
    }
  };

  return (
    <div className="mt-20 flex flex-col justify-center items-center">
      <h1 className="text-3xl">User Details for {session?.user.email}</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 justify-center items-center mt-10"
      >
        <label htmlFor="name" className="text-xl">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="border px-3 py-2 rounded-xl w-100"
          onChange={(e) => setName(e.target.value)}
        />
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
        <button
          type="submit"
          className={`bg-white text-black px-4 py-3 rounded-xl ${
            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
          } `}
          disabled={isDisabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
