import React from "react";
import { Link } from "gatsby";

const SideBar = () => (
  <nav className="col-sm-3 hidden-xs nav-container">
    <ul className="nav nav-stacked fixed nav-sidebar">
      <li>
        <Link to="/introduction/getting-started" activeClassName="active">
          Getting Started
        </Link>
      </li>
      <li>
        <Link to="/introduction/building-a-chart" activeClassName="active">
          Building A Chart
        </Link>
      </li>
      <li>
        <Link to="/introduction/component-design" activeClassName="active">
          Component Design
        </Link>
      </li>
      <li>
        <Link to="/introduction/decorate-pattern" activeClassName="active">
          Decorate Pattern
        </Link>
      </li>
      <li>
        <Link to="/introduction/transitions" activeClassName="active">
          Transitions
        </Link>
      </li>
    </ul>
  </nav>
);

export default SideBar;
