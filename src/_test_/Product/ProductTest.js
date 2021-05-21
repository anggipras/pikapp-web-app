import Axios from "axios";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";

export const fetchMerchantDetail = async () => {
    const mid = "M00000008";
    let latitude = -6.28862
    let longitude = 106.71789
    let addressRoute = address + "home/v2/detail/merchant/" + longitude + "/" + latitude + "/"

    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();

    return await Axios(addressRoute, {
        headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
            "token": "PUBLIC",
            "mid": mid,
        },
        method: "GET"
    })
}