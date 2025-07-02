import { authOptions } from "@/libs/authOptions";
import connectDB from "@/libs/connectDB";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
