import React from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import { useDispatch, useSelector } from 'react-redux'

const AddressInputView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)

    const handleFullAddress = (e) => {
        dispatch({ type: 'FULLADDRESS', payload: e.target.value })
    }

    const handlePostalCode = (e) => {
        dispatch({ type: 'POSTALCODE', payload: e.target.value })
    }

    const handleShipperNotes = (e) => {
        dispatch({ type: 'SHIPPERNOTES', payload: e.target.value })
    }

    const handleSave = () => {
        if (CartRedu.fullAddress) {
            // window.history.go(-1)
            window.history.go('-2')
        }
    }

    const goBack = () => {
        dispatch({ type: 'FULLADDRESS', payload: "" })
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
                        <div className="pickupSelection-title">Alamat Pengiriman</div>
                    </div>

                    <div className="addressInput-fullAddress">
                        <div className="deliverySelection-input">
                            <div className="deliverySelection-input-leftSide">
                                <span className="deliverySelection-locationIcon">
                                    <img className="address-location-icon" src={LocationPoint} />
                                </span>
                                <div className="deliverySelection-addressLayout">
                                    <div className="deliverySelection-addressTitle">
                                        {CartRedu.formattedAddress}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="addressInput-fullAddress">
                        <div className="addressInput-fullAddress-title">Alamat Lengkap <span style={{color: "red"}}>*</span></div>
                        <textarea id="note" className="addressInput-fullAddress-inputArea" placeholder="Masukkan Alamat Lengkap" onChange={handleFullAddress} defaultValue={CartRedu.fullAddress} />
                    </div>

                    <div className="addressInput-fullAddress">
                        <div className="addressInput-fullAddress-title">Kode Pos <span style={{color: "red"}}>*</span></div>
                        <input className="deliverySelection-shipperName-inputArea" placeholder="Masukkan Kode Pos" onChange={handlePostalCode} defaultValue={CartRedu.postalCode} />
                    </div>

                    <div className="addressInput-shipperNotes">
                        <div className="addressInput-shipperNotes-title">Catatan untuk Kurir <span style={{color: "red"}}>*</span></div>
                        <textarea id="note" className="addressInput-shipperNotes-inputArea" placeholder="Masukkan catatan untuk kurir" onChange={handleShipperNotes} defaultValue={CartRedu.shipperNotes}/>
                    </div>
                </div>

                <div onClick={handleSave} className="addressInput-selectButton" style={{backgroundColor: CartRedu.fullAddress ? '#4bb7ac' : '#aaaaaa'}}>Simpan</div>
            </div>
        </>
    )
}

export default AddressInputView