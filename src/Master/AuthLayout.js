import React from "react";
import { JumbotronView } from "../View/Main/JumbotronView";
import FormView from "../View/Auth/FormView";
import { Container } from "react-bootstrap";
import {
  primary_color,
  secondary_color,
} from "../Asset/Constant/ColorConstant";
import Cookies from "js-cookie";

export default class LoginLayout extends React.Component {
  state = {
    title: "",
    titleColor: "",
    buttonColor: "",
    keepLogin: true
  };

  componentDidMount() {
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }
    if (auth.isLogged) {
      var getLocation = JSON.parse(localStorage.getItem("longlat"))
      var latitude = getLocation.lat
      var longitude = getLocation.lon
      if (Cookies.get("lastLink") !== undefined) {
        var lastlink = JSON.parse(Cookies.get("lastLink")).value
        if (lastlink.includes("?latitude") || lastlink.includes("store?")) {
          window.location.href = JSON.parse(Cookies.get("lastLink")).value
        } else {
          window.location.href = JSON.parse(Cookies.get("lastLink")).value + `?latitude=${latitude}&longitude=${longitude}`
        }
      } else {
        window.location.href = window.location.origin + `?latitude=${latitude}&longitude=${longitude}`
      }
    } else {
      this.setState({ keepLogin: false })
    }

    const isLogin = this.props.isLogin;
    if (isLogin) {
      document.body.style.backgroundColor = primary_color;
      this.setState({ title: "Login" });
      this.setState({ titleColor: "black" });
      this.setState({ buttonColor: secondary_color });
    } else {
      document.body.style.backgroundColor = secondary_color;
      this.setState({ title: "Register" });
      this.setState({ titleColor: "white" });
      this.setState({ buttonColor: primary_color });
    }
  }

  render() {
    if (this.state.keepLogin) {
      return <div></div>
    }
    return (
      <div class="wrapper">
        <JumbotronView
          title={this.state.title}
          titleColor={this.state.titleColor}
          isLogIn={this.props.isLogin}
        />
        <Container>
          <FormView isLogIn={this.props.isLogin} />
        </Container>
      </div>
    );
  }
}
