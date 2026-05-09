import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { OAuthConfig } from "next-auth/providers";
import { createClient } from "@supabase/supabase-js";

interface KakaoProfile {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

const KakaoProvider: OAuthConfig<KakaoProfile> = {
  id: "kakao",
  name: "카카오",
  type: "oauth",
  authorization: {
    url: "https://kauth.kakao.com/oauth/authorize",
    params: { scope: "profile_nickname profile_image" },
  },
  token: {
    url: "https://kauth.kakao.com/oauth/token",
    params: {
      client_id: process.env.AUTH_KAKAO_ID,
      client_secret: process.env.AUTH_KAKAO_SECRET,
    },
  },
  userinfo: "https://kapi.kakao.com/v2/user/me",
  checks: ["state"],
  profile(profile) {
    return {
      id: String(profile.id),
      name: profile.kakao_account?.profile?.nickname ?? null,
      email: profile.kakao_account?.email ?? `kakao_${profile.id}@kakao.user`,
      image: profile.kakao_account?.profile?.profile_image_url ?? null,
    };
  },
  clientId: process.env.AUTH_KAKAO_ID,
  clientSecret: process.env.AUTH_KAKAO_SECRET ?? "",
};

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
  providers: [Google, KakaoProvider, CredentialsProvider],
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
