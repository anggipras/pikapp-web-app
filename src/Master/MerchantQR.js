import React, { useEffect, useState } from "react";
import { geolocated } from "react-geolocated";
import { v4 as uuidV4 } from "uuid";
import { address, clientId, googleKey } from "../Asset/Constant/APIConstant";
import Axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

const MerchantResto = (props) => {
  const [merchant, setmerchant] = useState([
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
  ]);
  const [latitude, setlatitude] = useState("");
  const [longitude, setlongitude] = useState("");
  let history = useHistory();

  const getUserLocation = () => {
    Axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${googleKey}`)
    .then((res)=> {
      let latitude = res.data.location.lat
      let longitude = res.data.location.lng
      let longlat = {lat: latitude, lon: longitude}
      console.log(latitude, longitude);
      setlatitude(latitude)
      setlongitude(longitude)
      localStorage.setItem("googlonglat", JSON.stringify(longlat))
    })
    .catch((err)=> console.log(err))
  }

  useEffect(() => {
    if (props.coords) {
      let latitude = props.coords.latitude;
      let longitude = props.coords.longitude;
      let longlat = { lat: latitude, lon: longitude };
      console.log(latitude, longitude);
      localStorage.setItem("longlat", JSON.stringify(longlat));
    } else {
      getUserLocation()
    }
  }, []);

  useEffect(() => {
    if (props.coords) {
      let latitude = props.coords.latitude;
      let longitude = props.coords.longitude;
      let longlat = { lat: latitude, lon: longitude };
      console.log(latitude, longitude);
      localStorage.setItem("longlat", JSON.stringify(longlat));
      getMerchantData(latitude, longitude)
    } else {
      getMerchantData(latitude, longitude)
    }
  });

  const getMerchantData = (lat, lon) => {
    if (merchant[0].storeId == "") {
      let addressRoute =
        address + "home/v1/merchant/" + lon + "/" + lat + "/ALL/";
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
          token: "PUBLIC",
          category: "1",
        },
        method: "GET",
      })
        .then((res) => {
          stateData = [{ ...merchant }];
          let responseDatas = res.data;
          stateData.pop();
          responseDatas.results.forEach((data) => {
            stateData.push({
              address: data.merchant_address,
              rating: data.merchant_rating,
              logo: data.merchant_logo,
              distance: data.merchant_distance,
              storeId: data.mid,
              storeName: data.merchant_name,
              storeDesc: "",
              storeImage: data.merchant_pict,
            });
          });
          console.log(stateData);
          console.log(props.match.params.mid);
          console.log(stateData[0].storeId);
          let matchmid = stateData.filter((val) => {
            return val.storeId == props.match.params.mid;
          });
          console.log(matchmid[0].storeId);
          var currentMerchant = {
            mid: "",
            storeName: "",
            storeDesc: "",
            distance: "",
            storeImage: "",
            storeAdress: "",
            storeRating: "",
          };
          currentMerchant.mid = matchmid[0].storeId;
          currentMerchant.storeName = matchmid[0].storeName;
          currentMerchant.storeDesc = "Desc";
          currentMerchant.distance = matchmid[0].distance;
          currentMerchant.storeImage = matchmid[0].storeImage;
          currentMerchant.storeAdress = matchmid[0].address;
          currentMerchant.storeRating = matchmid[0].rating;
          Cookies.set("currentMerchant", currentMerchant, { expires: 1 });
          history.push(
            "/store?mid=" +
              matchmid[0].storeId +
              "&table=" +
              props.match.params.notab
          );
        })
        .catch((err) => console.log(err));
    }
  }

  return <div></div>;
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(MerchantResto);

// export default MerchantResto
