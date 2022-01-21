import React, { useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import CheckIcon from "../../../Asset/Icon/check.png";
import GojekLogo from "../../../Asset/Icon/gojek-logo.png";
import { useDispatch, useSelector } from 'react-redux'

const ShippingDetailView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [radioStatus, setradioStatus] = useState(0)

    const handleSave = () => {
        if (CartRedu.shippingName) {
            // window.history.go(-1)
            window.history.go('-2')
        }
    }

    const onChangeRadio = (ind) => {
        setradioStatus(ind)
        dispatch({ type: 'SHIPPINGNAME', payload: "Gojek" });
        dispatch({ type: 'SHIPPINGPRICE', payload: 20000 });
        dispatch({ type: 'SHIPPINGDESC', payload: "Same day service. Available from 08:00 to 15:00." });
    }

    const goBack = () => {
        dispatch({ type: 'SHIPPINGNAME', payload: "" })
        window.history.go(-1)
    }

    const shippingDetailList = () => {
        // return statusName.map((statName, ind) => {
            return (
                <div className='shippingDetail-eachList'>

                    <div className="shippingDetail-titleLayout">
                        <div>
                            <img className='shippingDetail-courier-logo' src={GojekLogo} alt='' />
                        </div>
                        <div>
                        <div className="shippingDetail-shippingName">
                            <span className="shippingDetail-blackNotes">Gojek (Rp 20.000)</span>
                        </div>
                        <div className="shippingDetail-shippingDetail">
                            <span className="shippingDetail-grayNotes">Same day service. Available from 08:00 to 15:00.</span>
                        </div>
                        </div>
                    </div>

                    <div className='shippingDetail-radioButton'>
                        <div class="pretty p-image p-round p-jelly">
                            <input type="radio" name="icon_solid" onChange={() => onChangeRadio(1)} defaultChecked={radioStatus === 1 ? true : false} />
                            <div class="state">
                                <img class="image" src={CheckIcon} />
                                <label></label>
                            </div>
                        </div>
                    </div>
                </div>
            )
        // })
    }

    return (
        <>
            <div className="shippingDetail-layout">
                <div className="shippingDetail-topSide">
                    <div className="shippingDetail-header">
                        <span className="shippingDetail-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="shippingDetail-title">Pilih Kurir</div>
                    </div>
                    <div className='shippingDetail-section'>
                        {shippingDetailList()}
                    </div>
                </div>
                

                <div onClick={handleSave} className="shippingDetail-selectButton" style={{backgroundColor: CartRedu.shippingName ? '#4bb7ac' : '#aaaaaa'}}>Pilih</div>
            </div>
        </>
    )
}

export default ShippingDetailView