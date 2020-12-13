import React from "react"
import { Row, Col, Button, ButtonGroup, Form } from "react-bootstrap"
import chevronImage from '../../Asset/Icon/chevron_right.png'
import removeIcon from '../../Asset/Icon/remove_icon.png'
import storeIcon from '../../Asset/Icon/store_icon.png'
import checklistIcon from '../../Asset/Icon/checklist_icon.png'
import frontIcon from '../../Asset/Icon/front_icon.png'
import imageSample from '../../Asset/Illustration/sample_food.jpg'
import { CartModal } from "../../Component/Modal/CartModal";

export class CartView extends React.Component {
    state = {
        showModal: false
    }

    handleDetail(data) {
        this.setState({showModal: true})
    }

    setModal(isShow) {
        this.setState({showModal: isShow})
    }

    handleDecrease(e) {

    }


    handleIncrease(e) {

    }
    
    render() {
        let modal;
        if(this.state.showModal === true) {
            modal = <CartModal isShow = {() => this.setModal(true)} onHide = {() => this.setModal(false)}/>
        } else {
            modal = <></> 
        }

        const itemList = []
        const itemListView =
        <>
            <Col xs={0} md={3}/>
            <Col xs={3} md={1}>
                <img src={imageSample} alt={"food"} className={"foodImage"}/>
            </Col>
            <Col>
                <Row>
                    <Col>
                        <p className = {"cartContentFood"}>Sayur Brokoli</p>
                        <p className = {"cartContentPrice"}>Rp60.000</p>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col>
                        <button className={"iconButton"}><img src= {removeIcon} alt={"remove icon"}/></button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ButtonGroup className={"cartModalButtonGroup"}>
                                <Button onClick={() => this.handleDecrease("")} variant= "cartModalMiniButton">-</Button>
                                <Form.Control value={0} className= "cartModalField" onKeyPress={() => this.handleChange("")} disabled></Form.Control>
                                <Button onClick={() => this.handleIncrease("")} variant= "cartModalMiniButton">+</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Col>
        </>

        return( 
            <>
                <Row>
                    <Col xs={0} md={3}/>
                    <Col>
                        <p className = {"cartTitle"}>Pilih cara makan anda</p>
                    </Col>
                    <Col xs={2} md ={3}>
                        <button className={"iconButton"}><img src= {chevronImage} onClick={() => this.handleDetail("a")} alt={"chevron right"}/></button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={0} md={3}/>
                    <Col>
                        <Row>
                            <Col>
                                <p className = {"cartTitle"}>Bayar pakai apa?</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className = {"cartContent"}>Cash</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2} md ={3}>
                        <button className={"iconButton"}><img src= {chevronImage} onClick={() => this.handleDetail("a")} alt={"chevron right"}/></button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={0} md={3}/>
                    <Col>
                        <p className= {"cartTitle"}>Kopi Mantap, Pacific Place</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={0} md={3}/>
                    <Col xs={1} md={1}>
                        <img src={storeIcon} className = {"cartIcon"} alt={"store icon"}/>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <p className= {"cartNote"}>Store Location</p>
                                <p className= {"cartTitle"}>
                                    Jalan Pakulonan Timur, Jonggol, 
                                    Jakarta Timur
                                </p>
                                <p className = {"cartNote"}><b>0.78km </b>(9 min)</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2} md ={3}>
                        <button className={"iconButton"}><img src= {chevronImage} onClick={() => this.handleDetail("a")} alt={"chevron right"}/></button>
                    </Col>
                </Row>
                <Row>
                    {itemListView}
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col xs={0} md={3}/>
                            <Col>
                                <p className= {"cartTitle"}>Rincian Pembayaran</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={0} md={3}/>
                            <Col>
                                <Row>
                                    <Col>
                                        <p className = {"cartContent"}>Total harga barang:</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className = {"cartContent"}>Diskon:</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <p className = {"cartContent"}>Rp60.000</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className = {"cartContent"}>Rp0</p>
                                    </Col>                                
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className={"cartPayment"}>
                        <Row>
                            <Col xs={1} md={3}/>
                            <Col>
                                <p className = {"cartTitle"}>Total Belanja Kamu</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1} md={3}/>
                            <Col>
                                <p className = {"cartFinalPrice"}>Rp60.000</p>
                            </Col> 
                            <Col className={"cartFinalButton"}>
                                <button className={"iconButton"}>
                                    <img src={checklistIcon} alt={"checklist"}/> Bayar <img src={frontIcon} alt={"checklist"}/>
                                </button>
                            </Col> 
                        </Row>
                    </Col>
                </Row>
                {modal}
            </>
        )
    }
}