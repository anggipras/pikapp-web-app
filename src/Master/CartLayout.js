import React from "react";
import DetailNavigation from "./DetailNavigation";
import CartView from "../View/Cart/CartView";
import {
  secondary_color,
} from "../Asset/Constant/ColorConstant";
import { Container } from "react-bootstrap";
import cartLogo from "../Asset/Illustration/cart_illustration2x.png";
import backIcon from "../Asset/Icon/back_icon2x.png";
import queryString from "query-string"

export default class CartLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = secondary_color;
    }
    
    render() {
    const value = queryString.parse(window.location.search);
    console.log(value.table);
    return (
      <html>
        <header>
          <DetailNavigation centerImage={cartLogo} backIcon={backIcon} centerStyle={"cartCenter"}/>
        </header>
        <body>
          <Container>
            <CartView noTable={value}/>
          </Container>
        </body>
      </html>
    );
  }
}
