import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import backIcon from '../Asset/Icon/back_icon2x.png';
import cartLogo from '../Asset/Illustration/cart_illustration2x.png'

export default class CartNavigation extends React.Component {
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar>
                        <a href="">
                            <img src={backIcon} className={"icon"}></img>
                        </a>
                    </Navbar>
                    <Navbar.Brand class="navbar-center">
                        <img src={cartLogo}></img>
                    </Navbar.Brand>
                </Navbar>
            </div>
        );
    }
}