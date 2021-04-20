import React, { useState } from "react";
import '../../Asset/scss/AuthenticationDialog.scss'
import closeLogo from '../../Asset/Icon/close.png'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import pikappLogo from '../../Asset/Logo/logo4x.png';
import { Alert, Col, Form, Row } from "react-bootstrap";
import PikaButton from "../../Component/Button/PikaButton";
import PikaTextField from "../../Component/TextField/PikaTextField";

const ForgotPinDialog = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isCaptcha, setIsCaptcha] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: 768 })

    const closeModal = (e) => {
        e.stopPropagation()
        dispatch({ type: 'DEFAULTSTATE' })
        props.onHideForgotPin()
    }

    const backModal = (e) => {
        if (AllRedu.openMenuCart) {
            // setmenuSelect(false)
            e.stopPropagation()
            dispatch({ type: 'DEFAULTSTATE' })
            props.onHideForgotPin()
        } else {
            // setmenuSelect(false)
            dispatch({ type: 'DEFAULTSTATE' })
        }
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const checkEmail = () => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRegex.test(email)) {
            return true;
        } else {
            setErrorMsg("Email is not valid.");
            return false;
        }
    }

    return (
        <div>
            {
                !isMobile ?
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowForgotPin ? 'block' : 'none'
                }} onClick={closeModal}
                >
                    <div className='modal-content-menudetail-auth' onClick={e => e.stopPropagation()}>
                        {
                            <span className='iconClose-auth' onClick={closeModal}>
                                <img src={closeLogo} className='closeLogo-auth' alt='' />
                            </span>
                        }

                        <div className='menuDetail-layout-auth'>
                            <div className='menuContain-all-auth'>
                                <img src={pikappLogo} className='menuimg-auth' alt='' />

                                <div className='menu-detail-auth'>
                                    <div className='menu-name-auth'>
                                        Lupa PIN ?
                                    </div>

                                    <div className='mob-menu-category-auth'>
                                        Silahkan masukkan email Anda yang terdaftar.
                                    </div>

                                    <div className='textfield-auth'>
                                        <input type='email' className='textfieldinput-auth' placeholder="Alamat Email" onChange={handleEmail} />

                                            <Form>
                                                <Row>
                                                    <Col xs={11}>
                                                    {isValid || (
                                                        <Alert variant="danger">{errorMsg}</Alert>
                                                    )}
                                                    </Col>
                                                    <Col />
                                                </Row>
                                                
                                            </Form>

                                            <div className='buttonSide-auth'>
                                                <p className="linkWords">KEMBALI</p>
                                                <div className="submitButton-auth">
                                                    <div className="wordsButton-auth">
                                                        SUBMIT
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='bottomSide-auth'>
                                                <h4 className='countrySide-auth'>Indonesia</h4>
                                                <div className='reqSide-auth'>
                                                    <h4 className='reqSideWord-auth'>Privasi</h4>
                                                    <h4 className='reqSideWord-auth'>Persyaratan</h4>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowForgotPin ? 'block' : 'none'
                }} onClick={closeModal}
                >
                    <div className='modal-content-menudetail-auth' onClick={e => e.stopPropagation()}>
                        {
                            <span className='iconClose-auth' onClick={closeModal}>
                                <img src={closeLogo} className='closeLogo-auth' alt='' />
                            </span>
                        }

                        <div className='menuDetail-layout-auth'>
                            <div className='menuContain-all-auth'>
                                <img src={pikappLogo} className='menuimg-auth' alt='' />

                                <div className='menu-detail-auth'>
                                    <div className='menu-name-auth'>
                                        Lupa PIN ?
                                    </div>

                                    <div className='mob-menu-category-auth'>
                                        Silahkan masukkan email Anda yang terdaftar.
                                    </div>

                                    <div className='textfield-auth'>
                                        <input type='email' className='textfieldinput-auth' placeholder="Alamat Email" onChange={handleEmail} />

                                            <Form>
                                                <Row>
                                                    <Col xs={11}>
                                                    {isValid || (
                                                        <Alert variant="danger">{errorMsg}</Alert>
                                                    )}
                                                    </Col>
                                                    <Col />
                                                </Row>
                                                
                                            </Form>

                                            <div className='buttonSide-auth'>
                                                <p className="linkWords">KEMBALI</p>
                                                <div className="submitButton-auth">
                                                    <div className="wordsButton-auth">
                                                        SUBMIT
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='bottomSide-auth'>
                                                <h4 className='countrySide-auth'>Indonesia</h4>
                                                <div className='reqSide-auth'>
                                                    <h4 className='reqSideWord-auth'>Privasi</h4>
                                                    <h4 className='reqSideWord-auth'>Persyaratan</h4>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );

    // return (
    //     <div>
    //         {
    //             !isMobile ?
    //             <div className='modalMenuDetail-auth' style={{
    //                 display: props.isShowForgotPin ? 'block' : 'none'
    //             }} onClick={closeModal}
    //             >
    //                 <div className='modal-content-menudetail-auth' onClick={e => e.stopPropagation()}>
    //                     {
    //                         <span className='iconClose-auth' onClick={closeModal}>
    //                             <img src={closeLogo} className='closeLogo-auth' alt='' />
    //                         </span>
    //                     }

    //                     <div className='menuDetail-layout-auth'>
    //                         <div className='menuContain-all-auth'>
    //                             <img src={pikappLogo} className='menuimg-auth' alt='' />

    //                             <div className='menu-detail-auth'>
    //                                 <div className='menu-name-auth'>
    //                                     Lupa PIN ?
    //                                 </div>

    //                                 <div className='mob-menu-category-auth'>
    //                                     Silahkan masukkan emeil Anda yang terdaftar.
    //                                 </div>

    //                                 <div>
    //                                     {
    //                                         <Form>
    //                                             <Row className="btm50 top30">
    //                                                 <Col xs={11}>
    //                                                 <PikaTextField
    //                                                     type="email"
    //                                                     placeholder="Alamat Email"
    //                                                     handleChange={handleEmail}
    //                                                 />
    //                                                 </Col>
    //                                                 <Col />
    //                                             </Row>

    //                                             <Row>
    //                                                 <Col xs={11}>
    //                                                 {isValid || (
    //                                                     <Alert variant="danger">{errorMsg}</Alert>
    //                                                 )}
    //                                                 </Col>
    //                                                 <Col />
    //                                             </Row>
                                                
    //                                             <Row>
    //                                                 <Col xs={4}>
    //                                                 <p className="linkWords">
    //                                                     <div>KEMBALI</div>
    //                                                 </p>
    //                                                 </Col>
    //                                                 <Col xs={3}/>

    //                                                 <Col xs={4}>
    //                                                 <PikaButton
    //                                                     title="SUBMIT"
    //                                                     buttonStyle="greenPika"
    //                                                 />
    //                                                 </Col>
    //                                                 <Col />
    //                                             </Row>
    //                                         </Form>
    //                                     }
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //             :
    //             <div className='modalMenuDetail-auth' style={{
    //                 display: props.isShowForgotPin ? 'block' : 'none'
    //             }} onClick={closeModal}
    //             >
    //                 <div className='modal-content-menudetail-auth' onClick={e => e.stopPropagation()}>
    //                     {
    //                         <span className='iconClose' onClick={closeModal}>
    //                             <img src={closeLogo} className='closeLogo' alt='' />
    //                         </span>
    //                     }

    //                     <div className='menuDetail-layout-auth'>
    //                         <div className='menuContain-left-auth'>
    //                             <div className='menuBanner-auth'>
    //                                 <img src={pikappLogo} className='menuimg-auth' alt='' />
    //                             </div>

    //                             <div className='menu-detail-auth'>
    //                                 <div className='menu-name-auth'>
    //                                     Lupa PIN ?
    //                                 </div>

    //                                 <div className='mob-menu-category-auth'>
    //                                     Silahkan masukkan emeil Anda yang terdaftar.
    //                                 </div>

    //                                 <div>
    //                                     {
    //                                         <Form>
    //                                             <Row className="btm50 top30">
    //                                                 <Col xs={11}>
    //                                                 <PikaTextField
    //                                                     type="email"
    //                                                     placeholder="Alamat Email"
    //                                                     handleChange={handleEmail}
    //                                                 />
    //                                                 </Col>
    //                                                 <Col />
    //                                             </Row>

    //                                             <Row>
    //                                                 <Col xs={11}>
    //                                                 {isValid || (
    //                                                     <Alert variant="danger">{errorMsg}</Alert>
    //                                                 )}
    //                                                 </Col>
    //                                                 <Col />
    //                                             </Row>
                                                
    //                                             <Row>
    //                                                 <Col xs={3}>
    //                                                 <p className="linkWords">
    //                                                     <div>KEMBALI</div>
    //                                                 </p>
    //                                                 </Col>
    //                                                 <Col xs={2} md={2}/>

    //                                                 <Col xs={4}>
    //                                                 <PikaButton
    //                                                     title="SUBMIT"
    //                                                     buttonStyle="greenPika"
    //                                                 />
    //                                                 </Col>
    //                                                 <Col />
    //                                             </Row>
    //                                         </Form>
    //                                     }
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         }
    //     </div>
    // );
}

export default ForgotPinDialog