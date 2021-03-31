import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../Redux/Store'
import ProductLayout from "../Master/ProductLayout";
import ProductView from "../View/Product/ProductView";

it("renders without crashing ProductLayout", () => {
  shallow(<ProductLayout />);
});

it("renders without crashing ProductView", () => {
  shallow(
    <Provider store={Store}>
      <ProductView />
    </Provider>
  );
});