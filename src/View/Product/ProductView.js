import React from "react";
import { Col, Row, Image, Card, Tabs, Tab } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import { PikaModal } from "../../Component/Modal/PikaModal";
import queryString from "query-string";
import { cart } from "../../index.js";
import cartIcon from "../../Asset/Icon/cart_icon.png";
import { Link } from "react-router-dom";

export var currentExt = {
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
      title: "",
      image: "",
      desc: "",
      data: [
        {
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
    const value = queryString.parse(window.location.search);
    var data = { ...this.state.data };
    data.title = "Store Name";
    data.image = "";
    data.desc = "This is a store desc";
    data.data.pop();
    data.data.push({
      category: "All Category",
      foodName: "",
      foodDesc: "",
      foodPrice: 0,
      foodImage: "",
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name A",
      foodDesc: "Food Desc A",
      foodPrice: 5000,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name B",
      foodDesc: "Food Desc B",
      foodPrice: 3000,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name C",
      foodDesc: "Food Desc C",
      foodPrice: 5500,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name D",
      foodDesc: "Food Desc D",
      foodPrice: 500,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name E",
      foodDesc: "Food Desc E",
      foodPrice: 8000,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name F",
      foodDesc: "Food Desc F",
      foodPrice: 50,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name G",
      foodDesc: "Food Desc G",
      foodPrice: 5100,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name H",
      foodDesc: "Food Desc H",
      foodPrice: 100000,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });
    data.data.push({
      category: "Category1",
      foodName: "Food Name I",
      foodDesc: "Food Desc I",
      foodPrice: 52000,
      foodImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      foodExt: [
        {
          name: "Food ext A",
          amount: 0,
        },
        {
          name: "Food ext B",
          amount: 0,
        },
      ],
    });

    this.setState({ data: data });
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
    this.setModal(false);
    var isStorePresent = false;
    cart.forEach((data) => {
      if (data.storeName === this.state.data.title) {
        isStorePresent = true;
      }
    });

    var isDuplicate = false;
    cart.forEach((data) => {
      if (data.storeName === this.state.data.title) {
        data.food.forEach((food) => {
          if (food.foodName === this.state.currentData.foodName) {
            isDuplicate = true;
          }
        });
      }
    });
    if (isStorePresent === true) {
      if (isDuplicate === true) {
        cart.forEach((data) => {
          if (data.storeName === this.state.data.title) {
            data.food.forEach((food) => {
              if (food.foodName === this.state.currentData.foodName) {
                food.foodAmount += 1;
              }
            });
          }
        });
      } else {
        cart.forEach((data) => {
          if (data.storeName === this.state.data.title) {
            data.food.push({
              foodName: this.state.currentData.foodName,
              foodPrice: this.state.currentData.foodPrice,
              foodAmount: 1,
            });
          }
        });
      }
    } else {
      cart.push({
        storeName: this.state.data.title,
        storeDesc: this.state.data.desc,
        food: [
          {
            foodName: this.state.currentData.foodName,
            foodPrice: this.state.currentData.foodPrice,
            foodAmount: 1,
          },
        ],
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
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
                <Col xs={8} md={6}>
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
