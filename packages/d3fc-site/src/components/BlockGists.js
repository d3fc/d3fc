import React from "react";
import BlockExample from "./BlockExample";

const BlockGists = ({ title, gists }) => {
  const titleId = title
    .split(" ")
    .join("-")
    .toLowerCase();
  return (
    <>
      <h2 id={titleId}>{title}</h2>
      <div className="gists">
        {gists.map(({ user, block, title }) => (
          <BlockExample key={block} user={user} block={block} title={title} />
        ))}
      </div>
    </>
  );
};

export default BlockGists;
