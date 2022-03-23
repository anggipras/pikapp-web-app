import { address, clientId } from "../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import Axios from "axios";

export const checkShopStatus = async () => {
    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();
    let selectedMerchant = JSON.parse(localStorage.getItem('selectedMerchant'))
    let shopStatusRes = await Axios(address + "merchant/v1/shop/status/", {
        headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
            "token": "PUBLIC",
            "mid": selectedMerchant[0].mid,
            },
            method: "GET"
        })
    let merchantHourCheckingResult = shopStatusRes.data.results
    return merchantHourCheckingResult
}
