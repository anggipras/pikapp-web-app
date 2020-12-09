import React from "react"
import { Col, Row, Image, Card, Tabs, Tab, Modal } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import { PikaModal } from "../../Component/Modal/PikaModal";

export class ProductView extends React.Component {
    state = {
        showModal: false,
        data: {
            title: "",
            image: "",
            desc: "",
            data: [{
                category: "",
                foodName: "",
                foodDesc: "",
                foodPrice: "",
                foodImage: "",
            }],  
        },
    }

    componentDidMount() {
        var data = {...this.state.data}
        data.title = "Store Name"
        data.image = ""
        data.desc = "This is a store desc"
        data.data.pop()
        data.data.push( {
            category: "All Category",
            foodName: "",
            foodDesc: "",
            foodPrice: "",
            foodImage: ""
        })
        data.data.push(
            {
                category: "Category1",
                foodName: "Food Name A",
                foodDesc: "Food Desc A",
                foodPrice: "5000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )
        data.data.push(
            {
                category: "Category2",
                foodName: "Food Name B",
                foodDesc: "Food Desc B",
                foodPrice: "7000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )
        data.data.push(
            {
                category: "Category1",
                foodName: "Food Name C",
                foodDesc: "Food Desc C",
                foodPrice: "5000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )
        data.data.push(
            {
                category: "Category1",
                foodName: "Food Name D",
                foodDesc: "Food Desc D",
                foodPrice: "5000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )
        this.setState({data: data})
    }

    handleDetail(data) {
        this.setState({showModal: true})
        console.log(data)
    }

    setModal(isShow) {
        console.log(isShow)
        this.setState({showModal: isShow})
    }

    render() {
        let modal;
        if(this.state.showModal === true) {
            modal = <PikaModal title = {"ASD"} isShow = {() => this.setModal(true)} onHide = {() => this.setModal(false)}/>
        } else {
            modal = <></> 
        }
        const storeDatas = this.state.data.data.map((data) => {
            return data
        })

        let categories = []
        categories = storeDatas.filter(data => {
            if (!categories.includes(data.category)) {
                return categories.push(data.category)
            } else {
                return null
            }
        })

        const contentView = categories.map((data) => {
            if (data.category === "All Category") {
                var allCards = storeDatas.map((cardData) => {
                    if (cardData.category === "All Category") {
                        return null
                    } else {
                        return (
                            <Card>
                                <Row>
                                    <Col xs = {4} md = {3}>
                                        <Image src = {cardData.foodImage} rounded fluid className = "foodImage"/>
                                    </Col>
                                    <Col xs = {8} md = {7}>
                                        <Row>
                                            <Col>
                                                <h5 className="foodTitle">{cardData.foodName}</h5>
                                            </Col>
                                            <Col xs = {5} md = {2}>
                                                <h6 className="foodPrice">{cardData.foodPrice}</h6>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p className ="foodDesc">
                                                    {cardData.foodDesc}
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                            <PikaButton title="Detail" style="cartPika" handleClick = {() => this.handleDetail(cardData)}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        )
                    }
                })
                return (
                    <Tab eventKey = {data.category} title= {data.category}>
                        <Row>
                            <Col>
                                <h3 className = "foodHeader">{data.category}</h3>
                            </Col>
                        </Row>
                        {allCards}
                    </Tab>
                )
            } else {
                var cards = storeDatas.map((cardData) => {
                    if (data.category === cardData.category) {
                        return (
                            <Card>
                                <Row>
                                    <Col xs = {4} md = {3}>
                                        <Image src = {cardData.foodImage} rounded fluid className = "foodImage"/>
                                    </Col>
                                    <Col xs = {8} md = {7}>
                                        <Row>
                                            <Col>
                                                <h5 className="foodTitle">{cardData.foodName}</h5>
                                            </Col>
                                            <Col xs = {5} md = {2}>
                                                <h6 className="foodPrice">{cardData.foodPrice}</h6>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p className ="foodDesc">
                                                    {cardData.foodDesc}
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                            <PikaButton title="Detail" style="cartPika" handleClick = {() => this.handleDetail(cardData)}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        )
                    } else {
                        return null
                    }
                })
                return (
                    <Tab eventKey = {data.category} title= {data.category}>
                        <Row>
                            <Col>
                                <h3 className = "foodHeader">{data.category}</h3>
                            </Col>
                        </Row>
                        {cards}
                    </Tab>
                )
            }
        })
        return (
            <div>
                <Row>
                    <Col />
                    <Col xs= {6} md= {4} className = "storeColumn">
                        <Image src="https://2.img-dpreview.com/files/p/E~TS590x0~articles/5081755051/0652566517.jpeg" roundedCircle className = "storeImage"/>
                        <h2>{this.state.data.title}</h2>
                        <p>{this.state.data.desc}</p>
                    </Col>
                    <Col />
                </Row>
                <Row/>
                <Row>
                    <Col>
                        <Tabs defaultActiveKey = "All Category">
                            {contentView}
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                </Row>
                {modal}
            </div>
        );
    }
}