import React from "react";
import ArrowDownColor from "../../Asset/Icon/ArrowDownColor.png";
import ArrowRightWhite from "../../Asset/Icon/ArrowRightWhite.png";
import diningTableColor from "../../Asset/Icon/diningTableColor.png";
import takeawayColor from "../../Asset/Icon/takeawayColor.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import DanaPayment from "../../Asset/Icon/dana_icon.png";
import ShopeePayment from "../../Asset/Icon/shopee_icon.png";
import checklistLogo from "../../Asset/Icon/checklist.png";
import VoucherIcon from "../../Asset/Icon/ic_voucher.png";
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import ArrowRight from "../../Asset/Icon/arrowright-icon.png";
import CartModal from "../../Component/Modal/CartModal";
import { cart } from "../../App";
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";
import Cookies from "js-cookie"
import MenuDetail from '../../Component/Menu/MenuDetail'
import NotifModal from '../../Component/Modal/NotifModal'
import { connect } from "react-redux";
import { EditMenuCart, IsMerchantQR, DataOrder } from '../../Redux/Actions'
import Loader from 'react-loader-spinner'
import { Link, Redirect } from "react-router-dom";
import { LoadingButton, DoneLoad } from '../../Redux/Actions'
import TourPage from '../../Component/Tour/TourPage';
import { firebaseAnalytics } from '../../firebaseConfig'
import moment from "moment";

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

class CartView extends React.Component {
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
    firebaseAnalytics.logEvent("cart_visited")
    this.sendTracking();

    this.sendTracking();

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

  componentDidUpdate() {
    if(this.state.counterTime === 0) {
      clearInterval(this.interval);
      console.log("clear");
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
          {
            image: "dana",
            option: "DANA",
          },
          {
            image: "shopee",
            option: "ShopeePay",
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
      } else if (data === 1) {
        this.setState({ paymentType: "WALLET_OVO", paymentOption: "OVO", indexOptionPay: data })
      } else if (data === 2) {
        this.setState({ paymentType: "WALLET_DANA", paymentOption: "DANA", indexOptionPay: data })
      } else if (data === 3) {
        this.setState({ paymentType: "WALLET_SHOPEEPAY", paymentOption: "ShopeePay", indexOptionPay: data })
      }
    }
  }

  handlePayment = () => {
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

    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();
    
    Axios(address + "/txn/v4/txn-post/", {
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
        } 
        else if(this.state.paymentType === 'WALLET_OVO') {
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
        else if(this.state.paymentType === 'WALLET_DANA') {
          this.setState({ successMessage: 'Silahkan Bayar melalui DANA' })
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
            window.location.href = res.data.results[0].checkout_url_mobile;
          }, 1000);
        }
        else if(this.state.paymentType === 'WALLET_SHOPEEPAY') {
          this.setState({ successMessage: 'Silahkan Bayar melalui ShopeePay' })
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
            window.location.assign(res.data.results[0].checkout_url_deeplink);
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
    return <h5 className='cartList-content-choice' style={{display: "flex"}}><h5 className='cartList-content-notes' style={{fontWeight: "bold", color: "black"}}>Tambahan :</h5>{newlistArr}</h5>
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

  // handleReloadEmail = () => {
  //   var auth = {
  //     isLogged: false,
  //     token: "",
  //     new_event: true,
  //     recommendation_status: false,
  //     email: "",
  //     is_email_verified: true
  //   };

  //   if (Cookies.get("auth") !== undefined) {
  //     auth = JSON.parse(Cookies.get("auth"))
  //   }

  //   if (auth.is_email_verified === false) {
  //     console.log(auth)
  //     let uuid = uuidV4();
  //     uuid = uuid.replace(/-/g, "");
  //     const date = new Date().toISOString();
  //     let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
  //     Axios(address + "home/v2/customer-info", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-request-id": uuid,
  //         "x-request-timestamp": date,
  //         "x-client-id": clientId,
  //         "x-signature": signature,
  //         "token": auth.token,
  //       },
  //       method: "GET",
  //     })
  //       .then((res) => {
  //         let data = res.data.results
  //         auth.is_email_verified = data.is_email_verified;
  //         Cookies.set("auth", auth, { expires: 1 });
  //         this.setState({ isEmailVerified: auth.is_email_verified });
  //       })
  //       .catch((err) => {
  //       });
  //   }
  // }

  // handleResendEmail = () => {
  //   this.setState({ countHit: this.state.countHit + 1 });

  //   var auth = {
  //     isLogged: false,
  //     token: "",
  //     new_event: true,
  //     recommendation_status: false,
  //     email: "",
  //     is_email_verified : true
  //   };

  //   if (Cookies.get("auth") !== undefined) {
  //     auth = JSON.parse(Cookies.get("auth"))
  //   }

  //   let uuid = uuidV4();
  //   uuid = uuid.replace(/-/g, "");
  //   const date = new Date().toISOString();
  //   Axios(address + "auth/resend-email/" + auth.email + "/", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-request-id": uuid,
  //       "x-request-timestamp": date,
  //       "x-client-id": clientId
  //     },
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       Swal.fire({
  //           position: 'top',
  //           icon: 'success',
  //           title: 'Email telah terkirim. Silahkan periksa email Anda.',
  //           showConfirmButton: true,
  //           confirmButtonColor: "#4bb7ac",
  //           confirmButtonText: "OK",
  //           closeOnConfirm: false,
  //           // timer: 3000
  //       }).then(() => {
  //           if(this.state.countHit > 1) {
  //             this.setState({ counterTime : 300});
  //           } else {
  //             this.setState({ counterTime : 120});
  //           }
            
  //           this.setState({ isShowCounterTime : true });
  //           this.countDownTime();
  //       })
  //     })
  //     .catch((err) => {
  //     });

  // }

  countDownTime = () => {
    this.interval = setInterval(
      () => this.setState((state)=> ({ counterTime: this.state.counterTime - 1 })),
      1000
    );
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

  sendTracking() {
    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replace(/-/g, "");

    const currentCartMerchant = JSON.parse(Cookies.get("currentMerchant"))

    Axios(address + "home/v1/event/add", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "token" : "PUBLIC"
      },
      method: "POST",  
      data: { 
        merchant_id: currentCartMerchant.mid,
        event_type: "ORDER_DETAIL",
        page_name: window.location.pathname
      }
    })
    .then((res) => {
      console.log(res.data.results);
    })
    .catch((err) => {
      console.log(err);
    });
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
            <div key={index} className='cartList-content'>
              <div className='cartList-content-frame'>
                <img className='cartList-content-image' src={food.foodImage} alt='' />
              </div>

              <div className='cartList-content-detail'>
                <div className='cartList-content-detail-left'>
                  <h2 className='cartList-content-title'>{food.foodName}</h2>
                  {this.newListAllChoices(food)}
                  <h3 className='cartList-content-price'>Rp {Intl.NumberFormat("id-ID").format(food.foodTotalPrice)}</h3>
                  <h5 className='cartList-content-notes' style={{display: food.foodNote == ""? "none":"block"}}>{food.foodNote}</h5>
                </div>

                <div className='cartList-content-detail-right'>
                  <div className='cartList-editButton' onClick={() => this.onEditCart(index, store.mid)}>
                    <div className='cartList-editWord'>Ubah</div>
                  </div>

                  <div className='cartList-amountBox'>
                    <div className='cartList-amountBox-inside'>
                      <div className='cartList-minusBox' onClick={() => this.handleDecrease(food, index, store.mid)}>
                        <div className='cartList-minusSym'>
                          -
                        </div>
                      </div>

                      <div className='cartList-numberArea'>
                        {food.foodAmount}
                      </div>

                      <div className='cartList-plusBox' onClick={() => this.handleIncrease(food, index, store.mid)}>
                        <div className='cartList-plusSym'>
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

    let detailView = storeList.map((store, index) => {
      if (store.mid === currentCartMerchant.mid) {
        return (
          <div key={index} className='cart-customerinfo'>
            <div className='cart-customerinfo-header'>
              <div className='cart-customerinfo-title'>
                Detail Restoran
              </div>
            </div>

            <div className='cart-customerinfo-content'>
              <h2 className='cart-detailcontent-address'>
                {store.storeName}
              </h2>

              <h4 className='cart-detailcontent-addressdesc'>
                {store.storeAdress}
              </h4>
            </div>
          </div>
        )
      }
    });

    let totalPaymentShow = 0
    let totalItem = 0
    let selectedMerch = storeList.filter(store => {
      return store.mid === currentCartMerchant.mid
    });

    totalItem = selectedMerch[0].food.length;
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
    } else if (this.state.paymentType === "WALLET_DANA") {
      paymentImage = DanaPayment
    } else if (this.state.paymentType === "WALLET_SHOPEEPAY") {
      paymentImage = ShopeePayment
    }

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
        <div className='cartLayout'>
          <div className='cartTitle'>
            <span className='logopikappCenter' onClick={() => window.history.back()} >
              <img className='LogoPikappCart' src={ArrowBack} alt='' />
            </span>
            <div className='confirmationOrder'>Checkout</div>
          </div>

          <div className='cartContent'>
            <div className='cart-LeftSide'>
              <div className='cartList'>
                <div className='cartList-header'>
                  <h4 className='cartList-title'>
                    Item Yang Dibeli
                  </h4>
                  <h4 className='cartmanual-List-itembox'>
                      {totalItem} Item
                    </h4>
                </div>

                {contentView}
              </div>
            </div>

            <div className='cart-RightSide'>
              <div className='flex-RightSide'>
                {detailView}

                <div className='cart-serviceType' onClick={() => this.handleDetail("eat-method")}>
                  <div className='cart-detailContent'>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                          <div className='cart-leftSide'>
                              <img className='cart-foodService-img-icon' src={eatImage} alt='' />
                              <div className='cart-title'>Pilih Cara Makan</div>
                            </div>

                            <span className="cart-arrowright">
                              <img className="cart-arrowright-icon" src={ArrowRight} />
                            </span>
                        </div>

                        <div className='cart-selectiondetail'>
                          <div className="cart-selectiondetail-border"></div>

                          <div className='cart-selectiondetail-desc'>
                              <div>{this.state.eat_type}</div>
                          </div>
                        </div>
                  </div>
                </div>

                <div className='cart-serviceType' onClick={() => this.handleDetail("pay-method")}>
                  <div className='cart-detailContent'>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                          <div className='cart-leftSide'>
                              <img className='cart-foodService-img-icon' src={paymentImage} alt='' />
                              <div className='cart-title'>Pilih Metode Pembayaran</div>
                            </div>

                            <span className="cart-arrowright">
                              <img className="cart-arrowright-icon" src={ArrowRight} />
                            </span>
                        </div>

                        <div className='cart-selectiondetail'>
                          <div className="cart-selectiondetail-border"></div>

                          <div className='cart-selectiondetail-desc'>
                              <div>{this.state.paymentOption}</div>
                              {
                                this.state.paymentOption === 'OVO' ?
                                  <div>{phoneNumber}</div>
                                  : null
                              }
                          </div>
                        </div>
                  </div>
                </div>

                <div className='promoCart-voucherinfo'style={{marginTop: "10px"}} >
                    <Link to={{ pathname: "/promo", state: { title : "Pilih Voucher Diskon", alertStatus : { phoneNumber: "0", paymentType : 0 }, cartStatus : { bizType: this.state.biz_type, eatType: this.state.eat_type }}}} style={{ textDecoration: "none", width: "100%" }}>
                      <div className='promoCart-detailContent'>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                              <div className='promoCart-leftSide'>
                                  <img className='promoCart-img-icon' src={VoucherIcon} alt='' />
                                  <div className='promoCart-title'>Voucher Diskon</div>
                                </div>

                                <span className="promoCart-arrowright">
                                  <img className="promoCart-arrowright-icon" src={ArrowRight} />
                                </span>
                            </div>

                            {/* <div className='promoCart-selectiondetail'>
                              <div className="promoCart-selectiondetail-border"></div>

                              <div className='promoCart-selectiondetail-desc'>
                                  <div>PIKAPPTAHUNBARU</div>
                                  <div style={{fontWeight: "bold"}}>50%</div>
                              </div>
                            </div> */}
                      </div>
                    </Link>
                  </div>

                <div className='cart-summarypayment'>
                    <div className='cart-detailcontent-payment'>
                      <div>
                      <div className='cart-detailprice-header'>
                        <div className='cart-detailprice-title'>
                          Ringkasan Belanja
                        </div>
                      </div>

                      <div className='cart-detailprice-desc'>
                        <div className='orderDetail-detailprice-word'>
                          <div>Total Harga ({totalItem} Item(s))</div>
                          <div>Rp. {Intl.NumberFormat("id-ID").format(totalPaymentShow)}</div>
                        </div>
                      </div>

                      <div className='cart-detailprice-desc'>
                        <div className='orderDetail-detailprice-word'>
                          <div>Total Diskon Item</div>
                          <div>Rp. 0</div>
                        </div>
                      </div>
                      
                      </div>
                    </div>
                  </div>
              </div>

            </div>
          </div>
        </div>

        <div className='cart-Layout'>
          <div className='cart-checkoutArea'>

            <div className='cart-TotalAmount'>
              <h3 className='cart-TotalAmount-title'>Total Harga</h3>

              <div className='cart-TotalAmount-bottom'>
                <h2 className='cart-TotalAmount-price'>Rp. {Intl.NumberFormat("id-ID").format(totalPaymentShow)}</h2>
              </div>
            </div>
            
            <div className='cart-OrderButton buttonorder' onClick={() => this.handleDetail("payment-checking")} style={{ backgroundColor: '#4bb7ac' }} >
              <div className='cart-OrderButton-content'>
                <h1 className='cart-OrderButton-word'>Buat Pesanan</h1>
              </div>
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
    AuthRedu: state.AuthRedu
  }
}

export default connect(Mapstatetoprops, { EditMenuCart, LoadingButton, DoneLoad, IsMerchantQR, DataOrder })(CartView)