"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const [isDropdownOpen, setisDropdownOpen] = useState(false);

  const { data: session } = useSession();
  return (
    <>
      <nav className="flex flex-row justify-between  ">
        <div className="flex justify-center ">
          <Link href="/">Logo</Link>
        </div>
        <div className="p-5 ">
          {!!session ? (
            <button
              onClick={() => setisDropdownOpen(!isDropdownOpen)}
              className="bg-white text-black px-3 py-2 rounded-xl cursor-pointer active:bg-neutral-300 flex justify-center items-center"
              onBlur={() =>
                setTimeout(() => {
                  setisDropdownOpen(false);
                }, 300)
              }
            >
              Hello, {session.user.name || session.user.email}{" "}
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
          ) : (
            <>
              <button
                className="bg-white text-black px-3 py-2 rounded-xl cursor-pointer active:bg-neutral-300"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </nav>
      {isDropdownOpen && (
        <div className="flex justify-end mr-4">
          <div
            id="dropdown"
            className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 text-center text-black flex justify-center flex-col items-center py-4"
          >
            <Link
              href="/notes"
              className="block px-4 py-2 hover:bg-gray-100 w-full"
            >
              View Notes
            </Link>

            <Link
              href="/dashboard"
              className="block px-4 py-2 hover:bg-gray-100 w-full "
            >
              User Settings
            </Link>

            <button
              onClick={() => signOut()}
              className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
