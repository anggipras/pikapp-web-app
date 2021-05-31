import Axios from "axios";
import { address, clientId } from "../../Asset/Constant/APIConstant";
import { v4 as uuidV4 } from "uuid";

export const fetchMerchantDetail = async () => {
    const mid = "M00000008";
    let latitude = -6.28862
    let longitude = 106.71789
    let addressRoute = address + "home/v2/detail/merchant/" + longitude + "/" + latitude + "/"

    let uuid = uuidV4();
    uuid = uuid.replace(/-/g, "");
    const date = new Date().toISOString();

    return await Axios(addressRoute, {
        headers: {
            "Content-Type": "application/json",
            "x-request-id": uuid,
            "x-request-timestamp": date,
            "x-client-id": clientId,
            "token": "PUBLIC",
            "mid": mid,
        },
        method: "GET"
    })
}

export const handleAddCart = () => {
    var thecart = [
        {
            mid: "",
            storeName: "",
            storeDesc: "",
            storeDistance: "",
            food: [
                {
                    productId: "",
                    foodName: "",
                    foodPrice: 0,
                    foodAmount: 0,
                    foodImage: "",
                    foodNote: "",
                },
            ],
        },
    ];

    let currentMerchant = {
        "mid": "M00000008",
        "storeName": "Pikapp Store",
        "storeDesc": "Desc",
        "distance": "7.61 km",
        "storeImage": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/ropang-logo.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T094756Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210524%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=6da7fa4a2cace850a62fe7a2742d26c9ec5db240df7dee0fb8a89217d7c41595",
        "storeAdress": "Jl. Regensi Melati Mas F10/2",
        "storeRating": null,
        "storeLogo": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/ropang-logo.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T094756Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210524%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=6da7fa4a2cace850a62fe7a2742d26c9ec5db240df7dee0fb8a89217d7c41595"
    }

    let currentData = {
        "productId": "P00000026",
        "category": 4,
        "foodName": "Mie Ayam Yamin Jumbo Pangsit",
        "foodDesc": "Mie ukuran besar ditambah bumbu kecap dengan potongan daging ayam dan kriuk ayam yang renyah + pangsit kuah",
        "foodPrice": 30000,
        "foodRating": "0.0",
        "foodImage": "https://production-merchant.s3.ap-southeast-1.amazonaws.com/09-04-2021_10%3A30%3A01DSCF6013-2%202.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210524T091543Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=AKIAYBXTVRKM5MEIYZEG%2F20210524%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=636bc139a2f7f583738d963d4f4d9eac4a876cf0ba4c216234eb633e16f7e9ee",
        "foodExt": [
            {
                "name": "",
                "amount": 0
            }
        ]
    }

    let currentExt = {
        "detailCategory": [
            {
                "name": "",
                "amount": 1
            }
        ],
        "note": "",
        "foodCategory": "mie",
        "listcheckbox": [
            [
                {
                    "name": "Tambah Pangsit",
                    "price": 1000,
                    "isChecked": true
                }
            ],
            [
                {
                    "name": "Pake sambal",
                    "price": 0,
                    "isChecked": true
                }
            ],
            [
                {
                    "name": "tomat",
                    "price": 1000,
                    "isChecked": true
                }
            ]
        ],
        "listradio": [
            [
                {
                    "name": "kerupuk kulit",
                    "price": 0,
                    "isChecked": true
                }
            ]
        ]
    }

    let currentTotal = 32000
    let datamid = ""

    //mock function start

    var isStorePresent = false;
    let cart = thecart
    cart.forEach((data) => {
        if (data.mid === datamid) {
            isStorePresent = true;
        }
    });

    let duplicateProduct = []
    var isDuplicate = false;
    cart.forEach((data) => {
        if (data.mid === datamid) {
            data.food.forEach((food) => {
                if (food.productId === currentData) {
                    isDuplicate = true;
                    duplicateProduct.push(food)
                }
            });
        }
    });

    var isDuplicateSelection = false
    let indexOfspesificCart = 0 //get index of spesific cart product after break loop or match condition
    if (isStorePresent && isDuplicate) {
        let countAllSelection = 0
        let sizecartArr = 0 //size cart of spesific index
        let sizecurrentArr = 0 //size current selected menu

        //loop list checkbox from current menu selection
        currentExt.listcheckbox.forEach((currentfirstVal) => {
            currentfirstVal.forEach((currentnestedVal) => {
                if (currentnestedVal.name) {
                    sizecurrentArr += 1
                }
            })
        })

        //loop list radio from current menu selection
        currentExt.listradio.forEach((currentfirstVal) => {
            currentfirstVal.forEach((currentnestedVal) => {
                if (currentnestedVal.name) {
                    sizecurrentArr += 1
                }
            })
        })

        let boolSpesificInd = true //to break following loop
        duplicateProduct.forEach((menuProd, index) => {
            if (boolSpesificInd) {
                //loop list checkbox from cart
                menuProd.foodListCheckbox.forEach(firstVal => {
                    firstVal.forEach(nestedVal => {
                        if (nestedVal.name) {
                            sizecartArr += 1
                        }
                    })
                })

                //loop list radio from cart
                menuProd.foodListRadio.forEach(firstVal => {
                    firstVal.forEach(nestedVal => {
                        if (nestedVal.name) {
                            sizecartArr += 1
                        }
                    })
                })

                if (sizecartArr === sizecurrentArr) {
                    menuProd.foodListCheckbox.forEach((firstVal) => {
                        firstVal.forEach((nestedVal) => {

                            //loop listcheckbox from current advance selection to be match with added cart
                            currentExt.listcheckbox.forEach((currentfirstVal) => {
                                currentfirstVal.forEach((currentnestedVal) => {
                                    if (nestedVal.name === currentnestedVal.name) {
                                        countAllSelection += 1
                                    }
                                })
                            })
                        })
                    })

                    // loop radio from added cart
                    menuProd.foodListRadio.forEach((firstVal) => {
                        firstVal.forEach((nestedVal) => {

                            //loop radio from current advance selection to be match with added cart
                            currentExt.listradio.forEach((currentfirstVal) => {
                                currentfirstVal.forEach((currentnestedVal) => {
                                    if (nestedVal.name === currentnestedVal.name) {
                                        countAllSelection += 1
                                    }
                                })
                            })
                        })
                    })

                    if (sizecartArr === countAllSelection) {
                        if (menuProd.foodNote === currentExt.note) {
                            indexOfspesificCart = index
                            isDuplicateSelection = true
                            boolSpesificInd = false
                        } else {
                            sizecartArr = 0
                            countAllSelection = 0
                        }
                    } else {
                        sizecartArr = 0
                        countAllSelection = 0
                    }
                } else {
                    sizecartArr = 0
                }
            }
        })
    }

    if (isStorePresent === true) {
        console.log('in development');
    } else {
        cart.push({
            mid: mid,
            storeName: currentMerchant.storeName,
            storeDesc: currentMerchant.storeDesc,
            storeDistance: currentMerchant.distance,
            food: [
                {
                    productId: this.state.currentData.productId,
                    foodName: this.state.currentData.foodName,
                    foodPrice: this.state.currentData.foodPrice,
                    foodImage: this.state.currentData.foodImage,
                    foodCategory: currentExt.foodCategory,
                    foodAmount: currentExt.detailCategory[0].amount,
                    foodNote: currentExt.note,
                    foodListCheckbox: currentExt.listcheckbox,
                    foodListRadio: currentExt.listradio,
                    foodTotalPrice: currentTotal
                },
            ],
        });
    }

    return cart
}