import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut , } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        id: { label: "ID", type: "text" },
        name: { label: "name", type: "text" },
        image: { label: "image", type: "text" },
        role: { label: "role", type: "text" },
        username: { label: "username", type: "text" },
      },
      authorize: async (credentials) => {
        // Add your custom logic to verify credentials
        return {
          id: credentials.id as string,
          name: credentials.name as string,
          email: credentials.email as string,
          image: credentials.image as string,
          role: credentials.role as string,
          username: credentials.username as string,
        };
      },
    
    }),
    // Add other providers (e.g., Google, GitHub) if needed
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Add user role to the token
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.username = token.username;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});
