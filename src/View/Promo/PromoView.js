import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import '../../Asset/scss/PromoLayout.scss'
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import PromoAlert from "../../Asset/Icon/ic_promo_alert.png";
import takeawayColor from '../../Asset/Icon/takeawayColor.png'
import paymentColor from '../../Asset/Icon/CashierPayment.png'
import moment from "moment";
import { useLocation } from "react-router-dom"

const PromoView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const location = useLocation()
    const promoTitle = location.state.title
    const promoAlert = location.state.alert
    const alertStatus = location.state.alertStatus
    const declaredShipment = ["Pick Up", "Delivery", "Dine In"]
    const [promoListData, setPromoListData] = useState([
        {
            promo_title: "PIKAPPTAHUNBARU 5rb",
            promo_period_start: "2021-01-03T19:00:00",
            promo_period_end: "2021-01-07T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "5000",
            promo_shipment_method: ["Delivery", "Pick Up", "Dine In"],
            promo_payment_method: ["Cash", "OVO"]
        },
        {
            promo_title: "SPESIALKIRIM 15rb",
            promo_period_start: "2021-02-04T19:00:00",
            promo_period_end: "2021-02-08T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "15000",
            promo_shipment_method: ["Delivery", "Dine In"],
            promo_payment_method: ["Cash", "OVO"]
        },
        {
            promo_title: "AMBILSENDIRI 15rb",
            promo_period_start: "2021-03-05T19:00:00",
            promo_period_end: "2021-03-09T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "15000",
            promo_shipment_method: ["Pick Up"],
            promo_payment_method: ["Cash"]
        },
        {
            promo_title: "AMBILSENDIRI 15rb",
            promo_period_start: "2021-03-05T19:00:00",
            promo_period_end: "2021-03-09T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "15000",
            promo_shipment_method: ["Pick Up"],
            promo_payment_method: ["OVO"]
        },
    ])
    const [disabledPromoListData, setDisabledPromoListData] = useState([])
    const [selectedPromo, setSelectedPromo] = useState(-1)

    useEffect(() => {
        var selectedPromoListContainer = []
        var disabledPromoListContainer = []
        if (alertStatus.phoneNumber == "0" && alertStatus.paymentType == 0) {
            selectedPromoListContainer = promoListData
        } else if(alertStatus.phoneNumber == "" && alertStatus.paymentType == -1) {
            selectedPromoListContainer = promoListData
        } else {
            promoListData.forEach(val => {
                if (CartRedu.pickupType == 0) {
                    if (alertStatus.paymentType == 0) {
                        if (val.promo_shipment_method.includes("Pick Up") && val.promo_payment_method.includes("OVO")) {
                            selectedPromoListContainer.push(val)
                        } else {
                            disabledPromoListContainer.push(val)
                        }
                    }
                } else {
                    
                }
            })
        }
        // console.log("SELECTED", selectedPromoListContainer)
        // console.log("DISABLE", disabledPromoListContainer)
        setPromoListData(selectedPromoListContainer)
        setDisabledPromoListData(disabledPromoListContainer)
    }, [])

    const selectPromo = (ind) => {
        setSelectedPromo(ind)
    }

    const shipmentMethod = (val) => {
        var shipmentString = ''
        if (val.length == 1) {
            shipmentString = val[0]
        } else {
            val.forEach((el, ind) => {
                if (ind == val.length-1) {
                    shipmentString += `dan ${el}`
                } else if(ind == val.length-2) {
                    shipmentString += `${el} `
                } else {
                    shipmentString += `${el}, `
                }
            });
        }
        return shipmentString
    }

    const paymentMethod = (val) => {
        var paymentString = ''
        if (val.length == 1) {
            paymentString = val[0]
        } else {
            val.forEach((el, ind) => {
                if (ind == val.length-1) {
                    paymentString += `dan ${el}`
                } else if(ind == val.length-2) {
                    paymentString += `${el} `
                } else {
                    paymentString += `${el}, `
                }
            });
        }
        return paymentString
    }

    const disabledPromoList = () => {
        return disabledPromoListData.map((val, ind) => {
            return (
                <div key={ind} className='promolistbox-section-disabled' >
                    <input disabled id={val.promo_title} type='radio' value={val.promo_title} name="promoVoucher" />
                    <label htmlFor={val.promo_title}>
                        <div className='promolist-side'>
                            <div className='promolist-circle-name'>{val.promo_title}</div>
    
                            <div className='promolist-detail'>
                                <div className='promolist-detail-period'>Periode: {moment(new Date(val.promo_period_start)).format("DD MMMM YYYY")} - {moment(new Date(val.promo_period_end)).format("DD MMMM YYYY")}</div>
                                <div className='promolist-detail-minOrder'>Minimal order Rp {Intl.NumberFormat("id-ID").format(val.promo_min_order)}</div>
                                <div className='promolist-detail-maxDiscount'>Maksimal diskon Rp {Intl.NumberFormat("id-ID").format(val.promo_max_discount)}</div>
                            </div>
                        </div>
    
                        <div className="promolist-bottomInfo-layout">
                            <div className="promolist-shipment-layout">
                                <div className="promolist-shipment-circleLayout">
                                    <img src={takeawayColor} className='promolist-shipment-icon' alt='' />
                                </div>
                                <div className="promolist-shipment-text">
                                    {shipmentMethod(val.promo_shipment_method)}
                                </div>
                            </div>
    
                            <div className="promolist-payment-layout">
                                <div className="promolist-payment-circleLayout">
                                    <img src={paymentColor} className='promolist-payment-icon' alt='' />
                                </div>
                                <div className="promolist-payment-text">
                                    {paymentMethod(val.promo_payment_method)}
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            )
        })
    }

    const promoPageList = () => {
        return promoListData.map((val, ind) => {
            return (
                <div key={ind} className={alertStatus.phoneNumber == "" || alertStatus.paymentType == -1 ? 'promolistbox-section-disabled':'promolistbox-section'} >
                    <input onClick={() => selectPromo(ind)} disabled={ promoAlert == 0 || alertStatus.phoneNumber == "" || alertStatus.paymentType == -1 } id={val.promo_title} type='radio' value={val.promo_title} name="promoVoucher" />
                    <label htmlFor={val.promo_title}>
                        <div className='promolist-side'>
                            <div className='promolist-circle-name'>{val.promo_title}</div>
    
                            <div className='promolist-detail'>
                                <div className='promolist-detail-period'>Periode: {moment(new Date(val.promo_period_start)).format("DD MMMM YYYY")} - {moment(new Date(val.promo_period_end)).format("DD MMMM YYYY")}</div>
                                <div className='promolist-detail-minOrder'>Minimal order Rp {Intl.NumberFormat("id-ID").format(val.promo_min_order)}</div>
                                <div className='promolist-detail-maxDiscount'>Maksimal diskon Rp {Intl.NumberFormat("id-ID").format(val.promo_max_discount)}</div>
                            </div>
                        </div>
    
                        <div className="promolist-bottomInfo-layout">
                            <div className="promolist-shipment-layout">
                                <div className="promolist-shipment-circleLayout">
                                    <img src={takeawayColor} className='promolist-shipment-icon' alt='' />
                                </div>
                                <div className="promolist-shipment-text">
                                    {shipmentMethod(val.promo_shipment_method)}
                                </div>
                            </div>
    
                            <div className="promolist-payment-layout">
                                <div className="promolist-payment-circleLayout">
                                    <img src={paymentColor} className='promolist-payment-icon' alt='' />
                                </div>
                                <div className="promolist-payment-text">
                                    {paymentMethod(val.promo_payment_method)}
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            )
        })
    }

    const goBack = () => {
        window.history.go(-1)
    }

    return (
        <>
            <div className="promoPage-layout">
                <div className="promoPage-topSide">
                    <div className="promoPage-header">
                        <span className="promoPage-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="promoPage-title">{promoTitle}</div>
                    </div>

                    {
                        promoAlert == 0 ?
                        null
                        :
                            alertStatus.phoneNumber == "" || alertStatus.paymentType == -1 ?
                            <div className="promo-alert-paymentnotselected">
                                <span className="promo-alert-icon">
                                    <img className="alert-icon" src={PromoAlert} alt='' />
                                </span>

                                <div className="promo-alert-title">Pilih metode pengiriman dan pembayaran terlebih dahulu!</div>
                            </div>
                            :
                            null
                    }

                    <div className='promoPage-section' style={{display: "block", marginBottom: disabledPromoListData.length == 0? "45px":"0px"}}>
                        {promoPageList()}
                    </div>

                    <div className='promoPage-section' style={{display: disabledPromoListData.length == 0? "none":"block", marginBottom: "45px"}}>
                        {disabledPromoList()}
                    </div>

                    <div className='promoPage-button-layout' style={{display: promoAlert == 0? "none":"flex"}}>
                        <div 
                        className='promoPage-button' 
                        style={{ 
                            backgroundColor: promoAlert == 0? "#aaaaaa" 
                            : 
                                alertStatus.phoneNumber == "" || alertStatus.paymentType == -1 ?
                                "#aaaaaa"
                                :
                                selectedPromo == -1 ?
                                "#aaaaaa"
                                :
                                "#4bb7ac" 
                            }}>
                            Simpan
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PromoView