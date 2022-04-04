import React from 'react'
import closeNarrow from '../../Asset/Icon/closeNarrow.png'
import GreenWarningImage from '../../Asset/Icon/ic_txn_green_modal.png'
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

                    <span className='iconWarningLayout' style={{backgroundColor: "#E6FBF9" }} onClick={closeModal}>
                        <img src={GreenWarningImage} className='iconWarningImage' alt='' />
                    </span>

                    <div className='modalCart-paymentLayout'>
                        <div className='modalCart-paymentBigTitle'>Oops</div>
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