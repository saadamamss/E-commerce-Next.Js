import { cookies } from "next/headers";

import Orderdetails from "./orderdetails";
import jwt from "jsonwebtoken";
import { prisma } from "@/prisma";
import Layout from "@/components/HeaderFooterLayout";
import { redirect, RedirectType } from "next/navigation";
import { deleteCookie } from "@/lib/actions/deletecookie";

export default async function OrderConfirmation() {
  const cookie = await cookies();
  if (!cookie.has("orderconfirm")) {
    redirect("/cart", RedirectType.replace);
  }
  const orderToken = cookie.get("orderconfirm")?.value as string;

  const orderDetails = await new Promise((resolve) => {
    jwt.verify(
      orderToken,
      process.env.JWT_SECRET as string,
      async (err, decode) => {
        if (!err) {
          const id = (decode as jwt.JwtPayload).orderId;
          const order = await prisma.orders.findUnique({
            where: {
              id: id,
            },
            select: {
              total: true,
              subTotal: true,
              id: true,
              createdAt: true,
              status: true,
              discount: true,
              shipCost: true,
              orderitems: {
                select: {
                  id: true,
                  qty: true,
                  product: {
                    select: { name: true },
                  },
                  varinat: true,
                },
              },
            },
          });
          resolve(order);
        }
        resolve(null);
      }
    );
  });
  if (!orderDetails) {
    redirect("/cart", RedirectType.replace);
  }

  return (
    <Layout>
      <Orderdetails details={JSON.stringify(orderDetails)} />
    </Layout>
  );
}
