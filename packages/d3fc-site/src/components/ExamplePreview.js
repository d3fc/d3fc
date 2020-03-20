import React from "react";
import { Link } from "gatsby";

const ExamplePreview = ({ directory, title }) => {
  const url = `/examples/${directory}`;
  const backgroundImagePath = `${directory}/screenshot.png`;

  return (
    <div className="gist col-md-4 col-xs-6">
      <Link
        to={url}
        style={{
          backgroundImage: `url(${backgroundImagePath})`,
        }}
      >
        <div className="title">{title}</div>
      </Link>
    </div>
  );
};

export default ExamplePreview;
