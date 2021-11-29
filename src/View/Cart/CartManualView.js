import React from "react";
import { connect } from "react-redux";
import { EditMenuCart, IsMerchantQR, DataOrder } from '../../Redux/Actions';
import { LoadingButton, DoneLoad } from '../../Redux/Actions';

class CartManualView extends React.Component {
    state = {
    }
    componentDidMount() {

    }
    render() {
        return (
            <></>
        )
    }
}

const Mapstatetoprops = (state) => {
    return {
      AllRedu: state.AllRedu,
      AuthRedu: state.AuthRedu
    }
  }
  
  export default connect(Mapstatetoprops, { EditMenuCart, LoadingButton, DoneLoad, IsMerchantQR, DataOrder })(CartManualView)