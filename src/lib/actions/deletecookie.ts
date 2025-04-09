"use server";

import { cookies } from "next/headers";

export async function deleteCookie(cookie: string) {
  (await cookies()).delete(cookie);
}
