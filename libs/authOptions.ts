import userModel from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
          throw new Error("Missing email/password input value");
        }
        try {
          connectDB();
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
            throw new Error("invalid password");
          }
          return {
            id: userInDB._id.toString(),
            email: userInDB.email.toString(),
          };
        } catch (error) {
          throw new Error("Error while signing in: " + error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
