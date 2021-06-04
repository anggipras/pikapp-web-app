import React from "react";
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import Loader from 'react-loader-spinner'
import { Redirect } from "react-router-dom";
import { LoadingButton, DoneLoad } from '../../Redux/Actions'
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import pikappLogo from '../../Asset/Logo/logo4x.png';
import NotifIcon from '../../Asset/Icon/bell.png';
import ProfileIcon from '../../Asset/Icon/avatar.png';
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";

class OrderConfirmationView extends React.Component {
    state = {
        isMobile : false
    }

    componentDidMount() {
        if(window.innerWidth < 700) {
            this.setState({ isMobile : true });
        } else {
            this.setState({ isMobile : false });
        }
    }

    componentDidUpdate() {
        
    }

    render() {
        return (
            <div className='cartLayout'>
                <div className='orderTitle'>
                    <span className='logoCenter'>
                    <img className='LogoPikappOrder' src={pikappLogo} alt='' />
                    </span>

                    <div className='iconOrder'>
                        <Link to={"/profile"}>
                        <div className='profileOrder-sec'>
                            <div className='profileOrder'>
                            <span className='reactProfOrder'>
                                <img className='profileOrder-img' src={ProfileIcon} alt='' />
                            </span>
                            </div>
                        </div>
                        </Link>

                        <Link to={"/status"}>
                        <div className='notifOrder-sec'>
                            <div className='notifOrder'>
                            <span className='reactNotifOrder'>
                                <img className='notifOrder-img' src={NotifIcon} alt='' />
                            </span>
                            </div>
                        </div>
                        </Link>
                    </div>
                </div>

                <div className='modalOrder'>
                    {
                        !this.state.isMobile ?
                        <div className='modal-content-order'>
                            <div className='menu-name-order'>
                                Menunggu Pembayaran 
                            </div>


                            <div className='orderContent'>
                                <div className='order-transaction'>
                                    <div className='order-transaction-header'>
                                        <div className='order-transaction-title'>
                                            ID Transaksi
                                        </div>
                                    </div>

                                    <div className='order-transaction-content'>
                                        <div className='order-transaction-descArea'>
                                            <h3 className='order-transaction-words'>
                                                83482348
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='orderContent'>
                                <div className='order-payment'>
                                    <div className='order-transaction-header'>
                                        <div className='order-transaction-title'>
                                            Total Pembayaran
                                        </div>
                                    </div>

                                    <div className='order-transaction-content'>
                                        <div className='order-transaction-descArea'>
                                            <h3 className='order-transaction-words'>
                                                60000
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='orderContent'>
                                <div className='order-payment'>
                                    <div className='order-transaction-header'>
                                        <div className='order-transaction-title'>
                                            Metode Pembayaran
                                        </div>
                                    </div>

                                    <div className='order-transaction-content'>
                                        <div className='order-transaction-descArea'>
                                            <span>
                                                <img className='order-transaction-logo' src={OvoPayment} alt='' />
                                            </span>

                                            <h3 className='order-transaction-words'>
                                                OVO
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='orderContent'>
                                <div className='buttonPayment-order'>
                                    <div className="submitPayment-order">
                                        <div className="wordsButton-order">
                                            CARA PEMBAYARAN
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='orderContent'>
                                <div className='buttonSide-order'>
                                    <p className="linkWords-order">KEMBALI KE HOME</p>
                                    <div className="submitButton-order">
                                        <div className="wordsButton-order">
                                            LIHAT PESANAN
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='modal-content-order-mob'>
                            <div className='menu-name-order'>
                                Menunggu Pembayaran 
                            </div>

                            <div className='orderContent'>
                                <div className='order-transaction'>
                                    <div className='order-transaction-header'>
                                        <div className='order-transaction-title'>
                                            ID Transaksi
                                        </div>
                                    </div>

                                    <div className='order-transaction-content'>
                                        <div className='order-transaction-descArea'>
                                            <h3 className='order-transaction-words'>
                                                83482348
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='orderContent'>
                                <div className='order-payment'>
                                    <div className='order-transaction-header'>
                                        <div className='order-transaction-title'>
                                            Total Pembayaran
                                        </div>
                                    </div>

                                    <div className='order-transaction-content'>
                                        <div className='order-transaction-descArea'>
                                            <h3 className='order-transaction-words'>
                                                60000
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='orderContent'>
                                <div className='order-payment'>
                                    <div className='order-transaction-header'>
                                        <div className='order-transaction-title'>
                                            Metode Pembayaran
                                        </div>
                                    </div>

                                    <div className='order-transaction-content'>
                                        <div className='order-transaction-descArea'>
                                            <span>
                                                <img className='order-transaction-logo' src={OvoPayment} alt='' />
                                            </span>

                                            <h3 className='order-transaction-words'>
                                                OVO
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='orderContent'>
                                <div className='buttonPayment-order'>
                                    <div className="submitPayment-order">
                                        <div className="wordsButton-order">
                                            CARA PEMBAYARAN
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='orderContent'>
                                <div className='buttonSide-order'>
                                    <p className="linkWords-order">KEMBALI KE HOME</p>
                                    <div className="submitButton-order">
                                        <div className="wordsButton-order">
                                            LIHAT PESANAN
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
        );
    }
}
const Mapstatetoprops = (state) => {
    return {
      AllRedu: state.AllRedu,
      AuthRedu: state.AuthRedu
    }
  }
  
  export default connect(Mapstatetoprops, { LoadingButton, DoneLoad })(OrderConfirmationView)