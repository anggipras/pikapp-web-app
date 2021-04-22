import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux'
import "../../Asset/scss/AuthenticationLayout.scss";
import ResetPinDialog from '../../Component/Authentication/ResetPin/ResetPinDialog';
import { useParams } from "react-router-dom";

const ResetPin = (props) => {
    const dispatch = useDispatch();
    const pintoken = props.match.params.pintoken;
    const [showResetDialog, setShowResetDialog] = useState(true);

    console.log(pintoken);
    // const setMenuDetail = () => {
        // setShowResetDialog(true);
    // }

    const resetPin = () => {
        dispatch({ type: 'PINTOKEN', payload: pintoken });
        if (showResetDialog) {
            return (
            <ResetPinDialog
                isShowResetPin={showResetDialog}
                onHideResetPin={() => setShowResetDialog(true)}
            />
            );
        }
    }

    return (
        <div>
            {resetPin()}
        </div>
    )

}

export default ResetPin
// class ResetPinView extends React.Component {

//     state = {
//         showResetDialog : true
//     }

//     setMenuDetail(isShow) {
//         this.setState({ showResetDialog: isShow })
//         document.body.style.overflowY = ''
//     }

//     resetPin = () => {
//         if (this.state.showResetDialog === true) {
//           return (
//             <ResetPinDialog
//                 isShowResetPin={this.state.showResetDialog}
//                 onHideResetPin={() => this.setMenuDetail(true)}
//             />
//           );
//         }
//     }

//     render() { 
//         return (
//             <>
//             {this.resetPin()}
//             </>
//         );
//     }
// }
// export default connect(null, {LoadingButton, DoneLoad })(ResetPinView)