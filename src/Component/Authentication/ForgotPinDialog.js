import React, { useState } from "react";
import '../../Asset/scss/AuthenticationDialog.scss'
import closeLogo from '../../Asset/Icon/close.png'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import pikappLogo from '../../Asset/Logo/logo4x.png';
import { Alert, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Swal from 'sweetalert2';
import PikaButton from "../../Component/Button/PikaButton";

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

    const handleSubmit = () => {
        if (checkEmail() === false) {
            setIsValid(false);
            return;
        }

        setIsValid(true);
        dispatch({ type: 'LOADING' });

        const data = {
            email: email
        };

        let uuid = uuidV4();
        uuid = uuid.replaceAll("-", "");
        const date = new Date().toISOString();
        axios(address + "auth/forget-pin", {
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
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    text: 'Link verifikasi telah dikirim ke alamat email Anda. Segera lakukan reset PIN untuk melanjutkan proses ini.',
                    showConfirmButton: true,
                    confirmButtonColor: "#4bb7ac",
                    confirmButtonText: "OK",
                    closeOnConfirm: false,
                    // timer: 3000
                }).then(() => {
                    props.onHideForgotFlow();
                    dispatch({ type: 'DONELOAD' });
                })
                // window.location.reload();
            })
            .catch((err) => {
                if (err.response.data !== undefined) {
                    alert(err.response.data.err_message)
                    // props.DoneLoad()
                    dispatch({ type: 'DONELOAD' });
                }
            });
    }

    return (
        <div>
            {
                !isMobile ?
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
                                <p className="linkWords" onClick={closeModal}>KEMBALI</p>

                                {/* <div className="submitButton-auth">
                                    <div className="wordsButton-auth" onClick={handleSubmit}>
                                        SUBMIT
                                    </div>
                                </div> */}

                                <div className="submitButton-auth">
                                    <PikaButton 
                                        title="SUBMIT" 
                                        buttonStyle="submitButton-auth wordsButton-auth"
                                        handleClick={handleSubmit}
                                        >
                                    </PikaButton>
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
                            
                :
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
                                <p className="linkWords" onClick={closeModal}>KEMBALI</p>

                                {/* <div className="submitButton-auth">
                                    <div className="wordsButton-auth" onClick={handleSubmit}>
                                        SUBMIT
                                    </div>
                                </div> */}

                                <div className="submitButton-auth">
                                    <PikaButton 
                                        title="SUBMIT" 
                                        buttonStyle="submitButton-auth wordsButton-auth"
                                        handleClick={handleSubmit}
                                        >
                                    </PikaButton>
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
            }
        </div>
    );

}

export default ForgotPinDialog