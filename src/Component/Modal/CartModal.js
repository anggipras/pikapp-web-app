import React from 'react';
import { Row, Col, Form} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { PikaButton } from '../Button/PikaButton';

export class CartModal extends React.Component {
    state = {
        radio: 0,
        detailOptions: [{
            name: "",
        }],
    }

    componentDidMount() {
        var list = [{...this.state.detailOptions}]
        list.pop()
        list.push(
            {
            name: "Food1",
            amount: 1
            }
        )
        list.push(
            {
            name: "Food2",
            amount: 0
            }
        )
        this.setState({detailOptions: list})
    }

    onClick = (num) => () => {
        this.setState({radio: num})
    }
    render() {
        let optionList = [];
        optionList = this.state.detailOptions;
        let optionListView = optionList.map((food) => {
            return (
                <>
                    <Row>
                        <Col xs= {4} md={5}>
                            <h6>{food.name}</h6>
                        </Col>
                        <Col xs={5} md={3}/>
                        <Col xs={2} md={4}>
                            <Form>
                                <Form.Check name="option" type={"radio"}id={"option"} onClick={this.onClick(optionList.indexOf(food))} checked={this.state.radio === optionList.indexOf(food) ? true : false}/>
                            </Form>
                        </Col>
                    </Row>
                </>
            )
        })

        return (
            <Modal size = "lg" aria-labelledby= "contained-modal-title-vcenter" centered show = {this.props.isShow} onHide = {this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Bayar pakai apa?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        {optionListView}
                </Modal.Body>
                <Modal.Footer/>
            </Modal>
        );
    }
}