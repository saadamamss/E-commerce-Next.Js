import Layout from "@/components/HeaderFooterLayout";
import React from "react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <Layout>{children}</Layout>;
}
