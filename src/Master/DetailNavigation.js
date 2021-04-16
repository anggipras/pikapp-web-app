import React from "react";
import Navbar from "react-bootstrap/Navbar";
// import { Link } from "react-router-dom";
// import Cookies from "js-cookie"

export default class DetailNavigation extends React.Component {
  goBack = () => {
    // let homePage = Cookies.get("lastProduct")
    // window.location.href = homePage
    window.history.back()
  }

  render() {
    return (
      <div>
        <Navbar>
          <Navbar onClick={this.goBack}>
            <img
              src={this.props.backIcon}
              className={"icon"}
              alt={"back"}
            ></img>
          </Navbar>
          <Navbar.Brand className={"navbar-center"}>
            <img src={this.props.centerImage} alt={"title"} class ={this.props.centerStyle}></img>
          </Navbar.Brand>
        </Navbar>
      </div>
    );
  }
}
