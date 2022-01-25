import React from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import SearchIcon from "../../../Asset/Icon/search.png";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import MapsComponent from "../../../Master/MapsLayout/MapsComponent";

const AddressMapsView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)

    const handleSave = () => {
        if (CartRedu.formattedAddress) {
            // history.push('./address')
            window.history.go(-1)
        }
    }

    const goBack = () => {
        dispatch({ type: 'FORMATTEDADDRESS', payload: "" })
        window.history.go(-1)
    }

    const goToAddress = () => {
        history.push('./search')
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

                <div className="main-wrapper-maps">
                    <MapsComponent />
                </div>

                {/* <div onClick={goToAddress}>
                    <div>AAA</div>
                    <div>AAA</div>
                </div> */}
                <div className='addressmaps-locationinfo' onClick={goToAddress}>
                    <div className='addressmaps-section'>
                        <div className='addressmaps-title'>
                            <div className='addressmaps-titlename'>
                                <div className='addressmaps-mainname'>
                                    {CartRedu.district}
                                </div>

                                <div className='addressmaps-detailinfo'>
                                    <div className='addressmaps-detailinfo-text'>{CartRedu.formattedAddress}</div>
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