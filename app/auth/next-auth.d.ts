import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      sub: number;
      name: string;
      prenom: string;
      telephone: string;
      email: string;
      username: null;
      privilege_user: string;
      iat: number;
      exp: number;
    },
    token: {
      access_token: string,
      refresh_token: string
    }
  }


}


declare module "next-auth/jwt" {

  interface JWT {
    user: {
      sub: number;
      nom: string;
      prenom: string;
      telephone: string;
      email: string;
      username: null;
      privilege_user: string;
      iat: number;
      exp: number;
    },
    token: {
      access_token: string
      refresh_token: string
    }
  }
}
