import React, { useState } from "react";
import '../../Asset/scss/AuthenticationDialog.scss'
import closeLogo from '../../Asset/Icon/close.png'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import PinInput from "react-pin-input";
import pikappLogo from '../../Asset/Logo/logo4x.png';
import { Alert, Col, Form, Row } from "react-bootstrap";
import PikaButton from "../../Component/Button/PikaButton";
import ConfirmPinDialog from './ConfirmPinDialog';
import Cookies from "js-cookie";
import axios from "axios";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import ForgotPin from "./ForgotPinDialog";

const PinDialog = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const AuthRedu = useSelector(state => state.AuthRedu);
    const [confirmPinDialog, setConfirmPin] = useState(false);
    const [forgotPinDialog, setForgotPin] = useState(false);
    const [pin, setPin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isCaptcha, setIsCaptcha] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoginStep, setIsLoginStep] = useState(false);
    const [captchaCounter, setCaptchaCounter] = useState(0);

    const isMobile = useMediaQuery({ maxWidth: 768 })

    const closeModal = (e) => {
        e.stopPropagation()
        dispatch({ type: 'DEFAULTSTATE' })
        props.onHidePin()
    }

    const backModal = (e) => {
        if (AllRedu.openMenuCart) {
            // setmenuSelect(false)
            e.stopPropagation()
            dispatch({ type: 'DEFAULTSTATE' })
            props.onHidePin()
        } else {
            // setmenuSelect(false)
            dispatch({ type: 'DEFAULTSTATE' })
        }
    }

    const openConfirmPinDialog = () => {

        if (checkPin() === false) {
            setIsValid(false);
            return;
        }

        setIsValid(true);

        const data = {
            full_name: AuthRedu.dataRegister.full_name,
            phone_number: AuthRedu.dataRegister.phone_number,
            email: AuthRedu.dataRegister.email,
            pin : pin
        };

        dispatch({ type: 'REGISTER', payload: data });
        setIsLoginStep(false);
        setConfirmPin(true);
    }

    const handleLogin = (e) => {
        if (checkPin() === false) {
            setIsValid(false);
            return;
        }

        setIsValid(true);

        dispatch({ type: 'LOADING' });

        const data = {
            username: AuthRedu.dataLogin.email,
            pin: pin,
            fcm_token: "qaah4zq3cutmr36kqvq95qj5hax8f9ku25fv",
        };
        const auth = {
            isLogged: false,
            token: "",
            new_event: true,
            recommendation_status: false,
            email: "",
            is_email_verified : true
        };
        
        let uuid = uuidV4();
        uuid = uuid.replaceAll("-", "");
        const date = new Date().toISOString();
        axios(address + "auth/v2/login", {
        headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
        },
        method: "POST",
        data: data,
        })
        .then((res) => {
            auth.isLogged = true;
            auth.token = res.data.token;
            auth.new_event = res.data.new_event;
            auth.recommendation_status = res.data.recommendation_status;
            auth.is_email_verified = res.data.is_email_verified;
            auth.email = AuthRedu.dataLogin.email;
            Cookies.set("auth", auth, { expires: 1 });
            var getLocation = JSON.parse(localStorage.getItem("longlat"))
            var latitude = getLocation.lat
            var longitude = getLocation.lon
            if (Cookies.get("lastLink") !== undefined) {
                var lastlink = JSON.parse(Cookies.get("lastLink")).value
            // }
            // window.location.reload();
            if (lastlink.includes("?latitude") || lastlink.includes("store?")) {
                window.location.href = JSON.parse(Cookies.get("lastLink")).value
            } else {
                window.location.href = JSON.parse(Cookies.get("lastLink")).value + `?latitude=${latitude}&longitude=${longitude}`
            }
            } else {
            window.location.href = window.location.origin + `?latitude=${latitude}&longitude=${longitude}`
            }
        })
        .catch((err) => {
            if (err.response.data !== undefined) {
                alert(err.response.data.err_message)
                // props.DoneLoad()
                dispatch({ type: 'DONELOAD' });
            }
            setCaptchaCounter(captchaCounter + 1);
        });
    }

    const showConfirmPinDialog = () => {
        if(confirmPinDialog) {
            return (
                <ConfirmPinDialog 
                    isShowConfirmPin={confirmPinDialog}
                    onHideConfirmPin={() =>setConfirmPin(false)}
                />
            )
        }
    }

    const openForgotPinDialog = () => {
        setForgotPin(true);
    }

    const showForgotPinDialog = () => {
        if(forgotPinDialog) {
            return (
                <ForgotPin 
                    isShowForgotPin={forgotPinDialog}
                    onHideForgotPin={() =>setForgotPin(false)}
                />
            )
        }
    }

    const handlePin = (e) => {
        setPin(e);
    }

    const checkPin = () => {
        if (pin.length < 6) {
          setErrorMsg("PIN must be within 6 digit numeric.");
          return false;
        } else {
          return true;
        }
    };

    return (
        <div>
            {
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowPin ? 'block' : 'none'
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
                                        Ketik PIN Anda
                                    </div>

                                    <div className='mob-menu-category-auth'>
                                        Ketik 6 digit nomor PIN Anda
                                    </div>

                                    <div>
                                        {
                                            <Form>
                                                <Row>
                                                    <Col xs={11}>
                                                        <PinInput
                                                        className='pinInput'
                                                        length={6}
                                                        focus
                                                        // disabled
                                                        secret
                                                        ref={p => (pin => p)}
                                                        type="numeric"
                                                        // onChange={handlePin}
                                                        onComplete={handlePin}
                                                        />
                                                        <div></div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col xs={11}>
                                                    {isValid || (
                                                        <Alert variant="danger">{errorMsg}</Alert>
                                                    )}
                                                    </Col>
                                                    <Col />
                                                </Row>

                                                <Row>
                                                    <Col xs={11}>
                                                        {
                                                        !AuthRedu.isLoginStep ?
                                                        
                                                        <div className='menu-category-auth btm30'>
                                                            
                                                        </div>
                                                        :
                                                        <div className='menu-category-auth btm30' onClick={openForgotPinDialog}>
                                                            LUPA PIN ?
                                                        </div>
                                                        }
                                                    </Col>
                                                </Row>
                                                
                                                <Row>
                                                    <Col xs={5}>
                                                    <p className="linkWords">
                                                        <div onClick={closeModal}>KEMBALI</div>
                                                    </p>
                                                    </Col>
                                                    <Col />

                                                    <Col xs={4}>
                                                        {
                                                        !AuthRedu.isLoginStep ? 
                                                        <PikaButton
                                                            title="NEXT"
                                                            buttonStyle="greenPika"
                                                            handleClick={openConfirmPinDialog}
                                                        />
                                                        :
                                                        <PikaButton
                                                            title="SUBMIT"
                                                            buttonStyle="greenPika"
                                                            handleClick={handleLogin}
                                                        />
                                                        }
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
            {showConfirmPinDialog()}
            {showForgotPinDialog()}
        </div>
    );
}

export default PinDialog