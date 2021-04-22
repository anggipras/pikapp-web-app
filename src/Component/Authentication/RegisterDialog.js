import React, { useState } from "react";
import '../../Asset/scss/AuthenticationDialog.scss'
import closeLogo from '../../Asset/Icon/close.png'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import pikappLogo from '../../Asset/Logo/logo4x.png';
import { Alert, Col, Form, Row } from "react-bootstrap";
import PikaButton from "../../Component/Button/PikaButton";
import PikaTextField from "../../Component/TextField/PikaTextField";
import LoginDialog from "../Authentication/LoginDialog";
import PinDialog from "./PinDialog";
import ConfirmPinDialog from "./ConfirmPinDialog";
import ReCAPTCHA from "react-google-recaptcha";
import ForgotPin from "./ForgotPinDialog";

const RegisterDialog = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const AuthRedu = useSelector(state => state.AuthRedu);
    const [loginDialog, setLogin] = useState(false);
    const [pinDialog, setPin] = useState(false);
    const [confirmPinDialog, setConfirmPin] = useState(false);
    const [forgotPinDialog, setForgotPin] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isCaptcha, setIsCaptcha] = useState(false);
    const [captchaCounter, setCaptchaCounter] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');

    const isMobile = useMediaQuery({ maxWidth: 768 })

    // if(AuthRedu.dataRegister) {
    //     setName(AuthRedu.dataRegister.full_name);
    //     setEmail(AuthRedu.dataRegister.email);
    //     setPhone(AuthRedu.dataRegister.phone_number);
    // }

    const closeModal = (e) => {
        e.stopPropagation()
        dispatch({ type: 'DEFAULTSTATE' })
        props.onHideRegister()
    }

    const backModal = (e) => {
        if (AllRedu.openMenuCart) {
            // setmenuSelect(false)
            e.stopPropagation()
            dispatch({ type: 'DEFAULTSTATE' })
            props.onHideRegister()
        } else {
            // setmenuSelect(false)
            dispatch({ type: 'DEFAULTSTATE' })
        }
    }

    const openLoginDialog = () => {
        setLogin(true);
    }

    const showLoginDialog = () => {
        if (loginDialog) {
            return (
                <LoginDialog
                    isShowLogin={loginDialog}
                    onHideLogin={() => setLogin(false)}
                />
            )
        }
    }

    const openPinDialog = (e) => {
        if (checkEmail() === false) {
            setIsValid(false);
            return;
        }
        if (checkName() === false) {
            setIsValid(false);
            return;
        }
        if (checkPhone() === false) {
            setIsValid(false);
            return;
        }

        // this.props.LoadingButton()
        setIsValid(true);

        const data = {
            full_name: name,
            phone_number: phone,
            email: email
        };

        dispatch({ type: 'REGISTER', payload: data });
        dispatch({ type: 'LOGINSTEP', payload: false });

        setPin(true);
        // setConfirmPin(true);
        // setForgotPin(true);
        // props.onHideRegister();
    }

    const showPinDialog = () => {
        if (pinDialog) {
            return (
                <PinDialog
                    isShowPin={pinDialog}
                    onHidePin={() => setPin(false)}
                />
            )
        }
    }

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePhone = (e) => {
        setPhone(e.target.value);
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

    const checkName = () => {
        if (name.length > 0) {
            return true;
        } else {
            setErrorMsg("Name cannot be empty.");
            return false;
        }
    };

    const checkPhone = () => {
        if (phone.startsWith("08")) {
            return true;
        } else {
            setErrorMsg("Phone not valid.");
            return false;
        }
    };

    const onChange = (value) => {
        console.log(value);
    }

    const closeRegisterFlowDialog = () => {
        setConfirmPin(false);
        props.onHideRegister();
    }

    const closeLoginFlowDialog = () => {
        setPin(false);
        props.onHideRegister();
    }

    const closeForgotFlowDialog = () => {
        setForgotPin(false);
        props.onHideRegister();
    }

    const showDialog = (value) => {
        if(pinDialog) {
            return (
                <PinDialog
                    isShowPin={pinDialog}
                    onHidePin={() => setPin(false)}
                    onShowConfirm={() => setConfirmPin(true)}
                    onShowForgotPin={() => setForgotPin(true)}
                    onHideLoginFlow={closeLoginFlowDialog}
                />
            )
        } else if(loginDialog){
            return (
                <LoginDialog
                    isShowLogin={loginDialog}
                    onHideLogin={() => setLogin(false)}
                    onShowPin={() => setPin(true)}
                />
            )
        } 
        else if(confirmPinDialog) {
            return (
                <ConfirmPinDialog
                    isShowConfirmPin={confirmPinDialog}
                    onHideConfirmPin={() => setConfirmPin(false)}
                    onHideRegisterFlow={closeRegisterFlowDialog}
                />
            )
        }
        else if (forgotPinDialog) {
            return (
                <ForgotPin
                    isShowForgotPin={forgotPinDialog}
                    onHideForgotPin={() => setForgotPin(false)}
                    onHideForgotFlow={closeForgotFlowDialog}
                />
            )
        }
        else {
            return (
                <div className='menu-detail-auth'>
                    <div className='menu-name-auth'>
                        Selangkah Lagi Sebelum Memesan!
                    </div>

                    <div className='textfield-auth'>
                        <input type='text' className='textfieldinput-auth' placeholder="Nama Lengkap" onChange={handleName} />
                        <input type='tel' className='textfieldinput-auth' placeholder="Nomor Handphone (Whatsapp)" onChange={handlePhone} />
                        <input type='email' className='textfieldinput-auth' placeholder="Alamat Email" onChange={handleEmail} />

                        <Form>
                            <Row>
                                <Col xs={11}>
                                    {!isCaptcha || (
                                        <ReCAPTCHA sitekey="asd" onChange={onChange} />
                                    )}
                                </Col>
                                <Col />
                            </Row>

                            <Row>
                                <Col xs={6}>
                                    {isValid || (
                                        <Alert variant="danger">{errorMsg}</Alert>
                                    )}
                                </Col>
                                <Col />
                            </Row>
                        
                            <div className='buttonSide-auth'>
                                <p className="linkWords" onClick={openLoginDialog}>LOGIN SAJA</p>
                                <div className="submitButton-auth" onClick={openPinDialog}>
                                    <div className="wordsButton-auth">
                                        NEXT
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
                        </Form>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            {
                !isMobile ?
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowRegister ? 'block' : 'none'
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

                                {showDialog()}

                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowRegister ? 'block' : 'none'
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

                                {showDialog()}

                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default RegisterDialog