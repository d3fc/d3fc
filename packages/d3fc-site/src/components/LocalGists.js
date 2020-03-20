import React from "react";
import ExamplePreview from "./ExamplePreview";

const LocalGists = ({ examplesBySection }) => (
  <>
    {Object.keys(examplesBySection).map(section => {
      const gists = examplesBySection[section];
      const headerId = section.toLowerCase().replace(" ", "-");
      return (
        <React.Fragment key={section}>
          <h2 id={headerId}>{section}</h2>
          <div className="gists">
            {gists.map(({ slug, title }) => (
              <ExamplePreview key={slug} directory={slug} title={title} />
            ))}
          </div>
        </React.Fragment>
      );
    })}
  </>
);

export default LocalGists;
