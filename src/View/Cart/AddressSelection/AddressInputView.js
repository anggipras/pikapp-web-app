import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import { useDispatch, useSelector } from 'react-redux'

const AddressInputView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    // const [fullAddress, setFullAddress] = useState("")
    // const [shipperNotes, setShipperNotes] = useState("")

    const handleFullAddress = (e) => {
        // setFullAddress(e.target.value)
        dispatch({ type: 'FULLADDRESS', payload: e.target.value })

    }

    const handleShipperNotes = (e) => {
        // setShipperNotes(e.target.value)
        dispatch({ type: 'SHIPPERNOTES', payload: e.target.value })
    }

    const handleSave = () => {
        if (CartRedu.fullAddress) {
            window.history.go(-1)
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
                        <div className="addressInput-fullAddress-title">Alamat Lengkap <span style={{color: "red"}}>*</span></div>
                        <textarea id="note" className="addressInput-fullAddress-inputArea" placeholder="Masukkan Alamat Lengkap" onChange={handleFullAddress} defaultValue={CartRedu.fullAddress} />
                    </div>

                    <div className="addressInput-shipperNotes">
                        <div className="addressInput-shipperNotes-title">Catatan untuk Kurir</div>
                        <textarea id="note" className="addressInput-shipperNotes-inputArea" placeholder="Masukkan catatan untuk kurir" onChange={handleShipperNotes} defaultValue={CartRedu.shipperNotes}/>
                    </div>
                </div>

                <div onClick={handleSave} className="addressInput-selectButton" style={{backgroundColor: CartRedu.fullAddress ? '#4bb7ac' : '#aaaaaa'}}>Simpan</div>
            </div>
        </>
    )
}

export default AddressInputView