import React, { useEffect, useState } from "react";
import '../../Asset/scss/MenuSelection.scss'
import { useMediaQuery } from 'react-responsive'
import Autosize from 'autosize'
import { ValidQty } from '../../Redux/Actions'
import { connect } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";

const checkboxDummyData = [
    { additionname: 'topping', maxchoice: 3, isMandat: true, listaddition: [{ name: 'coklat', price: 5000, isChecked: false }, { name: 'keju', price: 6000, isChecked: false }, { name: 'pisang', price: 7000, isChecked: false }, { name: 'wijen', price: 8000, isChecked: false }] },
    { additionname: 'boba', maxchoice: 2, isMandat: false, listaddition: [{ name: 'rainbow', price: 1000, isChecked: false }, { name: 'jelly', price: 2000, isChecked: false }, { name: 'pudding', price: 3000, isChecked: false }, { name: 'pearl', price: 4000, isChecked: false }] },
]

const radioDummyData = [
    { additionname: 'level pedas', isMandat: true, listaddition: [{ name: 'tidak pedas', isChecked: false }, { name: 'pedas', isChecked: false }, { name: 'pedas mampus', isChecked: false }] },
    { additionname: 'level dingin', isMandat: false, listaddition: [{ name: 'tidak dingin', isChecked: false }, { name: 'dingin', isChecked: false }, { name: 'dingin mampus', isChecked: false }] },
]

const MenuSelection = (props) => {
    const dispatch = useDispatch()
    const AllRedu = useSelector(state => state.AllRedu)
    const [detailCategory, setdetailCategory] = useState([
        {
            name: "",
            amount: 1,
        },
    ])
    const [note, setnote] = useState('')
    const [checkboxVal, setcheckboxVal] = useState([[], []])
    const [checkboxData, setcheckboxData] = useState([])
    const [indexCheckMandat, setindexCheckMandat] = useState(null)

    const [radioVal, setradioVal] = useState([[], []])
    const [radioData, setradioData] = useState([])
    // const [indexRadioMandat, setindexRadioMandat] = useState(null)

    const [updateDataEdit, setupdateDataEdit] = useState(false)
    const [updateEditChoice, setupdateEditChoice] = useState(false)

    const isMobile = useMediaQuery({ maxWidth: 768 })

    useEffect(() => {
        Autosize(document.getElementById('note'))
        if (!AllRedu.openMenuCart) {
            var datas = props.datas
            var list = []
            if (datas.foodExt !== undefined) {
                datas.foodExt.map((data) => {
                    return list.push({
                        name: data.name,
                        amount: data.amount + 1,
                    });
                });
                props.ValidQty(1)
                setdetailCategory(list);
            }

            //set mandatory for checkboxes
            let mandatCheckAvailability = checkboxDummyData.length
            let mandatCheckLength = checkboxDummyData.length
            checkboxDummyData.forEach(valCheck => {
                if (valCheck.isMandat) {
                    mandatCheckAvailability = checkboxDummyData.length - 1
                }
            })
            if (mandatCheckLength === mandatCheckAvailability) {
                dispatch({ type: 'MANDATCHECKCOND', payload: false })
            } else {
                dispatch({ type: 'MANDATCHECKCOND', payload: true })
            }

            //set mandatory for radio
            let mandatRadioAvailability = radioDummyData.length
            let mandatRadioLength = radioDummyData.length
            radioDummyData.forEach(valCheck => {
                if (valCheck.isMandat) {
                    mandatRadioAvailability = radioDummyData.length - 1
                }
            })
            if (mandatRadioLength === mandatRadioAvailability) {
                dispatch({ type: 'MANDATRADIOCOND', payload: false })
            } else {
                dispatch({ type: 'MANDATRADIOCOND', payload: true })
            }

            setradioData(radioDummyData)
            setcheckboxData(checkboxDummyData)

            //hit API in order to get response of product detail v2
            let uuid = uuidV4()
            uuid = uuid.replaceAll("-", "");
            const date = new Date().toISOString();
            Axios(`${address}/home/v2/detail/product/`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-request-id": uuid,
                    "x-request-timestamp": date,
                    "x-client-id": clientId,
                    "token": "PUBLIC",
                    "pid": props.datas.productId,
                },
                method: 'GET'
            }).then(productRes => {
                console.log(productRes.data.results);
                let productDet = productRes.data.results.extra_menus
                if (productDet.menu_type === 'RADIO') {
                    let listadditioncheckbox = []
                    let checkboxData = []
                    productDet.menu_extra_item.forEach(valList => {
                        listadditioncheckbox.push({
                            name: valList.item_name,
                            price: valList.extra_fee,
                            isChecked: false
                        })
                    })
                    checkboxData.push({
                        additionname: productDet.menu_name,
                        maxchoice: productDet.menu_extra_item[0].max_choice,
                        isMandat: productDet.menu_extra_item[0].is_mandatory,
                        listaddition: listadditioncheckbox
                    })
                    // console.log(checkboxData);
                }
            }).catch(err => console.log(err))
        } else {
            let amountofProd = props.datas.foodExt
            amountofProd.forEach((val) => {
                props.ValidQty(val.amount)
            })
            setdetailCategory(props.datas.foodExt)
            setnote(props.datas.foodNote)
            setcheckboxVal(props.datas.foodListCheckbox)
            setradioVal(props.datas.foodListRadio)
            setradioData(radioDummyData)
            setcheckboxData(checkboxDummyData)
            setupdateDataEdit(true)
            dispatch({ type: 'CHECKBOXES', payload: props.datas.foodListCheckbox })
            dispatch({ type: 'RADIOBUTTON', payload: props.datas.foodListRadio })
        }
    }, [])

    useEffect(() => {
        if (AllRedu.openMenuCart && updateDataEdit) {
            //this function is used for replace api data with edit data (CHECKBOX)
            let editCheckbox = []
            let newlistcheckboxAddition = []
            let foodListCheckbox = props.datas.foodListCheckbox

            checkboxData.forEach((firstVal, indfirstVal) => {
                firstVal.listaddition.forEach(secondVal => {

                    foodListCheckbox.forEach((foodfirstVal, indfoodFirst) => {
                        let countNoMatch = 1
                        foodfirstVal.forEach((foodsecondVal) => {
                            if (indfirstVal === indfoodFirst) {
                                if (secondVal.name === foodsecondVal.name) {
                                    newlistcheckboxAddition.push({
                                        name: secondVal.name,
                                        price: secondVal.price,
                                        isChecked: true
                                    })
                                } else {
                                    console.log(foodListCheckbox[0]);
                                    if (countNoMatch === foodfirstVal.length) {
                                        newlistcheckboxAddition.push({
                                            name: secondVal.name,
                                            price: secondVal.price,
                                            isChecked: false
                                        })
                                        countNoMatch = 1
                                    } else {
                                        countNoMatch++
                                    }
                                }
                            }
                        })
                    })

                    if (foodListCheckbox[indfirstVal].length === 0) {
                        newlistcheckboxAddition.push({
                            name: secondVal.name,
                            price: secondVal.price,
                            isChecked: false
                        })
                    }
                })
                editCheckbox.push({
                    additionname: firstVal.additionname,
                    maxchoice: firstVal.maxchoice,
                    listaddition: newlistcheckboxAddition
                })
                newlistcheckboxAddition = []
            })

            //this function is used for replace api data with edit data (RADIO)
            let editRadio = []
            let newlistradioAddition = []
            let foodListRadio = props.datas.foodListRadio

            radioData.forEach((firstVal, indfirstVal) => {
                firstVal.listaddition.forEach(secondVal => {

                    foodListRadio.forEach((foodfirstVal, indfoodFirst) => {
                        foodfirstVal.forEach((foodsecondVal) => {
                            if (indfirstVal === indfoodFirst) {
                                if (secondVal.name === foodsecondVal.name) {
                                    newlistradioAddition.push({
                                        name: secondVal.name,
                                        isChecked: true
                                    })
                                } else {
                                    newlistradioAddition.push({
                                        name: secondVal.name,
                                        isChecked: false
                                    })
                                }
                            }
                        })
                    })

                    if (foodListRadio[indfirstVal].length === 0) {
                        newlistradioAddition.push({
                            name: secondVal.name,
                            isChecked: false
                        })
                    }
                })
                editRadio.push({
                    additionname: firstVal.additionname,
                    listaddition: newlistradioAddition
                })
                newlistradioAddition = []
            })
            setcheckboxData(editCheckbox)
            setradioData(editRadio)
            setupdateDataEdit(false)
            setupdateEditChoice(true)
        }
    }, [radioVal, checkboxVal])

    const checkboxArrData = () => {
        return checkboxData.map((listname, indlistname) => {
            return (
                <div key={indlistname} className='checkbox-section'>
                    <div className='title-section'>
                        <div className='titleSelection'>Tambah {listname.additionname.toUpperCase().toLowerCase()}</div>
                        <div className='optionSelection'>Optional, Max {listname.maxchoice} items {listname.isMandat ? '*wajib' : null}</div>
                    </div>

                    <div className='boxContainer'>
                        {
                            listname.listaddition.map((listadd, indlistadd) => {
                                return (
                                    AllRedu.openMenuCart ?
                                        updateEditChoice ?
                                            <div key={indlistadd} className='box-section'>
                                                <input disabled={AllRedu.validQTY === 0} defaultChecked={listadd.isChecked} id={listadd.name} type='checkbox' name={`${listname.additionname}` + `${indlistadd}`} className={`${listname.additionname}`} value={listadd.name} onChange={(e) => onCheckboxChange(e, indlistname, listadd.price, `${listname.additionname}`, listname.maxchoice, listname.isMandat)} defaultChecked={listadd.isChecked} />
                                                <label htmlFor={listadd.name}>
                                                    <div className='checkBox-side'>
                                                        <div className='check-box' />
                                                        <div className='check-box-name'>{listadd.name.toUpperCase().toLowerCase()}</div>
                                                    </div>

                                                    <div className='additon-amount'>
                                                        +{listadd.price}
                                                    </div>
                                                </label>
                                            </div>
                                            :
                                            null
                                        :
                                        <div key={indlistadd} className='box-section'>
                                            <input disabled={AllRedu.validQTY === 0} defaultChecked={listadd.isChecked} id={listadd.name} type='checkbox' name={`${listname.additionname}` + `${indlistadd}`} className={`${listname.additionname}`} value={listadd.name} onChange={(e) => onCheckboxChange(e, indlistname, listadd.price, `${listname.additionname}`, listname.maxchoice, listname.isMandat)} defaultChecked={listadd.isChecked} />
                                            <label htmlFor={listadd.name}>
                                                <div className='checkBox-side'>
                                                    <div className='check-box' />
                                                    <div className='check-box-name'>{listadd.name.toUpperCase().toLowerCase()}</div>
                                                </div>

                                                <div className='additon-amount'>
                                                    +{listadd.price}
                                                </div>
                                            </label>
                                        </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        })
    }

    const radioArrData = () => {
        return radioData.map((listname, indlistname) => {
            return (
                <div key={indlistname} className='radio-section'>
                    <div className='title-section'>
                        <div className='titleSelection'>{listname.additionname}</div>
                        <div className='optionSelection'>Pilih Salah Satu {listname.isMandat ? '*wajib' : null}</div>
                    </div>

                    <div className='boxContainer'>
                        {
                            listname.listaddition.map((listadd, indlistadd) => {
                                return (
                                    AllRedu.openMenuCart ?
                                        updateEditChoice ?
                                            <div key={indlistadd} className='radiobox-section'>
                                                <input disabled={AllRedu.validQTY === 0} onChange={(e) => onRadioChange(e, indlistname, listname.isMandat)} id={listadd.name} type='radio' name={listname.additionname} value={listadd.name} defaultChecked={listadd.isChecked} />
                                                <label htmlFor={listadd.name}>
                                                    <div className='radio-side'>
                                                        <div className='radio-circle' />
                                                        <div className='radio-circle-name'>{listadd.name.toUpperCase().toLowerCase()}</div>
                                                    </div>
                                                </label>
                                            </div>
                                            :
                                            null
                                        :
                                        <div key={indlistadd} className='radiobox-section'>
                                            <input disabled={AllRedu.validQTY === 0} onChange={(e) => onRadioChange(e, indlistname, listname.isMandat)} id={listadd.name} type='radio' name={listname.additionname} value={listadd.name} defaultChecked={listadd.isChecked} />
                                            <label htmlFor={listadd.name}>
                                                <div className='radio-side'>
                                                    <div className='radio-circle' />
                                                    <div className='radio-circle-name'>{listadd.name.toUpperCase().toLowerCase()}</div>
                                                </div>
                                            </label>
                                        </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        })
    }

    const onCheckboxChange = (e, indexlistname, listprice, name, max, mandat) => {
        var checkedChecks = document.querySelectorAll(`.${name}:checked`)
        if (checkedChecks.length > max) {
            e.target.checked = false
        } else {
            if (mandat) {
                dispatch({ type: 'MANDATCHECK', payload: mandat })
                setindexCheckMandat(indexlistname)
            }
            let checkboxArr = [...checkboxVal]
            if (e.target.checked) {
                checkboxArr[indexlistname].push({ name: e.target.value, price: listprice, isChecked: true })
                setcheckboxVal(checkboxArr)
                dispatch({ type: 'CHECKBOXES', payload: checkboxArr })
            } else {
                checkboxArr[indexlistname] = checkboxArr[indexlistname].filter(val => val.name !== e.target.value)
                setcheckboxVal(checkboxArr)
                let sizeArr = 0
                checkboxArr.forEach((firstVal) => {
                    firstVal.forEach((nestedVal) => {
                        if (nestedVal.name) {
                            sizeArr += 1
                        }
                    })
                })
                if (sizeArr > 0) {
                    dispatch({ type: 'CHECKBOXES', payload: checkboxArr })
                    if (indexCheckMandat === indexlistname) {
                        if (checkboxArr[indexCheckMandat].length === 0) {
                            dispatch({ type: 'MANDATCHECK', payload: false })
                        }
                    }
                } else {
                    dispatch({ type: 'CHECKBOXES', payload: [] })
                    dispatch({ type: 'MANDATCHECK', payload: false })
                }
            }
        }
    }

    const onRadioChange = (e, indexlistname, mandat) => {
        if (mandat) {
            dispatch({ type: 'MANDATRADIO', payload: mandat })
            // setindexRadioMandat(indexlistname)
        }
        let radiobuttonArr = [...radioVal]
        radiobuttonArr[indexlistname].pop()
        radiobuttonArr[indexlistname].push({ name: e.target.value, isChecked: true })
        setradioVal(radiobuttonArr)
        dispatch({ type: 'RADIOBUTTON', payload: radiobuttonArr })
    }

    const handleDecrease = (e) => {
        let updatedFoodlist = detailCategory.map((food) => {
            if (food === e && food.amount > 1) {
                food.amount = food.amount - 1;
                props.ValidQty(food.amount)
            }
            return food;
        })
        setdetailCategory(updatedFoodlist)
    }

    const handleIncrease = (e) => {
        let updatedFoodlist = detailCategory.map((food) => {
            if (food === e) {
                food.amount = food.amount + 1;
                props.ValidQty(food.amount)
            }
            return food;
        })
        setdetailCategory(updatedFoodlist)
    }

    const handleAmount = () => {
        return detailCategory.map((food, ind) => {
            return (
                <div key={ind} className='amount-box-inside'>
                    <div className='minus-box' style={{ backgroundColor: AllRedu.validQTY > 1 ? '#4bb7ac' : '#767676' }} onClick={() => handleDecrease(food)}>
                        <div className='minus-sym'>
                            -
                        </div>
                    </div>

                    <div className='number-area'>
                        {food.amount}
                    </div>

                    <div className='plus-box' onClick={() => handleIncrease(food)}>
                        <div className='plus-sym'>
                            +
                        </div>
                    </div>
                </div>
            )
        })
    }

    const handleNote = (e) => {
        setnote(e.target.value)
    }

    var thedata = {
        detailCategory: detailCategory,
        note: note ? note : '',
        foodCategory: AllRedu.openMenuCart ? props.datas.foodCategory : AllRedu.foodCateg,
        listcheckbox: checkboxVal,
        listradio: radioVal
    }
    // console.log(thedata);
    props.handleData(thedata)

    return (
        <>
            {
                !isMobile ?
                    <div className='menuSelection-layout'>
                        <div className='checkbox-layout'>
                            {checkboxArrData()}
                        </div>

                        <div className='radio-layout'>
                            {radioArrData()}
                        </div>

                        <div className='amount-section'>
                            <div className='titleSelection'>
                                Jumlah
                            </div>

                            <div className='amount-box'>
                                {handleAmount()}
                            </div>
                        </div>

                        <div className='note-section'>
                            <div className='titleSelection'>
                                Catatan
                            </div>

                            <div className='note-box'>
                                <textarea id="note" placeholder={"Tambahkan Catatanmu"} className='note-area' onChange={handleNote} />
                            </div>
                        </div>
                    </div>
                    :
                    <div className='menuSelection-layout'>
                        <div className='checkbox-layout'>
                            {checkboxArrData()}
                        </div>

                        <div className='radio-layout'>
                            {radioArrData()}
                        </div>

                        <div className='amount-section'>
                            <div className='titleSelection'>
                                Jumlah
                            </div>

                            <div className='amount-box'>
                                {handleAmount()}
                            </div>
                        </div>

                        <div className='note-section'>
                            <div className='titleSelection'>
                                Catatan
                            </div>

                            <div className='note-box'>
                                <textarea id="note" placeholder={"Tambahkan Catatanmu"} className='note-area' onChange={handleNote} />
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

export default connect(null, { ValidQty })(MenuSelection)