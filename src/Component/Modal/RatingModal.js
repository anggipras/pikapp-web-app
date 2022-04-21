import React from "react";
import '../../Asset/scss/RatingModal.scss'
import RatingImage from '../../Asset/Icon/ic_rating_succeed.png'

const RatingModal = (props) => {
    const closeModal = (e) => {
        e.stopPropagation()
        props.onHide()
    }

    const selectButton = (e) => {
        e.stopPropagation()
        props.confirmModal()
    }

    return (
        <div className='modalRating' style={{
            display: props.isShow ? 'block' : 'none'
        }} onClick={closeModal}>
            <div className='modalRatingContent' onClick={e => e.stopPropagation()}>
                <div className="modalRating-topArea">
                    <span className='iconRatingLayout' onClick={closeModal}>
                        <img src={RatingImage} className='iconRatingImage' alt='' />
                    </span>

                    <div className='modalRating-title'>
                        Terima Kasih!
                    </div>
                    <div className='modalRating-detail'>
                        Terima kasih atas pendapat yang Anda berikan. Kami sangat mengapresiasi ulasan Anda.
                    </div>
                </div>

                <div className='modalRating-selectButton' onClick={selectButton}>
                    Lihat Payment Receipt
                </div>
            </div>
        </div>
    )
}

export default RatingModal