import React from "react";
import Button from "react-bootstrap/Button";
import Loader from 'react-loader'

var options = {
  lines: 13,
  length: 20,
  width: 10,
  radius: 30,
  scale: 0.25,
  corners: 1,
  color: '#000',
  opacity: 0.25,
  rotate: 0,
  direction: 1,
  speed: 1,
  trail: 60,
  fps: 20,
  shadow: false,
  hwaccel: false,
};

export class PikaButton extends React.Component {
  render() {
    return (
      <Button disabled={!this.props.loadButton} variant={this.props.buttonStyle} onClick={this.props.handleClick}>
        {
          !this.props.loadButton?
          <Loader loaded={this.props.loadButton} options={options} className="spinner"/>
          :
          this.props.title
        }
      </Button>
    );
  }
}
