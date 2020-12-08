import React from "react"
import MainNavigation from './MainNavigation'

export default class MainLayout extends React.Component {
    render() {
        return (
            <html>
                <header>
                    <MainNavigation/>
                </header>
                <body>
                    <div class = "container">
                        
                    </div>
                </body>
            </html>
        );
    }
}