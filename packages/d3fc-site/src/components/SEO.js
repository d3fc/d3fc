import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({ title = "d3fc" }) => (
  <Helmet title={title}>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="A collection of components that make it easy to build interactive charts with D3."
    />
  </Helmet>
);

export default SEO;
