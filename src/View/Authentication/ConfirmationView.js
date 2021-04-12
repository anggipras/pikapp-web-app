import React from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import PikaButton from "../../Component/Button/PikaButton";
import PikaTextField from "../../Component/TextField/PikaTextField";
import axios from "axios";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
// import {geolocated} from 'react-geolocated'
import {connect} from 'react-redux'
import {LoadingButton, DoneLoad} from '../../Redux/Actions'
import PinInput from "react-pin-input";
import "../../Asset/scss/AuthenticationLayout.scss";
import Paper from '@material-ui/core/Paper';

class ConfirmationView extends React.Component {
    state = {
        value: ""
    };
    
    onChange = value => {
        this.setState({ value });
    };

    onClear = () => {
        this.setState({
        value: ""
    });
        this.pin.clear();
    };

    render() { 
        const { value } = this.state;
        return (
            <Paper className={"paperView"}>
                {/* <div className={"menu-title"}>Enter PIN</div> */}
                <div className={"menu-pin"}>
                    <div className={"menu-fill"}> Enter PIN
                        <PinInput
                        length={5}
                        focus
                        // disabled
                        secret
                        ref={p => (this.pin = p)}
                        type="numeric"
                        onChange={this.onChange}
                        />
                        <div>{value}</div>
                        <button onClick={this.onClear}>Clear</button>
                    </div>
                </div>
            </Paper>
        );
      }

}

export default connect(null, {LoadingButton, DoneLoad })(ConfirmationView)