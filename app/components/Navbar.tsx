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
        <div className="flex justify-center ">Logo</div>
        <div className="p-5 ">
          {!!session ? (
            <button
              onClick={() => setisDropdownOpen(!isDropdownOpen)}
              className="bg-white text-black px-3 py-2 rounded-xl cursor-pointer active:bg-neutral-300 flex justify-center items-center"
              onBlur={() => setisDropdownOpen(false)}
            >
              Hello, username{" "}
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
            className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 text-center "
          >
            <ul
              className="py-2  text-black"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <Link
                  href="/notes"
                  className="block px-4 py-2 hover:bg-gray-100 "
                >
                  View Notes
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 "
                >
                  User Settings
                </Link>
              </li>
              <li onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
                <Link href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
