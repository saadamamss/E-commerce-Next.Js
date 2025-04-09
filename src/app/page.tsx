import PageBuilder from "@/components/PageBuilder";
import { findPage } from "@/lib/helpers/functions";
import { notFound } from "next/navigation";

export default async function Home() {
  const pageFound = await findPage("/");
  // if page not found
  if (!pageFound) return notFound();

  
  const sections = pageFound?.content as object;
  return <PageBuilder sections={sections} />;
}
