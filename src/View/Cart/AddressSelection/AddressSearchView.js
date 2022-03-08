import React from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import { useDispatch, useSelector } from 'react-redux';
import AutoComplete from '../../../Master/MapsLayout/AutoCompleteComponent';
import CurrentLocationIcon from "../../../Asset/Icon/current-location.png";

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
        dispatch({ type: 'ISMARKERCHANGE', payload: true })
    };

    const setCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                dispatch({ type: 'CENTER', payload: [position.coords.latitude, position.coords.longitude] })
                dispatch({ type: 'LAT', payload: position.coords.latitude })
                dispatch({ type: 'LNG', payload: position.coords.longitude })
                dispatch({ type: 'STREETNUMBER', payload: ""})
                dispatch({ type: 'STREETNAME', payload: "" })
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
                        if(res.types[0] == "street_number") {
                            dispatch({ type: 'STREETNUMBER', payload: "No. " + res.short_name })
                        }
                        if(res.types[0] == "route") {
                            dispatch({ type: 'STREETNAME', payload: res.short_name })
                        }
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

                    dispatch({ type: 'FORMATTEDADDRESS', payload: results[0].formatted_address.split(",")[0] })
                    localStorage.setItem("FORMATTEDADDRESS", JSON.stringify(results[0].formatted_address.split(",")[0]))
                    dispatch({ type: 'CENTER', payload: [CartRedu.lat, CartRedu.lng] })
                    dispatch({ type: 'SEARCHINPUT', payload: results[0].formatted_address })
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
                        <div className="pickupSelection-title">Cari Lokasi Pengiriman</div>
                    </div>
                </div>

                <div className="main-wrapper-places">
                    <AutoComplete map={CartRedu.mapInstance} mapApi={CartRedu.mapApi} addplace={addPlace} />

                    <div className='addresssearch-currentlocation-sec' onClick={() => setCurrentLocation()}>
                        <div className='addresssearch-location-title'>
                            <img className='addresssearch-location-logo' src={CurrentLocationIcon} alt='' />
                            <div className='addresssearch-location-mainName'>
                                Gunakan Lokasi Saat Ini
                            </div>
                        </div>
                    </div>
                </div>

                <div onClick={handleSave} className="addressInput-selectButton" style={{backgroundColor: CartRedu.formattedAddress ? '#4bb7ac' : '#aaaaaa'}}>Pilih Lokasi</div>
            </div>
        </>
    )
}

export default AddressSearchView