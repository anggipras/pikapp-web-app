import axios from "axios";
import { v4 as uuidV4 } from "uuid";
import { address, clientId } from "./Asset/Constant/APIConstant"

let uuid = uuidV4();
uuid = uuid.replace(/-/g, "");
let date = new Date().toISOString();

export default axios.create({
    baseURL: address,
    headers: {
        "Content-type": "application/json",
        "x-request-id": uuid,
        "x-request-timestamp": date,
        "x-client-id": clientId,
    }
});