import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { PikaButton } from '../Button/PikaButton';

export class PikaModal extends React.Component {
    render() {
        return (
            <Modal size = "lg" aria-labelledby= "contained-modal-title-vcenter" centered show = {this.props.isShow} onHide = {this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col/>
                        <Col>
                            <PikaButton title='Add to cart' style='cartPika' handleClick = {this.props.handleClick}/>
                        </Col>
                        <Col/>
                    </Row>
                </Modal.Body>
                <Modal.Footer/>
            </Modal>
        );
    }
}