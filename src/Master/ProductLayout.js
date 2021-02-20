import React from "react";
import MainNavigation from "./MainNavigation";
import { ProductView } from "../View/Product/ProductView";
import {
  secondary_color,
} from "../Asset/Constant/ColorConstant";
import { Container } from "react-bootstrap";

export default class MainLayout extends React.Component {
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
            <ProductView />
          </Container>
        </body>
      </html>
    );
  }
}
