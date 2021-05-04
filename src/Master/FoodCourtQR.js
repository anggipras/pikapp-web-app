import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const MerchantResto = (props) => {
    let history = useHistory();

    useEffect(() => {
        localStorage.setItem('fctable', props.match.params.notab)
        history.push("/");
    }, []);

    return <div></div>;
};

export default MerchantResto
