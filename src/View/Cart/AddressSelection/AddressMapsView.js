import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import SearchIcon from "../../../Asset/Icon/search.png";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import MapsComponent from "../../../Master/MapsLayout/MapsComponent";
import CurrentLocationIcon from "../../../Asset/Icon/current-location.png";

const AddressMapsView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [formattedAddress, setFormattedAddress] = useState("");

    useEffect(() => {
        if(CartRedu.formattedAddress !== "") {
            setFormattedAddress(CartRedu.formattedAddress);
        } 
    }, [CartRedu.formattedAddress])

    const handleSave = () => {
        if (CartRedu.formattedAddress) {
            window.history.go(-1)
        }
    }

    const goBack = () => {
        window.history.go(-1)
    }

    const goToAddress = () => {
        history.push('./search')
    }

    const setCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                dispatch({ type: 'CENTER', payload: [position.coords.latitude, position.coords.longitude] })
                dispatch({ type: 'LAT', payload: position.coords.latitude })
                dispatch({ type: 'LNG', payload: position.coords.longitude })
                dispatch({ type: 'ISMARKERCHANGE', payload: false })
            });
        }
        _generateAddress();
    }

    const _generateAddress = () => {
        const mapApi = CartRedu.mapApi;

        const geocoder = new mapApi.Geocoder;

        geocoder.geocode({ 'location': { lat: CartRedu.lat, lng: CartRedu.lng } }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    results[0].address_components.map((res) => {
                        if(res.types[0] == "administrative_area_level_3") {
                            dispatch({ type: 'DISTRICT', payload: res.short_name })
                            localStorage.setItem("DISTRICT", JSON.stringify(res.short_name))
                        }
                        if(res.types[0] == "postal_code") {
                            dispatch({ type: 'POSTALCODE', payload: res.short_name })
                        }
                        if(res.types[0] == "administrative_area_level_2") {
                            dispatch({ type: 'CITY', payload: res.short_name })
                            localStorage.setItem("CITY", JSON.stringify(res.short_name))
                        }
                        if(res.types[0] == "administrative_area_level_1") {
                            dispatch({ type: 'PROVINCE', payload: res.short_name })
                        }
                    })

                    dispatch({ type: 'FORMATTEDADDRESS', payload: results[0].formatted_address })
                    localStorage.setItem("FORMATTEDADDRESS", JSON.stringify(results[0].formatted_address))
                    setFormattedAddress(results[0].formatted_address)
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }

        });
    }

    return (
        <>
            <div className="pickupSelection-layout">
                <div className="pickupSelection-topSide">
                    <div className="pickupSelection-header">
                        <span className="pickupSelection-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="pickupSelection-title">Lokasi Pengiriman</div>
                    </div>
                </div>

                <div style={{marginTop: CartRedu.isMarkerChange ? '0px' : null}} className="main-wrapper-maps">
                    <MapsComponent />
                </div>

                {/* <div style={{display: CartRedu.isMarkerChange ? 'block' : 'none'}} className='addressmaps-currentlocation-sec' onClick={() => setCurrentLocation()}>
                    <div className='addressmaps-location-title'>
                        <img className='addressmaps-location-logo' src={CurrentLocationIcon} alt='' />
                        <div className='addressmaps-location-mainName'>
                            Gunakan Lokasi Saat Ini
                        </div>
                    </div>
                </div> */}
                <div style={{marginTop: CartRedu.isMarkerChange ? '30px' : '0px'}} className='addressmaps-locationinfo' onClick={goToAddress}>
                    <div className='addressmaps-section'>
                        <div className='addressmaps-title'>
                            <div className='addressmaps-titlename'>
                                <div className='addressmaps-mainname'>
                                    {CartRedu.formattedAddress}
                                </div>

                                <div className='addressmaps-detailinfo'>
                                    <div className='addressmaps-detailinfo-text'>
                                        {CartRedu.district}, {CartRedu.city}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='addressmaps-icon-sec'>
                            <div className='addressmaps-icon'>
                            <span className='addressmaps-search'>
                                <img className='addressmaps-search-img' src={SearchIcon} alt='' />
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={handleSave} className="addressInput-selectButton" style={{backgroundColor: CartRedu.formattedAddress ? '#4bb7ac' : '#aaaaaa'}}>Pilih Lokasi Saat Ini</div>
            </div>
        </>
    )
}

export default AddressMapsView