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
import { PikaButton } from "../../Component/Button/PikaButton";

export class StatusView extends React.Component {
  state = {
    showModal: false,
    activeTab: 1,
    data: [
      {
        title: "",
        distance: "",
        quantity: "",
        status: "",
      },
    ],
    currentModal: {
      storeName: "Store",
      storeLocation: "Location",
      storeDistance: "Distance",
      status: "Status",
      payment: "Cash",
      food: [
        {
          name: "Food1",
          price: 1000,
          image: "",
          note: "Note1",
          quantity: 1,
        },
        {
          name: "Food2",
          price: 2000,
          image: "",
          note: "Note2",
          quantity: 1,
        },
      ],
    },
  };

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }

  handleSelect(tabIndex) {
    this.setState({ activeTab: tabIndex });
  }

  componentDidMount() {
    var state = { ...this.state };
    state.data.pop();
    state.data.push({
      title: "Food1",
      distance: "dist1",
      quantity: "qty1",
      status: "unpaid",
    });
    state.data.push({
      title: "Food4",
      distance: "dist1",
      quantity: "qty1",
      status: "unpaid",
    });
    state.data.push({
      title: "Food2",
      distance: "dist1",
      quantity: "qty1",
      status: "pick",
    });
    state.data.push({
      title: "Food3",
      distance: "dist1",
      quantity: "qty1",
      status: "send",
    });
    this.setState({ data: state.data });
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
                <img src={reviewIcon} class="statusFoodIcon" />
              </Col>
              <Col>
                <p class="statusFoodname">{data.name}</p>
                <p class="statusFoodPrice">
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(data.price)}
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
      currentTotal = currentTotal + data.price * data.quantity;
    });
    if (this.state.showModal === true) {
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
              <p class="statusNoteHeader">CURB27022020-1</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={2} md={1}>
                <img src={reviewIcon} class="statusStoreIcon" />
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
                <img src={reviewIcon} class="statusStoreStatusIcon" />
              </Col>
              <Col>
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
                <p class="statusStorePayment">
                  {this.state.currentModal.payment}
                </p>
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
                }
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
      let data = this.state.data;
      contentView = data.map((value) => {
        if (value.status === "unpaid") {
          return (
            <Row className={"statusCard"}>
              <Col xs={1} md={1} />
              <Col>
                <Card>
                  <Row className={"statusCard"}>
                    <Col xs={1} md={1}>
                      <img
                        src={unpaidIcon}
                        class="statusIcon"
                        alt={"statusIcon"}
                      ></img>
                    </Col>
                    <Col>
                      <p class="statusTitle">{value.title}</p>
                      <p class="statusDistance">{value.distance}</p>
                      <p class="statusQty">{value.quantity}</p>
                      <PikaButton
                        title={"Detail"}
                        buttonStyle={"statusPika"}
                        handleClick={() => this.setModal(true)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"statusLeftImg"}>
                      <img src={unpaidIcon}></img>
                      <span class="statusLeftText">Pickup</span>
                    </Col>
                    <Col className={"statusRightImg"}>
                      <img src={unpaidIcon}></img>
                      <span class="statusRightText">Pickup</span>
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
        if (value.status === "pack") {
          return (
            <Row className={"statusCard"}>
              <Col xs={1} md={1} />
              <Col>
                <Card>
                  <Row className={"statusCard"}>
                    <Col xs={1} md={1}>
                      <img
                        src={unpaidIcon}
                        class="statusIcon"
                        alt={"statusIcon"}
                      ></img>
                    </Col>
                    <Col>
                      <p class="statusTitle">{value.title}</p>
                      <p class="statusDistance">{value.distance}</p>
                      <p class="statusQty">{value.quantity}</p>
                      <PikaButton
                        title={"Detail"}
                        buttonStyle={"statusPika"}
                        handleClick={() => this.setModal(true)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"statusLeftImg"}>
                      <img src={unpaidIcon}></img>
                      <span class="statusLeftText">Pickup</span>
                    </Col>
                    <Col className={"statusRightImg"}>
                      <img src={unpaidIcon}></img>
                      <span class="statusRightText">Pickup</span>
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
        if (value.status === "send") {
          return (
            <Row className={"statusCard"}>
              <Col xs={1} md={1} />
              <Col>
                <Card>
                  <Row className={"statusCard"}>
                    <Col xs={1} md={1}>
                      <img
                        src={unpaidIcon}
                        class="statusIcon"
                        alt={"statusIcon"}
                      ></img>
                    </Col>
                    <Col>
                      <p class="statusTitle">{value.title}</p>
                      <p class="statusDistance">{value.distance}</p>
                      <p class="statusQty">{value.quantity}</p>
                      <PikaButton
                        title={"Detail"}
                        buttonStyle={"statusPika"}
                        handleClick={() => this.setModal(true)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"statusLeftImg"}>
                      <img src={unpaidIcon}></img>
                      <span class="statusLeftText">Pickup</span>
                    </Col>
                    <Col className={"statusRightImg"}>
                      <img src={unpaidIcon}></img>
                      <span class="statusRightText">Pickup</span>
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
        if (value.status === "review") {
          return (
            <Row className={"statusCard"}>
              <Col xs={1} md={1} />
              <Col>
                <Card>
                  <Row className={"statusCard"}>
                    <Col xs={1} md={1}>
                      <img
                        src={unpaidIcon}
                        class="statusIcon"
                        alt={"statusIcon"}
                      ></img>
                    </Col>
                    <Col>
                      <p class="statusTitle">{value.title}</p>
                      <p class="statusDistance">{value.distance}</p>
                      <p class="statusQty">{value.quantity}</p>
                      <PikaButton
                        title={"Detail"}
                        buttonStyle={"statusPika"}
                        handleClick={() => this.setModal(true)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"statusLeftImg"}>
                      <img src={unpaidIcon}></img>
                      <span class="statusLeftText">Pickup</span>
                    </Col>
                    <Col className={"statusRightImg"}>
                      <img src={unpaidIcon}></img>
                      <span class="statusRightText">Pickup</span>
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
      </>
    );
  }
}
