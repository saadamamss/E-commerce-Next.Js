import Layout from "@/components/HeaderFooterLayout";

export default function CartLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
