import React from "react";
import MainNavigation from "./MainNavigation";
import StoreView from "../View/Store/StoreView";
import {
  secondary_color,
} from "../Asset/Constant/ColorConstant";
import { Container } from "react-bootstrap";
import Cookies from "js-cookie"

export default class StoreLayout extends React.Component {
  state = {
    isLogin: false
  }

  componentDidMount() {
    document.body.style.backgroundColor = secondary_color;
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
    return (
      <>
        <MainNavigation />
        {
          this.state.isLogin ?
            <Container>
              <div className='container2'>
                <StoreView />
              </div>
            </Container>
            :
            <Container style={{ marginTop: "50px" }}>
              <div className='container2'>
                <StoreView />
              </div>
            </Container>
        }
      </>
    );
  }
}
