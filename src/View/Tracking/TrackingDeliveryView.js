import React, { createRef } from "react";
import { address, addressShipping, secret, clientId } from "../../Asset/Constant/APIConstant";
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
import CourierPhoto from "../../Asset/Icon/courier_photo.png";

class TrackingDeliveryView extends React.Component {
    state = {
        isMobile: false,
        data : {
            shipping : {
                shipping_method: "",
                shipping_cost: 0,
                shipping_time: "",
                shipping_time_type: "",
                waybill_id : ""
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
        dataCourier : {
            id: "",
            waybill_id: "TX12345",
            courier: {
                company: "Gojek",
                name: "Anastasya",
                phone: "089660050299"
            },
            destination: {
                contact_name: "",
                address: ""
            },
            history: [{
                note: "SHIPMENT RECEIVED BY JNE COUNTER OFFICER AT [JAKARTA]",
                updated_at: "2021-03-16T18:17:00+07:00",
                status: "dropping_off"
            }, {
                note: "RECEIVED AT SORTING CENTER [JAKARTA]",
                updated_at: "2021-03-16T21:15:00+07:00",
                status: "dropping_off"
            }, {
                note: "SHIPMENT FORWARDED TO DESTINATION [JAKARTA , HUB VETERAN BINTARO]",
                updated_at: "2021-03-16T23:12:00+07:00",
                status: "dropping_off"
            }, {
                note: "RECEIVED AT INBOUND STATION [JAKARTA , HUB VETERAN BINTARO]",
                updated_at: "2021-03-16T23:43:00+07:00",
                status: "dropping_off"
            }, {
                note: "WITH DELIVERY COURIER [JAKARTA , HUB VETERAN BINTARO]",
                updated_at: "2021-03-17T09:29:00+07:00",
                status: "dropping_off"
            }, {
                note: "DELIVERED TO [ainul yakin | 17-03-2021 11:15 | JAKARTA]",
                updated_at: "2021-03-17T11:15:00+07:00",
                status: "delivered"
            }],
            link: "",
            order_id: "",
            status: ""
        }
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

        // if (Object.keys(this.props.AllRedu.dataDetailTxn).length !== 0) {
            this.setState({ data : this.props.AllRedu.dataDetailTxn },
                () => {
                    this.getTrackingOrder();
                })
        // }

        let list = this.state.dataCourier.history.sort().reverse();
        // this.setState({ history : list });
    }

    componentDidUpdate() {
    }

    getTrackingOrder() {
        var request = {
            waybill_id : this.state.data.shipping.waybill_id,
            courier : this.state.data.shipping.shipping_method
        }
        let uuid = uuidV4();
        uuid = uuid.replace(/-/g, "");
        const date = new Date().toISOString();
        let historyTransAPI = addressShipping + '/api/webhook/v1/order-status'
        Axios(historyTransAPI, {
        headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
        },
        method: "POST",
        data: request
        })
        .then((res) => {
            var results = res.data.results;
            this.setState({ dataCourier: results });
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

    handleCourierPhone = (phone) => { //go to Whatsapp chat
        phone.substring(1)
        let waNumber = '62' + phone
        window.location.href = `https://wa.me/${waNumber}`
    }

    render() {
        let statusTransaction = () => {
            let statusDesc
            let color
            if (this.state.data.order_status === "ON_PROCESS") {
                statusDesc = "Pesanan Diproses";
                color = "#F4B55B";
            }
            else if (this.state.data.order_status === "DELIVER") {
                statusDesc = "Pesanan Dikirim";
                color = "#4BB7AC";
            }
            else if (this.state.data.order_status === "FINALIZE") {
                statusDesc = "Pesanan Sampai";
                color = "#4BB7AC";
            }
            else if (this.state.data.order_status === "CLOSE") {
                statusDesc = "Pesanan Selesai";
                color = "#4BB7AC";
            }
            else if (this.state.data.order_status === "CANCELLED") {
                statusDesc = "Pesanan Batal";
                color = "#DC6A84";
            }

            else if (this.state.data.order_status === "FAILED") {
                statusDesc = "Pesanan Batal";
                color = "#DC6A84";
            }

            return (
                <div className="tracking-delivery-section-subtotal">
                    <h3 className="tracking-delivery-info-order">Status Pengiriman</h3>
                    <h3 className="tracking-delivery-info-order" style={{ color : color }}>{statusDesc}</h3>
                </div>
            )
        }
        return (
            <div className="tracking-delivery-mainLayout">
                <div className='tracking-delivery-Title'>
                    <div className="tracking-delivery-header">
                        <span className="tracking-delivery-back" onClick={() => window.history.back()}>
                            <img className="tracking-delivery-backicon" src={ArrowBack} alt='' />
                        </span>
                        <div className="tracking-delivery-titletext">Lacak</div>
                    </div>
                </div>
                <div className='tracking-delivery-Layout'>
                    {
                        <div className='tracking-delivery-Content'>
                            <div className='tracking-delivery-LeftSide'>
                                <div className='tracking-delivery-transaction-detail'>

                                    <div className="tracking-delivery-transaction-content">
                                        {statusTransaction()}
                                        {/* <div className="tracking-delivery-section-subtotal">
                                            <h3 className="tracking-delivery-info-order">Status Pengiriman</h3>
                                            <h3 className="tracking-delivery-info-order" style={{ color : "#F4B55B" }}>Pesanan Selesai</h3>
                                        </div> */}
                                        <div>
                                            <h3 className="tracking-delivery-transactionid">Resi Pengiriman: {this.state.dataCourier.waybill_id}</h3>
                                        </div>
                                        {/* <div>
                                            <h3 className="tracking-delivery-transactiondate">Estimasi Tiba di tujuan: {moment(this.state.data.transaction_time).format("Do MMMM YYYY, H:mm")}</h3>
                                        </div> */}
                                        <div className="tracking-delivery-content-border"></div>

                                        <div className="tracking-delivery-transaction-topSide">
                                            <h3 className="tracking-delivery-transaction-merchName">{this.state.data.shipping.shipping_method}</h3>
                                        </div>
                                        <div>
                                            <h3 className="tracking-delivery-item">{this.state.data.merchant_name}</h3>
                                        </div>
                                        <div className="tracking-delivery-content-date">
                                            <span className="tracking-delivery-datetext">Tanggal Pengiriman : </span><span className="tracking-delivery-dateinfo">{moment(this.state.data.shipping.shipping_time).format("DD MMMM YYYY, H:mm")}</span>
                                        </div>
                                        <div className="tracking-delivery-content-border"></div>

                                        <div className="tracking-delivery-courier">
                                            <div>
                                                <h3 className="tracking-delivery-content-call">Hubungi Kurir</h3>
                                                <div className="tracking-delivery-section-courier">
                                                    <div className="tracking-delivery-content-info">
                                                        {/* <div>
                                                            <img className='tracking-delivery-content-icon' src={CourierPhoto}></img>
                                                        </div> */}
                                                        <div className="tracking-delivery-courier-info">
                                                            <h3 className="tracking-delivery-courier-name">{this.state.dataCourier.courier.name}</h3>
                                                            <h3 className="tracking-delivery-courier-phone">{this.state.dataCourier.courier.phone}</h3>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <img onClick={() => this.handleCourierPhone(this.state.dataCourier.courier.phone)} className='tracking-delivery-content-icon' src={ManualIcon}></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tracking-delivery-content-border"></div>

                                        {
                                        this.state.dataCourier.history.map((ship, ind) => {
                                            return (
                                                <div key={ind} className="tracking-delivery-transaction-centerSide">
                                                    <div className="tracking-delivery-section-quantity">
                                                        <h3  className='tracking-delivery-content-item'>{moment(ship.updated_at).format("DD/MM/YYYY")}</h3>
                                                        <h3  className='tracking-delivery-content-hour'>{moment(ship.updated_at).format("H:mm")}</h3>
                                                    </div>
                                                    <div className="tracking-delivery-section-item">
                                                        <h3 className='tracking-delivery-content-detail'>{ship.note}</h3>
                                                        {/* <h3 className='tracking-delivery-content-desc'>Jakarta Barat</h3> */}
                                                    </div>
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
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

export default connect(Mapstatetoprops, { LoadingButton, DoneLoad, DataDetailTxn })(TrackingDeliveryView)