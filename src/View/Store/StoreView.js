import React from "react";
import { Col, Row, Image, Card, Tabs, Tab, Modal } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { address } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";
import { auth, currentMerchant } from "../..";

export class StoreView extends React.Component {
  state = {
    data: {
      title: "",
      image: "",
      desc: "",
      data: [
        {
          address: "",
          rating: "",
          logo: "",
          distance: "",
          storeId: "",
          storeName: "",
          storeDesc: "",
          storeImage: "",
        },
      ],
    },
  };

  componentDidMount() {
    const value = queryString.parse(window.location.search);
    const longitude = value.longitude;
    const latitude = value.latitude;
    const merchant = value.merchant;

    let addressRoute;
    if (merchant === null) {
      addressRoute =
        address + "home/v1/merchant/" + longitude + "/" + latitude;
    } else {
      addressRoute =
        address +
        "home/v1/merchant/" +
        longitude +
        "/" +
        latitude +
        "/" +
        merchant;
    }
    addressRoute = "https://dev-api.pikapp.id/home/v1/merchant/106.634157/-6.234916/ALL/"
    var stateData;
    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    Axios(addressRoute, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": "abf0e2a9-e9ee-440f-8563-94481c64b797",
        "token": "PUBLIC",
        "category": "1",
      },
      method: "GET",
    })
      .then((res) => {
          stateData = { ...this.state.data };
          let responseDatas = res.data;
          stateData.data.pop();
          responseDatas.results.forEach((data) => {
            stateData.data.push({
                address: data.merchant_address,
                rating: data.merchant_rating,
                logo: data.merchant_logo,
                distance: data.merchant_distance,
                storeId: data.mid,
                storeName: data.merchant_name,
                storeDesc: "",
                storeImage: data.merchant_pict,
            })
          })
          this.setState({ data: stateData });
      })
      .catch((err) => {
      });

    // var data = { ...this.state.data };
    // data.title = "Location";
    // data.image = "";
    // data.desc = "This is a store desc";
    // data.data.pop();
    // data.data.push({
    //   address: "address",
    //   rating: "1",
    //   logo: "logo",
    //   distance: "1",
    //   storeId: "1",
    //   storeName: "name",
    //   storeDesc: "",
    //   storeImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    // });
    // this.setState({ data: data });

  }

  storeClick = (e) => {
    currentMerchant.mid = e.storeId;
    currentMerchant.storeName = e.storeName;
    currentMerchant.storeDesc = "Desc";
    currentMerchant.distance = e.distance;
    currentMerchant.storeImage = e.storeImage;
    console.log(e.distance)

    localStorage.setItem("currentMerchant", currentMerchant)
  }
  handleDetail(data) {
    return <Link to={"/status"}></Link>;
  }

  render() {
    const storeDatas = this.state.data.data.map((data) => {
      return data;
    });
    var allCards = storeDatas.map((cardData) => {
      return (
        <Row>
          <Col xs={4} md={3}>
            <Image
              src={cardData.storeImage}
              rounded
              fluid
              className="storeImage"
            />
          </Col>
          <Col xs={8} md={6}>
            <Row>
              <Col xs={7} md={9}>
                <h5 className="foodTitle">{cardData.storeName}</h5>
                <p className="storeDesc">{cardData.storeDesc}</p>
                <div className="foodButton">
                  <Link
                    className={"btn-cartPika"}
                    to={"/store?mid=" + cardData.storeId}
                    style={{
                      padding: 8,
                      textDecoration: "none",
                      color: "black",
                    }}
                    onClick={()=> this.storeClick(cardData)}
                  >
                    Go to store
                  </Link>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    });

    return (
      <div>
        <Row>
          <Col xs={4} md={2}>
            <Image
              src="https://2.img-dpreview.com/files/p/E~TS590x0~articles/5081755051/0652566517.jpeg"
              roundedCircle
              className="storeImage"
            />
          </Col>
          <Col xs={8} md={4} className="storeColumn">
            <h2 className="storeLabel" style={{ textAlign: "left" }}>
              {this.state.data.title}
            </h2>
            <p className="storeLabel" style={{ textAlign: "left" }}>
              {this.state.data.desc}
            </p>
          </Col>
          <Col />
        </Row>
        <Row />
        <Row>
          <Col md={12}>{allCards}</Col>
        </Row>
        <Row></Row>
      </div>
    );
  }
}
