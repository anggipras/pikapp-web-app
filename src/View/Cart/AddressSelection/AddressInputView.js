import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import { useDispatch, useSelector } from 'react-redux'

const AddressInputView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [fullAddress, setFullAddress] = useState("")
    const [shipperNotes, setShipperNotes] = useState("")

    const handleSave = () =>{
        dispatch({ type: 'FULLADDRESS', payload: fullAddress })
        dispatch({ type: 'SHIPPERNOTES', payload: shipperNotes })
        window.history.back
    }

    return (
        <>
            <div className="pickupSelection-layout">
                <div className="pickupSelection-topSide">
                    <div className="pickupSelection-header">
                        <span className="pickupSelection-backArrow" onClick={window.history.back}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="pickupSelection-title">Alamat Pengiriman</div>
                    </div>

                    <div className="addressInput-fullAddress">
                        <div className="addressInput-fullAddress-title">Alamat Lengkap <span style={{color: "red"}}>*</span></div>
                        <textarea id="note" className="addressInput-fullAddress-inputArea" placeholder="Masukkan Alamat Lengkap" onChange={(e)=> setFullAddress(e.target.value)} defaultValue={CartRedu.fullAddress} />
                    </div>

                    <div className="addressInput-shipperNotes">
                        <div className="addressInput-shipperNotes-title">Catatan untuk Kurir</div>
                        <textarea id="note" className="addressInput-shipperNotes-inputArea" placeholder="Masukkan catatan untuk kurir" onChange={(e)=> setShipperNotes(e.target.value)} defaultValue={CartRedu.shipperNotes}/>
                    </div>
                </div>

                <div onClick={handleSave} className="addressInput-selectButton" style={{backgroundColor: fullAddress ? '#4bb7ac' : '#aaaaaa'}}>Simpan</div>
            </div>
        </>
    )
}

export default AddressInputView