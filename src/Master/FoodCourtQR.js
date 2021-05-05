import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie'

const FoodCourt = (props) => {
    let history = useHistory();

    useEffect(() => {
        let fcadd = props.match.params.address
        fcadd = fcadd.replaceAll("_", " ")
        localStorage.setItem('fctable', props.match.params.notab)
        Cookies.set("fcaddress", fcadd, { expires: 1 })
        history.push("/");
    }, []);

    return <div></div>;
};

export default FoodCourt
