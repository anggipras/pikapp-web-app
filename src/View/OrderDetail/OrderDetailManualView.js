import React, { createRef } from "react";
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";
import { connect } from "react-redux";
import { LoadingButton, DoneLoad, DataDetailTxn } from '../../Redux/Actions'
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import PaymentModal from '../../Component/Modal/PaymentModal';
import moment from 'moment';
import idLocale from "moment/locale/id";
import { firebaseAnalytics } from '../../firebaseConfig';
import ManualIcon from "../../Asset/Icon/call.png";

let interval = createRef();

class OrderDetailManualView extends React.Component {
    state = {
        isMobile: false,
        data : {
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
        },
    }

    componentDidMount() {
        moment.updateLocale('id', idLocale);
        this.sendTracking();
        if (window.innerWidth < 700) {
            this.setState({ isMobile: true });
        } else {
            this.setState({ isMobile: false });
        }

        // if (Object.keys(this.props.AllRedu.dataDetailTxn).length !== 0) {
            this.setState({ data : this.props.AllRedu.dataDetailTxn })
        // }
    }

    componentDidUpdate() {
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
        return (
            <div className='manual-orderdetail-Layout'>
                <div className='manual-orderdetail-Title'>
                    {/* <span className='logopikappCenter' onClick={() => this.goBack()} >
                        <img className='LogoPikapporderDetail' src={ArrowBack} alt='' />
                    </span>

                    <h2 className='confirmationOrderDetail'>Detail Transaksi</h2> */}
                    <div className="manual-orderdetail-header">
                        <span className="manual-orderdetail-back" onClick={() => window.history.back()}>
                            <img className="manual-orderdetail-backicon" src={ArrowBack} alt='' />
                        </span>
                        <div className="manual-orderdetail-titletext">Detail Transaksi</div>
                    </div>
                </div>

                {
                    <div className='manual-orderdetail-Content'>
                        <div className='manual-orderdetail-LeftSide'>
                            <div className='manual-orderdetail-transaction-detail'>

                                <div className="manual-orderdetail-transaction-content">
                                    <div>
                                        <h3 className="manual-orderdetail-transactionid">ID Transaksi {this.state.data.transaction_id}</h3>
                                    </div>
                                    <div>
                                        <h3 className="manual-orderdetail-transactiondate">{moment(this.state.data.transaction_time).format("Do MMMM YYYY, H:mm")}</h3>
                                    </div>
                                    <div className="manual-orderdetail-content-border"></div>

                                        {
                                            this.state.data.productList.map((product, indprod) => {
                                                return (
                                                    <div key={indprod} className="manual-orderdetail-transaction-centerSide">
                                                        <div className="manual-orderdetail-transaction-item">
                                                            <div className="manual-orderdetail-section-quantity">
                                                                <h3  className='manual-orderdetail-content-quantity'>{product.quantity}x</h3>
                                                            </div>
                                                            <div className="manual-orderdetail-section-item">
                                                                <h3 className='manual-orderdetail-content-item'>{product.product_name}</h3>
                                                                <h3 className='manual-orderdetail-content-desc'>{product.notes}</h3>
                                                            </div>
                                                            </div>
                                                        <div>
                                                            <div className="manual-orderdetail-section-item">
                                                                <h3 className='manual-orderdetail-content-price'>Rp {Intl.NumberFormat("id-ID").format(product.price * product.quantity)}</h3>
                                                                <h3 className='manual-orderdetail-content-desc'>Rp {Intl.NumberFormat("id-ID").format(product.price)}/item</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        
                                    <div className="manual-orderdetail-content-border"></div>

                                    <div className="manual-orderdetail-section-subtotal">
                                        <h3 className="manual-orderdetail-content-item">Sub-total</h3>
                                        <h3 className="manual-orderdetail-content-item">Rp {Intl.NumberFormat("id-ID").format(this.state.data.total_product_price)}</h3>
                                    </div>

                                    <div className="manual-orderdetail-section-shippingprice">
                                        <h3 className="manual-orderdetail-content-item">Ongkos Kirim</h3>
                                        <h3 className="manual-orderdetail-content-item">Rp {Intl.NumberFormat("id-ID").format(this.state.data.shipping.shipping_cost)}</h3>
                                    </div>

                                    <div className="manual-orderdetail-section-shippingprice">
                                        <h3 className="manual-orderdetail-content-item">Asuransi Pengiriman</h3>
                                        <h3 className="manual-orderdetail-content-item">Rp {Intl.NumberFormat("id-ID").format(this.state.data.shipping.shipping_cost)}</h3>
                                    </div>

                                    <div className="manual-orderdetail-content-border"></div>

                                    <div className="manual-orderdetail-section-price">
                                        <h3 className="manual-orderdetail-content-totalitem">Total</h3>
                                        <h3 className="manual-orderdetail-content-totalprice">Rp {Intl.NumberFormat("id-ID").format(this.state.data.total_payment)}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
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

export default connect(Mapstatetoprops, { LoadingButton, DoneLoad, DataDetailTxn })(OrderDetailManualView)