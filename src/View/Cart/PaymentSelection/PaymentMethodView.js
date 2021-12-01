import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import takeawayColor from '../../../Asset/Icon/takeawayColor.png'
import deliveryColor from '../../../Asset/Icon/delivery-icon.png'
import OvoPayment from '../../../Asset/Icon/ovo_icon.png'
import Alertcircle from '../../../Asset/Icon/alertcircle.png'
import ReactTooltip from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux'

const PaymentMethodView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [ewallet, setEwallet] = useState([
        {
            image: "ovo",
            option: "OVO"
        }
        ])
    const [isCheckNumber, setisCheckNumber] = useState(true)
    const [isAlertNumber, setisAlertNumber] = useState("")

    const handleSave = () => {
        if (CartRedu.paymentType === 0 && CartRedu.phoneNumber && isAlertNumber === "") {
            window.history.go(-1)
        } else if(CartRedu.paymentType === -1) {
            console.log("CANNOT GO THROUGH")
        } else {
            console.log("CANNOT GO THROUGH")
        }
    }

    const goBack = () => {
        window.history.go(-1)
    }

    const onChangeRadio = (ind) => {
        dispatch({ type: 'PAYMENTTYPE', payload: ind })
    }

    const hideTooltip = () => {
        setTimeout(() => {
            ReactTooltip.hide()
        }, 3000);
    }

    const onChangeNumber = (e) => {
        let reg = /^(?!00)(?!01)(?!02)(?!03)(?!04)(?!05)(?!06)(?!07)(?!09)[0][0-9]\d{0,12}$/
        let checkNumber = reg.test(e.target.value)
        dispatch({ type: 'PHONENUMBER', payload: e.target.value })
        if (checkNumber) {
            setisCheckNumber(checkNumber)
            setisAlertNumber('')
        } else if (e.target.value === '') {
            setisCheckNumber(false)
            setisAlertNumber('Nomor harus diisi')
        } else {
            setisCheckNumber(checkNumber)
            setisAlertNumber('Masukkan nomor dengan benar')
        }
    }

    const ewalletPaymentOption = () => {
        var ewalletRadioSelection = ewallet.map((optionVal, keyOption) => {
            let imageOption;
            if (optionVal.image === "gopay") {
                imageOption = deliveryColor;
            } else if (optionVal.image === "ovo") {
                imageOption = OvoPayment;
            } else if (optionVal.image === "dana") {
                imageOption = takeawayColor;
            }

            return (
                <div key={keyOption} className='payment-detailContent'>
                    <div className='payment-radioSection'>
                        <input type='radio' id={optionVal.image} onChange={() => onChangeRadio(keyOption)} name={'PAYMENTMETHOD'} />
                        <label htmlFor={optionVal.image}>
                            <div className='payment-radioSide'>
                                <img className='paymentradio-image' src={imageOption} alt='' />
                                <div className='payment-radioTitle'>{optionVal.option}</div>
                            </div>
                        </label>
                    </div>
                    {
                        CartRedu.paymentType === 0 && keyOption === 0 ?
                        <div className='ovoNumber-layout'>
                            <div className='payment-ovoNumber-topSide'>
                                <div className='payment-ovoNumber-title'>
                                    Masukkan Nomor Anda
                                </div>

                                <a data-tip='Masukkan Nomor Yang Terdaftar Di OVO Untuk Melakukan Pembayaran' data-event='click'><img src={Alertcircle} className='payment-alertImg' alt='' /></a>
                                <ReactTooltip className='payment-extraClass' effect='solid' arrowColor='#F8FAFC' globalEventOff='click' afterShow={() => hideTooltip()} />
                            </div>

                            <input type='number' inputMode='numeric' className='payment-ovoNumber-bottomSide' onChange={onChangeNumber} style={{ borderBottom: !isCheckNumber ? '0.5px solid #DC6A84' : '0.5px solid #D9CECE', color: !isCheckNumber ? '#DC6A84' : '#111111' }} />
                            {
                                isAlertNumber !== '' ?
                                    <h4 className='payment-ovoNumber-alert'>
                                        {isAlertNumber}
                                    </h4>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                    }
                </div>
            )
        })

        return ewalletRadioSelection
    }

    return (
        <>
            <div className="paymentMethod-layout">
                <div className="paymentMethod-header">
                    <span className="paymentMethod-backArrow" onClick={goBack}>
                        <img className="backArrow-icon" src={ArrowBack} alt='' />
                    </span>
                    <div className="paymentMethod-title">Metode Pembayaran</div>
                </div>

                <div className="ewallet-layout">
                    <div className="ewallet-title">E-Wallet</div>
                    {ewalletPaymentOption()}
                </div>

                <div className="paymentMethod-buttonLayout">
                    <div 
                        onClick={handleSave} 
                        className="paymentMethod-selectButton" 
                        style={{backgroundColor: 
                            CartRedu.paymentType === -1 ? '#aaaaaa'
                            :
                            CartRedu.paymentType === 0 ? '#4bb7ac' 
                            : 
                            CartRedu.phoneNumber ? '#4bb7ac'
                            :
                            '#aaaaaa'}}
                    >Simpan</div>
                </div>
            </div>
        </>
    )
}

export default PaymentMethodView