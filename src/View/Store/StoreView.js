import React from "react";
import { Col, Row, Image, Card, Tabs, Tab, Modal } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import queryString from "query-string";
import { Link } from "react-router-dom";

export class StoreView extends React.Component {
  state = {
    data: {
      title: "",
      image: "",
      desc: "",
      data: [
        {
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
    var data = { ...this.state.data };
    data.title = "Location";
    data.image = "";
    data.desc = "This is a store desc";
    data.data.pop();
    data.data.push({
      storeId: "storeId1",
      storeName: "Store Name A",
      storeDesc: "Store Desc A",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    data.data.push({
      storeId: "storeId2",
      storeName: "Store Name B",
      storeDesc: "Store Desc B",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    data.data.push({
      storeId: "storeId1",
      storeName: "Store Name C",
      storeDesc: "Store Desc C",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    data.data.push({
      storeId: "storeId1",
      storeName: "Store Name D",
      storeDesc: "Store Desc D",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    data.data.push({
      storeId: "storeId4",
      storeName: "Store Name B",
      storeDesc: "Store Desc B",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    data.data.push({
      storeId: "storeId4",
      storeName: "Store Name C",
      storeDesc: "Store Desc C",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    data.data.push({
      storeId: "storeId3",
      storeName: "Store Name D",
      storeDesc: "Store Desc D",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });

    data.data.push({
      storeId: "storeId7",
      storeName: "Store Name B",
      storeDesc: "Store Desc B",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    data.data.push({
      storeId: "storeId6",
      storeName: "Store Name C",
      storeDesc: "Store Desc C",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    data.data.push({
      storeId: "storeId9",
      storeName: "Store Name D",
      storeDesc: "Store Desc D",
      storeImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    });
    this.setState({ data: data });
  }

  handleDetail(data) {
    return <Link to={"/status"}>asd</Link>;
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
                    to={"/store"}
                    style={{
                      padding: 8,
                      textDecoration: "none",
                      color: "black",
                    }}
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
