import React, { useEffect, useState } from "react";
import { geolocated } from "react-geolocated";
import { v4 as uuidV4 } from "uuid";
import { address, clientId } from "../Asset/Constant/APIConstant";
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
  const [location, setlocation] = useState("");
  let history = useHistory();

  useEffect(() => {
    if (props.coords) {
      let latitude = props.coords.latitude;
      let longitude = props.coords.longitude;
      let longlat = { lat: latitude, lon: longitude };
      console.log(latitude, longitude);
      localStorage.setItem("longlat", JSON.stringify(longlat));
    } else {
      setlocation("getcurrentlocation");
    }
  }, []);

  useEffect(() => {
    if (props.coords) {
      let latitude = props.coords.latitude;
      let longitude = props.coords.longitude;
      let longlat = { lat: latitude, lon: longitude };
      console.log(latitude, longitude);
      localStorage.setItem("longlat", JSON.stringify(longlat));
      if (merchant[0].storeId == "") {
        let addressRoute =
          address + "home/v1/merchant/" + longitude + "/" + latitude + "/ALL/";
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
            };
            currentMerchant.mid = matchmid[0].storeId;
            currentMerchant.storeName = matchmid[0].storeName;
            currentMerchant.storeDesc = "Desc";
            currentMerchant.distance = matchmid[0].distance;
            currentMerchant.storeImage = matchmid[0].storeImage;
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
  });

  return <div></div>;
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(MerchantResto);
