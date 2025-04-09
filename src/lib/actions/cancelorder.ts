"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { verifyCsrfToken } from "../utils/csrfVerify";

export async function cancleOrder(prev: any, formData: FormData) {
  const csrfToken = formData.get("csrfToken") as string;
  const verifyCSRF = await verifyCsrfToken(csrfToken);
  if (!csrfToken || !verifyCSRF) {
    return { error: 500, msg: "somthing went wrong!" };
  }

  const orderId = formData.get("orderId") as string;

  try {
    const session = await auth();

    if (!orderId || !session?.user?.id) {
      return { error: 500, msg: "Somthing went error!" };
    }

    // cancel order
    await prisma.orders.update({
      where: {
        id: parseInt(orderId),
        userId: session.user.id,
      },
      data: {
        status: "canceld",
      },
    });

    // delete order
    // await prisma.$transaction(async (prisma) => {
    //   await prisma.orders.delete({
    //     where: {
    //       id: parseInt(orderId),
    //     },
    //   });
    //   await prisma.orderitems.deleteMany({
    //     where: {
    //       orderId: parseInt(orderId),
    //     },
    //   });
    //   await prisma.transaction.delete({
    //     where: {
    //       orderId: parseInt(orderId),
    //     },
    //   });
    // });
    return { success: true, msg: "order canceled" };
  } catch (error) {
    console.log(error);

    return { error: 500, msg: "Somthing went wrong!" };
  }
}
