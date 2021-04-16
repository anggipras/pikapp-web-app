import React from "react";
import Loader from 'react-loader-spinner'
import '../../Asset/scss/NotifModal.scss'

const NotifModal = (props) => {

    return (
        <div className='modalNotif' style={{
            display: props.isShowNotif ? 'block' : 'none'
        }}>
            <div className='modal-content-notif'>
                {
                    props.responseMessage === ''?
                    <Loader
                        type="ThreeDots"
                        color="#4bb7ac"
                        height={100}
                        width={100}
                    />
                    :
                    <div className='successMessage'>
                        {props.responseMessage}
                    </div>
                }
            </div>
        </div>
    )
}

export default NotifModal