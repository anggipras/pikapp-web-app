import http from "../http-common";

class AnalyticsService {
    sendTrackingPage(header, body) {
        return http.post(`home/v1/event/add`, body, { headers : {
            "token" : header.token
        }});
    }
}

export default new AnalyticsService();