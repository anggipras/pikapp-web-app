import React, { createRef } from "react";
import { firebaseAnalytics } from "../../firebaseConfig";
import pikappLogo from "../../Asset/Logo/logo4x.png";
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import DanaPayment from "../../Asset/Icon/dana_icon.png";
import ShopeePayment from "../../Asset/Icon/shopee_icon.png";
import NoTransaction from "../../Asset/Icon/notrans.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { DataDetail, DataDetailTxn } from "../../Redux/Actions";
import TransactionService from "../../Services/transaction.service";
import AnalyticsService from "../../Services/analytics.service";
import { withRouter } from 'react-router-dom';
import DeliveryIcon from "../../Asset/Icon/shipping-icon.png";
import PikappLogo from "../../Asset/Logo/logo-blue.png";
import copy from 'copy-to-clipboard';
import CopyIcon from "../../Asset/Icon/copy-icon.png";

let interval = createRef();

export class OrderReceiptView extends React.Component {
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
            shipping_time_type: "",
            shipping_service_type_category: ""
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
        payment_method: "",
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
    this.sendTracking();
    if (window.innerWidth < 700) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }

    var txnid = "";
    txnid = this.props.match.params.txnid;

    this.getTransactionDetail(txnid);
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

    // if (this.state.staticCountDown) {
    //   this.countDownTimer();
    //   this.setState({ staticCountDown: false });
    // }
  }

  getTransactionDetail(transactionId) {
    var reqHeader = {
      invoice : transactionId
    }
    
    TransactionService.getTransactionDetailDelivery(reqHeader)
    .then((res) => {
      var results = res.data.results;
      var stateData = { ...this.state };
      stateData.data.pop();
      
      stateData.data.push(results);
      this.setState({ data: stateData.data, staticCountDown: true });
      this.props.DataDetailTxn(results);
      localStorage.setItem("deliveryData", JSON.stringify(results));
    })
    .catch((err) => {
      console.log(err);
    })
  }

  contentStatus = (value, status, backColor, pimg, plab, pmethod, plogo) => {
    let formatDate = value.transactionTime;
    return (
      <div
        className="order-receipt-transaction-content"
      >
          <div className="order-receipt-header-sec">
            <img src={PikappLogo} className="order-receipt-logo"></img>
            <div className='order-receipt-tracking' style={{ backgroundColor: backColor }}>
              <div className='order-receipt-tracking-button'>
                <h1 className='order-receipt-tracking-word'>{status}</h1>
              </div>
            </div>
          </div>
          <div className="order-receipt-txnid-section">
              <h3 className="order-receipt-transactionid">ID Transaksi {value.transaction_id}</h3>
              <img className='order-receipt-copyicon' src={CopyIcon} onClick={() => this.copyTxnId(value.transaction_id)}></img>
          </div>
          <div>
              <h3 className="order-receipt-transactiondate">{moment(value.transaction_time).format("Do MMMM YYYY, H:mm")}</h3>
          </div>
          <div className="order-receipt-transaction-section">
              <h3 className="order-receipt-content-transaction">Jenis Transaksi</h3>
              <div className="order-receipt-content-txn">
                <img src={DeliveryIcon} className="order-receipt-content-transactionimg"></img>
                <h3 className="order-receipt-content-transactioninfo">{value.order_type}</h3>
              </div>
          </div>
          <div className="order-receipt-content-border"></div>

          <div className="order-receipt-transaction-topSide">
              <h3 className="order-receipt-transaction-merchName">
                {
                  value.shipping.shipping_service_type_category !== null ?
                  <span>{value.shipping.shipping_method} - {value.shipping.shipping_service_type_category}</span>
                  :
                  <span>Diambil Sendiri</span>
                }
              </h3>
              {/* <img className='order-receipt-content-icon' src={ManualIcon}></img> */}
          </div>

          <div>
              <h3 className="order-receipt-item">{value.merchant_name}</h3>
          </div>
          <div className="order-receipt-content-date">
              <span className="order-receipt-datetext">Tanggal Pengiriman : </span><span className="order-receipt-dateinfo">{moment(value.shipping.shipping_time).format("DD MMMM YYYY, H:mm")}</span>
          </div>
          <div className="order-receipt-content-border"></div>

          <div className="order-receipt-paymentservice">
            <span>
              <img
                className="order-receipt-paymentservice-logo"
                src={plogo}
                alt=""
              />
            </span>

            <h3 className="order-receipt-paymentservice-words">{pmethod}</h3>
          </div>

          <div className="order-receipt-transaction-topSide">
              <h3 className="order-receipt-content-paymentstatus">Status Pembayaran</h3>

              <h3 className="order-receipt-content-paymentinfo" style={{ color: pimg }}>{plab}</h3>
          </div>
          <div className="order-receipt-content-border"></div>

              {
                  value.productList.map((product, indprod) => {
                      return (
                          <div key={indprod} className="order-receipt-transaction-centerSide">
                              <div className="order-receipt-transaction-item">
                                <div className="order-receipt-section-quantity">
                                    <h3  className='order-receipt-content-quantity'>{product.quantity}x</h3>
                                </div>
                                <div className="order-receipt-section-item">
                                    <h3 className='order-receipt-content-item'>{product.product_name}</h3>
                                    <h3 className='order-receipt-content-desc'>{product.extra_menus}</h3>
                                    {
                                      product.notes ?
                                      <h3 className='order-receipt-content-desc'><span className="order-receipt-content-notes">Catatan : </span>{product.notes}</h3>
                                      :
                                      <></>
                                    }
                                </div>
                              </div>
                              <div>
                              <div className="order-receipt-section-item">
                                  <h3 className='order-receipt-content-price'>Rp {Intl.NumberFormat("id-ID").format((product.price * product.quantity) + (product.extraPrice * product.quantity))}</h3>
                              </div>
                              </div>
                          </div>
                      )
                  })
              }
          <div className="order-receipt-content-border"></div>

          <div className="order-receipt-section-subtotal">
              <h3 className="order-receipt-content-item">Sub-total</h3>
              <h3 className="order-receipt-content-item">Rp {Intl.NumberFormat("id-ID").format(value.total_product_price)}</h3>
          </div>

          <div className="order-receipt-section-shippingprice">
              <h3 className="order-receipt-content-item">Total Diskon</h3>
              <h3 className="order-receipt-content-item">Rp {Intl.NumberFormat("id-ID").format(value.total_discount)}</h3>
          </div>

          <div className="order-receipt-section-shippingprice">
              <h3 className="order-receipt-content-item">Ongkos Kirim</h3>
              <h3 className="order-receipt-content-item">Rp {Intl.NumberFormat("id-ID").format(value.shipping.shipping_cost)}</h3>
          </div>

          <div className="order-receipt-section-shippingprice">
              <h3 className="order-receipt-content-item">Asuransi Pengiriman</h3>
              <h3 className="order-receipt-content-item">Rp {Intl.NumberFormat("id-ID").format(value.shipping.shipping_insurance_cost)}</h3>
          </div>
              
          <div className="order-receipt-content-border"></div>

          <div className="order-receipt-section-subtotal">
              <h3 className="order-receipt-content-totalprice">Total</h3>
              <h3 className="order-receipt-content-totalprice">Rp {Intl.NumberFormat("id-ID").format(value.total_payment)}</h3>
          </div>

          {/* <div className="order-receipt-section-price">
            <div>
              <h3 className="order-receipt-content-totalitem">Total</h3>
              <h3 className="order-receipt-content-totalprice">Rp {Intl.NumberFormat("id-ID").format(value.total_payment)}</h3>
            </div>
            {
              value.order_type === "DELIVERY" ?
                value.order_status === "DELIVER" ?
                <Link to="/tracking" style={{ textDecoration: "none" }}>
                  <div className='order-receipt-tracking' >
                    <div className='order-receipt-tracking-button'>
                      <h1 className='order-receipt-tracking-word'>Lacak</h1>
                    </div>
                  </div>
                </Link>
                :
                <></>
              :
              <></>
            }
          </div> */}
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
    payColor,
    payLabel,
    payMethod,
    payImage
  ) => {
    return (
      <div key={ind} className="order-receipt-Content">
        {this.contentStatus(value, thestatus, backColor, payColor, payLabel, payMethod, payImage)}
      </div>
    );
  };

  contentMainView = () => {
    let bizImage;
    let bizLabel;
    let payImage;
    let payLabel;
    let payColor;
    let payMethod;

    let currentState = this.state.statusIndex;
      let data = this.state.data;

      if (data.length === 0) {
        return (
          <div className="order-receipt-noTrans-content">
            <span>
              <img src={NoTransaction} className="order-receipt-noTrans-img" alt="" />
            </span>

            <div className="order-receipt-noTrans-title">Anda Belum Melakukan Transaksi</div>
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

        if (value.payment_method === "WALLET_OVO") {
          payImage = OvoPayment;
          payMethod = "Ovo";
        } else if (value.payment_method === "WALLET_DANA") {
          payImage = DanaPayment;
          payMethod = "DANA";
        } else if (value.payment_method === "WALLET_SHOPEEPAY") {
          payImage = ShopeePayment;
          payMethod = "ShopeePay";
        }

        let thestatus;
        let backColor;
        if (value.order_status === "OPEN") {
          thestatus = "Menunggu Pembayaran";
          backColor = "#F4B55B";
          return (
            this.contentStatus(
                value,
                thestatus,
                backColor,
                payColor,
                payLabel,
                payMethod,
                payImage
              )
          );
        }
        else if (value.order_status === "ON_PROCESS") {
          thestatus = "Diproses";
          backColor = "#F4B55B";
          return (
              this.contentStatus(
                value,
                thestatus,
                backColor,
                payColor,
                payLabel,
                payMethod,
                payImage
              )
          );
        } else if (value.order_status === "DELIVER") {
            if(value.order_type === "DELIVERY") {
              thestatus = "Dikirim";
              backColor = "#4BB7AC";
            } else {
              thestatus = "Siap Diambil";
              backColor = "#4BB7AC";
            }
            return this.eachStatusList(
              value,
              ind,
              thestatus,
              backColor,
              bizImage,
              bizLabel,
              payColor,
              payLabel,
              payMethod,
              payImage
            );
        } 
        else if (value.order_status === "FINALIZE") {
            if(value.order_type === "DELIVERY") {
              thestatus = "Sampai";
              backColor = "#4BB7AC";
            } else {
              thestatus = "Sudah Diambil"; 
              backColor = "#4BB7AC";
            }
            return this.eachStatusList(
              value,
              ind,
              thestatus,
              backColor,
              bizImage,
              bizLabel,
              payColor,
              payLabel,
              payMethod,
              payImage
            );
        }
        else if (value.order_status === "CLOSE") {
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
              payLabel,
              payMethod,
              payImage
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
            payLabel,
            payMethod,
            payImage
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
            payLabel,
            payMethod,
            payImage
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

  sendTracking() {
    var reqHeader = {
      token : "PUBLIC"
    }

    var reqBody = {
      merchant_id: "-",
      event_type: "VIEW_DETAIL",
      page_name: window.location.pathname
    }
    
    AnalyticsService.sendTrackingPage(reqHeader, reqBody)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  backToHome = () => {
    let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
    window.location.href = '/' + selectedMerchant[0].username;
  }

  copyTxnId = (transactionId) => {
    copy(transactionId, {
        debug: true,
        message: 'Transaction ID Copy to Clipboard',
    });
  } 

  render() {

    let { statusIndex, statusList } = this.state;
    let viewSize = (
      <>
        <div className="order-receipt-header">
            <span className="order-receipt-back" onClick={() => this.backToHome()}>
                <img className="order-receipt-backicon" src={ArrowBack} alt='' />
            </span>
            <div className="order-receipt-titletext">Payment Receipt</div>
        </div>

        <div className="order-receipt-Wrapper">
            {this.contentMainView()}
        </div>
        {
          this.state.data[0].order_type === "DELIVERY" ?
            this.state.data[0].order_status === "DELIVER" ?
            <Link to="/tracking" style={{ textDecoration: "none" }}>
              <div className="order-receipt-footer-sec">
                <div className="order-receipt-buttonfooter" style={{backgroundColor: '#4bb7ac'}}>Lacak</div>
              </div>
            </Link>
            :
            this.state.data[0].order_status === "CLOSE" ?
            <div className="order-receipt-footer-sec">
              <div className="order-receipt-buttonfooter" style={{backgroundColor: '#4bb7ac'}}>Beri Penilaian</div>
            </div>
            :
            <></>
            :
            <></>
        }
        
      </>
    );

    return (
      <div className="order-receipt-Layout">
        <div className="order-receipt-Title">
          <span className="logoCenter-order-receipt">
            <img className="LogoPikapp-order-receipt" src={pikappLogo} alt="" />
          </span>
        </div>

        <div className="modal-order-receipt">
          {!this.state.isMobile ? (
            <div className="modal-content-order-receipt">{viewSize}</div>
          ) : (
            <div className="modal-content-order-receipt-mob">{viewSize}</div>
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
    CartRedu: state.CartRedu,
  };
};

export default withRouter(connect(Mapstatetoprops, { DataDetail, DataDetailTxn })(OrderReceiptView));
