import React, { useEffect, useState } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import LocationPoint from "../../../Asset/Icon/location-point.png";
import CheckIcon from "../../../Asset/Icon/check.png";
import GojekLogo from "../../../Asset/Icon/gojek-logo.png";
import { useDispatch, useSelector } from 'react-redux'

const ShippingDetailView = () => {
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [radioStatus, setradioStatus] = useState(0)
    const [courierChecked, setCourierChecked] = useState(false)
    const [dataIndex, setDataIndex] = useState(null)

    useEffect(() => {
        CartRedu.courierList.map((ship, ind) => {
            ship.imagestatus = false;
        })
    }, [])

    const handleSave = () => {
        if (CartRedu.shippingName) {
            // window.history.go(-1)
            window.history.go('-2')
        }
    }

    const onChangeRadio = (ind, courier, index) => {
        setradioStatus(ind)
        setCourierChecked(true);
        if(index === null ) {
            setDataIndex(index);
            courier.imagestatus = true;
        } else if (index !== dataIndex) {
            CartRedu.courierList.map((ship, ind) => {
                if(ind === dataIndex) {
                    ship.imagestatus = false;
                }
            })
            setDataIndex(index);
            courier.imagestatus = true;
        }
        dispatch({ type: 'SHIPPINGNAME', payload: courier.name });
        dispatch({ type: 'SHIPPINGPRICE', payload: courier.price });
        dispatch({ type: 'SHIPPINGDESC', payload: courier.description });
    }

    const goBack = () => {
        dispatch({ type: 'SHIPPINGNAME', payload: "" })
        dispatch({ type: 'SHIPPINGPRICE', payload: "" });
        dispatch({ type: 'SHIPPINGDESC', payload: "" });
        window.history.go(-1)
    }

    const shippingDetailList = () => {
        return CartRedu.courierList.map((courier, ind) => {
            return (
                <div key={ind} className='shippingDetail-eachList' onClick={() => onChangeRadio(1, courier, ind)}>

                    <div className="shippingDetail-titleLayout">
                        <div>
                            <img className='shippingDetail-courier-logo' src={courier.courier_image} alt='' />
                        </div>
                        <div>
                        <div className="shippingDetail-shippingName">
                            <span className="shippingDetail-blackNotes">{courier.name} (Rp {Intl.NumberFormat("id-ID").format(courier.price)})</span>
                        </div>
                        <div className="shippingDetail-shippingDetail">
                            <span className="shippingDetail-grayNotes">{courier.description}</span>
                        </div>
                        </div>
                    </div>

                    <div className='shippingDetail-radioButton'>
                        <img style={{display: courier.imagestatus ? null : 'none'}} class="shippingDetail-checkimg" src={CheckIcon} />
                    </div>

                    {/* <div className='shippingDetail-radioButton'>
                        <div class="pretty p-image p-round p-jelly">
                            <input type="radio" name="icon_solid" onChange={() => onChangeRadio(1, courier, ind)} defaultChecked={radioStatus === 1 ? true : false} />
                            <div class="state">
                                <img class="image" src={CheckIcon} />
                                <label></label>
                            </div>
                        </div>
                    </div> */}
                </div>
            )
        })
    }

    return (
        <>
            <div className="shippingDetail-layout">
                <div className="shippingDetail-topSide">
                    <div className="shippingDetail-header">
                        <span className="shippingDetail-backArrow" onClick={goBack}>
                            <img className="backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="shippingDetail-title">Pilih Kurir</div>
                    </div>
                    <div className='shippingDetail-section'>
                        {shippingDetailList()}
                    </div>
                </div>
                

                <div onClick={handleSave} className="shippingDetail-selectButton" style={{backgroundColor: CartRedu.shippingName ? '#4bb7ac' : '#aaaaaa'}}>Pilih</div>
            </div>
        </>
    )
}

export default ShippingDetailView