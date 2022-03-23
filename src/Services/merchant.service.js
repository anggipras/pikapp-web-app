import http from "../http-common";

class MerchantService {
    checkShopStatus(header) {
        return http.get(`merchant/v1/shop/status/`, { headers : {
            "token" : header.token,
            "mid" : header.mid,
        }});
    }
}

export default new MerchantService();