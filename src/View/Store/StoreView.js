import React from "react";
import { Col, Row, Image } from "react-bootstrap";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { address, clientId, googleKey } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";
import Cookies from "js-cookie"
import Geocode from "react-geocode"

export class StoreView extends React.Component {
  state = {
    location: "",
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
    Cookies.set("homePage", window.location.search)
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if(Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }
    if(auth.isLogged === false) {
      var lastLink = { value: window.location.href}
      Cookies.set("lastLink", lastLink,{ expires: 1})
      window.location.href = "/login"
    }
    const value = queryString.parse(window.location.search);
    var longitude = "";
    longitude = value.longitude;
    var latitude = "";
    latitude = value.latitude
    var merchant = "";
    merchant = value.merchant;
    Geocode.setApiKey(googleKey)
    Geocode.fromLatLng(latitude,longitude)
    .then((res) => {
      this.setState({location: res.results[0].formatted_address})
    })
    .catch((err) => {
      this.setState({location: "Tidak tersedia"})
    })

    let addressRoute;
    if (merchant === undefined) {
      addressRoute =
        address + "home/v1/merchant/" + longitude + "/" + latitude + "/ALL/";
    } else {
      addressRoute =
        address +
        "home/v1/merchant/" +
        longitude +
        "/" +
        latitude +
        "/" +
        merchant
        + "/"
    }
    var stateData;
    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    Axios(addressRoute, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
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
    var currentMerchant = {
      mid: "",
      storeName: "",
      storeDesc: "",
      distance: "",
      storeImage: "",
    };
    currentMerchant.mid = e.storeId;
    currentMerchant.storeName = e.storeName;
    currentMerchant.storeDesc = "Desc";
    currentMerchant.distance = e.distance;
    currentMerchant.storeImage = e.storeImage;

    Cookies.set("currentMerchant", currentMerchant, {expires: 1})
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
          <Col xs={3} md={3}>
            <Image
              src={cardData.storeImage}
              rounded
              fluid
              className="storeImage"
            />
          </Col>
          <Col xs={9} md={6}>
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
          <Col xs={4} md={1}/>
          <Col xs={0} md={4} className="storeColumn">
            <h6 className="" style={{ textAlign: "left" }}>
              Lokasi:
            </h6>
            <p className="storeLabel" style={{ textAlign: "left" }}>
              {this.state.location}
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
