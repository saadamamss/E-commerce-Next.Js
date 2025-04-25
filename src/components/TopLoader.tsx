"use client";
import NextTopLoader from "nextjs-toploader";
const PageProgressBar = () => {
  return (
    <NextTopLoader
      color="#1a1a1a"
      initialPosition={0.08}
      crawlSpeed={200}
      height={2}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #1a1a1a,0 0 5px #1a1a1a"
      zIndex={1600}
      showAtBottom={false}
    />
  );
};

export default PageProgressBar;
