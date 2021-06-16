import React from "react";
import { Row, Col, Nav, Card, Modal } from "react-bootstrap";
import unpaidIcon from "../../Asset/Icon/unpaid_status.png";
import unpaidActiveIcon from "../../Asset/Icon/unpaid_active_status.png";
import packIcon from "../../Asset/Icon/pack_status.png";
import packActiveIcon from "../../Asset/Icon/pack_active_status.png";
import sendIcon from "../../Asset/Icon/send_status.png";
import sendActiveIcon from "../../Asset/Icon/send_active_status.png";
import reviewIcon from "../../Asset/Icon/review_status.png";
import reviewActiveIcon from "../../Asset/Icon/review_active_status.png";
import placeholderIcon from "../../Asset/Icon/placeholder_icon.png";
import dineinIcon from "../../Asset/Icon/dinein_icon.png";
import takeawayIcon from "../../Asset/Icon/takeaway_icon.png";
import categoryFoodIcon from "../../Asset/Icon/category_food_icon.png";
import pickupStatusIcon from "../../Asset/Icon/pickup_status_icon.png";
import cashierStatusIcon from "../../Asset/Icon/cashier_icon.png"
import ovoIcon from "../../Asset/Icon/ovo_icon.png";
import PikaButton from "../../Component/Button/PikaButton";
import Axios from "axios";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import { address, clientId, secret } from "../../Asset/Constant/APIConstant";
import Cookies from "js-cookie";
import RegisterDialog from '../../Component/Authentication/RegisterDialog';
import { firebaseAnalytics } from '../../firebase'

export class StatusView extends React.Component {
  state = {
    showModal: false,
    activeTab: 1,
    showRegisterDialog: false,
    isLogin: false,
    data: [
      {
        title: "",
        distance: "",
        quantity: "",
        status: "",
        biz_type: "",
        payment: "",
        transactionId: "",
        transactionTime: "",
      },
    ],
    currentModal: {
      transactionId: "",
      transactionTime: "",
      storeName: "Store",
      storeLocation: "Location",
      storeDistance: "Distance",
      status: "Status",
      payment: "Cash",
      biz_type: "",
      food: [
        {
          productId: "",
          name: "",
          price: 0,
          image: "",
          note: "",
          quantity: 1,
          extraprice: 0
        },
      ],
    },
  };

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }

  handleDetail(transId) {
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }
    if (auth.isLogged === false) {
      var lastLink = { value: window.location.href }
      Cookies.set("lastLink", lastLink, { expires: 1 })
      // window.location.href = "/login"
    }
    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
    Axios(address + "txn/v2/" + transId + "/txn-detail/", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "x-signature": signature,
        "token": auth.token,
      },
      method: "GET",
    })
      .then((res) => {
        console.log(res.data.results);
        var results = res.data.results;
        var resultModal = { ...this.currentModal }
        resultModal.transactionId = results.transaction_id
        resultModal.transactionTime = results.transaction_time
        resultModal.storeName = results.merchant_name
        resultModal.storeDistance = ""
        resultModal.storeLocation = ""
        resultModal.status = results.status
        resultModal.biz_type = results.biz_type
        resultModal.payment = results.payment_with
        resultModal.food = []
        results.detail_products.forEach((product) => {
          resultModal.food.push({
            name: product.product_name,
            price: product.price,
            quantity: product.qty,
            image: product.image,
            note: product.notes,
            extraprice: product.extra_price
          })
        })
        this.setState({
          currentModal: resultModal
        })
      })
      .catch((err) => {
      });

    this.setModal(true);
  }

  handleSelect(tabIndex) {
    this.setState({ activeTab: tabIndex });
  }

  componentDidMount() {
    firebaseAnalytics.logEvent("orderlist_visited")
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
      this.setState({ isLogin: auth.isLogged });
    }
    if (auth.isLogged === false) {
      var lastLink = { value: window.location.href }
      Cookies.set("lastLink", lastLink, { expires: 1 })
      this.setRegisterDialog(true);
      // window.location.href = "/login"
    } else {
      this.getTransactionHistory();
    }
    // var state = { ...this.state };
    // state.data.pop();
    // state.data.push({
    //   title: "Food1",
    //   distance: "dist1",
    //   quantity: "qty1",
    //   status: "unpaid",
    // });
    // state.data.push({
    //   title: "Food4",
    //   distance: "dist1",
    //   quantity: "qty1",
    //   status: "unpaid",
    // });
    // state.data.push({
    //   title: "Food2",
    //   distance: "dist1",
    //   quantity: "qty1",
    //   status: "pick",
    // });
    // state.data.push({
    //   title: "Food3",
    //   distance: "dist1",
    //   quantity: "qty1",
    //   status: "send",
    // });
    // this.setState({ data: state.data });
  }

  componentDidUpdate() {
    if (this.state.isLogin === false) {
      var auth = {
        isLogged: false,
        token: "",
        new_event: true,
        recommendation_status: false,
        email: "",
      };
      if (Cookies.get("auth") !== undefined) {
        auth = JSON.parse(Cookies.get("auth"))
        this.getTransactionHistory();
        this.setState({ isLogin: auth.isLogged });
      }
    }
  }

  getTransactionHistory() {
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }

    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
    Axios(address + "txn/v1/txn-history/", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "x-signature": signature,
        "token": auth.token,
      },
      method: "GET",
    })
      .then((res) => {
        var results = res.data.results;
        var stateData = { ...this.state }
        stateData.data.pop()
        results.forEach((result) => {
          stateData.data.push({
            title: result.merchant_name,
            distance: "",
            quantity: result.total_product,
            status: result.status,
            biz_type: result.biz_type,
            payment: result.payment_with,
            transactionId: result.transaction_id,
            transactionTime: result.transaction_time,
          })
        })
        this.setState({ data: stateData.data });
      })
      .catch((err) => {
      });

  }

  setRegisterDialog(isShow) {
    this.setState({ showRegisterDialog: isShow })
    document.body.style.overflowY = ''
  }

  showRegisterDialog = () => {
    if (this.state.showRegisterDialog === true) {
      return (
        <RegisterDialog
          isShowRegister={this.state.showRegisterDialog}
          onHideRegister={() => this.setRegisterDialog(false)}
        />
      )
    }
  }

  render() {
    let modal;
    let modalList = this.state.currentModal.food;

    let modalListView = modalList.map((data) => {
      return (
        <Row>
          <Col>
            <Row>
              <Col xs={2} md={1}>
                <img src={placeholderIcon} class="statusFoodIcon" alt="food icon" />
              </Col>
              <Col>
                <p class="statusFoodname">{data.name}</p>
                <p class="statusFoodPrice">
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(data.price + data.extraprice)}
                </p>
              </Col>
              <Col>
                <p class="statusFoodQuantity">{data.quantity}x</p>
              </Col>
            </Row>
            <Row>
              <p class="statusFoodNote">Catatan: {data.note}</p>
            </Row>
          </Col>
        </Row>
      );
    });
    let currentTotal = 0;
    modalList.forEach((data) => {
      currentTotal = currentTotal + (data.price + data.extraprice) * data.quantity;
    });
    if (this.state.showModal === true) {
      let payImage;
      let payLabel;
      if (this.state.currentModal.payment === "PAY_BY_CASHIER") {
        payImage = cashierStatusIcon;
        payLabel = "Cashier"
      } else if (this.state.currentModal.payment === "WALLET") {
        payImage = placeholderIcon;
        payLabel = "Cash"
      } else if (this.state.currentModal.payment === "VA") {
        payImage = placeholderIcon;
        payLabel = "Virtual"
      } else if (this.state.currentModal.payment === "WALLET_OVO") {
        payImage = ovoIcon;
        payLabel = "OVO"
      } else if (this.state.currentModal.payment === "WALLET_DANA") {
        payImage = placeholderIcon;
        payLabel = "DANA"
      }
      modal = (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={() => this.setModal(true)}
          onHide={() => this.setModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <p class="statusNoteLabel">No Pesanan.</p>
              <p class="statusNoteHeader">{this.state.currentModal.transactionId}</p>
              <p class="statusNoteLabel">{this.state.currentModal.transactionTime}</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={2} md={1}>
                <img src={categoryFoodIcon} class="statusStoreIcon" alt="category icon" />
              </Col>
              <Col>
                <p class="statusStoreName">
                  {this.state.currentModal.storeName}
                </p>
                <p class="statusStoreLabel">store location</p>
                <p class="statusStoreLocation">
                  {this.state.currentModal.storeLocation}
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={2} md={1}>
                <img src={pickupStatusIcon} class="statusStoreStatusIcon" alt="pickup status" />
              </Col>
              <Col>
                <span class="statusStoreLabel">status: </span>
                <span class="statusStoreStatus">
                  {this.state.currentModal.status}
                </span>
                <span class="statusStoreDistance">
                  {this.state.currentModal.storeDistance}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <p class="statusStorePaymentLabel">Metode Pembayaran</p>
                <img src={payImage} class="statusFoodIcon" alt="status icon"></img>
                <span class="statusStorePayment">
                  {payLabel}
                </span>
              </Col>
            </Row>
            {modalListView}
            <Row>
              <Col>
                <p class="statusStoreTotal">Total Pembayaran</p>
              </Col>
              <Col>
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(currentTotal)}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      );
    } else {
      modal = <></>;
    }
    let notPaidImage;
    let contentView;

    let currentState = this.state.activeTab;
    if (currentState === 1) {
      notPaidImage = unpaidActiveIcon;
      contentView = this.state.data.map((value) => {
        let bizImage;
        let bizLabel;
        let payImage;
        let payLabel;
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = cashierStatusIcon;
          payLabel = "Cashier"
        } else if (value.payment === "WALLET") {
          payImage = placeholderIcon;
          payLabel = "Cash"
        } else if (value.payment === "VA") {
          payImage = placeholderIcon;
          payLabel = "Virtual"
        } else if (value.payment === "WALLET_OVO") {
          payImage = ovoIcon;
          payLabel = "OVO"
        } else if (value.payment === "WALLET_DANA") {
          payImage = placeholderIcon;
          payLabel = "DANA"
        }
        if (value.biz_type === "DINE_IN") {
          bizImage = dineinIcon
          bizLabel = "Dine in"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayIcon;
          bizLabel = "Take away"
        }
        if (value.status === "OPEN") {
          return (
            <Row className={"statusCard"}>
              <Col xs={1} md={1} />
              <Col>
                <Card>
                  <Row className={"statusCard"}>
                    <Col xs={1} md={1}>
                      <img
                        src={categoryFoodIcon}
                        class="statusIcon"
                        alt={"statusIcon"}
                      ></img>
                    </Col>
                    <Col>
                      <p class="statusTitle">{value.title}</p>
                      <p class="statusDistance">{value.distance}</p>
                      <p class="statusQty">{value.quantity} produk</p>
                      <PikaButton
                        title={"Detail"}
                        buttonStyle={"statusPika"}
                        handleClick={() => this.handleDetail(value.transactionId)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"statusLeftImg"}>
                      <img src={bizImage} alt="biz icon"></img>
                      <span class="statusLeftText">{bizLabel}</span>
                    </Col>
                    <Col className={"statusRightImg"}>
                      <img src={payImage} alt="pay icon"></img>
                      <span class="statusRightText">{payLabel}</span>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={1} md={1} />
            </Row>
          );
        }
      });
    } else {
      notPaidImage = unpaidIcon;
    }

    let packImage;
    if (currentState === 2) {
      packImage = packActiveIcon;
      let data = this.state.data;
      contentView = data.map((value) => {
        let bizImage;
        let bizLabel;
        let payImage;
        let payLabel;
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = placeholderIcon;
          payLabel = "Cashier"
        } else if (value.payment === "WALLET") {
          payImage = placeholderIcon;
          payLabel = "Cash"
        } else if (value.payment === "VA") {
          payImage = placeholderIcon;
          payLabel = "Virtual"
        } else if (value.payment === "WALLET_OVO") {
          payImage = ovoIcon;
          payLabel = "OVO"
        } else if (value.payment === "WALLET_DANA") {
          payImage = placeholderIcon;
          payLabel = "DANA"
        }
        if (value.biz_type === "DINE_IN") {
          bizImage = dineinIcon
          bizLabel = "Dine in"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayIcon;
          bizLabel = "Take away"
        }
        if (value.biz_type === "DINE_IN") {
          bizImage = dineinIcon
          bizLabel = "Dine in"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayIcon;
          bizLabel = "Take away"
        }
        if (value.status === "PAID" || value.status === "MERCHANT_CONFIRM" || value.status === "CUSTOMER_ACCEPTED") {
          return (
            <Row className={"statusCard"}>
              <Col xs={1} md={1} />
              <Col>
                <Card>
                  <Row className={"statusCard"}>
                    <Col xs={1} md={1}>
                      <img
                        src={categoryFoodIcon}
                        class="statusIcon"
                        alt={"statusIcon"}
                      ></img>
                    </Col>
                    <Col>
                      <p class="statusTitle">{value.title}</p>
                      <p class="statusDistance">{value.distance}</p>
                      <p class="statusQty">{value.quantity} produk</p>
                      <PikaButton
                        title={"Detail"}
                        buttonStyle={"statusPika"}
                        handleClick={() => this.handleDetail(value.transactionId)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"statusLeftImg"}>
                      <img src={bizImage} alt="biz icon"></img>
                      <span class="statusLeftText">{bizLabel}</span>
                    </Col>
                    <Col className={"statusRightImg"}>
                      <img src={payImage} alt="pay icon"></img>
                      <span class="statusRightText">{payLabel}</span>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={1} md={1} />
            </Row>
          );
        }
      });
    } else {
      packImage = packIcon;
    }

    let sendImage;
    if (currentState === 3) {
      sendImage = sendActiveIcon;
      let data = this.state.data;
      contentView = data.map((value) => {
        let bizImage;
        let bizLabel;
        let payImage;
        let payLabel;
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = placeholderIcon;
          payLabel = "Cashier"
        } else if (value.payment === "WALLET") {
          payImage = placeholderIcon;
          payLabel = "Cash"
        } else if (value.payment === "VA") {
          payImage = placeholderIcon;
          payLabel = "Virtual"
        } else if (value.payment === "WALLET_OVO") {
          payImage = ovoIcon;
          payLabel = "OVO"
        } else if (value.payment === "WALLET_DANA") {
          payImage = placeholderIcon;
          payLabel = "DANA"
        }
        if (value.biz_type === "DINE_IN") {
          bizImage = dineinIcon
          bizLabel = "Dine in"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayIcon;
          bizLabel = "Take away"
        }
        if (value.biz_type === "DINE_IN") {
          bizImage = dineinIcon
          bizLabel = "Dine in"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayIcon;
          bizLabel = "Take away"
        }
        if (value.status === "DELIVER" || value.status === "ON_PROCESS") {
          return (
            <Row className={"statusCard"}>
              <Col xs={1} md={1} />
              <Col>
                <Card>
                  <Row className={"statusCard"}>
                    <Col xs={1} md={1}>
                      <img
                        src={categoryFoodIcon}
                        class="statusIcon"
                        alt={"statusIcon"}
                      ></img>
                    </Col>
                    <Col>
                      <p class="statusTitle">{value.title}</p>
                      <p class="statusDistance">{value.distance}</p>
                      <p class="statusQty">{value.quantity} produk</p>
                      <PikaButton
                        title={"Detail"}
                        buttonStyle={"statusPika"}
                        handleClick={() => this.handleDetail(value.transactionId)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"statusLeftImg"}>
                      <img src={bizImage} alt="biz icon"></img>
                      <span class="statusLeftText">{bizLabel}</span>
                    </Col>
                    <Col className={"statusRightImg"}>
                      <img src={payImage} alt="pay icon"></img>
                      <span class="statusRightText">{payLabel}</span>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={1} md={1} />
            </Row>
          );
        }
      });
    } else {
      sendImage = sendIcon;
    }

    let reviewImage;
    if (currentState === 4) {
      reviewImage = reviewActiveIcon;
      let data = this.state.data;
      contentView = data.map((value) => {
        if (value.status === "CLOSE" || value.status === "FINALIZE") {
          let bizImage;
          let bizLabel;
          let payImage;
          let payLabel;
          if (value.payment === "PAY_BY_CASHIER") {
            payImage = placeholderIcon;
            payLabel = "Cashier"
          } else if (value.payment === "WALLET") {
            payImage = placeholderIcon;
            payLabel = "Cash"
          } else if (value.payment === "VA") {
            payImage = placeholderIcon;
            payLabel = "Virtual"
          } else if (value.payment === "WALLET_OVO") {
            payImage = ovoIcon;
            payLabel = "OVO"
          } else if (value.payment === "WALLET_DANA") {
            payImage = placeholderIcon;
            payLabel = "DANA"
          }
          if (value.biz_type === "DINE_IN") {
            bizImage = dineinIcon
            bizLabel = "Dine in"
          } else if (value.biz_type === "TAKE_AWAY") {
            bizImage = takeawayIcon;
            bizLabel = "Take away"
          }
          if (value.biz_type === "DINE_IN") {
            bizImage = dineinIcon
            bizLabel = "Dine in"
          } else if (value.biz_type === "TAKE_AWAY") {
            bizImage = takeawayIcon;
            bizLabel = "Take away"
          }
          return (
            <Row className={"statusCard"}>
              <Col xs={1} md={1} />
              <Col>
                <Card>
                  <Row className={"statusCard"}>
                    <Col xs={1} md={1}>
                      <img
                        src={categoryFoodIcon}
                        class="statusIcon"
                        alt={"statusIcon"}
                      ></img>
                    </Col>
                    <Col>
                      <p class="statusTitle">{value.title}</p>
                      <p class="statusDistance">{value.distance}</p>
                      <p class="statusQty">{value.quantity} produk</p>
                      <PikaButton
                        title={"Detail"}
                        buttonStyle={"statusPika"}
                        handleClick={() => this.handleDetail(value.transactionId)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"statusLeftImg"}>
                      <img src={bizImage} alt="biz icon"></img>
                      <span class="statusLeftText">{bizLabel}</span>
                    </Col>
                    <Col className={"statusRightImg"}>
                      <img src={payImage} alt="pay icon"></img>
                      <span class="statusRightText">{payLabel}</span>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={1} md={1} />
            </Row>
          );
        }
      });
    } else {
      reviewImage = reviewIcon;
    }

    return (
      <>
        <Nav variant="tabs" defaultActiveKey={"not-paid"}>
          <Nav.Item>
            <Nav.Link
              eventKey={"not-paid"}
              onClick={() => this.handleSelect(1)}
            >
              <Row>
                <img
                  src={notPaidImage}
                  alt={"unpaid"}
                  className={"statusTabIcon"}
                />
              </Row>
              <Row className={"statusTabTitle"}>Belum Bayar</Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={"pack"} onClick={() => this.handleSelect(2)}>
              <Row>
                <img src={packImage} alt={"pack"} className={"statusTabIcon"} />
              </Row>
              <Row className={"statusTabTitle"}>Dikemas</Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={"send"} onClick={() => this.handleSelect(3)}>
              <Row>
                <img src={sendImage} alt={"send"} className={"statusTabIcon"} />
              </Row>
              <Row className={"statusTabTitle"}>Siap / Dikirim</Row>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={"review"} onClick={() => this.handleSelect(4)}>
              <Row>
                <img
                  src={reviewImage}
                  alt={"review"}
                  className={"statusTabIcon"}
                />
              </Row>
              <Row className={"statusTabTitle"}>Beri Penilaian</Row>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {contentView}
        {modal}
        {this.showRegisterDialog()}
      </>
    );
  }
}
