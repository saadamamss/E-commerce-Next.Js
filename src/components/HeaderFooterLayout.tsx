import Footer from "./Footer";
import Header from "./Header";
import PageProgressBar from "@/components/TopLoader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageProgressBar />
      <Header />
      {children}
      <Footer />
    </>
  );
}
