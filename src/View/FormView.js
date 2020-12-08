import React from "react"
import { Alert, Col, Form, Row } from "react-bootstrap"
import { PikaButton } from "../Component/Button/PikaButton";
import { PikaTextField } from "../Component/TextField/PikaTextField";
import axios from 'axios';
import {address} from "../Asset/Constant/APIConstant";
import {v4 as uuidV4} from 'uuid';
import sha256 from 'crypto-js/hmac-sha256';
import ReCAPTCHA from 'react-google-recaptcha';

export class FormView extends React.Component {
    state = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isValid: true,
        isCaptcha: false,
        errorMsg: ""
    };

    handleEmail = (e) => {
        this.setState({email: e.target.value});
    }

    handlePassword = (e) => {
        this.setState({password: e.target.value});
    }
    
    handleName = (e) => {
        this.setState({name: e.target.value})
    }

    handlePhone = (e) => {
        this.setState({phone: e.target.value})
    }

    handleConfirmPassword = (e) => {
        this.setState({confirmPassword: e.target.value})
    }

    checkEmail = () => {
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (emailRegex.test(this.state.email)) {
            return (true);
        } else {
            this.setState({errorMsg: "Email is not valid."})
            return (false);
        }
    }

    checkName = () => {
        if(this.state.name.length > 0) {
            return (true);
        } else {
            this.setState({errorMsg: "Name cannot be empty."})
            return (false);
        }
    }

    checkPassword = () => {
        let passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/
        if(!passwordRegex.test(this.state.password)) {
            this.setState({errorMsg: "Password must be within 8 to 16 characters and contain at least one uppercase letter and one symbol."})
            return (false);
        }  
        if (this.state.password.length < 8 || this.state.password.length > 16) {
            this.setState({errorMsg: "Password must be within 8 to 16 characters and contain at least one uppercase letter and one symbol."})
            return (false);
        } else {
            return (true);
        }
    }

    checkConfirmPassword = () => {
        if(this.state.password === this.state.confirmPassword) {
            return (true);
        } else {
            this.setState({errorMsg: "Password does not match."})
            return (false);
        }
    }

    checkPhone = () => {
        if (this.state.phone.startsWith("08")) {
            return (true);
        } else {
            this.setState({errorMsg: "Phone not valid."})
            return (false);
        }
    }

    handleLogin = (e) => {
        if(this.checkEmail() === false) {
            this.setState({isValid: false})
            return;
        }
        if (this.checkPassword() === false) {
            this.setState({isValid: false})
            return;
        }

        this.setState({isValid: true})
        const data = {
            username: this.name,
            password: this.password,
            fcm_token: "FCM Token"
        }

        let uuid = uuidV4();
        uuid = uuid.replaceAll('-',"")
        const date = new Date().toISOString()
        axios(address + '/auth/login', {
            headers: {
                'Content-Type': "application/json",
                'x-request-id': uuid,
                'x-request-timestamp': date,
                'x-client-id': "abf0e2a9-e9ee-440f-8563-94481c64b797"
            },
            method: 'POST',
            data: data
        }).then((res) => {
            console.log(res)
        })    
    }

    handleRegister = (e) => {
        if(this.checkEmail() === false) {
            this.setState({isValid: false})
            return;
        }
        if(this.checkName() === false) {
            this.setState({isValid: false})
            return;
        }
        if(this.checkPhone() === false) {
            this.setState({isValid: false})
            return;
        }
        if(this.checkPassword() === false) {
            this.setState({isValid: false})
            return;
        }
        if(this.checkConfirmPassword() === false) {
            this.setState({isValid: false})
            return;
        }

        this.setState({isValid: true})
        const data = {
            full_name: this.name,
            password: this.password,
            phone_number: this.phone,
            email: this.email,
            gender: "Male",
            birth_day: "01011970",
            token: "FCM Token"
        }

        let uuid = uuidV4();
        uuid = uuid.replaceAll('-',"")
        const date = new Date().toISOString()
        axios(address + '/auth/register', {
            headers: {
                'Content-Type': "application/json",
                'x-request-id': uuid,
                'x-request-timestamp': date,
                'x-client-id': "abf0e2a9-e9ee-440f-8563-94481c64b797"
            },
            method: 'POST',
            data: data
        }).then((res) => {
            console.log(res)
        })
    }

    onChange(value) {
        console.log(value)
    }   

    render() {
        const isLogIn = this.props.isLogIn;
        let form;
        if (isLogIn) {
            form = 
        <Form>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaTextField label= 'Email Anda' type= 'email' placeholder= 'abc@email.com' handleChange = {this.handleEmail} />
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaTextField label= 'Password Anda' type= 'password' placeholder= '*******' handleChange = {this.handlePassword}/>
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    {this.state.isValid || (
                        <Alert variant = "danger">{this.state.errorMsg}</Alert>
                    )}
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaButton title='Login' style='primaryPika' handleClick = {this.handleLogin}/>
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <p>
                        Belum punya akun?  
                        <a href='/register'> register sekarang</a>
                    </p>
                </Col>
                <Col/>
            </Row>
        </Form>
        } else {
            form = 
        <Form>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaTextField label= 'Daftarkan Email' type= 'email' placeholder= 'abc@email.com' handleChange = {this.handleEmail}/>
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaTextField label= 'Nama Lengkap' type= 'text' placeholder= 'Masukkan Namamu..' handleChange = {this.handleName}/>
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaTextField label= 'Nomor HP' type= 'tel' placeholder= '08000000' handleChange = {this.handlePhone}/>
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaTextField label= 'Password' type= 'password' placeholder= '*******' handleChange = {this.handlePassword}/>
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaTextField label= 'Confirm Password' type= 'password' placeholder= '*******' handleChange = {this.handleConfirmPassword}/>
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    {!this.state.isCaptcha || (
                        <ReCAPTCHA sitekey= 'asd' onChange={this.onChange}/>
                    )}
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    {this.state.isValid || (
                        <Alert variant = "danger">{this.state.errorMsg}</Alert>
                    )}
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaButton title='Daftar' style='primaryPika' handleClick = {this.handleRegister}/>
                </Col>
                <Col/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <p>
                        Sudah punya akun?  
                        <a href='/login'> login sekarang</a>
                    </p>
                </Col>
                <Col/>
            </Row>
        </Form>
        }
        return (
            <div>
                {form}
            </div>
        );
    }
}