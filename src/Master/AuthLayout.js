import React from "react"
import { JumbotronView } from "../View/JumbotronView"
import { FormView } from '../View/FormView'
import { Container } from "react-bootstrap";

export default class LoginLayout extends React.Component {
    state = {
        title: "",
        titleColor: "",
        buttonColor: "",
    };

    componentDidMount() {
        const isLogin = this.props.isLogin
        if (isLogin) {
            document.body.style.backgroundColor = "#FEC814";
            this.setState({title: "Login"})
            this.setState({titleColor: "black"})
            this.setState({buttonColor: "#4056C6"})
        } else {
            document.body.style.backgroundColor = "#4056C6";
            this.setState({title: "Register"})
            this.setState({titleColor: "white"})
            this.setState({buttonColor: "#FEC814"})
        }
    }

    render() {
        return (
                    <div class='wrapper'>
                    <JumbotronView title={this.state.title} titleColor = {this.state.titleColor} isLogIn = {this.props.isLogin}/>
                        <Container>
                                <FormView isLogIn={this.props.isLogin}/>
                        </Container>
                    </div>
        );
    }
}
