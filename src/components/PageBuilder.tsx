import React from "react";
import Layout from "./HeaderFooterLayout";
// import Section from "./Section";

const Section = React.lazy(() => import("./Section"));

const PageBuilder = React.memo(function PageBuilder({
  sections,
}: {
  sections: object;
}) {
  // Sort sections by ID only once during initial render
  const sortedSections = React.useMemo(() => {
    if (!sections) return [];
    return Object.entries(sections).sort((a, b) => a[1].id - b[1].id);
  }, [sections]);

  // Early return if no sections are provided
  if (!sections || sortedSections.length === 0) {
    return (
      <Layout>
        <main className="pt-90">
          <p>No sections available.</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="pt-90">
        {sortedSections.map(([sec_key, sec_value], index) => (

          <Section
            key={`${sec_key}-${index}`}
            section={sec_key}
            data={JSON.stringify(sec_value.fields)}
          />
        ))}
      </main>
    </Layout>
  );
});

export default PageBuilder;
