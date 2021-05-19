import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../Redux/Store'
import StoreView from "../View/Store/StoreView";
import Axios from "axios";
import { address, clientId } from "../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";
import { render } from "@testing-library/react";

it("renders without crashing StoreView", () => {
  shallow(
    <Provider store={Store}>
      <StoreView />
    </Provider>
  );
});

jest.mock('Axios')

test('render merchant list data correctly', async () => {
  let latitude = -6.28862
  let longitude = 106.71789

  let addressRoute = address + "home/v2/merchant/" + longitude + "/" + latitude + "/ALL/"
  let uuid = uuidV4();
  uuid = uuid.replace("-", "");
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
  let testData = []
  testData.push({
    address: allData.merchant_address,
    rating: allData.merchant_rating,
    logo: allData.merchant_logo,
    distance: allData.merchant_distance,
    storeId: allData.mid,
    storeName: allData.merchant_name,
    storeDesc: "",
    storeImage: allData.merchant_pict,
  })

  const { getAllMerchantData } = render(<StoreView />)
  const realData = getAllMerchantData('merchantlist-item').map(cardData => cardData.storeName)
  const imitationData = testData.map(resdata => resdata.storeName)
  await expect(realData).toEqual(imitationData)
})
