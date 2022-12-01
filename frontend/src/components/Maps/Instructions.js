import Step1 from "../../assets/images/step_1.png";
import Step2 from "../../assets/images/step_2.png";
import Step3 from "../../assets/images/step_3.png";
import Step4 from "../../assets/images/step_4.png";
import "./Instructions.scss";

const Instructions = () => {
  return (
    <div className="accordion flex-col justify-center">
        <div className="accordion_title">
          <h2 className="text-center">How to Plan An Event</h2>
        </div>
        <div className="accordion_body flex-row">
          <div className="step_card flex-col align-center">
            <span className="step_number fa-stack fa-2x">
              <i className="fa-solid fa-circle fa-stack-2x"></i>
              <i className="number fa-solid fa-stack-1x">1</i>
            </span>
            <div className="step_image">
              <img src={Step1} alt="step 1 how to plan" />
            </div>
            <div className="step_details">
              <h3>Click anywhere on the map to create an event pin</h3>
              <p>Enter pertinent data into the pin editor. It is automatically saved.</p>
            </div>
          </div>
          <div className="step_card flex-col align-center">
            <span className="step_number fa-stack fa-2x">
              <i className="fa-solid fa-circle fa-stack-2x"></i>
              <i className="number fa-solid fa-stack-1x">2</i>
            </span>
            <div className="step_image">
              <img src={Step2} alt="step 2 how to plan" />
            </div>
            <div className="step_details">
              <h3>Create as many event pins as you like</h3>
              <p>A route will automatically be drawn connecting them.</p>
            </div>
          </div>
          <div className="step_card flex-col align-center">
            <span className="step_number fa-stack fa-2x">
              <i className="fa-solid fa-circle fa-stack-2x"></i>
              <i className="number fa-solid fa-stack-1x">3</i>
            </span>
            <div className="step_image">
              <img src={Step3} alt="step 3 how to plan" />
            </div>
            <div className="step_details">
              <h3>Click any pin and the "Delete" button to remove it from your event</h3>
              <p>Pin will be deleted. General info about the event goes in the form on the left of the map.</p>
            </div>
          </div>
          <div className="step_card flex-col align-center">
            <span className="step_number fa-stack fa-2x">
              <i className="fa-solid fa-circle fa-stack-2x"></i>
              <i className="number fa-solid fa-stack-1x">4</i>
            </span>
            <div className="step_image">
              <img src={Step4} alt="step 4 how to plan" />
            </div>
            <div className="step_details">
              <h3>When your event looks good, click the submit button at the bottom</h3>
              <p>Your event will be submitted and saved.</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Instructions;