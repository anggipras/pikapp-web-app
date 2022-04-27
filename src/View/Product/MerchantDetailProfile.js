import Axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom"
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import ArrowRight from "../../Asset/Icon/arrowright-icon.png";
import ShopIcon from "../../Asset/Icon/ic_shop.png";
import LocationIcon from "../../Asset/Icon/location-icon.png";
import ClockIcon from "../../Asset/Icon/ic_clock_green.png";
import CartIcon from "../../Asset/Icon/ic_shopping_cart.png";
import { v4 as uuidV4 } from "uuid";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { Link } from "react-router-dom";
import UserReview from "../../Asset/Icon/user_review.png";
import StarGrey from "../../Asset/Icon/star_grey.png";
import StarYellow from "../../Asset/Icon/star_yellow.png";
import StarHalf from "../../Asset/Icon/star_half.png";
import StarIcon from '../../Asset/Icon/star.png'
import ArrowWhite from '../../Asset/Icon/ArrowRightWhite.png'
import OrderedMenu from '../../Asset/Icon/ic_ordered_menu.png'
import ic_score_taste from "../../Asset/Icon/ic_score_taste.png";
import ic_score_price from "../../Asset/Icon/ic_score_price.png";
import ic_score_portion from "../../Asset/Icon/ic_score_portion.png";
import ic_score_package from "../../Asset/Icon/ic_score_package.png";
import ic_score_quality from "../../Asset/Icon/ic_score_quality.png";
import ic_score_clean from "../../Asset/Icon/ic_score_clean.png";
import ReactStars from "react-rating-stars-component";
import ProgressBar from "@ramonak/react-progress-bar";
import moment from "moment";

//json data
import shopManagement from './ShopManagementHour.json'

const MerchantDetailProfile = () => {
    const location = useLocation()
    const [merchantLogo, setMerchantLogo] = useState(location.state.merchantLogo);
    const [merchantName, setMerchantName] = useState(location.state.merchantName);
    const [merchantAddress, setMerchantAddress] = useState(location.state.merchantAddress);
    const [merchantSchedule, setMerchantSchedule] = useState([
        {
            days: "",
            open_time: "",
            close_time: "",
        }
    ]);
    const checkboxScoreData = [
        { scoreName: "Rasa", scoreIcon: ic_score_taste},
        { scoreName: "Harga", scoreIcon: ic_score_price},
        { scoreName: "Porsi", scoreIcon: ic_score_portion},
        { scoreName: "Kemasan", scoreIcon: ic_score_package},
        { scoreName: "Kualitas", scoreIcon: ic_score_quality},
        { scoreName: "Kebersihan", scoreIcon: ic_score_clean},
    ] //array of object var
    const [merchantSummaryRating, setMerchantSummaryRating] = useState({
        merchant_total_rating: 4.7, //double var
        merchant_total_review: 500, //long var
        merchant_total_five_star: 380,//long var
        merchant_total_four_star: 110,//long var
        merchant_total_three_star: 10,//long var
        merchant_total_two_star: 0,//long var
        merchant_total_one_star: 0,//long var
    })
    const [customerRatingList, setCustomerRatingList] = useState([
        {
            customer_name: "Anggi Prastianto",// strings var
            customer_name_hidden: true,// boolean var
            customer_rating_date: "2021-01-03T19:00:00",// strings date var
            customer_rating_value: 5,// integer var
            customer_rating_score: ["Rasa", "Harga", "Kebersihan"], //array of strings var
            customer_exp: "Saya sangat suka dengan makanan nya",//strings var
            customer_menu_order: ["Mie ayam tetelan"]
        },
        {
            customer_name: "Putri",// strings var
            customer_name_hidden: false,// boolean var
            customer_rating_date: "2021-01-04T19:00:00",// strings date var
            customer_rating_value: 4,// integer var
            customer_rating_score: [], //array of strings var
            customer_exp: "Saya sangat suka dengan minuman nya",//strings var
            customer_menu_order: ["Mie ayam pangsit", "bakso jumbo"]
        },
        {
            customer_name: "Karenza",// strings var
            customer_name_hidden: false,// boolean var
            customer_rating_date: "2021-01-05T19:00:00",// strings date var
            customer_rating_value: 4.5,// integer var
            customer_rating_score: ["Rasa", "Harga", "Kebersihan"], //array of strings var
            customer_exp: "Saya sangat suka semua menu nya",//strings var
            customer_menu_order: ["Mie ayam pangsit", "bakso jumbo", "es teh"]
        },
        {
            customer_name: "Dimas",// strings var
            customer_name_hidden: false,// boolean var
            customer_rating_date: "2021-01-06T19:00:00",// strings date var
            customer_rating_value: 4.5,// integer var
            customer_rating_score: ["Rasa", "Harga", "Kebersihan"], //array of strings var
            customer_exp: "Saya sangat suka semua menu nya",//strings var
            customer_menu_order: ["Mie ayam", "bakso jumbo"]
        },
        {
            customer_name: "Andrew Budiman",// strings var
            customer_name_hidden: false,// boolean var
            customer_rating_date: "2021-01-07T19:00:00",// strings date var
            customer_rating_value: 4.5,// integer var
            customer_rating_score: ["Rasa", "Harga", "Kebersihan"], //array of strings var
            customer_exp: "Saya sangat suka semua menu nya",//strings var
            customer_menu_order: ["Mie ayam", "bakso jumbo"]
        },
        {
            customer_name: "Johannes Budiman",// strings var
            customer_name_hidden: false,// boolean var
            customer_rating_date: "2021-01-08T19:00:00",// strings date var
            customer_rating_value: 4.5,// integer var
            customer_rating_score: ["Rasa", "Harga", "Kebersihan"], //array of strings var
            customer_exp: "Saya sangat suka semua menu nya",//strings var
            customer_menu_order: ["Mie ayam", "bakso jumbo"]
        },
    ]);

    useEffect(() => {
        let res = {
            data: shopManagement
        }
        let timeManagement = res.data.results.time_management
        setMerchantSchedule(timeManagement)
    }, [])

    const shopSchedule = () => {
        return merchantSchedule.map((val, ind) => {
            let shopDays
            if (val.days == "SUNDAY") {
                shopDays = "Minggu"
            } else if(val.days == "MONDAY") {
                shopDays = "Senin"
            } else if(val.days == "TUESDAY") {
                shopDays = "Selasa"
            } else if(val.days == "WEDNESDAY") {
                shopDays = "Rabu"
            } else if(val.days == "THURSDAY") {
                shopDays = "Kamis"
            } else if(val.days == "FRIDAY") {
                shopDays = "Jumat"
            } else if(val.days == "SATURDAY") {
                shopDays = "Sabtu"
            } 

            let hourStatus
            if (val.open_time == "00:00" && val.close_time == "00:00") {
                hourStatus = `Tutup`
            } else if(val.open_time == "00:00" && val.close_time == "23:59") {
                hourStatus = `Buka 24 Jam`
            } else {
                hourStatus = `${val.open_time} - ${val.close_time}`
            }
            return (
                <div key={ind} className="merchdetailprofile-shopSchedule-content">
                    <div className="merchdetailprofile-shopSchedule-days">{shopDays}</div>
                    <div className="merchdetailprofile-shopSchedule-hours">{hourStatus}</div>
                </div>
            )
        })
    }

    const cartButton = () => {
        let allCart = JSON.parse(localStorage.getItem('cart'))
        let selectedMerchant = JSON.parse(localStorage.getItem("selectedMerchant"));
        let filterMerchantCart = allCart.filter(cartVal => {
            return selectedMerchant[0].mid === cartVal.mid
        })
        if (filterMerchantCart.length != 0) {
            let isManualTxn = JSON.parse(localStorage.getItem("isManualTxn"))
            return (
                <Link to={isManualTxn ? "/cartmanual" : "/cart"} style={{ textDecoration: "none" }}>
                    <div className="merchdetailprofile-cart-layout">
                        <div className="merchdetailprofile-cart-startSide">
                            <img className="merchdetailprofile-cart-image" src={CartIcon} alt='' />
                            <div className="merchdetailprofile-cart-titleSide">
                                <div className="merchdetailprofile-cart-title">Pesanan Saya</div>
                                <div className="merchdetailprofile-cart-detail">Cek Pesanan Saya Sekarang</div>
                            </div>
                        </div>

                        <img className="merchdetailprofile-cart-arrow" src={ArrowRight} alt='' />
                    </div>
                </Link>
            )
        } else {
            return null
        }
    }

    const ratingValue = (e) => {
        if (e < 5 && e > 4) {
            return 4.5
        } else if(e < 4 && e > 3) {
            return 3.5
        } else if(e < 3 && e > 2) {
            return 2.5
        } else if(e < 2 && e > 1) {
            return 1.5
        } else {
            return e
        }
    }

    const filledCheckboxArrScore = (customer_rating_score) => {
        if (customer_rating_score != null) {
            let scoreResponse = checkboxScoreData.filter(scoreValue => {
                return customer_rating_score.includes(scoreValue.scoreName)
            })

            return scoreResponse.map((listScore, ind) => {
                return (
                    <div key={ind} className={`filledrating-scorebox-section`}>
                        <div className='filledrating-scorecheckbox-side'>
                            <div className='filledrating-scorecheckbox-name'>{listScore.scoreName}</div>
                        </div>
    
                        <img className="filledrating-scoreIcon" src={listScore.scoreIcon}/>
                    </div>
                )
            })
        } else {
            return null
        }
    }

    const customerRatingCardList = () => {
        return customerRatingList.map((value, index) => {
            if (index < 3) {
                return (
                    <div key={index} className="merchdetailrating-customer-reviewcard">
                        <div className="merchdetailrating-customerreview-topside">
                            <div className="merchdetailrating-customerreview-nameside">
                                <div className="merchdetailrating-customerreview-nameinitalimg">
                                    {value.customer_name.substring(0, 1)}
                                </div>
    
                                <div className="merchdetailrating-customerreview-namecontent">
                                    <div className="merchdetailrating-customerreview-fullname">
                                        {customerNameRating(value.customer_name, value.customer_name_hidden)}
                                    </div>
    
                                    <div className="merchdetailrating-customerreview-rateddate">
                                        {moment(new Date(value.customer_rating_date)).format("DD MMMM YYYY, HH:mm")}
                                    </div>
                                </div>
                            </div>
    
                            <div className="merchdetailrating-customerreview-rateside">
                                <img src={StarIcon} className="merchdetailrating-customerreview-rateside-img" />
                                <div className="merchdetailrating-customerreview-rateside-score">{value.customer_rating_value}</div>
                            </div>
                        </div>

                        <div className="merchdetailrating-customerreview-score">
                            {filledCheckboxArrScore(value.customer_rating_score)}
                        </div>
    
                        <div className="merchdetailrating-customerreview-content">
                            {value.customer_exp}
                        </div>
    
                        <div className="merchdetailrating-customerreview-orderedmenu">
                            <img src={OrderedMenu} className="merchdetailrating-customerreview-orderedmenu-img" />
                            <div className="merchdetailrating-customerreview-orderedmenu-text">{orderedMenuList(value.customer_menu_order)}</div>
                        </div>
                    </div>
                )
            }
        })
    }

    const customerNameRating = (custName, custStat) => {
        if (custStat) {
            let arrayOfCustName = custName.split(' ') // array of splitted customer name
            let arrayOfFixedName = []
            arrayOfCustName.forEach((val, ind) => {
                let hiddenChar = "*".repeat(val.length - 1)
                let firstNameChar = val.substring(0, 1)
                let fixedName = firstNameChar + hiddenChar
                arrayOfFixedName.push(fixedName)
            })
            return arrayOfFixedName.join(' ')
        } else {
            return custName
        }
    }

    const orderedMenuList = (ordered_menu) => {
        let stringOfMenu = ""
        ordered_menu.forEach((e, i) => {
            if (i == ordered_menu.length - 1) {
                stringOfMenu += `${e}`
            } else {
                stringOfMenu += `${e}, `
            }
        });
        return stringOfMenu
    }

    return (
        <>
            <div className="merchdetailprofile-Layout">
                <div className="merchdetailprofile-header">
                    <span className="merchdetailprofile-back" onClick={() => window.history.go(-1)}>
                        <img className="merchdetailprofile-backicon" src={ArrowBack} alt='' />
                    </span>

                    <img className="merchdetailprofile-logo" src={merchantLogo} alt='' />
                    <div className="merchdetailprofile-title">{merchantName}</div>
                </div>

                <div className="merchdetailprofile-shopTitle-layout">
                    <img className="merchdetailprofile-shopTitle-image" src={ShopIcon} alt='' />
                    <div className="merchdetailprofile-shopTitle-title">Info Toko</div>
                </div>

                <div className="merchdetailprofile-shopAddress-layout">
                    <img className="merchdetailprofile-shopAddress-image" src={LocationIcon} alt='' />
                    <div className="merchdetailprofile-shopAddress-title">{merchantAddress}</div>
                </div>

                <div className="merchdetailprofile-shopSchedule-layout">
                    <img className="merchdetailprofile-shopSchedule-image" src={ClockIcon} alt='' />
                    <div className="merchdetailprofile-shopSchedule-contentLayout">
                        {shopSchedule()}
                    </div>
                </div>

                <div className="merchdetailprofile-divider" />
                <div className="merchdetailprofile-ratingTitle-layout">
                    <img className="merchdetailprofile-ratingTitle-image" src={UserReview} alt='' />
                    <div className="merchdetailprofile-ratingTitle-title">Ulasan Pelanggan</div>
                </div>

                <div className="merchdetailrating-summary-mainlayout">
                    <div className="merchdetailrating-summary-ratinglayout">
                        <div className="merchdetailrating-summary-ratescore">
                            <div className="merchdetailrating-summary-ratescore-result">{merchantSummaryRating.merchant_total_rating}</div>
                            <div className="merchdetailrating-summary-ratescore-max">/ 5</div>
                        </div>

                        <div className="merchdetailrating-summary-review">Berdasarkan {merchantSummaryRating.merchant_total_review} ulasan</div>

                        <ReactStars
                            classNames={"merchdetailrating-summary-ratestar"}
                            count={5}
                            value={ratingValue(merchantSummaryRating.merchant_total_rating)}
                            isHalf={true}
                            edit={false}
                            emptyIcon={<img src={StarGrey} className="icon-ratestar" />}
                            filledIcon={<img src={StarYellow} className="icon-ratestar" />}
                            halfIcon={<img src={StarHalf} className="icon-ratestar" />}
                        />
                    </div>

                    <div className="merchdetailrating-summary-progresslayout">
                        <div className="merchdetailrating-summary-eachprogress">
                            <div className="progressname-5-star">5</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_five_star != 0 ? merchantSummaryRating.merchant_total_five_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>

                        <div className="merchdetailrating-summary-eachprogress">
                            <div className="progressname-5-star">4</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_four_star != 0 ? merchantSummaryRating.merchant_total_four_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>

                        <div className="merchdetailrating-summary-eachprogress">
                            <div className="progressname-5-star">3</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_three_star != 0 ? merchantSummaryRating.merchant_total_three_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>

                        <div className="merchdetailrating-summary-eachprogress">
                            <div className="progressname-5-star">2</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_two_star != 0 ? merchantSummaryRating.merchant_total_two_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>

                        <div className="merchdetailrating-summary-eachprogress">
                            <div className="progressname-5-star">1</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_one_star != 0 ? merchantSummaryRating.merchant_total_five_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>
                    </div>
                </div>

                <div className="merchdetailrating-customer-reviewTitleLayout">
                    <div className="merchdetailrating-customer-reviewtitle">Apa Kata Pelanggan Lainnya?</div>
                    <Link to={"/merchant-profile/rating"} style={{ textDecoration: "none" }}>
                        <div className="merchdetailrating-customer-review-iconlayout">
                            <img className="merchdetailrating-customer-review-icon" src={ArrowWhite} />
                        </div>
                    </Link>
                </div>

                <div className="merchdetailrating-customer-reviewlayout">
                    {customerRatingCardList()}
                </div>
            </div>
        </>
    )
}

export default MerchantDetailProfile