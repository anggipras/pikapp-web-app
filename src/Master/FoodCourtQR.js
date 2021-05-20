import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux';

const FoodCourt = (props) => {
    let history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        let fcadd = props.match.params.address
        fcadd = fcadd.replaceAll("_", " ")
        localStorage.setItem('fctable', props.match.params.notab)
        Cookies.set("fcaddress", fcadd, { expires: 1 })
        dispatch({ type: 'ISMERCHANTQR', payload: false });
        history.push("/");
    }, []);

    return <div></div>;
};

export default FoodCourt
