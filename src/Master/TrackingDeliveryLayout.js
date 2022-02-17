import React from "react";
import TrackingDeliveryView from "../View/Tracking/TrackingDeliveryView";

export default class TrackingDeliveryLayout extends React.Component {
    componentDidMount() {
      document.body.style.backgroundColor = 'white';
    }
  
    render() {
      return (
        <TrackingDeliveryView />
      );
    }
}