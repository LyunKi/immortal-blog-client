import React from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import search from "../../assets/icons/search.svg";

const Header = () => {
  const logo = "https://www.linpx.com/usr/themes/pinghsu/images/logo.png";
  return (
    <header className={"immortal-header"}>
      <div className={"content"}>
        <Link to={"/"}>
          <img src={logo} alt="LiNPX" />
        </Link>
        <div className={"navbar-menu"}>
          <Link className={"menu-item"} to={"Archives"}>
            Archives
          </Link>
          <Link className={"menu-item"} to={"Links"}>
            Links
          </Link>
          <Link className={"menu-item"} to={"About"}>
            About
          </Link>
          <Link className={"menu-item search"} to={"Search"}>
            <img alt={"search"} src={search} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
