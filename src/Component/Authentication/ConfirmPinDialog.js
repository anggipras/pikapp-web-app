import React, { useState } from "react";
import '../../Asset/scss/AuthenticationDialog.scss'
import closeLogo from '../../Asset/Icon/close.png'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import PinInput from "react-pin-input";
import pikappLogo from '../../Asset/Logo/logo4x.png';
import { Alert, Col, Form, Row } from "react-bootstrap";
import PikaButton from "../../Component/Button/PikaButton";
import Cookies from "js-cookie";
import LoginDialog from "../Authentication/LoginDialog";
import axios from "axios";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";

const ConfirmPinDialog = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const AuthRedu = useSelector(state => state.AuthRedu);
    const [loginDialog, setLogin] = useState(false)
    const [confirmPin, setConfirmPin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isCaptcha, setIsCaptcha] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [captchaCounter, setCaptchaCounter] = useState(0);

    const isMobile = useMediaQuery({ maxWidth: 768 })

    const closeModal = (e) => {
        e.stopPropagation()
        dispatch({ type: 'DEFAULTSTATE' })
        props.onHideConfirmPin()
    }

    const backModal = (e) => {
        if (AllRedu.openMenuCart) {
            // setmenuSelect(false)
            e.stopPropagation()
            dispatch({ type: 'DEFAULTSTATE' })
            props.onHideConfirmPin()
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

    const handleConfirmPin = (e) => {
        setConfirmPin(e);
    }

    const checkConfirmPin = () => {
        if (AuthRedu.dataRegister.pin === confirmPin) {
            return true;
        } else {
            setErrorMsg("PIN does not match.");
            return false;
        }
    };

    const handleRegister = (e) => {
        if (checkConfirmPin() === false) {
            setIsValid(false);
            return;
        }

        setIsValid(true);
        dispatch({ type: 'LOADING' });

        const data = {
            full_name: AuthRedu.dataRegister.full_name,
            password: confirmPin,
            phone_number: AuthRedu.dataRegister.phone_number,
            email: AuthRedu.dataRegister.email,
            gender: "MALE",
            birth_day: "01011970",
            token: "qaah4zq3cutmr36kqvq95qj5hax8f9ku25fv",
        };

        let uuid = uuidV4();
        uuid = uuid.replaceAll("-", "");
        const date = new Date().toISOString();
        axios(address + "auth/register", {
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
                alert("Register berhasil.");
                handleLogin();
                // window.location.reload();
                // this.handleLogin()
                // openLoginDialog();
            })
            .catch((err) => {
                if (err.response.data !== undefined) {
                    alert(err.response.data.err_message)
                    // props.DoneLoad()
                    dispatch({ type: 'DONELOAD' });
                }
                // this.setState({ captchaCounter: this.state.captchaCounter + 1 });
                setCaptchaCounter(captchaCounter + 1);
            });

    }

    const handleLogin = (e) => {
        const data = {
            username: AuthRedu.dataRegister.email,
            pin: confirmPin,
            fcm_token: "qaah4zq3cutmr36kqvq95qj5hax8f9ku25fv",
        };

        const auth = {
            isLogged: false,
            token: "",
            new_event: true,
            recommendation_status: false,
            email: "",
            is_email_verified: true
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
                auth.email = AuthRedu.dataRegister.email;
                Cookies.set("auth", auth, { expires: 1 });
                var getLocation = JSON.parse(localStorage.getItem("longlat"))
                var latitude = getLocation.lat
                var longitude = getLocation.lon
                if (Cookies.get("lastLink") !== undefined) {
                    var lastlink = JSON.parse(Cookies.get("lastLink")).value;
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


    return (
        <div>
            {
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowConfirmPin ? 'block' : 'none'
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
                                        Konfirmasi PIN Anda
                                    </div>

                                    <div className='mob-menu-category-auth'>
                                        Konfirmasi 6 digit nomor PIN Anda
                                    </div>

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
                                                    onChange={handleConfirmPin}
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
                                    </Form>

                                    <div className='buttonSide-auth'>
                                        <p className="linkWords" onClick={closeModal}>KEMBALI</p>
                                        <div className="submitButton-auth" onClick={handleRegister}>
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
            }
            {showLoginDialog()}
        </div>
    );
}

export default ConfirmPinDialog