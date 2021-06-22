import React, { createRef } from "react";
import RegisterDialog from "../../Component/Authentication/RegisterDialog";
import { firebaseAnalytics } from "../../firebaseConfig";
import Axios from "axios";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import { address, clientId, secret } from "../../Asset/Constant/APIConstant";
import Cookies from "js-cookie";
import pikappLogo from "../../Asset/Logo/logo4x.png";
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import ArrowDownColor from "../../Asset/Icon/ArrowDownColor.png";
import diningTableColor from "../../Asset/Icon/diningTableColor.png";
import takeawayColor from "../../Asset/Icon/takeawayColor.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import OrderListStatus from "../../Component/Modal/OrderListStatusModal";
import moment from "moment";

let interval = createRef();

export class StatusView extends React.Component {
  state = {
    isMobile: false,
    statusModal: false,
    statusList: [
      "Semua Status",
      "Menunggu Pembayaran",
      "Menunggu Konfirmasi",
      "Sedang Dimasak",
      "Makanan Tiba",
      "Transaksi Selesai",
      "Transaksi Gagal",
    ],
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
    staticCountDown: false,
    updateStatus: false,
  };

  componentDidMount() {
    firebaseAnalytics.logEvent("orderlist_visited");
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
      auth = JSON.parse(Cookies.get("auth"));
      this.setState({ isLogin: auth.isLogged });
    }
    if (auth.isLogged === false) {
      var lastLink = { value: window.location.href };
      Cookies.set("lastLink", lastLink, { expires: 1 });
      this.setRegisterDialog(true);
    } else {
      this.getTransactionHistory();
    }
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
        auth = JSON.parse(Cookies.get("auth"));
        this.setState({ isLogin: auth.isLogged });
      }
    }

    if (this.state.updateStatus) {
      window.location.reload();
    }

    if (this.state.staticCountDown) {
      this.countDownTimer();
      this.setState({ staticCountDown: false });
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
      auth = JSON.parse(Cookies.get("auth"));
    }

    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();
    let signature = sha256(
      clientId + ":" + auth.email + ":" + secret + ":" + date,
      secret
    );
    Axios(address + "txn/v1/txn-history/", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "x-signature": signature,
        token: auth.token,
      },
      method: "GET",
    })
      .then((res) => {
        var results = res.data.results;
        var stateData = { ...this.state };
        stateData.data.pop();
        let futureTimer = [];
        let futureTimerOvo = [];
        futureTimer = JSON.parse(localStorage.getItem("timerDown"));
        futureTimerOvo = JSON.parse(localStorage.getItem("timerDownOvo"));
        let indTime = 0;
        let indTimeOvo = 0;
        results.forEach((result) => {
          if (result.status === "OPEN") {
            stateData.data.push({
              title: result.merchant_name,
              distance: "",
              quantity: result.total_product,
              status: result.status,
              biz_type: result.biz_type,
              payment: result.payment_with,
              transactionId: result.transaction_id,
              transactionTime: result.transaction_time,
              transactionCountDown:
                result.payment_with === "WALLET_OVO"
                  ? futureTimerOvo[indTimeOvo]
                  : futureTimer[indTime],
              timerMinutes: "0",
              timerSeconds: "0",
              stopInterval: true,
            });
            if (result.payment_with === "WALLET_OVO") {
              indTimeOvo++;
            } else {
              indTime++;
            }
          } else {
            stateData.data.push({
              title: result.merchant_name,
              distance: "",
              quantity: result.total_product,
              status: result.status,
              biz_type: result.biz_type,
              payment: result.payment_with,
              transactionId: result.transaction_id,
              transactionTime: result.transaction_time,
            });
          }
        });
        console.log(stateData.data);
        this.setState({ data: stateData.data, staticCountDown: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setRegisterDialog(isShow) {
    this.setState({ showRegisterDialog: isShow })
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

  handleStatus = (isShow) => {
    this.setState({ statusModal: isShow });
  };

  keepStatus = (status) => {
    this.setState({ statusIndex: status });
  };

  statusDialog = () => {
    if (this.state.statusModal) {
      return (
        <OrderListStatus
          isShowStatusModal={this.state.statusModal}
          onHideStatusModal={() => this.handleStatus(false)}
          sendIndexStatus={this.state.statusIndex}
          getStatusData={(status) => this.keepStatus(status)}
        />
      );
    }
  };

  contentStatus = (value, bimg, blab, pimg, plab) => {
    let formatDate = new Date(value.transactionTime);
    return (
      <div className="orderList-transaction-content">
        <div className="orderList-transaction-topSide">
          <h3 className="orderList-transaction-merchName">{value.title}</h3>

          <h3 className="orderList-transaction-timeTrans">
            {moment(formatDate).format("DD MMMM H:mm")}
          </h3>
        </div>

        <div className="orderList-transaction-centerSide">
          {value.quantity} | Rp 60.000
        </div>

        <div className="orderList-transaction-bottomSide">
          <div className="orderList-transaction-foodService">
            <span>
              <img className="orderList-foodService-logo" src={bimg} alt="" />
            </span>

            <h3 className="orderList-foodService-words">{blab}</h3>
          </div>

          <div className="orderList-transaction-paymentService">
            <span>
              <img
                className="orderList-paymentService-logo"
                src={pimg}
                alt=""
              />
            </span>

            <h3 className="orderList-paymentService-words">{plab}</h3>
          </div>
        </div>
      </div>
    );
  };

  eachStatusList = (
    value,
    ind,
    thestatus,
    backColor,
    bizImage,
    bizLabel,
    payImage,
    payLabel
  ) => {
    return (
      <div key={ind} className="orderListContent">
        <div
          className="orderList-transaction-header"
          style={{ backgroundColor: backColor }}
        >
          <div className="orderList-transaction-title">{thestatus}</div>
        </div>

        {this.contentStatus(value, bizImage, bizLabel, payImage, payLabel)}
      </div>
    );
  };

  countDownTimer = () => {
    this.state.data.forEach((valTime, indTime) => {
      if (valTime.status === "OPEN") {
        // get future time
        let eventTime = new Date(valTime.transactionCountDown).getTime();

        interval = setInterval(() => {
          // based on time set in user's computer time / OS
          const currentTime = new Date().getTime();
          const distance = eventTime - currentTime;

          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          let newMinutes = valTime.timerMinutes;
          newMinutes = minutes;

          let newSeconds = valTime.timerSeconds;
          newSeconds = seconds;

          let changeData = [...this.state.data];
          if (distance < 0) {
            console.log(changeData[indTime].stopInterval, indTime);
            if (changeData[indTime].stopInterval) {
              clearInterval(interval.current);
              let lastMinutes = valTime.timerMinutes;
              lastMinutes = "0";
              changeData[indTime].timerMinutes = lastMinutes;

              let lastSeconds = valTime.timerSeconds;
              lastSeconds = "0";
              changeData[indTime].timerSeconds = lastSeconds;
              changeData[indTime].stopInterval = false;
              var auth = {
                isLogged: false,
                token: "",
                new_event: true,
                recommendation_status: false,
                email: "",
              };
              auth = JSON.parse(Cookies.get("auth"));
              let uuid = uuidV4();
              uuid = uuid.replace(/-/g, "");
              const date = new Date().toISOString();
              let signature = sha256(
                clientId + ":" + auth.email + ":" + secret + ":" + date,
                secret
              );

              var bodyFormData = new FormData();
              bodyFormData.append("transaction_id", valTime.transactionId);
              bodyFormData.append("status", "FAILED");

              var options = {
                method: "post",
                url: address + "txn/v1/txn-update/",
                headers: {
                  "x-client-id": clientId,
                  token: auth.token,
                  "x-request-id": uuid,
                  "x-request-timestamp": date,
                  "x-signature": signature,
                },
                data: bodyFormData,
              };

              Axios(options)
                .then(() => {
                  if (valTime.payment === "PAY_BY_CASHIER") {
                    let futureTimer = [];
                    futureTimer = JSON.parse(localStorage.getItem("timerDown"));
                    futureTimer.pop();
                    localStorage.setItem(
                      "timerDown",
                      JSON.stringify(futureTimer)
                    );
                  } else {
                    let futureTimerOvo = [];
                    futureTimerOvo = JSON.parse(
                      localStorage.getItem("timerDownOvo")
                    );
                    futureTimerOvo.pop();
                    localStorage.setItem(
                      "timerDownOvo",
                      JSON.stringify(futureTimerOvo)
                    );
                  }
                  this.setState({ data: changeData, updateStatus: true });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } else {
            if (valTime.payment === "WALLET_OVO") {
              if (newSeconds < 10) {
                clearInterval(interval.current);
                let futureTimerOvo = [];
                futureTimerOvo = JSON.parse(
                  localStorage.getItem("timerDownOvo")
                );
                futureTimerOvo.pop();
                localStorage.setItem(
                  "timerDownOvo",
                  JSON.stringify(futureTimerOvo)
                );
                window.location.reload();
              }
            }
            changeData[indTime].timerMinutes = newMinutes;
            changeData[indTime].timerSeconds = newSeconds;
            this.setState({ data: changeData, staticCountDown: false });
          }
        }, 1000);
      }
    });
  };

  contentMainView = () => {
    let bizImage;
    let bizLabel;
    let payImage;
    let payLabel;

    let currentState = this.state.statusIndex;
    if (currentState === 1) {
      let filterOpenStatus = this.state.data.filter((value, ind) => {
        return value.status === "OPEN";
      });

      return filterOpenStatus.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor;
          bizLabel = "Makan Di Tempat";
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus";
        }

        return (
          <div key={ind} className="orderListContent">
            <div
              className="orderList-transaction-header"
              style={{ backgroundColor: "#DC6A84" }}
            >
              <div className="orderList-transaction-title">
                Menunggu Pembayaran
              </div>

              <div className="orderList-transaction-counttimer">
                {value.timerMinutes < 10
                  ? `0${value.timerMinutes}`
                  : value.timerMinutes}
                :
                {value.timerSeconds < 10
                  ? `0${value.timerSeconds}`
                  : value.timerSeconds}
              </div>
            </div>
            {this.contentStatus(value, bizImage, bizLabel, payImage, payLabel)}
          </div>
        );
      });
    } else if (currentState === 2) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor;
          bizLabel = "Makan Di Tempat";
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus";
        }

        let thestatus = "Menunggu Konfirmasi";
        let backColor = "#FBA83C";
        if (value.status === "PAID") {
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        }
      });
    } else if (currentState === 3) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor;
          bizLabel = "Makan Di Tempat";
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus";
        }

        let thestatus = "Sedang Dimasak";
        let backColor = "#FBA83C";
        if (value.status === "ON_PROCESS") {
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        }
      });
    } else if (currentState === 4) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor;
          bizLabel = "Makan Di Tempat";
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus";
        }

        let thestatus = "Makanan Tiba";
        let backColor = "#4BB7AC";
        if (value.status === "DELIVER") {
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        }
      });
    } else if (currentState === 5) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor;
          bizLabel = "Makan Di Tempat";
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus";
        }

        let thestatus = "Transaksi Selesai";
        let backColor = "#4BB7AC";
        if (value.status === "CLOSE" || value.status === "FINALIZE") {
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        }
      });
    } else if (currentState === 6) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor;
          bizLabel = "Makan Di Tempat";
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus";
        }

        let thestatus = "Transaksi Gagal";
        let backColor = "#DC6A84";
        if (value.status === "FAILED" || value.status === "ERROR") {
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        }
      });
    } else if (currentState === 0) {
      let data = this.state.data;
      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        }

        if (value.biz_type === "DINE_IN") {
          bizImage = diningTableColor;
          bizLabel = "Makan Di Tempat";
        } else if (value.biz_type === "TAKE_AWAY") {
          bizImage = takeawayColor;
          bizLabel = "Takeaway/Bungkus";
        }

        let thestatus;
        let backColor;
        if (value.status === "OPEN") {
          return (
            <div key={ind} className="orderListContent">
              <div
                className="orderList-transaction-header"
                style={{ backgroundColor: "#DC6A84" }}
              >
                <div className="orderList-transaction-title">
                  Menunggu Pembayaran
                </div>

                <div className="orderList-transaction-counttimer">
                  {value.timerMinutes < 10
                    ? `0${value.timerMinutes}`
                    : value.timerMinutes}
                  :
                  {value.timerSeconds < 10
                    ? `0${value.timerSeconds}`
                    : value.timerSeconds}
                </div>
              </div>
              {this.contentStatus(
                value,
                bizImage,
                bizLabel,
                payImage,
                payLabel
              )}
            </div>
          );
        } else if (value.status === "PAID") {
          thestatus = "Menunggu Konfirmasi";
          backColor = "#FBA83C";
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        } else if (value.status === "ON_PROCESS") {
          thestatus = "Sedang Dimasak";
          backColor = "#FBA83C";
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        } else if (value.status === "DELIVER") {
          thestatus = "Makanan Tiba";
          backColor = "#4BB7AC";
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        } else if (value.status === "CLOSE" || value.status === "FINALIZE") {
          thestatus = "Transaksi Selesai";
          backColor = "#4BB7AC";
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        } else if (value.status === "FAILED" || value.status === "ERROR") {
          thestatus = "Transaksi Gagal";
          backColor = "#DC6A84";
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payImage,
            payLabel
          );
        }
      });
    }
  };

  componentWillUnmount() {
    clearInterval(interval.current);
  }

  render() {
    let { statusIndex, statusList } = this.state;
    let viewSize = (
      <>
        <div className="modal-header-orderList">
          <span
            className="logopikappCenterBack"
            onClick={() => window.history.back()}
          >
            <img className="LogoPikappBack" src={ArrowBack} alt="" />
          </span>

          <div className="menu-title-orderList">Daftar Transaksi</div>
        </div>

        <div
          className="orderList-filter"
          onClick={() => this.handleStatus(true)}
        >
          <div className="orderList-filterName">{statusList[statusIndex]}</div>

          <span className="orderList-filterArrow">
            <img className="orderList-arrowDown" src={ArrowDownColor} alt="" />
          </span>
        </div>

        <div className="orderListWrapper">{this.contentMainView()}</div>
      </>
    );

    return (
      <div className="orderListLayout">
        <div className="orderListTitle">
          <span className="logoCenterOrderList">
            <img className="LogoPikappOrderList" src={pikappLogo} alt="" />
          </span>
        </div>

        <div className="modalOrderList">
          {!this.state.isMobile ? (
            <div className="modal-content-orderList">{viewSize}</div>
          ) : (
            <div className="modal-content-orderList-mob">{viewSize}</div>
          )}
        </div>
        {this.statusDialog()}
        {this.showRegisterDialog()}
      </div>
    );
  }
}
