import React, { useState } from "react";
import '../../Asset/scss/OrderListStatusModal.scss'
import closeLogo from '../../Asset/Icon/closeNarrow.png';
import checkListLogo from '../../Asset/Icon/checklistIcon.png'

const OrderListStatus = (props) => {
    const statusName = ['Semua Status', 'Menunggu Pembayaran', 'Menunggu Konfirmasi', 'Sedang Dimasak', 'Makanan Tiba', 'Transaksi Selesai', 'Transaksi Gagal']
    const [radioStatus, setradioStatus] = useState(props.sendIndexStatus)

    const closeModal = (e) => {
        e.stopPropagation()
        props.onHideStatusModal()
    }

    const onChangeRadio = (ind) => {
        setradioStatus(ind)
    }

    const chooseStatus = () => {
        props.getStatusData(radioStatus)
        props.onHideStatusModal()
    }

    const statusList = () => {
        return statusName.map((statName, ind) => {
            return (
                <div key={ind} className='statusOrder-eachList'>
                    <div className='statusOrder-name'>
                        {statName}
                    </div>

                    <div className='statusOrder-radioButton'>
                        <div class="pretty p-image p-round p-jelly">
                            <input type="radio" name="icon_solid" onChange={() => onChangeRadio(ind)} defaultChecked={radioStatus === ind ? true : false} />
                            <div class="state">
                                <img class="image" src={checkListLogo} />
                                <label></label>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className='modalStatusOrder' style={{
            display: props.isShowStatusModal ? 'block' : 'none'
        }} onClick={closeModal}
        >
            <div className='modal-content-statusOrder' onClick={e => e.stopPropagation()}>
                <div className='modalTop-statusOrder'>
                    <span className='iconClose-statusOrder' onClick={closeModal}>
                        <img src={closeLogo} className='closeLogo-statusOrder' alt='' />
                    </span>

                    <div className='title-statusOrder'>
                        Pilih Status Yang Ingin Dilihat
                    </div>
                </div>

                <div className='modalContent-statusOrder'>
                    {statusList()}
                </div>

                <div className='statusOrder-chooseButton' onClick={() => chooseStatus()}>
                    PILIH
                </div>
            </div>
        </div>
    )
}

export default OrderListStatus