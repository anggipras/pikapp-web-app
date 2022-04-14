import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import SearchIcon from "../../../Asset/Icon/search.png";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import MapsComponent from "../../../Master/MapsLayout/MapsComponent";
import Loader from 'react-loader';

const options = {
    lines: 13,
    length: 20,
    width: 10,
    radius: 30,
    scale: 0.25,
    corners: 1,
    color: '#000',
    opacity: 0.25,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 60,
    fps: 20,
    shadow: false,
    hwaccel: false,
};

const AddressMapsView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [formattedAddress, setFormattedAddress] = useState("");
    const [permissionLocation, setPermissionLocation] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(CartRedu.formattedAddress !== "") {
            setFormattedAddress(CartRedu.formattedAddress);
        }
        // setTimeout(() => {
        //     setPermissionLocation(JSON.parse(localStorage.getItem("permissionLocation")));
        //     dispatch({ type: 'ISLOADINGMAPS', payload: false })
        // }, 1000);
        setPermissionLocation(CartRedu.permissionLocation);
        if(permissionLocation !== undefined) {
            setIsLoading(true);
        }
    }, [CartRedu.formattedAddress, CartRedu.permissionLocation, permissionLocation])

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
                localStorage.setItem("LAT", JSON.stringify(position.coords.latitude))
                dispatch({ type: 'LNG', payload: position.coords.longitude })
                localStorage.setItem("LNG", JSON.stringify(position.coords.longitude))
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
                            localStorage.setItem("POSTALCODE", JSON.stringify(res.short_name))
                        }
                        if(res.types[0] == "administrative_area_level_2") {
                            dispatch({ type: 'CITY', payload: res.short_name })
                            localStorage.setItem("CITY", JSON.stringify(res.short_name))
                        }
                        if(res.types[0] == "administrative_area_level_1") {
                            dispatch({ type: 'PROVINCE', payload: res.short_name })
                            localStorage.setItem("PROVINCE", JSON.stringify(res.short_name))
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
        <Loader loaded={isLoading} options={options} className="spinner"/>
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

                {
                    permissionLocation ?
                    <div>
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
                    :
                    <></>
                }

            </div>
        </>
    )
}

export default AddressMapsView