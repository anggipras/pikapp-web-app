import React, { useState } from 'react'
import closeNarrow from '../../Asset/Icon/closeNarrow.png'
import diningTableColor from '../../Asset/Icon/diningTableColor.png'
import takeawayColor from '../../Asset/Icon/takeawayColor.png'
import CashierPayment from '../../Asset/Icon/CashierPayment.png'
import OvoPayment from '../../Asset/Icon/ovo_icon.png'
import Alertcircle from '../../Asset/Icon/alertcircle.png'
import ReactTooltip from 'react-tooltip';
import '../../Asset/scss/CartModal.scss'

const CartModal = (props) => {
    const [radioNumEat, setradioNumEat] = useState(props.indexOptionEat)
    const [radioNumPay, setradioNumPay] = useState(props.indexOptionPay)
    const [modalTitle, setmodalTitle] = useState("")

    const closeModal = (e) => {
        e.stopPropagation()
        props.onHide()
    }

    const confirmPay = () => {
        props.confirmPay()
        props.onHide()
    }

    const selectButton = () => {
        if (modalTitle === 'Pilih Cara Makan Anda') {
            props.handleData(radioNumEat)
        } else {
            props.handleData(radioNumPay)
        }
        props.onHide()
    }

    const onChangeRadio = (num, title) => {
        if (title === 'Pilih Cara Makan Anda') {
            setradioNumEat(num)
            setmodalTitle(title)
        } else if(title === 'Bayar Pakai Apa') {
            setradioNumPay(num)
            setmodalTitle(title)
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
                                    <img className='modalCartradio-image' src={imageOption} alt='' />
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
                                    <img className='modalCartradio-image' src={imageOption} alt='' />
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
                            <h2 className='modalCart-totalPrice-right'>{Intl.NumberFormat("id-ID").format(optionVal.totalPrice)}</h2>
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

    const hideTooltip = () => {
        setTimeout(() => {
            ReactTooltip.hide()
        }, 3000);
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

                    {
                        props.title !== "Pesanan yang Anda buat tidak dapat dibatalkan" ?
                        <div className='modalCart-detail'>
                            <h1 className='modalCart-title'>{props.title}</h1>

                            {choicesCartModal()}

                            {
                                modalTitle === 'Bayar Pakai Apa' && radioNumPay === 1 ?
                                <div className='ovoNumber-layout'>
                                    <div className='ovoNumber-topSide'>
                                        <h3 className='ovoNumber-title'>
                                           Masukkan Nomor Anda 
                                        </h3>

                                        <a data-tip='Masukkan Nomor Yang Terdaftar Di OVO Untuk Melakukan Pembayaran' data-event='click'><img src={Alertcircle} className='alertImg' alt=''/></a>
                                        <ReactTooltip className='extraClass' effect='solid' arrowColor='#F8FAFC' globalEventOff='click' afterShow={() => hideTooltip()} />
                                    </div>

                                    <input className='ovoNumber-bottomSide' />
                                </div>
                                :
                                null
                            }

                            <div className='modalCart-selectLayout'>
                                <div className='modalCart-selectButton' onClick={selectButton}>
                                    OK
                                </div>
                            </div>
                        </div>
                        :
                        <div className='modalCart-paymentLayout'>
                            <h1 className='modalCart-paymentTitle'>{props.title}</h1>

                            <div className='modalCart-paymentCheck'>
                                <div className='modalCart-cancelPay' onClick={closeModal}>
                                    Cek Ulang
                                </div>

                                <div className='modalCart-confirmPay' onClick={confirmPay}>
                                    Setuju
                                </div>
                            </div>
                        </div>
                    }
                </div>

            </div>
        </>
    )
}

export default CartModal