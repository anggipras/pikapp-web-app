import React from "react"
import CartNavigation from './CartNavigation'
import { CartView } from '../View/Cart/CartView'
import { primary_color, secondary_color } from '../Asset/Constant/ColorConstant';
import { Container } from "react-bootstrap";

export default class CartLayout extends React.Component {
    componentDidMount() {
        document.body.style.backgroundColor = secondary_color
    }
    
    render() {
        return (
            <html>
                <header>
                    <CartNavigation/>
                </header>
                <body>
                    <Container>
                        <CartView />
                    </Container>
                </body>
            </html>
        );
    }
}