import Layout from "@/components/HeaderFooterLayout";

export default function wishlayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <Layout>{children}</Layout>;
}
