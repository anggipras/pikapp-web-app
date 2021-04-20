import React from "react";
import ResetPinView from "../View/ResetPin/ResetPinView";
import queryString from "query-string"

export default class ResetPinLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    const value = queryString.parse(window.location.search);
    return (
      <ResetPinView noTable={value} />
    );
  }
}