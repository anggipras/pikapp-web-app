import React from "react";
import MainNavigation from "./MainNavigation";
import { StoreView } from "../View/Store/StoreView";
import {
  primary_color,
  secondary_color,
} from "../Asset/Constant/ColorConstant";
import { Container } from "react-bootstrap";

export default class StoreLayout extends React.Component {
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
            <StoreView />
          </Container>
        </body>
      </html>
    );
  }
}
