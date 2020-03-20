import React from "react";
import { Link } from "gatsby";

const HomeExampleChart = ({ src }) => (
  <Link to="/examples" className="d3fc-preview-link">
    <div className="d3fc-preview-cover" />
    <iframe className="d3fc-preview-home" title="d3fc-preview" src={src} />
  </Link>
);

export default HomeExampleChart;
