import React from "react";
import ArrowDownColor from "../../Asset/Icon/ArrowDownColor.png";
import ArrowRightWhite from "../../Asset/Icon/ArrowRightWhite.png";
import diningTableColor from "../../Asset/Icon/diningTableColor.png";
import takeawayColor from "../../Asset/Icon/takeawayColor.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import checklistLogo from "../../Asset/Icon/checklist.png";
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import CartModal from "../../Component/Modal/CartModal";
import { cart } from "../../App";
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import Cookies from "js-cookie"
import MenuDetail from '../../Component/Menu/MenuDetail'
import NotifModal from '../../Component/Modal/NotifModal'
import { connect } from "react-redux";
import { EditMenuCart, IsMerchantQR, DataOrder } from '../../Redux/Actions'
import Loader from 'react-loader-spinner'
import { Link, Redirect } from "react-router-dom";
import { LoadingButton, DoneLoad } from '../../Redux/Actions'
// import Swal from 'sweetalert2';
import TourPage from '../../Component/Tour/TourPage';
// import { firebaseAnalytics } from '../../firebaseConfig'
import moment from "moment";
import DeliveryIcon from "../../Asset/Icon/delivery.png";
import ShippingDate from "../../Asset/Icon/shipping-date.png";
import PaymentMethod from "../../Asset/Icon/payment-method.png";
import ArrowRight from "../../Asset/Icon/arrowright-icon.png";

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
          selector: '.cartmanual-foodService',
          content : () => (
            <div>
              <h4>Mau makan dimana?</h4>
              <br />
              <span>Kamu bisa ubah pilihan makan kamu antara Makan di Tempat atau Takeaway</span>
            </div>
          ),
        },
        {
          selector: '.cartmanual-paymentService',
          content : () => (
            <div>
              <h4>Bayar pakai apa?</h4>
              <br />
              <span>Kami menyediakan 2 tipe pembayaran, secara OVO ataupun bayar di kasir</span>
            </div>
          )
        },
        {
          selector: '.cartmanual-OrderButton-mob',
          content : () => (
            <div>
              <h4>Sudah siap makan?</h4>
              <br />
              <span>Silakan tekan tombol Order untuk melakukan pembayaran (psstt, untuk pembayaran di kasir, jangan lupa ke kasir ya!)</span>
            </div>
          )
        },
        {
          selector: '.cartmanual-OrderButton-mob',
          content : () => (
            <div>
              <h4>Sudah siap makan?</h4>
              <br />
              <span>Silakan tekan tombol Order untuk melakukan pembayaran (psstt, untuk pembayaran di kasir, jangan lupa ke kasir ya!)</span>
            </div>
          )
        }
      ],
      customerName : "",
      customerPhoneNumber : "",
      customerShippingDate : "",
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
      
      if(this.props.CartRedu.shippingDate) {
        this.setState({ customerShippingDate : moment(new Date(this.props.CartRedu.shippingDate)).format("d MMMM yyyy HH:mm")})
      }
    }

    handleDetail(data) {
      if (data === "eat-method") {
        this.setState({ showModal: true });
        this.setState({ currentModalTitle: "Pilih Cara Makan Anda" });
        this.setState({
          currentModal: [
            {
              image: "dineIn",
              option: "Makan Di Tempat",
            },
            {
              image: "takeaway",
              option: "Takeaway / Bungkus",
            },
          ],
        });
      } else if (data === "pay-method") {
        this.setState({ showModal: true });
        this.setState({ currentModalTitle: "Bayar Pakai Apa" });
        this.setState({
          currentModal: [
            {
              image: "cashier",
              option: "Pembayaran Di Kasir",
            },
            {
              image: "ovo",
              option: "OVO",
            },
          ],
        });
      } else if (data === "payment-detail") {
        this.setState({ showModal: true });
        this.setState({ currentModalTitle: "Rincian Pembayaran" });
        this.setState({
          currentModal: finalProduct
        });
      } else if (data === "payment-checking") {
        this.setState({ showModal: true });
        this.setState({ currentModalTitle: "Pesanan yang Anda buat tidak dapat dibatalkan" });
      }
    }
  
    setModal(isShow) {
      this.setState({ showModal: isShow });
    }

    handleDecrease(e, ind, mid) {
      let allCart = JSON.parse(localStorage.getItem('cart'))
      if (e.foodAmount > 1) {
        let filteredStore = []
        allCart.forEach((store) => {
          if (store.mid === mid) {
            filteredStore = store.food.filter((data, index) => {
              return index === ind
            })
  
            let { foodAmount, foodTotalPrice } = filteredStore[0]
  
            let countAmount = foodTotalPrice - (foodTotalPrice / foodAmount)
  
            filteredStore[0].foodTotalPrice = countAmount
            filteredStore[0].foodAmount = foodAmount - 1
            store.food[ind] = filteredStore[0]
          }
        });
  
        localStorage.setItem('cart', JSON.stringify(allCart))
        this.setState({ updateData: 'updated' })
      } else {
        let filteredCart;
        let addedMerchants = []
        let newAllCart = []
        allCart.forEach((store) => {
          if (store.mid === mid) {
            let filteredStore = store.food.filter((data, index) => {
              return index !== ind
            })
  
            if (filteredStore.length === 0) {
              filteredCart = cart.filter((filterStore) => {
                return filterStore.mid !== store.mid;
              });
              localStorage.setItem("cart", JSON.stringify(filteredCart))
              filteredCart.forEach((cart) => {
                addedMerchants.push(cart.mid)
                Cookies.set("addedMerchants", addedMerchants)
              })
            } else {
              let newFilter = store.food
              newFilter = []
              filteredStore.forEach((val) => {
                newFilter.push(val)
              })
              store.food = newFilter
              newAllCart.push(store)
            }
          } else {
            newAllCart.push(store)
          }
        });
  
        if (newAllCart.length < 2) {
          cart.splice(1)
          localStorage.setItem("cart", JSON.stringify(newAllCart))
          window.history.back()
        } else {
          let filterMerchantCart = newAllCart.filter(valueCart => {
            return valueCart.mid === mid
          })
          localStorage.setItem("cart", JSON.stringify(newAllCart))
          if (filterMerchantCart.length) {
            this.setState({ updateData: 'updated' })
          } else {
            window.history.back()
          }
        }
      }
    }
  
    handleIncrease(e, ind, mid) {
      let filteredStore = []
      let allCart = JSON.parse(localStorage.getItem('cart'))
      allCart.forEach((store) => {
        if (store.mid === mid) {
          filteredStore = store.food.filter((data, index) => {
            return index === ind
          })
  
          let { foodAmount, foodTotalPrice } = filteredStore[0]
  
          let countAmount = foodTotalPrice + (foodTotalPrice / foodAmount)
  
          filteredStore[0].foodTotalPrice = countAmount
          filteredStore[0].foodAmount = foodAmount + 1
          store.food[ind] = filteredStore[0]
        }
      });
  
      localStorage.setItem('cart', JSON.stringify(allCart))
      this.setState({ updateData: 'updated' })
    }
  
    handleOption = (data) => {
      let valueTab
      if (this.props.noTable !== undefined) {
        if (this.state.currentModalTitle === "Pilih Cara Makan Anda") {
          if (data == 1) {
            valueTab = 0
            valueTab.toString()
            localStorage.setItem('table', valueTab)
          } else {
            valueTab = localStorage.getItem('lastTable')
            valueTab.toString()
            localStorage.setItem('table', valueTab)
          }
        }
      }
      if (this.state.currentModalTitle === "Pilih Cara Makan Anda") {
        if (data == 0) {
          this.setState({ biz_type: "DINE_IN", eat_type: "Makan Di Tempat", indexOptionEat: 0 })
        } else {
          this.setState({ biz_type: "TAKE_AWAY", eat_type: "Bungkus / Takeaway", indexOptionEat: data })
        }
      } else if (this.state.currentModalTitle === "Bayar Pakai Apa") {
        if (data === 0) {
          this.setState({ paymentType: "PAY_BY_CASHIER", paymentOption: "Pembayaran Di Kasir", indexOptionPay: 0 })
        } else {
          this.setState({ paymentType: "WALLET_OVO", paymentOption: "OVO", indexOptionPay: data })
        }
      }
    }

    handlePayment = () => {
      // var auth = {
      //   isLogged: false,
      //   token: "",
      //   new_event: true,
      //   recommendation_status: false,
      //   email: "",
      // };
      // if (Cookies.get("auth") !== undefined) {
      //   auth = JSON.parse(Cookies.get("auth"))
      // }
      // if (auth.isLogged === false) {
      //   window.history.back()
      // }
      this.props.LoadingButton()
  
      const currentCartMerchant = JSON.parse(Cookies.get("currentMerchant"))
      let storageData = JSON.parse(localStorage.getItem('cart'))
      let noTab = this.props.noTable ? this.props.noTable : 0
      let allMenu = storageData.filter(filterCart => {
        return filterCart.mid === currentCartMerchant.mid
      })
      let selectedProd = []
  
      allMenu[0].food.forEach(selectMenu => {
        let newlistArr = ''
        let extraprice = 0
        selectMenu.foodListCheckbox.forEach((val) => {
          val.forEach((val2) => {
            newlistArr += `${val2.name}, `
            extraprice += val2.price
          })
        })
  
        selectMenu.foodListRadio.forEach((val) => {
          val.forEach((val2) => {
            newlistArr += `${val2.name}, `
            extraprice += val2.price
          })
        })
  
        newlistArr += selectMenu.foodNote
        extraprice = extraprice.toString()
  
        selectedProd.push({
          product_id: selectMenu.productId,
          notes: newlistArr,
          qty: selectMenu.foodAmount,
          extra_price: extraprice
        })
      })
  
      let newDate = new Date().getTime()
      let expiryDate = ''
      if (this.state.paymentType === 'PAY_BY_CASHIER') {
        newDate += 1800000
        phoneNumber = ''
      } else {
        newDate += 60000
      }
      expiryDate = moment(new Date(newDate)).format("DD-MM-yyyy HH:mm:ss")
  
      var requestData = {
        products: selectedProd,
        payment_with: this.state.paymentType,
        mid: currentCartMerchant.mid,
        prices: finalProduct[0].totalPrice.toString(),
        biz_type: this.state.biz_type,
        table_no: noTab.toString(),
        phone_number: phoneNumber,
        expiry_date: expiryDate
      }
  
      // console.log(requestData);
  
      let uuid = uuidV4();
      uuid = uuid.replace(/-/g, "");
      const date = new Date().toISOString();
      
      Axios(address + "/txn/v3/txn-post/", {
        headers: {
          "Content-Type": "application/json",
          "x-request-id": uuid,
          "x-request-timestamp": date,
          "x-client-id": clientId,
        },
        method: "POST",
        data: requestData,
      })
        .then((res) => {
          if (this.state.paymentType === 'PAY_BY_CASHIER') {
            this.setState({ successMessage: 'Silahkan Bayar ke Kasir/Penjual' })
            setTimeout(() => {
              let filterOtherCart = storageData.filter(valFilter => {
                return valFilter.mid !== currentCartMerchant.mid
              })
              var dataOrder = {
                transactionId : res.data.results[0].transaction_id,
                totalPayment : requestData.prices,
                paymentType : this.state.paymentType,
                transactionTime : newDate
              };
              this.props.DataOrder(dataOrder);
              localStorage.setItem("payment", JSON.stringify(dataOrder));
              localStorage.setItem("cart", JSON.stringify(filterOtherCart))
              localStorage.removeItem("lastTable")
              localStorage.removeItem("fctable")
              localStorage.removeItem("counterPayment");
              this.setState({ loadButton: true })
              this.props.DoneLoad()
            }, 1000);
          } else {
            this.setState({ successMessage: 'Silahkan Bayar melalui OVO' })
            setTimeout(() => {
              let filterOtherCart = storageData.filter(valFilter => {
                return valFilter.mid !== currentCartMerchant.mid
              })
              var dataOrder = {
                transactionId : res.data.results[0].transaction_id,
                totalPayment : requestData.prices,
                paymentType : this.state.paymentType,
                transactionTime : newDate
              };
              this.props.DataOrder(dataOrder);
              localStorage.setItem("payment", JSON.stringify(dataOrder));
              localStorage.setItem("cart", JSON.stringify(filterOtherCart))
              localStorage.removeItem("lastTable")
              localStorage.removeItem("fctable")
              localStorage.removeItem("counterPayment");
              this.setState({ loadButton: true })
              this.props.DoneLoad()
            }, 1000);
          }
        })
        .catch((err) => {
          if (err.response.data !== undefined) {
            alert(err.response.data.err_message)
            this.props.DoneLoad()
          }
        });
    };
  
    notifModal = () => {
      if (this.props.AllRedu.buttonLoad === false) {
        return <NotifModal isShowNotif={this.props.AllRedu.buttonLoad} responseMessage={this.state.successMessage} />
      }
    }

    newListAllChoices = (food) => {
      let newlistArr = ''
      food.foodListCheckbox.forEach((val) => {
        val.forEach((val2) => {
          return newlistArr += `${val2.name}, `
        })
      })
  
      food.foodListRadio.forEach((val) => {
        val.forEach((val2) => {
          return newlistArr += `${val2.name}, `
        })
      })
      return <h5 className='cartmanual-List-content-choice'>{newlistArr}</h5>
    }
  
    onEditCart = (ind, mid) => {
      let filteredStore = []
      let allCart = JSON.parse(localStorage.getItem('cart'))
      allCart.forEach((store) => {
        if (store.mid === mid) {
          filteredStore = store.food.filter((data, index) => {
            return index === ind
          })
        }
      });
  
      var objFilteredCart = {
        productId: filteredStore[0].productId,
        foodName: filteredStore[0].foodName,
        foodDesc: "",
        foodCategory: filteredStore[0].foodCategory,
        foodPrice: filteredStore[0].foodPrice,
        foodImage: filteredStore[0].foodImage,
        foodNote: filteredStore[0].foodNote,
        foodListCheckbox: filteredStore[0].foodListCheckbox,
        foodListRadio: filteredStore[0].foodListRadio,
        foodTotalPrice: filteredStore[0].foodTotalPrice,
        foodExt: [
          {
            name: "",
            amount: filteredStore[0].foodAmount,
          },
        ],
      }
  
      this.setState({ showMenuDet: true, filteredCart: filteredStore, currentData: objFilteredCart, indexEdit: ind, themid: mid })
      this.props.EditMenuCart(true)
      document.body.style.overflowY = 'hidden'
    }
  
    setMenuDetail(isShow) {
      this.setState({ showMenuDet: isShow })
      document.body.style.overflowY = ''
    }
  
    handleCartAmount = (price) => {
      currentTotal = price
    }
  
    menuDetail = () => {
      if (this.state.showMenuDet === true) {
        return (
          <MenuDetail
            isShow={this.state.showMenuDet}
            onHide={() => this.setMenuDetail(false)}
            datas={this.state.currentData}
            handleAmount={this.handleCartAmount}
            handleClick={this.handleSaveCart}
            handleData={this.handleCart}
          />
        );
      }
    }
  
    handleCart = (data) => {
      currentExt = data
    }
  
    handleSaveCart = () => {
      let filteredStore = []
      let allCart = JSON.parse(localStorage.getItem('cart'))
      let getProductId
      allCart.forEach((store) => {
        if (store.mid === this.state.themid) {
          filteredStore = store.food.filter((data, index) => {
            return index === this.state.indexEdit
          })
  
          getProductId = filteredStore[0].productId
  
          filteredStore[0].foodAmount = currentExt.detailCategory[0].amount
          filteredStore[0].foodListCheckbox = currentExt.listcheckbox
          filteredStore[0].foodListRadio = currentExt.listradio
          filteredStore[0].foodNote = currentExt.note
          filteredStore[0].foodTotalPrice = currentTotal
  
          store.food[this.state.indexEdit] = filteredStore[0]
        }
      });
      localStorage.setItem('cart', JSON.stringify(allCart))
      this.setState({ updateData: 'updated' })
  
      // var auth = {
      //   isLogged: false,
      //   token: "",
      //   new_event: true,
      //   recommendation_status: false,
      //   email: "",
      // };
      // if (Cookies.get("auth") !== undefined) {
      //   auth = JSON.parse(Cookies.get("auth"))
      // }
  
      let newNotes = ''
      currentExt.listcheckbox.forEach(val => {
        val.forEach(val2 => {
          return newNotes += `${val2.name}, `
        })
      })
  
      currentExt.listradio.forEach(val => {
        val.forEach(val2 => {
          return newNotes += `${val2.name}, `
        })
      })
  
      if (currentExt.note) {
        newNotes += currentExt.note
      }
  
      let tableNumber = ''
      if (localStorage.getItem('table')) {
        tableNumber = localStorage.getItem('table')
      } else {
        tableNumber = 0
      }
  
      let uuid = uuidV4();
      const date = new Date().toISOString();
      uuid = uuid.replace(/-/g, "");
      Axios(address + "txn/v2/cart-post/", {
        headers: {
          "Content-Type": "application/json",
          "x-request-id": uuid,
          "x-request-timestamp": date,
          "x-client-id": clientId,
          "table-no": tableNumber.toString()
        },
        method: "POST",
        data: {
          mid: this.state.themid,
          pid: getProductId,
          notes: newNotes,
          qty: currentExt.detailCategory[0].amount,
        }
      })
      .then(() => {
        console.log('savetocart succeed');
      })
      .catch((err) => {
        console.log(err);
      });
    }
    tourPage = () => {
      if (this.state.startTour === true) {
        return (
          <TourPage 
            stepsContent={this.state.steptour}
            isShowTour={this.state.startTour}
            isHideTour={() =>this.showTourPage(false)}
          />
        )
      }
    }
  
    showTourPage = (isShowTour) => {
      this.setState({ startTour: isShowTour });
      document.body.style.overflowY = 'auto';
      this.props.IsMerchantQR(false);
      localStorage.setItem('cartTour', 0);
      localStorage.setItem('storeTour',0);
      localStorage.setItem('cartMerchant', 0);
      localStorage.setItem('merchantFlow', 0);
      localStorage.setItem('productTour', 0);
    }
  
    isPhoneNum = (num) => {
      phoneNumber = num
    }

    handleCustomerName = (e) =>{
      this.setState({ customerName: e.target.value});
    }

    handleCustomerPhoneNumber = (e) =>{
      this.setState({ customerPhoneNumber: e.target.value});
    }

    goToPickupSelection = () => {

    }

    render() {
      if (this.state.loadButton) {
        return <Redirect to='/orderconfirmation' />
      }
  
      const currentCartMerchant = JSON.parse(Cookies.get("currentMerchant"))
      let allCart = JSON.parse(localStorage.getItem('cart'))
      let filterCart = allCart.filter(valCart => {
        return valCart.mid === currentCartMerchant.mid
      })
      if (filterCart.length === 0) {
        window.history.go(-1)
      } else {
        if (this.state.changeUI) {
          this.setState({ changeUI: false })
        }
      }
  
      // var auth = {
      //   isLogged: false,
      //   token: "",
      //   new_event: true,
      //   recommendation_status: false,
      //   email: "",
      //   is_email_verified: true
      // };
      // if (Cookies.get("auth") !== undefined) {
      //   auth = JSON.parse(Cookies.get("auth"))
      // }
      // if (auth.isLogged === false) {
      //   var lastLink = { value: window.location.href }
      //   Cookies.set("lastLink", lastLink, { expires: 1 })
      // }
  
      let modal;
      if (this.state.showModal === true) {
        modal = (
          <CartModal
            isShow={this.state.showModal}
            onHide={() => this.setModal(false)}
            title={this.state.currentModalTitle}
            detailOptions={this.state.currentModal}
            handleData={this.handleOption}
            indexOptionEat={this.state.indexOptionEat}
            indexOptionPay={this.state.indexOptionPay}
            setPhoneNumber={this.isPhoneNum}
            confirmPay={this.handlePayment}
          />
        );
      } else {
        modal = <></>
      }
  
      let storageData = JSON.parse(localStorage.getItem('cart'))
      let data = storageData;
      let storeList = data.filter((store) => {
        if (store.mid !== "") {
          return store;
        }
      });
  
      let contentView = storeList.map((store) => {
        let storeFood
        if (store.mid === currentCartMerchant.mid) {
          storeFood = store.food.map((food, index) => {
            return (
              <div key={index} className='cartmanual-List-content'>
                <div className='cartmanual-List-content-frame'>
                  <img className='cartmanual-List-content-image' src={food.foodImage} alt='' />
                </div>
  
                <div className='cartmanual-List-content-detail'>
                  <div className='cartmanual-List-content-detail-left'>
                    <h2 className='cartmanual-List-content-title'>{food.foodName}</h2>
                    {this.newListAllChoices(food)}
                    <h5 className='cartmanual-List-content-notes'>{food.foodNote}</h5>
                    <h3 className='cartmanual-List-content-price'>{Intl.NumberFormat("id-ID").format(food.foodTotalPrice)}</h3>
                  </div>
  
                  <div className='cartmanual-List-content-detail-right'>
                    <div className='cartmanual-List-editButton' onClick={() => this.onEditCart(index, store.mid)}>
                      <div className='cartmanual-List-editWord'>Ubah</div>
                    </div>
  
                    <div className='cartmanual-List-amountBox'>
                      <div className='cartmanual-List-amountBox-inside'>
                        <div className='cartmanual-List-minusBox' onClick={() => this.handleDecrease(food, index, store.mid)}>
                          <div className='cartmanual-List-minusSym'>
                            -
                          </div>
                        </div>
  
                        <div className='cartmanual-List-numberArea'>
                          {food.foodAmount}
                        </div>
  
                        <div className='cartmanual-List-plusBox' onClick={() => this.handleIncrease(food, index, store.mid)}>
                          <div className='cartmanual-List-plusSym'>
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
        return storeFood
      });
  
      let totalPaymentShow = 0
      let selectedMerch = storeList.filter(store => {
        return store.mid === currentCartMerchant.mid
      });
  
      selectedMerch[0].food.forEach(thefood => {
        totalPaymentShow += thefood.foodTotalPrice
      })
  
      finalProduct = [
        {
          totalPrice: totalPaymentShow,
          discountPrice: 0,
        },
      ]
  
      let paymentImage;
      let eatImage;
      if (this.state.biz_type === "DINE_IN") {
        eatImage = diningTableColor;
      } else if (this.state.biz_type === "TAKE_AWAY") {
        eatImage = takeawayColor;
      }
      if (this.state.paymentType === "PAY_BY_CASHIER") {
        paymentImage = CashierPayment
      } else if (this.state.paymentType === "WALLET_OVO") {
        paymentImage = OvoPayment
      }
  
      // this.setState({ dataOrder : { totalPayment : totalPaymentShow, paymentType : this.state.paymentType }});
  
      if (this.state.changeUI) {
        return (
          <div style={{ display: 'flex', position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Loader
              type="TailSpin"
              color="#4bb7ac"
              height={100}
              width={100}
            />
          </div>
        )
      }
  
      return (
        <>
          <div className='cartmanual-Layout'>
            <div className="cartmanual-header">
                <span className="cartmanual-back" onClick={() => window.history.back()}>
                    <img className="cartmanual-backicon" src={ArrowBack} alt='' />
                </span>
                <div className="cartmanual-title">Checkout</div>
            </div>
  
            <div className='cartmanual-Content'>
              <div className='cartmanual-LeftSide'>
                <div className='cartmanual-List'>
                  <div className='cartmanual-List-header'>
                    <h4 className='cartmanual-List-title'>
                      Keranjang
                    </h4>
                  </div>
  
                  {contentView}
                </div>
              </div>
  
              <div className='cartmanual-RightSide'>
                <div className='cartmanual-flex-RightSide'>
  
                  <div className='cartmanual-customerinfo'>
                    <div className='cartmanual-customerinfo-header'>
                      <div className='cartmanual-customerinfo-title'>
                        Info Pelanggan
                      </div>
                    </div>
  
                    <div className='cartmanual-customerinfo-content'>
                      <div className="cartmanual-infoname">
                        <div className="cartmanual-infoname-title">Nama <span style={{color: "red"}}>*</span></div>
                        <input className="cartmanual-infoname-inputArea" placeholder="Masukkan nama Anda disini..." onChange={this.handleCustomerName}/>
                      </div>

                      <div className="cartmanual-phonenumber">
                        <div className="cartmanual-phonenumber-title">No. Handphone <span style={{color: "red"}}>*</span></div>
                        <div className="cartmanual-phonenumber-layout">
                          <div className="cartmanual-phonenumber-code">+62</div>
                          <input className="cartmanual-phonenumber-inputArea" placeholder="Masukkan nomor HP Anda disini" onChange={this.handleCustomerPhoneNumber}/>
                        </div>
                      </div>
                    </div>
                  </div>
                    
                  <div className='cartmanual-deliveryinfo'>
                    <div className='cartmanual-detailContent'>
                      <div className='cartmanual-radioSection'>
                        <div>
                        <Link to={"/cartmanual/pickup"} style={{ textDecoration: "none" }}>
                        <label>
                          <div className='cartmanual-radioSide'>
                            <img className='cartmanual-radio-image' src={DeliveryIcon} alt='' />
                            <div className='cartmanual-radioTitle'>Pilih Pengiriman</div>
                          </div>
                          <span className="cartmanual-arrowright">
                            <img className="cartmanual-arrowright-icon" src={ArrowRight} />
                          </span>
                        </label>
                        </Link>
                        </div>
                        {
                          this.props.CartRedu.pickupType != -1 ?
                          <div className='cartmanual-deliverydetail'>
                            <div className="cartmanual-deliverydetail-border"></div>

                            <div className='cartmanual-deliverydetail-desc'>
                              {
                                this.props.CartRedu.pickupType === 1 ?
                                <>
                                  <div className='cartmanual-deliverydetail-title'>Dikirim ke</div>
                                  <div className='cartmanual-deliverydetail-address'>{this.props.CartRedu.fullAddress}</div>
                                  {
                                    this.props.CartRedu.shipperNotes != "" ?
                                    <div className='cartmanual-deliverydetail-shipperNotesTitle'>Catatan : <span className='cartmanual-deliverydetail-shipperNotes'>{this.props.CartRedu.shipperNotes}</span></div>
                                    :
                                    null
                                  }
                                  <div className='cartmanual-deliverydetail-shipperLayout'>
                                    <div className='cartmanual-deliverydetail-shipperLayout-shipperName'>{this.props.CartRedu.shipperName}</div>
                                    <div className='cartmanual-deliverydetail-shipperLayout-shipperPrice'>Rp. {Intl.NumberFormat("id-ID").format(this.props.CartRedu.shipperPrice)}</div>
                                  </div>
                                </>
                                :
                                <div className='cartmanual-deliverydetail-title'>Pickup Sendiri</div>
                              }
                            </div>
                          </div> 
                          :
                          null
                        } 
                      </div>
                    </div>
                  </div>

                  <div className='cartmanual-shippingdate'>
                    <div className='cartmanual-detailContent'>
                      <div className='cartmanual-radioSection'>
                        <div>
                          <Link to={"/cartmanual/shipping"} style={{ textDecoration: "none" }}>
                          <label>
                            <div className='cartmanual-radioSide'>
                              <img className='cartmanual-radio-image' src={ShippingDate} alt='' />
                              <div className='cartmanual-radioTitle'>Atur Tanggal Pengiriman</div>
                            </div>
                            <span className="cartmanual-arrowright">
                              <img className="cartmanual-arrowright-icon" src={ArrowRight} />
                            </span>
                          </label>
                          </Link>
                        </div>
                        {
                          this.state.customerShippingDate ? 
                          <div className='cartmanual-shippingdatedetail'>
                            <div className="cartmanual-shippingdatedetail-border"></div>

                            <div className='cartmanual-shippingdatedetail-desc'>
                                <div>{this.state.customerShippingDate}</div>
                            </div>
                          </div>
                          :
                          <></>
                        }
                      </div>
                    </div>
                  </div>

                  <div className='cartmanual-paymentmethod'>
                    <div className='cartmanual-detailContent'>
                      <div className='cartmanual-radioSection'>
                        <div>
                        <Link to={"/cartmanual/payment"} style={{ textDecoration: "none" }}>
                        <label>
                          <div className='cartmanual-radioSide'>
                            <img className='cartmanual-radio-image' src={PaymentMethod} alt='' />
                            <div className='cartmanual-radioTitle'>Metode Pembayaran</div>
                          </div>
                          <span className="cartmanual-arrowright">
                            <img className="cartmanual-arrowright-icon" src={ArrowRight} />
                          </span>
                        </label>
                        </Link>
                        </div>
                        {
                          this.props.CartRedu.phoneNumber != "" ?
                          <div className='cartmanual-paymentdetail'>
                            <div className="cartmanual-paymentdetail-border"></div>

                            <div className='cartmanual-paymentdetail-desc'>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                  <span>
                                    <img style={{height: '25px', width: '25px'}} src={OvoPayment} />
                                  </span>
                                  <div style={{marginLeft: '10px'}}>OVO</div>
                                </div>
                                <div>{this.props.CartRedu.phoneNumber}</div>
                            </div>
                          </div>
                          :
                          null
                        }
                      </div>
                    </div>
                  </div>

                </div>
  
              </div>
            </div>
          </div>
  
          <div className='cartmanual-Layout-mob'>
            {/* <div>
              <div className='cartmanual-delivery-desc'>
                <div>Dikirim ke</div>
              </div>
            </div> */}
            <div className='cartmanual-checkoutArea-mob'>
  
              <div className='cartmanual-TotalAmount-mob' onClick={() => this.handleDetail("payment-detail")}>
                <h3 className='cartmanual-TotalAmount-title-mob'>Total Harga</h3>
  
                <div className='cartmanual-TotalAmount-bottom-mob'>
                  <h2 className='cartmanual-TotalAmount-price-mob'>Rp. {Intl.NumberFormat("id-ID").format(totalPaymentShow)}</h2>
  
                  {/* <span className='cartmanual-TotalAmount-detailArrowCenter-mob'>
                    <img className='cartmanual-TotalAmount-detailArrow-mob' src={ArrowDownColor} alt='' />
                  </span> */}
                </div>
              </div>
  
              <div className='cartmanual-OrderButton-mob buttonorder' onClick={() => this.handleDetail("payment-checking")}>
                <div className='cartmanual-OrderButton-content-mob'>
                  {/* <span className='cartmanual-OrderButton-Frame-mob'>
                    <img className='cartmanual-OrderButton-checklist-mob' src={checklistLogo} alt='' />
                  </span> */}
  
                  <h1 className='cartmanual-OrderButton-word-mob'>Buat Pesanan</h1>
                </div>
  
                {/* <span className='cartmanual-OrderButton-orderArrowCenter-mob'>
                  <img className='cartmanual-OrderButton-orderArrow-mob' src={ArrowRightWhite} alt='' />
                </span> */}
              </div>
            </div>
          </div>
          {modal}
          {this.menuDetail()}
          {this.notifModal()}
          {this.tourPage()}
        </>
      );
    }
}

const Mapstatetoprops = (state) => {
    return {
      AllRedu: state.AllRedu,
      AuthRedu: state.AuthRedu,
      CartRedu: state.CartRedu
    }
  }
  
  export default connect(Mapstatetoprops, { EditMenuCart, LoadingButton, DoneLoad, IsMerchantQR, DataOrder })(CartManualView)