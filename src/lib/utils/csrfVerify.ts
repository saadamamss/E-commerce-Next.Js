"use server";
import { cookies } from "next/headers";

export async function getServerCsrfToken() {
  const csrfCookie = (await cookies()).get("authjs.csrf-token")?.value;
  if (!csrfCookie) return null;

  // The cookie is in the format "token|hash"
  const [token] = csrfCookie.split("|");
  return token;
}

export async function verifyCsrfToken(submittedToken: string) {
  const serverToken = await getServerCsrfToken();
  return serverToken === submittedToken;
}
