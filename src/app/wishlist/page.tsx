import { prisma } from "@/prisma";
import { cookies } from "next/headers";
import WishlistContent from "./combonent/content";
import EmptyWishlist from "./combonent/empty";


export default async function WishList() {
  const cookie = (await cookies()).get("wishlist");

  if (!cookie) {
    return <EmptyWishlist />;
  }
  const wishlistArr = JSON.parse(cookie.value) as number[];
  if (!wishlistArr.length) return <EmptyWishlist />;
  
  // get products
  const products = await prisma.product.findMany({
    where: { id: { in: wishlistArr } },
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

  return <WishlistContent data={JSON.stringify(products)} />;
}
