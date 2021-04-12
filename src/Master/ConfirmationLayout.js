import React from "react";
import ConfirmationView from "../View/Authentication/ConfirmationView";
import queryString from "query-string"

export default class ConfirmationLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    const value = queryString.parse(window.location.search);
    return (
      <ConfirmationView noTable={value} />
    );
  }
}