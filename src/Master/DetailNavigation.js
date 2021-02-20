import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Cookies from "js-cookie"

export default class DetailNavigation extends React.Component {
  render() {
    let homePage = "/" + Cookies.get("homePage")
    return (
      <div>
        <Navbar>
          <Navbar>
            <Link to={homePage}>
              <img
                src={this.props.backIcon}
                className={"icon"}
                alt={"back"}
              ></img>
            </Link>
          </Navbar>
          <Navbar.Brand className={"navbar-center"}>
            <img src={this.props.centerImage} alt={"title"} class ={this.props.centerStyle}></img>
          </Navbar.Brand>
        </Navbar>
      </div>
    );
  }
}
