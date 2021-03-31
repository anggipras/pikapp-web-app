import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../Redux/Store'
import CartLayout from "../Master/CartLayout";
import CartView from "../View/Cart/CartView";

it("renders without crashing CartLayout", () => {
  shallow(<CartLayout />);
});

it("renders without crashing CartView", () => {
  shallow(
    <Provider store={Store}>
      <CartView />
    </Provider>
  );
});