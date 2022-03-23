import http from "../http-common";

class TransactionService {
    addTransactionPos(body) {
        return http.post("pos/v3/web/transaction/add/", body);
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
        return http.get(`/pos/v1/transaction/get/detail/${param.transactionId}`);
    }
}

export default new TransactionService();