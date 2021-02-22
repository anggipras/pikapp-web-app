import React from "react";
import { prominent } from "color.js";
import rgbHex from 'rgb-hex'
import { Col, Row, Image, Card, Tabs, Tab, Container } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import { PikaModal } from "../../Component/Modal/PikaModal";
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
import Productimg from '../../Asset/Illustration/productimg.png'
import Logopikapp from '../../Asset/Logo/logo4x.png'
import NotifIcon from '../../Asset/Icon/bell.png'
import ProfileIcon from '../../Asset/Icon/avatar.png'
import OpenHourIcon from '../../Asset/Icon/hour.png'
import CoinIcon from '../../Asset/Icon/coin.png'
import LocationIcon from '../../Asset/Icon/location.png'
import PhoneIcon from '../../Asset/Icon/phone.png'
import StarIcon from '../../Asset/Icon/star.png'
import ArrowIcon from '../../Asset/Icon/arrowselect.png'

var currentExt = {
  detailCategory: [
    {
      name: "",
      amount: 0,
    },
  ],
  note: "",
};

export class ProductView extends React.Component {
  state = {
    testColor: false,
    testingchange: false, //only for testing, would be remove
    showModal: false,
    data: {
      mid: "",
      title: "",
      image: "",
      desc: "",
      address: "",
      rating: "",
      phone: "",
      data: [
        {
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
      ],
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
    backColor1: "",
    backColor2: "",
  };

  componentDidMount() {
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
    const value = queryString.parse(window.location.search);
    const mid = value.mid;
    const notab = value.table || ""
    let addressRoute = address + "home/v1/list/product/";
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
        "mid": mid,
      },
      method: "GET",
    })
    .then((res) => {
        stateData = { ...this.state.data };
        let responseDatas = res.data.results;
        stateData.data.pop();
        stateData.mid = mid;
        stateData.title = currentMerchant.storeName;
        stateData.image = currentMerchant.storeImage;
        stateData.desc = currentMerchant.storeDistance;
        stateData.address = currentMerchant.storeAdress;
        stateData.rating = currentMerchant.storeRating;
        stateData.phone = "081296000823";
        stateData.notable = notab
        stateData.data.push({
          category: "All Category",
          productId: "",
          foodName: "",
          foodDesc: "",
          foodPrice: "",
          foodImage: "",
        })
        responseDatas.forEach((data) => {
          stateData.data.push({
              productId: data.product_id,
              foodName: data.product_name,
              foodDesc: "",
              foodPrice: data.product_price,
              foodImage: data.product_picture[0],
          })
        })
        prominent(Storeimg, { amount: 3 }).then((color) => {
          console.log(color); // [241, 221, 63]
          var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
          var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
          this.brightenColor(merchantColor, 70, productColor, 60)
          this.setState({ data: stateData });
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
          console.log(color); // [241, 221, 63]
          var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
          var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
          this.brightenColor(merchantColor, 70, productColor, 60)
        });
      } else {
        prominent(Storeimg2, { amount: 3 }).then((color) => {
          console.log(color); // [241, 221, 63]
          var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
          var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
          this.brightenColor(merchantColor, 70, productColor, 60)
        });
      }
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

  handlePhone = (phone) => {
    phone.substring(1)
    let waNumber = '62' + phone
    window.location.href = `https://wa.me/${waNumber}`
  }

  handleDetail(data) {
    this.setState({ currentData: data });
    this.setState({ showModal: true });
  }

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }

  handleCart = (data) => {
    currentExt = data;
  };

  handleAddCart = () => {
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
  };

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
    const storeDatas = this.state.data.data.map((data) => {
      return data;
    });

    let categories = [];
    categories = storeDatas.filter((data) => {
      if (!categories.includes(data.category)) {
        return categories.push(data.category);
      } else {
        return null;
      }
    });

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
    console.log(categories);
    console.log(storeDatas);
    const contentView = categories.map((data) => {
      if (data.category === "All Category") {
        var allCards = storeDatas.map((cardData) => {
          if (cardData.category === "All Category") {
            return null;
          } else {
            return (
              <div className='product-merchant' onClick={() => this.handleDetail(cardData)}>
                <div className='product-img'>
                  <img src={cardData.foodImage? cardData.foodImage : Productimg} style={{objectFit: 'cover'}} width='100%' height='100%' />
                </div>

                <div className='product-detail-mob'>
                  <div className='product-detail'>
                    <div className='product-star'>
                      <img className='product-star-img' src={StarIcon} />
                      <h6 className='product-star-rating'>5.0</h6>
                    </div>

                    <div className='product-name'>
                      {cardData.foodName}
                    </div>

                    <div className='product-desc'>
                      {cardData.foodDesc? cardData.foodDesc : "Product Description"}
                    </div>

                    <div className='product-price'>
                      {Intl.NumberFormat("id-ID").format(cardData.foodPrice)}
                    </div>
                  </div>
                  <div className='product-price-mob'>
                    {Intl.NumberFormat("id-ID").format(cardData.foodPrice)}
                  </div>
                </div>
              </div>
              // <Row>
              //   <Col xs={4} md={4} lg={3}>
              //     <Image
              //       src={cardData.foodImage}
              //       rounded
              //       fluid
              //       className="foodImage"
              //     />
              //   </Col>
              //   <Col xs={8} md={8} lg={9}>
              //     <Row>
              //       <Col xs={7} md={6} lg={9}>
              //         <h5 className="foodTitle">{cardData.foodName}</h5>
              //         <p className="foodDesc">{cardData.foodDesc}</p>
              //         <div className="foodButton">
              //           <PikaButton
              //             title="ADD TO CART"
              //             buttonStyle="cartPika"
              //             handleClick={() => this.handleDetail(cardData)}
              //           />
              //         </div>
              //       </Col>
              //       <Col xs={5} md={3} lg={3}>
              //         <h6 className="foodPrice">
              //           {Intl.NumberFormat("id-ID", {
              //             style: "currency",
              //             currency: "IDR",
              //           }).format(cardData.foodPrice)}
              //         </h6>
              //       </Col>
              //     </Row>
              //   </Col>
              // </Row>
            );
          }
        });
        return (
          // <Tab eventKey={data.category} title={data.category}>
          //   <Row>
          //     <Col>
          //       <h5 className="foodHeader">{data.category}</h5>
          //     </Col>
          //   </Row>
          //   {allCards}
          // </Tab>
          allCards
        );
      } else {
        // var cards = storeDatas.map((cardData) => {
        //   if (data.category === cardData.category) {
        //     return (
        //       <div className='product-merchant' onClick={() => this.handleDetail(cardData)}>
        //         <div className='product-img'>
        //           <img src={cardData.foodImage? cardData.foodImage : Productimg} style={{objectFit: 'cover'}} width='100%' height='100%' />
        //         </div>

        //         <div className='product-detail-mob'>
        //           <div className='product-detail'>
        //             <div className='product-star'>
        //               <img className='product-star-img' src={StarIcon} />
        //               <h6 className='product-star-rating'>5.0</h6>
        //             </div>

        //             <div className='product-name'>
        //               {cardData.foodName}
        //             </div>

        //             <div className='product-desc'>
        //               {cardData.foodDesc}
        //             </div>

        //             <div className='product-price'>
        //               {/* {Intl.NumberFormat("id-ID", {
        //                   style: "currency",
        //                   currency: "IDR",
        //                 }).format(cardData.foodPrice)} */}
        //                 {cardData.foodPrice}
        //             </div>
        //           </div>
        //           <div className='product-price-mob'>
        //             {cardData.foodPrice}
        //           </div>
        //         </div>
        //       </div>
        //       // <Card>
        //       //   <Row>
        //       //     <Col xs={4} md={3}>
        //       //       <Image
        //       //         src={cardData.foodImage}
        //       //         rounded
        //       //         fluid
        //       //         className="foodImage"
        //       //       />
        //       //     </Col>
        //       //     <Col xs={8} md={9}>
        //       //     <Row>
        //       //       <Col xs={7} md={9}>
        //       //         <h5 className="foodTitle">{cardData.foodName}</h5>
        //       //         <p className="foodDesc">{cardData.foodDesc}</p>
        //       //         <div className="foodButton">
        //       //           <PikaButton
        //       //             title="ADD TO CART"
        //       //             buttonStyle="cartPika"
        //       //             handleClick={() => this.handleDetail(cardData)}
        //       //           />
        //       //         </div>
        //       //       </Col>
        //       //       <Col xs={5} md={3}>
        //       //         <h6 className="foodPrice">
        //       //           {Intl.NumberFormat("id-ID", {
        //       //             style: "currency",
        //       //             currency: "IDR",
        //       //           }).format(cardData.foodPrice)}
        //       //         </h6>
        //       //       </Col>
        //       //     </Row>
        //       //   </Col>
        //       //   </Row>
        //       // </Card>
        //     );
        //   } else {
        //     return null;
        //   }
        // });
        // return (
        //   // <Tab eventKey={data.category} title={data.category}>
        //   //   <Row>
        //   //     <Col>
        //   //       <h5 className="foodHeader">{data.category}</h5>
        //   //     </Col>
        //   //   </Row>
        //   //   {cards}
        //   // </Tab>
        //   cards
        // );
      }
    });

    return (
      <>
        <div className='storeBanner'>
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
                              <img src={this.state.data.image? this.state.data.image : Productimg} style={{objectFit: 'cover'}} width='100%' height='100%' />
                            </div>

                            <div className='merchant-name'>
                                <div className='merchant-mainName'>
                                  {this.state.data.title}
                                </div>

                                <div className='merchant-categName'>
                                    <div className='merchant-allcateg'>Merchant Category</div>
                                    <div className='merchant-starInfo'>
                                        <img className='star-img' src={StarIcon} />
                                        <div className='merchant-star'>{this.state.data.rating? this.state.data.rating : "No Rating"}</div>
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
                                <div className='bottom-detail-info'>{this.state.data.address}</div>
                            </div>
                        </div>     
                    </div>
                </div>
            </div>
            <div className='merchant-category' onClick={()=> this.changeBackground()}>
                <div className='select-category'>
                    <div className='listCategory'>
                        <h2 className='categoryName'>Rice Box</h2>

                        <div className='arrow-based' >
                            <img className='arrowicon' src={ArrowIcon} />
                        </div>
                    </div>
                </div>    
            </div>
          </div>
        </div>
        <div className='product-layout' style={{backgroundColor: this.state.backColor2}}>
          <div className='mainproduct-sec'>
            <div className='product-section'>
              <h2 className='product-categ'>Rice Box</h2>

              <div className='list-product'>
                {contentView}
              </div>
            </div>

            <div className='pikapp-info'>
              <h3 className='pikappInfo'>Digital Menu By</h3>
              <img className='Logopikapp' src={Logopikapp} />
            </div>
          </div>
        </div>
        {modal}
        {cartButton}

        {/* <Row>
          <Col xs={4} md={2}>
            <Image
              src={this.state.data.image}
              roundedCircle
              className="storeImage"
            />
          </Col>
          <Col xs={8} md={4} className="storeColumn">
            <h2 className="storeLabel" style={{ textAlign: "left" }}>
              {this.state.data.title}
            </h2>
            <p className="storeLabel" style={{ textAlign: "left" }}>
              {this.state.data.desc}
            </p>
          </Col>
          <Col />
        </Row>
        <Row />
        <Row>
          <Col md={12}>
            <Tabs defaultActiveKey="All Category">{contentView}</Tabs>
          </Col>
        </Row>
        {modal}
        {cartButton} */}
      </>
    );
  }
}