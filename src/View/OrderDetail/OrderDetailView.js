import React from "react";
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import Loader from 'react-loader-spinner'
import { Redirect } from "react-router-dom";
import { LoadingButton, DoneLoad, TransactionId } from '../../Redux/Actions'
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import pikappLogo from '../../Asset/Logo/logo4x.png';
import NotifIcon from '../../Asset/Icon/bell.png';
import ProfileIcon from '../../Asset/Icon/avatar.png';
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import PaymentModal from '../../Component/Modal/PaymentModal';
import moment from 'moment';
import idLocale from "moment/locale/id";

class OrderDetailView extends React.Component {
    state = {
        isMobile : false,
        dataOrder : {
            transactionId : "",
            totalPayment : "",
            paymentType : "",
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
            total_price : 0,
            productQty : 0,
            eat_type : "",
            paymentOption : "",
            paymentImage : "",
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
        showPayment : false,
    }

    componentDidMount() {
        moment.updateLocale('id', idLocale);
        if(window.innerWidth < 700) {
            this.setState({ isMobile : true });
        } else {
            this.setState({ isMobile : false });
        }
        
        this.getTxnDetail();
        if(localStorage.getItem("payment")){
            var dataPayment = JSON.parse(localStorage.getItem("payment"));
            this.setState({ dataOrder : dataPayment});
        } 
    }

    getTxnDetail(){
        let transactionId = localStorage.getItem("transactionId");
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
        Axios(address + "txn/v2/" + transactionId + "/txn-detail/", {
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

            // const today = Date.now();

            // resultModal.transactionTime = Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(results.transaction_time)
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

            if(resultModal.biz_type === "DINE_IN") {
                resultModal.eat_type = "Makan Di Tempat";
            } else {
                resultModal.eat_type = "Bungkus / Takeaway";
            }

            if(resultModal.payment === "PAY_BY_CASHIER") {
                resultModal.paymentOption = "Pembayaran Di Kasir";
                resultModal.paymentImage = CashierPayment;
            } else {
                resultModal.paymentOption = "OVO";
                resultModal.paymentImage = OvoPayment;
            }

            resultModal.transactionTime = moment(resultModal.transactionTime).format('Do MMMM YYYY, H:mm');

            this.setState({
                currentModal: resultModal
            })

            // console.log(this.state.currentModal.transactionTime.toISOString());
        })
        .catch((err) => {
        });
    }

    setPaymentModal(isShow) {
        this.setState({ showPayment: isShow })
        document.body.style.overflowY = ''
    }

    showDialogPayment = () => {
        if(this.state.showPayment === true) {
            return (
                <PaymentModal
                  isShowPaymentModal={this.state.showPayment}
                  onHidePaymentModal={() => this.setPaymentModal(false)}
                />
            );
        }
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

        return (
            <div className='orderDetailLayout'>
                <div className='orderDetailTitle'>
                    <span className='logopikappCenter' onClick={() => window.history.back()} >
                    <img className='LogoPikapporderDetail' src={ArrowBack} alt='' />
                    </span>

                    <h2 className='confirmationOrderDetail'>Detail Transaksi</h2>
                </div>

                {
                        !this.state.isMobile ?

                        <div className='orderDetailContent'>
                            <div className='orderDetail-LeftSide'>
                                <div className='orderDetailList'>
                                    <div className='orderDetailList-header'>
                                    <h4 className='orderDetailList-title'>
                                        Item Yang Dibeli
                                    </h4>
                                    </div>

                                    {storeFood}
                                </div>
                            </div>

                            <div className='orderDetail-RightSide'>
                                <div className='flex-RightSide-orderDetail'>

                                    <div className='orderDetail-transaction-detail'>
                                    {
                                    this.state.currentModal.status === "PAID" ?
                                        <div className='orderDetail-transaction-header-detail'>
                                            <div className='orderDetail-transaction-title-detail'>
                                                Transaksi Berhasil
                                            </div>
                                        </div>
                                    :
                                        <div className='orderDetail-transaction-header-unpaid'>
                                            <div className='orderDetail-transaction-title-unpaid'>
                                                Menunggu Pembayaran
                                            </div>
                                            <div className='menu-counter-orderdetail'>
                                                01:22
                                            </div>
                                        </div>
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
                                                {/* {moment(this.state.currentModal.transactionTime).format('MMMM Do YYYY, h:mm a')} */}
                                                {/* {Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(this.state.currentModal.transactionTime)} */}
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
                                    this.state.currentModal.status === "PAID" ?
                                        <div></div>
                                        :
                                        <div className='buttonPayment-orderDetail'>
                                            <div className="submitPayment-orderDetail" onClick={() => this.setPaymentModal(true)}>
                                                <div className="wordsButton-orderDetail">
                                                    CARA PEMBAYARAN
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    :

                    <div className='orderDetailContent'>
                        <div className='orderDetail-LeftSide'>
                            <div className='orderDetail-transaction-detail'>

                                {
                                this.state.currentModal.status === "PAID" ?
                                    <div className='orderDetail-transaction-header-detail'>
                                        <div className='orderDetail-transaction-title-detail'>
                                            Transaksi Berhasil
                                        </div>
                                    </div>
                                    :
                                    <div className='orderDetail-transaction-header-unpaid'>
                                        <div className='orderDetail-transaction-title-unpaid'>
                                            Menunggu Pembayaran
                                        </div>
                                        <div className='menu-counter-orderdetail'>
                                            01:22
                                        </div>
                                    </div>
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
                                this.state.currentModal.status === "PAID" ?
                                    <div></div>
                                    :
                                    <div className='buttonPayment-orderDetail'>
                                        <div className="submitPayment-orderDetail" onClick={() => this.setPaymentModal(true)}>
                                            <div className="wordsButton-orderDetail">
                                                CARA PEMBAYARAN
                                            </div>
                                        </div>
                                    </div>
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
  
export default connect(Mapstatetoprops, { LoadingButton, DoneLoad, TransactionId })(OrderDetailView)