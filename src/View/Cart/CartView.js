import React from "react";
import ArrowDownColor from "../../Asset/Icon/ArrowDownColor.png";
import ArrowRightWhite from "../../Asset/Icon/ArrowRightWhite.png";
import diningTableColor from "../../Asset/Icon/diningTableColor.png";
import takeawayColor from "../../Asset/Icon/takeawayColor.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import checklistLogo from "../../Asset/Icon/checklist.png";
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import CartModalDev from "../../Component/Modal/CartModalDev";
import { cart } from "../../App";
import { address, secret, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import Cookies from "js-cookie"
import MenuDetail from '../../Component/Menu/MenuDetail'
import NotifModal from '../../Component/Modal/NotifModal'
import { connect } from "react-redux";
import { EditMenuCart } from '../../Redux/Actions'
import Loader from 'react-loader-spinner'
import { Redirect } from "react-router-dom";
import { LoadingButton, DoneLoad } from '../../Redux/Actions'

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
    isEmailVerified : false,
  };

  componentDidMount() {
    // const currentCartMerchant = JSON.parse(Cookies.get("currentMerchant"))
    // let allCart = JSON.parse(localStorage.getItem('cart'))
    // let filterCart = allCart.filter(valCart => {
    //   return valCart.mid === currentCartMerchant.mid
    // })
    // if (filterCart.length === 0) {
    //   window.history.go(-1)
    // } else {
    //   this.setState({ changeUI: false })
    // }

    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
      is_email_verified : true
    };

    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }

    this.setState({ isEmailVerified: auth.is_email_verified });

    if(this.state.isEmailVerified === false) {
        this.handleReloadEmail();
    }

  }

  componentDidUpdate() {
    // var auth = {
    //   isLogged: false,
    //   token: "",
    //   new_event: true,
    //   recommendation_status: false,
    //   email: "",
    //   is_email_verified : true
    // };

    // if (Cookies.get("auth") !== undefined) {
    //   auth = JSON.parse(Cookies.get("auth"))
    // }

    // if(this.state.isEmailVerified === false) {
    //     this.handleReloadEmail();
    // }
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
            option: "Pembayaran Ovo",
          },
        ],
      });
    } else if (data === "payment-detail") {
      this.setState({ showModal: true });
      this.setState({ currentModalTitle: "Rincian Pembayaran" });
      this.setState({
        currentModal: finalProduct
      });
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
        this.setState({ paymentType: "WALLET_OVO", paymentOption: "Pembayaran Ovo", indexOptionPay: data })
      }
    }
  }

  handlePayment = () => {
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }
    if (auth.isLogged === false) {
      window.history.back()
    }
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
      selectMenu.foodListCheckbox.forEach((val) => {
        val.forEach((val2) => {
          return newlistArr += `${val2.name}, `
        })
      })

      selectMenu.foodListRadio.forEach((val) => {
        val.forEach((val2) => {
          return newlistArr += `${val2.name}, `
        })
      })

      newlistArr += selectMenu.foodNote

      selectedProd.push({
        product_id: selectMenu.productId,
        notes: newlistArr,
        qty: selectMenu.foodAmount
      })
    })

    var requestData = {
      products: selectedProd,
      payment_with: this.state.paymentType,
      mid: currentCartMerchant.mid,
      prices: finalProduct[0].totalPrice.toString(),
      biz_type: this.state.biz_type,
      table_no: noTab.toString()
    }

    // console.log(requestData);

    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)

    Axios(address + "/txn/v1/txn-post/", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "x-signature": signature,
        "token": auth.token,
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
            localStorage.setItem("cart", JSON.stringify(filterOtherCart))
            // localStorage.setItem('page', JSON.stringify(2))
            localStorage.removeItem("table")
            localStorage.removeItem("lastTable")
            // window.location.href = '/status'
            this.setState({ loadButton: true })
            this.props.DoneLoad()
          }, 1000);
        } else {
          this.setState({ successMessage: 'Transaksi OVO berhasil' })
          setTimeout(() => {
            let filterOtherCart = storageData.filter(valFilter => {
              return valFilter.mid !== currentCartMerchant.mid
            })
            localStorage.setItem("cart", JSON.stringify(filterOtherCart))
            // localStorage.setItem('page', JSON.stringify(2))
            localStorage.removeItem("table")
            localStorage.removeItem("lastTable")
            // window.location.href = '/status'
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
    return <h5 className='cartList-content-choice'>{newlistArr}</h5>
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

    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }

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

    console.log(newNotes);

    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replaceAll("-", "");
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
    Axios(address + "txn/v1/cart-post/", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "x-signature": signature,
        "token": auth.token,
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

  handleReloadEmail = () => {
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
      is_email_verified : true
    };

    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }

    if(auth.is_email_verified === false) {
      console.log(auth)
      let uuid = uuidV4();
      uuid = uuid.replaceAll("-", "");
      const date = new Date().toISOString();
      let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
      Axios(address + "home/v2/customer-info", {
        headers: {
          "Content-Type": "application/json",
          "x-request-id": uuid,
          "x-request-timestamp": date,
          "x-client-id": clientId,
          "x-signature": signature,
          "token": auth.token,
        },
        method: "GET",
      })
        .then((res) => {
          let data = res.data.results
          auth.is_email_verified = data.is_email_verified;
          Cookies.set("auth", auth, { expires: 1 });
          this.setState({ isEmailVerified: auth.is_email_verified });
        })
        .catch((err) => {
        });
    }
  }

  render() {
    console.log(this.state.loadButton, 'PERHATIKAN!!');
    if (this.state.loadButton) {
      return <Redirect to='/status' />
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

    // if (localStorage.getItem('page')) {
    //   let currentPage = JSON.parse(localStorage.getItem('page'))
    //   if (currentPage === 2) {
    //     localStorage.setItem('page', JSON.stringify(1))
    //     window.location.reload()
    //   }
    // }

    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
      is_email_verified : true
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }
    if (auth.isLogged === false) {
      var lastLink = { value: window.location.href }
      Cookies.set("lastLink", lastLink, { expires: 1 })
      // window.location.href = "/login"
    }

    let modal;
    if (this.state.showModal === true) {
      modal = (
        <CartModalDev
          isShow={this.state.showModal}
          onHide={() => this.setModal(false)}
          title={this.state.currentModalTitle}
          detailOptions={this.state.currentModal}
          handleData={this.handleOption}
          indexOptionEat={this.state.indexOptionEat}
          indexOptionPay={this.state.indexOptionPay}
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
                  <h5 className='cartList-content-notes'>{food.foodNote}</h5>
                  <h3 className='cartList-content-price'>{Intl.NumberFormat("id-ID").format(food.foodTotalPrice)}</h3>
                </div>

                <div className='cartList-content-detail-right'>
                  <div className='cartList-editButton' onClick={() => this.onEditCart(index, store.mid)}>
                    <div className='cartList-editWord'>EDIT</div>
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
          <div key={index} className='cart-storeBox'>
            <div className='cart-storeBox-header'>
              <div className='cart-storeBox-title'>
                {store.storeName}
              </div>

              <div className='cart-storeBox-distance'>
                {store.storeDistance}
              </div>
            </div>

            <div className='cart-storeBox-content'>
              <h4 className='cart-storeBox-descArea'>
                {store.storeDesc}
              </h4>
            </div>
          </div>
        )
      }
    });

    let totalPaymentShow = storeList.map(store => {
      if (store.mid === currentCartMerchant.mid) {
        let countAllProduct = 0
        store.food.forEach(food => {
          countAllProduct += food.foodTotalPrice
        })
        return countAllProduct
      }
    });

    finalProduct = [
      {
        totalPrice: totalPaymentShow[0],
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
          {
          !this.state.isEmailVerified ?
          <div className='verificationMsg'>
            <div className='message'>Verifikasi Email Anda</div>
            <div className='messageSend'>
              <span>Email Verifikasi Telah Dirim ke Alamat Email Teregistrasi: <span className="txtBold"> {auth.email} </span> </span>. Belum Masuk ? <span className="txtUnderline">Kirim Ulang</span>
            </div>
          </div>
          :
          <div></div>
          }
          <div className='cartTitle'>
            <span className='logopikappCenter' onClick={() => window.history.back()} >
              <img className='LogoPikappCart' src={ArrowBack} alt='' />
            </span>

            <h2 className='confirmationOrder'>Konfirmasi Pesanan Anda</h2>
          </div>

          <div className='cartContent'>
            <div className='cart-LeftSide'>
              <div className='cartList'>
                <div className='cartList-header'>
                  <h4 className='cartList-title'>
                    Item Yang Dibeli
                  </h4>
                </div>

                {contentView}
              </div>
            </div>

            <div className='cart-RightSide'>
              <div className='flex-RightSide'>
                {detailView}

                <div className='cart-foodService' onClick={() => this.handleDetail("eat-method")}>
                  <div className='cart-foodService-header'>
                    <div className='cart-foodService-title'>
                      Pilih Cara Makan Anda
                    </div>

                    <div className='cart-foodService-selectButton' >
                      <img className='cart-foodService-selectIcon' src={ArrowDownColor} alt='' />
                    </div>
                  </div>

                  <div className='cart-foodService-content'>
                    <div className='cart-foodService-descArea'>
                      <span>
                        <img className='cart-foodService-logo' src={eatImage} alt='' />
                      </span>

                      <h3 className='cart-foodService-words'>
                        {this.state.eat_type}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className='cart-paymentService' onClick={() => this.handleDetail("pay-method")}>
                  <div className='cart-paymentService-header'>
                    <div className='cart-paymentService-title'>
                      Bayar Pakai Apa?
                    </div>

                    <div className='cart-paymentService-selectButton'>
                      <img className='cart-paymentService-selectIcon' src={ArrowDownColor} alt='' />
                    </div>
                  </div>

                  <div className='cart-paymentService-content'>
                    <div className='cart-paymentService-descArea'>
                      <span>
                        <img className='cart-paymentService-logo' src={paymentImage} alt='' />
                      </span>

                      <h3 className='cart-paymentService-words'>
                        {this.state.paymentOption}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className='cart-checkoutArea'>
                  <div className='cart-TotalAmount' onClick={() => this.handleDetail("payment-detail")}>
                    <h3 className='cart-TotalAmount-title'>Total Bayar</h3>

                    <div className='cart-TotalAmount-bottom'>
                      <h2 className='cart-TotalAmount-price'>Rp. {Intl.NumberFormat("id-ID").format(totalPaymentShow)}</h2>

                      <img className='cart-TotalAmount-detailArrow' src={ArrowDownColor} alt='' />
                    </div>
                  </div>

                  <div className='cart-OrderButton' onClick={() => this.handlePayment()}>
                    <div className='cart-OrderButton-content'>
                      <span className='cart-OrderButton-Frame'>
                        <img className='cart-OrderButton-checklist' src={checklistLogo} alt='' />
                      </span>

                      <h1 className='cart-OrderButton-word'>PESAN</h1>
                    </div>

                    <span>
                      <img className='cart-OrderButton-orderArrow' src={ArrowRightWhite} alt='' />
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className='cartLayout-mob'>
          <div className='cart-checkoutArea-mob'>

            <div className='cart-TotalAmount-mob' onClick={() => this.handleDetail("payment-detail")}>
              <h3 className='cart-TotalAmount-title-mob'>Total Bayar</h3>

              <div className='cart-TotalAmount-bottom-mob'>
                <h2 className='cart-TotalAmount-price-mob'>Rp. {Intl.NumberFormat("id-ID").format(totalPaymentShow)}</h2>

                <span className='cart-TotalAmount-detailArrowCenter-mob'>
                  <img className='cart-TotalAmount-detailArrow-mob' src={ArrowDownColor} alt='' />
                </span>
              </div>
            </div>

            <div className='cart-OrderButton-mob' onClick={() => this.handlePayment()}>
              <div className='cart-OrderButton-content-mob'>
                <span className='cart-OrderButton-Frame-mob'>
                  <img className='cart-OrderButton-checklist-mob' src={checklistLogo} alt='' />
                </span>

                <h1 className='cart-OrderButton-word-mob'>PESAN</h1>
              </div>

              <span className='cart-OrderButton-orderArrowCenter-mob'>
                <img className='cart-OrderButton-orderArrow-mob' src={ArrowRightWhite} alt='' />
              </span>
            </div>
          </div>
        </div>
        {modal}
        {this.menuDetail()}
        {this.notifModal()}
      </>
    );
  }
}

const Mapstatetoprops = (state) => {
  return {
    AllRedu: state.AllRedu
  }
}

export default connect(Mapstatetoprops, { EditMenuCart, LoadingButton, DoneLoad })(CartView)