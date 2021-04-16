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
import Storeimg from '../../Asset/Illustration/storeimg2.jpeg'
import Storeimg2 from '../../Asset/Illustration/storeimg1.png'
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
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { ValidQty, OpenSelect } from '../../Redux/Actions'

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
    size: 3, //set amount of products to be shown in frontend
    boolpage: false,
    productPage: [], //set how many page of product merchant from backend server
    idCateg: [], //set current product page of specific size of loaded products
    testColor: false,
    testingchange: false, //only for testing, would be remove
    showModal: false, // show customization of selected menu such as qty, notes and more advance choice
    showMenuDet: false, //show menu detail
    data: {
      mid: "",
      title: "",
      image: "",
      logo: "",
      desc: "",
      address: "",
      rating: "",
      phone: "",
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
  };

  componentDidMount() {
    this.props.ValidQty(0)
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
      auth = JSON.parse(Cookies.get("auth"))
    }
    if (auth.isLogged === false) {
      var lastLink = { value: window.location.href }
      Cookies.set("lastLink", lastLink, { expires: 1 })
      window.location.href = "/login"
    }
    var currentMerchant = JSON.parse(Cookies.get("currentMerchant"))
    const value = queryString.parse(window.location.search);
    const mid = value.mid;
    const notab = value.table || ""
    let selectedMerchant = JSON.parse(localStorage.getItem('selectedMerchant'))
    let filtersizeMerchant = JSON.parse(localStorage.getItem('selectedMerchant'))

    let bannerMerchant = currentMerchant.storeImage
    bannerMerchant = bannerMerchant.replace(/^https:\/\//i, 'http://')
    console.log(bannerMerchant);

    let stateData = { ...this.state.data };
    stateData.mid = mid;
    stateData.title = currentMerchant.storeName;
    stateData.image = currentMerchant.storeImage;
    stateData.logo = currentMerchant.storeLogo;
    stateData.desc = currentMerchant.storeDistance;
    stateData.address = currentMerchant.storeAdress;
    stateData.rating = currentMerchant.storeRating;
    stateData.phone = "081296000823";
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

    let newImage = currentMerchant.storeImage
    newImage = newImage.replace(/^https:\/\//i, 'http://')
    console.log(newImage);

    prominent(Storeimg2, { amount: 3 }).then((color) => {
      // return RGB color for example [241, 221, 63]
      var merchantColor = rgbHex(color[0][0], color[0][1], color[0][2])
      var productColor = rgbHex(color[2][0], color[2][1], color[2][2])
      this.brightenColor(merchantColor, 70, productColor, 60)
      this.setState({ data: stateData, allProductsandCategories: productCateg, productCategpersize: productPerSize, idCateg, productPage });
      document.addEventListener('scroll', this.loadMoreMerchant)
    });
  }

  componentDidUpdate() {
    if (this.state.idCateg[this.state.choosenIndCateg] > 0) { //load more products with selected index of category
      if (this.state.boolpage === true) {
        this.loadProducts(this.state.choosenIndCateg)
      } else {
        document.addEventListener('scroll', this.loadMoreMerchant)
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
    const mid = value.mid;
    this.setModal(false);
    var isStorePresent = false;
    let cart = JSON.parse(localStorage.getItem('cart'))
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

          console.log(sizecartArr);
          console.log(sizecurrentArr);
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
          console.log('duplicate');
          cart.forEach((data) => {
            if (isFound === false) {
              if (data.mid === this.state.data.mid) {
                console.log('same mid');
                // data.food.forEach((food) => {
                //   if (isFound === false) {
                //     if (food.foodNote === currentExt.note) {
                //       if (food.productId === this.state.currentData.productId) {
                //         isFound = true
                //         food.foodAmount += currentExt.detailCategory[0].amount;
                //       }
                //     }
                //   }
                // });

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
          console.log('noduplicate choice');
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
        console.log('noduplicate product');
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
        storeDesc: currentMerchant.storeDesc,
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
      position: 'top-end',
      icon: 'success',
      title: 'Berhasil masuk cart',
      showConfirmButton: false,
      timer: 1500
    })
    // alert('berhasil masuk cart')
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
    // console.log(ind);
    // console.log(this.state.idCateg[ind]);
    // console.log(this.state.productPage[ind]);
    if (this.state.productCategpersize[ind].category_products.length < this.state.allProductsandCategories[ind].category_products.length) {
      // console.log('testloadmore');
      var openidCateg = [...this.state.idCateg]
      openidCateg[ind] += this.state.size

      var openproductPage = [...this.state.productPage]
      openproductPage[ind] += this.state.size

      this.setState({ idCateg: openidCateg, productPage: openproductPage, boolpage: true, choosenIndCateg: ind })
    } else {
      // console.log('nambah');
      var num = this.state.counterLoad
      num++
      this.setState({ counterLoad: num })
    }
  }

  loadMoreMerchant = () => {
    this.state.productCategpersize.forEach((val, ind) => {
      var wrappedElement = document.getElementById(ind)
      if (this.isBottom(wrappedElement)) {
        // console.log(this.state.counterLoad, 'counterLoad');
        // console.log(wrappedElement.id, 'wrap');
        if (wrappedElement.id == this.state.counterLoad) {
          // console.log(ind, 'selected index');
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
    return this.state.productCategpersize.map((categ, indcateg) => {
      return (
        <div key={indcateg} className='product-section'>
          <h2 id={categ.category_name.toLocaleLowerCase()} className='product-categ'>{categ.category_name.toLocaleLowerCase() || <Skeleton height={30} width={100} />}</h2>

          <div className='list-product'>
            {
              categ.category_products.map((product, indprod) => {
                return (
                  <div key={indprod} className='product-merchant' onClick={() => this.handleDetail(product)}>
                    <div className='product-img'>
                      {
                        product.foodImage ?
                          <img src={product.foodImage} style={{ objectFit: 'cover' }} width='100%' height='100%' alt='' />
                          :
                          <Skeleton height={120} style={{ paddingTop: 50 }} />
                      }
                    </div>

                    <div className='product-detail-mob'>
                      <div className='product-detail'>
                        <div className='product-star'>
                          <img className='product-star-img' src={StarIcon} alt='' />
                          <h6 className='product-star-rating'>5.0</h6>
                        </div>

                        <div className='product-name'>
                          {product.foodName || <Skeleton style={{ paddingTop: 10 }} />}
                        </div>

                        <div className='product-desc'>
                          {product.foodDesc ? product.foodDesc : "Product Description"}
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

  render() {
    let cartButton;
    const value = queryString.parse(window.location.search);
    const notab = value.table || ""
    if (JSON.parse(localStorage.getItem('cart'))) {
      let allCart = JSON.parse(localStorage.getItem('cart'))
      let filterMerchantCart = allCart.filter(cartVal => {
        return this.state.data.mid === cartVal.mid
      })
      if (filterMerchantCart.length) {
        localStorage.setItem('table', notab)
        localStorage.setItem('lastTable', notab)
        if (filterMerchantCart[0].mid) {
          cartButton = (
            <Link to={"/cart"} className={"btn-productCart"}>
              <img src={cartIcon} alt='' />
            </Link>
          );
        } else {
          cartButton = <></>;
        }
      } else {
        cartButton = <></>;
      }
    } else {
      let cart = JSON.parse(localStorage.getItem('cart'))
      if (cart.length > 1) {
        localStorage.setItem('table', notab)
        localStorage.setItem('lastTable', notab)
        cartButton = (
          <Link to={"/cart"} className={"btn-productCart"}>
            <img src={cartIcon} alt={"cart"} />
          </Link>
        );
      } else {
        cartButton = <></>;
      }
    }

    if (this.state.categName !== "All Categories") {
      if (this.props.AllRedu.openSelect === false) {
        //scroll to selected menu
        document.addEventListener('scroll', this.loadMoreMerchant)
        document.getElementById(this.state.categName).scrollIntoView({ behavior: "smooth" })
        this.setState({ categName: 'All Categories' })
      }
    }

    return (
      <>
        <div className='storeBanner'>
          <img src={this.state.data.image || <Skeleton />} style={{ objectFit: 'cover' }} width='100%' height='100%' alt='' />
          <div className='iconBanner'>
            <Link to={"/profile"}>
              <div className='profileIcon-sec'>
                <div className='profileIcon'>
                  <span className='reactProfIcons'>
                    <img className='profileicon-img' src={ProfileIcon} alt='' />
                  </span>
                </div>
              </div>
            </Link>

            <Link to={"/status"}>
              <div className='notifIcon-sec'>
                <div className='notifIcon'>
                  <span className='reactNotifIcons'>
                    <img className='notificon-img' src={NotifIcon} alt='' />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className='merchant-section' style={{ backgroundColor: this.state.backColor1 }}>
          <div className='inside-merchantSection'>
            <div className='merchant-info'>
              <div className='top-merchantInfo'>
                <div className='inside-topMerchantInfo'>
                  <div className='merchant-title'>
                    <div className='merchant-logo'>
                      <img src={this.state.data.logo || <Skeleton />} style={{ objectFit: 'cover' }} width='100%' height='100%' alt='' />
                    </div>

                    <div className='merchant-name'>
                      <div className='merchant-mainName'>
                        {this.state.data.title || <Skeleton style={{ paddingTop: 30, width: 200 }} />}
                      </div>

                      <div className='merchant-categName'>
                        <div className='merchant-allcateg'>Merchant Category</div>
                        <div className='merchant-starInfo'>
                          {
                            this.state.data.rating ?
                              <>
                                <img className='star-img' src={StarIcon} alt='' />
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
                  <div className='merchant-call-sec' onClick={() => this.handlePhone(this.state.data.phone)}>
                    <div className='merchant-call'>
                      <span className='merchantCall-icon'>
                        <img className='merchantCall-img' src={PhoneIcon} alt='' />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bottom-merchantInfo'>
                <div className='inside-bottomMerchantInfo'>
                  <div className='merchantdetail-section'>
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
                  </div>
                  <div className='merchantdetail-section'>
                    <div className='icon-based'>
                      <img className='locationicon' src={LocationIcon} alt='' />
                    </div>

                    <div className='detail-info'>
                      <div className='top-detail-info'>Store Address</div>
                      <div className='bottom-detail-info'>{this.state.data.address || <Skeleton style={{ paddingTop: 30, width: 100 }} />}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='merchant-category'>
              <div className='select-category'>
                <div className='listCategory'>
                  <h2 className='categoryName'>{this.state.categName}</h2>

                  <div className='arrow-based' onClick={() => this.changeMenu()} >
                    <img className='arrowicon' src={ArrowIcon} alt='' />
                  </div>
                </div>

                {
                  this.props.AllRedu.openSelect ?
                    <div className='custom-options'>
                      <span className='custom-optionCloser' defaultValue='Rice Box'>Closer</span>
                      {
                        this.state.productCategpersize.map((menuCategory, index) => (
                          <span key={index} className='custom-option' onClick={() => this.changeHeader(menuCategory.category_name.toLocaleLowerCase())}>{menuCategory.category_name.toLocaleLowerCase()}</span>
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
        <div className='product-layout' style={{ backgroundColor: this.state.backColor2 }}>
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
      </>
    );
  }
}

const Mapstatetoprops = (state) => {
  return {
    AllRedu: state.AllRedu
  }
}

export default connect(Mapstatetoprops, { ValidQty, OpenSelect })(ProductView)