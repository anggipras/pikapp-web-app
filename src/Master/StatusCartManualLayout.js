import React from "react";
import StatusCartManualView from "../View/Status/StatusCartManualView";

export default class StatusCartManualLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    return (
      <StatusCartManualView />
    );
  }
}
