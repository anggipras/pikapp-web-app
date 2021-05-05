import React, { useEffect, useRef, useState } from "react";
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
    localStorage.setItem("longlat", JSON.stringify(longlat))
    if (!props.match.params.address) {
      setlonglat({ lat: latitude, lon: longitude })
    }
  }

  if (longlat.lat) {
    history.push(
      "/store?mid=" +
      merchantID +
      "&table=" +
      props.match.params.notab
    );
  }

  return <div></div>;
};

export default MerchantResto
