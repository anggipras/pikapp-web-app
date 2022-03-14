import React from "react";
import { prominent } from "color.js";
import rgbHex from 'rgb-hex'
import MenuDetail from "../../Component/Menu/MenuDetail";
import queryString from "query-string";
import cartIcon from "../../Asset/Icon/cart_icon.png";
import { Link } from "react-router-dom";
import { address, clientId, secret } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import Cookies from "js-cookie"
import Storeimg from '../../Asset/Illustration/storeimg2.jpg'
import Productimage from '../../Asset/Illustration/storeimg.jpg'
import Logopikapp from '../../Asset/Logo/logo4x.png'
import NotifIcon from '../../Asset/Icon/status.png'
import ProfileIcon from '../../Asset/Icon/avatar.png'
import OpenHourIcon from '../../Asset/Icon/hour.png'
import CoinIcon from '../../Asset/Icon/coin.png'
import LocationIcon from '../../Asset/Icon/location.png'
import PhoneIcon from '../../Asset/Icon/phone.png';
import WhatsAppIcon from '../../Asset/Icon/whatsapp-icon.png';
import StarIcon from '../../Asset/Icon/star.png'
import ArrowIcon from '../../Asset/Icon/arrowselect.png'
import OrderStatusIcon from '../../Asset/Icon/order-icon-green.png'
import HeaderLogo from '../../Asset/Icon/pikapp-logo.png'
import ShoppingBagLogo from '../../Asset/Icon/shopping-bag.png'
import ProductListIcon from '../../Asset/Icon/product-list.png'
import Skeleton from 'react-loading-skeleton'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { ValidQty, OpenSelect, LoadingButton, DoneLoad, IsManualTxn } from '../../Redux/Actions'
import TourPage from '../../Component/Tour/TourPage';
import FailedModal from "../../Component/Modal/FailedModal";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { firebaseAnalytics } from '../../firebaseConfig';
import Carousel from 'react-bootstrap/Carousel';
import { withRouter } from 'react-router-dom';
import VoucherIcon from "../../Asset/Icon/ic_voucher.png";
import ArrowRight from "../../Asset/Icon/arrowright-icon.png";
import MerchantHourStatusIcon from '../../Asset/Icon/ic_clock.png'

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
  listradio: [],
  foodTotal: 0,
};

var currentTotal = 0

class ProductView extends React.Component {
  state = {
    page: 0, //products pagination
    size: 9, //set amount of products to be shown in frontend
    boolpage: false,
    productPage: [], //set how many page of product merchant from backend server
    idCateg: [], //set current product page of specific size of loaded products
    testColor: false,
    testingchange: false, //only for testing, would be remove
    showModal: false, // show customization of selected menu such as qty, notes and more advance choice
    showMenuDet: false, //show menu detail
    isLogin: false,
    data: {
      mid: "",
      username : "",
      title: "",
      image: "",
      logo: "",
      desc: "",
      address: "",
      rating: "",
      phone: "",
      category: "",
      currentData: {
        productId: "",
        category: "",
        foodName: "",
        foodDesc: "",
        foodPrice: 0,
        foodImage: "",
        foodExt: [
          {
            name: "",
            amount: 0,
          },
        ],
      },
    },
    backColor1: "", //merchant info background color
    backColor2: "", //products info background color
    categName: "All Categories", //initial for dropdown select
    allProductsandCategories: [{ category_id: "", category_name: "", order: null, category_products: [] }], //mapping from API
    productCategpersize: [{ category_id: "", category_name: "", order: null, category_products: [] }], //tobe shown in products area
    choosenIndCateg: null, //index of category selected when load more products in selected category
    counterLoad: 0,
    isScrolling: false,
    startTour: false,
    steptour: [
      {
        selector: '',
        content: () => (
          <div>
            <h2>Selamat Datang di PikApp!</h2>
            <br />
            <span>Yuk caritau cara memesan dengan PikApp dengan mudah.</span>
          </div>
        )
      },
      {
        selector: '.product-merchant',
        content: () => (
          <div>
            <h4>Ini adalah Menu Restoran</h4>
            <br />
            <span>Kamu bisa pilih makanan kesukaan kamu disini. Silakan tap untuk dipesan!</span>
          </div>
        )
      }
    ],
    showFailed : false,
    isManualTxn : false,
    linkTreeData : [],
    settings : {
      dots: true,
      autoplay: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1
    },
    totalProduct : 0,
    productAllPage : [{
      productId: "",
      category: "",
      foodName: "",
      foodDesc: "",
      foodPrice: 0,
      foodRating: "",
      foodImage: "",
      foodExt: [
        {
          name: "",
          amount: 0,
        },
      ],
    }],
    productCategpersizeOri: [{ category_id: "", category_name: "", order: null, category_products: [] }], //tobe shown in products area
    searchProduct : "",
    hiddenBanner : false,
    merchantHourStatus: null, // OPEN OR CLOSE
    merchantHourOpenTime: null, // ex: 10:00
    merchantHourGracePeriod: null, // ex: 30
    merchantHourNextOpenDay: null, // ex: Sunday
    merchantHourNextOpenTime: null // ex: 10:00
  };

  timeout = null

  componentDidMount() {
    firebaseAnalytics.logEvent("merchant_detail_visited")
    this.props.ValidQty(0)
    this.setState({ hiddenBanner : false });
    document.body.style.backgroundColor = 'white'
    Cookies.set("lastProduct", window.location.href, { expires: 1 })
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if (Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"));
      this.setState({ isLogin: auth.isLogged });
    }

    if (auth.isLogged === false) {
      var lastLink = { value: window.location.href }
      Cookies.set("lastLink", lastLink, { expires: 1 })
    }
    const value = queryString.parse(window.location.search);
    var mid = "";
    var notab = "";
    var username = "";
    if(value.mid) {
      mid = value.mid;
      notab = value.table || ""
    } else {
      username = this.props.match.params.username;
    }

    this.sendTracking(mid);
    this.getLinkTree(username);

    let addressRoute
    let latitude = -6.28862
    let longitude = 106.71789
    let longlat = { lat: latitude, lon: longitude }
    localStorage.setItem("longlat", JSON.stringify(longlat))
    addressRoute = address + "home/v3/detail/merchant/" + longitude + "/" + latitude + "/"

    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();

    Axios(addressRoute, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "token": "PUBLIC",
        "mid": mid,
        "domain": username
      },
      method: "GET"
    })
      .then((res) => {
        res.data.results.username = username;
        var currentMerchant = {
          mid: "",
          username: "",
          storeName: "",
          storeDesc: "",
          distance: "",
          storeImage: "",
          storeAdress: "",
          storeRating: "",
          storeLogo: "",
          storePhone: "",
          storeCateg: []
        };
        currentMerchant.mid = res.data.results.mid;
        currentMerchant.username = username;
        currentMerchant.storeName = res.data.results.merchant_name;
        currentMerchant.storeDesc = "Desc";
        currentMerchant.distance = res.data.results.merchant_distance;
        currentMerchant.storeImage = res.data.results.merchant_pict;
        currentMerchant.storeAdress = res.data.results.merchant_address;
        currentMerchant.storeRating = res.data.results.merchant_rating;
        currentMerchant.storeLogo = res.data.results.merchant_logo;
        currentMerchant.storePhone = res.data.results.merchant_phone;
        currentMerchant.storeCateg = res.data.results.merchant_categories === null ? [] : res.data.results.merchant_categories

        let selectedStore = []
        selectedStore.push(res.data.results)
        localStorage.setItem('selectedMerchant', JSON.stringify(selectedStore))
        Cookies.set("currentMerchant", currentMerchant, { expires: 1 })

        let selectedMerchant = JSON.parse(localStorage.getItem('selectedMerchant'))
        let filtersizeMerchant = JSON.parse(localStorage.getItem('selectedMerchant'))

        let stateData = { ...this.state.data };
        stateData.mid = currentMerchant.mid;
        stateData.username = currentMerchant.username;
        stateData.title = currentMerchant.storeName;
        stateData.image = currentMerchant.storeImage;
        stateData.logo = currentMerchant.storeLogo;
        stateData.desc = currentMerchant.storeDistance;
        stateData.address = currentMerchant.storeAdress;
        stateData.rating = currentMerchant.storeRating;
        stateData.phone = currentMerchant.storePhone;
        //refactor merchant categories
        let merchantCateg = ""
        currentMerchant.storeCateg.forEach((merchCat, indCat) => {
          if (merchCat) {
            if (indCat === currentMerchant.storeCateg.length - 1) {
              merchantCateg += `${merchCat[0].toUpperCase() + merchCat.slice(1).toLocaleLowerCase()}`
            } else {
              merchantCateg += `${merchCat[0].toUpperCase() + merchCat.slice(1).toLocaleLowerCase()}, `
            }
          }
        })
        stateData.category = merchantCateg
        stateData.notable = notab
        var productCateg = []
        var idCateg = []
        var productPage = []
        productCateg = selectedMerchant[0].categories.map((categ) => {
          idCateg.push(0)
          productPage.push(this.state.size)
          return categ
        })

        productCateg.forEach((val) => {
          val.category_products = []
        })

        productCateg.forEach((categProd) => {
          selectedMerchant[0].products.forEach((allproducts) => {
            if (categProd.category_id == allproducts.product_category) { //category categProd strings, allproducts number !NOTE
              categProd.category_products.push({
                productId: allproducts.product_id,
                category: allproducts.product_category,
                foodName: allproducts.product_name,
                foodDesc: allproducts.product_desc,
                foodPrice: allproducts.product_price,
                foodRating: allproducts.rating,
                foodImage: allproducts.product_picture1,
                foodExt: [
                  {
                    name: "",
                    amount: 0,
                  },
                ],
              })
            }
          })
        })

        let productPerSize = filtersizeMerchant[0].categories.map((categ) => {
          return categ
        })

        productPerSize.forEach((val) => {
          val.category_products = []
        })

        productPerSize.forEach((categProd) => {
          filtersizeMerchant[0].products.forEach((allproducts) => {
            if (categProd.category_id == allproducts.product_category) { //category categProd strings, allproducts number !NOTE
              categProd.category_products.push({
                productId: allproducts.product_id,
                category: allproducts.product_category,
                foodName: allproducts.product_name,
                foodDesc: allproducts.product_desc,
                foodPrice: allproducts.product_price,
                foodRating: allproducts.rating,
                foodImage: allproducts.product_picture1,
                foodExt: [
                  {
                    name: "",
                    amount: 0,
                  },
                ],
              })
            }
          })
        })

        let firstShownProduct = []
        productPerSize.forEach((categProd, indexcategProd) => {
          firstShownProduct.push(categProd)
          let newFilter = categProd.category_products.filter((valProd, indexvalProd) => {
            return indexvalProd < this.state.size
          })
          categProd.category_products = newFilter
          firstShownProduct[indexcategProd].category_products = []
          firstShownProduct[indexcategProd].category_products = newFilter
        })

        var allProduct = []
        res.data.results.products.forEach((product) => {
          allProduct.push({
            productId: product.product_id,
            category: product.product_category,
            foodName: product.product_name,
            foodDesc: product.product_desc,
            foodPrice: product.product_price,
            foodRating: product.rating,
            foodImage: product.product_picture1,
            foodExt: [
              {
                name: "",
                amount: 0,
              },
            ],
          })
        })

        this.setState({ productAllPage : allProduct });

        Axios(address + "merchant/v1/shop/status/", {
          headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
            "token": "PUBLIC",
            "mid": selectedMerchant[0].mid,
          },
          method: "GET"
        }).then((shopStatusRes) => {
          let merchantHourCheckingResult = shopStatusRes.data.results
          this.setState({ 
            merchantHourStatus: merchantHourCheckingResult.merchant_status, 
            merchantHourOpenTime: merchantHourCheckingResult.open_time, 
            merchantHourGracePeriod: merchantHourCheckingResult.minutes_remaining,
            merchantHourNextOpenDay: merchantHourCheckingResult.next_open_day,
            merchantHourNextOpenTime: merchantHourCheckingResult.next_open_time
           })
          this.setState({ data: stateData, allProductsandCategories: productCateg, productCategpersize: productPerSize, idCateg, productPage });
          this.setState({ productCategpersizeOri : this.state.productCategpersize });
          document.addEventListener('scroll', this.loadMoreMerchant)
          document.addEventListener('scroll', this.onScrollCart)

          if (localStorage.getItem("productTour") == 1) {
            if (this.props.AuthRedu.isMerchantQR === false) {
              this.state.steptour.shift();
            }
            this.setState({ startTour: true });
          }
          else if ((localStorage.getItem('merchantFlow') == 1) && (this.props.AuthRedu.isMerchantQR === true)) {
            this.setState({ startTour: true });
          }

          if(value.mid) {
            this.setState({ isManualTxn : false });
            Cookies.set("isManualTxn", 0)
            this.props.IsManualTxn(false);
            localStorage.setItem("isManualTxn", false);
          } else {
            this.setState({ isManualTxn : true });
            Cookies.set("isManualTxn", 1)
            this.props.IsManualTxn(true);
            localStorage.setItem("isManualTxn", true);
          }

          this.setState({ totalProduct : res.data.results.products.length });
        }).catch((err) => {
          this.setState({ data: stateData, allProductsandCategories: productCateg, productCategpersize: productPerSize, idCateg, productPage });
          this.setState({ productCategpersizeOri : this.state.productCategpersize });
          document.addEventListener('scroll', this.loadMoreMerchant)

          if (localStorage.getItem("productTour") == 1) {
            if (this.props.AuthRedu.isMerchantQR === false) {
              this.state.steptour.shift();
            }
            this.setState({ startTour: true });
          }
          else if ((localStorage.getItem('merchantFlow') == 1) && (this.props.AuthRedu.isMerchantQR === true)) {
            this.setState({ startTour: true });
          }
        })

        // let newImage = Storeimg
        // Axios.get(currentMerchant.storeImage)
        //   .then(() => {
        //     newImage = currentMerchant.storeImage
        //     prominent(newImage, { amount: 3 }).then((color) => {
        //       // return RGB color for example [241, 221, 63]
        //       if (color.length < 3) {
        //         var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
        //         var productColor = rgbHex(color[1][0], color[1][1], color[1][2])
        //       } else {
        //         var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
        //         var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
        //       }
        //       this.brightenColor(merchantColor, 70, productColor, 60)
        //       this.setState({ data: stateData, allProductsandCategories: productCateg, productCategpersize: productPerSize, idCateg, productPage });
        //       this.setState({ productCategpersizeOri : this.state.productCategpersize });
        //       document.addEventListener('scroll', this.loadMoreMerchant)
        //       document.addEventListener('scroll', this.onScrollCart)
        //     });

        //     if (localStorage.getItem("productTour") == 1) {
        //       if (this.props.AuthRedu.isMerchantQR === false) {
        //         this.state.steptour.shift();
        //       }
        //       this.setState({ startTour: true });
        //     }
        //     else if ((localStorage.getItem('merchantFlow') == 1) && (this.props.AuthRedu.isMerchantQR === true)) {
        //       this.setState({ startTour: true });
        //     }

        //     if(value.mid) {
        //       this.setState({ isManualTxn : false });
        //       Cookies.set("isManualTxn", 0)
        //       this.props.IsManualTxn(false);
        //       localStorage.setItem("isManualTxn", false);
        //     } else {
        //       this.setState({ isManualTxn : true });
        //       Cookies.set("isManualTxn", 1)
        //       this.props.IsManualTxn(true);
        //       localStorage.setItem("isManualTxn", true);
        //     }

        //     this.setState({ totalProduct : res.data.results.products.length });
        //     this.setState({ merchantHourStatus : "OPEN", merchantHourOpenTime : "10:00", merchantHourGracePeriod : "31" })
        //   }).catch(err => {
        //     console.log(err)
        //     newImage = Storeimg
        //     prominent(newImage, { amount: 3 }).then((color) => {
        //       // return RGB color for example [241, 221, 63]
        //       // var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
        //       // var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
        //       if (color.length < 3) {
        //         var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
        //         var productColor = rgbHex(color[1][0], color[1][1], color[1][2])
        //       } else {
        //         var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
        //         var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
        //       }
        //       this.brightenColor(merchantColor, 70, productColor, 60)
        //       this.setState({ data: stateData, allProductsandCategories: productCateg, productCategpersize: productPerSize, idCateg, productPage });
        //       this.setState({ productCategpersizeOri : this.state.productCategpersize });
        //       document.addEventListener('scroll', this.loadMoreMerchant)
        //     });

        //     if (localStorage.getItem("productTour") == 1) {
        //       if (this.props.AuthRedu.isMerchantQR === false) {
        //         this.state.steptour.shift();
        //       }
        //       this.setState({ startTour: true });
        //     }
        //     else if ((localStorage.getItem('merchantFlow') == 1) && (this.props.AuthRedu.isMerchantQR === true)) {
        //       this.setState({ startTour: true });
        //     }
        //   })
      })
      .catch((err) => {
        console.log(err);
        console.log(this.state);
        if(err.toJSON().message === 'Network Error'){
          this.setState({ showFailed: true })
        }
      });
  }

  componentDidUpdate() {
    if (this.state.idCateg[this.state.choosenIndCateg] > 0) { //load more products with selected index of category
      if (this.state.boolpage === true) {
        this.loadProducts(this.state.choosenIndCateg)
      }
    }

    if (this.state.isLogin === false) {
      var auth = {
        isLogged: false,
        token: "",
        new_event: true,
        recommendation_status: false,
        email: "",
      };
      if (Cookies.get("auth") !== undefined) {
        auth = JSON.parse(Cookies.get("auth"));
        this.setState({ isLogin: auth.isLogged });
      }
    }

  }

  brightenColor = (hex, percent, hex2, percent2) => {
    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    //backColor1
    if (hex.length == 3) {
      hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);

    let brightColor = '#' +
      ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
      ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
      ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);

    //backColor2
    if (hex2.length == 3) {
      hex2 = hex2.replace(/(.)/g, '$1$1');
    }

    var r2 = parseInt(hex2.substr(0, 2), 16),
      g2 = parseInt(hex2.substr(2, 2), 16),
      b2 = parseInt(hex2.substr(4, 2), 16);

    let brightColor2 = '#' +
      ((0 | (1 << 8) + r2 + (256 - r2) * percent2 / 100).toString(16)).substr(1) +
      ((0 | (1 << 8) + g2 + (256 - g2) * percent2 / 100).toString(16)).substr(1) +
      ((0 | (1 << 8) + b2 + (256 - b2) * percent2 / 100).toString(16)).substr(1);

    this.setState({ backColor1: brightColor, backColor2: brightColor2, testColor: false })
    document.body.style.backgroundColor = '#' + hex;
  }

  onScrollCart = () => {
    this.setState({ isScrolling: true })
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({ isScrolling: false })
    }, 300);
  }

  loadProducts = (indexOfCateg) => {
    let getindexProd = this.state.allProductsandCategories[indexOfCateg].category_products
    let loadtheProd = getindexProd.filter((valProd, indvalProd) => {
      return indvalProd >= this.state.idCateg[indexOfCateg] && indvalProd < this.state.productPage[indexOfCateg]
    })

    let updatedProduct = this.state.productCategpersize
    updatedProduct.forEach((value, index) => {
      if (index === indexOfCateg) {
        loadtheProd.forEach((valLoadProd) => {
          value.category_products.push(valLoadProd)
        })
      }
    })

    this.setState({ boolpage: false, productCategpersize: updatedProduct })
    this.setState({ productCategpersizeOri : this.state.productCategpersize });
    document.addEventListener('scroll', this.loadMoreMerchant)
  }

  handlePhone = (phone) => { //go to Whatsapp chat
    phone.substring(1)
    let waNumber = '62' + phone
    window.location.href = `https://wa.me/${waNumber}`
  }

  handleDetail(data) {
    this.setState({ currentData: data });
    this.setState({ showMenuDet: true });
    document.body.style.overflowY = 'hidden'
  }

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }

  setMenuDetail(isShow) {
    this.setState({ showMenuDet: isShow })
    document.body.style.overflowY = ''
  }

  handleCart = (data) => {
    currentExt = data;
  };

  handleAddCart = () => {
    var currentMerchant = JSON.parse(Cookies.get("currentMerchant"))
    const value = queryString.parse(window.location.search);
    const mid = this.state.data.mid;
    this.setModal(false);
    var isStorePresent = false;
    let cart = JSON.parse(localStorage.getItem('cart'))
    if (cart.length > 1) {
      if (cart[1].mid !== currentMerchant.mid) {
        let newCart = []
        newCart.push(cart[0])
        cart = newCart
      }
    }
    cart.forEach((data) => {
      if (data.mid === this.state.data.mid) {
        isStorePresent = true;
      }
    });

    let duplicateProduct = []
    var isDuplicate = false;
    cart.forEach((data) => {
      if (data.mid === this.state.data.mid) {
        data.food.forEach((food) => {
          if (food.productId === this.state.currentData.productId) {
            isDuplicate = true;
            duplicateProduct.push(food)
          }
        });
      }
    });

    var isDuplicateSelection = false
    let indexOfspesificCart = 0 //get index of spesific cart product after break loop or match condition
    if (isStorePresent && isDuplicate) {
      let countAllSelection = 0
      let sizecartArr = 0 //size cart of spesific index
      let sizecurrentArr = 0 //size current selected menu

      //loop list checkbox from current menu selection
      currentExt.listcheckbox.forEach((currentfirstVal) => {
        currentfirstVal.forEach((currentnestedVal) => {
          if (currentnestedVal.name) {
            sizecurrentArr += 1
          }
        })
      })

      //loop list radio from current menu selection
      currentExt.listradio.forEach((currentfirstVal) => {
        currentfirstVal.forEach((currentnestedVal) => {
          if (currentnestedVal.name) {
            sizecurrentArr += 1
          }
        })
      })

      let boolSpesificInd = true //to break following loop
      duplicateProduct.forEach((menuProd, index) => {
        if (boolSpesificInd) {
          //loop list checkbox from cart
          menuProd.foodListCheckbox.forEach(firstVal => {
            firstVal.forEach(nestedVal => {
              if (nestedVal.name) {
                sizecartArr += 1
              }
            })
          })

          //loop list radio from cart
          menuProd.foodListRadio.forEach(firstVal => {
            firstVal.forEach(nestedVal => {
              if (nestedVal.name) {
                sizecartArr += 1
              }
            })
          })

          // console.log(sizecartArr);
          // console.log(sizecurrentArr);
          if (sizecartArr === sizecurrentArr) {
            menuProd.foodListCheckbox.forEach((firstVal) => {
              firstVal.forEach((nestedVal) => {

                //loop listcheckbox from current advance selection to be match with added cart
                currentExt.listcheckbox.forEach((currentfirstVal) => {
                  currentfirstVal.forEach((currentnestedVal) => {
                    if (nestedVal.name === currentnestedVal.name) {
                      countAllSelection += 1
                    }
                  })
                })
              })
            })

            // loop radio from added cart
            menuProd.foodListRadio.forEach((firstVal) => {
              firstVal.forEach((nestedVal) => {

                //loop radio from current advance selection to be match with added cart
                currentExt.listradio.forEach((currentfirstVal) => {
                  currentfirstVal.forEach((currentnestedVal) => {
                    if (nestedVal.name === currentnestedVal.name) {
                      countAllSelection += 1
                    }
                  })
                })
              })
            })

            if (sizecartArr === countAllSelection) {
              if (menuProd.foodNote === currentExt.note) {
                indexOfspesificCart = index
                isDuplicateSelection = true
                boolSpesificInd = false
              } else {
                sizecartArr = 0
                countAllSelection = 0
              }
            } else {
              sizecartArr = 0
              countAllSelection = 0
            }
          } else {
            sizecartArr = 0
          }
        }
      })
    }

    var isFound = false
    if (isStorePresent === true) {
      if (isDuplicate === true) {
        if (isDuplicateSelection) {
          // console.log('duplicate');
          cart.forEach((data) => {
            if (isFound === false) {
              if (data.mid === this.state.data.mid) {
                // console.log('same mid');
                if (isFound === false) {
                  if (duplicateProduct[indexOfspesificCart].foodNote === currentExt.note) {
                    isFound = true
                    duplicateProduct[indexOfspesificCart].foodAmount += currentExt.detailCategory[0].amount
                    duplicateProduct[indexOfspesificCart].foodTotalPrice += currentTotal
                  }
                }
              }
            }
          })
          if (isFound === false) {
            var isAdded = false
            cart.forEach((data) => {
              if (data.mid === this.state.data.mid) {
                data.food.forEach((food) => {
                  if (isAdded === false) {
                    isAdded = true
                    data.food.push({
                      productId: this.state.currentData.productId,
                      foodName: this.state.currentData.foodName,
                      foodPrice: this.state.currentData.foodPrice,
                      foodImage: this.state.currentData.foodImage,
                      foodCategory: currentExt.foodCategory,
                      foodAmount: currentExt.detailCategory[0].amount,
                      foodNote: currentExt.note,
                      foodListCheckbox: currentExt.listcheckbox,
                      foodListRadio: currentExt.listradio,
                      foodTotalPrice: currentTotal
                    });
                  }
                });
              }
            })
          };
        } else {
          // console.log('noduplicate choice');
          cart.forEach((data) => {
            if (data.mid === this.state.data.mid) {
              data.food.push({
                productId: this.state.currentData.productId,
                foodName: this.state.currentData.foodName,
                foodPrice: this.state.currentData.foodPrice,
                foodImage: this.state.currentData.foodImage,
                foodCategory: currentExt.foodCategory,
                foodAmount: currentExt.detailCategory[0].amount,
                foodNote: currentExt.note,
                foodListCheckbox: currentExt.listcheckbox,
                foodListRadio: currentExt.listradio,
                foodTotalPrice: currentTotal
              });
            }
          })
        }
      } else {
        // console.log('noduplicate product');
        cart.forEach((data) => {
          if (data.mid === this.state.data.mid) {
            data.food.push({
              productId: this.state.currentData.productId,
              foodName: this.state.currentData.foodName,
              foodPrice: this.state.currentData.foodPrice,
              foodImage: this.state.currentData.foodImage,
              foodCategory: currentExt.foodCategory,
              foodAmount: currentExt.detailCategory[0].amount,
              foodNote: currentExt.note,
              foodListCheckbox: currentExt.listcheckbox,
              foodListRadio: currentExt.listradio,
              foodTotalPrice: currentTotal
            });
          }
        });
      }
    } else {
      cart.push({
        mid: mid,
        storeName: currentMerchant.storeName,
        storeAdress: currentMerchant.storeAdress,
        storeDistance: currentMerchant.distance,
        food: [
          {
            productId: this.state.currentData.productId,
            foodName: this.state.currentData.foodName,
            foodPrice: this.state.currentData.foodPrice,
            foodImage: this.state.currentData.foodImage,
            foodCategory: currentExt.foodCategory,
            foodAmount: currentExt.detailCategory[0].amount,
            foodNote: currentExt.note,
            foodListCheckbox: currentExt.listcheckbox,
            foodListRadio: currentExt.listradio,
            foodTotalPrice: currentTotal
          },
        ],
      });
    }
    let addedMerchants = []
    if (Cookies.get("addedMerchants") === undefined) {
      if (!addedMerchants.includes(mid)) {
        addedMerchants.push(mid)
        Cookies.set("addedMerchants", addedMerchants)
      }
    } else {
      addedMerchants = JSON.parse(Cookies.get("addedMerchants"))
      if (!addedMerchants.includes(mid)) {
        addedMerchants.push(mid)
        Cookies.set("addedMerchants", addedMerchants)
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'Berhasil masuk cart',
      showConfirmButton: false,
      timer: 1500
    })

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
        mid: this.state.data.mid,
        pid: this.state.currentData.productId,
        notes: newNotes,
        qty: currentExt.detailCategory[0].amount,
      }
    })
      .then(() => {
        console.log('addtocart succeed');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  changeMenu = () => {
    this.props.OpenSelect(!this.props.AllRedu.openSelect)
    document.removeEventListener('scroll', this.loadMoreMerchant)
  }

  changeHeader = (menu) => {
    this.props.OpenSelect(false)
    this.setState({ categName: menu })
  }

  isBottom = (el) => {
    return (el.getBoundingClientRect().top + 100) <= window.innerHeight
  }

  stopAndLoadMore = (ind) => {
    if (this.state.productCategpersize[ind].category_products.length < this.state.allProductsandCategories[ind].category_products.length) {
      var openidCateg = [...this.state.idCateg]
      openidCateg[ind] += this.state.size

      var openproductPage = [...this.state.productPage]
      openproductPage[ind] += this.state.size

      this.setState({ idCateg: openidCateg, productPage: openproductPage, boolpage: true, choosenIndCateg: ind })
    } else {
      var num = this.state.counterLoad
      num++
      this.setState({ counterLoad: num, choosenIndCateg: ind })
      document.addEventListener('scroll', this.loadMoreMerchant)
    }
  }

  loadMoreMerchant = () => {
    this.state.productCategpersize.forEach((val, ind) => {
      var wrappedElement = document.getElementById(ind)
      if (this.isBottom(wrappedElement)) {
        if (wrappedElement.id == this.state.counterLoad) {
          document.removeEventListener('scroll', this.loadMoreMerchant)
          this.stopAndLoadMore(ind)
        }
      }
    })
  }

  componentWillMount() {
    // When this component mounts, begin listening for scroll changes
    document.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.loadMoreMerchant)
    document.removeEventListener('scroll', this.onScrollCart)
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    let lastScrollTop = 0;
    let currentScrollTop = window.scrollY;

    // Set the state of hidden depending on scroll position
    // We only change the state if it needs to be changed
    if (currentScrollTop > 70) {
      this.setState({ hiddenBanner: true });
    } else {
      this.setState({ hiddenBanner: false });
    }
    lastScrollTop = currentScrollTop;
  }


  contentView = () => {
    return this.state.productCategpersize.map((categ, indcateg) => {
      return (
        <div key={indcateg} className='product-section'>
          <h2 id={categ.category_name.toLocaleLowerCase()} className='product-categ'>{categ.category_name.toLocaleLowerCase() || <Skeleton height={50} width={200} />}</h2>

          <div className='list-product'>
            {
              categ.category_products.map((product, indprod) => {
                return (
                  <div key={indprod} className='product-merchant'>
                    <div className='product-img'>
                      <img 
                        src={product.foodImage} 
                        className='product-imgContent' 
                        alt=''
                        style={{
                          filter: !this.state.isManualTxn ?
                              this.state.merchantHourStatus == "CLOSE" ?
                              "grayscale(100%)"
                              :
                              "none"
                            :
                            "none"
                        }} />
                    </div>

                    {/* desktop view */}
                    {/* <div className='product-detail'> */}
                      {/* <div className='product-star'>
                        <img className='product-star-img' src={StarIcon} alt='' />
                        <h6 className='product-star-rating'>{product.foodRating}</h6>
                      </div> */}

                      {/* <div className='product-name'>
                        {product.foodName}
                      </div>

                      <div className='product-desc'>
                        {product.foodDesc}
                      </div>

                      <div className='product-price'>
                        {Intl.NumberFormat("id-ID").format(product.foodPrice)}
                      </div>
                    </div> */}

                    <div className='product-detail'>
                      <div className='product-detailInfo'>
                        {/* <div className='product-star-mob'>
                          <img className='product-star-img-mob' src={StarIcon} alt='' />
                          <h6 className='product-star-rating-mob'>{product.foodRating}</h6>
                        </div> */}

                        <div className='product-name'>
                          {product.foodName}
                        </div>

                        {/* <div className='product-desc'>
                          {product.foodDesc}
                        </div> */}

                        <div className='product-price'>
                          Rp. {Intl.NumberFormat("id-ID").format(product.foodPrice)}
                        </div>
                      </div>

                    </div>
                    {/* <div className="merchantdetail-cart-button-sec">
                      <div className='product-price'>
                        Rp. {Intl.NumberFormat("id-ID").format(product.foodPrice)}
                      </div>
                    </div> */}
                    {
                      !this.state.isManualTxn ?
                        this.state.merchantHourStatus == "CLOSE" ?
                        null
                        :
                        <div className="merchantdetail-cart-button-sec">
                          <div className='merchantdetail-cart-button' onClick={() => this.handleDetail(product)}>
                            <span className="merchantdetail-cart-text">+ Keranjang</span>
                          </div>
                        </div>
                      :
                      <div className="merchantdetail-cart-button-sec">
                        <div className='merchantdetail-cart-button' onClick={() => this.handleDetail(product)}>
                          <span className="merchantdetail-cart-text">+ Keranjang</span>
                        </div>
                      </div>
                    }

                    {/* mobile view */}
                    <div className='product-detail-mob'>
                      <div className='product-detailInfo-mob'>
                        {/* <div className='product-star-mob'>
                          <img className='product-star-img-mob' src={StarIcon} alt='' />
                          <h6 className='product-star-rating-mob'>{product.foodRating}</h6>
                        </div> */}

                        <div className='product-name-mob'>
                          {product.foodName}
                        </div>

                        {/* <div className='product-desc-mob'>
                          {product.foodDesc}
                        </div> */}
                      </div>

                      <div className='product-price-mob'>
                        Rp. {Intl.NumberFormat("id-ID").format(product.foodPrice)}
                      </div>
                    </div>
                    {/* <div className='merchantdetail-cart-button-secmob'>
                      <div className='product-price-mob'>
                        Rp. {Intl.NumberFormat("id-ID").format(product.foodPrice)}
                      </div>
                    </div> */}

                    {
                      !this.state.isManualTxn ?
                        this.state.merchantHourStatus == "CLOSE" ?
                        null
                        :
                        <div className='merchantdetail-cart-button-secmob'>
                          <div className='merchantdetail-cart-button-mob' onClick={() => this.handleDetail(product)}>
                            <span className="merchantdetail-cart-text-mob">+ Keranjang</span>
                          </div>
                        </div>
                      :
                      <div className='merchantdetail-cart-button-secmob'>
                        <div className='merchantdetail-cart-button-mob' onClick={() => this.handleDetail(product)}>
                          <span className="merchantdetail-cart-text-mob">+ Keranjang</span>
                        </div>
                      </div>
                    }
                  </div>
                )
              })
            }
          </div>
          {
            this.state.productCategpersize[indcateg].category_products.length < this.state.allProductsandCategories[indcateg].category_products.length ?
              <div id={indcateg}>
                <Skeleton style={{ paddingTop: 100, borderRadius: 30 }} />
              </div>
              :
              <div id={indcateg}>
                {/* <Skeleton style={{paddingTop:100, borderRadius: 30}} /> */}
              </div>
          }
        </div>
      );
    })
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
          handleCateg={this.state.productCategpersize}
          handleAmount={this.handleCartAmount}
          handleClick={this.handleAddCart}
          handleData={this.handleCart}
        />
      );
    }
  }

  tourPage = () => {
    if (this.state.startTour === true) {
      return (
        <TourPage
          stepsContent={this.state.steptour}
          isShowTour={this.state.startTour}
          isHideTour={() => this.showTourPage(false)}
        />
      )
    }
  }

  showTourPage = (isShowTour) => {
    this.setState({ startTour: isShowTour });
    document.body.style.overflowY = 'auto';
    localStorage.setItem('productTour', 0);
    localStorage.setItem('merchantFlow', 0);
    localStorage.setItem('storeTour', 0);
  }

  hideFailedModal(isShow){
    this.setState({ showFailed: isShow })
    document.body.style.overflowY = ''
  }

  showFailedModal = () => {
    if (this.state.showFailed === true) {
      return (
        <FailedModal
          isShow={this.state.showFailed}
          onHide={() => this.hideFailedModal(false)}
        />
      );
    }
  }

  getLinkTree = (username) => {
    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replace(/-/g, "");

    Axios(address + "home/v1/link-tree-list-by-domain/" + username, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "token" : "PUBLIC"
      },
      method: "GET",  
    })
    .then((res) => {
      var linkData = [];

      res.data.results.forEach((data, index) => {
        linkData.push({
          url : data.url,
          title : data.title,
          image : data.image
        });
      })

      this.setState({ linkTreeData : linkData });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  linktreeView = () => {
      return (
        this.state.linkTreeData.length !== 0 ?
        <div className='merchantdetail-link-section'>
          {
            this.state.linkTreeData.map((link, ind) => {
              return (
                <div key={ind} className='merchantdetail-link-itembox' onClick={() => this.goToExternalLink(link.url)}>
                  <img className='merchantdetail-link-icon' src={link.image}></img>
                </div>
              )
            })
          }
        </div>
        :
        <></>
      );
  }

  goToExternalLink = (link) => {
    window.open(link, '_blank');

    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replace(/-/g, "");

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
        merchant_id: this.state.data.mid,
        event_type: "LINK_TREE_DETAIL",
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

  searchTable = (e) =>{
    this.setState({ searchProduct : e.target.value})
    var searchVal = String(e.target.value);
    if(searchVal !== "") {
        var productAll = this.state.productAllPage
        var categoryId = []
        var categoryName = []
        var dataSearch = productAll.filter((row) => {
          return row.foodName.toLowerCase().includes(searchVal.toLowerCase());
        });

        let filtersizeMerchant = JSON.parse(localStorage.getItem('selectedMerchant'))

        let productSize = filtersizeMerchant[0].categories.map((categ) => {
          return categ
        })

        productSize.forEach((val) => {
          val.category_products = []
        })

        productSize.forEach((categProd) => {
          dataSearch.forEach((allprod) => {
            if (categProd.category_id == String(allprod.category)) { 
              categProd.category_products.push(allprod);
            }
            categoryId.push(categProd.category_id);
            categoryName.push(dataSearch.length);
          })
        })

        this.setState({ productCategpersize: productSize, categoryId, categoryName });
    } else {
        this.setState({ productCategpersize : this.state.productCategpersizeOri });
    }
  }

  sendTracking(mid) {
    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replace(/-/g, "");

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
        merchant_id: mid,
        event_type: "VIEW_DETAIL",
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

  sendTracking(mid) {
    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replace(/-/g, "");

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
        merchant_id: mid,
        event_type: "VIEW_DETAIL",
        page_name: window.location.pathname
      }
    })
    .then((res) => {
      console.log("SUCCEED");
    })
    .catch((err) => {
      console.log(err);
    });
  }

  merchantHourStatusWarning = () => {
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
          <div className="merchant-hour-status-layout" style={{backgroundColor: "#f4b55b"}}>
            <div className="merchant-hour-status-text">Toko akan Tutup {this.state.merchantHourGracePeriod} Menit Lagi</div>
          </div>
        )
      } else {
        return null
      }
    } else {
      return null
    }
  }

  render() {
    let cartButton;
    const value = queryString.parse(window.location.search);
    let notab = ""
    if (localStorage.getItem('table')) {
      if (!value.table) {
        if (localStorage.getItem('fctable')) {
          notab = localStorage.getItem('fctable')
        } else {
          notab = 0
        }
      } else {
        notab = value.table
      }
    } else {
      if (localStorage.getItem('fctable')) {
        notab = localStorage.getItem('fctable')
      } else {
        notab = value.table
      }
    }
    if (JSON.parse(localStorage.getItem('cart'))) {
      let allCart = JSON.parse(localStorage.getItem('cart'))
      let filterMerchantCart = allCart.filter(cartVal => {
        return this.state.data.mid === cartVal.mid
      })
      if (filterMerchantCart.length) {
        localStorage.setItem('table', notab)
        localStorage.setItem('lastTable', notab)
        let totalCartIcon = 0
        filterMerchantCart[0].food.forEach(valCart => {
          totalCartIcon += valCart.foodTotalPrice
        })
        if (filterMerchantCart[0].mid) {
          if (this.state.isScrolling) {
            cartButton = <></>
          } else {
            cartButton = (
              this.state.isManualTxn ?
              <Link to={"/cartmanual"}>
                <div className='cartIcon-layout'>
                  <div className='cartIcon-content'>
                    <div>
                      <div className='cartItem-total'>{filterMerchantCart[0].food.length} Items</div>
                      <div className="cartItem-merchantname">Dari {this.state.data.title}</div>
                    </div>
                    <div className='cartItem-price'>Rp. {Intl.NumberFormat("id-ID").format(totalCartIcon)} <img className="cartItem-icon" src={ShoppingBagLogo}></img></div>
                  </div>
                </div>
              </Link>
              :
              <Link to={"/cart"}>
                <div className='cartIcon-layout'>
                  <div className='cartIcon-content'>
                    <div>
                      <div className='cartItem-total'>{filterMerchantCart[0].food.length} Items</div>
                      <div className="cartItem-merchantname">Dari {this.state.data.title}</div>
                    </div>
                    <div className='cartItem-price'>Rp. {Intl.NumberFormat("id-ID").format(totalCartIcon)} <img className="cartItem-icon" src={ShoppingBagLogo}></img></div>
                  </div>
                </div>
              </Link>
            );
          }
        } else {
          cartButton = <></>;
        }
      } else {
        cartButton = <></>;
      }
    }

    if (this.state.categName !== "All Categories") {
      if (this.props.AllRedu.openSelect === false) {
        //scroll to selected menu
        document.addEventListener('scroll', this.loadMoreMerchant)

        const el = document.getElementById(this.state.categName);
        el.scrollIntoView(true);

        var heightHeader = 140;

        var scrollY = window.scrollY;

        if(scrollY) {
          window.scroll({top: scrollY - heightHeader, left: 0, behavior: 'smooth' });
        }

        this.setState({ categName: 'All Categories' })
      }
    }

    return (
      <>
        <div className="product-search-inputarea">
          <div className="product-search-checkbutton">
            <img className="product-search-headerimg" src={Logopikapp}></img>
          </div>
          {/* <input className="product-search-textbox" placeholder={"Cari di Toko " + this.state.data.title} onChange={this.searchTable} value={this.state.searchProduct} /> */}
          {
            this.state.isManualTxn ?
            <Link to={"/statuscartmanual"}>
              <div className="product-search-checkbutton">
                <img className="product-search-checkbuttonimg" src={OrderStatusIcon}></img>
              </div>
            </Link>
            :
            <Link to={"/status"}>
              <div className="product-search-checkbutton">
                <img className="product-search-checkbuttonimg" src={OrderStatusIcon}></img>
              </div>
            </Link>
          }
        </div>
        {this.merchantHourStatusWarning()}     
        <div className="merchant-carousel" style={{ opacity: this.state.hiddenBanner ? "0.5" : "1", transition: this.state.hiddenBanner ? "opacity 0.5s" : "opacity 1s" }}>
          <Carousel className="merchant-carousel">
            <Carousel.Item className="merchant-carousel">
              <img
                className="storeBanner"
                src={this.state.data.image}
                style={{ 
                  objectFit: 'cover', 
                  filter: !this.state.isManualTxn ? 
                    this.state.merchantHourStatus == "CLOSE" ?
                    "grayscale(100%)" 
                    :
                    "none"
                  : 
                  "none"
                }}
              />
              {/* <div className='iconBanner'>
                {
                  this.state.isManualTxn ?
                  <Link to={"/statuscartmanual"}>
                    <div className='notifIcon-sec'>
                      <img className='notificon-img' src={NotifIcon} alt='' />
                    </div>
                  </Link>
                  :
                  <Link to={"/status"}>
                    <div className='notifIcon-sec'>
                      <img className='notificon-img' src={NotifIcon} alt='' />
                    </div>
                  </Link>
                }
              </div> */}
            </Carousel.Item>
          </Carousel>
        </div>  
        <div className='merchant-info' style={{ opacity: this.state.hiddenBanner ? "0.5" : "1", transition: this.state.hiddenBanner ? "opacity 0.5s" : "opacity 1s" }}>
          <div className='top-merchantInfo'>
            <div className='inside-topMerchantInfo'>
              <div className='merchant-title'>
                {/* <div className='merchant-logo'>
                  {
                    this.state.data.logo ?
                      <img src={this.state.data.logo} style={{ objectFit: 'cover' }} width='100%' height='100%' alt='' />
                      :
                      <Skeleton style={{ paddingTop: 10, width: "100%", height: "100%" }} />
                  }
                </div> */}
                <img className='merchant-storeimg-logo' src={this.state.data.logo} alt='' />
                <Link to={{ pathname: "/merchant-profile", state: { merchantLogo: this.state.data.logo, merchantName: this.state.data.title, merchantAddress: this.state.data.address} }} style={{ textDecoration: "none" }}>
                  <div className='merchant-name'>
                    <div className='merchant-mainName'>
                      <div className="merchant-mainName-title">
                        {this.state.data.title || <Skeleton style={{ paddingTop: 30, width: 200 }} />}
                      </div>

                      <img src={ArrowRight} className="merchant-mainName-img" />
                    </div>

                    <div className='merchant-categName'>
                      <div className='merchant-allcateg'>{this.state.data.category}</div>
                      {/* <div className='merchant-starInfo'>
                        {
                          this.state.data.rating ?
                            <>
                              <img className='star-img' src={StarIcon} alt='' />
                              <div className='merchant-star'>{this.state.data.rating}</div>
                            </>
                            :
                            null
                        }
                        <div className='star-votes'>(50+ Upvotes)</div>
                      </div> */}
                      {this.state.data.category != "" ? <div className="merchant-divider-dot">.</div> : null}
                      <div className="merchant-openClose-status" style={{color: this.state.merchantHourStatus == "CLOSE" ? "#dc6a84" : "#4bb7ac"}}>{this.state.merchantHourStatus == "CLOSE" ? "Tutup" : "Buka"}</div>
                    </div>
                  </div>
                </Link>
              </div>
              <div onClick={() => this.handlePhone(this.state.data.phone)}>
                {/* <div className='merchant-call'> */}
                  {/* <span className='merchantCall-icon'> */}
                    <img className='merchant-call-sec' src={WhatsAppIcon} alt='' />
                  {/* </span> */}
                {/* </div> */}
              </div>
            </div>
          </div>
          <div className='bottom-merchantInfo'>
            {/* <div className='inside-bottomMerchantInfo'> */}
              {/* <div className='merchantdetail-section'>
                <div className='icon-based'>
                  <img className='openhouricon' src={OpenHourIcon} alt='' />
                </div>

                <div className='detail-info'>
                  <div className='top-detail-info'>Open</div>
                  <div className='bottom-detail-info'>Jum (08.00 - 20.00)</div>
                </div>
              </div>
              <div className='merchantdetail-section'>
                <div className='icon-based'>
                  <img className='coinicon' src={CoinIcon} alt='' />
                </div>

                <div className='detail-info'>
                  <div className='top-detail-info'>$$$</div>
                  <div className='bottom-detail-info'>50 K - 100 K</div>
                </div>
              </div> */}
              {/* <div className='merchantdetail-section'>
                <div className='icon-based'>
                  <img className='locationicon' src={LocationIcon} alt='' />
                </div>

                <div className='detail-info'>
                  <div className='top-detail-info'>Store Address</div>
                  <div className='bottom-detail-info'>{this.state.data.address || <Skeleton style={{ paddingTop: 30, width: 100 }} />}</div>
                </div>
              </div>
              
            </div> */}
            { this.state.isManualTxn ?
              this.linktreeView()
              :
              <></>
            }
          </div>
        </div>     
        {/* <div className='storeBanner'>
          {
            this.state.data.image ?
              <img src={this.state.data.image} style={{ objectFit: 'cover' }} width='100%' height='100%' alt='' />
              :
              <Skeleton style={{ paddingTop: 10, width: "100%", height: "100%" }} />
          }

          <div className='iconBanner'>
            {
              this.state.isManualTxn ?
              <Link to={"/statuscartmanual"}>
                <div className='notifIcon-sec'>
                  <img className='notificon-img' src={NotifIcon} alt='' />
                </div>
              </Link>
              :
              <Link to={"/status"}>
                <div className='notifIcon-sec'>
                  <img className='notificon-img' src={NotifIcon} alt='' />
                </div>
              </Link>
            }
          </div>
        </div> */}

        <div className='promo-voucherinfo'>
          <Link to={{ pathname: "/promo", state: { title : "Daftar Diskon Yang Tersedia di Toko", alert: 0, alertStatus : { phoneNumber: "0", paymentType : 0 } }}} style={{ textDecoration: "none", width: "100%" }}>
            <div className='promo-detailContent'>
                  <div className='promo-leftSide'>
                    <img className='promo-img-icon' src={VoucherIcon} alt='' />
                    <div className='promo-title'>3 Voucher Diskon Tersedia</div>
                  </div>

                  <span className="promo-arrowright">
                    <img className="promo-arrowright-icon" src={ArrowRight} />
                  </span>
            </div>
          </Link>
        </div>

        <div className='merchant-section' style={{ backgroundColor: "white" }}>
          <div className='inside-merchantSection'>
            <div className='merchant-category'>
              <div className='merchantdetail-category-section'>
                {
                  this.state.productCategpersize.map((menuCategory, index) => (
                      <div key={index} className='merchantdetail-category-itembox' onClick={() => this.changeHeader(menuCategory.category_name.toLocaleLowerCase())}>
                        <div className="merchantdetail-category-text">{menuCategory.category_name.toLocaleLowerCase()}</div>
                      </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        <div className='merchant-section-menu' style={{ backgroundColor: "white", opacity: this.state.hiddenBanner ? "0.5" : "1", transition: this.state.hiddenBanner ? "opacity 0.5s" : "opacity 1s" }}>
          <div className='inside-merchantSection-menu'>
            <div className='merchant-category-menu'>
              <div className="merchant-totalmenu-section">
                <div className="merchant-totalmenu-text">{this.state.totalProduct} Menu</div>
                {/* <div className="merchant-changelist-section">
                  <span className="merchant-totalmenu-text">Tampilan</span>
                  <img className="merchant-totalmenu-icon" src={ProductListIcon}></img>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='product-layout' style={{ backgroundColor: "#f0f1f2" }}>
          <div className='mainproduct-sec'>
            {this.contentView()}

            <div className='pikapp-info'>
              <h3 className='pikappInfo'>Digital Menu By</h3>
              <img className='Logopikapp' src={Logopikapp} alt='' />
            </div>
          </div>
        </div>
        {cartButton}
        {this.menuDetail()}
        {this.tourPage()}
        {this.showFailedModal()}
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

export default withRouter(connect(Mapstatetoprops, { ValidQty, OpenSelect, IsManualTxn })(ProductView))