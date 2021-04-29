import React from "react";
import StarIcon from '../../Asset/Icon/star.png'
import LocaIcon from '../../Asset/Icon/location.png'
import queryString from "query-string";
import { Link } from "react-router-dom";
import { address, clientId, googleKey } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";
import Cookies from "js-cookie"
import Geocode from "react-geocode"
import Skeleton from 'react-loading-skeleton'
import { connect } from 'react-redux'
import { DoneLoad } from '../../Redux/Actions'

class StoreView extends React.Component {
  state = {
    page: 0,
    size: 6,
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
    idCol: 0,
    totalPage: 0,
    boolpage: false,
    loadView: true,
    allMerchantAPI: [],
    lat: "",
    lon: "",
  };

  componentDidMount() {
    this.props.DoneLoad()
    Cookies.set("homePage", window.location.search)
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
    // else {
    const value = queryString.parse(window.location.search);
    var merchant = "";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        let latitude = position.coords.latitude
        let longitude = position.coords.longitude
        let longlat = { lat: latitude, lon: longitude }
        console.log(latitude, longitude);
        this.setState({ lat: latitude, lon: longitude })
        localStorage.setItem("longlat", JSON.stringify(longlat))
        // Show a map centered at latitude / longitude.

        if (localStorage.getItem("longlat")) {
          var getLocation = JSON.parse(localStorage.getItem("longlat"))
          latitude = getLocation.lat
          longitude = getLocation.lon
        } else {
          // window.location.href = "/login"
        }

        if (auth.isLogged === false) {
          var lastLink = { value: window.location.href }
          Cookies.set("lastLink", lastLink, { expires: 1 })
          // window.location.href = "/login"
        }
        else {
          longitude = value.longitude || longitude
          latitude = value.latitude || latitude
          if (window.location.href.includes('?latitude') || window.location.href.includes('store?')) {

          } else {
            window.location.href = window.location.href + `?latitude=${latitude}&longitude=${longitude}`
          }
        }
        longitude = value.longitude || longitude
        latitude = value.latitude || latitude
        merchant = value.merchant;

        // GOOGLE GEOCODE
        if (localStorage.getItem("address")) {
          var getAdress = JSON.parse(localStorage.getItem("address"))
          this.setState({ location: getAdress })
        } else {
          Geocode.setApiKey(googleKey)
          Geocode.fromLatLng(latitude, longitude)
            .then((res) => {
              console.log(res.results[0].formatted_address);
              this.setState({ location: res.results[0].formatted_address })
              localStorage.setItem("address", JSON.stringify(res.results[0].formatted_address));
            })
            .catch((err) => {
              this.setState({ location: "Tidak tersedia" })
            })
        }

        let addressRoute;
        if (merchant === undefined) {
          addressRoute =
            address + "home/v2/merchant/" + longitude + "/" + latitude + "/ALL/";
        } else {
          addressRoute =
            address +
            "home/v1/merchant/" +
            longitude +
            "/" +
            latitude +
            "/" +
            merchant
            + "/"
        }
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
            page: this.state.page,
            size: this.state.size
          }
        })
          .then((res) => {
            console.log(res.data.results);
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
            this.setState({ data: stateData, loadView: false, totalPage: responseDatas.total_pages, allMerchantAPI: res.data.results });
            document.addEventListener('scroll', this.loadMoreMerchant)
            if (res.data.results.length < 6) {
              document.removeEventListener('scroll', this.loadMoreMerchant)
            }
          })
          .catch((err) => {
          });
      });
    }
    // }
  }
  //OPENCAGE API
  // let opencagelonglat = latitude + "," + longitude
  // Axios.get(`https://api.opencagedata.com/geocode/v1/json?`,{
  //     params:{
  //         key: 'cdeab36e4fec4073b0de60ff6b595c70',
  //         q: opencagelonglat
  //     }
  // }).then((res)=> {
  //   console.log(res.data.results[0].formatted);
  //   this.setState({location: res.data.results[0].formatted})
  // }).catch((err) => {
  //   this.setState({location: "Tidak tersedia"})
  // })

  componentDidUpdate() {
    if (this.state.idCol > 0) {
      if (this.state.boolpage === true) {
        let addressRoute = address + "home/v2/merchant/" + this.state.lon + "/" + this.state.lat + "/ALL/";
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
            page: this.state.page,
            size: this.state.size
          }
        })
          .then((res) => {
            stateData = { ...this.state.data };
            let responseDatas = res.data;
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
            let updateMerchant = [...this.state.allMerchantAPI]
            responseDatas.results.forEach((data) => {
              updateMerchant.push(data)
            })
            this.setState({ boolpage: false, allMerchantAPI: updateMerchant })
            document.addEventListener('scroll', this.loadMoreMerchant)
            if (this.state.page === this.state.totalPage - 1) {
              this.setState({ idCol: this.state.idCol + 1 })
            }
          })
          .catch((err) => {
          });
      }
    }
  }

  storeClick = (e) => {
    // let selectedStore = this.state.allMerchantAPI.filter(value => {
    //   return value.mid === e.storeId
    // })
    // var currentMerchant = {
    //   mid: "",
    //   storeName: "",
    //   storeDesc: "",
    //   distance: "",
    //   storeImage: "",
    //   storeAdress: "",
    //   storeRating: "",
    //   storeLogo: "",
    // };
    // currentMerchant.mid = e.storeId;
    // currentMerchant.storeName = e.storeName;
    // currentMerchant.storeDesc = "Desc";
    // currentMerchant.distance = e.distance;
    // currentMerchant.storeImage = e.storeImage;
    // currentMerchant.storeAdress = e.address;
    // currentMerchant.storeRating = e.rating;
    // currentMerchant.storeLogo = e.logo;

    // localStorage.setItem('selectedMerchant', JSON.stringify(selectedStore))
    // Cookies.set("currentMerchant", currentMerchant, { expires: 1 })
    localStorage.setItem('page', JSON.stringify(1))
  }
  handleDetail(data) {
    return <Link to={"/status"}></Link>;
  }

  isBottom = (el) => {
    return (el.getBoundingClientRect().top + 50) <= window.innerHeight
  }

  loadMoreMerchant = () => {
    const wrappedElement = document.getElementById("idCol")
    if (this.state.idCol <= this.state.page) {
      if (this.isBottom(wrappedElement)) {
        // console.log('testloadmore');
        this.setState({ idCol: this.state.idCol + 1, page: this.state.page + 1, boolpage: true })
        document.removeEventListener('scroll', this.loadMoreMerchant)
      }
    } else {
      document.removeEventListener('scroll', this.loadMoreMerchant)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.loadMoreMerchant)
  }

  merchantLoading = () => (
    <div className='merchantList-layout' >
      <Skeleton style={{ paddingTop: 100, width: "100%", height: "100%" }} />
    </div>
  )

  render() {
    if (localStorage.getItem('page')) {
      let currentPage = JSON.parse(localStorage.getItem('page'))
      if (currentPage === 1) {
        localStorage.setItem('page', JSON.stringify(0))
        window.location.reload()
      }
    }
    const storeDatas = this.state.data.data.map((data) => {
      return data;
    });
    var allCards = storeDatas.map((cardData, indexCard) => {
      return (
        <Link to={"/store?mid=" + cardData.storeId} style={{ textDecoration: "none" }} onClick={() => this.storeClick(cardData)} >
          <div key={indexCard} className='merchantList-layout'>
            <div className='merchantList-banner'>
              {
                cardData.storeImage ?
                  <img src={cardData.storeImage} className='merchantList-image' alt='' />
                  :
                  <Skeleton style={{ paddingTop: 100, width: "100%", height: "100%" }} />
              }
            </div>

            <div className='merchantList-content'>
              <div className='merchantList-contentLocStar'>
                <div className='merchantList-ratingArea'>
                  <img src={StarIcon} className='merchantList-ratingIcon' alt='' />
                  <div className='merchantList-ratingScore'>{cardData.rating ? cardData.rating : "5.0"}</div>
                </div>

                <div className='merchantList-locArea'>
                  <img src={LocaIcon} className='merchantList-locIcon' alt='' />
                  {
                    cardData.distance ?
                      <div className='merchantList-location'>{cardData.distance} <span className='merchantList-distance'>{'(' + Math.round((parseInt(cardData.distance) / 22) * 60) + ' min)'}</span></div>
                      :
                      <Skeleton style={{ paddingTop: 10, width: "100%", height: "100%" }} />
                  }
                </div>
              </div>

              {
                cardData.storeName ?
                  <div className='merchantList-storeName'>{cardData.storeName}</div>
                  :
                  <Skeleton style={{ paddingTop: 10, width: "100%", height: "100%" }} />
              }

              <div className='merchantList-storeCategory'>Merchant Categories</div>
            </div>
          </div>
        </Link>
      );
    });

    return (
      <div className='merchantList-background'>
        <div xs={0} md={4} className="storeColumn">
          <h6 className="" style={{ textAlign: "left" }}>
            Lokasi:
            </h6>
          <p className="storeLabel" style={{ textAlign: "left" }}>
            {this.state.location || <Skeleton height={20} />}
          </p>
        </div>
        <div>
          <div className='merchantList-grid'>
            {allCards}
          </div>
          {
            !this.state.loadView ?
              this.state.idCol <= this.state.page ?
                this.state.totalPage - 1 === this.state.page ?
                  null
                  :
                  <div id={"idCol"}>
                    {this.merchantLoading()}
                  </div>
                :
                null
              :
              null
          }
        </div>
      </div>
    );
  }
}

export default connect(null, { DoneLoad })(StoreView)
