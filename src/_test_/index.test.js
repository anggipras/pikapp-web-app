import { shallow } from "enzyme";
import Index from "../index";

it("renders without crashing Index", () => {
    shallow(<Index />);
});