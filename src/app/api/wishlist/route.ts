import { prisma } from "@/prisma";

export async function POST(request: Request) {
  const { WishList } = await request.json();

  const products = await prisma.product.findMany({
    where: { id: { in: WishList } },
    select: {
      id: true,
      name: true,
      slug: true,
      SKU: true,
      price: true,
      images: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return Response.json(products);
}
