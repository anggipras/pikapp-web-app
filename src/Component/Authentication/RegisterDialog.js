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
import ReCAPTCHA from "react-google-recaptcha";

const RegisterDialog = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const [registerDialog, setRegister] = useState(false)
    const [loginDialog, setLogin] = useState(false)
    const [pinDialog, setPin] = useState(false)
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
        if(loginDialog) {
            return (
                <LoginDialog 
                    isShowLogin={loginDialog}
                    onHideLogin={() =>setLogin(false)}
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
          setErrorMsg("Name cannot be empty.");
          return false;
        }
    };

    const handleRegister = (e) => {
        if (checkEmail() === false) {
          setIsValid(false);
          return;
        }
        if (checkName === false) {
          setIsValid(false);
          return;
        }
        if (checkPhone === false) {
          setIsValid(false);
          return;
        }
    
        // this.props.LoadingButton()
        setIsValid(true);
        
    };

    const onChange = (value) => {
        console.log(value);
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
                            <div className='menuContain-left-auth'>
                                <div className='menuBanner-auth'>
                                    <img src={pikappLogo} className='menuimg-auth' alt='' />
                                </div>

                                <div className='menu-detail-auth'>
                                    <div className='menu-name-auth'>
                                        Selangkah Lagi Sebelum Memesan!
                                    </div>

                                    <div>
                                        {
                                            <Form>
                                                <Row>
                                                    <Col xs={11}>
                                                    <PikaTextField
                                                        type="text"
                                                        placeholder="Nama Lengkap"
                                                        handleChange={handleName}
                                                    />
                                                    </Col>
                                                    <Col />
                                                </Row>
                                                <Row>
                                                    <Col xs={11}>
                                                    <PikaTextField
                                                        type="tel"
                                                        placeholder="Nomor Handphone (Whatsapp)"
                                                        handleChange={handlePhone}
                                                    />
                                                    </Col>
                                                    <Col />
                                                </Row>
                                                <Row>
                                                    <Col xs={11}>
                                                    <PikaTextField
                                                        type="email"
                                                        placeholder="Alamat Email"
                                                        handleChange={handleEmail}
                                                    />
                                                    </Col>
                                                    <Col />
                                                </Row>

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
                                                
                                                <Row>
                                                    <Col xs={4}>
                                                    <p className="linkWords">
                                                        {/* <Link onClick={openLoginDialog}>Login Saja</Link> */}
                                                        <div onClick={openLoginDialog}>LOGIN SAJA</div>
                                                    </p>
                                                    </Col>
                                                    <Col xs={3}/>

                                                    
                                                    <Col xs={4}>
                                                    <PikaButton
                                                        title="SUBMIT"
                                                        buttonStyle="greenPika"
                                                        handleClick={openPinDialog}
                                                    />
                                                    </Col>
                                                    <Col />
                                                </Row>
                                            </Form>
                                        }
                                    </div>
                                </div>
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
                            <div className='menuContain-left-auth'>
                                <div className='menuBanner-auth'>
                                    <img src={pikappLogo} className='menuimg-auth' alt='' />
                                </div>

                                <div className='menu-detail-auth'>
                                    <div className='menu-name-auth'>
                                        Selangkah Lagi Sebelum Memesan!
                                    </div>

                                    <div>
                                        {
                                            <Form>
                                                <Row>
                                                    <Col xs={11}>
                                                    <PikaTextField
                                                        type="text"
                                                        placeholder="Nama Lengkap"
                                                        handleChange={handleName}
                                                    />
                                                    </Col>
                                                    <Col />
                                                </Row>
                                                <Row>
                                                    <Col xs={11}>
                                                    <PikaTextField
                                                        type="tel"
                                                        placeholder="Nomor Handphone (Whatsapp)"
                                                        handleChange={handlePhone}
                                                    />
                                                    </Col>
                                                    <Col />
                                                </Row>
                                                <Row>
                                                    <Col xs={11}>
                                                    <PikaTextField
                                                        type="email"
                                                        placeholder="Alamat Email"
                                                        handleChange={handleEmail}
                                                    />
                                                    </Col>
                                                    <Col />
                                                </Row>

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
                                                
                                                <Row>
                                                    <Col xs={3}>
                                                    <p className="linkWords">
                                                        {/* <Link onClick={openLoginDialog}>Login Saja</Link> */}
                                                        <div onClick={openLoginDialog}>LOGIN SAJA</div>
                                                    </p>
                                                    </Col>
                                                    <Col xs={2} md={2}/>

                                                    
                                                    <Col xs={4}>
                                                    <PikaButton
                                                        title="SUBMIT"
                                                        buttonStyle="greenPika"
                                                        handleClick={openPinDialog}
                                                    />
                                                    </Col>
                                                    <Col />
                                                </Row>
                                            </Form>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {showLoginDialog()}
            {showPinDialog()}
        </div>
    );
}

export default RegisterDialog