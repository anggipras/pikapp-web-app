import React from "react";
import {connect} from 'react-redux'
import {LoadingButton, DoneLoad} from '../../Redux/Actions'
import "../../Asset/scss/AuthenticationLayout.scss";
import Paper from '@material-ui/core/Paper';
import ResetPinDialog from '../../Component/Authentication/ResetPin/ResetPinDialog';

class ResetPinView extends React.Component {

    state = {
        showResetDialog : true
    }

    setMenuDetail(isShow) {
        this.setState({ showResetDialog: isShow })
        document.body.style.overflowY = ''
    }

    resetPin = () => {
        if (this.state.showResetDialog === true) {
          return (
            <ResetPinDialog
                isShowResetPin={this.state.showResetDialog}
                onHideResetPin={() => this.setMenuDetail(true)}
            />
          );
        }
    }

    render() { 
        return (
            <>
            {this.resetPin()}
            </>
        );
    }
}
export default connect(null, {LoadingButton, DoneLoad })(ResetPinView)