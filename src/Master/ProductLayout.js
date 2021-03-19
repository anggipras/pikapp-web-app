import React from "react";
import ProductView from "../View/Product/ProductView";

export default class MainLayout extends React.Component {

  render() {
    return (
        <div className='mainLayout'>
            <ProductView />
        </div>
    );
  }
}
