import React, { createRef } from "react";
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
import { firebaseAnalytics } from '../../firebaseConfig'

import pikappLogo from '../../Asset/Logo/logo4x.png';
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import ArrowDownColor from "../../Asset/Icon/ArrowDownColor.png";
import diningTableColor from "../../Asset/Icon/diningTableColor.png";
import takeawayColor from "../../Asset/Icon/takeawayColor.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import OrderListStatus from '../../Component/Modal/OrderListStatusModal'
import moment from "moment";

let interval = createRef()

let timeTravel = ['2021-06-18T18:33:18+07:00', '2021-06-18T18:37:18+07:00', '2021-06-18T18:38:18+07:00']

export class StatusView extends React.Component {
  state = {
    isMobile: false,
    statusModal: false,
    statusList: ['Semua Status', 'Menunggu Pembayaran', 'Menunggu Konfirmasi', 'Sedang Dimasak', 'Makanan Tiba', 'Transaksi Selesai', 'Transaksi Gagal'],
    statusIndex: 0,
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
    timerMinutes: ['00', '00', '00'],
    timerSeconds: ['00', '00', '00'],
    // currentModal: {
    //   transactionId: "",
    //   transactionTime: "",
    //   storeName: "Store",
    //   storeLocation: "Location",
    //   storeDistance: "Distance",
    //   status: "Status",
    //   payment: "Cash",
    //   biz_type: "",
    //   food: [
    //     {
    //       productId: "",
    //       name: "",
    //       price: 0,
    //       image: "",
    //       note: "",
    //       quantity: 1,
    //       extraprice: 0
    //     },
    //   ],
    // },
  };

  // setModal(isShow) {
  //   this.setState({ showModal: isShow });
  // }

  // handleDetail(transId) {
  //   var auth = {
  //     isLogged: false,
  //     token: "",
  //     new_event: true,
  //     recommendation_status: false,
  //     email: "",
  //   };
  //   if (Cookies.get("auth") !== undefined) {
  //     auth = JSON.parse(Cookies.get("auth"))
  //   }
  //   if (auth.isLogged === false) {
  //     var lastLink = { value: window.location.href }
  //     Cookies.set("lastLink", lastLink, { expires: 1 })
  //     // window.location.href = "/login"
  //   }
  //   let uuid = uuidV4();
  //   uuid = uuid.replace(/-/g, "");
  //   const date = new Date().toISOString();
  //   let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
  //   Axios(address + "txn/v2/" + transId + "/txn-detail/", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-request-id": uuid,
  //       "x-request-timestamp": date,
  //       "x-client-id": clientId,
  //       "x-signature": signature,
  //       "token": auth.token,
  //     },
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       console.log(res.data.results);
  //       var results = res.data.results;
  //       var resultModal = { ...this.currentModal }
  //       resultModal.transactionId = results.transaction_id
  //       resultModal.transactionTime = results.transaction_time
  //       resultModal.storeName = results.merchant_name
  //       resultModal.storeDistance = ""
  //       resultModal.storeLocation = ""
  //       resultModal.status = results.status
  //       resultModal.biz_type = results.biz_type
  //       resultModal.payment = results.payment_with
  //       resultModal.food = []
  //       results.detail_products.forEach((product) => {
  //         resultModal.food.push({
  //           name: product.product_name,
  //           price: product.price,
  //           quantity: product.qty,
  //           image: product.image,
  //           note: product.notes,
  //           extraprice: product.extra_price
  //         })
  //       })
  //       this.setState({
  //         currentModal: resultModal
  //       })
  //     })
  //     .catch((err) => {
  //     });

  //   this.setModal(true);
  // }

  // handleSelect(tabIndex) {
  //   this.setState({ activeTab: tabIndex });
  // }

  componentDidMount() {
    firebaseAnalytics.logEvent("orderlist_visited")
    if (window.innerWidth < 700) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
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
      // this.setRegisterDialog(true);
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

  // componentDidUpdate() {
  //   if (this.state.isLogin === false) {
  //     var auth = {
  //       isLogged: false,
  //       token: "",
  //       new_event: true,
  //       recommendation_status: false,
  //       email: "",
  //     };
  //     if (Cookies.get("auth") !== undefined) {
  //       auth = JSON.parse(Cookies.get("auth"))
  //       this.getTransactionHistory();
  //       this.setState({ isLogin: auth.isLogged });
  //     }
  //   }
  // }

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
        // console.log(stateData.data);
        this.setState({ data: stateData.data });
        this.countDownTimer()
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // setRegisterDialog(isShow) {
  //   this.setState({ showRegisterDialog: isShow })
  //   document.body.style.overflowY = ''
  // }

  // showRegisterDialog = () => {
  //   if (this.state.showRegisterDialog === true) {
  //     return (
  //       <RegisterDialog
  //         isShowRegister={this.state.showRegisterDialog}
  //         onHideRegister={() => this.setRegisterDialog(false)}
  //       />
  //     )
  //   }
  // }

  handleStatus = (isShow) => {
    this.setState({ statusModal: isShow })
  }

  keepStatus = (status) => {
    this.setState({ statusIndex: status })
  }

  statusDialog = () => {
    if (this.state.statusModal) {
      return (
        <OrderListStatus
          isShowStatusModal={this.state.statusModal}
          onHideStatusModal={() => this.handleStatus(false)}
          sendIndexStatus={this.state.statusIndex}
          getStatusData={(status) => this.keepStatus(status)}
        />
      )
    }
  }

  contentStatus = (value, bimg, blab, pimg, plab) => {
    let formatDate = new Date(value.transactionTime)
    return (
      <div className='orderList-transaction-content'>
        <div className='orderList-transaction-topSide'>
          <h3 className='orderList-transaction-merchName'>
            {value.title}
          </h3>

          <h3 className='orderList-transaction-timeTrans'>
            {(moment(formatDate).format('DD MMMM H:mm'))}
          </h3>
        </div>

        <div className='orderList-transaction-centerSide'>
          {value.quantity} | Rp 60.000
        </div>

        <div className='orderList-transaction-bottomSide'>
          <div className='orderList-transaction-foodService'>
            <span>
              <img className='orderList-foodService-logo' src={bimg} alt='' />
            </span>

            <h3 className='orderList-foodService-words'>
              {blab}
            </h3>
          </div>

          <div className='orderList-transaction-paymentService'>
            <span>
              <img className='orderList-paymentService-logo' src={pimg} alt='' />
            </span>

            <h3 className='orderList-paymentService-words'>
              {plab}
            </h3>
          </div>
        </div>
      </div>
    )
  }

  eachStatusList = (value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel) => {
    return (
      <div key={ind} className='orderListContent'>
        <div className='orderList-transaction-header' style={{ backgroundColor: backColor }}>
          <div className='orderList-transaction-title'>
            {thestatus}
          </div>
        </div>

        {this.contentStatus(value, bizImage, bizLabel, payImage, payLabel)}
      </div>
    );
  }

  countDownTimer = () => {
    timeTravel.forEach((valTime, indTime) => {
      // get future time
      let eventTime = new Date(valTime).getTime()

      interval = setInterval(() => {
        // based on time set in user's computer time / OS
        const currentTime = new Date().getTime()
        const distance = eventTime - currentTime

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        let newMinutes = [...this.state.timerMinutes]
        newMinutes[indTime] = minutes

        let newSeconds = [...this.state.timerSeconds]
        newSeconds[indTime] = seconds

        if (distance < 0) {
          clearInterval(interval.current)
          let lastMinutes = [...this.state.timerMinutes]
          lastMinutes[indTime] = '0'

          let lastSeconds = [...this.state.timerSeconds]
          lastSeconds[indTime] = '0'
          this.setState({ timerMinutes: lastMinutes, timerSeconds: lastSeconds })
        } else {
          this.setState({ timerMinutes: newMinutes, timerSeconds: newSeconds })
        }
      }, 1000);
    })
  }

  contentMainView = () => {
    let bizImage;
    let bizLabel;
    let payImage;
    let payLabel;

    let currentState = this.state.statusIndex;
    if (currentState === 1) {
      let filterOpenStatus = this.state.data.filter((value, ind) => {
        return value.status === "OPEN"
      })

      return filterOpenStatus.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir"
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo"
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor
          bizLabel = "Makan Di Tempat"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus"
        }

        if (ind < 3) {
          return (
            <div key={ind} className='orderListContent'>
              <div className='orderList-transaction-header' style={{ backgroundColor: '#DC6A84' }}>
                <div className='orderList-transaction-title'>
                  Menunggu Pembayaran
                </div>

                <div className='orderList-transaction-counttimer'>
                  {this.state.timerMinutes[ind] < 10 ? `0${this.state.timerMinutes[ind]}` : this.state.timerMinutes[ind]}:{this.state.timerSeconds[ind] < 10 ? `0${this.state.timerSeconds[ind]}` : this.state.timerSeconds[ind]}
                </div>
              </div>
              {this.contentStatus(value, bizImage, bizLabel, payImage, payLabel)}
            </div>
          );
        }
      });
    } else if (currentState === 2) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir"
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo"
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor
          bizLabel = "Makan Di Tempat"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus"
        }

        let thestatus = 'Menunggu Konfirmasi'
        let backColor = '#FBA83C'
        if (value.status === "PAID") {
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        }
      });
    } else if (currentState === 3) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir"
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo"
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor
          bizLabel = "Makan Di Tempat"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus"
        }

        let thestatus = 'Sedang Dimasak'
        let backColor = '#FBA83C'
        if (value.status === "ON_PROCESS") {
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        }
      });
    } else if (currentState === 4) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir"
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo"
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor
          bizLabel = "Makan Di Tempat"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus"
        }

        let thestatus = 'Makanan Tiba'
        let backColor = '#4BB7AC'
        if (value.status === "DELIVER") {
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        }
      });
    } else if (currentState === 5) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir"
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo"
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor
          bizLabel = "Makan Di Tempat"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus"
        }

        let thestatus = 'Transaksi Selesai'
        let backColor = '#4BB7AC'
        if (value.status === "CLOSE" || value.status === "FINALIZE") {
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        }
      });
    } else if (currentState === 6) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir"
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo"
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor
          bizLabel = "Makan Di Tempat"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus"
        }

        let thestatus = 'Transaksi Gagal'
        let backColor = '#DC6A84'
        if (value.status === "FAILED" || value.status === "ERROR") {
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        }
      });
    } else if (currentState === 0) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir"
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo"
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor
          bizLabel = "Makan Di Tempat"
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus"
        }

        let thestatus
        let backColor
        if (value.status === "OPEN") {
          return (
            <div key={ind} className='orderListContent'>
              <div className='orderList-transaction-header' style={{ backgroundColor: '#DC6A84' }}>
                <div className='orderList-transaction-title'>
                  Menunggu Pembayaran
                </div>

                <div className='orderList-transaction-counttimer'>
                  29:59
                </div>
              </div>
              {this.contentStatus(value, bizImage, bizLabel, payImage, payLabel)}
            </div>
          );
        } else if (value.status === "PAID") {
          thestatus = 'Menunggu Konfirmasi'
          backColor = '#FBA83C'
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        } else if (value.status === "ON_PROCESS") {
          thestatus = 'Sedang Dimasak'
          backColor = '#FBA83C'
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        } else if (value.status === "DELIVER") {
          thestatus = 'Makanan Tiba'
          backColor = '#4BB7AC'
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        } else if (value.status === "CLOSE" || value.status === "FINALIZE") {
          thestatus = 'Transaksi Selesai'
          backColor = '#4BB7AC'
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        } else if (value.status === "FAILED" || value.status === "ERROR") {
          thestatus = 'Transaksi Gagal'
          backColor = '#DC6A84'
          return this.eachStatusList(value, ind, thestatus, backColor, bizImage, bizLabel, payImage, payLabel)
        }
      });
    }
  }

  componentWillUnmount() {
    clearInterval(interval.current)
  }

  render() {
    // let modal;
    // let modalList = this.state.currentModal.food;

    // let modalListView = modalList.map((data) => {
    //   return (
    //     <Row>
    //       <Col>
    //         <Row>
    //           <Col xs={2} md={1}>
    //             <img src={placeholderIcon} class="statusFoodIcon" alt="food icon" />
    //           </Col>
    //           <Col>
    //             <p class="statusFoodname">{data.name}</p>
    //             <p class="statusFoodPrice">
    //               {Intl.NumberFormat("id-ID", {
    //                 style: "currency",
    //                 currency: "IDR",
    //               }).format(data.price + data.extraprice)}
    //             </p>
    //           </Col>
    //           <Col>
    //             <p class="statusFoodQuantity">{data.quantity}x</p>
    //           </Col>
    //         </Row>
    //         <Row>
    //           <p class="statusFoodNote">Catatan: {data.note}</p>
    //         </Row>
    //       </Col>
    //     </Row>
    //   );
    // });
    // let currentTotal = 0;
    // modalList.forEach((data) => {
    //   currentTotal = currentTotal + (data.price + data.extraprice) * data.quantity;
    // });
    // if (this.state.showModal === true) {
    //   let payImage;
    //   let payLabel;
    //   if (this.state.currentModal.payment === "PAY_BY_CASHIER") {
    //     payImage = cashierStatusIcon;
    //     payLabel = "Cashier"
    //   } else if (this.state.currentModal.payment === "WALLET") {
    //     payImage = placeholderIcon;
    //     payLabel = "Cash"
    //   } else if (this.state.currentModal.payment === "VA") {
    //     payImage = placeholderIcon;
    //     payLabel = "Virtual"
    //   } else if (this.state.currentModal.payment === "WALLET_OVO") {
    //     payImage = ovoIcon;
    //     payLabel = "OVO"
    //   } else if (this.state.currentModal.payment === "WALLET_DANA") {
    //     payImage = placeholderIcon;
    //     payLabel = "DANA"
    //   }
    //   modal = (
    //     <Modal
    //       size="lg"
    //       aria-labelledby="contained-modal-title-vcenter"
    //       centered
    //       show={() => this.setModal(true)}
    //       onHide={() => this.setModal(false)}
    //     >
    //       <Modal.Header closeButton>
    //         <Modal.Title>
    //           <p class="statusNoteLabel">No Pesanan.</p>
    //           <p class="statusNoteHeader">{this.state.currentModal.transactionId}</p>
    //           <p class="statusNoteLabel">{this.state.currentModal.transactionTime}</p>
    //         </Modal.Title>
    //       </Modal.Header>
    //       <Modal.Body>
    //         <Row>
    //           <Col xs={2} md={1}>
    //             <img src={categoryFoodIcon} class="statusStoreIcon" alt="category icon" />
    //           </Col>
    //           <Col>
    //             <p class="statusStoreName">
    //               {this.state.currentModal.storeName}
    //             </p>
    //             <p class="statusStoreLabel">store location</p>
    //             <p class="statusStoreLocation">
    //               {this.state.currentModal.storeLocation}
    //             </p>
    //           </Col>
    //         </Row>
    //         <Row>
    //           <Col xs={2} md={1}>
    //             <img src={pickupStatusIcon} class="statusStoreStatusIcon" alt="pickup status" />
    //           </Col>
    //           <Col>
    //             <span class="statusStoreLabel">status: </span>
    //             <span class="statusStoreStatus">
    //               {this.state.currentModal.status}
    //             </span>
    //             <span class="statusStoreDistance">
    //               {this.state.currentModal.storeDistance}
    //             </span>
    //           </Col>
    //         </Row>
    //         <Row>
    //           <Col>
    //             <p class="statusStorePaymentLabel">Metode Pembayaran</p>
    //             <img src={payImage} class="statusFoodIcon" alt="status icon"></img>
    //             <span class="statusStorePayment">
    //               {payLabel}
    //             </span>
    //           </Col>
    //         </Row>
    //         {modalListView}
    //         <Row>
    //           <Col>
    //             <p class="statusStoreTotal">Total Pembayaran</p>
    //           </Col>
    //           <Col>
    //             {Intl.NumberFormat("id-ID", {
    //               style: "currency",
    //               currency: "IDR",
    //             }).format(currentTotal)}
    //           </Col>
    //         </Row>
    //       </Modal.Body>
    //       <Modal.Footer />
    //     </Modal>
    //   );
    // } else {
    //   modal = <></>;
    // }

    let { statusIndex, statusList } = this.state
    let viewSize = (
      <>
        <div className='modal-header-orderList'>
          <span className='logopikappCenterBack' onClick={() => window.history.back()} >
            <img className='LogoPikappBack' src={ArrowBack} alt='' />
          </span>

          <div className='menu-title-orderList'>
            Daftar Transaksi
          </div>
        </div>

        <div className='orderList-filter' onClick={() => this.handleStatus(true)}>
          <div className='orderList-filterName'>
            {statusList[statusIndex]}
          </div>

          <span className='orderList-filterArrow'>
            <img className='orderList-arrowDown' src={ArrowDownColor} alt='' />
          </span>
        </div>

        <div className='orderListWrapper'>
          {this.contentMainView()}
        </div>
      </>
    )

    return (
      <div className='orderListLayout'>
        <div className='orderListTitle'>
          <span className='logoCenterOrderList'>
            <img className='LogoPikappOrderList' src={pikappLogo} alt='' />
          </span>
        </div>

        <div className='modalOrderList'>
          {
            !this.state.isMobile ?
              <div className='modal-content-orderList'>
                {viewSize}
              </div>
              :
              <div className='modal-content-orderList-mob'>
                {viewSize}
              </div>
          }
        </div>
        {this.statusDialog()}
      </div>
      // {modal}
      // {this.showRegisterDialog()}
    );
  }
}
