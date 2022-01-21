import React from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const ShippingTypeView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)

    const handleSave = (shippingtype) => {
        dispatch({ type: 'SHIPPINGTYPE', payload: shippingtype })
        if (CartRedu.shippingType) {
            // window.history.go(-1)
            history.push('./detail')
        }
    }

    const goBack = () => {
        dispatch({ type: 'SHIPPINGTYPE', payload: "" })
        window.history.go(-1)
    }

    const shippingTypeList = () => {
        // return statusName.map((statName, ind) => {
            return (
                <div className='shippingSelection-eachList' onClick={() => handleSave("Instant Bike")}>

                    <div className="shippingSelection-titleLayout">
                        <div className="shippingSelection-shippingName">
                            <span className="shippingSelection-blackNotes">Instant Bike (Rp 10.000 - Rp 20.000)</span>
                        </div>
                        <div className="shippingSelection-shippingDetail">
                            <span className="shippingSelection-grayNotes">Instant service for on demand needs.</span>
                        </div>
                    </div>
                    
                </div>
            )
        // })
    }

    return (
        <>
            <div className="shippingSelection-layout">
                <div className="shippingSelection-topSide">
                    <div className="shippingSelection-header">
                        <span className="shippingSelection-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="shippingSelection-title">Pilih Kurir</div>
                    </div>
                    <div className='shippingSelection-section'>
                        {shippingTypeList()}
                    </div>
                </div>
                

                {/* <div onClick={handleSave} className="shippingSelection-selectButton" style={{backgroundColor: CartRedu.shippingType ? '#4bb7ac' : '#aaaaaa'}}>Simpan</div> */}
            </div>
        </>
    )
}

export default ShippingTypeView