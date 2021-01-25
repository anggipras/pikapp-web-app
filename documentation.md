# pikapp-web documentation

## Table of Content

- [Introduction](#Introduction)
- [Features](#Features)
- [Code Hierarchy](#Code-Hierarchy)
- [Dependencies](#Dependencies)

### Introduction
Hello, this is a documentation for pikapp-web. This website is created using React framework for its development created by facebook.
This repo contains only the front-end of the pikapp-web which will control the front-end logic and display of the website itself.
This website also uses react-bootstrap as its foundation for the stylesheet.
The website initial state will always have a longitude and latitude value to determine its location. Every page will also have handling
to detect whether user has logged or not by looking at its cookie. If not user will be redirected to login page.


```
if(auth.isLogged === false) {
      var lastLink = { value: window.location.href}
      Cookies.set("lastLink", lastLink,{ expires: 1})
      window.location.href = "/login"
    }
```

This is also the basic header that we need to satisfy which are uuid, date and signature(using sha256)
```
let uuid = uuidV4();
    uuid = uuid.replaceAll("-", "");
    const date = new Date().toISOString();
    let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
```

## Features
Currently there are 6 main features that are present in this repo.
The features are as follow

- __Auth__

Auth contains the initial screen for login and register.
This view will handle most of front-end logic such as email regex validity, password requirements and others.
You can view the main component of this auth in here:
`src/View/Auth/FormView.js`

Auth contain several basic state to handle the form after the user pressed the button.

```
state = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isValid: true,
    isCaptcha: false,
    captchaCounter: 0,
    errorMsg: "",
  };
```


isValid refer to whether the input that user put is valid or not. its handled by these functions

```
  handleEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  handleName = (e) => {
    this.setState({ name: e.target.value });
  };

  handlePhone = (e) => {
    this.setState({ phone: e.target.value });
  };

  handleConfirmPassword = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };

  checkEmail = () => {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(this.state.email)) {
      return true;
    } else {
      this.setState({ errorMsg: "Email is not valid." });
      return false;
    }
  };

  checkName = () => {
    if (this.state.name.length > 0) {
      return true;
    } else {
      this.setState({ errorMsg: "Name cannot be empty." });
      return false;
    }
  };

  checkPassword = () => {
    let passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordRegex.test(this.state.password)) {
      this.setState({
        errorMsg:
          "Password must be within 8 to 16 characters and contain at least one uppercase letter and one symbol.",
      });
      return false;
    }
    if (this.state.password.length < 8 || this.state.password.length > 16) {
      this.setState({
        errorMsg:
          "Password must be within 8 to 16 characters and contain at least one uppercase letter and one symbol.",
      });
      return false;
    } else {
      return true;
    }
  };

  checkConfirmPassword = () => {
    if (this.state.password === this.state.confirmPassword) {
      return true;
    } else {
      this.setState({ errorMsg: "Password does not match." });
      return false;
    }
  };
  
   checkPhone = () => {
    if (this.state.phone.startsWith("08")) {
      return true;
    } else {
      this.setState({ errorMsg: "Phone not valid." });
      return false;
    }
  };
```

After user successfully inputted the value and pressed the button, then it will trigger an API calling function
for login and register

```
axios(address + "auth/register", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
      },
      method: "POST",
      data: data,
    })
      .then((res) => {
        alert("Register berhasil.")
        this.handleLogin()
      })
      .catch((err) => {
        if(err.response.data !== undefined) {
          alert(err.response.data.err_message)
        }
        this.setState({ captchaCounter: this.state.captchaCounter + 1 });
      });
      
      
      axios(address + "auth/login", {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
      },
      method: "POST",
      data: data,
    })
      .then((res) => {
        auth.isLogged = true;
        auth.token = res.data.token;
        auth.new_event = res.data.new_event;
        auth.recommendation_status = res.data.recommendation_status;
        auth.email = this.state.email;
        Cookies.set("auth", auth, { expires: 1});
        if(Cookies.get("lastLink") !== undefined) {
          window.location.href = JSON.parse(Cookies.get("lastLink")).value
        }
        alert("Login berhasil.")
      })
      .catch((err) => {
        if(err.response.data !== undefined) {
          alert(err.response.data.err_message)
        }
        this.setState({ captchaCounter: this.state.captchaCounter + 1 });
      });
```

We are using axios as a dependency to help calling the api. The api spec follows the structure that was provided in the api documentation.
after user finishes registering, the web will immediately call the login api and follow along its login route.
When user login successfully they will gain a token, logged status, new_event, and recommendation status that will be stored in a cookies.

`Cookies.set("auth", auth, { expires: 1});`

- __Store__

Store is the homepage of pikapp-web after user successfully signed in.
It will contain all the stores that are available within the range provided by the longitude and latitude.
The longitude and latitude are given from the query parameter.
Here are the state that this feature is using


```
  state = {
    location: "",
    data: {
      title: "",
      image: "",
      desc: "",
      data: [
        {
          address: "",
          rating: "",
          logo: "",
          distance: "",
          storeId: "",
          storeName: "",
          storeDesc: "",
          storeImage: "",
        },
      ],
    },
  };
  ```
  
  It will have the header of the view as well as an array containing all the store that are available within a range.
  
  The store page information will be stored in a cookie to preserve its location.
  `Cookies.set("homePage", window.location.search)`
  
  Longitude and latitude will also be used as a way to determine its location name using google API.
  
  ```
  Geocode.fromLatLng(latitude,longitude)
    .then((res) => {
      this.setState({location: res.results[0].formatted_address})
    })
    .catch((err) => {
      this.setState({location: "Tidak tersedia"})
    })
```

This view currently have only one function that is to handle when user click on a certain store.
It will store the currentMerchant and also navigate to the product view.
```
 storeClick = (e) => {
    var currentMerchant = {
      mid: "",
      storeName: "",
      storeDesc: "",
      distance: "",
      storeImage: "",
    };
    currentMerchant.mid = e.storeId;
    currentMerchant.storeName = e.storeName;
    currentMerchant.storeDesc = "Desc";
    currentMerchant.distance = e.distance;
    currentMerchant.storeImage = e.storeImage;

    Cookies.set("currentMerchant", currentMerchant, {expires: 1})
  }
```

The data is retrieved using axios api call function given below.
```
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
    })
      .then((res) => {
          stateData = { ...this.state.data };
          let responseDatas = res.data;
          stateData.data.pop();
          responseDatas.results.forEach((data) => {
            stateData.data.push({
                address: data.merchant_address,
                rating: data.merchant_rating,
                logo: data.merchant_logo,
                distance: data.merchant_distance,
                storeId: data.mid,
                storeName: data.merchant_name,
                storeDesc: "",
                storeImage: data.merchant_pict,
            })
          })
          this.setState({ data: stateData });
      })
      .catch((err) => {
      });
```


- __Product__

Product view contains all the product that are available in the selected store based on categories.
This view has states to control the current selected data, food list array, as well as general header.

```
  state = {
    showModal: false,
    data: {
      mid: "",
      title: "",
      image: "",
      desc: "",
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
  };
```

The web will store last product information in cookies as well to remember the last thing that user choses even when navigating to other screen.
`Cookies.set("lastProduct", window.location.href, {expires: 1})`

The food list will be provided using this api call

```
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
      this.setState({ data: stateData });
    })
    .catch((err) => {
    });
```

This view will handle several functions which are to handle when user click the detail, to show a modal, and to add product to cart.

```
 handleDetail(data) {
    this.setState({ currentData: data });
    this.setState({ showModal: true });
  }

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }
```

For adding the cart, it will have several logic to put it into an array to avoid any duplicate object and also append if it detect same food.
to determine whether it is a duplicate or not we are using its mid.

```
    cart.forEach((data) => {
      if (data.mid === this.state.data.mid) {
        isStorePresent = true;
      }
    });
    
 cart.forEach((data) => {
      if (data.mid === this.state.data.mid) {
        data.food.forEach((food) => {
          if (food.productId === this.state.currentData.productId) {
            isDuplicate = true;
          }
        });
      }
    });
```

Then it will check the result of each logic and append accordingly ( for example: if the store is already present, it will not create a new array for the store and so on.)
It will also check for the note as well. If the note is different from the current added product, it will add a new object containing the new note.

```
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
```

all the added merchants will be added into a cookie so that it can be differentiated later on cart view.
If the cookies is present, then it will just update the cookie with the new merchant along with it.
` Cookies.set("addedMerchants", addedMerchants)`

The cart itself will be stored in localStorage and also in an API call
```localStorage.setItem("cart", JSON.stringify(cart));```

```
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
```

If the user already added an item to cart, the view will show a floating cart button so that user can navigate to cart view.

```
<Link to={"/cart"} className={"btn-productCart"}>
          <img src={cartIcon} alt={"cart"} />
        </Link>
```

- __Cart__

Cart is the view that shows all the products that user have added as well as eat and payment method.
Cart have several state to control its status.
```
state = {
    showModal: false,
    currentModalTitle: "",
    paymentOption: "Pembayaran di kasir",
    paymentType: "PAY_BY_CASHIER",
    biz_type: "DINE_IN",
    eat_type: "Makan di tempat",
    currentModal: [
      {
        image: "",
        option: "",
      },
    ],
  };
```
The state stores the payment type and also the eat type that user chose.

For the function itself, Cart have function to handle modal, increasing and decreasing amount of food, and also handling payment.

When handling detail, it will be triggered when user choose their payment or eat method.
```
handleOption = (data) => {
    if(this.state.currentModalTitle === "Cara makan anda?") {
      if(data === 0) {
        this.setState({biz_type: "DINE_IN"})
        this.setState({eat_type: "Makan di tempat"})
      } else {
        this.setState({biz_type: "TAKE_AWAY"})
        this.setState({eat_type: "Bungkus / Takeaway"})
      }
    } else if (this.state.currentModalTitle === "Bayar pakai apa?") {
      if(data === 0) {
        this.setState({paymentType: "PAY_BY_CASHIER"})
        this.setState({paymentOption: "Pembayaran di kasir"})
      }
    }
  }
  
  handleDetail(data) {
    if (data === "eat-method") {
      this.setState({ showModal: true });
      this.setState({ currentModalTitle: "Cara makan anda?" });
      this.setState({
        currentModal: [
          {
            image: "dineIn",
            option: "Makan di tempat",
          },
          {
            image: "takeaway",
            option: "Bungkus / Takeaway",
          },
        ],
      });
    } else if (data === "pay-method") {
      this.setState({ showModal: true });
      this.setState({ currentModalTitle: "Bayar pakai apa?" });
      this.setState({
        currentModal: [
          {
            image: "cashier",
            option: "Pembayaran di kasir",
          },
        ],
      });
    }
  }

  setModal(isShow) {
    this.setState({ showModal: isShow });
  }
```
It will show the options currently available for the payment and also eat method.

For handling increase and decrease of food quantities that are already in the cart view, it will be handled with these functions.
```
  handleDecrease(e) {
    if (e.foodAmount > 1) {
      e.foodAmount -= 1;
      this.forceUpdate();
    }
  }

  handleIncrease(e) {
    e.foodAmount += 1;
    this.forceUpdate();
  }
```

For handling delete, we will be using this function, it will filter through all the available merchants and check if it matches with the product. then it will remove it from the stack.
```
  handleDelete(e) {
    let filteredCart;
    cart.forEach((store) => {
      let filteredStore = store.food.filter((data) => {
        if(data.productId === e.productId) {
          if(data.foodNote !== e.foodNote) {
            return data
          }
        } else {
          return data
        }
      });
      store.food = filteredStore;
      if(store.food.length === 0) {
        filteredCart = cart.filter((filterStore) => {
          return filterStore.mid !== store.mid;
        });
        localStorage.setItem("cart",JSON.stringify(filteredCart))
        let addedMerchants = []
        filteredCart.forEach((cart) => {
          addedMerchants.push(cart.mid)
          Cookies.set("addedMerchants", addedMerchants)
        })
        if(addedMerchants.length < 2) {
          window.location.href = Cookies.get("lastProduct")
        } else {
          window.location.reload()
        }
      }
    });
    this.forceUpdate();
  }
```

For handling payment we will be manually summing up the price for each of the product.

```
data.forEach((store) => {
      store.food.forEach((food) => {
        totalAmount = totalAmount + food.foodPrice * food.foodAmount;
      });
    });
```

After that we will be mapping the product results so that it matches data type from the api call using axios.
It will also call the api based on the amount of merchants that are selected.
```
merchantIds.forEach((merchant) => {
      var requestData = {
        products: [{
          product_id :"",
          notes: "",
          qty: 0
        }],
        payment_with: this.state.paymentType,
        mid: merchant,
        prices: totalAmount,
        biz_type: this.state.biz_type,
        table_no: "1"
      }
      requestData.products.pop()
      cart.forEach((merchant) => {
        let addedMerchants = Cookies.get("addedMerchants")
        if(addedMerchants.includes(merchant.mid)) {
          merchant.food.forEach((data) => {
            if(data.productId !== "") {
              requestData.products.push({
                product_id: data.productId,
                notes: data.foodNote,
                qty: data.foodAmount,
              })
            }
          })
        }
      })
      
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
        localStorage.removeItem("cart")
        alert("Pembelian telah berhasil.")
        window.location.href = "/status"
      })
      .catch((err) => {
        if(err.response.data !== undefined) {
          alert(err.response.data.err_message)
        }
      });
    })
  };
```

- __Profile__

Profile will show the name, phone and email of the logged user and also log out button so that user can log out safely.
Profile will have the following state.
```
  state = {
      showModal: false,
      name: "Name",
      phone: "080808",
      email: ""
  };
```

To get the current user info we will be using this axios call
```
axios(address + "home/v1/customer-info", {
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
        this.setState({name: data.full_name})
        this.setState({phone: data.phone_no})
        this.setState({email: data.email})
      })
      .catch((err) => {
      });
```

When logging out, we will be showing a modal using setModal to add confirmation whether user want to log out or not.
```
  setModal(isShow) {
    this.setState({ showModal: isShow });
  }
```

For the logout function itself we will be needing the session_id that is stored inside a token given by the backend.

```
try {
        var decodedJWT = jwt.verify(auth.token, Buffer.from(jwtSecret,'base64')
        )
        var sub = JSON.parse(decodedJWT.sub)

        let uuid = uuidV4();
        const date = new Date().toISOString();
        uuid = uuid.replaceAll("-", "");
        let signature = sha256(clientId + ":" + auth.email + ":" + secret + ":" + date, secret)
        Axios(address + "/auth/exit", {
          headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
            "x-signature": signature,
            "x-session-id": sub.session_id,
          },
          method: "GET",
        })
        .then((res) => {
            alert("Logout berhasil.")
            localStorage.removeItem("cart")
            Cookies.remove("auth")
            auth = null;
            window.location.href = "/login"
        })
        .catch((err) => {
          if(err.response.data !== undefined) {
            alert(err.response.data.err_message)
          }
        });
      } catch(err) {
        alert(err.message)
      }
```

after the token is successfully verified, it will then call the axios function to logout and clean the auth information.

- __Status__

On status view, we will be showing all the current, ongoing, and finished transaction.
All the categories are given in the back end.
For the state we will be holding an array containing all the transaction as well as a current modal to display the detail.

```
  state = {
    showModal: false,
    activeTab: 1,
    data: [
      {
        title: "",
        distance: "",
        quantity: "",
        status: "",
        biz_type: "",
        payment: "",
        transactionId: "",
        transactionTime: "",
      },
    ],
    currentModal: {
      transactionId: "",
      transactionTime:"",
      storeName: "Store",
      storeLocation: "Location",
      storeDistance: "Distance",
      status: "Status",
      payment: "Cash",
      biz_type: "",
      food: [
        {
          productId: "",
          name: "",
          price: 0,
          image: "",
          note: "",
          quantity: 1,
        },
      ],
    },
  };
```

When user first open this page, we will be calling api to get all the transaction history for the user
```
Axios(address + "txn/v1/txn-history/", {
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
        var results = res.data.results;
        var stateData = {...this.state}
        stateData.data.pop()
        results.forEach((result) => {
          stateData.data.push({
            title: result.merchant_name,
            distance: "",
            quantity: result.total_product,
            status: result.status,
            biz_type: result.biz_type,
            payment: result.payment_with,
            transactionId: result.transaction_id,
            transactionTime: result.transaction_time,
          })
        })
        this.setState({data: stateData.data});
      })
      .catch((err) => {
      });
```

It will also have the modal function setModal to show the modal
```
setModal(isShow) {
    this.setState({ showModal: isShow });
  }
```

In order to handle the tabs, we will be using handleSelect to select the tab so that we can update the tabs accordingly
```
  handleSelect(tabIndex) {
    this.setState({ activeTab: tabIndex });
  }
```

To get the detail when user clicked on the button, we will be calling the api to get the transaction detail to get all the required data.
```
    Axios(address + "txn/v1/" + transId + "/txn-detail/", {
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
        var results = res.data.results;
        var resultModal = {...this.currentModal}
        resultModal.transactionId = results.transaction_id
        resultModal.transactionTime = results.transaction_time
        resultModal.storeName = results.merchant_name
        resultModal.storeDistance = ""
        resultModal.storeLocation = ""
        resultModal.status = results.status
        resultModal.biz_type = results.biz_type
        resultModal.payment = results.payment_with
        resultModal.food = []
        results.detail_products.forEach((product) => {
          resultModal.food.push({
            name: product.product_name,
            price: product.price,
            quantity: product.qty,
            image: product.image,
            note: product.notes
          })
        })
        this.setState({
          currentModal: resultModal
        })
      })
      .catch((err) => {
      });
      
    this.setModal(true);
  }
```

## Code Hierarchy
This react repo is divided into 4 main aspect.

- Asset
Asset will contain all the illustration, icon as well as scss for all the pages.
It will also have several constants that is tored in the Constant Subfolder
- Component
Component is a small subview that can be reusable in master view.
Currently we have button, modal and textfield.
__Button__ contains PikaButton which contains custom variant for button provided by bootstrap.
```
<Button variant={this.props.buttonStyle} onClick={this.props.handleClick}>
        {this.props.title}
      </Button>
```
__Modal__ contains CartModal which are modal for handling the different payment or eating option.
```
let optionListView = optionList.map((data) => {
      let image;
      if (data.image === "dineIn") {
        image = dineinIcon;
      } else if (data.image === "takeaway") {
        image = takeawayIcon;
      } else if (data.image === "cashier") {
        image = cashierIcon;
      }
```
Modal also contains PikaModal which handle the detail information when selecting a product in product page.
It will be able to handle increase or decrease quantity of the product that will be added.

```
handleDecrease(e) {
    let foodList = [];
    foodList = this.state.detailCategory;
    let updatedFoodlist = foodList.map((food) => {
      if (food === e && food.amount > 1) {
        food.amount = food.amount - 1;
      }
      return food;
    });
    this.setState({ detailCategory: updatedFoodlist });
  }

  handleIncrease(e) {
    let foodList = [];
    foodList = this.state.detailCategory;
    let updatedFoodlist = foodList.map((food) => {
      if (food === e) {
        food.amount = food.amount + 1;
      }
      return food;
    });
    this.setState({ detailCategory: updatedFoodlist });
  }
```

And also handling note that user typed to be stored in the cart.
```
handleNote = (e) => {
    this.setState({ note: e.target.value });
  };
```

__TextField__ contains the cusotm textfield for pikapp-web.
currently it is only used mostly in the auth view.
```
<Form>
        <Form.Label>{this.props.label}</Form.Label>
        <Form.Control
          type={this.props.type}
          placeholder={this.props.placeholder}
          onChange={this.props.handleChange}
        />
      </Form>
```

__SCSS__ is divided by each layout and type and then imported to its super scss file.
inside the folder also contains a variable to store custom colour type for pikapp-web to reuse.
- Master
Master contains all the layout for the view that we are going to use.
It is mostly structured as 
Header - Navigation - View

For example(productLayout):
```
export default class MainLayout extends React.Component {
  componentDidMount() {
    document.body.style.backgroundColor = secondary_color;
  }

  render() {
    return (
      <html>
        <header>
          <MainNavigation />
        </header>
        <body>
          <Container>
            <ProductView />
          </Container>
        </body>
      </html>
    );
  }
}
```

Master will serve as a base layout for the view so that it can be modified by parts.
- View
View contains all the features mentioned above that will be displayed in the master layout view.
It serves as the main rendering class.

## Dependencies
Pikapp-web currently uses these dependencies.

- __Axios__ : Used for api calling
- __bootstrap__ : css framework for displaying custom component
- __js-cookie__ : to save item in cookie
- __crypto-js__ : encryption purposes
- __jsonwebtoken__ : to verify jwt
- __uuid__ : to create uuid
