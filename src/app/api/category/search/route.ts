import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { ApiLimiter } from "../../routes";
// import { rateLimiter } from "../../routes";
export const revalidate = 3600; // Revalidate every hour (ISR)
export async function GET(request: NextRequest) {
  const access = await ApiLimiter(request);

  if (!access) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }
  const q = request.nextUrl.searchParams.get("q") as string;

  const categories = await prisma.category.findMany({
    where: {
      name: { contains: q },
    },
  });

  return Response.json(categories);
}
