import React, { useState } from 'react'
import closeNarrow from '../../Asset/Icon/closeNarrow.png'
import diningTableColor from '../../Asset/Icon/diningTableColor.png'
import takeawayColor from '../../Asset/Icon/takeawayColor.png'
import CashierPayment from '../../Asset/Icon/CashierPayment.png'
import OvoPayment from '../../Asset/Icon/ovo_icon.png'
import '../../Asset/scss/CartModal.scss'

const CartModal = (props) => {
    const [radioNumEat, setradioNumEat] = useState(props.indexOptionEat)
    const [radioNumPay, setradioNumPay] = useState(props.indexOptionPay)

    const closeModal = (e) => {
        e.stopPropagation()
        props.onHide()
    }

    const onChangeRadio = (num, title) => {
        if (title === 'Pilih Cara Makan Anda') {
            setradioNumEat(num)
            props.handleData(num)
            props.onHide()
        } else if(title === 'Bayar Pakai Apa') {
            setradioNumPay(num)
            props.handleData(num)
            props.onHide()
        }
    }

    const choicesCartModal = () => {
        let optionList = props.detailOptions
        let choicesModal = optionList.map((optionVal, keyOption) => {
            let imageOption;
            if (optionVal.image === "dineIn") {
                imageOption = diningTableColor;
            } else if (optionVal.image === "takeaway") {
                imageOption = takeawayColor;
            } else if (optionVal.image === "cashier") {
                imageOption = CashierPayment;
            } else if (optionVal.image === "ovo") {
                imageOption = OvoPayment;
            }

            if (props.title === 'Pilih Cara Makan Anda') {
                return (
                    <div key={keyOption} className='modalCart-detailContent'>
                        <div className='modalCart-radioSection'>
                            <input type='radio' id={optionVal.image} onChange={() => onChangeRadio(keyOption, props.title)} name={'EATMETHOD'} defaultChecked={radioNumEat === keyOption ? true : false} />
                            <label htmlFor={optionVal.image}>
                                <div className='modalCart-radioSide'>
                                    <img className='modalCartradio-image' src={imageOption} />
                                    <div className='modalCart-radioTitle'>{optionVal.option}</div>
                                </div>
                            </label>
                        </div>
                    </div>
                )
            } else if (props.title === 'Bayar Pakai Apa') {
                return (
                    <div key={keyOption} className='modalCart-detailContent'>
                        <div className='modalCart-radioSection'>
                            <input type='radio' id={optionVal.image} onChange={() => onChangeRadio(keyOption, props.title)} name={'PAYMETHOD'} defaultChecked={radioNumPay === keyOption ? true : false} />
                            <label htmlFor={optionVal.image}>
                                <div className='modalCart-radioSide'>
                                    <img className='modalCartradio-image' src={imageOption} />
                                    <div className='modalCart-radioTitle'>{optionVal.option}</div>
                                </div>
                            </label>
                        </div>
                    </div>
                )
            } else if (props.title === 'Rincian Pembayaran') {
                return (
                    <div key={keyOption} className='modalCart-detailTotalPrice'>
                        <div className='modalCart-totalPrice'>
                            <h2 className='modalCart-totalPrice-left'>Total Harga Barang</h2>
                            <h2 className='modalCart-totalPrice-right'>{optionVal.totalPrice}</h2>
                        </div>

                        <div className='modalCart-discount'>
                            <h2 className='modalCart-discount-left'>Diskon</h2>
                            <h2 className='modalCart-discount-right'>{optionVal.discountPrice}</h2>
                        </div>
                    </div>
                )
            }
        })
        return choicesModal
    }

    return (
        <>
            <div className='modalCartPage' style={{
                display: props.isShow ? 'block' : 'none'
            }} onClick={closeModal}>
                <div className='modalCartContent' onClick={e => e.stopPropagation()}>
                    <span className='iconCloseNarrow' onClick={closeModal}>
                        <img src={closeNarrow} className='closeLogoNarrow' alt='' />
                    </span>

                    <div className='modalCart-detail'>
                        <h1 className='modalCart-title'>{props.title}</h1>

                        {choicesCartModal()}
                    </div>
                </div>

            </div>
        </>
    )
}

export default CartModal