import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import bellIcon from "../Asset/Icon/icon_bell2x.png";
import profileIcon from "../Asset/Icon/icon_profile2x.png";
import logo from "../Asset/Logo/logo2x.png";
import Cookies from "js-cookie"

export default class MainNavigation extends React.Component {
  render() {
    let homePage = "/" + Cookies.get("homePage")
    return (
      <div>
        <Navbar>
          <Navbar>
            <Link to={"/status"}>
              <img src={bellIcon} class="icon" alt={"status"}></img>
            </Link>
          </Navbar>
          <Navbar.Brand class="navbar-center">
            <Link to={homePage}> <img src={logo} alt={"logo"} class="icon"></img> </Link>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Link to={homePage}>
              <img src={profileIcon} class="icon" alt={"profile"}></img>
            </Link>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
