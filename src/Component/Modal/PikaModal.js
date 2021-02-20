import React from "react";
import { Row, Col, ButtonGroup, Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { PikaButton } from "../Button/PikaButton";

export class PikaModal extends React.Component {
  state = {
    detailCategory: [
      {
        name: "",
        amount: 1,
      },
    ],
    note: "",
  };

  componentDidMount() {
    var list = [{ ...this.state.detailCategory }];
    var datas = this.props.datas;
    list.pop();
    if(datas.foodExt !== undefined) {
      datas.foodExt.map((data) => {
        return list.push({
          name: data.name,
          amount: data.amount,
        });
      });
      this.setState({ detailCategory: list });
    }
  }

  handleDecrease(e) {
    let foodList = [];
    foodList = this.state.detailCategory;
    let updatedFoodlist = foodList.map((food) => {
      if (food === e && food.amount > 1) {
        food.amount = food.amount - 1;
      }
      return food;
    });
    this.setState({ detailCategory: updatedFoodlist });
  }

  handleIncrease(e) {
    let foodList = [];
    foodList = this.state.detailCategory;
    let updatedFoodlist = foodList.map((food) => {
      if (food === e) {
        food.amount = food.amount + 1;
      }
      return food;
    });
    this.setState({ detailCategory: updatedFoodlist });
  }

  handleNote = (e) => {
    this.setState({ note: e.target.value });
  };

  render() {
    let foodList = [];
    foodList = this.state.detailCategory;
    let data = this.state;
    this.props.handleData(data);
    let foodListView = foodList.map((food) => {
      if(food.name === "") {
        return (
          <>
            <Row>
              <Col xs={4} md={5}>
                <h6 className={"modalFoodName"}>Jumlah</h6>
              </Col>
              <Col xs={1} md={3} />
              <Col xs={6} md={4}>
                <ButtonGroup className={"modalButtonGroup"}>
                  <Button
                    onClick={() => this.handleDecrease(food)}
                    variant="modalMiniButton"
                  >
                    -
                  </Button>
                  <Form.Control
                    value={food.amount}
                    className="modalField"
                    disabled
                  ></Form.Control>
                  <Button
                    onClick={() => this.handleIncrease(food)}
                    variant="modalMiniButton"
                  >
                    +
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </>
        );
      } else {
        return (
          <>
            <Row>
              <Col xs={4} md={5}>
                <h6 className={"modalFoodName"}>{food.name}</h6>
              </Col>
              <Col xs={1} md={3} />
              <Col xs={6} md={4}>
                <ButtonGroup className={"modalButtonGroup"}>
                  <Button
                    onClick={() => this.handleDecrease(food)}
                    variant="modalMiniButton"
                  >
                    -
                  </Button>
                  <Form.Control
                    value={food.amount}
                    className="modalField"
                    disabled
                  ></Form.Control>
                  <Button
                    onClick={() => this.handleIncrease(food)}
                    variant="modalMiniButton"
                  >
                    +
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </>
        );
      }

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
          <Modal.Title>Detail Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {foodListView}
          <Row>
            <Col>
              <Form>
                <Form.Label className={"modalNoteLabel"}>Catatan</Form.Label>
                <Form.Control
                  placeholder={"Tambahkan catatanmu"}
                  className={"modalNote"}
                  fluid
                  onChange={this.handleNote}
                ></Form.Control>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col xs={1} md={2} />
            <Col xs={10} md={8}>
              <PikaButton
                title="Add to cart"
                buttonStyle="modalPika"
                handleClick={this.props.handleClick}
              />
            </Col>
            <Col xs={1} md={2} />
          </Row>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    );
  }
}
