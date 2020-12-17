import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export default class DetailNavigation extends React.Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar>
            <Link to={"/"}>
              <img
                src={this.props.backIcon}
                className={"icon"}
                alt={"back"}
              ></img>
            </Link>
          </Navbar>
          <Navbar.Brand class="navbar-center">
            <img src={this.props.centerImage} alt={"title"}></img>
          </Navbar.Brand>
        </Navbar>
      </div>
    );
  }
}
