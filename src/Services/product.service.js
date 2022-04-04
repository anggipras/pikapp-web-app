import http from "../http-common";

class ProductService {
    getDetailMerchant(header) {
        return http.get(`home/v3/detail/merchant/${header.longitude}/${header.latitude}/`, { headers : {
            "token" : header.token,
            "mid" : header.mid,
            "domain" : header.domain
        }});
    }

    getLinkTreeByDomain(header) {
        return http.get(`home/v1/link-tree-list-by-domain/${header.username}`, { headers : {
            "token" : header.token
        }});
    }

    getPromoList(header) {
        return http.get(`promotion/customer/campaign/v1/list/${header.mid}`, { headers : {
            "token" : header.token,
            "page" : header.page,
            "size" : header.size
        }});
    }
}

export default new ProductService();