import React, { useState } from "react";
import '../../../Asset/scss/AuthenticationDialog.scss';
import closeLogo from '../../../Asset/Icon/close.png';
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import PinInput from "react-pin-input";
import pikappLogo from '../../../Asset/Logo/logo4x.png';
import { Alert, Col, Form, Row } from "react-bootstrap";
import PikaButton from "../../Button/PikaButton";
import ConfirmResetPinDialog from "../ResetPin/ConfirmResetPinDialog";

const ResetPinDialog = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const AuthRedu = useSelector(state => state.AuthRedu);
    const [confirmResetPinDialog, setConfirmResetPin] = useState(false);
    const [resetPin, setResetPin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isCaptcha, setIsCaptcha] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isMobile = useMediaQuery({ maxWidth: 768 })

    const closeModal = (e) => {
        e.stopPropagation()
        dispatch({ type: 'DEFAULTSTATE' })
        props.onHideResetPin()
    }

    const backModal = (e) => {
        if (AllRedu.openMenuCart) {
            // setmenuSelect(false)
            e.stopPropagation()
            dispatch({ type: 'DEFAULTSTATE' })
            props.onHideResetPin()
        } else {
            // setmenuSelect(false)
            dispatch({ type: 'DEFAULTSTATE' })
        }
    }

    const handleResetPin = (e) => {
        setResetPin(e);
    }

    const checkResetPin = () => {
        if (resetPin.length < 6) {
          setErrorMsg("PIN must be within 6 digit numeric.");
          return false;
        } else {
          return true;
        }
    };

    const openConfirmPinDialog = (e) => {
        if (checkResetPin() === false) {
            setIsValid(false);
            return;
        }

        setIsValid(true);

        const data = {
            currentPin : resetPin
        };

        dispatch({ type: 'RESETPIN', payload: data });

        setConfirmResetPin(true);
    }

    const showConfirmPinDialog = () => {
        if(confirmResetPinDialog) {
            return (
                <ConfirmResetPinDialog 
                    isShowConfirmResetPin={confirmResetPinDialog}
                    onHideConfirmResetPin={() =>setConfirmResetPin(false)}
                />
            )
        }
    }

    return (
        <div>
            {
                !isMobile ?
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowResetPin ? 'block' : 'none'
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
                                        Perbarui PIN Anda 
                                    </div>

                                    <div className='mob-menu-category-auth'>
                                        Ketik 6 digit nomor PIN baru Anda
                                    </div>

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
                                                    onChange={handleResetPin}
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
                                            <p className="linkWords colorWhite">KEMBALI</p>
                                            <div className="submitButton-auth" onClick={openConfirmPinDialog}>
                                                <div className="wordsButton-auth txtLine">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className='modalMenuDetail-auth' style={{
                    display: props.isShowResetPin ? 'block' : 'none'
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
                                        Perbarui PIN Anda 
                                    </div>

                                    <div className='mob-menu-category-auth'>
                                        Ketik 6 digit nomor PIN baru Anda
                                    </div>

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
                                                    onChange={handleResetPin}
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
                                            <p className="linkWords colorWhite">KEMBALI</p>
                                            <div className="submitButton-auth" onClick={openConfirmPinDialog}>
                                                <div className="wordsButton-auth txtLine">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {showConfirmPinDialog()}
        </div>
    );
}

export default ResetPinDialog