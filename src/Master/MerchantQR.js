import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { address, clientId } from "../Asset/Constant/APIConstant";
import Axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

const MerchantResto = (props) => {
  const merchantID = props.match.params.mid
  const [longlat, setlonglat] = useState({});
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
    setlonglat({ lat: latitude, lon: longitude })
    localStorage.setItem("longlat", JSON.stringify(longlat))
  }

  useEffect(() => {
    if (longlat.lat) {
      getMerchantData(longlat.lat, longlat.lon)
    }
  });

  const getMerchantData = (lat, lon) => {
    let addressRoute = address + "home/v2/detail/merchant/" + lon + "/" + lat + "/"
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
        "mid": merchantID,
      },
      method: "GET"
    })
      .then((res) => {
        console.log(res.data.results);
        let responseDatas = res.data.results;

        let stateData = []
        stateData.push(responseDatas)
        var currentMerchant = {
          mid: "",
          storeName: "",
          storeDesc: "",
          distance: "",
          storeImage: "",
          storeAdress: "",
          storeRating: "",
        };
        currentMerchant.mid = responseDatas.mid;
        currentMerchant.storeName = responseDatas.merchant_name;
        currentMerchant.storeDesc = "Desc";
        currentMerchant.distance = responseDatas.merchant_distance;
        currentMerchant.storeImage = responseDatas.merchant_pict;
        currentMerchant.storeAdress = responseDatas.merchant_address;
        currentMerchant.storeRating = responseDatas.merchant_rating;
        Cookies.set("currentMerchant", currentMerchant, { expires: 1 });
        localStorage.setItem('selectedMerchant', JSON.stringify(stateData))
        history.push(
          "/store?mid=" +
          responseDatas.mid +
          "&table=" +
          props.match.params.notab
        );
      })
      .catch((err) => console.log(err));
  }

  return <div></div>;
};

export default MerchantResto
