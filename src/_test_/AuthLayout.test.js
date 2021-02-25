import { shallow } from "enzyme";
import AuthLayout from "../Master/AuthLayout";
// import FormView from "../View/Auth/FormView";

it("renders without crashing AuthLayout", () => {
  shallow(<AuthLayout />);
});

// it("renders without crashing FormView", () => {
//   shallow(<FormView />);
// });