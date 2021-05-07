import React from "react";
import { Col, Row, Modal, Button } from "react-bootstrap";
import PikaButton from "../../Component/Button/PikaButton";
import axios from "axios";
import { address, clientId, jwtSecret } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Cookies from "js-cookie";
import {secret} from "../../Asset/Constant/APIConstant"
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import jwt from "jsonwebtoken"
import {connect} from 'react-redux'
import {LoadingButton, DoneLoad} from '../../Redux/Actions'
import RegisterDialog from '../../Component/Authentication/RegisterDialog';
import NotifModal from '../../Component/Modal/NotifModal';

class ProfileView extends React.Component {
  state = {
      showModal: false,
      showRegisterDialog : false,
      isLogin : false,
      name: "Name",
      phone: "080808",
      email: "",
      successMessage: '',
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
      this.setState({ isLogin: auth.isLogged });
    }
    if(auth.isLogged === false) {
      var lastLink = { value: window.location.href}
      Cookies.set("lastLink", lastLink,{ expires: 1})
      this.setRegisterDialog(true);
      // window.location.href = "/login"
    } else {
      this.getCustomerInfo();
    }
    console.log(auth)
  }

  componentDidUpdate() {
    if(this.state.isLogin === false) {
      var auth = {
        isLogged: false,
        token: "",
        new_event: true,
        recommendation_status: false,
        email: "",
      };
      if(Cookies.get("auth") !== undefined) {
        auth = JSON.parse(Cookies.get("auth"))
        this.getCustomerInfo();
        this.setState({ isLogin: auth.isLogged });
      }
    }
  }

  getCustomerInfo() {
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
      })
      .catch((err) => {
      });
  }

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }

  handleLogout() {
    this.props.LoadingButton()
    this.setState({loadButton: false})
    this.setModal(false);

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
        // window.location.href = "/login"
      }
      try {
        var decodedJWT = jwt.verify(auth.token, Buffer.from(jwtSecret,'base64')
        )
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
          this.setState({ successMessage: 'Logout Berhasil.' })
          setTimeout(() => {
            var lastLink = { value: window.location.origin}
            Cookies.set("lastLink", lastLink,{ expires: 1})
            localStorage.clear()
            Cookies.remove("auth")
            auth = null;
            this.props.DoneLoad()
            window.location.href = "/"
          }, 1000);
        })
        .catch((err) => {
          if(err.response.data !== undefined) {
            alert(err.response.data.err_message)
          }
        });
      } catch(err) {
        alert(err.message)
      }
  }

  setRegisterDialog(isShow) {
    this.setState({ showRegisterDialog: isShow })
    document.body.style.overflowY = ''
  }

  showRegisterDialog = () => {
    if (this.state.showRegisterDialog === true) {
      return (
        <RegisterDialog
            isShowRegister={this.state.showRegisterDialog}
            onHideRegister={() => this.setRegisterDialog(false)}
        />
      )
    }
  }

  showNotifModal = () => {
    if (this.props.AllRedu.buttonLoad === false) {
      return <NotifModal isShowNotif={this.props.AllRedu.buttonLoad} responseMessage={this.state.successMessage} />
    }
  }

  render() {
    var modal;
    if(this.state.showModal === true) {
      modal =             
      <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show= {() => this.setModal(true)}
      onHide={() => this.setModal(false)}
      >
    <Modal.Header closeButton>
      <Modal.Title>Anda yakin ingin keluar?</Modal.Title>
    </Modal.Header>
    <Modal.Footer> 
      <Button variant = "pikaAlt" onClick={() => this.setModal(false)}>Tidak</Button>
      <Button variant = "pika" onClick={() => this.handleLogout()}>Iya</Button>
    </Modal.Footer>
    </Modal>
    } else {
      modal = <></>
    }
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
                        handleClick={() => this.setModal(true)}
                    />
                </Col>
                <Col xs={3} md={4}/>
            </Row>
            {modal}
            {this.showRegisterDialog()}
            {this.showNotifModal()}
        </>
    )
  }
}

const Mapstatetoprops = (state) => {
  return {
    theLoading: state.AllRedu,
    AllRedu: state.AllRedu
  }
}

export default connect(Mapstatetoprops,{LoadingButton, DoneLoad})(ProfileView)