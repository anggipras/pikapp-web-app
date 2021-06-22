import React from "react";
import { StatusView } from "../View/Status/StatusView";

export default class StatusLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    return (
      <StatusView />
    );
  }
}
