import Axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom"
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import ArrowRight from "../../Asset/Icon/arrowright-icon.png";
import ShopIcon from "../../Asset/Icon/ic_shop.png";
import LocationIcon from "../../Asset/Icon/location-icon.png";
import ClockIcon from "../../Asset/Icon/ic_clock_green.png";
import CartIcon from "../../Asset/Icon/ic_shopping_cart.png";
import { v4 as uuidV4 } from "uuid";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { Link } from "react-router-dom";

const MerchantDetailProfile = () => {
    const location = useLocation()
    const [merchantLogo, setMerchantLogo] = useState(location.state.merchantLogo);
    const [merchantName, setMerchantName] = useState(location.state.merchantName);
    const [merchantAddress, setMerchantAddress] = useState(location.state.merchantAddress);
    const [merchantSchedule, setMerchantSchedule] = useState([
        {
            days: "",
            open_time: "",
            close_time: "",
        }
    ]);

    useEffect(() => {

        let uuid = uuidV4();
        uuid = uuid.replace(/-/g, "");
        const date = new Date().toISOString();
        let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
        Axios(address + "merchant/v1/shop/management/list/", {
            headers: {
              "Content-Type": "application/json",
              "x-request-id": uuid,
              "x-request-timestamp": date,
              "x-client-id": clientId,
              "token": "PUBLIC",
              "mid": selectedMerchant[0].mid,
            },
            method: "GET"
          }).then((res) => {
              if (res.data.results != null) {
                  let timeManagement = res.data.results.time_management
                  setMerchantSchedule(timeManagement)
              } else {
                  
              }
          }).catch((err) => console.log(err))
    }, [])

    const shopSchedule = () => {
        return merchantSchedule.map((val, ind) => {
            let shopDays
            if (val.days == "SUNDAY") {
                shopDays = "Minggu"
            } else if(val.days == "MONDAY") {
                shopDays = "Senin"
            } else if(val.days == "TUESDAY") {
                shopDays = "Selasa"
            } else if(val.days == "WEDNESDAY") {
                shopDays = "Rabu"
            } else if(val.days == "THURSDAY") {
                shopDays = "Kamis"
            } else if(val.days == "FRIDAY") {
                shopDays = "Jumat"
            } else if(val.days == "SATURDAY") {
                shopDays = "Sabtu"
            } 

            let hourStatus
            if (val.open_time == "00:00" && val.close_time == "00:00") {
                hourStatus = `Tutup`
            } else if(val.open_time == "00:00" && val.close_time == "23:59") {
                hourStatus = `Buka 24 Jam`
            } else {
                hourStatus = `${val.open_time} - ${val.close_time}`
            }
            return (
                <div key={ind} className="merchdetailprofile-shopSchedule-content">
                    <div className="merchdetailprofile-shopSchedule-days">{shopDays}</div>
                    <div className="merchdetailprofile-shopSchedule-hours">{hourStatus}</div>
                </div>
            )
        })
    }

    const cartButton = () => {
        let allCart = JSON.parse(localStorage.getItem('cart'))
        let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
        let filterMerchantCart = allCart.filter(cartVal => {
            return selectedMerchant[0].mid === cartVal.mid
        })
        if (filterMerchantCart.length != 0) {
            let isManualTxn = JSON.parse(localStorage.getItem("isManualTxn"))
            return (
                <Link to={isManualTxn ? "/cartmanual" : "/cart"} style={{ textDecoration: "none" }}>
                    <div className="merchdetailprofile-cart-layout">
                        <div className="merchdetailprofile-cart-startSide">
                            <img className="merchdetailprofile-cart-image" src={CartIcon} alt='' />
                            <div className="merchdetailprofile-cart-titleSide">
                                <div className="merchdetailprofile-cart-title">Pesanan Saya</div>
                                <div className="merchdetailprofile-cart-detail">Cek Pesanan Saya Sekarang</div>
                            </div>
                        </div>

                        <img className="merchdetailprofile-cart-arrow" src={ArrowRight} alt='' />
                    </div>
                </Link>
            )
        } else {
            return null
        }
    }

    return (
        <>
            <div className="merchdetailprofile-Layout">
                <div className="merchdetailprofile-header">
                    <span className="merchdetailprofile-back" onClick={() => window.history.go(-1)}>
                        <img className="merchdetailprofile-backicon" src={ArrowBack} alt='' />
                    </span>

                    <img className="merchdetailprofile-logo" src={merchantLogo} alt='' />
                    <div className="merchdetailprofile-title">{merchantName}</div>
                </div>

                <div className="merchdetailprofile-shopTitle-layout">
                    <img className="merchdetailprofile-shopTitle-image" src={ShopIcon} alt='' />
                    <div className="merchdetailprofile-shopTitle-title">Info Toko</div>
                </div>

                <div className="merchdetailprofile-shopAddress-layout">
                    <img className="merchdetailprofile-shopAddress-image" src={LocationIcon} alt='' />
                    <div className="merchdetailprofile-shopAddress-title">{merchantAddress}</div>
                </div>

                <div className="merchdetailprofile-shopSchedule-layout">
                    <img className="merchdetailprofile-shopSchedule-image" src={ClockIcon} alt='' />
                    <div className="merchdetailprofile-shopSchedule-contentLayout">
                        {shopSchedule()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MerchantDetailProfile