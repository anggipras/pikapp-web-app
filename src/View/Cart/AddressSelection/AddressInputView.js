import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

const AddressInputView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [fullAddress, setFullAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [shipperNotes, setShipperNotes] = useState("");

    useEffect(() => {
        if(CartRedu.postalCode) {
            setPostalCode(CartRedu.postalCode);
        }

        if(CartRedu.formattedAddress) {
            setFullAddress(CartRedu.formattedAddress);
        }
    }, [CartRedu.formattedAddress, CartRedu.postalCode])

    const handleFullAddress = (e) => {
        setFullAddress(e.target.value);
    }

    const handlePostalCode = (e) => {
        setPostalCode(e.target.value);
    }

    const handleShipperNotes = (e) => {
        setShipperNotes(e.target.value);
    }

    const handleSave = () => {
        if (fullAddress) {
            dispatch({ type: 'FULLADDRESS', payload: fullAddress });
            dispatch({ type: 'POSTALCODE', payload: postalCode });
            dispatch({ type: 'SHIPPERNOTES', payload: shipperNotes });
            localStorage.setItem("FULLADDRESS", JSON.stringify(fullAddress));
            localStorage.setItem("POSTALCODE", JSON.stringify(postalCode));
            localStorage.setItem("SHIPPERNOTES", JSON.stringify(shipperNotes));

            dispatch({ type: 'SHIPPINGTYPE', payload: "" })
            dispatch({ type: 'SHIPPINGNAME', payload: "" });
            dispatch({ type: 'SHIPPINGPRICE', payload: 0 });
            dispatch({ type: 'SHIPPINGDESC', payload: "" });
            dispatch({ type: 'COURIERSERVICETYPE', payload: "" });
            dispatch({ type: 'SHIPPINGCODE', payload: "" });
            dispatch({ type: 'INSURANCECHECKBOX', payload: false });
            dispatch({ type: 'INSURANCEPRICE', payload: 0 });

            localStorage.removeItem("SHIPPING_WITH_COURIER");
            localStorage.setItem("SHIPPINGTYPE", JSON.stringify(""))
            window.history.go('-1')
        }
    }

    const goBack = () => {
        if(fullAddress === "" && postalCode === "") {
            dispatch({ type: 'FORMATTEDADDRESS', payload: "" })
            localStorage.setItem("FORMATTEDADDRESS", JSON.stringify(""))
            dispatch({ type: 'FULLADDRESS', payload: "" })
            localStorage.setItem("FULLADDRESS", JSON.stringify(""))
            dispatch({ type: 'POSTALCODE', payload: "" })
            localStorage.setItem("POSTALCODE", JSON.stringify(""))
            dispatch({ type: 'SHIPPERNOTES', payload: "" })
            localStorage.setItem("SHIPPERNOTES", JSON.stringify(""))
            dispatch({ type: 'LAT', payload: 0 })
            localStorage.removeItem("LAT")
            dispatch({ type: 'LNG', payload: 0 })
            localStorage.removeItem("LNG")
        }
        window.history.go(-1)
    }

    const goToMaps = () => {
        history.push('./location')
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
                        <div className="deliverySelection-input" onClick={goToMaps}>
                            <div className="deliverySelection-input-leftSide">
                                <span className="deliverySelection-locationIcon">
                                    <img className="address-location-icon" src={LocationPoint} />
                                </span>
                                <div className="deliverySelection-addressLayout">
                                    <div className="deliverySelection-addressTitle">
                                        { CartRedu.formattedAddress ? <></> : "Alamat Pengiriman" }
                                    </div>
                                    <div className="deliverySelection-addressInputted">
                                        { CartRedu.formattedAddress ? <span className="deliverySelection-blackNotes">{CartRedu.formattedAddress}</span> : "Masukkan alamat pengiriman sekarang" }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="addressInput-fullAddress">
                        <div className="addressInput-fullAddress-title">Alamat Lengkap <span style={{color: "red"}}>*</span></div>
                        <textarea id="note" className="addressInput-fullAddress-inputArea" placeholder="Masukkan Alamat Lengkap" onChange={handleFullAddress} defaultValue={fullAddress} />
                    </div>

                    <div className="addressInput-fullAddress">
                        <div className="addressInput-fullAddress-title">Kode Pos <span style={{color: "red"}}>*</span></div>
                        <input className="deliverySelection-shipperName-inputArea" placeholder="Masukkan Kode Pos" onChange={handlePostalCode} defaultValue={postalCode} />
                    </div>

                    <div className="addressInput-shipperNotes">
                        <div className="addressInput-shipperNotes-title">Catatan untuk Kurir</div>
                        <textarea id="note" className="addressInput-shipperNotes-inputArea" placeholder="Masukkan catatan untuk kurir" onChange={handleShipperNotes} defaultValue={shipperNotes}/>
                    </div>
                </div>

                <div onClick={handleSave} className="addressInput-selectButton" style={{backgroundColor: CartRedu.formattedAddress && fullAddress && postalCode ? '#4bb7ac' : '#aaaaaa'}}>Simpan</div>
            </div>
        </>
    )
}

export default AddressInputView