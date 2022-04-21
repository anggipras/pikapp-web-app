import React from "react";
import Loader from 'react-loader-spinner'
import '../../Asset/scss/NotifModal.scss'

const GeneralLoadingModal = (props) => {

    return (
        <div className='modalGeneralLoading' style={{
            display: !props.isShowLoading ? 'block' : 'none'
        }}>
            <div className='modal-content-generalLoading'>
                <Loader
                    type="Oval"
                    color="#4bb7ac"
                    height={100}
                    width={100}
                />
                
                <div className='loadingMessage'>Loading</div>
            </div>
        </div>
    )
}

export default GeneralLoadingModal