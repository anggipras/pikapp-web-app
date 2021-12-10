import React from "react";
import Loader from 'react-loader-spinner';
import closeNarrow from '../../Asset/Icon/closeNarrow.png';
import '../../Asset/scss/FailedModal.scss'

const FailedModal = (props) => {

    const closeModal = (e) => {
        e.stopPropagation()
        props.onHide()
    }

    return (
        <div className='modalFailedPage' style={{
            display: props.isShow ? 'block' : 'none'
        }} onClick={closeModal}>
            <div className='modalFailedContent' onClick={e => e.stopPropagation()}>
                <span className='iconCloseNarrow-failed' onClick={closeModal}>
                    <img src={closeNarrow} className='closeLogoNarrow-failed' alt='' />
                </span>

                <div className='modalFailed-Layout'>
                    <h1 className='modalFailed-Title'>Jaringan Anda terputus. Silahkan refresh broweser Anda.</h1>

                    <div className='modalFailed-Check'>
                        <div className='modalFailed-cancel' onClick={closeModal}>
                            Tutup
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FailedModal