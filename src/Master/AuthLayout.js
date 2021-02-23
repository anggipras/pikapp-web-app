import React from "react";
import { JumbotronView } from "../View/Main/JumbotronView";
import FormView from "../View/Auth/FormView";
import { Container } from "react-bootstrap";
import {
  primary_color,
  secondary_color,
} from "../Asset/Constant/ColorConstant";

export default class LoginLayout extends React.Component {
  state = {
    title: "",
    titleColor: "",
    buttonColor: "",
  };

  componentDidMount() {
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
