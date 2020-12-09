import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import bellIcon from '../Asset/Icon/icon_bell2x.png';
import profileIcon from '../Asset/Icon/icon_profile2x.png';
import logo from '../Asset/Logo/logo2x.png';

export default class MainNavigation extends React.Component {
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar>
                        <a href="">
                            <img src={bellIcon} class="icon"></img>
                        </a>
                    </Navbar>
                    <Navbar.Brand class="navbar-center">
                        <img src={logo}></img>
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end"> 
                        <a href="">
                            <img src={profileIcon} class="icon"></img>
                        </a>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}