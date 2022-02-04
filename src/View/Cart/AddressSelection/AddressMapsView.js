import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import SearchIcon from "../../../Asset/Icon/search.png";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import MapsComponent from "../../../Master/MapsLayout/MapsComponent";
import CurrentLocationIcon from "../../../Asset/Icon/current-location.png";
import { useMediaQuery } from 'react-responsive'

const AddressMapsView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const isMobile = useMediaQuery({ maxWidth: 768 })
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [center, setCenter] = useState([]);
    const [district, setDistrict] = useState("");
    const [postalcode, setPostalCode] = useState("");
    const [formattedAddress, setFormattedAddress] = useState("");
    const [isMarkerChange, setIsMarkerChange] = useState(false);

    useEffect(() => {
        if(CartRedu.formattedAddress !== "") {
            setFormattedAddress(CartRedu.formattedAddress);
        } 
        // else if (CartRedu.formattedAddress !== formattedAddress) {
        //     setFormattedAddress(CartRedu.formattedAddress);
        // }
    }, [CartRedu.formattedAddress])

    const handleSave = () => {
        if (CartRedu.formattedAddress) {
            // history.push('./address')
            window.history.go(-1)
        }
    }

    const goBack = () => {
        // dispatch({ type: 'FORMATTEDADDRESS', payload: "" })
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
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    results[0].address_components.map((res) => {
                        if(res.types[0] == "administrative_area_level_3") {
                            dispatch({ type: 'DISTRICT', payload: res.short_name })
                        }
                        if(res.types[0] == "postal_code") {
                            dispatch({ type: 'POSTALCODE', payload: res.short_name })
                        }
                        if(res.types[0] == "administrative_area_level_2") {
                            dispatch({ type: 'CITY', payload: res.short_name })
                        }
                        if(res.types[0] == "administrative_area_level_1") {
                            dispatch({ type: 'PROVINCE', payload: res.short_name })
                        }
                    })

                    dispatch({ type: 'FORMATTEDADDRESS', payload: results[0].formatted_address })
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

                <div style={{display: CartRedu.isMarkerChange ? 'block' : 'none'}} className='addressmaps-currentlocation-sec' onClick={() => setCurrentLocation()}>
                    <div className='addressmaps-location-title'>
                        <img className='addressmaps-location-logo' src={CurrentLocationIcon} alt='' />
                        <div className='addressmaps-location-mainName'>
                            Gunakan Lokasi Saat Ini
                        </div>
                    </div>
                </div>
                <div className='addressmaps-locationinfo' onClick={goToAddress}>
                    <div className='addressmaps-section'>
                        <div className='addressmaps-title'>
                            <div className='addressmaps-titlename'>
                                <div className='addressmaps-mainname'>
                                    {CartRedu.district}
                                </div>

                                <div className='addressmaps-detailinfo'>
                                    <div className='addressmaps-detailinfo-text'>{formattedAddress}</div>
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
                {/* <div onClick={goToAddress} className="addressInput-selectButton" style={{backgroundColor: '#4bb7ac'}}>Pilih Lokasi Saat Ini</div> */}
            </div>
        </>
    )
}

export default AddressMapsView