import React from "react";
import ProductView from "../View/Product/ProductView";

export default class MainLayout extends React.Component {

  render() {
    return (
      // <div className='product-table'>
      //   <div>
      //   </div>
      //   <div className='mainLayout'>
      //     <ProductView />
      //   </div>
      //   <div>
      //   </div>
      // </div>
        <div className='mainLayout'>
          <ProductView />
        </div>
    );
  }
}
