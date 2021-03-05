import React from "react";
import Form from "react-bootstrap/Form";
import {connect} from 'react-redux'

class PikaTextField extends React.Component {
  render() {
    return (
      <Form>
        <Form.Label>{this.props.label}</Form.Label>
        <Form.Control
          type={this.props.type}
          placeholder={this.props.placeholder}
          onChange={this.props.handleChange}
          disabled={!this.props.theLoading.buttonLoad}
        />
      </Form>
    );
  }
}

const Mapstatetoprops = (state) => {
  return {
    theLoading: state.AllRedu
  }
}

export default connect(Mapstatetoprops)(PikaTextField)
