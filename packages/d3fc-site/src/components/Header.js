import React from "react";
import { Link } from "gatsby";
import classNames from "classnames";
import {
  exampleUrl,
  apiUrl,
  documentationUrl,
  homeUrl,
} from "../static/pageUrls";

const Header = ({ currentPathname }) => (
  <nav className="navbar navbar-inverse">
    <div className="container">
      <div className="navbar-header">
        {currentPathname !== homeUrl && (
          <Link to={homeUrl}>
            <img className="navbar-logo" alt="d3fc" src="/logo.svg" />
          </Link>
        )}
        <button
          type="button"
          className="navbar-toggle"
          data-toggle="collapse"
          data-target=".navbar-collapse"
        >
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </div>
      <div className="navbar-collapse collapse">
        <div
          className={classNames("floating-nav", {
            inverted: currentPathname !== homeUrl,
          })}
        >
          <ul className="nav navbar-nav">
            <li
              className={currentPathname === documentationUrl ? "active" : ""}
            >
              <Link to={documentationUrl}>Documentation</Link>
            </li>
            <li className={currentPathname === apiUrl ? "active" : ""}>
              <Link to={apiUrl}>API</Link>
            </li>
            <li className={currentPathname === exampleUrl ? "active" : ""}>
              <Link to={exampleUrl}>Examples</Link>
            </li>
            <li>
              <a href="https://github.com/d3fc/d3fc">GitHub</a>
            </li>
            <li className="separator"></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);

export default Header;
