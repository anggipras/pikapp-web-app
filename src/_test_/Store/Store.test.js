import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../../Redux/Store'
import StoreView from "../../View/Store/StoreView";
import Axios from "axios";
import { fetchData } from './StoreTest'
import { BrowserRouter as Router } from "react-router-dom";
import Store from '../../Redux/Store'
import StoreView from "../../View/Store/StoreView";
import { fetchData, loadMoreMerch } from './StoreTest'
import renderer from 'react-test-renderer'
import Store from '../../Redux/Store'
import StoreView from "../../View/Store/StoreView";
import Axios from "axios";
import { fetchData } from './StoreTest'

it("renders without crashing StoreView", () => {
  shallow(
    <Provider store={Store}>
      <StoreView />
    </Provider>
  );
});

jest.mock('Axios')

describe('fetchData', () => {
  it('render merchant list data correctly', () => {
    let testData = [
      {
        "address": "Jl. Regensi Melati Mas F10/2",
        "logo": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/ropang-logo.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=31c6c031d30e92070634b5637eb3ee0d26af4009fc517a6c3af6de907a041d1a",
        "distance": "7.61 km",
        "storeId": "M00000008",
        "storeName": "Pikapp Store",
        "storeDesc": "",
        "storeImage": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/ropang-logo.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43199&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=2c65147879f351eca758aeadec4d465750383d975640815f3973894717edbe7f"
      },
      {
        "address": "Jl. Regensi Melati Mas F10/2",
        "logo": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/ropang-logo.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=31c6c031d30e92070634b5637eb3ee0d26af4009fc517a6c3af6de907a041d1a",
        "distance": "7.61 km",
        "storeId": "M00000009",
        "storeName": "Andrew Meat Shop",
        "storeDesc": "",
        "storeImage": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/ropang-logo.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43199&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=2c65147879f351eca758aeadec4d465750383d975640815f3973894717edbe7f"
      },
      {
        "address": "Jl. Regensi Melati Mas F10/2",
        "logo": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/photo-1552566626-52f8b828add9.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=8d45ac4fde90997792f18e7b200543172a0ada25e754b17ff006ca22f71c57e4",
        "distance": "7.61 km",
        "storeId": "M00000010",
        "storeName": "Dummy Store 1",
        "storeDesc": "",
        "storeImage": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/photo-1552566626-52f8b828add9.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=8d45ac4fde90997792f18e7b200543172a0ada25e754b17ff006ca22f71c57e4"
      },
      {
        "address": "Jl. Regensi Melati Mas F10/2",
        "logo": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/photo-1514933651103-005eec06c04b.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=e23b68cdc2dec8d3025b4c9b5ada073b60e5e2fec5c18234744388ec151d372b",
        "distance": "7.61 km",
        "storeId": "M00000011",
        "storeName": "Dummy Store 2",
        "storeDesc": "",
        "storeImage": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/photo-1514933651103-005eec06c04b.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=e23b68cdc2dec8d3025b4c9b5ada073b60e5e2fec5c18234744388ec151d372b"
      },
      {
        "address": "Jl. Regensi Melati Mas F10/2",
        "logo": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/photo-1414235077428-338989a2e8c0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=39b67d9fdd738dd0a8399225000bd291943ad4b637ee07e627c280af8793c2af",
        "distance": "7.61 km",
        "storeId": "M00000012",
        "storeName": "Dummy Store 3",
        "storeDesc": "",
        "storeImage": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/photo-1414235077428-338989a2e8c0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=39b67d9fdd738dd0a8399225000bd291943ad4b637ee07e627c280af8793c2af"
      },
      {
        "address": "Jl. Regensi Melati Mas F10/2",
        "logo": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/photo-1552566626-52f8b828add9.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=8d45ac4fde90997792f18e7b200543172a0ada25e754b17ff006ca22f71c57e4",
        "distance": "7.61 km",
        "storeId": "M00000013",
        "storeName": "Dummy Store 4",
        "storeDesc": "",
        "storeImage": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/photo-1552566626-52f8b828add9.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210518T080323Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210518%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=8d45ac4fde90997792f18e7b200543172a0ada25e754b17ff006ca22f71c57e4"
      }
    ]

    fetchData().then(res => {
      expect(res).toEqual(testData)
    })

  })
})
      let allData = res.data.results
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

      expect(realData).toEqual(testData)
  })

  it('matches the snapshot', () => {
    const tree = renderer.create(
      <Router>
        <Provider store={Store}>
          <StoreView />
        </Provider>
      </Router>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})

it('test loadmoremerchant', () => {
  expect(loadMoreMerch()).toBe(6)
<<<<<<< HEAD
<<<<<<< HEAD
})
>>>>>>> b88195ce4784105b65b179d6115d42e51ea5fe2a
=======
})
>>>>>>> 68f3f0b4fa8679d082e885ebbc981032b4320121
=======
})
=======
      expect(res).toEqual(testData)
    })

  })
})
>>>>>>> mocking async fetch merchant list page
>>>>>>> 70a947b847c5fca97ac1ab64eb9fa5e5018e10ac
