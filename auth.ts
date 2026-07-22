import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const CredentialsProvider = Credentials({
  credentials: {
    email: {},
    password: {},
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: credentials.email as string,
      password: credentials.password as string,
    });

    if (error || !data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email ?? "",
      name: (data.user.user_metadata?.name as string) ?? data.user.email ?? "",
    };
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [CredentialsProvider],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { provider?: string }).provider = token.provider as string;
      }
      return session;
    },
  },
});
