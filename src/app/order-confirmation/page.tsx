import { cookies } from "next/headers";

import Orderdetails from "./orderdetails";
import jwt from "jsonwebtoken";
import { prisma } from "@/prisma";
import Layout from "@/components/HeaderFooterLayout";
import { redirect, RedirectType } from "next/navigation";
import { findOrder } from "@/lib/models/Order";

export default async function OrderConfirmation() {
  const cookie = await cookies();
  if (!cookie.has("orderconfirm")) {
    redirect("/cart", RedirectType.replace);
  }

  const orderDetails = await findOrder();
  
  if (!orderDetails) {
    redirect("/cart", RedirectType.replace);
  }

  return (
    <Layout>
      <Orderdetails details={JSON.stringify(orderDetails)} />
    </Layout>
  );
}
