import React from "react"
import { Col, Form, Row } from "react-bootstrap"
import { PikaButton } from "../Component/Button/PikaButton";
import { PikaTextField } from "../Component/TextField/PikaTextField";

export class FormView extends React.Component {
    render() {
        const isLogIn = this.props.isLogIn;
        let form;
        if (isLogIn) {
            form = 
        <Form>
            <Row>
                <PikaTextField label= 'Email Anda' type= 'email' placeholder= 'abc@email.com'/>
            </Row>
            <Row>
                <PikaTextField label= 'Password Anda' type= 'password' placeholder= '*******'/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaButton title='Login' style='primaryPika'/>
                </Col>
                <Col/>
            </Row>
        </Form>
        } else {
            form = 
        <Form>
            <Row>
                <PikaTextField label= 'Daftarkan Email' type= 'email' placeholder= 'abc@email.com'/>
            </Row>
            <Row>
                <PikaTextField label= 'Nama Lengkap' type= 'text' placeholder= 'Masukkan Namamu..'/>
            </Row>
            <Row>
                <PikaTextField label= 'Nomor HP' type= 'tel' placeholder= '08000000'/>
            </Row>
            <Row>
                <PikaTextField label= 'Password' type= 'password' placeholder= '*******'/>
            </Row>
            <Row>
                <Col/>
                <Col xs={4}>
                    <PikaButton title='Daftar' style='primaryPika'/>
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