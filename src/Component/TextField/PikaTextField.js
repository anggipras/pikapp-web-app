import React from 'react';
import Form from 'react-bootstrap/Form';

export class PikaTextField extends React.Component {
    render() {
        return (
            <Form>
                <Form.Label>{this.props.label}</Form.Label>
                <Form.Control type={this.props.email} placeholder={this.props.placeholder}/>
            </Form>
        );
    }
}