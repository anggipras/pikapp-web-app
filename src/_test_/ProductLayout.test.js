import { shallow } from "enzyme";
import ProductLayout from "../Master/ProductLayout";
// import { ProductView } from "../View/Product/ProductViewDev";

it("renders without crashing ProductLayout", () => {
  shallow(<ProductLayout />);
});

// it("renders without crashing ProductView", () => {
//   shallow(<ProductView />);
// });
