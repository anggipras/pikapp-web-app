import React from "react";
import diningTableColor from "../../Asset/Icon/diningTableColor.png";
import takeawayColor from "../../Asset/Icon/takeawayColor.png";
import CashierPayment from "../../Asset/Icon/CashierPayment.png";
import OvoPayment from "../../Asset/Icon/ovo_icon.png";
import DanaPayment from "../../Asset/Icon/dana_icon.png";
import ShopeePayment from "../../Asset/Icon/shopee_icon.png";
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import PromoAlert from "../../Asset/Icon/ic_promo_alert.png";
import NoMatchPromo from "../../Asset/Icon/ic_promo_match.png";
import CartModal from "../../Component/Modal/CartModal";
import CartPromoLimitModal from "../../Component/Modal/CartPromoLimitModal";
import CartCancelModal from "../../Component/Modal/CartCancel";
import { cart } from "../../App";
import Cookies from "js-cookie"
import MenuDetail from '../../Component/Menu/MenuDetail'
import NotifModal from '../../Component/Modal/NotifModal'
import { connect } from "react-redux";
import { EditMenuCart, IsMerchantQR, DataOrder, CustomerName, CustomerPhoneNumber, InsuranceCheckbox, InsurancePrice } from '../../Redux/Actions'
import Loader from 'react-loader-spinner'
import { Link, Redirect } from "react-router-dom";
import { LoadingButton, DoneLoad } from '../../Redux/Actions'
import TourPage from '../../Component/Tour/TourPage';
import { firebaseAnalytics } from '../../firebaseConfig';
import moment from "moment";
import DeliveryIcon from "../../Asset/Icon/delivery.png";
import ShippingDate from "../../Asset/Icon/shipping-date.png";
import PaymentMethod from "../../Asset/Icon/payment-method.png";
import VoucherIcon from "../../Asset/Icon/ic_voucher.png";
import ArrowRight from "../../Asset/Icon/arrowright-icon.png";
import ArrowUp from "../../Asset/Icon/item-arrowup.png";
import ArrowDown from "../../Asset/Icon/item-arrowdown.png";
import MerchantHourStatusIcon from '../../Asset/Icon/ic_clock.png'
import CheckListIcon from '../../Asset/Icon/ic_check_list.png'
import AnalyticsService from "../../Services/analytics.service";
import TransactionService from "../../Services/transaction.service";
import MerchantService from "../../Services/merchant.service";

//json data
import checkShopStatus from './CartCheckShopStatus.json'

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
      selectedPromo: this.props.selectedPromo ? this.props.selectedPromo : null,
      notMatchPromo: this.props.notMatchPromo !== undefined ? this.props.notMatchPromo : false,
      changeUI: true,
      showModal: false,
      showModalCheckPromo: false,
      showModalPromoLimit: false,
      cancelCartModal: false,
      currentModalTitle: "",
      paymentOption: "Pembayaran Di Kasir",
      paymentType: "WALLET_OVO",
      biz_type: this.props.noTable !== undefined ? this.props.noTable > 0 ? "DINE_IN" : "TAKE_AWAY" : "DINE_IN",
      eat_type: this.props.noTable !== undefined ? this.props.noTable > 0 ? "Makan Di Tempat" : "Bungkus / Takeaway" : "Makan Di Tempat",
      indexOptionEat: this.props.noTable !== undefined ? this.props.noTable > 0 ? 0 : 1 : 0,
      indexOptionPay: 0,
      currentModal: [
        {
          image: "cashier",
          option: "Pembayaran Di Kasir",
          icon: CashierPayment,
          type: "PAY_BY_CASHIER"
        },
        {
          image: "ovo",
          option: "OVO",
          icon: OvoPayment,
          type: "WALLET_OVO"
        },
        {
          image: "dana",
          option: "DANA",
          icon: DanaPayment,
          type: "WALLET_DANA"
        },
        {
          image: "shopee",
          option: "ShopeePay",
          icon: ShopeePayment,
          type: "WALLET_SHOPEEPAY"
        }
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
      isShowItem : undefined,
      disabledSubmitButton : true,
      insuranceCheckbox : false,
      insurancePrice : 0,
      cartReduData : {
        pickupType: -1, //PICKUP PAGE
        pickupTitleType: "",
        fullAddress: "",
        postalCode : "",
        shipperNotes: "",
        shipperName: "",
        shipperPrice: "",
        shippingDateType : "", //SHIPPING DATE PAGE
        shippingDate : "",
        paymentType: -1, //PAYMENT PAGE
        paymentImage : null,
        paymentMethod : "",
        phoneNumber: "",
        customerName: "",
        customerPhoneNumber: "",
        lat : 0,
        lng : 0,
        district : "",
        city : "",
        province : "",
        formattedAddress : "",
        shippingType : "",
        shippingName : "",
        shippingPrice : 0,
        shippingDesc : "",
        shippingCode : "",
        courierServiceType : ""
      },
      paymentImage: "",
      merchantHourStatus: null, // OPEN OR CLOSE
      merchantHourOpenTime: null, // ex: 10:00
      merchantHourGracePeriod: null, // ex: 30
      merchantHourNextOpenDay: null, // ex: Sunday
      merchantHourNextOpenTime: null, // ex: 10:00
      merchantHourAutoOnOff: null // ex: true or false
    };

    componentDidMount() {
      if(window.innerWidth < 700) {
        this.state.steptour.splice(2,1);
      } else {
        this.state.steptour.pop();
      }

      if(this.props.CartRedu) {

        this.state.currentModal.forEach((value) => {
          if(value.type == this.props.CartRedu.paymentTitleType) {
            this.setState({ paymentImage: value.icon, paymentType: value.type, paymentOption: value.option });
          }
        })

        this.setState({ cartReduData : this.props.CartRedu, insuranceCheckbox : this.props.CartRedu.insuranceCheckbox, insurancePrice : this.props.CartRedu.insurancePrice });
      }

      if(this.props.CartRedu.pickupType === 0) {
        this.setState({ cartReduData : { ...this.props.CartRedu, shippingPrice: 0 }, insuranceCheckbox : false, insurancePrice : 0});
      }
      
      if(this.props.CartRedu.shippingDate) {
        this.setState({ customerShippingDate : moment(new Date(this.props.CartRedu.shippingDate)).format("Do MMMM YYYY, H:mm")})
      }

      if(this.props.CartRedu.customerName) {
        this.setState({ customerName : this.props.CartRedu.customerName })
      }
      if(this.props.CartRedu.customerPhoneNumber) {
        this.setState({ customerPhoneNumber : this.props.CartRedu.customerPhoneNumber })
      }

      if(this.props.CartRedu.customerName !== "" && this.props.CartRedu.customerPhoneNumber !== "" && this.props.CartRedu.pickupType !== -1 && this.props.CartRedu.shippingDate !== "" && this.props.CartRedu.paymentType !== -1) {
        this.setState({ disabledSubmitButton : false})
      }

      if(this.state.cartReduData.customerName !== "" && this.state.cartReduData.customerPhoneNumber !== "" && this.state.cartReduData.pickupType !== -1 && this.state.cartReduData.shippingDate !== "" && this.state.cartReduData.paymentType !== -1) {
        this.setState({ disabledSubmitButton : false})
      }

      this.getShopStatus();
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
              icon: CashierPayment
            },
            {
              image: "ovo",
              option: "OVO",
              icon: OvoPayment
            },
            {
              image: "dana",
              option: "DANA",
              icon: DanaPayment
            },
            {
              image: "shopee",
              option: "ShopeePay",
              icon: ShopeePayment
            }
          ],
        });
      } else if (data === "payment-detail") {
        this.setState({ showModal: true });
        this.setState({ currentModalTitle: "Rincian Pembayaran" });
        this.setState({
          currentModal: finalProduct
        });
      } else if (data === "payment-checking") {
        if (!this.state.disabledSubmitButton) {
          if (this.state.notMatchPromo) {
            this.setState({ showModalCheckPromo: true });
            this.setState({ currentModalTitle: "Pesanan yang Anda buat tidak dapat dibatalkan. Anda yakin ingin melakukan pembayaran?" });
          } else {
            this.setState({ showModal: true });
            this.setState({ currentModalTitle: "Pesanan yang Anda buat tidak dapat dibatalkan. Anda yakin ingin melakukan pembayaran?" });
          }
        }
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

        let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
  
        if (newAllCart.length < 2) {
          cart.splice(1)
          localStorage.setItem("cart", JSON.stringify(newAllCart))
          // TEMPORARY NAVIGATION TRIAL
          window.history.go(-1)
          // window.location.href = '/' + selectedMerchant[0].username;
          this.removeStorage()
        } else {
          let filterMerchantCart = newAllCart.filter(valueCart => {
            return valueCart.mid === mid
          })
          localStorage.setItem("cart", JSON.stringify(newAllCart))
          if (filterMerchantCart.length) {
            this.setState({ updateData: 'updated' })
          } else {
            // TEMPORARY NAVIGATION TRIAL
            // window.location.href = '/' + selectedMerchant[0].username;
            window.history.go(-1)
          }
        }
      }

      this.setState({ insurancePrice: 0});
      this.setState({ insuranceCheckbox: false });
      this.props.InsurancePrice(0);
      this.props.InsuranceCheckbox(false);
      this.checkingTotalPriceWithPromo()
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
      this.setState({ updateData: 'updated' });
      
      this.setState({ insurancePrice: 0});
      this.setState({ insuranceCheckbox: false });
      this.props.InsurancePrice(0);
      this.props.InsuranceCheckbox(false);
      this.checkingTotalPriceWithPromo()
    }

    checkingTotalPriceWithPromo = () => {
      if (JSON.parse(localStorage.getItem("MANUAL_SELECTED_PROMO"))) {
        const currentCartMerchant = JSON.parse(Cookies.get("currentMerchant"))
        let storageData = JSON.parse(localStorage.getItem('cart'))
        let storeList = storageData.filter((store) => {
          if (store.mid !== "") {
            return store;
          }
        });
        let selectedMerch = storeList.filter(store => {
          return store.mid === currentCartMerchant.mid
        });
  
        let totalPaymentCart = 0
        selectedMerch[0].food.forEach(thefood => {
          totalPaymentCart += thefood.foodTotalPrice
        })

        let getSelectedPromo = JSON.parse(localStorage.getItem("MANUAL_SELECTED_PROMO"))
        let promoMinPrice = parseInt(getSelectedPromo.promo_min_order)
        if (getSelectedPromo.promo_payment_method.includes(this.state.paymentType) && getSelectedPromo.promo_shipment_method.includes(this.state.cartReduData.pickupTitleType) && totalPaymentCart >= promoMinPrice) {
          Cookies.set("MANUAL_NOTMATCHPROMO", { theBool: false })
          this.setState({ notMatchPromo: false })
        } else {
          Cookies.set("MANUAL_NOTMATCHPROMO", { theBool: true })
          Cookies.remove("INDEX_SELECTED_PROMO_DINEIN")
          Cookies.remove("INDEX_SELECTED_PROMO_MANUAL")
          this.setState({ notMatchPromo: true })
        }
      }
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

    handleCheckingShopStatus = () => {
      let res = {
        data: checkShopStatus // cartcheckshopstatus json data
      }
      if (res.data.results.minutes_remaining < "2") {
        if (this.state.cartReduData.shippingDateType == 1) {
          this.checkingPromoLimitCase()
        } else {
          this.setState({ cancelCartModal: true })
        }
      } else if(res.data.results.minutes_remaining < "31") {
        if (this.state.cartReduData.shippingDateType == 1) {
          this.checkingPromoLimitCase()
        } else {
          this.setState({ cancelCartModal: true })
        }
      } else {
        this.checkingPromoLimitCase()
      }
    }

    checkingPromoLimitCase = () => {
      if (this.props.selectedPromo) {
        if (!this.state.notMatchPromo) {
          this.handleCheckingPromoLimit()
        } else {
          this.handlePayment()
        }
      } else {
        this.handlePayment()
      }
    }

    handleCheckingPromoLimit = () => {
      let res = {
        status: 200
      }
      if (res.status == 200) {
        this.handlePayment()
      } else {
        this.setState({ showModalPromoLimit: true })
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

      let extraMenus = [];
  
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
            extraMenus.push({
              extra_menu_name : val2.name,
              extra_menu_price : val2.price
            })
            newlistArr += `${val2.name}, `
            extraprice += val2.price
          })
        })
  
        newlistArr += selectMenu.foodNote
        extraprice = extraprice.toString()
  
        selectedProd.push({
          product_id: selectMenu.productId,
          product_name: selectMenu.foodName,
          product_price: Number(selectMenu.foodPrice),
          notes: selectMenu.foodNote,
          quantity: selectMenu.foodAmount,
          discount: 0,
          extra_price: Number(extraprice),
          extra_menus: extraMenus,
        })
      })
  
      let newDate = new Date().getTime()
      let expiryDate = ''
      if (this.state.paymentType === 'PAY_BY_CASHIER') {
        newDate += 1800000
        phoneNumber = ''
      } else if (this.state.paymentType === 'WALLET_OVO') {
        newDate += 60000
      } else if (this.state.paymentType === 'WALLET_DANA' || this.state.paymentType === 'WALLET_SHOPEEPAY') {
        newDate += 600000
      }
      expiryDate = moment(new Date(newDate)).format("yyyy-MM-DD HH:mm:ss")

      let customerInfo = {
        customer_name: this.state.customerName,
        customer_address: this.state.cartReduData.fullAddress,
        customer_address_detail: this.state.cartReduData.shipperNotes,
        customer_phone_number: "0" + this.state.customerPhoneNumber,
        latitude: this.state.cartReduData.lat,
        longitude: this.state.cartReduData.lng,
        subdistrict_name: this.state.cartReduData.district,
        city: this.state.cartReduData.city,
        province: this.state.cartReduData.province,
        postal_code: this.state.cartReduData.postalCode,
      }

      let pickupType = ''
      let shipperName = ''
      let shipperType = ''
      let shipperCategoryType = ''
      let shipperPrice = 0

      if(this.state.cartReduData.pickupType === 0) {
        pickupType = "PICKUP";
        shipperName = "Pickup Sendiri";
        shipperPrice = 0;
        shipperType = "";
        shipperCategoryType = "";
        customerInfo.customer_address = "";
        customerInfo.customer_address_detail = "";
        customerInfo.latitude = 0;
        customerInfo.longitude = 0;
        customerInfo.subdistrict_name = "";
        customerInfo.city = "";
        customerInfo.province = "";
        customerInfo.postal_code = "";
      } else {
        pickupType = "DELIVERY";
        shipperName = this.state.cartReduData.shippingCode;
        shipperPrice = this.state.cartReduData.shippingPrice;
        shipperType = this.state.cartReduData.courierServiceType;
        shipperCategoryType = this.state.cartReduData.shippingType;
      }

      let shippingTime = '';
      let shippingType = '';

      if(this.state.cartReduData.shippingDateType === 0) {
        shippingTime = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
        shippingType = "NOW";
      } else {
        shippingTime = moment(new Date(this.state.cartReduData.shippingDate)).format("yyyy-MM-DD HH:mm:ss");
        shippingType = "CUSTOM";
      }

      let shippingMethod = {
        shipping_method: shipperName,
        shipping_cost: shipperPrice,
        shipping_time: shippingTime,
        shipping_time_type: shippingType,
        shipping_insurance: this.state.insurancePrice,
        shipping_service_type: shipperType,
        shipping_service_type_category: shipperCategoryType
      }

      let totalBeforeDiscount = finalProduct[0].totalPrice + Number(shipperPrice) + this.state.insurancePrice
      let totalPayment = finalProduct[0].totalPrice + Number(shipperPrice) + this.state.insurancePrice - finalProduct[0].discountPrice
  
      var requestData = {
        products: selectedProd,
        shipping : shippingMethod,
        customer : customerInfo,
        mid: currentCartMerchant.mid,
        order_type: pickupType,
        order_platform: "PIKAPP",
        total_product_price: finalProduct[0].totalPrice,
        payment_method: this.state.paymentType,
        billing_phone_number: this.state.cartReduData.phoneNumber,
        order_status: "OPEN",
        subtotal: totalBeforeDiscount,
        total_discount: finalProduct[0].discountPrice,
        total_payment: totalPayment,
        expiry_date: expiryDate,
        campaign_id: this.props.selectedPromo ? !this.state.notMatchPromo ? this.props.selectedPromo.promo_campaign_id : 0 : 0,
      }

      if(this.state.paymentType === 'WALLET_OVO') {
        this.setState({ successMessage: 'Silahkan Bayar melalui OVO' })
        setTimeout(() => {
          let filterOtherCart = storageData.filter(valFilter => {
            return valFilter.mid !== currentCartMerchant.mid
          })
          var dataOrder = {
            transactionId : "1a2b3c4d5e6f7g",
            totalPayment : requestData.total_payment,
            paymentType : this.state.paymentType,
            transactionTime : newDate
          };
          this.props.DataOrder(dataOrder);
          localStorage.setItem("payment", JSON.stringify(dataOrder));
          localStorage.setItem("cart", JSON.stringify(filterOtherCart))
          localStorage.removeItem("lastTable")
          localStorage.removeItem("fctable")
          localStorage.removeItem("counterPayment");
          this.removeStorage()
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
            transactionId : "1a2b3c4d5e6f7g",
            totalPayment : requestData.total_payment,
            paymentType : this.state.paymentType,
            transactionTime : newDate
          };
          this.props.DataOrder(dataOrder);
          localStorage.setItem("payment", JSON.stringify(dataOrder));
          localStorage.setItem("cart", JSON.stringify(filterOtherCart))
          localStorage.removeItem("lastTable")
          localStorage.removeItem("fctable")
          localStorage.removeItem("counterPayment");
          this.removeStorage()
        }, 1000);
      }
      else if(this.state.paymentType === 'WALLET_SHOPEEPAY') {
        this.setState({ successMessage: 'Silahkan Bayar melalui ShopeePay' })
        setTimeout(() => {
          let filterOtherCart = storageData.filter(valFilter => {
            return valFilter.mid !== currentCartMerchant.mid
          })
          var dataOrder = {
            transactionId : "1a2b3c4d5e6f7g",
            totalPayment : requestData.total_payment,
            paymentType : this.state.paymentType,
            transactionTime : newDate
          };
          this.props.DataOrder(dataOrder);
          localStorage.setItem("payment", JSON.stringify(dataOrder));
          localStorage.setItem("cart", JSON.stringify(filterOtherCart))
          localStorage.removeItem("lastTable")
          localStorage.removeItem("fctable")
          localStorage.removeItem("counterPayment");
          this.removeStorage()
        }, 1000);
      }
    }

    removeStorage = () => {
      localStorage.removeItem("SHIPMENT_TYPE")
      localStorage.removeItem("MANUAL_PAYMENT_TYPE")
      localStorage.removeItem("MANUAL_PHONE_NUMBER")
      localStorage.removeItem("MANUAL_SELECTED_PROMO")
      localStorage.removeItem("SHIPPERNOTES")
      localStorage.removeItem("SHIPPINGTYPE")
      localStorage.removeItem("SHIPPING_WITH_COURIER")
      localStorage.removeItem("FULLADDRESS")
      localStorage.removeItem("FORMATTEDADDRESS")
      localStorage.removeItem("LAT")
      localStorage.removeItem("LNG")
      localStorage.removeItem("DISTRICT")
      localStorage.removeItem("CITY")
      localStorage.removeItem("POSTALCODE")
      localStorage.removeItem("PROVINCE")
      Cookies.remove("MANUAL_NOTMATCHPROMO")
      Cookies.remove("MANUAL_TOTALPAYMENT")
      Cookies.remove("SHIPMENTDATETYPE")
      Cookies.remove("SHIPMENTDATE")
      Cookies.remove("MANUAL_CUSTOMER_NAME")
      Cookies.remove("MANUAL_CUSTOMER_PHONENUM")
      Cookies.remove("INDEX_SELECTED_PROMO_DINEIN")
      Cookies.remove("INDEX_SELECTED_PROMO_MANUAL")
    }
  
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
      // return <div>
      //   <span className='cartmanual-List-content-notes' style={{fontWeight: "bold", color: "black"}}>Tambahan : <span className='cartmanual-List-content-choice' style={{display: "flex"}}>{newlistArr}</span></span>
        
      //   </div>
      return <div className='cart-manual-content-choice' style={{display: "flex", fontWeight: "bold", color: "black"}}>
        Tambahan<div style={{marginLeft: "5px", marginRight: "5px"}}>:</div><span className='cart-manual-content-notes'>{newlistArr}</span>
        </div>
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

      this.setState({ insurancePrice: 0});
      this.setState({ insuranceCheckbox: false });
      this.props.InsurancePrice(0);
      this.props.InsuranceCheckbox(false);

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
      this.setMenuDetail(false)
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

      var reqHeader = {
        tableNumber: tableNumber.toString()
      }
  
      var reqBody = {
        mid: this.state.themid,
        pid: this.state.currentData.productId,
        notes: newNotes,
        qty: currentExt.detailCategory[0].amount,
      }

      this.setState({ insurancePrice: 0});
      this.setState({ insuranceCheckbox: false });
      this.props.InsurancePrice(0);
      this.props.InsuranceCheckbox(false);
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
      Cookies.set("MANUAL_CUSTOMER_NAME", { custName: e.target.value })
      this.props.CustomerName(e.target.value);

      if(e.target.value !== "" && this.state.customerPhoneNumber !== "" && this.state.cartReduData.pickupType !== -1 && this.state.cartReduData.shippingDate !== "" && this.state.cartReduData.paymentType !== -1) {
        this.setState({ disabledSubmitButton : false})
      } else {
        this.setState({ disabledSubmitButton : true})
      }
    }

    handleCustomerPhoneNumber = (e) =>{
      this.setState({ customerPhoneNumber: e.target.value});
      Cookies.set("MANUAL_CUSTOMER_PHONENUM", { phoneNum: e.target.value })
      this.props.CustomerPhoneNumber(e.target.value);

      if(this.state.customerName !== "" && e.target.value !== "" && this.state.cartReduData.pickupType !== -1 && this.state.cartReduData.shippingDate !== "" && this.state.cartReduData.paymentType !== -1) {
        this.setState({ disabledSubmitButton : false})
      } else {
        this.setState({ disabledSubmitButton : true})
      }
    }

    handleShowMenu = (status) => {
      this.setState({ isShowItem: status });
    }

    handleInsurancePrice = (e) => {
      if (e.target.checked) {
        let totalPayment = finalProduct[0].totalPrice
        let insurance = totalPayment * 0.5 / 100;

        let finalNumber = 0;

        if(insurance % 0.5 === 0) {
          finalNumber = Math.ceil(insurance);
        } else {
          finalNumber = Math.floor(insurance);
        }

        this.setState({ insurancePrice: finalNumber});
        this.setState({ insuranceCheckbox: e.target.checked });

        this.props.InsurancePrice(finalNumber);
        this.props.InsuranceCheckbox(e.target.checked);
        if (JSON.parse(localStorage.getItem("SHIPPING_WITH_COURIER"))) {
          let shipmentWithCourier = JSON.parse(localStorage.getItem("SHIPPING_WITH_COURIER"))
          let shippingWithCourier = {
            shippingName: shipmentWithCourier.shippingName,
            shippingPrice: shipmentWithCourier.shippingPrice,
            shippingDesc: shipmentWithCourier.shippingDesc,
            courierServiceType: shipmentWithCourier.courierServiceType,
            shippingCode: shipmentWithCourier.shippingCode,
            insuranceCheckbox: e.target.checked,
            insurancePrice: finalNumber
          }
          localStorage.setItem("SHIPPING_WITH_COURIER", JSON.stringify(shippingWithCourier))
        }
      } else {
        this.setState({ insurancePrice: 0});
        this.setState({ insuranceCheckbox: e.target.checked });

        this.props.InsurancePrice(0);
        this.props.InsuranceCheckbox(e.target.checked);
        if (JSON.parse(localStorage.getItem("SHIPPING_WITH_COURIER"))) {
          let shipmentWithCourier = JSON.parse(localStorage.getItem("SHIPPING_WITH_COURIER"))
          let shippingWithCourier = {
            shippingName: shipmentWithCourier.shippingName,
            shippingPrice: shipmentWithCourier.shippingPrice,
            shippingDesc: shipmentWithCourier.shippingDesc,
            courierServiceType: shipmentWithCourier.courierServiceType,
            shippingCode: shipmentWithCourier.shippingCode,
            insuranceCheckbox: e.target.checked,
            insurancePrice: 0
          }
          localStorage.setItem("SHIPPING_WITH_COURIER", JSON.stringify(shippingWithCourier))
        }
      }
    }

    getShopStatus() {
      let res = {
        data: checkShopStatus // cartcheckshopstatus json data
      }
      this.setState({ 
        merchantHourStatus: res.data.results.merchant_status, 
        merchantHourOpenTime: res.data.results.open_time, 
        merchantHourGracePeriod: res.data.results.minutes_remaining,
        merchantHourNextOpenDay: res.data.results.next_open_day,
        merchantHourNextOpenTime: res.data.results.next_open_time,
        merchantHourAutoOnOff: res.data.results.auto_on_off
       })
      if (!res.data.results.auto_on_off) {
        this.setState({ disabledSubmitButton: true })
      }
    }

    merchantHourStatusWarning = () => {
      if (this.state.merchantHourAutoOnOff) {
        if (this.state.merchantHourStatus == "CLOSE") {
          const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
          const weekdayId = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
          let nowDate = new Date()
          if (weekday[nowDate.getDay()] == this.state.merchantHourNextOpenDay) {
            return (
              <div className="merchant-hour-status-layout" style={{backgroundColor: "#dc6a84"}}>
                <img className="merchant-hour-status-icon" src={MerchantHourStatusIcon} />
                <div className="merchant-hour-status-text">Tutup, Buka Hari ini Pukul {this.state.merchantHourOpenTime} WIB</div>
              </div>
            )
          } else if(weekday[nowDate.getDay()+1] == this.state.merchantHourNextOpenDay) {   
            return (
              <div className="merchant-hour-status-layout" style={{backgroundColor: "#dc6a84"}}>
                <img className="merchant-hour-status-icon" src={MerchantHourStatusIcon} />
                <div className="merchant-hour-status-text">Tutup, Buka Besok Pukul {this.state.merchantHourNextOpenTime} WIB</div>
              </div>
            )
          } else {
            let nextOpenDay = weekday.indexOf(this.state.merchantHourNextOpenDay)
            let finalNextOpenDay = weekdayId[nextOpenDay]
            return (
              <div className="merchant-hour-status-layout" style={{backgroundColor: "#dc6a84"}}>
                <img className="merchant-hour-status-icon" src={MerchantHourStatusIcon} />
                <div className="merchant-hour-status-text">Tutup, Buka Hari {finalNextOpenDay} Pukul {this.state.merchantHourNextOpenTime} WIB</div>
              </div>
            )
          }
        } else if (this.state.merchantHourStatus == "OPEN") {
          if (this.state.merchantHourGracePeriod <= 30) {
            return (
              <div className="cart-merchant-hour-status-layout" style={{backgroundColor: "#f4b55b"}}>
                <div className="cart-merchant-hour-status-text">Toko akan Tutup {this.state.merchantHourGracePeriod} Menit Lagi</div>
              </div>
            )
          } else {
            return null
          }
        } else {
          return null
        }
      } else {
        if (this.state.merchantHourAutoOnOff != null) {
          return (
            <div className="merchant-hour-status-layout" style={{backgroundColor: "#dc6a84"}}>
              <img className="merchant-hour-status-icon" src={MerchantHourStatusIcon} />
              <div className="merchant-hour-status-text">Toko Tutup Sementara</div>
            </div>
          )
        } else {
          return null
        }
      }
    }

    handleCheckingPromo = () => {
      this.setState({ showModalCheckPromo: false, showModal: true })
    }
  
    setModalPromo = () => {
      this.setState({ showModalCheckPromo: false })
    }

    detachPromo = () => {
      localStorage.removeItem("MANUAL_SELECTED_PROMO")
      Cookies.remove("MANUAL_NOTMATCHPROMO")
      Cookies.remove("INDEX_SELECTED_PROMO_DINEIN")
      Cookies.remove("INDEX_SELECTED_PROMO_MANUAL")
      this.setState({ showModalPromoLimit: false, notMatchPromo: false, selectedPromo: null })
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
        let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
        window.location.href = '/' + selectedMerchant[0].username;
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
            confirmPay={this.handleCheckingShopStatus}
          />
        );
      } else {
        modal = <></>
      }

      let promoModal
      if (this.state.showModalCheckPromo) {
        promoModal = (
          <CartModal
            isShow={this.state.showModalCheckPromo}
            onHide={() => this.setModalPromo()}
            title="Pesanan yang Anda buat tidak dapat dibatalkan. Anda yakin ingin melakukan pembayaran?"
            titlePromo="Promo tidak dapat digunakan. Anda yakin ingin melanjutkan pembayaran?"
            confirmPromo={this.handleCheckingPromo}
          />
        )
      } else {
        promoModal = <></>
      }

      // Promo Modal Limit
      let promoLimitModal;
      if (this.state.showModalPromoLimit === true) {
        promoLimitModal = (
          <CartPromoLimitModal
            isShow={this.state.showModalPromoLimit}
            onHide={() => this.detachPromo()}
          />
        );
      } else {
        promoLimitModal = <></>
      }

      // Cart Cancel Modal
      let cartCancelModal;
      if (this.state.cancelCartModal === true) {
        cartCancelModal = (
          <CartCancelModal
            isShow={this.state.cancelCartModal}
            onHide={() => this.setState({ cancelCartModal: false })}
          />
        );
      } else {
        cartCancelModal = <></>
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
        let diffFood = [];
        if(this.state.isShowItem === false || this.state.isShowItem === undefined) {
          diffFood.push(store.food[0]);
        } else {
          diffFood = store.food;
        }
        if (store.mid === currentCartMerchant.mid) {
          storeFood = diffFood.map((food, index) => {
            return (
              <div key={index} className='cartmanual-List-content'>
                <div className='cartmanual-List-content-frame'>
                  <img className='cartmanual-List-content-image' src={food.foodImage} alt='' />
                </div>
  
                <div className='cartmanual-List-content-detail'>
                  <div className='cartmanual-List-content-detail-left'>
                    <h2 className='cartmanual-List-content-title'>{food.foodName}</h2>
                    {this.newListAllChoices(food)}
                    <h5 className='cartmanual-List-content-notes' style={{display: food.foodNote == ""? "none":"block"}}>Catatan : {food.foodNote}</h5>
                    <h3 className='cartmanual-List-content-price'>Rp {Intl.NumberFormat("id-ID").format(food.foodTotalPrice)}</h3>
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

      let detailView = storeList.map((store, index) => {
        if (store.mid === currentCartMerchant.mid) {
          return (
            <div key={index} className='cartmanual-customerinfo'>
              <div className='cartmanual-customerinfo-header'>
                <div className='cartmanual-customerinfo-title'>
                  Detail Restoran
                </div>
              </div>

              <div className='cartmanual-customerinfo-content'>
                <h2 className='cartmanual-detailcontent-address'>
                  {store.storeName}
                </h2>

                <h4 className='cartmanual-detailcontent-addressdesc'>
                  {store.storeAdress}
                </h4>
              </div>
            </div>
          )
        }
      });
  
      let totalPaymentShow = 0
      let totalDiscountShow = 0
      let totalItem = 0
      let selectedMerch = storeList.filter(store => {
        return store.mid === currentCartMerchant.mid
      });
      
      totalItem = selectedMerch[0].food.length;
      selectedMerch[0].food.forEach(thefood => {
        totalPaymentShow += thefood.foodTotalPrice
      })

      // CALCULATION OF PERCENTAGE/NOMINAL TOWARDS TOTAL PRICE START
      if (this.state.selectedPromo) {
        if (this.state.notMatchPromo) {
          totalDiscountShow = 0
        } else {
          if (this.state.selectedPromo.discount_amt_type == "PERCENTAGE") {
            let totalTowardPercentage = (this.state.selectedPromo.discount_amt / 100) * totalPaymentShow
            let mathRoundTotal = Math.round(totalTowardPercentage)
            if (mathRoundTotal > this.state.selectedPromo.promo_max_discount) {
              totalDiscountShow = parseInt(this.state.selectedPromo.promo_max_discount)
            } else {
              totalDiscountShow = mathRoundTotal
            }
          } else {
            totalDiscountShow = this.state.selectedPromo.discount_amt
          }
        }
      } else {
        totalDiscountShow = 0
      }
      // CALCULATION OF PERCENTAGE/NOMINAL TOWARDS TOTAL PRICE END
  
      finalProduct = [
        {
          totalPrice: totalPaymentShow,
          discountPrice: totalDiscountShow,
        },
      ]
      Cookies.set("MANUAL_TOTALPAYMENT", totalPaymentShow)

      let totalFinalProduct = totalPaymentShow + Number(this.state.cartReduData.shippingPrice) + this.state.insurancePrice - totalDiscountShow;
  
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
          <div className='cartmanual-Layout'>
            <div className="cartmanual-header">
                <span className="cartmanual-back" onClick={() => window.history.back()}>
                    <img className="cartmanual-backicon" src={ArrowBack} alt='' />
                </span>
                <div className="cartmanual-title">Checkout</div>
            </div>
            {this.merchantHourStatusWarning()}

            {
              this.state.notMatchPromo ?
              <div className="promo-alert-paymentnotselected">
                  <span className="promo-alert-icon">
                      <img className="alert-icon" src={PromoAlert} alt='' />
                  </span>

                  <div className="promo-alert-title">Voucher tidak bisa digunakan, silahkan ubah terlebih dahulu</div>
              </div>
              :
              null
            }
  
            <div className='cartmanual-Content'>
              <div className='cartmanual-LeftSide'>
                <div className='cartmanual-List'>
                  <div className='cartmanual-List-header'>
                    <h4 className='cartmanual-List-title'>
                      Keranjang
                    </h4>
                    <h4 className='cartmanual-List-itembox'>
                      {totalItem} Item
                    </h4>
                  </div>
  
                  {contentView}

                  {/* <div className='cartmanual-List-itemaction' onClick={() => this.handleShowMenu(true)} style={{ width: this.state.isShowItem ? "160px" : "210px" }}> */}
                    {
                      totalItem > 1 ?
                      this.state.isShowItem ? 
                      <div className='cartmanual-List-itemaction' onClick={() => this.handleShowMenu(false)} style={{ width: this.state.isShowItem ? "160px" : "210px" }}>
                        <div className='cartmanual-List-hidemenu-word'>Sembunyikan</div>
                        <img className='cartmanual-List-hidemenu-icon' src={ArrowUp}></img>
                      </div>
                      :
                      <div className='cartmanual-List-itemaction' onClick={() => this.handleShowMenu(true)} style={{ width: this.state.isShowItem ? "160px" : "210px" }}>
                        <div className='cartmanual-List-showmenu-word'>Lihat {totalItem-1} pesanan lagi</div>
                        <img className='cartmanual-List-showmenu-icon' src={ArrowDown}></img>
                      </div>
                      :
                      <></>
                    }
                  {/* </div> */}
                </div>
              </div>
  
              <div className='cartmanual-RightSide'>
                <div className='cartmanual-flex-RightSide'>
                  {detailView}
  
                  <div className='cartmanual-customerinfo'>
                    <div className='cartmanual-customerinfo-header'>
                      <div className='cartmanual-customerinfo-title'>
                        Info Pelanggan
                      </div>
                    </div>
  
                    <div className='cartmanual-customerinfo-content'>
                      <div className="cartmanual-infoname">
                        <div className="cartmanual-infoname-title">Nama <span style={{color: "red"}}>*</span></div>
                        <input className="cartmanual-infoname-inputArea" placeholder="Masukkan nama Anda disini..." onChange={this.handleCustomerName} value={this.state.customerName} />
                      </div>

                      <div className="cartmanual-phonenumber">
                        <div className="cartmanual-phonenumber-title">No. Handphone <span style={{color: "red"}}>*</span></div>
                        <div className="cartmanual-phonenumber-layout">
                          <div className="cartmanual-phonenumber-code">+62</div>
                          <input className="cartmanual-phonenumber-inputArea" type='number' inputMode='numeric' placeholder="Masukkan nomor HP Anda disini" onChange={this.handleCustomerPhoneNumber} value={this.state.customerPhoneNumber}/>
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
                          this.state.cartReduData.pickupType != -1 ?
                          <div className='cartmanual-deliverydetail'>
                            <div className="cartmanual-deliverydetail-border"></div>

                            <div className='cartmanual-deliverydetail-desc'>
                              {
                                this.state.cartReduData.pickupType === 1 ?
                                <>
                                  <div className='cartmanual-deliverydetail-title'>Dikirim ke</div>
                                  <div className='cartmanual-deliverydetail-address'>{this.state.cartReduData.formattedAddress}, {this.state.cartReduData.district}, {this.state.cartReduData.city}</div>
                                  {
                                    this.state.cartReduData.shipperNotes != "" ?
                                    <div className='cartmanual-deliverydetail-shipperNotesTitle'>Catatan : <span className='cartmanual-deliverydetail-shipperNotes'>{this.state.cartReduData.shipperNotes}</span></div>
                                    :
                                    null
                                  }
                                  <div className='cartmanual-deliverydetail-shipperLayout'>
                                    <div className='cartmanual-deliverydetail-shipperLayout-shipperName'>{this.state.cartReduData.shippingType} - {this.state.cartReduData.shippingName}</div>
                                    <div className='cartmanual-deliverydetail-shipperLayout-shipperPrice'>Rp. {Intl.NumberFormat("id-ID").format(this.state.cartReduData.shippingPrice)}</div>
                                  </div>
                                  <div className='cartmanual-deliverydetail-insurance'>
                                    <input id="insuranceCheckbox" name="insuranceCheckbox" className="cartmanual-deliverydetail-insurance-check" type="checkbox" checked={this.state.insuranceCheckbox} defaultChecked={this.state.insuranceCheckbox} onChange={this.handleInsurancePrice} />
                                    <div className='cartmanual-deliverydetail-insurance-info'>Asuransi Pengiriman</div>
                                    {/* <label htmlFor="insuranceCheckbox" className='cartmanual-deliverydetail-insurance-info'>Asuransi Pengiriman</label> */}
                                    {/* <img className='cartmanual-deliverydetail-insuranceicon' src={InfoIcon}></img> */}
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

                            {
                              this.state.cartReduData.shippingDateType === 1 ?
                              <div className='cartmanual-shippingdatedetail-desc'>
                                <div>{this.state.customerShippingDate}</div>
                              </div>
                              :
                              <div className='cartmanual-shippingdatedetail-desc'>
                                <div>Sekarang</div>
                              </div>
                            }
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
                          this.state.cartReduData.paymentType != -1 ?
                          <div className='cartmanual-paymentdetail'>
                            <div className="cartmanual-paymentdetail-border"></div>

                            <div className='cartmanual-paymentdetail-desc'>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                  <img style={{height: '25px', width: '25px'}} src={this.state.paymentImage} />
                                  <div style={{marginLeft: '10px'}}>{this.state.paymentOption}</div>
                                </div>
                                {
                                  this.state.cartReduData.phoneNumber !== "" ?
                                  <div>{this.state.cartReduData.phoneNumber}</div>
                                  :
                                  <></>
                                }
                            </div>
                          </div>
                          :
                          null
                        }
                      </div>
                    </div>
                  </div>

                  <div className='promoCart-voucherinfo'>
                    <Link to={{ pathname: "/promo", state: { title : "Pilih Voucher Diskon", alertStatus : { phoneNumber: this.props.CartRedu.phoneNumber, paymentType : this.state.cartReduData.paymentType, pickupType : this.state.cartReduData.pickupType }, cartStatus : { totalPayment: totalPaymentShow }}}} style={{ textDecoration: "none", width: "100%" }}>
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

                            {
                              this.state.selectedPromo != null ?
                              <div className='promoCart-selectiondetail'>
                                <div className="promoCart-selectiondetail-border"></div>

                                <div className='promoCart-selectiondetail-desc'>
                                  <img src={ this.state.notMatchPromo ? NoMatchPromo : CheckListIcon } style={{width: "18px", height: "16px", marginRight: "10px"}} />
                                  <div style={{color: this.state.notMatchPromo ? "#DC6A84" : "#111111"}}>{this.state.selectedPromo.promo_title} {this.state.selectedPromo.discount_amt_type == "PERCENTAGE" ? `${this.state.selectedPromo.discount_amt}%` : null}</div>
                                </div>
                              </div>
                              :
                              null
                            }
                      </div>
                    </Link>
                  </div>

                  <div className='cartmanual-summarypayment'>
                    <div className='cartmanual-detailcontent-payment'>
                      <div>
                      <div className='cartmanual-detailprice-header'>
                        <div className='cartmanual-detailprice-title'>
                          Ringkasan Belanja
                        </div>
                      </div>

                      <div className='cartmanual-detailprice-desc'>
                        <div className='orderDetail-detailprice-word'>
                          <div>Total Harga ({totalItem} Item(s))</div>
                          <div>Rp. {Intl.NumberFormat("id-ID").format(totalPaymentShow)}</div>
                        </div>
                      </div>

                      <div className='cartmanual-detailprice-desc'>
                        <div className='orderDetail-detailDisountPrice-word' style={{color: totalDiscountShow > 0 ? "#4BB7AC" : "#DC6A84"}}>
                          <div>Total Diskon Item</div>
                          <div>{totalDiscountShow > 0 ? "-" : null}Rp. {Intl.NumberFormat("id-ID").format(totalDiscountShow)}</div>
                        </div>
                      </div>

                      <div className='cartmanual-detailprice-desc'>
                        <div className='orderDetail-detailprice-word'>
                          <div>Total Ongkos Kirim</div>
                          <div>Rp. {Intl.NumberFormat("id-ID").format(this.state.cartReduData.shippingPrice)}</div>
                        </div>
                      </div>
                      
                      {
                        this.state.insuranceCheckbox ?
                        <div className='cartmanual-detailprice-desc'>
                          <div className='orderDetail-detailprice-word'>
                            <div>Asuransi Pengiriman</div>
                            <div>Rp. {Intl.NumberFormat("id-ID").format(this.state.insurancePrice)}</div>
                          </div>
                        </div>
                        : 
                        <></>
                      }
                      
                      </div>
                    </div>
                  </div>

                </div>
  
              </div>
            </div>
          </div>
  
          <div className='cartmanual-Layout-mob'>
            <div className='cartmanual-checkoutArea-mob'>
  
              <div className='cartmanual-TotalAmount-mob'>
                <h3 className='cartmanual-TotalAmount-title-mob'>Total Harga</h3>
  
                <div className='cartmanual-TotalAmount-bottom-mob'>
                  <h2 className='cartmanual-TotalAmount-price-mob'>Rp. {Intl.NumberFormat("id-ID").format(totalFinalProduct)}</h2>
                </div>
              </div>
              
              <div className='cartmanual-OrderButton-mob buttonorder' onClick={() => this.handleDetail("payment-checking")} 
              style={{ 
                backgroundColor: this.state.disabledSubmitButton ? '#aaaaaa' : '#4bb7ac', 
                pointerEvents: this.state.disabledSubmitButton ? 'none' : 'auto' 
              }}
              >
                <div className='cartmanual-OrderButton-content-mob'>
                  <h1 className='cartmanual-OrderButton-word-mob'>Buat Pesanan</h1>
                </div>
              </div>
            </div>
          </div>
          {modal}
          {promoModal}
          {promoLimitModal}
          {cartCancelModal}
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
  
  export default connect(Mapstatetoprops, { EditMenuCart, LoadingButton, DoneLoad, IsMerchantQR, DataOrder, CustomerName, CustomerPhoneNumber, InsuranceCheckbox, InsurancePrice })(CartManualView)