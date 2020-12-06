import React from "react"
import { JumbotronView } from "../View/JumbotronView"
import { FormView } from '../View/FormView'
import { Container } from "react-bootstrap";

export default class LoginLayout extends React.Component {
    render() {
        return (
                <body>
                    <div class='wrapper'>
                    <JumbotronView title="Register" titleColor = 'white' isLogIn = {false}/>
                        <Container>
                                <FormView isLogIn={false}/>
                        </Container>
                    </div>
                </body>
        );
    }
}