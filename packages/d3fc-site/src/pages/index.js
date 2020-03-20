import React from "react";
import { Link } from "gatsby";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeChartRow from "../components/HomeChartRow";
import "../../dist/styles.css";

const Layout = ({ location }) => {
  const { pathname } = location;
  return (
    <>
      <div className="content">
        <Header currentPathname={pathname} />
        <div className="jumbotron">
          <div className="container">
            <div className="row">
              <div className="col-sm-4 col-xs-12">
                <img alt="d3fc" src="/logo.svg" />
                <p>Components for building interactive charts with D3</p>
              </div>
            </div>
          </div>
        </div>
        <HomeChartRow src1="stacked/index.html" src2="bubble/index.html" />
        <div className="features">
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <img alt="module" src="/modular.png" />
                <h3>Modular</h3>
                <p>
                  D3FC is a collection of modules that are designed to make it
                  easier to build charts with D3, extending its vocabulary from
                  SVG paths, rectangles and groups, into series, annotation and
                  chart. You can use the modules independently, or you can use
                  them together as part of the default bundle.
                </p>
              </div>
              <div className="col-sm-4">
                <img alt="responsive" src="/responsive.png" />
                <h3>Responsive</h3>
                <p>
                  With D3FC, building responsive charts that re-render as their
                  size changes is straightforward. For simple charts, use the{" "}
                  <Link to="/api/chart-api">Cartesian chart</Link> component, or
                  create more complex charting layouts with{" "}
                  <Link to="/api/element-api">d3fc-element</Link>.
                </p>
              </div>
              <div className="col-sm-4">
                <img alt="canvas / svg" src="/canvas-svg.png" />
                <h3>Canvas / SVG</h3>
                <p>
                  D3(v4) introduced d3-path, which is an abstraction over SVG
                  and Canvas, allowing path generators to write to both. D3FC
                  embraces this pattern throughout our components, all of the{" "}
                  <Link to="/api/series-api">d3fc-series</Link> components
                  support both Canvas and SVG rendering.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                <img alt="transitions" src="/transitions.png" />
                <h3>Transitions</h3>
                <p>
                  Creating D3 charts where each of the elements transitions
                  correctly is a challenge. All of the D3FC components have been
                  built with{" "}
                  <Link to="/introduction/transitions">
                    transitions support
                  </Link>{" "}
                  included.
                </p>
              </div>
              <div className="col-sm-4">
                <img alt="decorate" src="/decorate.png" />
                <h3>Decorate</h3>
                <p>
                  Most chart APIs are complex and expansive in order to provide
                  flexibility. D3FC takes a fundamentally different approach,
                  where the underlying power of the data-join is exposed via the{" "}
                  <Link to="/introduction/decorate-pattern">
                    decorate pattern
                  </Link>
                  .
                </p>
              </div>
              <div className="col-sm-4">
                <img alt="composition" src="/composition.png" />
                <h3>Composition</h3>
                <p>
                  D3FC favours simple interfaces and composition. If the
                  interface for a component does not fulfil your needs, just
                  open it up, look at the code and make use of the lower-level
                  components that it was built with.
                </p>
              </div>
            </div>
          </div>
        </div>
        <HomeChartRow src1="simple/index.html" src2="streaming/index.html" />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
