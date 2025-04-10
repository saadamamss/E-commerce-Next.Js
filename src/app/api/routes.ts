import axios from "axios";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const Api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: null,
  },
  withCredentials: true,
});

export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "10 s"), // 10 requests per 10 seconds
});

export async function ApiLimiter(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "localhost";
  const { success } = await ratelimit.limit(ip);

  return success;
}
