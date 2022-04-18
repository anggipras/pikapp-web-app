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
    const [courierName, setCourierName] = useState("")
    const [courierPrice, setCourierPrice] = useState(0)
    const [courierDesc, setCourierDesc] = useState(0)
    const [courierService, setCourierService] = useState("")
    const [courierCode, setCourierCode] = useState("")
    const [courierNameType, setCourierNameType] = useState("")
    const [courierList, setCourierList] = useState([])

    useEffect(() => {
        CartRedu.courierList.map((ship, ind) => {
            if(CartRedu.shippingName !== "") {
                if(ship.courier_name === CartRedu.courierNameType) {
                    setDataIndex(ind);
                    ship.imagestatus = true;
                    setCourierName(ship.name);
                    setCourierPrice(ship.price);
                    setCourierDesc(ship.description);
                    setCourierService(ship.service_type);
                    setCourierCode(ship.courier_code);
                    setCourierNameType(ship.courier_name);
                }
            }
        })
        setCourierList(CartRedu.courierList);
    }, [courierList])

    const handleSave = () => {
        let shippingWithCourier = {
            shippingName: courierName,
            shippingPrice: courierPrice,
            shippingDesc: courierDesc,
            courierServiceType: courierService,
            courierNameType: courierNameType,
            shippingCode: courierCode,
            insuranceCheckbox: false,
            insurancePrice: 0
        }
        localStorage.setItem("SHIPPING_WITH_COURIER", JSON.stringify(shippingWithCourier))
        dispatch({ type: 'SHIPPINGNAME', payload: courierName });
        dispatch({ type: 'SHIPPINGPRICE', payload: courierPrice });
        dispatch({ type: 'SHIPPINGDESC', payload: courierDesc });
        dispatch({ type: 'COURIERSERVICETYPE', payload: courierService });
        dispatch({ type: 'COURIERNAMETYPE', payload: courierNameType });
        dispatch({ type: 'SHIPPINGCODE', payload: courierCode });
        dispatch({ type: 'INSURANCECHECKBOX', payload: false });
        dispatch({ type: 'INSURANCEPRICE', payload: 0 });
        window.history.go('-2')
    }

    const onChangeRadio = (ind, courier, index) => {
        setradioStatus(ind)
        setCourierChecked(true);
        if(index === null ) {
            setDataIndex(index);
            courier.imagestatus = true;
        } else if (index !== dataIndex) {
            courierList.map((ship, ind) => {
                if(ind === dataIndex) {
                    ship.imagestatus = false;
                }
            })
            setDataIndex(index);
            courier.imagestatus = true;
        }
        setCourierName(courier.name);
        setCourierPrice(courier.price);
        setCourierDesc(courier.description);
        setCourierService(courier.service_type);
        setCourierCode(courier.courier_code);
        setCourierNameType(courier.courier_name);
    }

    const goBack = () => {
        window.history.go(-1)
    }

    const shippingDetailList = () => {
        return courierList.map((courier, ind) => {
            return (
                <div key={ind} className='shippingDetail-eachList' onClick={() => onChangeRadio(1, courier, ind)}>

                    <div className="shippingDetail-titleLayout">
                        <div>
                            <img className='shippingDetail-courier-logo' src={courier.courier_image} alt='' />
                        </div>
                        <div>
                        <div className="shippingDetail-shippingName">
                            <span className="shippingDetail-blackNotes">{courier.name} (Rp {Intl.NumberFormat("id-ID").format(courier.price)}) </span>
                        </div>
                        <div className="shippingDetail-shippingDetail">
                            <span className="shippingDetail-grayNotes">{courier.description}</span>
                        </div>
                        </div>
                    </div>

                    <div className='shippingDetail-radioButton'>
                        <img style={{display: courier.imagestatus ? null : 'none'}} class="shippingDetail-checkimg" src={CheckIcon} />
                    </div>
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
                

                <div onClick={handleSave} className="shippingDetail-selectButton" style={{backgroundColor: courierName ? '#4bb7ac' : '#aaaaaa'}}>Pilih</div>
            </div>
        </>
    )
}

export default ShippingDetailView