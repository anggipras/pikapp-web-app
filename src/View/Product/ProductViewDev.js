import React from "react";
import { prominent } from "color.js";
import rgbHex from 'rgb-hex'
import PikaModal from "../../Component/Modal/PikaModal";
import MenuDetail from "../../Component/Modal/MenuDetail";
import queryString from "query-string";
import { cart } from "../../index.js";
import cartIcon from "../../Asset/Icon/cart_icon.png";
import { Link } from "react-router-dom";
import { address, clientId, secret } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import sha256 from "crypto-js/hmac-sha256";
import Axios from "axios";
import Cookies from "js-cookie"
import Storeimg2 from '../../Asset/Illustration/storeimg.jpg'
import Storeimg from '../../Asset/Illustration/storeimg2.png'
// import Productimg from '../../Asset/Illustration/productimg.png'
import Logopikapp from '../../Asset/Logo/logo4x.png'
import NotifIcon from '../../Asset/Icon/bell.png'
import ProfileIcon from '../../Asset/Icon/avatar.png'
import OpenHourIcon from '../../Asset/Icon/hour.png'
import CoinIcon from '../../Asset/Icon/coin.png'
import LocationIcon from '../../Asset/Icon/location.png'
import PhoneIcon from '../../Asset/Icon/phone.png'
import StarIcon from '../../Asset/Icon/star.png'
import ArrowIcon from '../../Asset/Icon/arrowselect.png'
import Skeleton from 'react-loading-skeleton'
import {connect} from 'react-redux'
import {ValidQty} from '../../Redux/Actions'

var currentExt = {
  detailCategory: [
    {
      name: "",
      amount: 0,
    },
  ],
  note: "",
};

class ProductView extends React.Component {
  state = {
    // mountTest: true,
    page: 0, //products pagination
    size: 10, //set amount of products to be shown in frontend
    boolpage: false,
    testpage: [],
    idCateg: [],
    testColor: false,
    testingchange: false, //only for testing, would be remove
    showModal: false,
    showMenuDet: false,
    data: {
      mid: "",
      title: "",
      image: "",
      desc: "",
      address: "",
      rating: "",
      phone: "",
      // data: [
      //   {
      //     productId: "",
      //     category: "",
      //     foodName: "",
      //     foodDesc: "",
      //     foodPrice: 0,
      //     foodImage: "",
      //     foodExt: [
      //       {
      //         name: "",
      //         amount: 0,
      //       },
      //     ],
      //   },
      // ],
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
    openSelect: false,
    categName: "All Categories", //initial for dropdown select
    showcategName: [{category_id: "", category_name: "", order: null, category_products: []}], //tobe shown in products area
    choosenIndCateg: null, //index of category selected when load more products in selected category
    counterLoad: 0,
  };

  componentDidMount() {
    this.props.ValidQty(0)
    document.body.style.backgroundColor = 'white'
    Cookies.set("lastProduct", window.location.href, {expires: 1})
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if(Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }
    if(auth.isLogged === false) {
      var lastLink = { value: window.location.href}
      Cookies.set("lastLink", lastLink,{ expires: 1})
      window.location.href = "/login"
    }
    var currentMerchant = JSON.parse(Cookies.get("currentMerchant"))
    var getLocation = JSON.parse(localStorage.getItem("longlat"))
    var latitude = getLocation.lat
    var longitude = getLocation.lon
    const value = queryString.parse(window.location.search);
    const mid = value.mid;
    const notab = value.table || ""
    let addressRoute = `${address}home/v2/merchant/${longitude}/${latitude}/${currentMerchant.storeName}/` 
    var stateData;
    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    Axios(addressRoute, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "token": "PUBLIC",
        "category": "1",
      },
      method: "GET",
      params: {
        page: 0,
        size: this.state.size
      }
    })
    .then((res) => {
        stateData = { ...this.state.data };
        let responseDatas = res.data.results;
        // stateData.data.pop();
        stateData.mid = mid;
        stateData.title = currentMerchant.storeName;
        stateData.image = currentMerchant.storeImage;
        stateData.desc = currentMerchant.storeDistance;
        stateData.address = currentMerchant.storeAdress;
        stateData.rating = currentMerchant.storeRating;
        stateData.phone = "081296000823";
        stateData.notable = notab
        // stateData.data.push({
        //   category: "All Category",
        //   productId: "",
        //   foodName: "",
        //   foodDesc: "",
        //   foodPrice: "",
        //   foodImage: "",
        // })
        var productCateg = []
        var idCateg = []
        var pageProduct = []
        responseDatas.forEach((data) => {
          if(data.mid === mid) {
            productCateg = data.categories.map((categ)=> {
              idCateg.push(1)
              pageProduct.push(res.data.total_pages - 1)
              return categ
            })

            productCateg.forEach((val)=> {
              val.category_products = []
            })

            productCateg.forEach((categProd)=> {
              data.products.forEach((allproducts)=> {
                if(categProd.category_id == allproducts.product_category) {
                  categProd.category_products.push({
                    productId: allproducts.product_id,
                    category: allproducts.product_category,
                    foodName: allproducts.product_name,
                    foodDesc: "",
                    foodPrice: allproducts.product_price,
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
          }
        })
        prominent(Storeimg, { amount: 3 }).then((color) => {
          // return RGB color for example [241, 221, 63]
          var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
          var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
          this.brightenColor(merchantColor, 70, productColor, 60)
          console.log(stateData);
          console.log(productCateg);
          console.log(pageProduct);
          this.setState({ data: stateData, showcategName: productCateg, idCateg, testpage: pageProduct});
          document.addEventListener('scroll', this.loadMoreMerchant)
        });
    })
    .catch((err) => {
    });
  }

  //testing changebackground
  changeBackground = () => {
    this.setState({testingchange: !this.state.testingchange, testColor: true})
  }

  componentDidUpdate() {
    if(this.state.testColor == true) {
      if(this.state.testingchange == false) {
        prominent(Storeimg, { amount: 3 }).then((color) => {
          var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
          var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
          this.brightenColor(merchantColor, 70, productColor, 60)
        });
      } else {
        prominent(Storeimg2, { amount: 3 }).then((color) => {
          var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
          var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
          this.brightenColor(merchantColor, 70, productColor, 60)
        });
      }
    }

    this.scrolltoMenu()


    if(this.state.idCateg) { //load more products with selected index of category
      this.state.idCateg.forEach((val, index)=> {
        if(index === this.state.choosenIndCateg) {
          if(val > 1 ) {
            if(this.state.boolpage == true) {
              this.loadProducts(index)
            } else {
              document.addEventListener('scroll', this.loadMoreMerchant)
            }
          }
        }
      })
    }
  }
  //testing changebackground

  brightenColor = (hex, percent, hex2, percent2) => {
    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    //backColor1
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    let brightColor =  '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);

    //backColor2
    if(hex2.length == 3){
      hex2 = hex2.replace(/(.)/g, '$1$1');
    }

    var r2 = parseInt(hex2.substr(0, 2), 16),
        g2 = parseInt(hex2.substr(2, 2), 16),
        b2 = parseInt(hex2.substr(4, 2), 16);

    let brightColor2 =  '#' +
      ((0|(1<<8) + r2 + (256 - r2) * percent2 / 100).toString(16)).substr(1) +
      ((0|(1<<8) + g2 + (256 - g2) * percent2 / 100).toString(16)).substr(1) +
      ((0|(1<<8) + b2 + (256 - b2) * percent2 / 100).toString(16)).substr(1);

    console.log(brightColor, brightColor2);
    this.setState({backColor1: brightColor, backColor2: brightColor2, testColor: false})
    document.body.style.backgroundColor = '#' + hex;
  }

  loadProducts = (indexOfCateg) => {
    const value = queryString.parse(window.location.search);
    const mid = value.mid;
    var getLocation = JSON.parse(localStorage.getItem("longlat"))
    var latitude = getLocation.lat
    var longitude = getLocation.lon
    let addressRoute = `${address}home/v2/merchant/${longitude}/${latitude}/ALL/` 
    var stateData;
    let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    var inputPage = this.state.idCateg
    inputPage[indexOfCateg] -= 1
    Axios(addressRoute, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
        "token": "PUBLIC",
        "category": "1",
      },
      method: "GET",
      params: {
        page: inputPage[indexOfCateg],
        size: this.state.size
      }
    })
    .then((res) => {
        stateData = { ...this.state.data };
        let responseDatas = res.data.results;
        responseDatas.forEach((data) => {
          if(data.mid === mid) {
            this.state.showcategName.forEach((categProd, indexAllCateg)=> {
              data.products.forEach((allproducts)=> {
                if(categProd.category_id == allproducts.product_category) {
                  if(indexAllCateg == indexOfCateg) {
                    categProd.category_products.push({
                      productId: allproducts.product_id,
                      category: allproducts.product_category,
                      foodName: allproducts.product_name,
                      foodDesc: "",
                      foodPrice: allproducts.product_price,
                      foodImage: allproducts.product_picture1,
                      foodExt: [
                        {
                          name: "",
                          amount: 0,
                        },
                      ],
                    })
                  }
                }
              })
            })
          }
        })
        this.setState({boolpage: false})
        document.addEventListener('scroll', this.loadMoreMerchant)
    })
    .catch((err) => {
    });
  }

  handlePhone = (phone) => { //go to Whatsapp chat
    phone.substring(1)
    let waNumber = '62' + phone
    window.location.href = `https://wa.me/${waNumber}`
  }

  handleDetail(data) {
    this.setState({ currentData: data });
    this.setState({ showMenuDet: true });
  }

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }

  setMenuDetail(isShow) {
    this.setState({ showMenuDet: isShow })
  }

  handleCart = (data) => {
    currentExt = data;
  };

  handleAddCart = () => {
    if(this.props.AllRedu.validQTY < 1) {
      alert('minium 1 product')
    } else {
    var currentMerchant = JSON.parse(Cookies.get("currentMerchant"))
    const value = queryString.parse(window.location.search);
    const mid = value.mid;
    this.setModal(false);
    var isStorePresent = false;
    cart.forEach((data) => {
      if (data.mid === this.state.data.mid) {
        isStorePresent = true;
      }
    });

    var isDuplicate = false;
    cart.forEach((data) => {
      if (data.mid === this.state.data.mid) {
        data.food.forEach((food) => {
          if (food.productId === this.state.currentData.productId) {
            isDuplicate = true;
          }
        });
      }
    });

    var isFound = false
    if (isStorePresent === true) {
      if (isDuplicate === true) {
        cart.forEach((data) => {
          if(isFound === false) {
            if (data.mid === this.state.data.mid) {
              data.food.forEach((food) => {
                if(isFound === false) {
                  if(food.foodNote === currentExt.note) {
                    if (food.productId === this.state.currentData.productId) {
                      isFound = true
                      food.foodAmount += currentExt.detailCategory[0].amount;
                    }
                  }
                } 
              });
            }
          }
        })
        if(isFound === false) {
          var isAdded = false
          cart.forEach((data) => {
              if (data.mid === this.state.data.mid) {
                data.food.forEach((food) => {
                  if(isAdded === false) {
                    isAdded = true
                    data.food.push({
                      productId: this.state.currentData.productId,
                      foodName: this.state.currentData.foodName,
                      foodPrice: this.state.currentData.foodPrice,
                      foodImage: this.state.currentData.foodImage,
                      foodAmount: currentExt.detailCategory[0].amount,
                      foodNote: currentExt.note,
                    });
                  }
              });
            }
          })
        };
      } else {
        cart.forEach((data) => {
          if (data.mid === this.state.data.mid) {
            data.food.push({
              productId: this.state.currentData.productId,
              foodName: this.state.currentData.foodName,
              foodPrice: this.state.currentData.foodPrice,
              foodImage: this.state.currentData.foodImage,
              foodAmount: currentExt.detailCategory[0].amount,
              foodNote: currentExt.note,
            });
          }
        });
      }
    } else {
      cart.push({
        mid: mid,
        storeName: currentMerchant.storeName,
        storeDesc: currentMerchant.storeDesc,
        storeDistance: currentMerchant.distance,
        food: [
          {
            productId: this.state.currentData.productId,
            foodName: this.state.currentData.foodName,
            foodPrice: this.state.currentData.foodPrice,
            foodImage: this.state.currentData.foodImage,
            foodAmount: currentExt.detailCategory[0].amount,
            foodNote: currentExt.note,
          },
        ],
      });
    }
    let addedMerchants = []
    if(Cookies.get("addedMerchants") === undefined) {
      if(!addedMerchants.includes(mid)) {
        addedMerchants.push(mid)
        Cookies.set("addedMerchants", addedMerchants)
      }
    } else {
      addedMerchants = JSON.parse(Cookies.get("addedMerchants"))
      if(!addedMerchants.includes(mid)) {
        addedMerchants.push(mid)
        Cookies.set("addedMerchants", addedMerchants)
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    var auth = {
      isLogged: false,
      token: "",
      new_event: true,
      recommendation_status: false,
      email: "",
    };
    if(Cookies.get("auth") !== undefined) {
      auth = JSON.parse(Cookies.get("auth"))
    }
    if(auth.isLogged === false) {
      var lastLink = { value: window.location.href}
      Cookies.set("lastLink", lastLink,{ expires: 1})
      window.location.href = "/login"
    }
    let uuid = uuidV4();
    const date = new Date().toISOString();
    uuid = uuid.replaceAll("-", "");
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
    Axios(address + "/txn/v1/cart-post/", {
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
        mid: this.state.data.mid,
        pid: this.state.currentData.productId,
        qty: currentExt.detailCategory[0].amount,
        notes: currentExt.note,
      }
    })
    .then((res) => {
    })
    .catch((err) => {
    });
  }
  };

  changeMenu = () => {
    this.setState({openSelect: !this.state.openSelect})
    document.removeEventListener('scroll', this.loadMoreMerchant)
  }

  changeHeader = (menu) => {
      this.setState({categName: menu, openSelect: false})
  }

  scrolltoMenu = () => {
    if(this.state.categName !== "All Categories") {
      if(this.state.openSelect == false) {
        //scroll to selected menu
        document.addEventListener('scroll', this.loadMoreMerchant)
        console.log(this.state.showcategName[0].category_name);
        console.log(this.state.categName);
        document.getElementById(this.state.categName).scrollIntoView({behavior: "smooth"})
      }
    }
  }
  
  isBottom = (el) => {
    return (el.getBoundingClientRect().top + 100) <= window.innerHeight
  }

  stopAndLoadMore = (ind) => {
    console.log(ind);
    console.log(this.state.idCateg[ind]);
    console.log(this.state.testpage[ind]);
    if(this.state.idCateg[ind] <= this.state.testpage[ind]) {
      console.log('testloadmore');
      var openidCateg = [...this.state.idCateg]
      openidCateg[ind] += 1
      this.setState({idCateg: openidCateg, boolpage: true, choosenIndCateg: ind})
    } else {
      console.log('nambah');
      var num = this.state.counterLoad
      num++
      this.setState({counterLoad: num})
    }
  }

  loadMoreMerchant = () => {
    this.state.showcategName.forEach((val, ind)=> {
      var wrappedElement = document.getElementById(ind)
      if(this.isBottom(wrappedElement)) { 
        console.log(this.state.counterLoad);
        if(wrappedElement.id == this.state.counterLoad) {
          document.removeEventListener('scroll', this.loadMoreMerchant)
          this.stopAndLoadMore(ind)
        }
      }
    })
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.loadMoreMerchant)
  }

  contentView = () => {
    return this.state.showcategName.map((categ, indcateg)=> {
      return (
        <div key={indcateg} className='product-section'>
          <h2 id={categ.category_name.toLocaleLowerCase()} className='product-categ'>{categ.category_name.toLocaleLowerCase() || <Skeleton height={30} width={100} />}</h2>

          <div className='list-product'>
            {
              categ.category_products.map((product, indprod)=> {
                return (
                  <div key={indprod} className='product-merchant' onClick={() => this.handleDetail(product)}>
                    <div className='product-img'>
                      {
                        product.foodImage?
                        <img src={product.foodImage} style={{objectFit: 'cover'}} width='100%' height='100%' />
                        :
                        <Skeleton height={120} style={{paddingTop: 50}}/>
                      }
                    </div>

                    <div className='product-detail-mob'>
                      <div className='product-detail'>
                        <div className='product-star'>
                          <img className='product-star-img' src={StarIcon} />
                          <h6 className='product-star-rating'>5.0</h6>
                        </div>

                        <div className='product-name'>
                          {product.foodName || <Skeleton style={{paddingTop: 10}} />}
                        </div>

                        <div className='product-desc'>
                          {product.foodDesc? product.foodDesc : "Product Description"}
                        </div>

                        <div className='product-price'>
                          {Intl.NumberFormat("id-ID").format(product.foodPrice)}
                        </div>
                      </div>
                      <div className='product-price-mob'>
                        {Intl.NumberFormat("id-ID").format(product.foodPrice)}
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          {
            this.state.idCateg[indcateg] <= this.state.testpage[indcateg]?
            <div id={indcateg}>
              <Skeleton style={{paddingTop:100, borderRadius: 30}} />
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

  menuDetail = () => {
    if (this.state.showMenuDet === true) {
      return (
        <MenuDetail
          isShow={this.state.showMenuDet}
          onHide={() => this.setMenuDetail(false)}
          datas={this.state.currentData}
          menuClick={() => this.setModal(true)}
          handleCateg={this.state.showcategName}
        />
      );
    }
  }

  render() {
    let modal;
    if (this.state.showModal === true) {
      modal = (
        <PikaModal
          isShow={() => this.setModal(true)}
          onHide={() => this.setModal(false)}
          datas={this.state.currentData}
          handleClick={this.handleAddCart}
          handleData={this.handleCart}
        />
      );
    } else {
      modal = <></>;
    }

    let cartButton;
    if (cart.length > 1) {
      cartButton = (
        <Link to={"/cart?table=" + this.state.data.notable} className={"btn-productCart"}>
          <img src={cartIcon} alt={"cart"} />
        </Link>
      );
    } else {
      cartButton = <></>;
    }

    return (
      <>
        <div className='storeBanner' onClick={()=> this.changeBackground()}>
            {//only for testing, would be remove
              this.state.testingchange == false ?
              <img src={Storeimg} style={{objectFit: 'cover'}} width='100%' height='100%' />
              :
              <img src={Storeimg2} style={{objectFit: 'cover'}} width='100%' height='100%' />
            }
            <div className='iconBanner'>
              <Link to={"/profile"}>
                <div className='profileIcon-sec'>
                    <div className='profileIcon'>
                        <span className='reactProfIcons'>
                            <img className='profileicon-img' src={ProfileIcon} />
                        </span>
                    </div>
                </div>
              </Link>

              <Link to={"/status"}>
                <div className='notifIcon-sec'>
                    <div className='notifIcon'>
                        <span className='reactNotifIcons'>
                            <img className='notificon-img' src={NotifIcon} />
                        </span>
                    </div>
                </div>
              </Link>
            </div>
        </div>
        <div className='merchant-section' style={{backgroundColor: this.state.backColor1}}>
          <div className='inside-merchantSection'>
            <div className='merchant-info'>
                <div className='top-merchantInfo'>
                    <div className='inside-topMerchantInfo'>
                        <div className='merchant-title'>
                            <div className='merchant-logo'>
                              <img src={this.state.data.image || <Skeleton />} style={{objectFit: 'cover'}} width='100%' height='100%' />
                            </div>

                            <div className='merchant-name'>
                                <div className='merchant-mainName'>
                                  {this.state.data.title || <Skeleton style={{paddingTop: 30, width: 200}} />}
                                </div>

                                <div className='merchant-categName'>
                                    <div className='merchant-allcateg'>Merchant Category</div>
                                    <div className='merchant-starInfo'>
                                        {
                                          this.state.data.rating?
                                          <>
                                            <img className='star-img' src={StarIcon} />
                                            <div className='merchant-star'>{this.state.data.rating}</div>
                                          </>
                                          :
                                          <Skeleton width={50} />
                                        }
                                        {/* <div className='star-votes'>(50+ Upvotes)</div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='merchant-call-sec' onClick={()=> this.handlePhone(this.state.data.phone)}>
                            <div className='merchant-call'>
                                <span className='merchantCall-icon'>
                                    <img className='merchantCall-img' src={PhoneIcon} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bottom-merchantInfo'>
                    <div className='inside-bottomMerchantInfo'>
                        <div className='merchantdetail-section'>
                            <div className='icon-based'>
                                <img className='openhouricon' src={OpenHourIcon} />
                            </div>

                            <div className='detail-info'>
                                <div className='top-detail-info'>Open</div>
                                <div className='bottom-detail-info'>Jum (08.00 - 20.00)</div>
                            </div>
                        </div>
                        <div className='merchantdetail-section'>
                            <div className='icon-based'>
                                <img className='coinicon' src={CoinIcon} />
                            </div>

                            <div className='detail-info'>
                                <div className='top-detail-info'>$$$</div>
                                <div className='bottom-detail-info'>50 K - 100 K</div>
                            </div>
                        </div>
                        <div className='merchantdetail-section'>
                            <div className='icon-based'>
                                <img className='locationicon' src={LocationIcon} />
                            </div>

                            <div className='detail-info'>
                                <div className='top-detail-info'>Store Address</div>
                                <div className='bottom-detail-info'>{this.state.data.address || <Skeleton style={{paddingTop: 30, width: 100}} />}</div>
                            </div>
                        </div>     
                    </div>
                </div>
            </div>
            <div className='merchant-category'>
              <div className='select-category'>
                  <div className='listCategory'>
                      <h2 className='categoryName'>{this.state.categName}</h2>

                      <div className='arrow-based' onClick={()=> this.changeMenu()} >
                          <img className='arrowicon' src={ArrowIcon} />
                      </div>
                  </div>

                  {
                    this.state.openSelect?
                    <div className='custom-options'>
                        <span className='custom-optionCloser' defaultValue='Rice Box'>Closer</span>
                        {
                          this.state.showcategName.map((menuCategory)=> (
                            <span className='custom-option' onClick={()=> this.changeHeader(menuCategory.category_name.toLocaleLowerCase())}>{menuCategory.category_name.toLocaleLowerCase()}</span>
                          ))
                        }
                    </div>
                    :
                    null
                  }
              </div>    
            </div>
          </div>
        </div>
        <div className='product-layout' style={{backgroundColor: this.state.backColor2}}>
          <div className='mainproduct-sec'>
            {this.contentView()}

            <div className='pikapp-info'>
              <h3 className='pikappInfo'>Digital Menu By</h3>
              <img className='Logopikapp' src={Logopikapp} />
            </div>
          </div>
        </div>
        {modal}
        {cartButton}
        {this.menuDetail()}
      </>
    );
  }
}

const Mapstatetoprops = (state) => {
  return {
    AllRedu: state.AllRedu
  }
}

export default connect(Mapstatetoprops,{ValidQty})(ProductView)