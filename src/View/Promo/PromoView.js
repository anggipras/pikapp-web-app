import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import '../../Asset/scss/PromoLayout.scss'
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import PromoAlert from "../../Asset/Icon/ic_promo_alert.png";
import takeawayColor from '../../Asset/Icon/takeawayColor.png'
import paymentColor from '../../Asset/Icon/CashierPayment.png'
import moment from "moment";
import Cookies from "js-cookie"
import { useLocation } from "react-router-dom"

const PromoView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const location = useLocation()
    const promoTitle = location.state.title
    const promoAlert = location.state.alert
    const alertStatus = location.state.alertStatus
    const cartStatus = location.state.cartStatus
    const [manualTxnVar, setManualTxnVar] = useState(0)
    const declaredShipment = ["PICKUP", "DELIVERY", "DINE_IN"]
    const declaredPayment = ["PAY_BY_CASHIER", "WALLET_OVO", "WALLET_DANA", "WALLET_SHOPEEPAY"]
    const [promoListData, setPromoListData] = useState([
        {
            promo_title: "PIKAPPTAHUNBARU 5rb",
            promo_period_start: "2021-01-03T19:00:00",
            promo_period_end: "2021-01-07T19:00:00",
            promo_min_order: "20000",
            promo_max_discount: "5000",
            promo_shipment_method: ["DELIVERY", "PICKUP", "DINE_IN"],
            promo_payment_method: ["PAY_BY_CASHIER", "WALLET_OVO"]
        },
        {
            promo_title: "SPESIALKIRIM 15rb",
            promo_period_start: "2021-02-04T19:00:00",
            promo_period_end: "2021-02-08T19:00:00",
            promo_min_order: "40000",
            promo_max_discount: "15000",
            promo_shipment_method: ["DELIVERY", "DINE_IN"],
            promo_payment_method: ["PAY_BY_CASHIER", "WALLET_OVO"]
        },
        {
            promo_title: "SPESIALKIRIM 25rb",
            promo_period_start: "2021-02-04T19:00:00",
            promo_period_end: "2021-02-08T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "25000",
            promo_shipment_method: ["DINE_IN"],
            promo_payment_method: ["PAY_BY_CASHIER", "WALLET_OVO"]
        },
        {
            promo_title: "AMBILSENDIRI 10rb",
            promo_period_start: "2021-03-05T19:00:00",
            promo_period_end: "2021-03-09T19:00:00",
            promo_min_order: "30000",
            promo_max_discount: "10000",
            promo_shipment_method: ["PICKUP"],
            promo_payment_method: ["PAY_BY_CASHIER"]
        },
        {
            promo_title: "AMBILSENDIRI 15rb",
            promo_period_start: "2021-03-05T19:00:00",
            promo_period_end: "2021-03-09T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "15000",
            promo_shipment_method: ["PICKUP"],
            promo_payment_method: ["WALLET_OVO"]
        },
    ])
    const [disabledPromoListData, setDisabledPromoListData] = useState([])
    const [selectedPromo, setSelectedPromo] = useState(-1)
    const [selectedPromoData, setSelectedPromoData] = useState(null)

    useEffect(() => {
        var selectedPromoListContainer = []
        var disabledPromoListContainer = []
        let isManualTxn = Cookies.get("isManualTxn")
        setManualTxnVar(isManualTxn)
        if (isManualTxn == 0) {
            if (promoAlert == 0) {
                selectedPromoListContainer = promoListData
            } else {
                promoListData.forEach(val => {
                    let promoMinPrice = parseInt(val.promo_min_order)
                    if (val.promo_payment_method.includes(cartStatus.paymentType) && val.promo_shipment_method.includes(cartStatus.bizType) && cartStatus.totalPayment >= promoMinPrice) {
                        selectedPromoListContainer.push(val)
                    } else {
                        disabledPromoListContainer.push(val)
                    }
                })
            }
        } else {
            if (alertStatus.phoneNumber == "0" && alertStatus.paymentType == 0) {
                selectedPromoListContainer = promoListData
            } else if(alertStatus.phoneNumber == "" && alertStatus.paymentType == -1) {
                selectedPromoListContainer = promoListData
            } else {
                promoListData.forEach(val => {
                    let promoMinPrice = parseInt(val.promo_min_order)
                    if (val.promo_shipment_method.includes(CartRedu.pickupTitleType) && val.promo_payment_method.includes(CartRedu.paymentTitleType) && cartStatus.totalPayment >= promoMinPrice) {
                        selectedPromoListContainer.push(val)
                    } else {
                        disabledPromoListContainer.push(val)
                    }
                })
            }
        }
        setPromoListData(selectedPromoListContainer)
        setDisabledPromoListData(disabledPromoListContainer)
    }, [])

    const selectPromo = (val, ind) => {
        setSelectedPromoData(val)
        setSelectedPromo(ind)
    }

    const shipmentMethod = (val) => {
        var shipmentString = ''
        if (val.length == 1) {
            if (val[0] == "PICKUP") {
                shipmentString = "Pick Up"
            } else if(val[0] == "TAKE_AWAY") {
                shipmentString = "Pick Up"
            } else if(val[0] == "DINE_IN") {
                shipmentString = "Dine In"
            } else {
                shipmentString += `${val[0].charAt(0).toUpperCase() + val[0].slice(1).toLocaleLowerCase()} `
            }
        } else {
            val.forEach((el, ind) => {
                if (el == "PICKUP") {
                    if (ind == val.length-1) {
                        shipmentString += `dan Pick Up`
                    } else if(ind == val.length-2) {
                        shipmentString += `Pick Up `
                    } else {
                        shipmentString += `Pick Up, `
                    }
                } else if(el == "TAKE_AWAY") {
                    if (ind == val.length-1) {
                        shipmentString += `dan Pick Up`
                    } else if(ind == val.length-2) {
                        shipmentString += `Pick Up `
                    } else {
                        shipmentString += `Pick Up, `
                    }
                } else if(el == "DINE_IN") {
                    if (ind == val.length-1) {
                        shipmentString += `dan Dine In`
                    } else if(ind == val.length-2) {
                        shipmentString += `Dine In `
                    } else {
                        shipmentString += `Dine In, `
                    }
                } else {
                    if (ind == val.length-1) {
                        shipmentString += `dan ${el.charAt(0).toUpperCase() + el.slice(1).toLocaleLowerCase()}`
                    } else if(ind == val.length-2) {
                        shipmentString += `${el.charAt(0).toUpperCase() + el.slice(1).toLocaleLowerCase()} `
                    } else {
                        shipmentString += `${el.charAt(0).toUpperCase() + el.slice(1).toLocaleLowerCase()}, `
                    }
                }
            });
        }
        return shipmentString
    }

    const paymentMethod = (val) => {
        var paymentString = ''
        if (val.length == 1) {
            if (val[0] == "PAY_BY_CASHIER") {
                paymentString += "Cash"
            } else {
                let splittedPaymentMethod = val[0].split("WALLET_")
                paymentString += splittedPaymentMethod[1]
            }
        } else {
            val.forEach((el, ind) => {
                if (el == "PAY_BY_CASHIER") {
                    if (ind == val.length-1) {
                        paymentString += `dan Cash`
                    } else if(ind == val.length-2) {
                        paymentString += `Cash `
                    } else {
                        paymentString += `Cash, `
                    }
                } else {
                    let splittedPaymentMethod = el.split("WALLET_")
                    if (ind == val.length-1) {
                        paymentString += `dan ${splittedPaymentMethod[1]}`
                    } else if(ind == val.length-2) {
                        paymentString += `${splittedPaymentMethod[1]} `
                    } else {
                        paymentString += `${splittedPaymentMethod[1]}, `
                    }
                }
            });
        }
        return paymentString
    }

    const disabledPromoListDeliveryTxn = () => {
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

    const disabledPromoListDineinTxn = () => {
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

    const promoPageListDeliveryTxn = () => {
        return promoListData.map((val, ind) => {
            return (
                <div key={ind} className={alertStatus.phoneNumber == "" || alertStatus.paymentType == -1 ? 'promolistbox-section-disabled':'promolistbox-section'} >
                    <input onClick={() => selectPromo(val, ind)} disabled={ promoAlert == 0 || alertStatus.phoneNumber == "" || alertStatus.paymentType == -1 } id={val.promo_title} type='radio' value={val.promo_title} name="promoVoucher" />
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

    const promoPageListDineinTxn = () => {
        return promoListData.map((val, ind) => {
            return (
                <div key={ind} className={alertStatus.phoneNumber == "" || alertStatus.paymentType == -1 ? 'promolistbox-section-disabled':'promolistbox-section'} >
                    <input onClick={() => selectPromo(val, ind)} disabled={ promoAlert == 0 || alertStatus.phoneNumber == "" || alertStatus.paymentType == -1 } id={val.promo_title} type='radio' value={val.promo_title} name="promoVoucher" />
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

    const onSubmitPromo = () => {
        if (selectedPromo != -1) {
            if (manualTxnVar == 0) {
                Cookies.set("NOTMATCHPROMO", { theBool: false })
                localStorage.setItem("SELECTED_PROMO", JSON.stringify(selectedPromoData))
            } else {
                Cookies.set("MANUAL_NOTMATCHPROMO", { theBool: false })
                localStorage.setItem("MANUAL_SELECTED_PROMO", JSON.stringify(selectedPromoData))
            }
            window.history.go(-1)
        }
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

                    {
                        promoListData.length > 0 ?
                        <div className="selectedPromo-title" style={{display: promoAlert == 0 || alertStatus.phoneNumber == "" || alertStatus.paymentType == -1? "none":"block"}} >
                            Pilih 1
                        </div>
                        :
                        null
                    }

                    {
                        manualTxnVar == 1 ?
                        <div className='promoPage-section' style={{display: "block", marginBottom: disabledPromoListData.length == 0? "45px":"0px"}}>
                            {promoPageListDeliveryTxn()}
                        </div>
                        :
                        <div className='promoPage-section' style={{display: "block", marginBottom: disabledPromoListData.length == 0? "45px":"0px"}}>
                            {promoPageListDineinTxn()}
                        </div>
                    }

                    <div className="disabledPromo-title" style={{display: disabledPromoListData.length == 0? "none":"block"}}>
                        Voucher Tidak Dapat Dipilih
                    </div>

                    {
                        manualTxnVar == 1 ?
                        <div className='promoPage-section' style={{display: disabledPromoListData.length == 0? "none":"block", marginBottom: "45px"}}>
                            {disabledPromoListDeliveryTxn()}
                        </div>
                        :
                        <div className='promoPage-section' style={{display: disabledPromoListData.length == 0? "none":"block", marginBottom: "45px"}}>
                            {disabledPromoListDineinTxn()}
                        </div>
                    }
                    

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
                            }}
                        onClick={() => onSubmitPromo()}>
                            Simpan
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PromoView