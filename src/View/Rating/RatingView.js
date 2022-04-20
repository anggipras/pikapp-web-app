import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import '../../Asset/scss/RatingLayout.scss'
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import StarGrey from "../../Asset/Icon/star_grey.png";
import StarYellow from "../../Asset/Icon/star_yellow.png";
import ic_score_taste from "../../Asset/Icon/ic_score_taste.png";
import ic_score_price from "../../Asset/Icon/ic_score_price.png";
import ic_score_portion from "../../Asset/Icon/ic_score_portion.png";
import ic_score_package from "../../Asset/Icon/ic_score_package.png";
import ic_score_quality from "../../Asset/Icon/ic_score_quality.png";
import ic_score_clean from "../../Asset/Icon/ic_score_clean.png";
import Cookies from "js-cookie"
import { useLocation } from "react-router-dom"
import { v4 as uuidV4 } from "uuid";
import Rating from "react-rating"

const RatingView = () => {
    const [merchantLogo, setMerchantLogo] = useState(null) //URL string var
    const [merchantName, setMerchantName] = useState(null) //string var
    const [checkboxScoreData, setCheckboxScoreData] = useState([
        { scoreName: "Rasa", scoreIcon: ic_score_taste},
        { scoreName: "Harga", scoreIcon: ic_score_price},
        { scoreName: "Porsi", scoreIcon: ic_score_portion},
        { scoreName: "Kemasan", scoreIcon: ic_score_package},
        { scoreName: "Kualitas", scoreIcon: ic_score_quality},
        { scoreName: "Kebersihan", scoreIcon: ic_score_clean},
    ]) //array of object var
    const [ratingNotes, setRatingNotes] = useState(null) //string var
    const [ratingStar, setRatingStar] = useState(null) //integer var

    useEffect(() => {
        let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
        setMerchantLogo(selectedMerchant[0].merchant_logo)
        setMerchantName(selectedMerchant[0].merchant_name)
    }, [])

    const goBack = () => {
        window.history.go(-1)
    }

    const setStarValue = (e) => {
        setRatingStar(e)
    }

    const checkboxArrScore = () => {
        return checkboxScoreData.map((listScore, ind) => {
            return (
                <div key={ind} className={`scorebox-section scoreBox-sectionAlign${ind}`}>
                    <input id={listScore.scoreName} type='checkbox' name="scoreCheckBox-inputName" value={listScore.scoreName} />
                    <label htmlFor={listScore.scoreName}>
                        <div className='scorecheckbox-side'>
                            <div className='scorecheckbox-name'>{listScore.scoreName}</div>
                        </div>

                        <img className="scoreIcon" src={listScore.scoreIcon}/>
                    </label>
                </div>
            )
        })
    }

    const handleNote = (e) => {
        setRatingNotes(e.target.value)
    }

    const onSubmitRating = () => {
        console.log("Submit");
    }

    return (
        <>
            <div className="ratingPage-layout">
                <div className="ratingPage-header">
                    <span className="ratingPage-backArrow" onClick={goBack}>
                        <img className="backArrow-icon" src={ArrowBack} alt='' />
                    </span>
                    <div className="ratingPage-title">Rating Merchant</div>
                </div>

                <div className="ratingPage-starArea">
                    <div className="ratingPage-starArea-merchantDetail">
                        <span className="ratingPage-merchantDetail-imgLayout">
                            <img className="ratingPage-merchantDetail-img" src={merchantLogo} alt='' />
                        </span>
                        <div className="ratingPage-merchantDetail-name">{merchantName}</div>
                    </div>

                    <Rating
                        onClick={(e) => setStarValue(e)}
                        className="ratingPage-starArea-star"
                        emptySymbol={<img src={StarGrey} className="icon-star" />}
                        fullSymbol={<img src={StarYellow} className="icon-star" />}
                        />
                </div>

                <div className="ratingPage-divider" />

                <div className="ratingPage-scoreArea">
                    <div className="ratingPage-scoreTitle">Apa yang Anda sukai dari restoran ini?</div>

                    <div className="ratingPage-scoreLayout">
                        {checkboxArrScore()}
                    </div>
                </div>

                <div className="ratingPage-divider" />

                <div className="ratingPage-expArea">
                    <div className="ratingPage-expTitle">Ceritakan pengalaman Anda!</div>

                    <div className='ratingPage-note-box'>
                        <textarea id="note" placeholder={"Penjualnya ramah banget!"} className='ratingPage-note-area' onChange={handleNote} />
                    </div>
                    <div className="ratingPage-note-char" style={{ color: ratingNotes == null || ratingNotes.length < 501 ? "#aaaaaa" : "#DC6A84" }}>{ ratingNotes == null ? "0" : ratingNotes.length }/500</div>
                </div>

                <div className="ratingPage-divider" />

                <div className="ratingPage-hideName-layout">
                    <input id="hideName" type='checkbox' name="hideTheName" defaultChecked={false} />
                    <div className="ratingPage-hideNameTitle">Sembunyikan nama Anda</div>
                </div>

                <div 
                    className='ratingPage-submitButton'
                    style={{ backgroundColor: ratingStar == null ? "#aaaaaa":"#4bb7ac" }}
                    onClick={() => onSubmitRating()}>
                        Simpan
                </div>
            </div>
        </>
    )
}

export default RatingView