import React from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import { PikaTextField } from "../../Component/TextField/PikaTextField";
import axios from "axios";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import {secret} from "../../Asset/Constant/APIConstant"
import { SHA256 } from "crypto-js";
import Axios from "axios";

export class ProfileView extends React.Component {
  state = {
      name: "Name",
      phone: "080808",
      email: ""
  };

  handleLogout() {
    var auth = {
        isLogged: false,
        token: "",
        new_event: true,
        recommendation_status: false,
        email: "",
      };
      if(Cookies.get("auth") !== undefined) {
        auth = JSON.parse(Cookies.get("auth"))
      }
      if(auth.isLogged === false) {
        var lastLink = { value: window.location.href}
        Cookies.set("lastLink", lastLink,{ expires: 1})
        window.location.href = "/login"
      }
    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replaceAll("-", "");
    let signature = SHA256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
    Axios(address + "/auth/exit", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "x-signature": signature,
        "x-session-id": auth.token,
      },
      method: "GET",
    })
    .then((res) => {
        alert("Logout berhasil.")
        Cookies.remove("auth")
        auth = null;
        this.forceUpdate();
    })
    .catch((err) => {
        alert(err.response.data.err_message)
    });
  }

  componentDidMount() {
    var auth = {
        isLogged: false,
        token: "",
        new_event: true,
        recommendation_status: false,
        email: "",
      };
      if(Cookies.get("auth") !== undefined) {
        auth = JSON.parse(Cookies.get("auth"))
      }
      if(auth.isLogged === false) {
        var lastLink = { value: window.location.href}
        Cookies.set("lastLink", lastLink,{ expires: 1})
        window.location.href = "/login"
      }
      this.setState({email: auth.email})
  }
  render() {
    return (
        <>
            <Row>
                <Col xs={0} md={4}/>
                <Col xs={4} md={2}>
                    <span class="profileLabel">Nama</span>
                </Col>
                <Col>
                    <span class="profileLabel">: </span>
                    <span class="profileContent">{this.state.name}</span>
                </Col>
            </Row>
            <Row>
                <Col xs={0} md={4}/>
                <Col xs={4} md={2}>
                    <span class="profileLabel">Telefon</span>
                </Col>
                <Col>
                    <span class="profileLabel">: </span>
                    <span class="profileContent">{this.state.phone}</span>
                </Col>
            </Row>
            <Row>
                <Col xs={0} md={4}/>
                <Col xs={4} md={2}>
                    <span class="profileLabel">Email</span>
                </Col>
                <Col>
                    <span class="profileLabel">: </span>
                    <span class="profileContent">{this.state.email}</span>
                </Col>
            </Row>
            <Row>
                <Col xs={0} md={4}/>
                <Col>
                    <PikaButton
                        title="Logout"
                        buttonStyle="primaryPika"
                        handleClick={() => this.handleLogout()}
                    />
                </Col>
                <Col xs={3} md={4}/>
            </Row>
        </>
    )
  }
}
