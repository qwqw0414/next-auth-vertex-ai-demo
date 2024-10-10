import { NextAuthConfig, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from 'next-auth/providers/google'
import { refreshAccessToken } from "./refreshAccessToken";

interface SessionWithTokens extends Session {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

function addTokensToSession(session: Session, token: ExtendedJWT): SessionWithTokens {
  return {
    ...session,
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresAt
  };
}

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/cloud-platform'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      // 액세스 토큰 만료 시간이 자났으면 갱신
      if (token?.expiresAt && Date.now() > Number(token.expiresAt)) {
        console.log("refresh token");
        return refreshAccessToken(token);
      } else {
        // console.log("jwt token", token);
        return token as ExtendedJWT;
      }

    },
    async session({ session, token }) {
      // console.log("session before", session);
      const extendedSession = addTokensToSession(session, token as ExtendedJWT);
      // console.log("session after", extendedSession);
      return extendedSession;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;