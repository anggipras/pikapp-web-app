import React from "react";
import MainNavigation from "./MainNavigation";
import StoreView from "../View/Store/StoreView";
import {
  secondary_color,
} from "../Asset/Constant/ColorConstant";
import { Container } from "react-bootstrap";

export default class StoreLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = secondary_color;
  }

  render() {
    return (
      <>
        <MainNavigation />
        <Container>
          <StoreView />
        </Container>
      </>
    );
  }
}
