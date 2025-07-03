import Link from "next/link";
export default function Home() {
  return (
    <div className="mt-20 text-center">
      <h1 className=" text-5xl flex flex-col gap-4">
        Welcome To <span className="text-7xl">NOTESIFY</span>
      </h1>
      <p className="mt-10 text-xl">
        Your one stop solution for all your reminders, journals, shopping lists
        and a lot more!
      </p>
      <p className="mt-10 text-xl">
        Please{" "}
        <Link href="login" className="hover:underline">
          Login{` `}
        </Link>
        to start your journey with us
      </p>
    </div>
  );
}
