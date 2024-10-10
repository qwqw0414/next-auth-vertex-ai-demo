import NextAuth from "next-auth";
import authConfig from "./auth/auth.config";


const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth) {
    // 현재 URL을 기반으로 새로운 URL 객체를 생성
    const url = new URL('/auth/signin', req.url);
    // URL 객체를 문자열로 변환하여 리다이렉트
    return Response.redirect(url.toString());
  }
});

export const config = { matcher: ["/"], }