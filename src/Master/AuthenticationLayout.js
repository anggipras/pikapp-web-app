import React from "react";
import AuthenticationView from "../View/Authentication/AuthenticationView";
import queryString from "query-string"

export default class AuthenticationLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    const value = queryString.parse(window.location.search);
    return (
      <AuthenticationView noTable={value} />
    );
  }
}