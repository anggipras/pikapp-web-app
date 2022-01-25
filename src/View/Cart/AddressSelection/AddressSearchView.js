import React from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import { useDispatch, useSelector } from 'react-redux';
import AutoComplete from '../../../Master/MapsLayout/AutoCompleteComponent';

const AddressSearchView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)

    const handleSave = () => {
        if (CartRedu.formattedAddress) {
            window.history.go(-1)
        }
    }

    const goBack = () => {
        dispatch({ type: 'FULLADDRESS', payload: "" })
        window.history.go(-1)
    }

    const addPlace = (place) => {
        dispatch({ type: 'PLACES', payload: [place] })
        dispatch({ type: 'LAT', payload: place.geometry.location.lat() })
        dispatch({ type: 'LNG', payload: place.geometry.location.lng() })
    };

    return (
        <>
            <div className="pickupSelection-layout">
                <div className="pickupSelection-topSide">
                    <div className="pickupSelection-header">
                        <span className="pickupSelection-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="pickupSelection-title">Cari Lokasi Pengiriman</div>
                    </div>
                </div>

                <div className="main-wrapper-places">
                    <AutoComplete map={CartRedu.mapInstance} mapApi={CartRedu.mapApi} addplace={addPlace} />
                </div>

                <div onClick={handleSave} className="addressInput-selectButton" style={{backgroundColor: CartRedu.formattedAddress ? '#4bb7ac' : '#aaaaaa'}}>Pilih Lokasi</div>
            </div>
        </>
    )
}

export default AddressSearchView