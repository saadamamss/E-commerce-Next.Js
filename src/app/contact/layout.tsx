import Layout from "@/components/HeaderFooterLayout";

export default function ContactLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <Layout>{children}</Layout>;
}
