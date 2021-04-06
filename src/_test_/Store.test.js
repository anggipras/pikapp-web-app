import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../Redux/Store'
import StoreLayout from "../Master/StoreLayout";
import StoreView from "../View/Store/StoreView";

it("renders without crashing StoreLayout", () => {
  shallow(<StoreLayout />);
});

it("renders without crashing StoreView", () => {
  shallow(
    <Provider store={Store}>
      <StoreView />
    </Provider>
  );
});
