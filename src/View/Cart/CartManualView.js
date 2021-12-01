import React from "react";
import { connect } from "react-redux";
import { EditMenuCart, IsMerchantQR, DataOrder } from '../../Redux/Actions';
import { LoadingButton, DoneLoad } from '../../Redux/Actions';

var currentExt = {
  detailCategory: [
    {
      name: "",
      amount: 0,
    },
  ],
  note: "",
  foodCategory: '',
  listcheckbox: [],
  listradio: []
};

var currentTotal = 0

var finalProduct = [
  {
    totalPrice: 20000,
    discountPrice: 0,
  },
]

var phoneNumber = ''

class CartManualView extends React.Component {
    state = {
        changeUI: true,
        showModal: false,
        currentModalTitle: "",
        paymentOption: "Pembayaran Di Kasir",
        paymentType: "PAY_BY_CASHIER",
        biz_type: this.props.noTable !== undefined ? this.props.noTable > 0 ? "DINE_IN" : "TAKE_AWAY" : "DINE_IN",
        eat_type: this.props.noTable !== undefined ? this.props.noTable > 0 ? "Makan Di Tempat" : "Bungkus / Takeaway" : "Makan Di Tempat",
        indexOptionEat: this.props.noTable !== undefined ? this.props.noTable > 0 ? 0 : 1 : 0,
        indexOptionPay: 0,
        currentModal: [
          {
            image: "",
            option: "",
          },
        ],
        loadButton: false,
        showMenuDet: false,
        filteredCart: [],
        currentData: {},
        themid: '',
        indexEdit: 0,
        updateData: '',
        successMessage: '',
        // isEmailVerified : false,
        isShowCounterTime : false,
        countHit : 0,
        counterTime : 120,
        startTour : false,
        steptour:[
          {
            selector: '.cart-foodService',
            content : () => (
              <div>
                <h4>Mau makan dimana?</h4>
                <br />
                <span>Kamu bisa ubah pilihan makan kamu antara Makan di Tempat atau Takeaway</span>
              </div>
            ),
          },
          {
            selector: '.cart-paymentService',
            content : () => (
              <div>
                <h4>Bayar pakai apa?</h4>
                <br />
                <span>Kami menyediakan 2 tipe pembayaran, secara OVO ataupun bayar di kasir</span>
              </div>
            )
          },
          {
            selector: '.cart-OrderButton-mob',
            content : () => (
              <div>
                <h4>Sudah siap makan?</h4>
                <br />
                <span>Silakan tekan tombol Order untuk melakukan pembayaran (psstt, untuk pembayaran di kasir, jangan lupa ke kasir ya!)</span>
              </div>
            )
          },
          {
            selector: '.cart-OrderButton-mob',
            content : () => (
              <div>
                <h4>Sudah siap makan?</h4>
                <br />
                <span>Silakan tekan tombol Order untuk melakukan pembayaran (psstt, untuk pembayaran di kasir, jangan lupa ke kasir ya!)</span>
              </div>
            )
          }
        ],
    };
    componentDidMount() {
        if(window.innerWidth < 700) {
            this.state.steptour.splice(2,1);
        } else {
            this.state.steptour.pop();
        }

        if (localStorage.getItem("cartTour") == 1) {
            this.setState({ startTour : true});
        } else if ((localStorage.getItem('cartMerchant') == 1) && (this.props.AuthRedu.isMerchantQR === true)) {
            this.setState({ startTour : true});
        }   
    }
    render() {
        return (
            <div className='cartLayout-mob'>
            <div className='cart-checkoutArea-mob'>

                <div className='cart-TotalAmount-mob' onClick={() => this.handleDetail("payment-detail")}>
                <h3 className='cart-TotalAmount-title-mob'>Total Bayar</h3>

                <div className='cart-TotalAmount-bottom-mob'>
                    <h2 className='cart-TotalAmount-price-mob'>Rp.</h2>

                    <span className='cart-TotalAmount-detailArrowCenter-mob'>
                    {/* <img className='cart-TotalAmount-detailArrow-mob' src={} alt='' /> */}
                    </span>
                </div>
                </div>

                <div className='cart-OrderButton-mob buttonorder' >
                <div className='cart-OrderButton-content-mob'>
                    <span className='cart-OrderButton-Frame-mob'>
                    {/* <img className='cart-OrderButton-checklist-mob' src={checklistLogo} alt='' /> */}
                    </span>

                    <h1 className='cart-OrderButton-word-mob'>PESAN</h1>
                </div>

                <span className='cart-OrderButton-orderArrowCenter-mob'>
                    {/* <img className='cart-OrderButton-orderArrow-mob' src={ArrowRightWhite} alt='' /> */}
                </span>
                </div>
            </div>
            </div>
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