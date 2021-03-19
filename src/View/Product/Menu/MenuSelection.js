import React, { useEffect, useState } from "react";
import '../../../Asset/scss/MenuSelection.scss'
import { useMediaQuery } from 'react-responsive'
import Autosize from 'autosize'
import { ValidQty } from '../../../Redux/Actions'
import { connect } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

const checkboxData = [
    { additionname: 'topping', listaddition: [{ name: 'coklat', price: 5000 }, { name: 'keju', price: 6000 }, { name: 'pisang', price: 7000 }] },
    { additionname: 'boba', listaddition: [{ name: 'rainbow', price: 2000 }, { name: 'ball', price: 3000 }, { name: 'jelly', price: 4000 },] },
]

const radioData = [
    { additionname: 'level pedas', listaddition: ['tidak pedas', 'pedas', 'pedas mampus'] },
    { additionname: 'level dingin', listaddition: ['tidak dingin', 'dingin', 'dingin mampus'] },
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
    const [radioVal, setradioVal] = useState([[], []])

    const isMobile = useMediaQuery({ maxWidth: 768 })

    useEffect(() => {
        Autosize(document.getElementById('note'))
        var datas = props.datas
        var list = []
        if (datas.foodExt !== undefined) {
            datas.foodExt.map((data) => {
                return list.push({
                    name: data.name,
                    amount: data.amount,
                });
            });
            props.ValidQty(0)
            setdetailCategory(list);
        }
    }, [])

    const checkboxArrData = () => {
        return checkboxData.map((listname, indlistname) => {
            return (
                <div key={indlistname} className='checkbox-section'>
                    <div className='title-section'>
                        <div className='titleSelection'>Tambah {listname.additionname.toUpperCase().toLowerCase()}</div>
                        <div className='optionSelection'>Optional, Maksimal 2</div>
                    </div>

                    <div className='boxContainer'>
                        {
                            listname.listaddition.map((listadd, indlistadd) => {
                                return (
                                    <div key={indlistadd} className='box-section'>
                                        <input disabled={AllRedu.validQTY === 0} id={listadd.name} type='checkbox' name={`${listname.additionname}` + `${indlistadd}`} value={listadd.name} onChange={(e) => onCheckboxChange(e, indlistname, listadd.price)} />
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
                        <div className='optionSelection'>Pilih Salah Satu</div>
                    </div>

                    <div className='boxContainer'>
                        {
                            listname.listaddition.map((listadd, indlistadd) => {
                                return (
                                    <div key={indlistadd} className='radiobox-section'>
                                        <input disabled={AllRedu.validQTY === 0} onChange={(e) => onRadioChange(e, indlistname)} id={listadd} type='radio' name={listname.additionname} value={listadd} />
                                        <label htmlFor={listadd}>
                                            <div className='radio-side'>
                                                <div className='radio-circle' />
                                                <div className='radio-circle-name'>{listadd.toUpperCase().toLowerCase()}</div>
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

    const onCheckboxChange = (e, indexlistname, listprice) => {
        let checkboxArr = [...checkboxVal]
        if (e.target.checked) {
            checkboxArr[indexlistname].push({ name: e.target.value, price: listprice })
            setcheckboxVal(checkboxArr)
            dispatch({ type: 'CHECKBOXES', payload: checkboxArr })
        } else {
            checkboxArr[indexlistname] = checkboxArr[indexlistname].filter(val => val.name !== e.target.value)
            console.log(checkboxArr);
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
            } else {
                dispatch({ type: 'CHECKBOXES', payload: [] })
            }
        }
    }

    const onRadioChange = (e, indexlistname) => {
        let radiobuttonArr = [...radioVal]
        radiobuttonArr[indexlistname].pop()
        radiobuttonArr[indexlistname].push(e.target.value)
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
                    <div className='minus-box' onClick={() => handleDecrease(food)}>
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
        note: note
    }
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