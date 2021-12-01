import React from "react";
import CartManualView from "../View/Cart/CartManualView";
// import queryString from "query-string"

export default class CartManualLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    return (
      <div className='cartmanual-table'>
        <div></div>
        <div className='cartmanual-main'>
          <CartManualView />
        </div>
        <div></div>
      </div>
    );
  }
}