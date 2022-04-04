import http from "../http-common";

class TransactionService {
    addTransactionPos(body) {
        return http.post("pos/v3/web/transaction/add/", body);
    }

    addTransactionTxn(body) {
        return http.post("/txn/v5/txn-post/", body);
    }

    addProductCart(header, body) {
        return http.post("txn/v2/cart-post/", body, { headers : {
            "table-no" : header.tableNumber,
        }});
    }

    getTransactionDetailDelivery(header) {
        return http.get(`/pos/v1/transaction/get/detail/`, { headers : {
            "invoice" : header.invoice
        }});
    }

    getTransactionDetailDineIn(param) {
        return http.get(`txn/v3/${param.transactionId}/txn-detail/`);
    }

    getPromoLimitStatus(param) {
        return http.get(`/promotion/customer/campaign/v1/validate/${param.campaign_id}`);
    }
}

export default new TransactionService();