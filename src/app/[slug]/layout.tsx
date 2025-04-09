import Layout from "@/components/HeaderFooterLayout";

export default function layout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
