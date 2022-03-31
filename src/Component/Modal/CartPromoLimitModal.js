import React, { useState } from 'react'
import closeNarrow from '../../Asset/Icon/closeNarrow.png'
import '../../Asset/scss/CartModal.scss'

const CartPromoLimitModal = (props) => {
    const closeModal = (e) => {
        e.stopPropagation()
        props.onHide()
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

                    <div className='modalCart-paymentLayout'>
                        <h1 className='modalCart-paymentTitle'>Voucher yang Anda gunakan sudah habis. Silakan gunakan voucher lain</h1>

                        <div className='modalCart-paymentCheck'>
                            <div className='modalCart-confirmPay' onClick={closeModal}>
                                Kembali
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default CartPromoLimitModal