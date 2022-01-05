import React, { createRef } from "react";
import { connect } from "react-redux";
import { LoadingButton, DoneLoad } from '../../Redux/Actions'
import pikappLogo from '../../Asset/Logo/logo4x.png';
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import PaymentModal from '../../Component/Modal/PaymentModal';
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";
import { Link } from "react-router-dom";
import { firebaseAnalytics } from '../../firebaseConfig';
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import { onMessageListener } from '../../firebase';
// import { onBackgroundListener } from '../../../public/firebase-messaging-sw';

// const client = new W3CWebSocket('ws://127.0.0.1:8000');

let interval = createRef();

class OrderConfirmationView extends React.Component {
    state = {
        isMobile: false,
        dataOrder: {
            transactionId: "",
            totalPayment: "",
            paymentType: "",
            transactionTime: 0,
        },
        paymentOption: "Pembayaran Di Kasir",
        paymentType: "PAY_BY_CASHIER",
        paymentImage: "",
        counterTime: 59,
        showPayment: false,
        isSubmit: false,
        showResponsePayment: false,
        currentModal: {
            transactionId: "",
            status: "Status",
        },
        mid: "",
        timerMinutes: 0,
        timerSeconds: 0,
    }

    componentDidMount() {
        firebaseAnalytics.logEvent("orderconfirmation_visited");
        if (window.innerWidth < 700) {
            this.setState({ isMobile: true });
        } else {
            this.setState({ isMobile: false });
        }

        let counter = localStorage.getItem("counterPayment");

        if (localStorage.getItem("counterPayment")) {
            if (counter != 0) {
                this.setState({ counterTime: counter });
                this.countDown();
            } else {
                this.setState({ counterTime: counter });
            }
        } else {
            this.countDown()
        }

        if (Object.keys(this.props.AllRedu.dataOrder).length !== 0) {
            if (this.props.AllRedu.dataOrder.paymentType === "PAY_BY_CASHIER") {
                this.setState({ paymentType: "PAY_BY_CASHIER" });
                this.setState({ paymentOption: "Pembayaran Di Kasir" });
                this.setState({ paymentImage: CashierPayment });
            } else if (this.props.AllRedu.dataOrder.paymentType === "WALLET_OVO") {
                this.setState({ paymentType: "WALLET_OVO" });
                this.setState({ paymentOption: "Pembayaran Ovo" });
                this.setState({ paymentImage: OvoPayment });
            }
            this.setState({ dataOrder: this.props.AllRedu.dataOrder });
        } else if (localStorage.getItem("payment")) {
            var dataPayment = JSON.parse(localStorage.getItem("payment"));

            if (dataPayment.paymentType === "PAY_BY_CASHIER") {
                this.setState({ paymentType: "PAY_BY_CASHIER" });
                this.setState({ paymentOption: "Pembayaran Di Kasir" });
                this.setState({ paymentImage: CashierPayment });
            } else if (dataPayment.paymentType === "WALLET_OVO") {
                this.setState({ paymentType: "WALLET_OVO" });
                this.setState({ paymentOption: "Pembayaran Ovo" });
                this.setState({ paymentImage: OvoPayment });
            }

            this.setState({ dataOrder: dataPayment });
        }

        this.showResponsePayment();
    }

    componentDidUpdate() {
        if (this.state.timerMinutes < 0 && this.state.timerSeconds < 0) {
            clearInterval(interval.current);
            console.log("clear");
            localStorage.setItem("counterPayment", this.state.counterTime);
        } else {
            localStorage.setItem("counterPayment", this.state.counterTime);
        }

        if (this.state.currentModal.status === "OPEN") {
            this.showResponsePayment();
        }
    }

    componentWillMount() {
        // client.onopen = () => {
        //     console.log('WebSocket Client Connected');
        // };
        // client.onmessage = (message) => {
        //     let dataFromServer = JSON.parse(message.data);
        //     console.log(dataFromServer);
        // };
    }

    backToHome = () => {
        // let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
        // window.location.href = '/store?mid=' + selectedMerchant[0].mid;
        window.history.back()
    }

    goToStatus = () => {
        // localStorage.setItem("counterPayment", this.state.counterTime);
        window.location.href = '/status';
    }

    countDownTime = () => {
        this.interval = setInterval(
            () => this.setState((state) => ({ counterTime: this.state.counterTime - 1 })),
            1000
        );
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

    showResponsePayment = () => {
        // onMessageListener().then(payload => {
        //     console.log("payload ::: " + payload);
        //     if(payload.data.payment_status === "PAID") {
        //         this.setState({ isSubmit : true });
        //         this.setState({ showResponsePayment : true });
        //     } else if (payload.data.payment_status === "FAILED" || payload.data.payment_status === "ERROR") {
        //         this.setState({ isSubmit : true });
        //         this.setState({ showResponsePayment : false });
        //     }

        // }).catch(err => console.log('failed: ', err));

        // let res = {
        //     isSubmit : this.state.isSubmit,
        //     showResponsePayment : this.state.showResponsePayment
        // }
        // localStorage.setItem("responsePayment", JSON.stringify(res));

        setInterval(async () => {
            let uuid = uuidV4();
            uuid = uuid.replace(/-/g, "");
            const date = new Date().toISOString();
            Axios(address + "txn/v3/" + this.state.dataOrder.transactionId + "/txn-detail/", {
                headers: {
                    "Content-Type": "application/json",
                    "x-request-id": uuid,
                    "x-request-timestamp": date,
                    "x-client-id": clientId
                },
                method: "GET",
            })
                .then((res) => {
                    console.log(res.data.results);
                    var results = res.data.results;
                    var resultModal = { ...this.currentModal }
                    resultModal.transactionId = results.transaction_id
                    resultModal.status = results.status

                    if (resultModal.status === "CLOSE" || resultModal.status === "FINALIZE") {
                        this.setState({ isSubmit: true });
                        this.setState({ showResponsePayment: true });
                    } else if (resultModal.status === "FAILED" || resultModal.status === "ERROR") {
                        this.setState({ isSubmit: true });
                        this.setState({ showResponsePayment: false });
                    }

                    this.setState({
                        currentModal: resultModal
                    })
                })
                .catch((err) => {
                });
        }, 60000);
    }

    countDown = () => {
        var dataPayment = JSON.parse(localStorage.getItem("payment"));
        let dateTime = dataPayment.transactionTime;
        let eventTime = new Date(dateTime).getTime();

        interval = setInterval(() => {
            // based on time set in user's computer time / OS
            const currentTime = new Date().getTime();
            const distance = eventTime - currentTime;

            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );

            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let newMinutes = this.state.timerMinutes;
            newMinutes = minutes;

            let newSeconds = this.state.timerSeconds;
            newSeconds = seconds;

            if (newMinutes < 0 && newSeconds < 0) {
                clearInterval(interval.current);
            } else {
                this.setState({ timerMinutes : newMinutes });
                this.setState({ timerSeconds : newSeconds });
                this.setState({ counterTime: newSeconds });
            }

        }, 1000);

    }


    render() {
        return (
            <div className='orderLayout'>
                <div className='orderTitle'>
                    <span className='logoCenter'>
                        <img className='LogoPikappOrder' src={pikappLogo} alt='' />
                    </span>

                    {/* <div className='iconOrder'>
                        <Link to={"/profile"}>
                        <div className='profileOrder-sec'>
                            <div className='profileOrder'>
                            <span className='reactProfOrder'>
                                <img className='profileOrder-img' src={ProfileIcon} alt='' />
                            </span>
                            </div>
                        </div>
                        </Link>

                        <Link to={"/status"}>
                        <div className='notifOrder-sec'>
                            <div className='notifOrder'>
                            <span className='reactNotifOrder'>
                                <img className='notifOrder-img' src={NotifIcon} alt='' />
                            </span>
                            </div>
                        </div>
                        </Link>
                    </div> */}
                </div>

                <div className='modalOrder'>
                    {
                        !this.state.isMobile ?
                            <div className='modal-content-order'>
                                {
                                    !this.state.isSubmit ?
                                        <div className='modal-header-order'>
                                            <div className='menu-name-order'>
                                                Menunggu Pembayaran
                                            </div>
                                            <div className='menu-counter-order'>
                                                {
                                                // this.state.counterTime < 10 ?
                                                //     <span className="txtIndent"> 00 : 0{this.state.counterTime} </span>
                                                //     :
                                                //     <span className="txtIndent"> 00 : {this.state.counterTime} </span>
                                                <span className="txtIndent">
                                                    {this.state.timerMinutes < 10
                                                        ? `0${this.state.timerMinutes}`
                                                        : this.state.timerMinutes}
                                                    :
                                                    {this.state.timerSeconds < 10
                                                        ? `0${this.state.timerSeconds}`
                                                        : this.state.timerSeconds}
                                                </span>
                                                }
                                            </div>
                                        </div>
                                        :
                                        this.state.showResponsePayment ?
                                            <div className='modal-header-order'>
                                                <div className='menu-name-order'>
                                                    Transaksi Berhasil
                                                </div>
                                            </div>
                                            :
                                            <div className='modal-header-order'>
                                                <div className='menu-name-order'>
                                                    Transaksi Gagal
                                                </div>
                                            </div>
                                }


                                <div className='orderContent'>
                                    <div className='order-transaction'>
                                        <div className='order-transaction-header'>
                                            <div className='order-transaction-title'>
                                                ID Transaksi
                                            </div>
                                        </div>

                                        <div className='order-transaction-content'>
                                            <div className='order-transaction-descArea'>
                                                <h3 className='order-transaction-words'>
                                                    {this.state.dataOrder.transactionId}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='orderContent'>
                                    <div className='order-payment'>
                                        <div className='order-transaction-header'>
                                            <div className='order-transaction-title'>
                                                Total Pembayaran
                                            </div>
                                        </div>

                                        <div className='order-transaction-content'>
                                            <div className='order-transaction-descArea'>
                                                <h3 className='order-transaction-words'>
                                                    Rp. {Intl.NumberFormat("id-ID").format(this.state.dataOrder.totalPayment)}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='orderContent'>
                                    <div className='order-payment'>
                                        <div className='order-transaction-header'>
                                            <div className='order-transaction-title'>
                                                Metode Pembayaran
                                            </div>
                                        </div>

                                        <div className='order-transaction-content'>
                                            <div className='order-transaction-descArea'>
                                                <span>
                                                    <img className='order-transaction-logo' src={this.state.paymentImage} alt='' />
                                                </span>

                                                <h3 className='order-transaction-words'>
                                                    {this.state.paymentOption}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    !this.state.isSubmit ?
                                        <div>
                                            <div className='orderContent'>
                                                <div className='buttonPayment-order'>
                                                    <div className="submitPayment-order" onClick={() => this.setPaymentModal(true)}>
                                                        <div className="wordsButton-order">
                                                            CARA PEMBAYARAN
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='orderContent'>
                                                <div className='buttonSide-order'>
                                                    <p className="linkWords-order" onClick={() => this.backToHome()}>KEMBALI KE HOME</p>
                                                    {
                                                        this.props.AuthRedu.isManualTxn ?
                                                        <Link to={"/statuscartmanual"} style={{ textDecoration: "none" }} className="submitButton-order">
                                                            <div>
                                                                <div className="wordsButton-order">
                                                                    LIHAT PESANAN
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        :
                                                        <Link to={"/status"} style={{ textDecoration: "none" }} className="submitButton-order">
                                                            <div>
                                                                <div className="wordsButton-order">
                                                                    LIHAT PESANAN
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    }
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        this.state.showResponsePayment ?
                                            <div className='orderContent'>
                                                <div className='buttonSide-order'>
                                                    <p className="linkWords-order" onClick={() => this.backToHome()}>KEMBALI KE HOME</p>
                                                    {
                                                        this.props.AuthRedu.isManualTxn ?
                                                        <Link to={"/statuscartmanual"} style={{ textDecoration: "none" }} className="submitButton-order">
                                                            <div>
                                                                <div className="wordsButton-order">
                                                                    LIHAT PESANAN
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        :
                                                        <Link to={"/status"} style={{ textDecoration: "none" }} className="submitButton-order">
                                                            <div>
                                                                <div className="wordsButton-order">
                                                                    LIHAT PESANAN
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <div className='orderContent'>
                                                <div className='buttonBack-order'>
                                                    <div className="submitBack-order" onClick={() => this.backToHome()}>
                                                        <div className="wordsBack-order">
                                                            KEMBALI
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                }
                            </div>
                            :
                            <div className='modal-content-order-mob'>
                                {
                                    !this.state.isSubmit ?
                                        <div className='modal-header-order'>
                                            <div className='menu-name-order'>
                                                Menunggu Pembayaran
                                            </div>
                                            <div className='menu-counter-order'>
                                                {
                                                    // this.state.counterTime < 10 ?
                                                    //     <span className="txtIndent"> 00 : 0{this.state.counterTime} </span>
                                                    //     :
                                                    //     <span className="txtIndent"> 00 : {this.state.counterTime} </span>

                                                    <span className="txtIndent">
                                                        {this.state.timerMinutes < 10
                                                        ? `0${this.state.timerMinutes}`
                                                        : this.state.timerMinutes}
                                                    :
                                                    {this.state.timerSeconds < 10
                                                        ? `0${this.state.timerSeconds}`
                                                        : this.state.timerSeconds}
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                        :
                                        this.state.showResponsePayment ?
                                            <div className='modal-header-order'>
                                                <div className='menu-name-order'>
                                                    Transaksi Berhasil
                                                </div>
                                            </div>
                                            :
                                            <div className='modal-header-order'>
                                                <div className='menu-name-order'>
                                                    Transaksi Gagal
                                                </div>
                                            </div>
                                }

                                <div className='orderContent'>
                                    <div className='order-transaction'>
                                        <div className='order-transaction-header'>
                                            <div className='order-transaction-title'>
                                                ID Transaksi
                                            </div>
                                        </div>

                                        <div className='order-transaction-content'>
                                            <div className='order-transaction-descArea'>
                                                <h3 className='order-transaction-words'>
                                                    {this.state.dataOrder.transactionId}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='orderContent'>
                                    <div className='order-payment'>
                                        <div className='order-transaction-header'>
                                            <div className='order-transaction-title'>
                                                Total Pembayaran
                                            </div>
                                        </div>

                                        <div className='order-transaction-content'>
                                            <div className='order-transaction-descArea'>
                                                <h3 className='order-transaction-words'>
                                                    Rp. {Intl.NumberFormat("id-ID").format(this.state.dataOrder.totalPayment)}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='orderContent'>
                                    <div className='order-payment'>
                                        <div className='order-transaction-header'>
                                            <div className='order-transaction-title'>
                                                Metode Pembayaran
                                            </div>
                                        </div>

                                        <div className='order-transaction-content'>
                                            <div className='order-transaction-descArea'>
                                                <span>
                                                    <img className='order-transaction-logo' src={this.state.paymentImage} alt='' />
                                                </span>

                                                <h3 className='order-transaction-words'>
                                                    {this.state.paymentOption}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    !this.state.isSubmit ?
                                        <div>
                                            <div className='orderContent'>
                                                <div className='buttonPayment-order'>
                                                    <div className="submitPayment-order" onClick={() => this.setPaymentModal(true)}>
                                                        <div className="wordsButton-order">
                                                            CARA PEMBAYARAN
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='orderContent'>
                                                <div className='buttonSide-order'>
                                                    <p className="linkWords-order" onClick={() => this.backToHome()}>KEMBALI KE HOME</p>
                                                    {
                                                        this.props.AuthRedu.isManualTxn ?
                                                        <Link to={"/statuscartmanual"} style={{ textDecoration: "none" }} className="submitButton-order">
                                                            <div>
                                                                <div className="wordsButton-order">
                                                                    LIHAT PESANAN
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        :
                                                        <Link to={"/status"} style={{ textDecoration: "none" }} className="submitButton-order">
                                                            <div>
                                                                <div className="wordsButton-order">
                                                                    LIHAT PESANAN
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        this.state.showResponsePayment ?
                                            <div className='orderContent'>
                                                <div className='buttonSide-order'>
                                                    <p className="linkWords-order" onClick={() => this.backToHome()}>KEMBALI KE HOME</p>
                                                    {
                                                        this.props.AuthRedu.isManualTxn ?
                                                        <Link to={"/statuscartmanual"} style={{ textDecoration: "none" }} className="submitButton-order">
                                                            <div>
                                                                <div className="wordsButton-order">
                                                                    LIHAT PESANAN
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        :
                                                        <Link to={"/status"} style={{ textDecoration: "none" }} className="submitButton-order">
                                                            <div>
                                                                <div className="wordsButton-order">
                                                                    LIHAT PESANAN
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <div className='orderContent'>
                                                <div className='buttonBack-order'>
                                                    <div className="submitBack-order" onClick={() => this.backToHome()}>
                                                        <div className="wordsBack-order">
                                                            KEMBALI
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                }

                            </div>
                    }
                    {this.showDialogPayment()}

                </div>
            </div>
        );
    }
}
const Mapstatetoprops = (state) => {
    return {
        AllRedu: state.AllRedu,
        AuthRedu: state.AuthRedu
    }
}

export default connect(Mapstatetoprops, { LoadingButton, DoneLoad })(OrderConfirmationView)