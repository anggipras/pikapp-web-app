import { shallow } from "enzyme";
import StoreLayout from "../Master/StoreLayout";

it("renders without crashing StoreLayout", () => {
  shallow(<StoreLayout />);
});