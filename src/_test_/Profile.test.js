import { shallow } from "enzyme";
import { Provider } from 'react-redux'
import ProfileLayout from "../Master/ProfileLayout";
import ProfileView from "../View/Profile/ProfileView";
import Store from '../Redux/Store'

it("renders without crashing ProfileLayout", () => {
    shallow(<ProfileLayout />);
});

it("renders without crashing ProfileView", () => {
    shallow(
        <Provider store={Store}>
            <ProfileView />
        </Provider>
    );
});
