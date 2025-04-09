import { auth } from "@/auth";

import axios from "axios";
import Redis from "ioredis";
// utils/rateLimiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";
// const token = (await auth());

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

// const redis = new Redis(process.env.REDIS_URL!);

// export const rateLimiter = async (
//   ip: string,
//   limit: number = 50,
//   windowMs: number = 10000
// ) => {
//   const key = `rate-limit:${ip}`;

//   // Get the current request count
//   const currentCount = await redis.incr(key);

//   // If this is the first request, set an expiration time
//   if (currentCount === 1) {
//     await redis.expire(key, windowMs / 1000);
//   }

//   // Check if the request count exceeds the limit
//   if (currentCount > limit) {
//     return { success: false };
//   }

//   return { success: true };
// };
