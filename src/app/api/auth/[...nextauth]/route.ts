import NextAuth from "next-auth";
import {  Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomSession extends Session {
  user: {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { emailId: user.email },
        });

        if (!existingUser) {
          // Create new user if doesn't exist
          await prisma.user.create({
            data: {
              emailId: user.email,
              firstName: profile?.name?.split(" ")[0] || "",
              lastName: profile?.name?.split(" ").slice(1).join(" ") || "",
            },
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;
      if (customSession.user && token.sub) {
        customSession.user.id = token.sub;
      }
      return customSession;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
