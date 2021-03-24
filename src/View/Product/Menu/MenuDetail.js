import React, { useState } from "react";
import '../../../Asset/scss/MenuDetail.scss'
import prodPhoto from '../../../Asset/Illustration/samplefood.jpg'
import closeLogo from '../../../Asset/Icon/close.png'
import backLogo from '../../../Asset/Icon/arrow-left.png'
import StarIcon from '../../../Asset/Icon/star.png'
import { useMediaQuery } from 'react-responsive'
import { Scrollbars } from 'react-custom-scrollbars'
import MenuSelection from './MenuSelection'
import { useDispatch, useSelector } from 'react-redux'

const MenuDetail = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const [menuCateg, setmenuCateg] = useState(props.handleCateg)
    const [menuSelect, setmenuSelect] = useState(false)
    const [menuCondition, setmenuCondition] = useState(false)

    const isMobile = useMediaQuery({ maxWidth: 768 })

    const closeModal = (e) => {
        e.stopPropagation()
        dispatch({ type: 'DEFAULTSTATE' })
        props.onHide()
    }

    const backModal = () => {
        setmenuSelect(false)
        dispatch({ type: 'DEFAULTSTATE' })
    }

    const addtoCart = () => {
        if (AllRedu.checkboxes.length || AllRedu.radiobutton.length || AllRedu.validQTY) {
            props.handleClick()
            dispatch({ type: 'DEFAULTSTATE' })
            props.onHide()
        }
    }

    const countTotalPrice = () => {
        let totalPrice = 0
        let sumAllPrice = AllRedu.checkboxes
        sumAllPrice.forEach(firstVal => {
            firstVal.forEach(nestedVal => {
                totalPrice += nestedVal.price
            })
        });
        totalPrice += AllRedu.validQTY * props.datas.foodPrice
        return totalPrice
    }

    const openMenuSelect = () => {
        setmenuSelect(true)
        dispatch({ type: 'FOODCATEG', payload: findCateg })
    }

    let findCateg
    if (AllRedu.openMenuCart) {
        findCateg = props.datas.foodCategory
        if(!menuCondition) {
            setmenuSelect(true)
            setmenuCondition(true)
        }
    } else {
        findCateg = menuCateg.filter((val) => {
            return props.datas.category === parseInt(val.category_id)
        })
        findCateg = findCateg[0].category_name.toLowerCase()
    }

    return (
        <div>
            {
                !isMobile ?
                    <div className='modalMenuDetail' style={{
                        display: props.isShow ? 'block' : 'none'
                    }} onClick={closeModal}
                    >
                        <div className='modal-content-menudetail' onClick={e => e.stopPropagation()}>
                            {
                                menuSelect ?
                                    <span className='iconBack' onClick={backModal}>
                                        <img src={backLogo} className='backLogo' />
                                    </span>
                                    :
                                    <span className='iconClose' onClick={closeModal}>
                                        <img src={closeLogo} className='closeLogo' />
                                    </span>
                            }

                            <div className='menuDetail-layout'>
                                <div className='menuContain-left'>
                                    <div className='menuBanner'>
                                        <img className='menuimg' src={prodPhoto} />
                                    </div>

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

                                        <div className='menu-price'>
                                            {Intl.NumberFormat("id-ID").format(props.datas.foodPrice)}
                                        </div>
                                    </div>
                                </div>

                                <div className='menuContain-right'>
                                    {
                                        menuSelect ?
                                            <Scrollbars style={{ height: "80%" }}>
                                                <MenuSelection handleData={props.handleData} datas={props.datas} handleClick={props.handleClick} />
                                            </Scrollbars>
                                            :
                                            <div className='menuDesc'>
                                                <div className='menuDesc-title'>
                                                    Description
                                                </div>
                                                <div className='menuDesc-content'>
                                                    Description Row 1 Description Row 2 Row 3 Description Row 1 Description Row 2 Row 3
                                                </div>
                                            </div>
                                    }

                                    <div className='menuButton'>
                                        {
                                            menuSelect ?
                                                <div className='openMenuSelection' style={{ backgroundColor: AllRedu.checkboxes.length || AllRedu.radiobutton.length || AllRedu.validQTY ? '#4bb7ac' : '#aaaaaa' }} onClick={addtoCart}>
                                                    <h2 className='add-words'>
                                                        {
                                                            AllRedu.checkboxes.length || AllRedu.radiobutton.length || AllRedu.validQTY ?
                                                                'TAMBAH - ' + `${Intl.NumberFormat("id-ID").format(countTotalPrice())}`
                                                                :
                                                                'TAMBAH - ' + `${Intl.NumberFormat("id-ID").format(props.datas.foodPrice)}`
                                                        }
                                                    </h2>
                                                </div>
                                                :
                                                <div onClick={openMenuSelect} className='openMenuSelection'>
                                                    <h2 className='add-words'>
                                                        PESAN
                                                    </h2>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='mob-modalMenuDetail' style={{
                        display: props.isShow ? 'block' : 'none'
                    }} onClick={closeModal}
                    >
                        <div className='mob-modal-content-menudetail' onClick={e => e.stopPropagation()} style={{ height: menuSelect ? '88vh' : 'auto' }}>
                            <div className='mob-menuBanner'>
                                <img className='mob-menuimg' src={prodPhoto} />
                                {
                                    menuSelect ?
                                        <span className='mob-iconClose' onClick={backModal}>
                                            <img src={closeLogo} className='mob-closeLogo' />
                                        </span>
                                        :
                                        <span className='mob-iconClose' onClick={closeModal}>
                                            <img src={closeLogo} className='mob-closeLogo' />
                                        </span>
                                }
                            </div>

                            <div className='mob-menuContain'>
                                <div className='mob-inside-menuContain' style={{ boxShadow: menuSelect ? "0px 5px 4px rgba(0, 0, 0, 0.1)" : "none" }}>
                                    <div className='mob-menu-detail'>
                                        <div className='mob-menu-star'>
                                            <img className='mob-menu-star-img' src={StarIcon} />
                                            <h6 className='mob-menu-star-rating'>5.0</h6>
                                        </div>

                                        <div className='mob-menu-name'>
                                            {props.datas.foodName}
                                        </div>

                                        <div className='mob-menu-category'>
                                            {findCateg}
                                        </div>
                                    </div>

                                    <div className='mob-menu-price'>
                                        {Intl.NumberFormat("id-ID").format(props.datas.foodPrice)}
                                    </div>
                                </div>

                                {
                                    menuSelect ?
                                        <Scrollbars style={{ height: "calc(88vh - 355px)" }}>
                                            <MenuSelection handleData={props.handleData} datas={props.datas} handleClick={props.handleClick} />
                                        </Scrollbars>
                                        :
                                        <div className='mob-menuDesc'>
                                            <div className='mob-menu-desc'>
                                                Description Row 1 Description Row 2 Row 3
                                            </div>
                                        </div>
                                }

                                <div className='mob-menuButton' style={{ boxShadow: menuSelect ? "0px -5px 4px rgba(0, 0, 0, 0.1)" : "none" }}>

                                    {
                                        menuSelect ?
                                            <div className='mob-openMenuSelection' style={{ backgroundColor: AllRedu.checkboxes.length || AllRedu.radiobutton.length || AllRedu.validQTY ? '#4bb7ac' : '#aaaaaa' }} onClick={addtoCart}>
                                                <h2 className='mob-add-words'>
                                                    {
                                                        AllRedu.checkboxes.length || AllRedu.radiobutton.length || AllRedu.validQTY ?
                                                            'TAMBAH KERANJANG - ' + `${Intl.NumberFormat("id-ID").format(countTotalPrice())}`
                                                            :
                                                            'TAMBAH KERANJANG - ' + `${Intl.NumberFormat("id-ID").format(props.datas.foodPrice)}`
                                                    }
                                                </h2>
                                            </div>
                                            :
                                            <div onClick={openMenuSelect} className='mob-openMenuSelection' style={{ backgroundColor: '#4bb7ac' }}>
                                                <h2 className='mob-add-words'>
                                                    PESAN
                                                </h2>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
            }
        </div>
    );
}

export default MenuDetail