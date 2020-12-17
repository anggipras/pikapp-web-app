import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { PikaButton } from "../Button/PikaButton";
import dineinIcon from "../../Asset/Icon/dinein_icon.png";
import takeawayIcon from "../../Asset/Icon/takeaway_icon.png";

export class CartModal extends React.Component {
  state = {
    radio: 0,
  };

  onClick = (num) => () => {
    this.setState({ radio: num });
  };
  render() {
    let optionList = [];
    optionList = this.props.detailOptions;
    let optionListView = optionList.map((data) => {
      let image;
      if (data.image === "dineIn") {
        image = dineinIcon;
      } else if (data.image === "takeaway") {
        image = takeawayIcon;
      }
      return (
        <>
          <Row>
            <Col xs={8} md={5}>
              <img src={image} class="cartModalImage" alt="icon" />

              <span class="cartModalOption">{data.option}</span>
            </Col>
            <Col xs={1} md={3} />
            <Col xs={2} md={4}>
              <Form>
                <Form.Check
                  name="option"
                  type={"radio"}
                  id={"option"}
                  onClick={this.onClick(optionList.indexOf(data))}
                  checked={
                    this.state.radio === optionList.indexOf(data) ? true : false
                  }
                />
              </Form>
            </Col>
          </Row>
        </>
      );
    });

    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.isShow}
        onHide={this.props.onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{optionListView}</Modal.Body>
        <Modal.Footer />
      </Modal>
    );
  }
}
