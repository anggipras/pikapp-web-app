import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import bellIcon from "../Asset/Icon/icon_bell2x.png";
import profileIcon from "../Asset/Icon/icon_profile2x.png";
import logo from "../Asset/Logo/logo4x.png";
import Cookies from "js-cookie";
import orderIcon from "../Asset/Icon/OrderIcon.png";

export default class MainNavigation extends React.Component {
  state = {
    isLogin : false
  }

  componentDidMount() {
    document.body.style.backgroundColor = 'white';
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
            <Link to={homePage}> <img src={logo} alt={"logo"} class="icon"></img> </Link>
          </Navbar>

          <Navbar.Collapse className="justify-content-end">
            <Link to={"/status"}>
              <img src={orderIcon} class="iconStatus" alt={"status"}></img>
            </Link>
          </Navbar.Collapse>
        </Navbar>

        {/* <Navbar.Collapse className="justify-content-end">
            <Link to={"/profile"}>
              <img src={profileIcon} class="icon" alt={"profile"}></img>
            </Link>
          </Navbar.Collapse> */}

        <div className='listTitle'>
            <h2 className='listTitleContent'>Daftar Restoran</h2>
        </div>
      </div>
    );
  }
}
