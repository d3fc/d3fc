import React from "react";
import HomeExampleChart from "./HomeExampleChart";

const HomeChartRow = ({ src1, src2 }) => (
  <div className="top-chart container">
    <div className="row">
      <div className="col-md-6">
        <HomeExampleChart src={src1} />
      </div>
      <div className="col-md-6">
        <HomeExampleChart src={src2} />
      </div>
    </div>
  </div>
);

export default HomeChartRow;
