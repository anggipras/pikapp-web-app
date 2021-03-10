import React, { useState } from "react";
// import { ValidQty } from '../../Redux/Actions'
// import { connect } from 'react-redux'
import '../../Asset/scss/MenuDetail.scss'
import prodPhoto from '../../Asset/Illustration/samplefood.jpg'
import closeLogo from '../../Asset/Icon/close.png'
import StarIcon from '../../Asset/Icon/star.png'

const MenuDetail = (props) => {
    const [menuCateg, setmenuCateg] = useState(props.handleCateg)

    const closeModal = (e) => {
        e.stopPropagation()
        props.onHide()
    }

    // let foodList = [];
    // foodList = state.detailCategory;
    // let data = state;
    // props.handleData(data);
    var findCateg = menuCateg.filter((val) => {
        return props.datas.category === parseInt(val.category_id)
    })
    findCateg = findCateg[0].category_name.toLowerCase()

    return (
        <div>
            <div className='modalMenuDetail' style={{
                display: props.isShow ? 'block' : 'none'
            }} onClick={closeModal}
            >
                <div className='modal-content' onClick={e => e.stopPropagation()}>
                    <div className='scrollArea'>
                    <div className='menuBanner'>
                        <img className='menuimg' src={prodPhoto} />
                        <span className='iconClose' onClick={closeModal}>
                            <img src={closeLogo} className='closeLogo' />
                        </span>
                    </div>

                    <div className='menuContain'>
                        <div className='inside-menuContain'>
                            <div className='menu-detail'>
                                <div className='menu-star'>
                                    <img className='menu-star-img' src={StarIcon} />
                                    <h6 className='menu-star-rating'>5.0</h6>
                                </div>

                                <div className='menu-name'>
                                    {props.datas.foodName}
                                </div>

                                <div className='menu-category'>
                                    {findCateg}
                                </div>

                                <div className='menu-desc'>
                                    Description Row 1 Description Row 2 Row 3
                                    </div>
                            </div>

                            <div className='menu-price'>
                                {Intl.NumberFormat("id-ID").format(props.datas.foodPrice)}
                            </div>
                        </div>

                        <div onClick={props.menuClick} className='addtocart'>
                            <h2 className='add-words'>
                                TAMBAH KE KERANJANG
                                </h2>
                        </div>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MenuDetail