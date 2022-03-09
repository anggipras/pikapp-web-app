import React, { useState } from 'react'
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import closeNarrow from '../../Asset/Icon/closeNarrow.png'
import moment from "moment";

const CartCancel = (props) => {

    const goBack = (e) => {
        e.stopPropagation()
        props.onHide()
    }

    return (
        <>
            <div className='modalCartCancelPage' style={{
                    display: props.isShow ? 'block' : 'none'
                }} onClick={goBack}>
                <div className="cartCancel-layout" onClick={e => e.stopPropagation()}>
                    <div className="cartCancel-topSide">
                        <div className="cartCancel-header">
                            <span className="cartCancel-backArrow" onClick={goBack}>
                                <img className="backArrow-icon" src={ArrowBack} alt='' />
                            </span>
                        </div>

                        <div className='cartCancel-container'>
                            <div className='cart-cancel-iconLayout'>
                                <span className='cart-cancel-iconsecondLayout'>
                                    <img src={closeNarrow} className='cart-cancel-icon' />
                                </span>
                            </div>
                            <div className='cartCancel-contentLayout'>
                                <div className='cartCancel-content-title'>Transaksi Gagal</div>
                                <div className='cartCancel-content-detail'>Saat ini transaksi Anda tidak dapat di proses karena restoran sudah tutup</div>
                                <div className='cartCancel-content-message'>Silahkan masukkan informasi transaksi dengan benar</div>
                                <div className='cartCancel-divider' />
                                <div className='cartCancel-bottom-datetime'>
                                    <div className='cartCancel-bottom-datetime-title'>Tanggal dan Jam</div>
                                    <div className='cartCancel-bottom-datetime-detail'>{moment(new Date()).format("DD MMM YYYY, HH:mm")}</div>
                                </div>
                            </div>
                        </div>

                        <div className='cartCancel-button-layout'>
                            <div className='cartCancel-button' onClick={goBack}>
                                Kembali ke Keranjang
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartCancel