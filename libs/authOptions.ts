import userModel from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials";

import connectDB from "./connectDB";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        try {
          await connectDB();
          const userInDB = await userModel.findOne({
            email: credentials?.email,
          });
          if (!userInDB) {
            console.error(
              "User does not exist, please enter valid email/password or signup."
            );
            throw new Error(
              "User does not exist, please enter valid email/password or signup."
            );
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            userInDB.password
          );
          if (!isPasswordCorrect) {
            return null;
          }
          return {
            id: userInDB._id,
            email: userInDB.email,
            name: userInDB.name,
            isVerified: userInDB.isVerified,
          };
        } catch (error) {
          console.error("error logging in: ", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        const userInDB = await userModel.findOne({ email: user.email });
        token.isVerified = userInDB?.isVerified || false;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
      }

      return session;
    },
    async signIn({ user, account }) {
      try {
        await connectDB();
        const userInDB = await userModel.findOne({ email: user.email });
        if (!userInDB) {
          await userModel.create({
            email: user.email,
            name: user.name,
            password: bcrypt.hash(user.email!.toString(), 10),
            provider: account?.provider,
            isVerified: true,
          });
        }
        return true;
      } catch (error) {
        console.log("error signing in from backend: " + error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};
