import React, {useState} from "react";
import Tour from 'reactour';
import Button from "react-bootstrap/Button";
import '../../Asset/scss/TourPage.scss';

// const tour_steps = [
//     {
//         selector: '.merchantList-layout',
//         content: 'This is my first Step'
//     }
// ];

const TourPage = (props) => {
    // const [isTourOpen, setIsTourOpen] = useState(false);
    const tour_steps = props.stepsContent;
    const isTourOpen = props.isShowTour;
    const isTourClose = props.isHideTour;

    return (
        <>
            <Tour
                steps={tour_steps}
                isOpen={isTourOpen}
                onRequestClose={isTourClose}
                showNumber={false}
                rounded={10}
                nextButton={<Button style={{ backgroundColor: "#4056C6" }}>Selanjutnya</Button>}
                prevButton={<Button style={{ backgroundColor: "#4056C6" }} onClick={isTourClose}>Lewati</Button>}
                lastStepNextButton={<Button style={{ backgroundColor: "#4056C6" }}>Selesai</Button>}
                onAfterOpen={target => (document.body.style.overflowY = 'hidden')}
                onBeforeClose={target => (document.body.style.overflowY = 'auto')}
                className={"tourpage"}
            />
        </>
      );
    };
    
export default TourPage;
