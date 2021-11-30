import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import takeawayColor from '../../../Asset/Icon/takeawayColor.png'
import diningTableColor from '../../../Asset/Icon/diningTableColor.png'
import LocationIcon from '../../../Asset/Icon/location.png'
import {useHistory} from 'react-router-dom'

const PickupSelectionView = () => {
    let history = useHistory()
    const [pickUpChoice, setPickUpChoice] = useState([
    {
        image: "takeaway",
        option: "Pickup Sendiri"
    },
    {
        image: "delivery",
        option: "Dikirim"
    }
    ])

    const onChangeRadio = (ind) => {
        console.log(ind)
    }

    const pickUpSelection = () => {
        var pickUpRadioSelection = pickUpChoice.map((optionVal, keyOption) => {
            let imageOption;
            if (optionVal.image === "delivery") {
                imageOption = diningTableColor;
            } else if (optionVal.image === "takeaway") {
                imageOption = takeawayColor;
            }

            return (
                <div key={keyOption} className='pickup-detailContent'>
                    <div className='pickup-radioSection'>
                        <input type='radio' id={optionVal.image} onChange={() => onChangeRadio(keyOption)} name={'PICKUPMETHOD'} />
                        <label htmlFor={optionVal.image}>
                            <div className='pickup-radioSide'>
                                <img className='pickupradio-image' src={imageOption} alt='' />
                                <div className='pickup-radioTitle'>{optionVal.option}</div>
                            </div>
                        </label>
                    </div>
                </div>
            )
        })

        return pickUpRadioSelection
    }

    return (
        <>
            <div className="pickupSelection-layout">
                <div className="pickupSelection-topSide">
                    <div className="pickupSelection-header">
                        <span className="pickupSelection-backArrow">
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="pickupSelection-title">Pilih Pengiriman</div>
                    </div>

                    {pickUpSelection()}
                    <div className="deliverySelection-layout">
                        <div className="deliverySelection-input" onClick={history.push('/cartmanual/pickup/address')}>
                            <div className="deliverySelection-input-leftSide">
                                <span className="deliverySelection-locationIcon">
                                    <img className="address-location-icon" src={LocationIcon} />
                                </span>

                                <div className="deliverySelection-addressLayout">
                                    <div className="deliverySelection-addressTitle">
                                        Alamat Pengiriman
                                    </div>
                                    <div className="deliverySelection-addressInputted">
                                        Masukkan alamat pengiriman sekarang
                                    </div>
                                </div>
                            </div>

                            <span className="deliverySelection-openIcon">
                                <img className="address-open-icon" src={LocationIcon} />
                            </span>
                        </div>

                        <div className="deliverySelection-shipperName">
                            <div className="deliverySelection-shipperName-title">Nama Kurir <span style={{color: "red"}}>*</span></div>
                            <input className="deliverySelection-shipperName-inputArea" placeholder="Masukkan nama kurir disini..." />
                        </div>

                        <div className="deliverySelection-shipperPrice">
                            <div className="deliverySelection-shipperPrice-title">Ongkos Kirim <span style={{color: "red"}}>*</span></div>
                            <div className="deliverySelection-shipperPrice-layout">
                                <div className="deliverySelection-shipperPrice-currency">Rp</div>
                                <input className="deliverySelection-shipperPrice-inputArea" placeholder="Masukkan ongkos kirim disini..." />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pickupSelection-selectButton" style={{backgroundColor: '#4bb7ac'}}>Pilih</div>
            </div>
        </>
    )
}

export default PickupSelectionView