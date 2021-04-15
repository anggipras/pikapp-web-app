import React, { useEffect, useRef, useState } from "react";
import { geolocated } from "react-geolocated";
import { v4 as uuidV4 } from "uuid";
import { address, clientId } from "../Asset/Constant/APIConstant";
import Axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

const MerchantResto = (props) => {
  // const [merchant, setmerchant] = useState([
  //   {
  //     address: "",
  //     rating: "",
  //     logo: "",
  //     distance: "",
  //     storeId: "",
  //     storeName: "",
  //     storeDesc: "",
  //     storeImage: "",
  //   },
  // ]);
  // const [longlatad, setlonglat] = useState("");
  const [longlat, setlonglat] = useState({});
  const [page, setpage] = useState(0);
  const [pageCond, setpageCond] = useState(false);
  let history = useHistory();
  const _isMounted = useRef(true)

  // useEffect(() => {
  //   if (props.coords) {
  //     let latitude = props.coords.latitude;
  //     let longitude = props.coords.longitude;
  //     let longlat = { lat: latitude, lon: longitude };
  //     console.log(latitude, longitude);
  //     localStorage.setItem("longlat", JSON.stringify(longlat));
  //   } else {
  //     setlonglat("getloc succeed")
  //   }
  // }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition)
    } else {
      alert('Geolocation is not supported by this browser.')
    }
    return () => {
      _isMounted.current = false
    }
  }, []);

  const showPosition = (position) => {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    let longlat = { lat: latitude, lon: longitude }
    console.log(latitude, longitude);
    setlonglat({ lat: latitude, lon: longitude })
    localStorage.setItem("longlat", JSON.stringify(longlat))
  }

  // useEffect(() => {
  //   if (props.coords) {
  //     let latitude = props.coords.latitude;
  //     let longitude = props.coords.longitude;
  //     let longlat = { lat: latitude, lon: longitude };
  //     console.log(latitude, longitude);
  //     console.log(longlatad);
  //     localStorage.setItem("longlat", JSON.stringify(longlat));
  //     getMerchantData(latitude, longitude)
  //   }
  // });

  useEffect(() => {
    if (longlat.lat) {
      getMerchantData(longlat.lat, longlat.lon)
    }
  });

  const getMerchantData = (lat, lon) => {
    let addressRoute =
      address + "home/v2/merchant/" + lon + "/" + lat + "/ALL/";
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
        page: page,
        size: 6
      }
    })
      .then((res) => {
        let responseDatas = res.data.results;
        Array.prototype.forEach.call(responseDatas, (dataMerch, indexMerch) => {
          if (dataMerch.mid === props.match.params.mid) {
            // condition where api response and params at url match
            let stateData = []
            stateData.push(dataMerch)
            var currentMerchant = {
              mid: "",
              storeName: "",
              storeDesc: "",
              distance: "",
              storeImage: "",
              storeAdress: "",
              storeRating: "",
            };
            currentMerchant.mid = dataMerch.mid;
            currentMerchant.storeName = dataMerch.merchant_name;
            currentMerchant.storeDesc = "Desc";
            currentMerchant.distance = dataMerch.merchant_distance;
            currentMerchant.storeImage = dataMerch.merchant_pict;
            currentMerchant.storeAdress = dataMerch.merchant_address;
            currentMerchant.storeRating = dataMerch.merchant_rating;
            Cookies.set("currentMerchant", currentMerchant, { expires: 1 });
            localStorage.setItem('selectedMerchant', JSON.stringify(stateData))
            history.push(
              "/store?mid=" +
              dataMerch.mid +
              "&table=" +
              props.match.params.notab
            );
          } else {
            if (indexMerch === responseDatas.length - 1) {
              let nextPage = page
              nextPage++
              setpage(nextPage)
            }
          }
        })

        // responseDatas.forEach((dataMerch, indexMerch) => {
        //   if (dataMerch.mid === props.match.params.mid) {
        //     // condition where api response and params at url match
        //     let stateData = []
        //     stateData.push(dataMerch)
        //     var currentMerchant = {
        //       mid: "",
        //       storeName: "",
        //       storeDesc: "",
        //       distance: "",
        //       storeImage: "",
        //       storeAdress: "",
        //       storeRating: "",
        //     };
        //     currentMerchant.mid = dataMerch.mid;
        //     currentMerchant.storeName = dataMerch.merchant_name;
        //     currentMerchant.storeDesc = "Desc";
        //     currentMerchant.distance = dataMerch.merchant_distance;
        //     currentMerchant.storeImage = dataMerch.merchant_pict;
        //     currentMerchant.storeAdress = dataMerch.merchant_address;
        //     currentMerchant.storeRating = dataMerch.merchant_rating;
        //     Cookies.set("currentMerchant", currentMerchant, { expires: 1 });
        //     localStorage.setItem('selectedMerchant', JSON.stringify(stateData))
        //     history.push(
        //       "/store?mid=" +
        //       dataMerch.mid +
        //       "&table=" +
        //       props.match.params.notab
        //     );
        //   } else {
        //     if (indexMerch === responseDatas.length-1) {
        //       let nextPage = page
        //       nextPage++
        //       setpage(nextPage)
        //     }
        //   }
        // })
      })
      .catch((err) => console.log(err));
  }

  return <div></div>;
};

// export default geolocated({
//   positionOptions: {
//     enableHighAccuracy: false,
//   },
//   userDecisionTimeout: 5000,
// })(MerchantResto);

export default MerchantResto
