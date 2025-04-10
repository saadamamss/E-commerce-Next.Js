"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/prisma";
export async function findOrder() {
  const orderToken = (await cookies()).get("orderconfirm")?.value as string;

  const orderDetails = await new Promise((resolve) => {
    jwt.verify(
      orderToken,
      process.env.JWT_SECRET as string,
      async (err, decode) => {
        if (!err) {
          const id = (decode as jwt.JwtPayload).orderId;
          const order = await getOrder(id);

          resolve(order);
        }
        resolve(null);
      }
    );
  });

  return orderDetails;
}

async function getOrder(id: number) {
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
          variant: {
            omit: {
              createdAt: true,
              updatedAt: true,
              productId: true,
            },
          },
        },
      },
    },
  });

  return order;
}
