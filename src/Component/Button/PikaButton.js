import React from 'react';
import Button from 'react-bootstrap/Button';


export class PikaButton extends React.Component {
    render() {
        return (
            <Button variant = {this.props.style}> {this.props.title} </Button>
        );
    }
}
