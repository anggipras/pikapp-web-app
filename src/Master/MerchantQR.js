import React, { useEffect, useRef, useState } from "react";
import { geolocated } from "react-geolocated";
import { v4 as uuidV4 } from "uuid";
import { address, clientId } from "../Asset/Constant/APIConstant";
import Axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

const MerchantResto = (props) => {
  const [allMerchant, setallMerchant] = useState([])
  const [merchant, setmerchant] = useState({});
  // const [longlatad, setlonglat] = useState("");
  const [longlat, setlonglat] = useState({});
  const [page, setpage] = useState(0);
  const [pageCond, setpageCond] = useState(false);
  let history = useHistory();
  const _isMounted = useRef(true)

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
    localStorage.setItem("longlat", JSON.stringify(longlat))
    reloadNextPageMerchant()
  }

  const reloadNextPageMerchant = () => {
    let longlatad = JSON.parse(localStorage.getItem("longlat"))
    let addressRoute =
      address + "home/v2/merchant/" + longlatad.lon + "/" + longlatad.lat + "/ALL/";
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
        setallMerchant(res.data.results)
        // setlonglat({ lat: latitude, lon: longitude })
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    reloadNextPageMerchant()
  }, [page]);
  
  const getMerchantLocalData = () => {
    allMerchant.forEach((dataMerch, indexMerch) => {
      if (!pageCond) {
        if (dataMerch.mid === props.match.params.mid) {
          // condition where api response and params at url match
          setmerchant(dataMerch)
          setpageCond(true)
        } else {
          if (indexMerch === allMerchant.length - 1) {
            let nextPage = page
            nextPage++
            setpage(nextPage)
          }
        }
      }
    })
  }

  useEffect(() => {
    getMerchantLocalData()
  }, [allMerchant]);

  // const getMerchantData = (lat, lon) => {
  //   let addressRoute =
  //     address + "home/v2/merchant/" + lon + "/" + lat + "/ALL/";
  //   let uuid = uuidV4();
  //   uuid = uuid.replaceAll("-", "");
  //   const date = new Date().toISOString();

  //   Axios(addressRoute, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-request-id": uuid,
  //       "x-request-timestamp": date,
  //       "x-client-id": clientId,
  //       "token": "PUBLIC",
  //       "category": "1",
  //     },
  //     method: "GET",
  //     params: {
  //       page: page,
  //       size: 6
  //     }
  //   })
  //     .then((res) => {
  //       let responseDatas = res.data.results;
  //       responseDatas.forEach((dataMerch, indexMerch) => {
  //         if (!pageCond) {
  //           if (dataMerch.mid === props.match.params.mid) {
  //             // condition where api response and params at url match
  //             setmerchant(dataMerch)
  //             setpageCond(true)
  //           } else {
  //             if (indexMerch === responseDatas.length - 1) {
  //               let nextPage = page
  //               nextPage++
  //               setpage(nextPage)
  //             }
  //           }
  //         }
  //       })
  //     })
  //     .catch((err) => console.log(err));
  // }

  if (pageCond) {
    let stateData = []
    stateData.push(merchant)
    var currentMerchant = {
      mid: "",
      storeName: "",
      storeDesc: "",
      distance: "",
      storeImage: "",
      storeAdress: "",
      storeRating: "",
    };
    currentMerchant.mid = merchant.mid;
    currentMerchant.storeName = merchant.merchant_name;
    currentMerchant.storeDesc = "Desc";
    currentMerchant.distance = merchant.merchant_distance;
    currentMerchant.storeImage = merchant.merchant_pict;
    currentMerchant.storeAdress = merchant.merchant_address;
    currentMerchant.storeRating = merchant.merchant_rating;
    Cookies.set("currentMerchant", currentMerchant, { expires: 1 });
    localStorage.setItem('selectedMerchant', JSON.stringify(stateData))
    history.push(
      "/store?mid=" +
      merchant.mid +
      "&table=" +
      props.match.params.notab
    );
  }

  return <div>Halo</div>;
};

export default MerchantResto
