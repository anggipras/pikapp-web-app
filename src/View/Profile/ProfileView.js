import React from "react";
import { Col, Row } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import axios from "axios";
import { address, clientId, jwtSecret } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Cookies from "js-cookie";
import {secret} from "../../Asset/Constant/APIConstant"
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import jwt from "jsonwebtoken"

export class ProfileView extends React.Component {
  state = {
      name: "Name",
      phone: "080808",
      email: ""
  };

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
    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
    axios(address + "home/v1/customer-info", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "x-signature": signature,
        "token": auth.token,
      },
      method: "GET",
    })
      .then((res) => {
        let data = res.data.results
        this.setState({name: data.full_name})
        this.setState({phone: data.phone_no})
        this.setState({email: data.email})
        console.log(res.data.results)
      })
      .catch((err) => {
        alert(err.response.data.err_message)
      });
  }

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
      console.log(auth.token)

      try {
        var decodedJWT = jwt.verify(auth.token, jwtSecret)
        var sub = JSON.parse(decodedJWT.sub)

        let uuid = uuidV4();
        const date = new Date().toISOString();
        uuid = uuid.replaceAll("-", "");
        let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
        Axios(address + "/auth/exit", {
          headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
            "x-signature": signature,
            "x-session-id": sub.session_id,
          },
          method: "GET",
        })
        .then((res) => {
            alert("Logout berhasil.")
            Cookies.remove("auth")
            auth = null;
            window.location.href = "/login"
        })
        .catch((err) => {
            alert(err.response.data.err_message)
        });
      } catch(err) {
        alert(err.message)
      }
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
