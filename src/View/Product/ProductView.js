import React from "react";
import { Col, Row, Image, Card, Tabs, Tab } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import { PikaModal } from "../../Component/Modal/PikaModal";
import queryString from "query-string";
import { cart } from "../../index.js";
import cartIcon from "../../Asset/Icon/cart_icon.png";
import { Link } from "react-router-dom";
import { address, clientId, secret } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import Cookies from "js-cookie"

var currentExt = {
  detailCategory: [
    {
      name: "",
      amount: 0,
    },
  ],
  note: "",
};

export class ProductView extends React.Component {
  state = {
    showModal: false,
    data: {
      mid: "",
      title: "",
      image: "",
      desc: "",
      data: [
        {
          productId: "",
          category: "",
          foodName: "",
          foodDesc: "",
          foodPrice: 0,
          foodImage: "",
          foodExt: [
            {
              name: "",
              amount: 0,
            },
          ],
        },
      ],
      currentData: {
        productId: "",
        category: "",
        foodName: "",
        foodDesc: "",
        foodPrice: 0,
        foodImage: "",
        foodExt: [
          {
            name: "",
            amount: 0,
          },
        ],
      },
    },
  };

  componentDidMount() {
    console.log(cart)
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
    var currentMerchant = JSON.parse(Cookies.get("currentMerchant"))
    console.log(auth)
    const value = queryString.parse(window.location.search);
    const mid = value.mid;
    let addressRoute = address + "home/v1/list/product/";
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
        "mid": mid,
      },
      method: "GET",
    })
    .then((res) => {
        stateData = { ...this.state.data };
        let responseDatas = res.data.results;
        stateData.data.pop();
        stateData.mid = mid;
        stateData.title = currentMerchant.storeName;
        stateData.image = currentMerchant.storeImage;
        stateData.desc = currentMerchant.storeDistance;
        stateData.data.push({
          category: "All Category",
          productId: "",
          foodName: "",
          foodDesc: "",
          foodPrice: "",
          foodImage: "",
        })
        responseDatas.forEach((data) => {
          stateData.data.push({
              productId: data.product_id,
              foodName: data.product_name,
              foodDesc: "",
              foodPrice: data.product_price,
              foodImage: data.product_picture[0],
          })
        })
      this.setState({ data: stateData });
    })
    .catch((err) => {
    });

    // var data = { ...this.state.data };
    // data.title = "Store Name";
    // data.image = "";
    // data.desc = "This is a store desc";
    // data.data.pop();
    // data.data.push({
    //   category: "All Category",
    //   productId: "data.product_id",
    //   foodName: "data.product_name",
    //   foodDesc: "",
    //   foodPrice: 1,
    //   foodImage: "data.product_picture",
    // });
    // data.data.push({
    //   category: "",
    //   productId: "data.product_id",
    //   foodName: "data.product_name",
    //   foodDesc: "",
    //   foodPrice: 1,
    //   foodImage: "data.product_picture",
    // });
    // this.setState({data: data})
  }

  handleDetail(data) {
    this.setState({ currentData: data });
    this.setState({ showModal: true });
  }

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }

  handleCart = (data) => {
    currentExt = data;
  };

  handleAddCart = () => {
    var currentMerchant = JSON.parse(Cookies.get("currentMerchant"))
    const value = queryString.parse(window.location.search);
    const mid = value.mid;
    this.setModal(false);
    var isStorePresent = false;
    cart.forEach((data) => {
      console.log(data.mid)
      console.log(this.state.data.mid)
      if (data.mid === this.state.data.mid) {
        isStorePresent = true;
      }
    });

    var isDuplicate = false;
    cart.forEach((data) => {
      if (data.mid === this.state.data.mid) {
        data.food.forEach((food) => {
          if (food.productId === this.state.currentData.productId) {
            isDuplicate = true;
          }
        });
      }
    });


    if (isStorePresent === true) {
      if (isDuplicate === true) {
        cart.forEach((data) => {
          if (data.mid === this.state.data.mid) {
            data.food.forEach((food) => {

              if (food.productId === this.state.currentData.productId) {
                food.foodAmount += currentExt.detailCategory[0].amount;
              }
            });
          }
        });
      } else {
        cart.forEach((data) => {
          if (data.mid === this.state.data.mid) {
            data.food.push({
              productId: this.state.currentData.productId,
              foodName: this.state.currentData.foodName,
              foodPrice: this.state.currentData.foodPrice,
              foodImage: this.state.currentData.foodImage,
              foodAmount: currentExt.detailCategory[0].amount,
              foodNote: currentExt.note,
            });
          }
        });
      }
    } else {
      cart.push({
        mid: mid,
        storeName: currentMerchant.storeName,
        storeDesc: currentMerchant.storeDesc,
        storeDistance: currentMerchant.distance,
        food: [
          {
            productId: this.state.currentData.productId,
            foodName: this.state.currentData.foodName,
            foodPrice: this.state.currentData.foodPrice,
            foodImage: this.state.currentData.foodImage,
            foodAmount: currentExt.detailCategory[0].amount,
            foodNote: currentExt.note,
          },
        ],
      });
    }
    let addedMerchants = []
    if(Cookies.get("addedMerchants") === undefined) {
      if(!addedMerchants.includes(mid)) {
        addedMerchants.push(mid)
        Cookies.set("addedMerchants", addedMerchants)
      }
    } else {
      addedMerchants = JSON.parse(Cookies.get("addedMerchants"))
      if(!addedMerchants.includes(mid)) {
        addedMerchants.push(mid)
        Cookies.set("addedMerchants", addedMerchants)
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));

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
    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replaceAll("-", "");
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
    Axios(address + "/txn/v1/cart-post/", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "x-signature": signature,
        "token": auth.token,
      },
      method: "POST",
      data: {
        mid: this.state.data.mid,
        pid: this.state.currentData.productId,
        qty: currentExt.detailCategory[0].amount,
        notes: currentExt.note,
      }
    })
    .then((res) => {
    })
    .catch((err) => {
    });
  };

  render() {
    let modal;
    if (this.state.showModal === true) {
      modal = (
        <PikaModal
          isShow={() => this.setModal(true)}
          onHide={() => this.setModal(false)}
          datas={this.state.currentData}
          handleClick={this.handleAddCart}
          handleData={this.handleCart}
        />
      );
    } else {
      modal = <></>;
    }
    const storeDatas = this.state.data.data.map((data) => {
      return data;
    });

    let categories = [];
    categories = storeDatas.filter((data) => {
      if (!categories.includes(data.category)) {
        return categories.push(data.category);
      } else {
        return null;
      }
    });

    let cartButton;
    if (cart.length > 1) {
      cartButton = (
        <Link to={"/cart"} className={"btn-productCart"}>
          <img src={cartIcon} alt={"cart"} />
        </Link>
      );
    } else {
      cartButton = <></>;
    }
    const contentView = categories.map((data) => {
      if (data.category === "All Category") {
        var allCards = storeDatas.map((cardData) => {
          if (cardData.category === "All Category") {
            return null;
          } else {
            return (
              <Row>
                <Col xs={4} md={3}>
                  <Image
                    src={cardData.foodImage}
                    rounded
                    fluid
                    className="foodImage"
                  />
                </Col>
                <Col xs={8} md={9}>
                  <Row>
                    <Col xs={7} md={9}>
                      <h5 className="foodTitle">{cardData.foodName}</h5>
                      <p className="foodDesc">{cardData.foodDesc}</p>
                      <div className="foodButton">
                        <PikaButton
                          title="Add to cart"
                          buttonStyle="cartPika"
                          handleClick={() => this.handleDetail(cardData)}
                        />
                      </div>
                    </Col>
                    <Col xs={5} md={3}>
                      <h6 className="foodPrice">
                        {Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(cardData.foodPrice)}
                      </h6>
                    </Col>
                  </Row>
                </Col>
              </Row>
            );
          }
        });
        return (
          <Tab eventKey={data.category} title={data.category}>
            <Row>
              <Col>
                <h5 className="foodHeader">{data.category}</h5>
              </Col>
            </Row>
            {allCards}
          </Tab>
        );
      } else {
        var cards = storeDatas.map((cardData) => {
          if (data.category === cardData.category) {
            return (
              <Card>
                <Row>
                  <Col xs={4} md={3}>
                    <Image
                      src={cardData.foodImage}
                      rounded
                      fluid
                      className="foodImage"
                    />
                  </Col>
                  <Col xs={8} md={6}>
                    <Row>
                      <Col>
                        <h5 className="foodTitle">{cardData.foodName}</h5>
                        <p className="foodDesc">{cardData.foodDesc}</p>
                        <PikaButton
                          title="Add to cart"
                          buttonStyle="cartPika"
                          handleClick={() => this.handleDetail(cardData)}
                        />
                      </Col>
                      <Col xs={5} md={3}>
                        <h6 className="foodPrice">
                          {Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(cardData.foodPrice)}
                        </h6>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            );
          } else {
            return null;
          }
        });
        return (
          <Tab eventKey={data.category} title={data.category}>
            <Row>
              <Col>
                <h5 className="foodHeader">{data.category}</h5>
              </Col>
            </Row>
            {cards}
          </Tab>
        );
      }
    });

    return (
      <div>
        <Row>
          <Col xs={4} md={2}>
            <Image
              src={this.state.data.image}
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
          <Col md={12}>
            <Tabs defaultActiveKey="All Category">{contentView}</Tabs>
          </Col>
        </Row>
        {modal}
        {cartButton}
      </div>
    );
  }
}
