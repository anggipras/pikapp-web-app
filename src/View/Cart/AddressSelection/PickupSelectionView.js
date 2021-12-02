import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import ArrowGo from "../../../Asset/Icon/arrowright-icon.png";
import takeawayColor from '../../../Asset/Icon/takeawayColor.png'
import deliveryColor from '../../../Asset/Icon/delivery-icon.png'
import LocationIcon from '../../../Asset/Icon/location-icon.png'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

const PickupSelectionView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [pickUpChoice, setPickUpChoice] = useState([
    {
        image: "takeaway",
        option: "Pickup Sendiri"
    },
    {
        image: "delivery",
        option: "Dikirim"
    }
    ])

    const onChangeRadio = (ind) => {
        dispatch({ type: 'PICKUPTYPE', payload: ind })
    }

    const goToAddress = () => {
        history.push('./pickup/address')
    }

    const handleShipperName = (e) => {
        dispatch({ type: 'SHIPPERNAME', payload: e.target.value})
    }

    const handleShipperPrice= (e) => {
        dispatch({ type: 'SHIPPERPRICE', payload: e.target.value })
    }

    const pickUpSelection = () => {
        var pickUpRadioSelection = pickUpChoice.map((optionVal, keyOption) => {
            let imageOption;
            if (optionVal.image === "delivery") {
                imageOption = deliveryColor;
            } else if (optionVal.image === "takeaway") {
                imageOption = takeawayColor;
            }

            return (
                <div key={keyOption} className='pickup-detailContent'>
                    <div className='pickup-radioSection'>
                        <input type='radio' id={optionVal.image} onChange={() => onChangeRadio(keyOption)} name={'PICKUPMETHOD'} defaultChecked={CartRedu.pickupType === keyOption ? true : false} />
                        <label htmlFor={optionVal.image} style={{ borderBottomLeftRadius: CartRedu.pickupType === 1 ? "0px" : "8px", borderBottomRightRadius: CartRedu.pickupType === 1 ? "0px" : "8px" }}>
                            <div className='pickup-radioSide'>
                                <img className='pickupradio-image' src={imageOption} alt='' />
                                <div className='pickup-radioTitle'>{optionVal.option}</div>
                            </div>
                        </label>
                    </div>
                </div>
            )
        })

        return pickUpRadioSelection
    }

    const shipperArea = () => {
        return (
            <div className="deliverySelection-layout">
                <div className="deliverySelection-input" onClick={goToAddress}>
                    <div className="deliverySelection-input-leftSide">
                        <span className="deliverySelection-locationIcon">
                            <img className="address-location-icon" src={LocationIcon} />
                        </span>

                        <div className="deliverySelection-addressLayout">
                            <div className="deliverySelection-addressTitle">
                                Alamat Pengiriman
                            </div>
                            <div className="deliverySelection-addressInputted">
                                { CartRedu.fullAddress ? <span className="deliverySelection-greenNotes">Catatan : <span className="deliverySelection-grayNotes">{CartRedu.fullAddress}</span></span> : "Masukkan alamat pengiriman sekarang" }
                            </div>
                        </div>
                    </div>

                    <span className="deliverySelection-openIcon">
                        <img className="address-open-icon" src={ArrowGo} />
                    </span>
                </div>

                <div className="deliverySelection-shipperName">
                    <div className="deliverySelection-shipperName-title">Nama Kurir <span style={{color: "red"}}>*</span></div>
                    <input onChange={handleShipperName} className="deliverySelection-shipperName-inputArea" placeholder="Masukkan nama kurir disini..." defaultValue={CartRedu.shipperName}/>
                </div>

                <div className="deliverySelection-shipperPrice">
                    <div className="deliverySelection-shipperPrice-title">Ongkos Kirim <span style={{color: "red"}}>*</span></div>
                    <div className="deliverySelection-shipperPrice-layout">
                        <div className="deliverySelection-shipperPrice-currency">Rp</div>
                        <input onChange={handleShipperPrice} type='number' inputMode='numeric' className="deliverySelection-shipperPrice-inputArea" placeholder="Masukkan ongkos kirim disini..." defaultValue={CartRedu.shipperPrice}/>
                    </div>
                </div>
            </div>
        )
    }

    const handleSave = () => {
        if(CartRedu.pickupType === 0) {
            // Save pickup takeaway data
            window.history.go(-1)
        } else if(CartRedu.fullAddress && CartRedu.shipperName && CartRedu.shipperPrice) {
            // Save pickup delivery data
            dispatch({ type: 'PICKUPTYPE', payload: 1 })
            window.history.go(-1)
        }
    }

    const goBack = () => {
        dispatch({ type: 'PICKUPTYPE', payload: -1 })
        window.history.go(-1)
    }

    return (
        <>
            <div className="pickupSelection-layout">
                <div className="pickupSelection-topSide">
                    <div className="pickupSelection-header">
                        <span className="pickupSelection-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="pickupSelection-title">Pilih Pengiriman</div>
                    </div>

                    {pickUpSelection()}
                    {CartRedu.pickupType === 1 ? shipperArea() : null}
                </div>

                <div 
                    onClick={handleSave} 
                    className="pickupSelection-selectButton" 
                    style={{backgroundColor: 
                        CartRedu.pickupType === 0 ? '#4bb7ac' 
                        : 
                        CartRedu.fullAddress && CartRedu.shipperName && CartRedu.shipperPrice ? '#4bb7ac'
                        : 
                        '#aaaaaa'}}
                >Pilih</div>
            </div>
        </>
    )
}

export default PickupSelectionView