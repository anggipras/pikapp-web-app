import React, { useEffect, useState } from "react";
import '../../Asset/scss/RatingLayout.scss'
import ArrowBack from "../../Asset/Icon/arrow-left.png";
import StarGrey from "../../Asset/Icon/star_grey.png";
import StarYellow from "../../Asset/Icon/star_yellow.png";
import StarHalf from "../../Asset/Icon/star_half.png";
import StarIcon from '../../Asset/Icon/star.png'
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
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from 'react-loading-skeleton'

const CustomerRatingView = () => {
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [merchantSummaryRating, setMerchantSummaryRating] = useState({
        merchant_total_rating: 4.7, //double var
        merchant_total_review: 500, //long var
        merchant_total_five_star: 380,//long var
        merchant_total_four_star: 110,//long var
        merchant_total_three_star: 10,//long var
        merchant_total_two_star: 0,//long var
        merchant_total_one_star: 0,//long var
    })
    const checkboxScoreData = [
        { scoreName: "Rasa", scoreIcon: ic_score_taste},
        { scoreName: "Harga", scoreIcon: ic_score_price},
        { scoreName: "Porsi", scoreIcon: ic_score_portion},
        { scoreName: "Kemasan", scoreIcon: ic_score_package},
        { scoreName: "Kualitas", scoreIcon: ic_score_quality},
        { scoreName: "Kebersihan", scoreIcon: ic_score_clean},
    ] //array of object var
    const [customerRatingList, setCustomerRatingList] = useState([]);
    const [dummyPaginationData, setDummyPaginationData] = useState([
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
            customer_rating_score: [], //array of strings var
            customer_exp: "Saya sangat suka semua menu nya",//strings var
            customer_menu_order: ["Mie ayam", "bakso jumbo"]
        },
        {
            customer_name: "Andrew Budiman",// strings var
            customer_name_hidden: false,// boolean var
            customer_rating_date: "2021-01-07T19:00:00",// strings date var
            customer_rating_value: 4.5,// integer var
            customer_rating_score: ["Rasa", "Harga", "Kebersihan"], //array of strings var
            customer_exp: "",//strings var
            customer_menu_order: ["Mie ayam", "bakso jumbo"]
        },
        {
            customer_name: "Johannes Budiman",// strings var
            customer_name_hidden: false,// boolean var
            customer_rating_date: "2021-01-08T19:00:00",// strings date var
            customer_rating_value: 4.5,// integer var
            customer_rating_score: [], //array of strings var
            customer_exp: "",//strings var
            customer_menu_order: ["Mie ayam", "bakso jumbo"]
        }
    ]);

    useEffect(() => {
        setTimeout(() => {
            setCustomerRatingList([
                {
                    customer_name: "Anggi Prastianto",// strings var
                    customer_name_hidden: true,// boolean var
                    customer_rating_date: "2021-01-03T19:00:00",// strings date var
                    customer_rating_value: 5,// integer var
                    customer_rating_score: ["Rasa", "Harga", "Porsi", "Kemasan", "Kualitas", "Kebersihan"], //array of strings var
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
                    customer_rating_score: [], //array of strings var
                    customer_exp: "Saya sangat suka semua menu nya",//strings var
                    customer_menu_order: ["Mie ayam", "bakso jumbo"]
                },
                {
                    customer_name: "Andrew Budiman",// strings var
                    customer_name_hidden: false,// boolean var
                    customer_rating_date: "2021-01-07T19:00:00",// strings date var
                    customer_rating_value: 4.5,// integer var
                    customer_rating_score: ["Rasa", "Harga", "Kebersihan"], //array of strings var
                    customer_exp: "",//strings var
                    customer_menu_order: ["Mie ayam", "bakso jumbo"]
                },
                {
                    customer_name: "Johannes Budiman",// strings var
                    customer_name_hidden: false,// boolean var
                    customer_rating_date: "2021-01-08T19:00:00",// strings date var
                    customer_rating_value: 4.5,// integer var
                    customer_rating_score: [], //array of strings var
                    customer_exp: "",//strings var
                    customer_menu_order: ["Mie ayam", "bakso jumbo"]
                }
            ])
        }, 5000);
    }, [])

    const fetchCustomerRating = () => {
        if (page == 3) {
            setHasMore(false)
        } else {
            setTimeout(() => {
                setCustomerRatingList([...customerRatingList].concat(dummyPaginationData))
                setPage(page+1)
            }, 3000);
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
                    <div key={ind} className={`filledcustomerrating-scorebox-section`}>
                        <div className='filledcustomerrating-scorecheckbox-side'>
                            <div className='filledcustomerrating-scorecheckbox-name'>{listScore.scoreName}</div>
                        </div>
    
                        <img className="filledcustomerrating-scoreIcon" src={listScore.scoreIcon}/>
                    </div>
                )
            })
        } else {
            return null
        }
    }

    const customerRatingCardList = () => {
        return customerRatingList.map((value, index) => {
            return (
                <div key={index} className="customerratingall-customer-reviewcard">
                    <div className="customerratingall-customerreview-topside">
                        <div className="customerratingall-customerreview-nameside">
                            <div className="customerratingall-customerreview-nameinitalimg">
                                {value.customer_name.substring(0, 1)}
                            </div>

                            <div className="customerratingall-customerreview-namecontent">
                                <div className="customerratingall-customerreview-fullname">
                                    {customerNameRating(value.customer_name, value.customer_name_hidden)}
                                </div>

                                <div className="customerratingall-customerreview-rateddate">
                                    {moment(new Date(value.customer_rating_date)).format("DD MMMM YYYY, HH:mm")}
                                </div>
                            </div>
                        </div>

                        <div className="customerratingall-customerreview-rateside">
                            <img src={StarIcon} className="customerratingall-customerreview-rateside-img" />
                            <div className="customerratingall-customerreview-rateside-score">{value.customer_rating_value}</div>
                        </div>
                    </div>

                    <div className="customerratingall-customerreview-score">
                        {filledCheckboxArrScore(value.customer_rating_score)}
                    </div>

                    <div className="customerratingall-customerreview-content">
                        {value.customer_exp}
                    </div>

                    <div className="customerratingall-customerreview-orderedmenu">
                        <img src={OrderedMenu} className="customerratingall-customerreview-orderedmenu-img" />
                        <div className="customerratingall-customerreview-orderedmenu-text">{orderedMenuList(value.customer_menu_order)}</div>
                    </div>
                </div>
            )
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
            <div className="customerratingall-Layout" style={{ height: customerRatingList.length < 4 ? "100vh" : "auto" }}>
                <div className="customerratingall-header">
                    <span className="customerratingall-back" onClick={() => window.history.go(-1)}>
                        <img className="customerratingall-backicon" src={ArrowBack} alt='' />
                    </span>

                    <div className="customerratingall-title">Ulasan Pelanggan</div>
                </div>

                <div className="customerratingall-summary-mainlayout">
                    <div className="customerratingall-summary-ratinglayout">
                        <div className="customerratingall-summary-ratescore">
                            <div className="customerratingall-summary-ratescore-result">{merchantSummaryRating.merchant_total_rating}</div>
                            <div className="customerratingall-summary-ratescore-max">/ 5</div>
                        </div>

                        <div className="customerratingall-summary-review">Berdasarkan {merchantSummaryRating.merchant_total_review} ulasan</div>

                        <ReactStars
                            classNames={"customerratingall-summary-ratestar"}
                            count={5}
                            value={ratingValue(merchantSummaryRating.merchant_total_rating)}
                            isHalf={true}
                            edit={false}
                            emptyIcon={<img src={StarGrey} className="icon-ratestar" />}
                            filledIcon={<img src={StarYellow} className="icon-ratestar" />}
                            halfIcon={<img src={StarHalf} className="icon-ratestar" />}
                        />
                    </div>

                    <div className="customerratingall-summary-progresslayout">
                        <div className="customerratingall-summary-eachprogress">
                            <div className="progressname-5-star">5</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_five_star != 0 ? merchantSummaryRating.merchant_total_five_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>

                        <div className="customerratingall-summary-eachprogress">
                            <div className="progressname-5-star">4</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_four_star != 0 ? merchantSummaryRating.merchant_total_four_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>

                        <div className="customerratingall-summary-eachprogress">
                            <div className="progressname-5-star">3</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_three_star != 0 ? merchantSummaryRating.merchant_total_three_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>

                        <div className="customerratingall-summary-eachprogress">
                            <div className="progressname-5-star">2</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_two_star != 0 ? merchantSummaryRating.merchant_total_two_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>

                        <div className="customerratingall-summary-eachprogress">
                            <div className="progressname-5-star">1</div>
                            <ProgressBar className="progressbar-5-star" height="10px" completed={merchantSummaryRating.merchant_total_one_star != 0 ? merchantSummaryRating.merchant_total_five_star : 0} maxCompleted={merchantSummaryRating.merchant_total_review} isLabelVisible={false} bgColor="#F4B55B"/>
                        </div>
                    </div>
                </div>

                <div className="customerratingall-customer-reviewTitleLayout">
                    <div className="customerratingall-customer-reviewtitle">Apa Kata Pelanggan Lainnya?</div>
                </div>

                <div className="customerratingall-customer-reviewlayout">
                    <InfiniteScroll
                        dataLength={customerRatingList.length}
                        next={fetchCustomerRating}
                        hasMore={hasMore}
                        loader={<Skeleton style={{ paddingTop: 100, borderRadius: 10 }} />}
                    >
                        {customerRatingCardList()}
                    </InfiniteScroll>
                </div>
            </div>
        </>
    )
}

export default CustomerRatingView