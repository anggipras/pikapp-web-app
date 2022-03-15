import React, { createRef } from "react";
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";
import { connect } from "react-redux";
import { LoadingButton, DoneLoad, DataDetail } from '../../Redux/Actions'
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import DanaPayment from "../../Asset/Icon/dana_icon.png";
import ShopeePayment from "../../Asset/Icon/shopee_icon.png";
import PaymentModal from '../../Component/Modal/PaymentModal';
import moment from 'moment';
import idLocale from "moment/locale/id";
import { firebaseAnalytics } from '../../firebaseConfig';

let interval = createRef();

class OrderDetailView extends React.Component {
    state = {
        isMobile: false,
        dataDetail: {
            transactionId: "",
            transactionTime: ""
        },
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
            total_price: 0,
            productQty: 0,
            eat_type: "",
            paymentOption: "",
            paymentImage: "",
            transactionCounter: 0,
            timerMinutes: 0,
            timerSeconds: 0,
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
        showPayment: false,
    }

    componentDidMount() {
        firebaseAnalytics.logEvent("orderdetail_visited");
        moment.updateLocale('id', idLocale);
        this.sendTracking();
        if (window.innerWidth < 700) {
            this.setState({ isMobile: true });
        } else {
            this.setState({ isMobile: false });
        }

        this.getTxnDetail();
    }

    getTxnDetail() {
        let transactionId
        if (Object.keys(this.props.AllRedu.dataDetail).length !== 0) {
            transactionId = this.props.AllRedu.dataDetail.transactionId;
        } else if (localStorage.getItem("dataDetail")) {
            var dataDetail = JSON.parse(localStorage.getItem("dataDetail"));
            transactionId = dataDetail.transactionId;
        }
        let uuid = uuidV4();
        uuid = uuid.replace(/-/g, "");
        const date = new Date().toISOString();
        Axios(address + "txn/v3/" + transactionId + "/txn-detail/", {
            headers: {
                "Content-Type": "application/json",
                "x-request-id": uuid,
                "x-request-timestamp": date,
                "x-client-id": clientId
            },
            method: "GET",
        })
            .then((res) => {
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
                resultModal.total_price = results.total_price
                resultModal.productQty = results.detail_products.length
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

                if (resultModal.biz_type === "DINE_IN") {
                    resultModal.eat_type = "Makan Di Tempat";
                } else {
                    resultModal.eat_type = "Bungkus / Takeaway";
                }

                if (resultModal.payment === "PAY_BY_CASHIER") {
                    resultModal.paymentOption = "Pembayaran Di Kasir";
                    resultModal.paymentImage = CashierPayment;
                } else if (resultModal.payment === "WALLET_OVO") {
                    resultModal.paymentOption = "OVO";
                    resultModal.paymentImage = OvoPayment;
                } else if (resultModal.payment === "WALLET_DANA") {
                    resultModal.paymentOption = "DANA";
                    resultModal.paymentImage = DanaPayment;
                } else if (resultModal.payment === "WALLET_SHOPEEPAY") {
                    resultModal.paymentOption = "ShopeePay";
                    resultModal.paymentImage = ShopeePayment;
                }


                resultModal.transactionTime = moment(resultModal.transactionTime).format('Do MMMM YYYY, H:mm');

                this.setState({
                    currentModal: resultModal
                })

                this.countDown();

            })
            .catch((err) => {
            });
    }

    componentDidUpdate() {
        if (this.state.currentModal.timerMinutes < 0 && this.state.currentModal.timerSeconds < 0) {
            clearInterval(interval.current);
            console.log("success clear");
            if (this.state.currentModal.status === "OPEN") {
                this.transactionUpdate();
            }
        }
    }

    setPaymentModal(isShow) {
        this.setState({ showPayment: isShow })
        document.body.style.overflowY = ''
    }

    showDialogPayment = () => {
        if (this.state.showPayment === true) {
            return (
                <PaymentModal
                    isShowPaymentModal={this.state.showPayment}
                    onHidePaymentModal={() => this.setPaymentModal(false)}
                />
            );
        }
    }

    countDown = () => {
        if (this.state.currentModal.status === "OPEN") {

            let transactionTime
            if (Object.keys(this.props.AllRedu.dataDetail).length !== 0) {
                transactionTime = this.props.AllRedu.dataDetail.transactionTime;
            } else if (localStorage.getItem("dataDetail")) {
                var dataDetail = JSON.parse(localStorage.getItem("dataDetail"));
                transactionTime = dataDetail.transactionTime;
            }

            transactionTime = transactionTime.replace(/ /g, "T");
            let eventTime = new Date(transactionTime).getTime();

            interval = setInterval(() => {
                // based on time set in user's computer time / OS
                const currentTime = new Date().getTime();
                const distance = eventTime - currentTime;

                const minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                let newMinutes = this.state.currentModal.timerMinutes;
                newMinutes = minutes;

                let newSeconds = this.state.currentModal.timerSeconds;
                newSeconds = seconds;

                this.setState({ currentModal: { ...this.state.currentModal, timerMinutes: newMinutes } });
                this.setState({ currentModal: { ...this.state.currentModal, timerSeconds: newSeconds } });

            }, 1000);

        }
    }

    transactionUpdate = () => {
        let uuid = uuidV4();
        uuid = uuid.replace(/-/g, "");
        const date = new Date().toISOString();

        let transactionTime
        if (Object.keys(this.props.AllRedu.dataDetail).length !== 0) {
            transactionTime = this.props.AllRedu.dataDetail.transactionTime;
        } else if (localStorage.getItem("dataDetail")) {
            var dataDetail = JSON.parse(localStorage.getItem("dataDetail"));
            transactionTime = dataDetail.transactionTime;
        }

        var bodyFormData = new FormData();
        bodyFormData.append("transaction_id", this.state.currentModal.transactionId);
        bodyFormData.append("status", "FAILED");

        var options = {
            method: "post",
            url: address + "txn/v2/txn-update/",
            headers: {
                "x-client-id": clientId,
                "x-request-id": uuid,
                "x-request-timestamp": date
            },
            data: bodyFormData,
        };

        Axios(options)
            .then(() => {
                console.log("updated");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    goBack = () => {
        // window.location.href = "/status";
        window.history.go(-1)
    }

    sendTracking() {
        let uuid = uuidV4();
        const date = new Date().toISOString();
        uuid = uuid.replace(/-/g, "");
    
        Axios(address + "home/v1/event/add", {
            headers: {
                "Content-Type": "application/json",
                "x-request-id": uuid,
                "x-request-timestamp": date,
                "x-client-id": clientId,
                "token" : "PUBLIC"
            },
            method: "POST",  
            data: { 
                merchant_id: "-",
                event_type: "VIEW_DETAIL",
                page_name: window.location.pathname
            }
        })
        .then((res) => {
            console.log(res.data.results);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render() {
        let productList = this.state.currentModal.food;
        let storeFood
        storeFood = productList.map((food, index) => {
            return (
                <div key={index} className='orderDetailList-content'>
                    <div className='orderDetailList-content-frame'>
                        <img className='orderDetailList-content-image' src={food.image} alt='' />
                    </div>

                    <div className='orderDetailList-content-detail'>
                        <div className='orderDetailList-content-detail-left'>
                            <h2 className='orderDetailList-content-title'>{food.name}</h2>
                            <h5 className='orderDetailList-content-notes'>{food.quantity} Item</h5>
                            <h5 className='orderDetailList-content-notes'>{food.note}</h5>
                        </div>

                        <div className='orderDetailList-amountBox'>
                            <h3 className='orderDetailList-content-price'>Rp. {Intl.NumberFormat("id-ID").format(food.price)}</h3>
                        </div>
                    </div>
                </div>
            )
        });

        let headerTransaction = () => {
            let statusDesc
            let backColor
            if (this.state.currentModal.status === "PAID") {
                statusDesc = "Menunggu Konfirmasi";
                backColor = "#FBA83C";
            }
            else if (this.state.currentModal.status === "ON_PROCESS") {
                statusDesc = "Sedang Dimasak";
                backColor = "#FBA83C";
            }
            else if (this.state.currentModal.status === "DELIVER") {
                statusDesc = "Makanan Tiba";
                backColor = "#4BB7AC";
            }
            else if (this.state.currentModal.status === "CLOSE" || this.state.currentModal.status === "FINALIZE") {
                statusDesc = "Transaksi Selesai";
                backColor = "#4BB7AC";
            }
            else if (this.state.currentModal.status === "FAILED" || this.state.currentModal.status === "ERROR") {
                statusDesc = "Transaksi Gagal";
                backColor = "#DC6A84";
            }

            return (
                // <div className='orderDetail-transaction-header-detail' style={{ backgroundColor: backColor }}>
                //     <div className='orderDetail-transaction-title-detail'>
                //         {statusDesc}
                //     </div>
                // </div>

                <div className='orderdetail-txnstatus-layout'>
                    <div className='orderdetail-txnstatus-Title' style={{ color: backColor }}></div>

                    <div className="orderdetail-txnstatus-Number">{statusDesc}</div>
                </div>
            )
        }

        return (
            <div className='orderDetailLayout'>
                {/* <div className='orderDetailTitle'>
                    <span className='logopikappCenter' onClick={() => this.goBack()} >
                        <img className='LogoPikapporderDetail' src={ArrowBack} alt='' />
                    </span>

                    <h2 className='confirmationOrderDetail'>Detail Transaksi</h2>
                </div> */}

                <div className="manual-orderdetail-header">
                    <span className="manual-orderdetail-back" onClick={() => window.history.back()}>
                        <img className="manual-orderdetail-backicon" src={ArrowBack} alt='' />
                    </span>
                    <div className="manual-orderdetail-titletext">Detail Transaksi</div>
                </div>

                {
                    this.state.currentModal.status === "OPEN" ?
                        <div className='orderDetail-transaction-header-unpaid'>
                            <div className='orderDetail-transaction-title-unpaid'>
                                Menunggu Pembayaran
                            </div>
                            <div className='menu-counter-orderdetail'>
                                {this.state.currentModal.timerMinutes < 10
                                    ? `0${this.state.currentModal.timerMinutes}`
                                    : this.state.currentModal.timerMinutes}
                                :
                                {this.state.currentModal.timerSeconds < 10
                                    ? `0${this.state.currentModal.timerSeconds}`
                                    : this.state.currentModal.timerSeconds}
                            </div>
                        </div>
                        :
                        headerTransaction()
                }

                {
                    // !this.state.isMobile ?

                    //     <div className='orderDetailContent'>
                    //         <div className='orderDetail-LeftSide'>
                    //             <div className='orderDetailList'>
                    //                 <div className='orderDetailList-header'>
                    //                     <h4 className='orderDetailList-title'>
                    //                         Item Yang Dibeli
                    //                     </h4>
                    //                 </div>

                    //                 {storeFood}
                    //             </div>
                    //         </div>

                    //         <div className='orderDetail-RightSide'>
                    //             <div className='flex-RightSide-orderDetail'>

                    //                 <div className='orderDetail-transaction-detail'>
                    //                     {
                    //                         this.state.currentModal.status === "OPEN" ?
                    //                             <div className='orderDetail-transaction-header-unpaid'>
                    //                                 <div className='orderDetail-transaction-title-unpaid'>
                    //                                     Menunggu Pembayaran
                    //                                 </div>
                    //                                 <div className='menu-counter-orderdetail'>
                    //                                     {this.state.currentModal.timerMinutes < 10
                    //                                         ? `0${this.state.currentModal.timerMinutes}`
                    //                                         : this.state.currentModal.timerMinutes}
                    //                                     :
                    //                                     {this.state.currentModal.timerSeconds < 10
                    //                                         ? `0${this.state.currentModal.timerSeconds}`
                    //                                         : this.state.currentModal.timerSeconds}
                    //                                 </div>
                    //                             </div>
                    //                             :
                    //                             headerTransaction()
                    //                     }

                    //                     <div className='orderDetail-transaction-content'>
                    //                         <div className='orderDetail-transaction-descArea'>
                    //                             ID Transaksi
                    //                         </div>
                    //                         <div className='orderDetail-transaction-descArea-content'>
                    //                             {this.state.currentModal.transactionId}
                    //                         </div>

                    //                         <div className='orderDetail-transaction-descArea'>
                    //                             Waktu Transaksi
                    //                         </div>
                    //                         <div className='orderDetail-transaction-descArea-content'>
                    //                             {this.state.currentModal.transactionTime}
                    //                         </div>

                    //                         <div className='orderDetail-transaction-descArea'>
                    //                             Nama Restoran
                    //                         </div>
                    //                         <div className='orderDetail-transaction-descArea-content'>
                    //                             {this.state.currentModal.storeName}
                    //                         </div>

                    //                         <div className='orderDetail-transaction-descArea'>
                    //                             Cara Makan
                    //                         </div>
                    //                         <div className='orderDetail-transaction-descArea-content'>
                    //                             {this.state.currentModal.eat_type}
                    //                         </div>
                    //                     </div>
                    //                 </div>

                    //                 <div className='orderDetail-transaction'>
                    //                     <div className='orderDetail-transaction-header'>
                    //                         <div className='orderDetail-transaction-title'>
                    //                             Informasi Pembayaran
                    //                         </div>
                    //                     </div>

                    //                     <div className='orderDetail-transaction-content'>
                    //                         <div className='orderDetail-transaction-paymentoption'>
                    //                             <div>Metode Pembayaran</div>
                    //                             <div>
                    //                                 <span>
                    //                                     <img className='orderdetail-transaction-logo' src={this.state.currentModal.paymentImage} alt='' />
                    //                                 </span>
                    //                                 {this.state.currentModal.paymentOption}
                    //                             </div>
                    //                         </div>

                    //                         <div className="orderDetail-payment-border"></div>

                    //                         <div className='orderDetail-transaction-payment-price'>
                    //                             <div>Total Harga ( {this.state.currentModal.productQty} Item )</div>
                    //                             <div>Rp. {Intl.NumberFormat("id-ID").format(this.state.currentModal.total_price)}</div>
                    //                         </div>

                    //                         <div className='orderDetail-transaction-payment-detail'>
                    //                             <div>Total Bayar</div>
                    //                             <div>Rp. {Intl.NumberFormat("id-ID").format(this.state.currentModal.total_price)}</div>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //                 {
                    //                     this.state.currentModal.status === "PAID" ?
                    //                         <div></div>
                    //                         :
                    //                         <div className='buttonPayment-orderDetail'>
                    //                             <div className="submitPayment-orderDetail" onClick={() => this.setPaymentModal(true)}>
                    //                                 <div className="wordsButton-orderDetail">
                    //                                     CARA PEMBAYARAN
                    //                                 </div>
                    //                             </div>
                    //                         </div>
                    //                 }
                    //             </div>
                    //         </div>
                    //     </div>
                    //     :
                        <div className='orderDetailContent'>
                            <div className='orderDetail-LeftSide'>
                                <div className='orderDetail-transaction-detail'>

                                    {
                                        // this.state.currentModal.status === "OPEN" ?
                                        //     <div className='orderDetail-transaction-header-unpaid'>
                                        //         <div className='orderDetail-transaction-title-unpaid'>
                                        //             Menunggu Pembayaran
                                        //         </div>
                                        //         <div className='menu-counter-orderdetail'>
                                        //             {this.state.currentModal.timerMinutes < 10
                                        //                 ? `0${this.state.currentModal.timerMinutes}`
                                        //                 : this.state.currentModal.timerMinutes}
                                        //             :
                                        //             {this.state.currentModal.timerSeconds < 10
                                        //                 ? `0${this.state.currentModal.timerSeconds}`
                                        //                 : this.state.currentModal.timerSeconds}
                                        //         </div>
                                        //     </div>
                                        //     :
                                        //     headerTransaction()
                                    }

                                    <div className='orderDetail-transaction-content'>
                                        <div className='orderDetail-transaction-descArea'>
                                            ID Transaksi
                                        </div>
                                        <div className='orderDetail-transaction-descArea-content'>
                                            {this.state.currentModal.transactionId}
                                        </div>

                                        <div className='orderDetail-transaction-descArea'>
                                            Waktu Transaksi
                                        </div>
                                        <div className='orderDetail-transaction-descArea-content'>
                                            {this.state.currentModal.transactionTime}
                                        </div>

                                        <div className='orderDetail-transaction-descArea'>
                                            Nama Restoran
                                        </div>
                                        <div className='orderDetail-transaction-descArea-content'>
                                            {this.state.currentModal.storeName}
                                        </div>

                                        <div className='orderDetail-transaction-descArea'>
                                            Cara Makan
                                        </div>
                                        <div className='orderDetail-transaction-descArea-content'>
                                            {this.state.currentModal.eat_type}
                                        </div>
                                    </div>
                                </div>

                                <div className='orderDetailList'>
                                    <div className='orderDetailList-header'>
                                        <h4 className='orderDetailList-title'>
                                            Item Yang Dibeli
                                        </h4>
                                        <h4 className='manual-orderdetail-itembox'>
                                            {this.state.currentModal.food.length} Item
                                        </h4>
                                    </div>

                                    {storeFood}
                                </div>
                            </div>

                            <div className='orderDetail-RightSide'>
                                <div className='flex-RightSide-orderDetail'>

                                    <div className='orderDetail-transaction'>
                                        <div className='orderDetail-transaction-header'>
                                            <div className='orderDetail-transaction-title'>
                                                Informasi Pembayaran
                                            </div>
                                        </div>

                                        <div className='orderDetail-transaction-content'>
                                            <div className='orderDetail-transaction-paymentoption'>
                                                <div>Metode Pembayaran</div>
                                                <div>
                                                    <span>
                                                        <img className='orderdetail-transaction-logo' src={this.state.currentModal.paymentImage} alt='' />
                                                    </span>
                                                    {this.state.currentModal.paymentOption}
                                                </div>
                                            </div>

                                            <div className="orderDetail-payment-border"></div>

                                            <div className='orderDetail-transaction-payment-price'>
                                                <div>Total Harga ( {this.state.currentModal.productQty} Item )</div>
                                                <div>Rp. {Intl.NumberFormat("id-ID").format(this.state.currentModal.total_price)}</div>
                                            </div>

                                            <div className='orderDetail-transaction-payment-detail'>
                                                <div>Total Bayar</div>
                                                <div>Rp. {Intl.NumberFormat("id-ID").format(this.state.currentModal.total_price)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        this.state.currentModal.status === "OPEN" ?
                                            <div className='buttonPayment-orderDetail'>
                                                <div className="submitPayment-orderDetail" onClick={() => this.setPaymentModal(true)}>
                                                    <div className="wordsButton-orderDetail">
                                                        Cara Pembayaran
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div></div>
                                    }

                                </div>
                            </div>
                        </div>
                }
                {this.showDialogPayment()}
            </div>
        )
    }
}

const Mapstatetoprops = (state) => {
    return {
        AllRedu: state.AllRedu,
        AuthRedu: state.AuthRedu
    }
}

export default connect(Mapstatetoprops, { LoadingButton, DoneLoad, DataDetail })(OrderDetailView)