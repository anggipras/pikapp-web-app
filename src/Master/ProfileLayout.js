import React from "react";
import MainNavigation from "./MainNavigation";
import ProfileView from "../View/Profile/ProfileView";
import {
  secondary_color,
} from "../Asset/Constant/ColorConstant";
import { Container } from "react-bootstrap";

export default class ProfileLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = secondary_color;
  }

  render() {
    return (
      <html>
        <header>
          <MainNavigation />
        </header>
        <body>
          <Container>
            <ProfileView />
          </Container>
        </body>
      </html>
    );
  }
}
