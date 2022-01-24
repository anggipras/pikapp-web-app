import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Cookies from "js-cookie"
import Axios from "axios";

const ShippingTypeView = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [product, setProduct] = useState([])
    const [shippinglist, setShippingList] = useState([])
    const [courierlist, setCourierList] = useState([])

    useEffect(() => {
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
        
        Axios(`http://dev-api.pikapp.id:9006/api/transaction/courier-pricing`, {
            headers: {
                "Content-Type": "application/json",
                "merchant-id": currentCartMerchant.mid,
            },
            method: 'POST',
            data : req
        }).then(res => {
            let response = []
            res.data.result.map((ship, ind) => {
                response.push({
                    categShip : ship.name,
                    lowerLimit : ship.lower_limit,
                    upperLimit : ship.upper_limit,
                    description : ship.description,
                    shipId : ind,
                    courierList : ship.courier_list 
                })
            })

            setShippingList(response);
            
            dispatch({ type: 'DONELOAD' })
            // props.loadingButton()
        }).catch(err => console.log(err))

    }, [])

    const handleSave = (shippingtype, courier) => {
        dispatch({ type: 'SHIPPINGTYPE', payload: shippingtype })
        dispatch({ type: 'COURIERLIST', payload: courier })
        if (CartRedu.shippingType) {
            // window.history.go(-1)
            history.push('./detail')
        }
    }

    const goBack = () => {
        dispatch({ type: 'SHIPPINGTYPE', payload: "" })
        window.history.go(-1)
    }

    const shippingTypeList = () => {
        return shippinglist.map((ship, ind) => {
            return (
                <div key={ind} className='shippingSelection-eachList' onClick={() => handleSave(ship.categShip, ship.courierList)}>

                    <div className="shippingSelection-titleLayout">
                        <div className="shippingSelection-shippingName">
                            <span className="shippingSelection-blackNotes">{ship.categShip} (Rp {Intl.NumberFormat("id-ID").format(ship.lowerLimit)} - Rp {Intl.NumberFormat("id-ID").format(ship.upperLimit)})</span>
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
            <div className="shippingSelection-layout">
                <div className="shippingSelection-topSide">
                    <div className="shippingSelection-header">
                        <span className="shippingSelection-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="shippingSelection-title">Pilih Kurir</div>
                    </div>
                    <div className='shippingSelection-section'>
                        {shippingTypeList()}
                    </div>
                </div>
                

                {/* <div onClick={handleSave} className="shippingSelection-selectButton" style={{backgroundColor: CartRedu.shippingType ? '#4bb7ac' : '#aaaaaa'}}>Simpan</div> */}
            </div>
        </>
    )
}

export default ShippingTypeView