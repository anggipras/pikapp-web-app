import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';

const ManualTxn = (props) => {
    // const merchantID = props.match.params.mid
    const [longlat, setlonglat] = useState({});
    let history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        let latitude = -6.28862
        let longitude = 106.71789
        let longlat = { lat: latitude, lon: longitude }
        console.log(latitude, longitude);
        localStorage.setItem("longlat", JSON.stringify(longlat))
        if (!props.match.params.address) {
            setlonglat({ lat: latitude, lon: longitude })
        }
        dispatch({ type: 'ISMANUALTXN', payload: true });
    }, []);

    if (longlat.lat) {
        history.push(
            "/store?username=" +
            props.match.params.username
        );
    }

    return <div></div>;
};

export default ManualTxn
