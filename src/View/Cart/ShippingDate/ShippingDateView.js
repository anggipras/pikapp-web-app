import React, { useEffect, useState, useRef } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import ShippingDate from "../../../Asset/Icon/shipping-date.png";
import PromoAlert from "../../../Asset/Icon/ic_promo_alert.png";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import idLocale from "moment/locale/id";
import TimePicker from 'react-bootstrap-time-picker';
import Cookies from "js-cookie";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";
import { address, clientId } from "../../../Asset/Constant/APIConstant";

const ShippingDateView = () => {
    const ref = useRef();
    let history = useHistory()
    const dispatch = useDispatch()
    const CartRedu = useSelector(state => state.CartRedu)
    const [choiceDate, setChoiceDate] = useState(false)
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [closeOrOpen, setCloseOrOpen] = useState(false);
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
        next_open_day: null,
        next_open_time: null,
        next_close_time: null,
        auto_on_off: null
    })
    const [autoOnOff, setautoOnOff] = useState(true);

    useEffect(() => {
        let uuid = uuidV4();
        uuid = uuid.replace(/-/g, "");
        const date = new Date().toISOString();
        let selectedMerchant = JSON.parse(localStorage.getItem('selectedMerchant'))
        Axios(address + "merchant/v1/shop/status/", {
            headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
            "token": "PUBLIC",
            "mid": selectedMerchant[0].mid,
            },
            method: "GET"
        }).then((shopStatusRes) => {
            let merchantHourCheckingResult = shopStatusRes.data.results
            setMerchantHourStatus({
                minutes_remaining: merchantHourCheckingResult.minutes_remaining,
                open_time: merchantHourCheckingResult.open_time,
                merchant_status: merchantHourCheckingResult.merchant_status,
                close_time: merchantHourCheckingResult.close_time,
                next_open_day: merchantHourCheckingResult.next_open_day,
                next_open_time: merchantHourCheckingResult.next_open_time,
                next_close_time: merchantHourCheckingResult.next_close_time,
                auto_on_off: merchantHourCheckingResult.auto_on_off
            })
        })
    }, [])

    const onChangeRadio = (ind) => {
        dispatch({ type: 'SHIPPINGDATETYPE', payload: ind })
        Cookies.set("SHIPMENTDATETYPE", { shipmentDateType: ind })
        if(ind === 1) {
            moment.updateLocale('id', idLocale);
            setChoiceDate(true);
            var today = new Date();
            var todayEnd = new Date();

            if (merchantHourStatus.auto_on_off) {
                if (merchantHourStatus.merchant_status == "CLOSE") {
                    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    let nowDate = new Date()
                    if (weekday[nowDate.getDay()] == merchantHourStatus.next_open_day) { 
                        var openHour = merchantHourStatus.open_time.split(":")
                        var closeHour = merchantHourStatus.close_time.split(":")
                        today.setHours(parseInt(openHour[0]))
                        today.setMinutes(parseInt(openHour[1]))
                        todayEnd.setHours(parseInt(closeHour[0]))
                        todayEnd.setMinutes(parseInt(closeHour[1]))
                    } else if(weekday[nowDate.getDay()+1] == merchantHourStatus.next_open_day) { // set time, open next day  
                        today.setDate(today.getDate() + 1)
                        var openHour = merchantHourStatus.next_open_time.split(":")
                        var closeHour = merchantHourStatus.next_close_time.split(":") //LATER NEED TO BE CHANGED BY NEXT_CLOSE_TIME
                        today.setHours(parseInt(openHour[0]))
                        today.setMinutes(parseInt(openHour[1]))
                        todayEnd.setHours(parseInt(closeHour[0]))
                        todayEnd.setMinutes(parseInt(closeHour[1]))
                    } else { // set time, next day is close, open at specific day
                        let nextOpenDayInd = weekday.indexOf(merchantHourStatus.next_open_day)
                        let nowOpenDayInd = nowDate.getDay()
                        let countDay
                        if (nextOpenDayInd > nowOpenDayInd) {
                            countDay = nextOpenDayInd - nowOpenDayInd
                        } else {
                            countDay = (6 - nowOpenDayInd) + (1 + nextOpenDayInd)
                        }
                        today.setDate(today.getDate() + countDay)
                        var openHour = merchantHourStatus.next_open_time.split(":")
                        var closeHour = merchantHourStatus.next_close_time.split(":")
                        today.setHours(parseInt(openHour[0]))
                        today.setMinutes(parseInt(openHour[1]))
                        todayEnd.setHours(parseInt(closeHour[0]))
                        todayEnd.setMinutes(parseInt(closeHour[1]))
                    }
                } else { // set time, rest of time till near close
                    if (merchantHourStatus.minutes_remaining < "31") {
                        var openHour = merchantHourStatus.open_time.split(":")
                        var closeHour = merchantHourStatus.close_time.split(":")
                        today.setDate(today.getDate() + 1)
                        today.setHours(parseInt(openHour[0]))
                        today.setMinutes(parseInt(openHour[1]) + 30)
                        todayEnd.setHours(parseInt(closeHour[0]))
                        todayEnd.setMinutes(parseInt(closeHour[1]))
                    } else {
                        var closeHour = merchantHourStatus.close_time.split(":")
                        today.setHours(today.getHours());
                        today.setMinutes(30)
                        todayEnd.setHours(parseInt(closeHour[0]))
                        todayEnd.setMinutes(parseInt(closeHour[1]))
                    }
                }
            } else {
                setCloseOrOpen(true)
                setautoOnOff(false)
            }
            var convertDate = moment(new Date(today)).format("yyyy-MM-DD");
            var convertTime = moment(new Date(today)).format("HH");
            var convertCloseTime = moment(new Date(todayEnd)).format("HH");
            setCurrentDate(convertDate);
            setCurrentTime(convertTime);
            setCloseTime(convertCloseTime);
            setSelectedDate(convertDate);
            setSelectedTime(convertTime);
        } else {
            setCloseOrOpen(false)
            setChoiceDate(false);
            var today = new Date();
            today.setHours(today.getHours() + 1);
            setSelectedDate(today);
        }
        
    }

    const handleShippingDate = (e) => {
        var today = new Date();
        today = moment(new Date(today)).format("yyyy-MM-DD");
        var pickDate = moment(new Date(e)).format("yyyy-MM-DD");

        if(pickDate !== today) {
            let uuid = uuidV4();
            uuid = uuid.replace(/-/g, "");
            const date = new Date().toISOString();
            let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
            Axios(address + "merchant/v1/shop/management/list/", {
                headers: {
                "Content-Type": "application/json",
                "x-request-id": uuid,
                "x-request-timestamp": date,
                "x-client-id": clientId,
                "token": "PUBLIC",
                "mid": selectedMerchant[0].mid,
                },
                method: "GET"
            }).then((res) => {
                let timeManagement = res.data.results.time_management
                const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                let filteredDay = timeManagement.filter(valDay => {
                    return valDay.days == weekday[e.getDay()].toLocaleUpperCase()
                })
                let selectedDayStart = new Date();
                let selectedDayEnd = new Date();
                if (filteredDay[0].open_time == "00:00" && filteredDay[0].close_time == "00:00") {
                    setCloseOrOpen(true)
                } else {
                    setIsTomorrow(true);
                    setCloseOrOpen(false)
                    let selectedDayOpenHour = filteredDay[0].open_time.split(":")
                    let selectedDayCloseHour = filteredDay[0].close_time.split(":")
                    selectedDayStart.setHours(parseInt(selectedDayOpenHour[0]))
                    selectedDayStart.setMinutes(parseInt(selectedDayOpenHour[1]))
                    selectedDayEnd.setHours(parseInt(selectedDayCloseHour[0]))
                    selectedDayEnd.setMinutes(parseInt(selectedDayCloseHour[1]))
                    let convertTime = moment(new Date(selectedDayStart)).format("HH");
                    let convertCloseTime = moment(new Date(selectedDayEnd)).format("HH");
                    setCurrentTime(convertTime);
                    setCloseTime(convertCloseTime);
                    setSelectedTime(convertTime);
                }
            }).catch((err) => console.log(err))
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
                        merchantHourStatus.minutes_remaining <= "30" ?
                        null
                        :
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
                        disabled={merchantHourStatus.auto_on_off ? false : true}
                        value={selectedDate}
                        ampm={false}
                        disablePast={true}
                    />
                    </MuiPickersUtilsProvider>
                </div>
                <div>
                {
                    !closeOrOpen?
                    <TimePicker 
                        className={"shippingdate-timepicker"}
                        format={24}
                        start={currentTime} 
                        end={closeTime} 
                        step={30}
                        value={selectedTime}
                        onChange={handleShippingTime}
                    />
                    :
                    <div className="shippingdate-timepicker-close">
                        Tutup
                    </div>
                }
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
        
        if (autoOnOff) {
            if (!closeOrOpen) {
                window.history.back();
            }
        } else {
            window.history.back();
        }
    }

    const goBack = () => {
        if (autoOnOff) {
            if (!closeOrOpen) {
                window.history.back();
            }
        } else {
            window.history.back();
        }
    }

    const shippingDateWarning = () => {
        if (merchantHourStatus.auto_on_off) {
            if (merchantHourStatus.merchant_status != null) {
                if (merchantHourStatus.merchant_status == "CLOSE") {
                    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    const weekdayId = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
                    let nowDate = new Date()
                    if (weekday[nowDate.getDay()] == merchantHourStatus.next_open_day) {
                        return (
                            <div className="shippingdate-alert-paymentnotselected">
                                <span className="shippingdate-alert-icon">
                                    <img className="alert-icon" src={PromoAlert} alt='' />
                                </span>
                
                                <div className="shippingdate-alert-title">Toko masih tutup, Pengiriman hanya dapat dilakukan ketika toko buka</div>
                            </div>
                        )
                    } else if(weekday[nowDate.getDay()+1] == merchantHourStatus.next_open_day) {   
                        return (
                            <div className="shippingdate-alert-paymentnotselected">
                                <span className="shippingdate-alert-icon">
                                    <img className="alert-icon" src={PromoAlert} alt='' />
                                </span>
                
                                <div className="shippingdate-alert-title">Toko sudah tutup, Pengiriman hanya dapat dilakukan esok hari</div>
                            </div>
                        )
                    } else {
                        let nextOpenDay = weekday.indexOf(merchantHourStatus.next_open_day)
                        let finalNextOpenDay = weekdayId[nextOpenDay]
                        return (
                            <div className="shippingdate-alert-paymentnotselected">
                                <span className="shippingdate-alert-icon">
                                    <img className="alert-icon" src={PromoAlert} alt='' />
                                </span>
                
                                <div className="shippingdate-alert-title">Toko sudah tutup, Pengiriman hanya dapat dilakukan hari {finalNextOpenDay}</div>
                            </div>
                        )
                    }
                } else {
                    if (merchantHourStatus.minutes_remaining < "31") {
                        return (
                            <div className="shippingdate-alert-paymentnotselected">
                                <span className="shippingdate-alert-icon">
                                    <img className="alert-icon" src={PromoAlert} alt='' />
                                </span>
                
                                <div className="shippingdate-alert-title">Toko akan tutup, Pengiriman hanya dapat dilakukan esok hari</div>
                            </div>
                        )
                    } else {
                        return null
                    }
                }
            } else {
                return null
            }
        } else {
            return (
                <div className="shippingdate-alert-paymentnotselected">
                    <span className="shippingdate-alert-icon">
                        <img className="alert-icon" src={PromoAlert} alt='' />
                    </span>
    
                    <div className="shippingdate-alert-title">Toko tutup sementara</div>
                </div>
            )
        }
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

                    {shippingDateWarning()}

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