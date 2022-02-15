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
    const [promoListData, setPromoListData] = useState([
        {
            promo_title: "PIKAPPTAHUNBARU 5rb",
            promo_period_start: "2021-01-03T19:00:00",
            promo_period_end: "2021-01-07T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "5000",
            promo_shipment_method: "Delivery, Pick Up, dan Dine In",
            promo_payment_method: "Cash dan OVO"
        },
        {
            promo_title: "SPESIALKIRIM 15rb",
            promo_period_start: "2021-02-04T19:00:00",
            promo_period_end: "2021-02-08T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "15000",
            promo_shipment_method: "Delivery, Pick Up, dan Dine In",
            promo_payment_method: "Cash dan OVO"
        },
        {
            promo_title: "AMBILSENDIRI 15rb",
            promo_period_start: "2021-03-05T19:00:00",
            promo_period_end: "2021-03-09T19:00:00",
            promo_min_order: "50000",
            promo_max_discount: "15000",
            promo_shipment_method: "Pick Up",
            promo_payment_method: "Cash"
        },
    ])

    const promoPageList = () => {
        return promoListData.map((val, ind) => {
            return (
                <div key={ind} className='promolistbox-section'>
                    <input id={val.promo_title} type='radio' value={val.promo_title} name="promoVoucher" />
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
                                    {val.promo_shipment_method}
                                </div>
                            </div>
    
                            <div className="promolist-payment-layout">
                                <div className="promolist-payment-circleLayout">
                                    <img src={paymentColor} className='promolist-payment-icon' alt='' />
                                </div>
                                <div className="promolist-payment-text">
                                    {val.promo_payment_method}
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
                            CartRedu.phoneNumber == "" || CartRedu.pickupType == -1 ?
                            <div className="promo-alert-paymentnotselected">
                                <span className="promo-alert-icon">
                                    <img className="alert-icon" src={PromoAlert} alt='' />
                                </span>

                                <div className="promo-alert-title">Pilih metode pengiriman dan pembayaran terlebih dahulu!</div>
                            </div>
                            :
                            null
                    }

                    <div className='promoPage-section'>
                        {promoPageList()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PromoView