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
import DanaPayment from "../../Asset/Icon/dana_icon.png";
import ShopeePayment from "../../Asset/Icon/shopee_icon.png";
import NoTransaction from "../../Asset/Icon/notrans.png";
import OrderListStatus from "../../Component/Modal/OrderListStatusModal";
import moment from "moment";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { DataDetail } from "../../Redux/Actions";

//json data
import statusHistory from './StatusHistory.json'

let interval = createRef();

export class StatusView extends React.Component {
  _isMounted = false;
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
    this._isMounted = true;
    if (window.innerWidth < 700) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
    this.getTransactionHistory();
    // this.updateLikeWebsocket();
  }

  updateLikeWebsocket = () => {
    setTimeout(() => {
      window.location.reload();
    }, 120000);
  }

  componentDidUpdate() {
    if (this.state.updateStatus) {
      window.location.reload();
    }

    if (this.state.staticCountDown) {
      this.countDownTimer();
      this.setState({ staticCountDown: false });
    }
  }

  getTransactionHistory() {
    let res = {
      data: statusHistory
    }
    var results = res.data.results;
    var stateData = { ...this.state };
    stateData.data.pop();
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
        transactionCountDown: result.expiry_date,
        totalPrice: result.total_price,
        timerMinutes: 0,
        timerSeconds: 0,
        stopInterval: true,
      });
    });
    // console.log(stateData.data);
    this.setState({ data: stateData.data, staticCountDown: true });
  }

  setRegisterDialog(isShow) {
    this.setState({ showRegisterDialog: isShow });
  }

  showRegisterDialog = () => {
    if (this.state.showRegisterDialog === true) {
      return (
        <RegisterDialog
          isShowRegister={this.state.showRegisterDialog}
          onHideRegister={() => this.setRegisterDialog(false)}
        />
      );
    }
  };

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

  goToOrderDetail = (transId, counterTime) => {
    let value = {
      transactionId: transId,
      transactionTime: counterTime,
    };
    this.props.DataDetail(value);
    localStorage.setItem("dataDetail", JSON.stringify(value));
    // this.setState({ continueDetail : true });
  };

  contentStatus = (value, bimg, blab, pimg, plab) => {
    let formatDate = value.transactionTime;
    return (
      <Link to="/orderdetail" style={{ textDecoration: "none" }}>
        <div
          className="orderList-transaction-content"
          onClick={() =>
            this.goToOrderDetail(
              value.transactionId,
              value.transactionCountDown
            )
          }
        >
          <div>
            <h3 className="status-cart-transactionid">ID Transaksi: {value.transactionId}</h3>
          </div>

          <div className="orderList-transaction-topSide">
            <h3 className="orderList-transaction-merchName">{value.title}</h3>

            <h3 className="orderList-transaction-timeTrans">
              {moment(formatDate).format("DD MMMM H:mm")}
            </h3>
          </div>

          <div className="orderList-transaction-centerSide">
            {value.quantity} item(s) | Rp {Intl.NumberFormat("id-ID").format(value.totalPrice)}
          </div>

          <div className="status-cart-content-border"></div>

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
      </Link>
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

        valTime.transactionCountDown = valTime.transactionCountDown.replace(/ /g, "T");
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

              let uuid = uuidV4();
              uuid = uuid.replace(/-/g, "");
              const date = new Date().toISOString();

              var bodyFormData = new FormData();
              bodyFormData.append("transaction_id", valTime.transactionId);
              bodyFormData.append("status", "FAILED");
            }
          } else {
            if (valTime.payment === "WALLET_OVO" || valTime.payment === "WALLET_DANA" || valTime.payment === "WALLET_SHOPEEPAY") {
              if (newSeconds < 10) {
                clearInterval(interval.current);
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

      if (filterOpenStatus.length === 0) {
        return (
          <div className="noTrans-content">
            <span>
              <img src={NoTransaction} className="noTrans-img" alt="" />
            </span>

            <div className="noTrans-title">Anda Belum Melakukan Transaksi</div>
          </div>
        );
      }

      return filterOpenStatus.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        } else if (value.payment === "WALLET_DANA") {
          payImage = DanaPayment;
          payLabel = "DANA";
        } else if (value.payment === "WALLET_SHOPEEPAY") {
          payImage = ShopeePayment;
          payLabel = "ShopeePay";
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

      let filterOpenStatus = data.filter((value) => {
        return value.status === "PAID";
      });

      if (filterOpenStatus.length === 0) {
        return (
          <div className="noTrans-content">
            <span>
              <img src={NoTransaction} className="noTrans-img" alt="" />
            </span>

            <div className="noTrans-title">Anda Belum Melakukan Transaksi</div>
          </div>
        );
      }

      return filterOpenStatus.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        } else if (value.payment === "WALLET_DANA") {
          payImage = DanaPayment;
          payLabel = "DANA";
        } else if (value.payment === "WALLET_SHOPEEPAY") {
          payImage = ShopeePayment;
          payLabel = "ShopeePay";
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
      });
    } else if (currentState === 3) {
      let data = this.state.data;

      let filterOpenStatus = data.filter((value) => {
        return value.status === "ON_PROCESS";
      });

      if (filterOpenStatus.length === 0) {
        return (
          <div className="noTrans-content">
            <span>
              <img src={NoTransaction} className="noTrans-img" alt="" />
            </span>

            <div className="noTrans-title">Anda Belum Melakukan Transaksi</div>
          </div>
        );
      }

      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        } else if (value.payment === "WALLET_DANA") {
          payImage = DanaPayment;
          payLabel = "DANA";
        } else if (value.payment === "WALLET_SHOPEEPAY") {
          payImage = ShopeePayment;
          payLabel = "ShopeePay";
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
      });
    } else if (currentState === 4) {
      let data = this.state.data;

      let filterOpenStatus = data.filter((value) => {
        return value.status === "DELIVER";
      });

      if (filterOpenStatus.length === 0) {
        return (
          <div className="noTrans-content">
            <span>
              <img src={NoTransaction} className="noTrans-img" alt="" />
            </span>

            <div className="noTrans-title">Anda Belum Melakukan Transaksi</div>
          </div>
        );
      }

      return filterOpenStatus.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        } else if (value.payment === "WALLET_DANA") {
          payImage = DanaPayment;
          payLabel = "DANA";
        } else if (value.payment === "WALLET_SHOPEEPAY") {
          payImage = ShopeePayment;
          payLabel = "ShopeePay";
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
      });
    } else if (currentState === 0) {
      let data = this.state.data;

      if (data.length === 0) {
        return (
          <div className="noTrans-content">
            <span>
              <img src={NoTransaction} className="noTrans-img" alt="" />
            </span>

            <div className="noTrans-title">Anda Belum Melakukan Transaksi</div>
          </div>
        );
      }

      return data.map((value, ind) => {
        if (value.payment === "PAY_BY_CASHIER") {
          payImage = CashierPayment;
          payLabel = "Pembayaran Di Kasir";
        } else if (value.payment === "WALLET_OVO") {
          payImage = OvoPayment;
          payLabel = "Ovo";
        } else if (value.payment === "WALLET_DANA") {
          payImage = DanaPayment;
          payLabel = "DANA";
        } else if (value.payment === "WALLET_SHOPEEPAY") {
          payImage = ShopeePayment;
          payLabel = "ShopeePay";
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
        }
      });
    }
  };

  componentWillUnmount() {
    if (this._isMounted) {
      clearInterval(interval.current);
      this._isMounted = false;
    }
  }

  render() {
    // if (this.state.continueDetail) {
    //   return <Redirect to='/orderdetail' />
    // }

    let { statusIndex, statusList } = this.state;
    let viewSize = (
      <>
        {/* <div className="modal-header-orderList">
          <span
            className="logopikappCenterBack"
            onClick={() => window.history.back()}
          >
            <img className="LogoPikappBack" src={ArrowBack} alt="" />
          </span>

          <div className="menu-title-orderList">Daftar Transaksi</div>
        </div> */}

        <div className="status-cart-header">
          <span className="status-cart-back" onClick={() => window.history.back()}>
            <img className="status-cart-backicon" src={ArrowBack} alt='' />
          </span>
          <div className="status-cart-titletext">Daftar Transaksi</div>
        </div>

        <div className="status-cart-filter">
          <div
            className="orderList-filter"
            onClick={() => this.handleStatus(true)}
          >
            <div className="orderList-filterName">{statusList[statusIndex]}</div>

            <span className="orderList-filterArrow">
              <img className="orderList-arrowDown" src={ArrowDownColor} alt="" />
            </span>
          </div>
        </div>

        {/* <div className="orderListWrapper">{this.contentMainView()}</div> */}
        <div className="status-cart-Wrapper">
          {this.contentMainView()}
        </div>
      </>
    );

    return (
      // <div className="orderListLayout">
      //   <div className="orderListTitle">
      //     <span className="logoCenterOrderList">
      //       <img className="LogoPikappOrderList" src={pikappLogo} alt="" />
      //     </span>
      //   </div>

      //   <div className="modalOrderList">
      //     {!this.state.isMobile ? (
      //       <div className="modal-content-orderList">{viewSize}</div>
      //     ) : (
      //       <div className="modal-content-orderList-mob">{viewSize}</div>
      //     )}
      //   </div>
      //   {this.statusDialog()}
      //   {this.showRegisterDialog()}
      // </div>
      <div className="status-cart-Layout">
        <div className="status-cart-Title">
          <span className="logoCenter-status-cart">
            <img className="LogoPikapp-status-cart" src={pikappLogo} alt="" />
          </span>
        </div>

        <div className="modal-status-cart">
          {!this.state.isMobile ? (
            <div className="modal-content-status-cart">{viewSize}</div>
          ) : (
            <div className="modal-content-status-cart-mob">{viewSize}</div>
          )}
        </div>
        {this.statusDialog()}
        {this.showRegisterDialog()}
      </div>
    );
  }
}

const Mapstatetoprops = (state) => {
  return {
    AllRedu: state.AllRedu,
    AuthRedu: state.AuthRedu,
  };
};

export default connect(Mapstatetoprops, { DataDetail })(StatusView);
