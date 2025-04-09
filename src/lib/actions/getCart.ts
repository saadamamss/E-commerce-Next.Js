import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { MappingCartItems } from "@/app/api/cart/Cart";
type CartItem = {
  key: string;
  productId: number;
  variantId: number;
  qty: number;
};

type CartType = {
  items: CartItem[];
  couponApplied: boolean;
  couponCode?: string | null;
  couponDiscount?: number;
  subTotal: number;
  total: number;
};

export async function getCart() {
  const cartToken = (await cookies()).get("cart")?.value as string;
  const cart = await new Promise<string | null>((resolve) => {
    jwt.verify(
      cartToken,
      process.env.JWT_SECRET as string,
      async (err, decode) => {
        if (!err) {
          const cartData = decode as jwt.JwtPayload & CartType;
          const items = await MappingCartItems(cartData);

          resolve(JSON.stringify({ ...cartData, items }));
        }
        resolve(null);
      }
    );
  });

  return cart;
}
