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
import NoTransaction from "../../Asset/Icon/notrans.png";
import ManualIcon from "../../Asset/Icon/call.png";
import OrderListStatus from "../../Component/Modal/OrderListStatusModal";
import moment from "moment";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { DataDetail } from "../../Redux/Actions";

let interval = createRef();

export class StatusCartManualView extends React.Component {
  _isMounted = false;
  state = {
    isMobile: false,
    statusList: [
      "Diproses",
      "Dikirim",
      "Sampai",
      "Selesai",
      "Batal",
      "Batal"
    ],
    statusIndex: 0,
    showModal: false,
    activeTab: 1,
    isLogin: false,
    data : [{
        shipping : {
            shipping_method: "",
            shipping_cost: 0,
            shipping_time: "",
            shipping_time_type: ""
        },
        customer : {
            address: "",
            customer_id: "",
            customer_name: "",
            phone_number: "",
            address_detail: ""
        },
        productList : [{
            quantity: 0,
            price: 0,
            discount: 0,
            notes: "",
            extraPrice: 0,
            product_id: "",
            product_name: "",
            extra_menus: ""
        }],
        transaction_id: "",
        transaction_time: "",
        order_id: 0,
        mid: "",
        merchant_name : "",
        order_type: "",
        order_status: "",
        payment_status: "",
        order_platform: "",
        total_product_price: 0,
        total_discount: 0,
        total_payment: 0,
    }],
    staticCountDown: false,
    updateStatus: false,
    transactionId : ""
    // continueDetail : false,
  };

  componentDidMount() {
    this._isMounted = true;
    firebaseAnalytics.logEvent("orderlist_visited");
    if (window.innerWidth < 700) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
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

  getTransactionDetail() {
    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();
    let historyTransAPI = address + '/pos/v1/transaction/get/detail/'
    Axios(historyTransAPI, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "invoice" : this.state.transactionId
      },
      method: "GET",
    })
      .then((res) => {
        var results = res.data.results;
        var stateData = { ...this.state };
        stateData.data.pop();
        // results.forEach((result) => {
        //   stateData.data.push({
        //     title: result.merchant_name,
        //     distance: "",
        //     quantity: result.total_product,
        //     status: result.status,
        //     biz_type: result.biz_type,
        //     payment: result.payment_with,
        //     transactionId: result.transaction_id,
        //     transactionTime: result.transaction_time,
        //     transactionCountDown: result.expiry_date,
        //     totalPrice: result.total_price,
        //     timerMinutes: 0,
        //     timerSeconds: 0,
        //     stopInterval: true,
        //   });
        // });
        stateData.data.push(results);
        // console.log(stateData.data);
        this.setState({ data: stateData.data, staticCountDown: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  contentStatus = (value, bimg, blab, pimg, plab) => {
    let formatDate = value.transactionTime;
    let totalItem = value.productList.length;
    return (
        <div
          className="status-cartmanual-transaction-content"
        >
            <div>
                <h3 className="status-cartmanual-transactionid">ID Transaksi {value.transaction_id}</h3>
            </div>
            <div>
                <h3 className="status-cartmanual-transactiondate">{moment(value.transaction_time).format("DD MMMM H:mm")}</h3>
            </div>
            <div className="status-cartmanual-content-border"></div>

            <div className="status-cartmanual-transaction-topSide">
                <h3 className="status-cartmanual-transaction-merchName">{value.shipping.shipping_method}</h3>
                <img className='status-cartmanual-content-icon' src={ManualIcon}></img>
            </div>

            <div>
                <h3 className="status-cartmanual-item">{value.merchant_name}</h3>
            </div>
            <div className="status-cartmanual-content-date">
                <span className="status-cartmanual-datetext">Tanggal Pengiriman : </span><span className="status-cartmanual-dateinfo">{moment(value.shipping.shipping_time).format("DD MMMM H:mm")}</span>
            </div>
            <div className="status-cartmanual-content-border"></div>

            <div className="status-cartmanual-transaction-topSide">
                <h3 className="status-cartmanual-content-paymentstatus">Status Pembayaran</h3>

                <h3 className="status-cartmanual-content-paymentinfo" style={{ color: pimg }}>{plab}</h3>
            </div>
            <div className="status-cartmanual-content-border"></div>

                {
                    value.productList.map((product, indprod) => {
                        return (
                            <div className="status-cartmanual-transaction-centerSide">
                                <div className="status-cartmanual-section-quantity">
                                    <h3  className='status-cartmanual-content-quantity'>{product.quantity}x</h3>
                                </div>
                                <div className="status-cartmanual-section-item">
                                    <h3 className='status-cartmanual-content-item'>{product.product_name}</h3>
                                    <h3 className='status-cartmanual-content-desc'>{product.notes}</h3>
                                </div>
                            </div>
                        )
                    })
                }
                
            <div className="status-cartmanual-content-border"></div>
            <div className="status-cartmanual-section-price">
                <h3 className="status-cartmanual-content-totalitem">Total {totalItem} Item : </h3>
                <h3 className="status-cartmanual-content-totalprice">Rp {Intl.NumberFormat("id-ID").format(value.total_payment)}</h3>
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
      <div key={ind} className="status-cartmanual-Content">
        <div
          className="status-cartmanual-transaction-header"
          style={{ backgroundColor: backColor }}
        >
          <div className="status-cartmanual-transaction-title">{thestatus}</div>
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

              var options = {
                method: "post",
                url: address + "txn/v2/txn-update/",
                headers: {
                  "x-client-id": clientId,
                  "x-request-id": uuid,
                  "x-request-timestamp": date,
                },
                data: bodyFormData,
              };

              Axios(options)
                .then(() => {
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
    let payColor;

    let currentState = this.state.statusIndex;
      let data = this.state.data;

      if (data.length === 0) {
        return (
          <div className="status-cartmanual-noTrans-content">
            <span>
              <img src={NoTransaction} className="status-cartmanual-noTrans-img" alt="" />
            </span>

            <div className="status-cartmanual-noTrans-title">Anda Belum Melakukan Transaksi</div>
          </div>
        );
      }

      return data.map((value, ind) => {
        if (value.payment_status === "PAID") {
            payLabel = "Sudah Bayar";
            payColor = "#4BB7AC";
        } else if (value.payment_status === "UNPAID") {
            payLabel = "Belum Bayar";
            payColor = "#DC6A84";
        } else if (value.payment_status === "CANCELLED") {
            payLabel = "Dibatalkan";
            payColor = "#DC6A84";
        } else if (value.payment_status === "FAILED") {
            payLabel = "Gagal";
            payColor = "#DC6A84";
        } else if (value.payment_status === "REFUND") {
            payLabel = "Dana Dikembalikan";
            payColor = "#F4B55B";
        }

        let thestatus;
        let backColor;
        if (value.order_status === "ON_PROCESS") {
          return (
            <div key={ind} className="status-cartmanual-Content">
              <div
                className="status-cartmanual-transaction-header"
                style={{ backgroundColor: "#F4B55B" }}
              >
                <div className="status-cartmanual-transaction-title">
                    Diproses
                </div>
              </div>
              {this.contentStatus(
                value,
                bizImage,
                bizLabel,
                payColor,
                payLabel
              )}
            </div>
          );
        } else if (value.order_status === "DELIVER") {
            thestatus = "Dikirim";
            backColor = "#4BB7AC";
            return this.eachStatusList(
              value,
              ind,
              thestatus,
              backColor,
              bizImage,
              bizLabel,
              payColor,
              payLabel
            );
        } 
        else if (value.order_status === "FINALIZE") {
            thestatus = "Sampai";
            backColor = "#4BB7AC";
            return this.eachStatusList(
              value,
              ind,
              thestatus,
              backColor,
              bizImage,
              bizLabel,
              payColor,
              payLabel
            );
        }
        else if (value.order_status === "DONE") {
            thestatus = "Selesai";
            backColor = "#4BB7AC";
            return this.eachStatusList(
              value,
              ind,
              thestatus,
              backColor,
              bizImage,
              bizLabel,
              payColor,
              payLabel
            );
        }  
        else if (value.order_status === "CANCELLED") {
          thestatus = "Batal";
          backColor = "#DC6A84";
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payColor,
            payLabel
          );
        } else if (value.order_status === "FAILED") {
          thestatus = "Batal";
          backColor = "#DC6A84";
          return this.eachStatusList(
            value,
            ind,
            thestatus,
            backColor,
            bizImage,
            bizLabel,
            payColor,
            payLabel
          );
        } 
      });
  };

  componentWillUnmount() {
    if (this._isMounted) {
      clearInterval(interval.current);
      this._isMounted = false;
    }
  }

  handleTransactionId = (e) =>{
    this.setState({ transactionId: e.target.value});
  }

  render() {

    let { statusIndex, statusList } = this.state;
    let viewSize = (
      <>
        <div className="modal-header-status-cartmanual">
          <span
            className="logopikappCenterBack"
            onClick={() => window.history.back()}
          >
            <img className="LogoPikappBack" src={ArrowBack} alt="" />
          </span>

          <div className="menu-title-status-cartmanual">Cek Transaksi</div>
        </div>

        <div className="status-cartmanual-Wrapper">
        <div className="status-cartmanual-inputarea">
            <input className="status-cartmanual-textbox" placeholder="Masukkan ID Transaksi Anda" onChange={this.handleTransactionId} value={this.state.transactionId} />
            <div className="status-cartmanual-checkbutton" onClick={() => this.getTransactionDetail()}>Cek</div>
        </div>
            {this.contentMainView()}
        </div>
      </>
    );

    return (
      <div className="status-cartmanual-Layout">
        <div className="status-cartmanual-Title">
          <span className="logoCenter-status-cartmanual">
            <img className="LogoPikapp-status-cartmanual" src={pikappLogo} alt="" />
          </span>
        </div>

        <div className="modal-status-cartmanual">
          {!this.state.isMobile ? (
            <div className="modal-content-status-cartmanual">{viewSize}</div>
          ) : (
            <div className="modal-content-status-cartmanual-mob">{viewSize}</div>
          )}
        </div>
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

export default connect(Mapstatetoprops, { DataDetail })(StatusCartManualView);
