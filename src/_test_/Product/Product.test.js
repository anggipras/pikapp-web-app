import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../../Redux/Store'
import ProductView from "../../View/Product/ProductView";
import { BrowserRouter as Router } from "react-router-dom";
import { fetchMerchantDetail, handleAddCart } from './ProductTest'
import renderer from 'react-test-renderer'

it("renders without crashing ProductView", () => {
  shallow(
    <Provider store={Store}>
      <ProductView />
    </Provider>
  );
});

it('matches the snapshot ProductView', () => {
  const productTree = renderer.create(
    <Router>
      <Provider store={Store}>
        <ProductView />
      </Provider>
    </Router>
  ).toJSON()

  expect(productTree).toMatchSnapshot()
})

describe('fetchMerchantDetail', () => {
  it('render merchant detail data correctly', () => {
    let merchantDetailImit = {
      "pickups": null,
      "products": [
        {
          "product_name": "Mie Ayam Yamin Jumbo Pangsit",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A30%3A01DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43199&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=9ac298c9797cb4827aa84613dde88cae39bd6388c4b7270941e1076c24dd6960",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A30%3A01DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=0df9b7de9fd35c36c0cf47042122c819a5960d18b8fbddd69782b7adc9f8ef5c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A30%3A01DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=0df9b7de9fd35c36c0cf47042122c819a5960d18b8fbddd69782b7adc9f8ef5c",
          "product_price": 30000,
          "product_id": "P00000026",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + pangsit kuah",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Ayam Yamin Jumbo Bakso",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000027",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Ayam Yamin Jumbo Kecap",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000028",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Ayam Yamin Jumbo Bakso Bakso",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43199&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=f92ce5615146f1e8dc0129531062571d23b784201a4915abf9ddbed5a90ba459",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000029",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Ayam",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000030",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Coba Coba",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000031",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Coba 01",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000032",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Coba 02",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000033",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Coba 03",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000034",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie Coba 05",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43199&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=f92ce5615146f1e8dc0129531062571d23b784201a4915abf9ddbed5a90ba459",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000037",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        },
        {
          "product_name": "Mie 007 ",
          "product_picture1": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture2": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_picture3": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A31%3A13DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T093852Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=7e95c3de6b1a361ec1be5c0081bdb79fe4b1aa6606522a4cde52be68b45c585c",
          "product_price": 30000,
          "product_id": "P00000038",
          "product_status": "true",
          "product_category": 4,
          "product_desc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + bakso",
          "rating": "0.0"
        }
      ],
      "categories": [
        {
          "category_id": "4",
          "category_name": "Mie",
          "order": 0
        }
      ],
      "mid": "M00000008",
      "merchant_pict": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/ropang-logo.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T103508Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=9c99aec227de7a54c7239d394a5d68ac5c1b943ca784787d6267cb8fd060e346",
      "merchant_logo": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/ropang-logo.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210521T103508Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43199&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210521%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=a47cc09b0631eac741857da77bbb44d92dbf62edc6548a7b3bdaefaada49d000",
      "merchant_name": "Pikapp Store",
      "merchant_level": null,
      "merchant_rating": null,
      "merchant_address": "Jl. Regensi Melati Mas F10/2",
      "merchant_distance": "7.61 km"
    }

    fetchMerchantDetail().then(merchDet => {
      expect(merchDet).toEqual(merchantDetailImit)
    })
  })
})

it('render addtocart merchant detail', () => {
  var cart = [
    {
      mid: "",
      storeName: "",
      storeDesc: "",
      storeDistance: "",
      food: [
        {
          productId: "",
          foodName: "",
          foodPrice: 0,
          foodAmount: 0,
          foodImage: "",
          foodNote: "",
        },
      ],
    },
    {
      mid: "M00000008",
      storeName: "Pikapp Store",
      storeDesc: "Desc",
      storeDistance: "7.61 km",
      food: [
        {
          productId: "P00000026",
          foodName: "Mie Ayam Yamin Jumbo Pangsit",
          foodPrice: 30000,
          foodAmount: 1,
          foodImage: "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A30%3A01DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T091543Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210524%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=636bc139a2f7f583738d963d4f4d9eac4a876cf0ba4c216234eb633e16f7e9ee",
          foodNote: "",
        },
      ],
    }
  ];

  let incomingData = handleAddCart()
  expect(cart).toEqual(incomingData)
})