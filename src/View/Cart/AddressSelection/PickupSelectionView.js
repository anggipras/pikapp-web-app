import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import takeawayColor from '../../../Asset/Icon/takeawayColor.png'
import diningTableColor from '../../../Asset/Icon/diningTableColor.png'

const PickupSelectionView = () => {
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
                </div>

                <div className="pickupSelection-selectButton" style={{backgroundColor: '#4bb7ac'}}>Pilih</div>
            </div>
        </>
    )
}

export default PickupSelectionView