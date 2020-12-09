import React from "react"
import MainNavigation from './MainNavigation'
import { ProductView } from '../View/Product/ProductView'
import { primary_color, secondary_color } from '../Asset/Constant/ColorConstant';

export default class MainLayout extends React.Component {

    componentDidMount() {
        document.body.style.backgroundColor = secondary_color
    }
    
    render() {
        return (
            <html>
                <header>
                    <MainNavigation/>
                </header>
                <body>
                    <div class = "container">
                        <ProductView />
                    </div>
                </body>
            </html>
        );
    }
}