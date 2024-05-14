import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { jwtDecode } from "jwt-decode";
import moment from 'moment';
import { authSigninUser, refreshAccessToken } from '@/app/lib/actions/auth';
import { PayloadUserInterface } from '../types/interfaces';



export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ telephone: z.string(), password: z.string().min(8) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { telephone, password } = parsedCredentials.data;
          const user = authSigninUser({ telephone, password });
          if (!user.hasOwnProperty('StatusCode') && !user.hasOwnProperty('message')) {
            return user
          } else {
            console.log(user);
            
            return null
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      // console.log("auth", auth);
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/');
      // if (isOnDashboard) {
      // //   if (isLoggedIn) return true;
      // //   return false;
      // } else if (isLoggedIn) {
      //   console.log("nextUrl",nextUrl);
      //   return Response.redirect(new URL('/', nextUrl));
      // }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      const time = moment().unix();
      switch (trigger) {
        case "signIn":
          if (user) {
            return Promise.resolve(user);
          }
          break;
        case "signUp":
          if (user) {
            return Promise.resolve(user);
          }
          break;
        case "update":
          return Promise.resolve({ ...token, ...session.user });
        default:
          return Promise.resolve(token);
      }
      // if (user) {
      //   token.access_token = `${newUser?.access_token}`;
      //   token.refresh_token = `${newUser?.refresh_token}`;
      // } else {
      //   if (token) {
      //     let jwt_decode: PayloadUserInterface = jwtDecode(`${token?.access_token}`);
      //     console.log("jwt_decode", jwt_decode);

      //     // if (jwt_decode.exp < time) {
      //     //   const rt = await refreshAccessToken({ access_token: `${token.access_token}`, refresh_token: `${token.refresh_token}` });
      //     //   if (rt) {
      //     //     token = {
      //     //       user: user,
      //     //       token: {
      //     //         access_token: rt.access_token,
      //     //         refresh_token: rt.refresh_token
      //     //       }
      //     //     }
      //     //     jwt_decode = jwtDecode(`${token?.access_token}`);
      //     //     return token
      //     //   }
      //     // }
      //   }
      // }
      // console.log("jwt_token", token);
      // console.log("jwt_user", user);
      // console.log("jwt_trigger", trigger);
      // console.log("jwt_session", session);

    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ token, session }) {

      let jwt_decode: PayloadUserInterface = jwtDecode(`${token?.access_token}`);
      session.user = jwt_decode
      session.token = {
        access_token: `${token.access_token}`,
        refresh_token: `${token.refresh_token}`
      }

      // console.log("session_token", token);
      // console.log("session_session", session);

      return Promise.resolve(session)
    }
  },
  secret: 'Nghcaj6wqO5qjAQNs+MalM4aW2mlM3949020-eirsoaA3lLKe78MRag=',
  trustHost: true
});