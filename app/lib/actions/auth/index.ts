"use server";

import { signIn, signOut } from "@/app/(core)/auth/[...nextauth]";
import { AuthError } from "next-auth";
import { CreateAbonnementDto, CreateUserDto, Token } from "@/app/types/interfaces";
import { HttpRequest, api_url } from "../../actions/action";
import { redirect } from "next/navigation";
import { PrivilegesEnum } from "@/app/types/enums/privilege.enum";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const req = await signIn("credentials", formData);
    console.log("authenticate req ", req);
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
  }
}

export async function authSignOutUser() {
  await signOut();
  redirect("/")
}

export async function authSigninUser({
  telephone,
  password,
}: {
  telephone: string;
  password: string;
}) {
  try {
    const res = await fetch(`${api_url}auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ telephone, password }),
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function authSignUpUser(dto: CreateUserDto) {
  try {
    const res: Response = await fetch(`${api_url}auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function refreshAccessToken(token: Token) {
  try {
    const response = await fetch(`${api_url}auth/refresh`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.refresh_token}`,
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const Abonnement_access = async (dto: CreateAbonnementDto) => await HttpRequest('abonnement', 'POST', dto);

export const findUserByIdApi = async (id: number) => await HttpRequest(`auth/getUserById/${id}`, 'GET');

export const checkValidateCodeApi = async (code: string, tel: string) => await HttpRequest(`auth/checkValideCode`, "POST", { code, tel })
export const AuthsendSmsByTelApi = async (dto: { tel: string; email: string }) => await HttpRequest(`auth/sendSmsByTel?telephone=${dto.tel}&email=${dto.email}`, "GET");

export const findUserByPrivilegeApi  = async (type: PrivilegesEnum) => await HttpRequest(`auth/findUserByPrivilege/${type}`, "GET");