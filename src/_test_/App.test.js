import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../Redux/Store'
import App from "../App";

it("renders without crashing App", () => {
  shallow(
    <Provider store={Store}>
      <App />
    </Provider>
  );
});