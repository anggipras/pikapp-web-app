import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import NoDataCourier from "../../../Asset/Icon/nodata-courier.png";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Cookies from "js-cookie"
import Axios from "axios";
import { addressShipping, clientId } from "../../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Loader from 'react-loader';

const options = {
    lines: 13,
    length: 20,
    width: 10,
    radius: 30,
    scale: 0.25,
    corners: 1,
    color: '#000',
    opacity: 0.25,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 60,
    fps: 20,
    shadow: false,
    hwaccel: false,
};

const ShippingTypeView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [product, setProduct] = useState([])
    const [shippinglist, setShippingList] = useState([])
    const [courierlist, setCourierList] = useState([])
    const [noDataCourier, setNoDataCourier] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // setIsLoading(true);
        let allProduct = [];
        let currentCartMerchant = JSON.parse(Cookies.get("currentMerchant"));

        let cart = JSON.parse(localStorage.getItem("cart"));
        cart.shift();
        cart[0].food.map((prod) => {
            return allProduct.push({
                name: prod.foodName,
                quantity: prod.foodAmount,
                value : prod.foodTotalPrice
            });
        })

        setProduct(allProduct);

        let req = {
            destination_latitude : CartRedu.lat,
            destination_longitude : CartRedu.lng,
            items : allProduct
        }

        let uuid = uuidV4();
        uuid = uuid.replace(/-/g, "");
        const date = new Date().toISOString();
        
        Axios(addressShipping + `/api/transaction/courier-pricing`, {
            headers: {
                "Content-Type": "application/json",
                "merchant-id": currentCartMerchant.mid,
                "x-request-id": uuid,
                "x-timestamp": date,
                "x-client-id": clientId,
                "x-token" : "PUBLIC"
            },
            method: 'POST',
            data : req
        }).then(res => {
            let response = []
            let courierList = []
            if(res.data.err_code !== "404" && res.data.result.length !== 0) {
                res.data.result.map((ship, ind) => {
                    ship.courier_list.forEach(cour => {
                        courierList.push({
                            courier_code: cour.courier_code,
                            courier_image: cour.courier_image,
                            description: cour.description,
                            name: cour.name,
                            price: cour.price,
                            service_name: cour.service_name,
                            service_type: cour.service_type,
                            imagestatus: false
                        })
                    })
                    response.push({
                        categShip : ship.name,
                        lowerLimit : ship.lower_limit,
                        upperLimit : ship.upper_limit,
                        description : ship.description,
                        shipId : ind,
                        courierList : courierList 
                    })
                })
    
                setShippingList(response);
                console.log(response);
            } else {
                setNoDataCourier(true);
            }
            
            setIsLoading(true);
        }).catch(err => { 
            console.log(err);
            setNoDataCourier(true);
            setIsLoading(true);
        })

    }, [])

    const handleSave = (shippingtype, courier) => {
        dispatch({ type: 'SHIPPINGTYPE', payload: shippingtype })
        dispatch({ type: 'COURIERLIST', payload: courier })
        history.push('./detail')
    }

    const goBack = () => {
        if(CartRedu.shippingName === "") {
            dispatch({ type: 'SHIPPINGTYPE', payload: "" })
        }
        window.history.go(-1)
    }

    const shippingTypeList = () => {
        return shippinglist.map((ship, ind) => {
            return (
                <div key={ind} className='shippingSelection-eachList' onClick={() => handleSave(ship.categShip, ship.courierList)}>

                    <div className="shippingSelection-titleLayout">
                        <div className="shippingSelection-shippingName">
                            <span className="shippingSelection-blackNotes">{ship.categShip} 
                            {
                                ship.lowerLimit === 0 ?
                                <span> (Rp {Intl.NumberFormat("id-ID").format(ship.upperLimit)})</span>
                                :
                                <span>
                                    (Rp {Intl.NumberFormat("id-ID").format(ship.lowerLimit)} - Rp {Intl.NumberFormat("id-ID").format(ship.upperLimit)})
                                </span>
                            }
                            </span>
                        </div>
                        <div className="shippingSelection-shippingDetail">
                            <span className="shippingSelection-grayNotes">{ship.description}</span>
                        </div>
                    </div>
                    
                </div>
            )
        })
    }

    return (
        <>  
            {/* {
                !isLoading ?
                <Loader loaded={isLoading} options={options} className="spinner"/>
                :
                <></>
            } */}
            <Loader loaded={isLoading} options={options} className="spinner"/>
            <div className="shippingSelection-layout">
                <div className="shippingSelection-topSide">
                    <div className="shippingSelection-header">
                        <span className="shippingSelection-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="shippingSelection-title">Pilih Kurir</div>
                    </div>
                    <div style={{display: noDataCourier ? 'flex' : 'block'}} className='shippingSelection-section'>
                        { noDataCourier ?
                        <img src={NoDataCourier} className="shippingSelection-nodata"></img>
                        :
                        shippingTypeList()
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShippingTypeView