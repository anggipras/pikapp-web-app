import React, { useEffect, useState, useRef } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import ShippingDate from "../../../Asset/Icon/shipping-date.png";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import idLocale from "moment/locale/id";
import TimePicker from 'react-bootstrap-time-picker';
import Cookies from "js-cookie";

const ShippingDateView = () => {
    const ref = useRef();
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [choiceDate, setChoiceDate] = useState(false)
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [isTomorrow, setIsTomorrow] = useState(false);
    const [pickUpChoice, setPickUpChoice] = useState([
    {
        image: "now",
        option: "Sekarang"
    },
    {
        image: "custom",
        option: "Custom Tanggal"
    }
    ])
    const [merchantHourStatus, setMerchantHourStatus] = useState({
        minutes_remaining: null,
        open_time: null,
        merchant_status: null,
        close_time: null,
    })

    useEffect(() => {
        setMerchantHourStatus({
            minutes_remaining: "30",
            open_time: "10:00",
            merchant_status: "CLOSE",
            close_time: "23:59",
        })
    }, [])

    const onChangeRadio = (ind) => {
        dispatch({ type: 'SHIPPINGDATETYPE', payload: ind })
        Cookies.set("SHIPMENTDATETYPE", { shipmentDateType: ind })
        if(ind === 1) {
            moment.updateLocale('id', idLocale);
            setChoiceDate(true);
            var today = new Date();
            today.setHours(today.getHours() + 2);
            console.log(today);
            var convertDate = moment(new Date(today)).format("yyyy-MM-DD");
            var convertTime = moment(new Date(today)).format("HH");
            setCurrentDate(convertDate);
            setCurrentTime(convertTime);
            setSelectedDate(convertDate);
            setSelectedTime(convertTime);
        } else {
            setChoiceDate(false);
            var today = new Date();
            today.setHours(today.getHours() + 2);
            setSelectedDate(today);
        }
        
    }

    const handleShippingDate = (e) => {
        var today = new Date();
        today = moment(new Date(today)).format("yyyy-MM-DD");
        var pickDate = moment(new Date(e)).format("yyyy-MM-DD");

        if(pickDate !== today) {
            setIsTomorrow(true);
            e.setHours(e.getHours() + 1);
            var convertTime = moment(new Date(e)).format("HH");
            setCurrentTime(convertTime);
            setSelectedTime(convertTime);
        } else {
            setIsTomorrow(false);
        }

        var date = moment(new Date(e)).format("yyyy-MM-DD");
        setSelectedDate(date);
    }

    const handleShippingTime = (e) => {
        var hours   = Math.floor(e / 3600);
        var minutes = Math.floor((e - (hours * 3600)) / 60);
        var time = hours + ":" + minutes;

        setSelectedTime(time);
    }

    const shippingSelection = () => {

        return (
            <div>
                {
                    merchantHourStatus.merchant_status == "OPEN" ?
                    <div>
                        <div className='shippingdate-detailContent'>
                            <div className='shippingdate-radioSection'>
                                <input type='radio' id='now' onChange={() => onChangeRadio(0)} name={'DATETYPE'} />
                                <label htmlFor='now'>
                                    <div className='shippingdate-radioSide'>
                                        <div className='shippingdate-radioTitle'>Sekarang</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
                <div>
                    <div className='shippingdate-detailContent'>
                        <div className='shippingdate-radioSection'>
                            <input type='radio' id='custom' onChange={() => onChangeRadio(1)} name={'DATETYPE'} />
                            <label htmlFor='custom'>
                                <div className='shippingdate-radioSide'>
                                    <div className='shippingdate-radioTitle'>Custom Tanggal</div>
                                </div>
                                <img className='shippingdate-radio-image' src={ShippingDate} alt='' />
                            </label>
                        </div>
                    </div>
                </div>  
            </div>
        )
    }

    const shippingDateCustom = () => {
        return (
            <div className="shippingdate-selection-layout">
                <div>    
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        autoOk
                        id="registerDate"
                        onChange={handleShippingDate}
                        inputVariant="outlined" 
                        className={"shippingdate-datetimepicker"}
                        format={"d MMMM yyyy"}
                        minDate={currentDate}
                        value={selectedDate}
                        ampm={false}
                        disablePast={true}
                    />
                    </MuiPickersUtilsProvider>
                </div>
                <div>
                <TimePicker 
                    className={"shippingdate-timepicker"}
                    format={24}
                    start={currentTime} 
                    end="18:00" 
                    step={120}
                    value={selectedTime}
                    onChange={handleShippingTime}
                />
                </div>
            </div>
        )
    }

    const handleSave = () => {
        if(CartRedu.shippingDateType === 1) {
            const dateTime = moment(`${selectedDate} ${selectedTime}`, 'yyyy-MM-DD HH:mm:ss').format();
            dispatch({ type: 'SHIPPINGDATE', payload: Date.parse(dateTime)});
            Cookies.set("SHIPMENTDATE", { shipmentDate: Date.parse(dateTime) })
        } else {
            Cookies.set("SHIPMENTDATE", { shipmentDate: selectedDate })
            dispatch({ type: 'SHIPPINGDATE', payload: selectedDate});
        }
        
        window.history.back();
    }

    const goBack = () => {
        window.history.back();
    }

    return (
        <>
            <div className="shippingdate-layout">
                <div className="shippingdate-topSide">
                    <div className="shippingdate-header">
                        <span className="shippingdate-backArrow" onClick={goBack}>
                            <img className="shippingdate-backArrow-icon" src={ArrowBack} alt='' />
                        </span>
                        <div className="shippingdate-title">Atur Tanggal Pengiriman</div>
                    </div>

                    {shippingSelection()}
                    {choiceDate ? shippingDateCustom() : null}
                </div>

                <div 
                    onClick={handleSave} 
                    className="shippingdate-selectButton" 
                    style={{backgroundColor: 
                        selectedDate ? '#4bb7ac' 
                        : 
                        '#aaaaaa'}}
                >Pilih</div>
            </div>
        </>
    )
}

export default ShippingDateView