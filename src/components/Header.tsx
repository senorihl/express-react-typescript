import React from "react";
import { NavLink } from "react-router-dom";

import "../styling/Header.scss";

const Header: React.FC = () => {
  return (
    <nav className="app-header">
      <ul>
        <li>
          <NavLink to={"/"} exact>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to={"/home"} exact>
            Home (with redirect)
          </NavLink>
        </li>
        <li>
          <NavLink to={"/about"} exact>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to={"/legal"} exact>
            Legal
          </NavLink>
        </li>
        <li>
          <NavLink to={"/totally-not-found"} exact>
            Not found
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
