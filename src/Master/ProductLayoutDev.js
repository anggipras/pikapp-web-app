import React from "react";
import MainNavigation from "./MainNavigation";
// import { ProductView } from "../View/Product/ProductView";
import { ProductView } from "../View/Product/ProductViewDev";

export default class MainLayout extends React.Component {

  render() {
    return (
        <div className='mainLayout'>
            <ProductView />
        </div>
    );
  }
}
