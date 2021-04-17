import React, { useState } from "react";
import '../../Asset/scss/MenuDetail.scss'
// import prodPhoto from '../../Asset/Illustration/samplefood.jpg'
import closeLogo from '../../Asset/Icon/close.png'
import backLogo from '../../Asset/Icon/arrow-left.png'
import StarIcon from '../../Asset/Icon/star.png'
import { useMediaQuery } from 'react-responsive'
import { Scrollbars } from 'react-custom-scrollbars'
import MenuSelection from './MenuSelection'
import { useDispatch, useSelector } from 'react-redux'
import RegisterDialog from '../Authentication/RegisterDialog';
import Cookies from "js-cookie"
import PinDialog from "../Authentication/PinDialog";
import Loader from 'react-loader-spinner'

const MenuDetail = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const menuCateg = props.handleCateg
    const [menuSelect, setmenuSelect] = useState(false)
    const [menuCondition, setmenuCondition] = useState(false)
    const [registerDialog, setRegister] = useState(false)
    const [pinDialog, setPin] = useState(false)
    const [email, setEmail] = useState('');
    const [loadingButton, setloadingButton] = useState(true)

    const isMobile = useMediaQuery({ maxWidth: 768 })

    const closeModal = (e) => {
        e.stopPropagation()
        dispatch({ type: 'DEFAULTSTATE' })
        props.onHide()
    }

    const backModal = (e) => {
        if (AllRedu.openMenuCart) {
            setmenuSelect(false)
            e.stopPropagation()
            dispatch({ type: 'DEFAULTSTATE' })
            props.onHide()
        } else {
            setmenuSelect(false)
            dispatch({ type: 'DEFAULTSTATE' })
        }
    }

    const addtoCart = () => {
        if (!loadingButton) {
            console.log('waitbro');
        } else {
            if (AllRedu.mandatCheck && AllRedu.mandatCheckCond && AllRedu.mandatRadio && AllRedu.mandatRadioCond) {
                props.handleClick()
                dispatch({ type: 'DEFAULTSTATE' })
                props.onHide()
            } else if (!AllRedu.mandatCheck && !AllRedu.mandatCheckCond && !AllRedu.mandatRadio && !AllRedu.mandatRadioCond) {
                props.handleClick()
                dispatch({ type: 'DEFAULTSTATE' })
                props.onHide()
            } else if (AllRedu.mandatCheck && AllRedu.mandatCheckCond && !AllRedu.mandatRadio && !AllRedu.mandatRadioCond) {
                props.handleClick()
                dispatch({ type: 'DEFAULTSTATE' })
                props.onHide()
            } else if (!AllRedu.mandatCheck && !AllRedu.mandatCheckCond && AllRedu.mandatRadio && AllRedu.mandatRadioCond) {
                props.handleClick()
                dispatch({ type: 'DEFAULTSTATE' })
                props.onHide()
            } else {
                alert('cannot buy')
            }
        }
    }

    const countTotalPrice = () => {
        let totalCheckPrice = 0
        let totalRadioPrice = 0
        let totalPrice = 0
        let sumCheckPrice = AllRedu.checkboxes
        sumCheckPrice.forEach(firstVal => {
            firstVal.forEach(nestedVal => {
                totalCheckPrice += nestedVal.price
            })
        });

        let sumRadioPrice = AllRedu.radiobutton
        sumRadioPrice.forEach(firstVal => {
            firstVal.forEach(nestedVal => {
                totalRadioPrice += nestedVal.price
            })
        });

        totalCheckPrice = totalCheckPrice * AllRedu.validQTY
        totalRadioPrice = totalRadioPrice * AllRedu.validQTY
        totalPrice += totalCheckPrice + totalRadioPrice
        totalPrice += AllRedu.validQTY * props.datas.foodPrice
        return totalPrice
    }

    let auth;

    const openMenuSelect = () => {
        
        if (Cookies.get("auth") === undefined) {
            // props.onHide();
            setRegister(true);
            // showRegisterDialog();
        } else {
            auth = JSON.parse(Cookies.get("auth"));
            if(auth.isLogged === false) {
                openPinDialog();
            } else {
                setloadingButton(false)
                dispatch({ type: 'LOADING' })
                setmenuSelect(true)
                dispatch({ type: 'FOODCATEG', payload: findCateg })
            }
            // openPinDialog();
            
        }
    }

    let findCateg
    if (AllRedu.openMenuCart) {
        findCateg = props.datas.foodCategory
        if (!menuCondition) {
            setmenuSelect(true)
            setmenuCondition(true)
        }
    } else {
        findCateg = menuCateg.filter((val) => {
            return props.datas.category === parseInt(val.category_id)
        })
        findCateg = findCateg[0].category_name.toLowerCase()
    }

    let totalCheckPrice = 0
    let totalRadioPrice = 0
    let totalPrice = 0
    let sumCheckPrice = AllRedu.checkboxes
    sumCheckPrice.forEach(firstVal => {
        firstVal.forEach(nestedVal => {
            totalCheckPrice += nestedVal.price
        })
    });

    let sumRadioPrice = AllRedu.radiobutton
    sumRadioPrice.forEach(firstVal => {
        firstVal.forEach(nestedVal => {
            totalRadioPrice += nestedVal.price
        })
    });

    totalCheckPrice = totalCheckPrice * AllRedu.validQTY
    totalRadioPrice = totalRadioPrice * AllRedu.validQTY
    totalPrice += totalCheckPrice + totalRadioPrice
    totalPrice += AllRedu.validQTY * props.datas.foodPrice
    props.handleAmount(totalPrice)

    const showRegisterDialog = () => {
        if(registerDialog) {
            return (
                <RegisterDialog 
                    isShowRegister={registerDialog}
                    onHideRegister={() =>setRegister(false)}
                />
            )
        }
    }

    const openPinDialog = () => {
        setEmail(auth.email);

        const data = {
            email: email
        };

        dispatch({ type: 'LOGIN', payload: data });
        dispatch({ type: 'LOGINSTEP', payload: true });

        setPin(true);
    }

    const showPinDialog = () => {
        if(pinDialog) {
            return (
                <PinDialog 
                    isShowPin={pinDialog}
                    onHidePin={() =>setPin(false)}
                />
            )
        }
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
                                        <img src={backLogo} className='backLogo' alt='' />
                                    </span>
                                    :
                                    <span className='iconClose' onClick={closeModal}>
                                        <img src={closeLogo} className='closeLogo' alt='' />
                                    </span>
                            }

                            <div className='menuDetail-layout'>
                                <div className='menuContain-left'>
                                    <div className='menuBanner'>
                                        <img className='menuimg' src={props.datas.foodImage} alt='' />
                                    </div>

                                    <div className='menu-detail'>
                                        <div className='menu-star'>
                                            <img className='menu-star-img' src={StarIcon} alt='' />
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
                                            <Scrollbars style={{ height: "calc(100% - 133px)" }}>
                                                <MenuSelection handleData={props.handleData} datas={props.datas} handleClick={props.handleClick} loadingButton={() => setloadingButton(true)} />
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
                                                <div className='openMenuSelection' style={{
                                                    backgroundColor:
                                                        AllRedu.mandatCheck && AllRedu.mandatCheckCond && AllRedu.mandatRadio && AllRedu.mandatRadioCond ?
                                                            '#4bb7ac'
                                                            :
                                                            !AllRedu.mandatCheck && !AllRedu.mandatCheckCond && !AllRedu.mandatRadio && !AllRedu.mandatRadioCond ?
                                                                '#4bb7ac'
                                                                :
                                                                AllRedu.mandatCheck && AllRedu.mandatCheckCond && !AllRedu.mandatRadio && !AllRedu.mandatRadioCond ?
                                                                    '#4bb7ac'
                                                                    :
                                                                    !AllRedu.mandatCheck && !AllRedu.mandatCheckCond && AllRedu.mandatRadio && AllRedu.mandatRadioCond ?
                                                                        '#4bb7ac'
                                                                        :
                                                                        '#aaaaaa'
                                                }} onClick={addtoCart}>
                                                    {
                                                        !loadingButton ?
                                                            <Loader
                                                                type="ThreeDots"
                                                                color="#ffffff"
                                                                height={70}
                                                                width={70}
                                                            />
                                                            :
                                                            <h2 className='add-words'>
                                                                {
                                                                    AllRedu.checkboxes.length || AllRedu.radiobutton.length || AllRedu.validQTY ?
                                                                        'TAMBAH - ' + `${Intl.NumberFormat("id-ID").format(countTotalPrice())}`
                                                                        :
                                                                        'TAMBAH - ' + `${Intl.NumberFormat("id-ID").format(props.datas.foodPrice)}`
                                                                }
                                                            </h2>
                                                    }
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
                                <img className='mob-menuimg' src={props.datas.foodImage} alt='' />
                                {
                                    menuSelect ?
                                        <span className='mob-iconClose' onClick={backModal}>
                                            <img src={closeLogo} className='mob-closeLogo' alt='' />
                                        </span>
                                        :
                                        <span className='mob-iconClose' onClick={closeModal}>
                                            <img src={closeLogo} className='mob-closeLogo' alt='' />
                                        </span>
                                }
                            </div>

                            <div className='mob-menuContain'>
                                <div className='mob-inside-menuContain' style={{ boxShadow: menuSelect ? "0px 5px 4px rgba(0, 0, 0, 0.1)" : "none" }}>
                                    <div className='mob-menu-detail'>
                                        <div className='mob-menu-star'>
                                            <img className='mob-menu-star-img' src={StarIcon} alt='' />
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
                                        <Scrollbars style={{ height: "calc(88vh - 375px)" }}>
                                            <MenuSelection handleData={props.handleData} datas={props.datas} handleClick={props.handleClick} loadingButton={() => setloadingButton(true)} />
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
                                            <div className='mob-openMenuSelection' style={{
                                                backgroundColor:
                                                    AllRedu.mandatCheck && AllRedu.mandatCheckCond && AllRedu.mandatRadio && AllRedu.mandatRadioCond ?
                                                        '#4bb7ac'
                                                        :
                                                        !AllRedu.mandatCheck && !AllRedu.mandatCheckCond && !AllRedu.mandatRadio && !AllRedu.mandatRadioCond ?
                                                            '#4bb7ac'
                                                            :
                                                            AllRedu.mandatCheck && AllRedu.mandatCheckCond && !AllRedu.mandatRadio && !AllRedu.mandatRadioCond ?
                                                                '#4bb7ac'
                                                                :
                                                                !AllRedu.mandatCheck && !AllRedu.mandatCheckCond && AllRedu.mandatRadio && AllRedu.mandatRadioCond ?
                                                                    '#4bb7ac'
                                                                    :
                                                                    '#aaaaaa'
                                            }} onClick={addtoCart}>
                                                {
                                                    !loadingButton ?
                                                        <Loader
                                                            type="ThreeDots"
                                                            color="#ffffff"
                                                            height={70}
                                                            width={70}
                                                        />
                                                        :
                                                        <h2 className='mob-add-words'>
                                                            {
                                                                AllRedu.checkboxes.length || AllRedu.radiobutton.length || AllRedu.validQTY ?
                                                                    'TAMBAH - ' + `${Intl.NumberFormat("id-ID").format(countTotalPrice())}`
                                                                    :
                                                                    'TAMBAH - ' + `${Intl.NumberFormat("id-ID").format(props.datas.foodPrice)}`
                                                            }
                                                        </h2>
                                                }
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
            {showRegisterDialog()}
            {showPinDialog()}
        </div>
        
    );
}

export default MenuDetail