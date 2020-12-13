import React from "react"
import { Col, Row, Image, Card, Tabs, Tab, Modal } from "react-bootstrap";
import { PikaButton } from "../../Component/Button/PikaButton";
import { PikaModal } from "../../Component/Modal/PikaModal";
import queryString from 'query-string'
import { withRouter } from 'react-router-dom';

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
        const value = queryString.parse(window.location.search);
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
        data.data.push(
            {
                category: "Category4",
                foodName: "Food Name B",
                foodDesc: "Food Desc B",
                foodPrice: "7000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )
        data.data.push(
            {
                category: "Category4",
                foodName: "Food Name C",
                foodDesc: "Food Desc C",
                foodPrice: "5000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )
        data.data.push(
            {
                category: "Category3",
                foodName: "Food Name D",
                foodDesc: "Food Desc D",
                foodPrice: "5000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )

        data.data.push(
            {
                category: "Category7",
                foodName: "Food Name B",
                foodDesc: "Food Desc B",
                foodPrice: "7000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )
        data.data.push(
            {
                category: "Category6",
                foodName: "Food Name C",
                foodDesc: "Food Desc C",
                foodPrice: "5000",
                foodImage: "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
            }
        )
        data.data.push(
            {
                category: "Category9",
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
    }

    setModal(isShow) {
        this.setState({showModal: isShow})
    }

    render() {
        let modal;
        if(this.state.showModal === true) {
            modal = <PikaModal isShow = {() => this.setModal(true)} onHide = {() => this.setModal(false)}/>
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
                                    <Col xs = {8} md = {6}>
                                        <Row>
                                            <Col xs ={7} md ={9}>
                                                <h5 className="foodTitle">{cardData.foodName}</h5>
                                                <p className ="foodDesc">
                                                    {cardData.foodDesc}
                                                </p>
                                                <div className = "foodButton">
                                                    <PikaButton title="Detail" buttonStyle ="cartPika" handleClick = {() => this.handleDetail(cardData)}/>
                                                </div>
                                            </Col>
                                            <Col xs = {5} md = {3}>
                                                <h6 className="foodPrice">Rp{cardData.foodPrice}</h6>
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
                                <h5 className = "foodHeader">{data.category}</h5>
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
                                    <Col xs = {8} md = {6}>
                                        <Row>
                                            <Col>
                                                <h5 className="foodTitle">{cardData.foodName}</h5>
                                                <p className ="foodDesc">
                                                    {cardData.foodDesc}
                                                </p>
                                                <PikaButton title="Detail" buttonStyle ="cartPika" handleClick = {() => this.handleDetail(cardData)}/>
                                            </Col>
                                            <Col xs = {5} md = {3}>
                                                <h6 className="foodPrice">Rp{cardData.foodPrice}</h6>
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
                                <h5 className = "foodHeader">{data.category}</h5>
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
                    <Col xs={4} md={2}>
                        <Image src="https://2.img-dpreview.com/files/p/E~TS590x0~articles/5081755051/0652566517.jpeg" roundedCircle className = "storeImage"/>
                    </Col>
                    <Col xs= {8} md= {4} className = "storeColumn">
                        <h2 className = "storeLabel" style = {{textAlign: "left"}}>{this.state.data.title}</h2>
                        <p className = "storeLabel" style = {{textAlign: "left"}}>{this.state.data.desc}</p>
                    </Col>
                    <Col />
                </Row>
                <Row/>
                <Row>
                    <Col md={12}>
                        <Tabs defaultActiveKey = "All Category" >
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