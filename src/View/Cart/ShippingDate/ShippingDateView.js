import React, { useEffect, useState, useRef } from "react";
import '../../../Asset/scss/AddressSelection.scss'
import ArrowBack from "../../../Asset/Icon/arrow-left.png";
import ShippingDate from "../../../Asset/Icon/shipping-date.png";
// import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
// import { alpha } from '@material-ui/core/styles';
// import DateTimePicker from 'react-datetime-picker';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import idLocale from "moment/locale/id";
import TimePicker from 'react-bootstrap-time-picker';

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

    const onChangeRadio = (ind) => {
        dispatch({ type: 'SHIPPINGDATETYPE', payload: ind })
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
            // dispatch({ type: 'SHIPPINGDATE', payload: today});
        } else {
            setChoiceDate(false);
            var today = new Date();
            today.setHours(today.getHours() + 2);
            setSelectedDate(today);
            // var currentDateTime = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
            // dispatch({ type: 'SHIPPINGDATE', payload: today})
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
        // var date = moment(new Date(e.target.value)).format("yyyy-MM-DD HH:mm:ss");
        // dispatch({ type: 'SHIPPINGDATE', payload: e});
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
                    {/* <TextField 
                        ref={ref} 
                        placeholder="Custom Tanggal" 
                        id="registerDate" 
                        type="datetime-local"
                        // type="text" 
                        variant="standard" 
                        onChange={handleShippingDate} 
                        InputLabelProps={{ shrink: true }} 
                        // InputProps={{inputProps: { min: "2021-12-01", max: "2021-12-12" }, disableUnderline: true }} 
                        // onFocus={() => (ref.current.type = "datetime-local")}
                        // onBlur={() => (ref.current.type = "datetime-local")}
                        // minTime={0,0,0,new Date().setHours(new Date().getHours() + 3)}
                        // minDate={new Date("2021-12-01")}
                        // minTime={new Date(0, 0, 0, 8)}
                        // minDateTime={new Date()}
                        // inputProps={{ min: currentDate }}
                        // inputProps={{
                        //     min: "2021-08-10",
                        //     max: "2021-08-20"
                        // }}
                        // min="2021-12-01"
                        InputProps={{ inputProps: { min: "2021-01-12" } }}
                        style={{ width : "425px"}}
                    /> */}

                    {/* <DateTimePicker
                        // renderInput={(params) => <TextField {...params} />}
                        id="registerDate" 
                        inputVariant="standard" 
                        onChange={handleShippingDate} 
                        // InputLabelProps={{ shrink: true }} 
                        minDateTime={new Date()}
                        style={{ width : "425px"}}
                    /> */}
                    
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
                    // initialValue={currentTime} 
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
        } else {
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