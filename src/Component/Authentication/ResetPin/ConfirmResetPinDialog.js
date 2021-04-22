import React, { useState } from "react";
import '../../../Asset/scss/AuthenticationDialog.scss';
import closeLogo from '../../../Asset/Icon/close.png';
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import PinInput from "react-pin-input";
import pikappLogo from '../../../Asset/Logo/logo4x.png';
import { Alert, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { address, clientId } from "../../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Swal from 'sweetalert2';
import Cookies from "js-cookie";

const ConfirmResetPinDialog = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const AuthRedu = useSelector(state => state.AuthRedu);
    const [confirmResetPin, setConfirmResetPin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isCaptcha, setIsCaptcha] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successStatus, setSuccessStatus] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: 768 })

    const closeModal = (e) => {
        e.stopPropagation()
        dispatch({ type: 'DEFAULTSTATE' })
        props.onHideConfirmResetPin()
    }

    const backModal = (e) => {
        if (AllRedu.openMenuCart) {
            // setmenuSelect(false)
            e.stopPropagation()
            dispatch({ type: 'DEFAULTSTATE' })
            props.onHideConfirmResetPin()
        } else {
            // setmenuSelect(false)
            dispatch({ type: 'DEFAULTSTATE' })
        }
    }

    const backToHome = (e) => {
        window.location.href = '/'
    }

    const handleConfirmResetPin = (e) => {
        setConfirmResetPin(e);
    }

    const checkConfirmResetPin = () => {
        if (AuthRedu.dataResetPin.currentPin === confirmResetPin) {
            return true;
          } else {
            setErrorMsg("PIN does not match.");
            return false;
          }
    };

    const handleResetPin = (e) => {
        if (checkConfirmResetPin() === false) {
            setIsValid(false);
            return;
        }
        setIsValid(true);
        dispatch({ type: 'LOADING' });

        const data = {
            // email: email
            pin : confirmResetPin
        };

        let uuid = uuidV4();
        uuid = uuid.replaceAll("-", "");
        const date = new Date().toISOString();
        axios(address + "auth/reset-pin/" + AuthRedu.dataPinToken + "/", {
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
                setSuccessStatus(true);
                var lastLink = { value: window.location.origin}
                Cookies.set("lastLink", lastLink,{ expires: 1});
                localStorage.clear();
                Cookies.remove("auth");
                // props.DoneLoad();
                // window.location.reload();
            })
            .catch((err) => {
                if (err.response.data !== undefined) {
                    alert(err.response.data.err_message);
                    // setSuccessStatus(true);
                    // props.DoneLoad()
                    dispatch({ type: 'DONELOAD' });
                }
            });

    }

    return (
        <div>
            {
                !isMobile ?
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowConfirmResetPin ? 'block' : 'none'
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
                                    {
                                        !successStatus ?
                                        <div className='menu-name-auth'>
                                            Perbarui PIN Anda 
                                        </div>
                                        :
                                        <div className='menu-name-auth'>
                                            PIN Anda Berhasil Diubah! 
                                        </div>
                                    }

                                    {
                                        !successStatus ?
                                        <div className='mob-menu-category-auth'>
                                            Konfirmasi 6 digit nomor PIN baru Anda
                                        </div>
                                        :
                                        <div className='mob-menu-category-auth'>
                                            Silahkan lakukan login kembali untuk memesan
                                        </div>

                                    }

                                    {
                                        !successStatus ?
                                        <div>
                                            <Form>
                                                <Row>
                                                    <Col xs={11}>
                                                        <PinInput
                                                        length={6}
                                                        focus
                                                        // disabled
                                                        secret
                                                        ref={p => (pin => p)}
                                                        type="number"
                                                        inputMode="numeric"
                                                        onChange={handleConfirmResetPin}
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
                                                <div className="submitButton-auth" onClick={handleResetPin}>
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
                                            
                                        </div>
                                        :
                                        <div>

                                            <div className="blankSpace">

                                            </div>

                                            <div className='buttonSide-auth'>
                                                <p className="linkWords" onClick={backToHome}>KEMBALI KE HOME</p>
                                            </div>
        
                                            <div className='bottomSide-auth'>
                                                <h4 className='countrySide-auth'>Indonesia</h4>
                                                <div className='reqSide-auth'>
                                                    <h4 className='reqSideWord-auth'>Privasi</h4>
                                                    <h4 className='reqSideWord-auth'>Persyaratan</h4>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                :
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowConfirmResetPin ? 'block' : 'none'
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
                                    {
                                        !successStatus ?
                                        <div className='menu-name-auth'>
                                            Perbarui PIN Anda 
                                        </div>
                                        :
                                        <div className='menu-name-auth'>
                                            PIN Anda Berhasil Diubah! 
                                        </div>
                                    }

                                    {
                                        !successStatus ?
                                        <div className='mob-menu-category-auth'>
                                            Konfirmasi 6 digit nomor PIN baru Anda
                                        </div>
                                        :
                                        <div className='mob-menu-category-auth'>
                                            Silahkan lakukan login kembali untuk memesan
                                        </div>

                                    }

                                    {
                                        !successStatus ?
                                        <div>
                                            <Form>
                                                <Row>
                                                    <Col xs={11}>
                                                        <PinInput
                                                        length={6}
                                                        focus
                                                        // disabled
                                                        secret
                                                        ref={p => (pin => p)}
                                                        type="number"
                                                        inputMode="numeric"
                                                        onChange={handleConfirmResetPin}
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
                                                <div className="submitButton-auth" onClick={handleResetPin}>
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
                                            
                                        </div>
                                        :
                                        <div>

                                            <div className='buttonSide-auth top270'>
                                                <p className="linkWords" onClick={backToHome}>KEMBALI KE HOME</p>
                                            </div>
        
                                            <div className='bottomSide-auth'>
                                                <h4 className='countrySide-auth'>Indonesia</h4>
                                                <div className='reqSide-auth'>
                                                    <h4 className='reqSideWord-auth'>Privasi</h4>
                                                    <h4 className='reqSideWord-auth'>Persyaratan</h4>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }
        </div>
    );
}

export default ConfirmResetPinDialog