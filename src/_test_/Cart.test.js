import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../Redux/Store'
import CartView from "../View/Cart/CartView";

// it("renders without crashing CartView", () => {
//   shallow(
//     <Provider store={Store}>
//       <CartView />
//     </Provider>
//   );
// });

test('tests without crashing CartView', () => {
  const tree = shallow(
    <Provider store={Store}>
      <CartView />
    </Provider>)
  expect(tree).toMatchSnapshot()
})