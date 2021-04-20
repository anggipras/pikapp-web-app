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
            // email : email,
            // currentPin : resetPin
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
                            <div className='menuContain-left-auth'>
                                <div className='menuBanner-auth'>
                                    <img src={pikappLogo} className='menuimg-auth' alt='' />
                                </div>

                                <div className='menu-detail-auth'>
                                    <div className='menu-name-auth'>
                                        Perbarui PIN Anda 
                                    </div>

                                    <div className='mob-menu-category-auth'>
                                        Ketik 6 digit nomor PIN baru Anda
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
                                                        onComplete={handleResetPin}
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
                                                        {/* <div onClick={closeModal}>KEMBALI</div> */}
                                                    </p>
                                                    </Col>
                                                    <Col />

                                                    <Col xs={4}>
                                                    <PikaButton
                                                        title="NEXT"
                                                        buttonStyle="greenPika"
                                                        handleClick={openConfirmPinDialog}
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
            {showConfirmPinDialog()}
        </div>
    );
}

export default ResetPinDialog