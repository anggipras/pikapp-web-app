import React from "react";
import { Row, Col, Button, ButtonGroup, Form } from "react-bootstrap";
import chevronImage from "../../Asset/Icon/chevron_right.png";
import removeIcon from "../../Asset/Icon/remove_icon.png";
import storeIcon from "../../Asset/Icon/store_icon.png";
import checklistIcon from "../../Asset/Icon/checklist_icon.png";
import frontIcon from "../../Asset/Icon/front_icon.png";
import imageSample from "../../Asset/Illustration/sample_food.jpg";
import { CartModal } from "../../Component/Modal/CartModal";
import { cart, auth } from "../../index.js";
import { Link } from "react-router-dom";
import { address } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";

export class CartView extends React.Component {
  state = {
    showModal: false,
    currentModalTitle: "",
    currentModal: [
      {
        image: "",
        option: "",
      },
    ],
  };

  handleDetail(data) {
    if (data === "eat-method") {
      this.setState({ showModal: true });
      this.setState({ currentModalTitle: "Cara makan anda?" });
      this.setState({
        currentModal: [
          {
            image: "dineIn",
            option: "Makan di tempat",
          },
          {
            image: "takeaway",
            option: "Bungkus / Takeaway",
          },
        ],
      });
    } else if (data === "pay-method") {
      this.setState({ showModal: true });
      this.setState({ currentModalTitle: "Bayar pakai apa?" });
      this.setState({
        currentModal: [
          {
            image: "cash",
            option: "Cash",
          },
        ],
      });
    }
  }

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }

  handleDecrease(e) {
    if (e.foodAmount > 1) {
      e.foodAmount -= 1;
      this.forceUpdate();
    }
  }

  handleIncrease(e) {
    e.foodAmount += 1;
    this.forceUpdate();
  }

  handleDelete(e) {
    cart.forEach((store) => {
      let filteredStore = store.food.filter((data) => {
        return data.foodName !== e.foodName;
      });
      store.food = filteredStore;
    });
    this.forceUpdate();
  }

  handlePayment = () => {
    console.log("Handle");

  };

  render() {
    console.log(cart)
    let modal;
    let paymentButton;
    if (auth.isLoggedIn === false) {
      paymentButton = (
        <Link to={"/login"} className={"iconButton"}>
          <img src={checklistIcon} alt={"checklist"} /> Bayar{" "}
          <img src={frontIcon} alt={"checklist"} />
        </Link>
      );
    } else {
      paymentButton = (
        <button className={"iconButton"} onClick={() => this.handlePayment()}>
          <img src={checklistIcon} alt={"checklist"} /> Bayar{" "}
          <img src={frontIcon} alt={"checklist"} />
        </button>
      );
    }
    if (this.state.showModal === true) {
      modal = (
        <CartModal
          isShow={() => this.setModal(true)}
          onHide={() => this.setModal(false)}
          title={this.state.currentModalTitle}
          detailOptions={this.state.currentModal}
        />
      );
    } else {
      modal = <></>;
    }

    let data = cart;
    let totalAmount = 0;
    data.forEach((store) => {
      store.food.forEach((food) => {
        totalAmount = totalAmount + food.foodPrice * food.foodAmount;
      });
    });
    let storeList = data.filter((store) => {
      if (store.storeName !== "") {
        return store;
      }
    });

    let itemListView = storeList.map((store) => {
      return data.map((cartData) => {
        if (cartData.storeName === store.storeName) {
          return cartData.food.map((food) => {
            return (
              <Row>
                <Col xs={0} md={3} />
                <Col xs={3} md={1}>
                  <img
                    src={food.foodImage}
                    alt={"food"}
                    className={"cartFoodImage"}
                  />
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <p className={"cartContentFood"}>{food.foodName}</p>
                      <p className={"cartContentPrice"}>
                        {Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(food.foodPrice)}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <button
                        className={"iconButton"}
                        onClick={() => this.handleDelete(food)}
                      >
                        <img src={removeIcon} alt={"remove icon"} />
                      </button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup className={"cartModalButtonGroup"}>
                        <Button
                          onClick={() => this.handleDecrease(food)}
                          variant="cartModalMiniButton"
                        >
                          -
                        </Button>
                        <Form.Control
                          value={food.foodAmount}
                          className="cartModalField"
                          disabled
                        ></Form.Control>
                        <Button
                          onClick={() => this.handleIncrease(food)}
                          variant="cartModalMiniButton"
                        >
                          +
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            );
          });
        }
      });
    });

    let contentView = storeList.map((store) => {
      return (
        <>
          <Row>
            <Col xs={0} md={3} />
            <Col>
              <p className={"cartTitle"}>{store.storeName}</p>
            </Col>
          </Row>
          <Row>
            <Col xs={0} md={3} />
            <Col xs={1} md={1}>
              <img src={storeIcon} className={"cartIcon"} alt={"store icon"} />
            </Col>
            <Col>
              <Row>
                <Col>
                  <p className={"cartNote"}>Store Location</p>
                  <p className={"cartTitle"}>{store.storeDesc}</p>
                  <p className={"cartNote"}>
                    <b>{store.storeDistance}</b>
                  </p>
                </Col>
              </Row>
            </Col>
            <Col xs={2} md={3}>
              <button className={"iconButton"}>
                <img
                  src={chevronImage}
                  onClick={() => this.handleDetail()}
                  alt={"chevron right"}
                />
              </button>
            </Col>
          </Row>
          {itemListView}
        </>
      );
    });

    return (
      <>
        <Row>
          <Col xs={0} md={3} />
          <Col>
            <p className={"cartTitle"}>Pilih cara makan anda</p>
          </Col>
          <Col xs={2} md={3}>
            <button className={"iconButton"}>
              <img
                src={chevronImage}
                onClick={() => this.handleDetail("eat-method")}
                alt={"chevron right"}
              />
            </button>
          </Col>
        </Row>
        <Row>
          <Col xs={0} md={3} />
          <Col>
            <Row>
              <Col>
                <p className={"cartTitle"}>Bayar pakai apa?</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className={"cartContent"}>Cash</p>
              </Col>
            </Row>
          </Col>
          <Col xs={2} md={3}>
            <button className={"iconButton"}>
              <img
                src={chevronImage}
                onClick={() => this.handleDetail("pay-method")}
                alt={"chevron right"}
              />
            </button>
          </Col>
        </Row>
        {contentView}
        <Row>
          <Col>
            <Row>
              <Col xs={0} md={3} />
              <Col>
                <p className={"cartTitle"}>Rincian Pembayaran</p>
              </Col>
            </Row>
            <Row>
              <Col xs={0} md={3} />
              <Col>
                <Row>
                  <Col>
                    <p className={"cartContent"}>Total harga barang:</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className={"cartContent"}>Diskon:</p>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <p className={"cartContent"}>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(totalAmount)}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className={"cartContent"}>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(0)}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className={"cartPayment"}>
            <Row>
              <Col xs={1} md={3} />
              <Col>
                <p className={"cartTitle"}>Total Belanja Kamu</p>
              </Col>
            </Row>
            <Row>
              <Col xs={1} md={3} />
              <Col>
                <p className={"cartFinalPrice"}>
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalAmount)}
                </p>
              </Col>
              <Col className={"cartFinalButton"}>{paymentButton}</Col>
            </Row>
          </Col>
        </Row>
        {modal}
      </>
    );
  }
}
