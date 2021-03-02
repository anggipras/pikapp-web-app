import React from "react";
import { Row, Col, Button, ButtonGroup, Form } from "react-bootstrap";
import chevronImage from "../../Asset/Icon/chevron_right.png";
import removeIcon from "../../Asset/Icon/remove_icon.png";
import storeIcon from "../../Asset/Icon/store_icon.png";
import checklistIcon from "../../Asset/Icon/checklist_icon.png";
import frontIcon from "../../Asset/Icon/front_icon.png";
import cashierIcon from "../../Asset/Icon/cashier_icon.png";
import dineinIcon from "../../Asset/Icon/dinein_icon.png";
import takeawayIcon from "../../Asset/Icon/takeaway_icon.png";
import { CartModal } from "../../Component/Modal/CartModal";
import { cart } from "../../index.js";
import { Link } from "react-router-dom";
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import Cookies from "js-cookie"
import Loader from 'react-loader'

var options = {
  lines: 13,
  length: 20,
  width: 10,
  radius: 30,
  scale: 0.25,
  corners: 1,
  color: '#000',
  opacity: 0.25,
  rotate: 0,
  direction: 1,
  speed: 1,
  trail: 60,
  fps: 20,
  shadow: false,
  hwaccel: false,
};

export class CartView extends React.Component {
  state = {
    notable: "",
    showModal: false,
    currentModalTitle: "",
    paymentOption: "Pembayaran di kasir",
    paymentType: "PAY_BY_CASHIER",
    biz_type: this.props.noTable.table !== ""? this.props.noTable.table > 0 ? "DINE_IN" : "TAKE_AWAY" : "DINE_IN",
    eat_type: this.props.noTable.table !== ""? this.props.noTable.table > 0 ? "Makan di tempat" : "Bungkus / Takeaway" : "Makan di tempat",
    currentModal: [
      {
        image: "",
        option: "",
      },
    ],
    loadButton: true,
  };

  componentDidMount() {
  //  console.log(); 
  }

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
            image: "cashier",
            option: "Pembayaran di kasir",
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
    let filteredCart;
    cart.forEach((store) => {
      let filteredStore = store.food.filter((data) => {
        if(data.productId === e.productId) {
          if(data.foodNote !== e.foodNote) {
            return data
          }
        } else {
          return data
        }
      });
      store.food = filteredStore;
      if(store.food.length === 0) {
        filteredCart = cart.filter((filterStore) => {
          return filterStore.mid !== store.mid;
        });
        localStorage.setItem("cart",JSON.stringify(filteredCart))
        let addedMerchants = []
        filteredCart.forEach((cart) => {
          addedMerchants.push(cart.mid)
          Cookies.set("addedMerchants", addedMerchants)
        })
        if(addedMerchants.length < 2) {
          window.location.href = Cookies.get("lastProduct")
        } else {
          window.location.reload()
        }
      }
    });
    this.forceUpdate();
  }
  handleOption = (data) => {
    if(this.props.noTable.table !== "") {
      if(data == 1) {
        let newUrl = window.location.search
        let changeTable = newUrl.slice(0, -1)
        changeTable += 0
        window.location.href = changeTable 
      } else {
        let value = Cookies.get("lastProduct")
        console.log(value);
        let getPrevTable = value.charAt(value.length - 1)
        let newUrl = window.location.search
        let changeTable = newUrl.slice(0, -1)
        changeTable += getPrevTable
        window.location.href = changeTable 
      }
    }
    if(this.state.currentModalTitle === "Cara makan anda?") {
      if(data === 0 || this.props.noTable.table > 0) {
        this.setState({biz_type: "DINE_IN"})
        this.setState({eat_type: "Makan di tempat"})
      } else {
        this.setState({biz_type: "TAKE_AWAY"})
        this.setState({eat_type: "Bungkus / Takeaway"})
      }
    } else if (this.state.currentModalTitle === "Bayar pakai apa?") {
      if(data === 0) {
        this.setState({paymentType: "PAY_BY_CASHIER"})
        this.setState({paymentOption: "Pembayaran di kasir"})
      }
    }
  }
  handlePayment = () => {
    this.setState({loadButton: false})
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
    let totalAmount = 0;
    let data = cart;
    data.forEach((store) => {
      store.food.forEach((food) => {
        totalAmount = totalAmount + food.foodPrice * food.foodAmount;
      });
    });

    let merchantIds = JSON.parse(Cookies.get("addedMerchants"))
    merchantIds = merchantIds.filter((merchant) => {
      return merchant !== ""
    })
    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)

    merchantIds.forEach((merchant) => {
      var requestData = {
        products: [{
          product_id :"",
          notes: "",
          qty: 0
        }],
        payment_with: this.state.paymentType,
        mid: merchant,
        prices: totalAmount,
        biz_type: this.state.biz_type,
        table_no: "1"
      }
      requestData.products.pop()
      cart.forEach((merchant) => {
        let addedMerchants = Cookies.get("addedMerchants")
        if(addedMerchants.includes(merchant.mid)) {
          merchant.food.forEach((data) => {
            if(data.productId !== "") {
              requestData.products.push({
                product_id: data.productId,
                notes: data.foodNote,
                qty: data.foodAmount,
              })
            }
          })
        }
      })
      
      Axios(address + "/txn/v1/txn-post/", {
        headers: {
          "Content-Type": "application/json",
          "x-request-id": uuid,
          "x-request-timestamp": date,
          "x-client-id": clientId,
          "x-signature": signature,
          "token": auth.token,
        },
        method: "POST",
        data: requestData,
      })
      .then((res) => {
        localStorage.removeItem("cart")
        alert("Pembelian telah berhasil.")
        window.location.href = "/status"
      })
      .catch((err) => {
        if(err.response.data !== undefined) {
          alert(err.response.data.err_message)
        }
      });
    })
  };

  render() {
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
      if(this.state.loadButton) {
        paymentButton = (
          <button className={"iconButton"} onClick={() => this.handlePayment()}>
            <img src={checklistIcon} alt={"checklist"} /> Bayar{" "}
            <img src={frontIcon} alt={"checklist"} />
          </button>
        );
      } else {
        paymentButton = (
          <Loader loaded={this.state.loadButton} options={options} className="spinner"/>
        )
      }
    }
    if (this.state.showModal === true) {
      modal = (
        <CartModal
          isShow={() => this.setModal(true)}
          onHide={() => this.setModal(false)}
          title={this.state.currentModalTitle}
          detailOptions={this.state.currentModal}
          handleData = {this.handleOption}
          notable = {this.props.noTable}
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
      if (store.mid !== "") {
        return store;
      }
    });

    let contentView = storeList.map((store) => {
      let itemListView = data.map((cartData) => {
        if(cartData.mid === store.mid) {
          return store.food.map((food) => {
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
                    <p className={"cartContentPrice"}>Catatan:</p>
                    <p className={"cartContentPrice"}>{food.foodNote}</p>
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
            )
          })
        }
      });
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

    let paymentImage;
    let eatImage;
    if(this.state.biz_type === "DINE_IN") {
      eatImage = dineinIcon;
    } else if (this.state.biz_type === "TAKE_AWAY") {
      eatImage = takeawayIcon;
    }
    if(this.state.paymentType === "PAY_BY_CASHIER") {
      paymentImage = cashierIcon
    }
    return (
      <>
        <Row>
          <Col xs={0} md={3} />
          <Col>
          <Row>
            <Col><p className={"cartTitle"}>Pilih cara makan anda</p></Col>
          </Row>
          <Row>
            <Col xs ={1} md={1}>
              <img src={eatImage} class="cartModalImage" alt="icon" />
            </Col>
            <Col>{this.state.eat_type}</Col>
          </Row>
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
              <Col xs ={1} md={1}>
                <img src={paymentImage} class="cartModalImage" alt="icon" />
              </Col>
              <Col>
                {this.state.paymentOption}
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
