import { prisma } from "@/prisma";

import { NextRequest } from "next/server";
// import { rateLimiter } from "../routes";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const prodId = parseInt(searchParams.get("id") as string);

  const data = await prisma.product.findUnique({
    where: { id: prodId },
    select:{
      variantType:true,
      variants:{
        omit: {
          productId: true,
          createdAt: true,
          updatedAt: true,
        },
      }
    }
  });

  return Response.json(data);
}
