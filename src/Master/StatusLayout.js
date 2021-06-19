import React from "react";
import DetailNavigation from "./DetailNavigation";
// import { StatusView } from "../View/Status/StatusView";
import { StatusView } from "../View/Status/StatusViewDev";
import {
  primary_color,
} from "../Asset/Constant/ColorConstant";
import { Container } from "react-bootstrap";
import statusLogo from "../Asset/Illustration/status_illustration2x.png";
import backIcon from "../Asset/Icon/back_icon_alt2x.png";

export default class StatusLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    return (
      // <html>
      //   <header>
      //     <DetailNavigation centerImage={statusLogo} backIcon={backIcon} centerStyle={"statusCenter"} />
      //   </header>
      //   <body>
      //     <Container>
      //       <StatusView />
      //     </Container>
      //   </body>
      // </html>
      <StatusView />
    );
  }
}
