import Axios from "axios";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";

export const fetchData = async () => {
    let latitude = -6.28862
    let longitude = 106.71789
    let addressRoute = address + "home/v2/merchant/" + longitude + "/" + latitude + "/ALL/"

    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();

    const allMerchantAPI = await Axios(addressRoute, {
        headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
            "token": "PUBLIC",
            "category": "1",
        },
        method: "GET",
        params: {
            page: 0,
            size: 6
        }
    })

    let allData = allMerchantAPI.data.results
    let realData = []
    realData.push({
        address: allData.merchant_address,
        rating: allData.merchant_rating,
        logo: allData.merchant_logo,
        distance: allData.merchant_distance,
        storeId: allData.mid,
        storeName: allData.merchant_name,
        storeDesc: "",
        storeImage: allData.merchant_pict,
    })

    return realData
}

export const loadMoreMerch = () => {
    let idCol = 0
    let page = 0 //will load more merchant until all pages load
    let totalpage = 7 //there are 6 pages for instance

    do {
        if (idCol <= page) {
            idCol += 1
            page += 1
            console.log('loadagain');
        } else {
            console.log('disable scroll');
        }
    } while (page < totalpage - 1);

    return page
}