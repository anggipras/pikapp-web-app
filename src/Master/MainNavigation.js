import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import bellIcon from "../Asset/Icon/icon_bell2x.png";
import profileIcon from "../Asset/Icon/icon_profile2x.png";
import logo from "../Asset/Logo/logo2x.png";
import Cookies from "js-cookie"

export default class MainNavigation extends React.Component {
  state = {
    isLogin : false
  }

  componentDidMount() {
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"));
      this.setState({ isLogin: auth.isLogged });
    }
  }

  render() {
    let homePage = "/" + Cookies.get("homePage")
    return (
      <div>
        <Navbar>
          <Navbar>
            { this.state.isLogin ?
              <Link to={"/status"}>
                <img src={bellIcon} class="icon" alt={"status"}></img>
              </Link>
              :
              <div></div>
            }
          </Navbar>
          {
            this.state.isLogin ?
            <Navbar.Brand class="navbar-center">
              <Link to={homePage}> <img src={logo} alt={"logo"} class="icon"></img> </Link>
            </Navbar.Brand>
            :
            <Navbar.Brand class="navbar-center" style={{marginTop: "45px"}}>
              <Link to={homePage}> <img src={logo} alt={"logo"} class="icon"></img> </Link>
            </Navbar.Brand>
          }
          
          <Navbar.Collapse className="justify-content-end">
            { this.state.isLogin ?
              <Link to={"/profile"}>
                <img src={profileIcon} class="icon" alt={"profile"}></img>
              </Link>
              :
              <div></div>
            }
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
