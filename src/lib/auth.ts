import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import type { NextAuthOptions, Session } from "next-auth";

interface CustomSession extends Session {
  user: {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Test",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || credentials.password !== "test123") {
          return null;
        }

        let user = await prisma.user.findUnique({
          where: { emailId: credentials.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              emailId: credentials.email,
              firstName: "Test",
              lastName: "User",
            },
          });
        }

        return {
          id: String(user.userId),
          email: user.emailId,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existingUser = await prisma.user.findUnique({
          where: { emailId: user.email },
        });

        if (!existingUser) {
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
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
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
};
