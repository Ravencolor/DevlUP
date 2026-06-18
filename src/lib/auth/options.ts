import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existing = await prisma.user.findUnique({
          where: { emailId: user.email },
        });

        if (!existing) {
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

    async jwt({ token, account, user }) {
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { emailId: user.email },
          select: { userId: true, role: true },
        });
        if (dbUser) {
          token.dbUserId = dbUser.userId;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.dbUserId) {
        session.user.id = String(token.dbUserId);
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};
