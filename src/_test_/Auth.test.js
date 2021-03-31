import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import Store from '../Redux/Store'
import AuthLayout from "../Master/AuthLayout";
import FormView from "../View/Auth/FormView";

it("renders without crashing AuthLayout", () => {
  shallow(<AuthLayout />);
});

it("renders without crashing FormView", () => {
  shallow(
    <Provider store={Store}>
      <FormView />
    </Provider>
  );
});