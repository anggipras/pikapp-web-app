import React, { useState } from "react";
import '../../../Asset/scss/AuthenticationDialog.scss';
import closeLogo from '../../../Asset/Icon/close.png';
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import PinInput from "react-pin-input";
import pikappLogo from '../../../Asset/Logo/logo4x.png';
import { Alert, Col, Form, Row } from "react-bootstrap";
import PikaButton from "../../Button/PikaButton";

const ConfirmResetPinDialog = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const AuthRedu = useSelector(state => state.AuthRedu);
    const [confirmResetPin, setConfirmResetPin] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isCaptcha, setIsCaptcha] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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


    }

    return (
        <div>
            {
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
                            <div className='menuContain-left-auth'>
                                <div className='menuBanner-auth'>
                                    <img src={pikappLogo} className='menuimg-auth' alt='' />
                                </div>

                                <div className='menu-detail-auth'>
                                    <div className='menu-name-auth'>
                                        Perbarui PIN Anda 
                                    </div>

                                    <div className='mob-menu-category-auth'>
                                        Konfirmasi 6 digit nomor PIN baru Anda
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
                                                        onComplete={handleConfirmResetPin}
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
                                                    <Col xs={5}>
                                                    <p className="linkWords">
                                                        <div onClick={closeModal}>KEMBALI</div>
                                                    </p>
                                                    </Col>
                                                    <Col />

                                                    <Col xs={4}>
                                                    <PikaButton
                                                        title="NEXT"
                                                        buttonStyle="greenPika"
                                                        handleClick={handleResetPin}
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
        </div>
    );
}

export default ConfirmResetPinDialog