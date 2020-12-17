import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import login_illustration from "../../Asset/Illustration/illustration_login.png";
import register_illustration from "../../Asset/Illustration/illustration_register.png";

export class JumbotronView extends React.Component {
  render() {
    const isLogIn = this.props.isLogIn;
    let image;
    if (isLogIn) {
      image = <img src={login_illustration}></img>;
    } else {
      image = <img src={register_illustration}></img>;
    }
    return (
      <div>
        <Jumbotron>
          <h1 class="jumbotron-title" style={{ color: this.props.titleColor }}>
            {this.props.title}
          </h1>
          {image}
        </Jumbotron>
      </div>
    );
  }
}
