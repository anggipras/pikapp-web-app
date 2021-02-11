import React from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import { PikaTextField } from "../../Component/TextField/PikaTextField";
import axios from "axios";
import { address, clientId, googleKey } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export class FormView extends React.Component {
  state = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isValid: true,
    isCaptcha: false,
    captchaCounter: 0,
    errorMsg: "",
    lat: "",
    lon: "",
  };

  getUserLocation = () => {
    axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${googleKey}`)
    .then((res)=> {
      let latitude = res.data.location.lat
      let longitude = res.data.location.lng
      let longlat = {lat: latitude, lon: longitude}
      console.log(latitude, longitude);
      this.setState({lat: latitude, lon: longitude})
      localStorage.setItem("longlat", JSON.stringify(longlat))
    })
    .catch((err)=> console.log(err))
  }

  componentDidMount() {
    // this.geoLocation()
    this.getUserLocation()
  }

  handleEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  handleName = (e) => {
    this.setState({ name: e.target.value });
  };

  handlePhone = (e) => {
    this.setState({ phone: e.target.value });
  };

  handleConfirmPassword = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };

  checkEmail = () => {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(this.state.email)) {
      return true;
    } else {
      this.setState({ errorMsg: "Email is not valid." });
      return false;
    }
  };

  checkName = () => {
    if (this.state.name.length > 0) {
      return true;
    } else {
      this.setState({ errorMsg: "Name cannot be empty." });
      return false;
    }
  };

  checkPassword = () => {
    let passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordRegex.test(this.state.password)) {
      this.setState({
        errorMsg:
          "Password must be within 8 to 16 characters and contain at least one uppercase letter and one symbol.",
      });
      return false;
    }
    if (this.state.password.length < 8 || this.state.password.length > 16) {
      this.setState({
        errorMsg:
          "Password must be within 8 to 16 characters and contain at least one uppercase letter and one symbol.",
      });
      return false;
    } else {
      return true;
    }
  };

  checkConfirmPassword = () => {
    if (this.state.password === this.state.confirmPassword) {
      return true;
    } else {
      this.setState({ errorMsg: "Password does not match." });
      return false;
    }
  };

  checkPhone = () => {
    if (this.state.phone.startsWith("08")) {
      return true;
    } else {
      this.setState({ errorMsg: "Phone not valid." });
      return false;
    }
  };

  //show current location start
  showPosition = (position) => {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    let longlat = {lat: latitude, lon: longitude}
    console.log(latitude, longitude);
    this.setState({lat: latitude, lon: longitude})
    localStorage.setItem("longlat", JSON.stringify(longlat))
  }

  geoLocation = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition)
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }
  //show current location end

  handleLogin = (e) => {
    if (this.checkEmail() === false) {
      this.setState({ isValid: false });
      return;
    }
    // if (this.checkPassword() === false) {
    //   this.setState({ isValid: false });
    //   return;
    // }

    this.setState({ isValid: true });
    const data = {
      username: this.state.email,
      password: this.state.password,
      fcm_token: "qaah4zq3cutmr36kqvq95qj5hax8f9ku25fv",
    };
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    axios(address + "auth/login", {
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
        auth.isLogged = true;
        auth.token = res.data.token;
        auth.new_event = res.data.new_event;
        auth.recommendation_status = res.data.recommendation_status;
        auth.email = this.state.email;
        Cookies.set("auth", auth, { expires: 1});
        if(Cookies.get("lastLink") !== undefined) {
          var lastlink = JSON.parse(Cookies.get("lastLink")).value
          if(lastlink.includes("?latitude") || lastlink.includes("store?")) {
            window.location.href = JSON.parse(Cookies.get("lastLink")).value
          } else {
            window.location.href = JSON.parse(Cookies.get("lastLink")).value + `?latitude=${this.state.lat}&longitude=${this.state.lon}`
          }
        }
        alert("Login berhasil.")
      })
      .catch((err) => {
        if(err.response.data !== undefined) {
          alert(err.response.data.err_message)
        }
        this.setState({ captchaCounter: this.state.captchaCounter + 1 });
      });
  };

  handleRegister = (e) => {
    if (this.checkEmail() === false) {
      this.setState({ isValid: false });
      return;
    }
    if (this.checkName() === false) {
      this.setState({ isValid: false });
      return;
    }
    if (this.checkPhone() === false) {
      this.setState({ isValid: false });
      return;
    }
    if (this.checkPassword() === false) {
      this.setState({ isValid: false });
      return;
    }
    if (this.checkConfirmPassword() === false) {
      this.setState({ isValid: false });
      return;
    }

    this.setState({ isValid: true });
    const data = {
      full_name: this.state.name,
      password: this.state.password,
      phone_number: this.state.phone,
      email: this.state.email,
      gender: "MALE",
      birth_day: "01011970",
      token: "qaah4zq3cutmr36kqvq95qj5hax8f9ku25fv",
    };

    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    axios(address + "auth/register", {
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
        alert("Register berhasil.")
        this.handleLogin()
      })
      .catch((err) => {
        if(err.response.data !== undefined) {
          alert(err.response.data.err_message)
        }
        this.setState({ captchaCounter: this.state.captchaCounter + 1 });
      });
  };

  onChange(value) {
    console.log(value);
  }

  render() {
    const isLogIn = this.props.isLogIn;
    let form;
    if (isLogIn) {
      form = (
        <Form>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <PikaTextField
                label="Email Anda"
                type="email"
                placeholder="abc@email.com"
                handleChange={this.handleEmail}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <PikaTextField
                label="Password Anda"
                type="password"
                placeholder="*******"
                handleChange={this.handlePassword}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              {this.state.isValid || (
                <Alert variant="danger">{this.state.errorMsg}</Alert>
              )}
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={4}>
              <PikaButton
                title="Login"
                buttonStyle="secondaryPika"
                handleClick={this.handleLogin}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <p>
                Belum punya akun?
                <Link to="/register">register sekarang</Link>
              </p>
            </Col>
            <Col />
          </Row>
        </Form>
      );
    } else {
      form = (
        <Form>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <PikaTextField
                label="Daftarkan Email"
                type="email"
                placeholder="abc@email.com"
                handleChange={this.handleEmail}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <PikaTextField
                label="Nama Lengkap"
                type="text"
                placeholder="Masukkan Namamu.."
                handleChange={this.handleName}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <PikaTextField
                label="Nomor HP"
                type="tel"
                placeholder="08000000"
                handleChange={this.handlePhone}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <PikaTextField
                label="Password"
                type="password"
                placeholder="*******"
                handleChange={this.handlePassword}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <PikaTextField
                label="Confirm Password"
                type="password"
                placeholder="*******"
                handleChange={this.handleConfirmPassword}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              {!this.state.isCaptcha || (
                <ReCAPTCHA sitekey="asd" onChange={this.onChange} />
              )}
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              {this.state.isValid || (
                <Alert variant="danger">{this.state.errorMsg}</Alert>
              )}
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={4}>
              <PikaButton
                title="Daftar"
                buttonStyle="primaryPika"
                handleClick={this.handleRegister}
              />
            </Col>
            <Col />
          </Row>
          <Row>
            <Col xs={1} md={4} />
            <Col xs={6}>
              <p>
                Sudah punya akun?
                <Link to="/login">login sekarang</Link>
              </p>
            </Col>
            <Col />
          </Row>
        </Form>
      );
    }
    return <div>{form}</div>;
  }
}
