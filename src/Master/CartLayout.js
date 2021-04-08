import React from "react";
import CartView from "../View/Cart/CartView";
import queryString from "query-string"

export default class CartLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = 'white';
  }

  render() {
    // const value = queryString.parse(window.location.search);
    let valueTable
    if (localStorage.getItem('table')) {
      valueTable = localStorage.getItem('table')
    }
    return (
      <CartView noTable={valueTable} />
    );
  }
}
