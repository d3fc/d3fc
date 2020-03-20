import React from "react";

const BlockExample = ({ user, block, title }) => {
  const url = `https://bl.ocks.org/${user}/${block}`;
  const backgroundImage = `https://gist.githubusercontent.com/${user}/${block}/raw/thumbnail.png`;
  return (
    <div className="gist col-md-4 col-xs-6">
      <a href={url} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="title">{title}</div>
      </a>
    </div>
  );
};

export default BlockExample;
