import React from "react"
import { JumbotronView } from "../View/JumbotronView"
import { FormView } from '../View/FormView'
import { Container } from "react-bootstrap";

export default class LoginLayout extends React.Component {
    render() {
        return (
                <body>
                    <div class='wrapper'>
                    <JumbotronView title="Login" titleColor = 'white' isLogIn = {true}/>
                        <Container>
                                <FormView isLogIn={true}/>
                        </Container>
                    </div>
                </body>
        );
    }
}