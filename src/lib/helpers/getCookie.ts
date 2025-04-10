"use server";

import { cookies } from "next/headers";

export default async function getCookies() {
  return await cookies();
}
