import { Link } from 'react-router-dom';
import Footer from '../NavBar/Footer';
import './About.scss';
import AWS from '../../assets/images/aws.svg';
import Bootstrap from '../../assets/images/bootstrap.svg';
import CSS3 from '../../assets/images/css3.svg';
import Express from '../../assets/images/express_js.svg';
import Git from '../../assets/images/git.svg';
import Github from '../../assets/images/github.svg';
import GoogleMaps from '../../assets/images/google_maps_api.svg';
import HTML5 from '../../assets/images/html_5.svg';
import Javascript from '../../assets/images/javascript.svg';
import Node from '../../assets/images/node_js.svg';
import Redux from '../../assets/images/redux.svg';
import SASS from '../../assets/images/sass.svg';
import VisualStudio from '../../assets/images/visual_studio.svg';
import Webpack from '../../assets/images/webpack.svg';
import MongoDB from '../../assets/images/mongodb.svg';
import React from '../../assets/images/react.svg';
import Dan from '../../assets/images/dan_culbertson.jpeg';
import Moses from '../../assets/images/michael_moses.jpg';
import Vince from '../../assets/images/vince_memmo.JPG';
import Fifi from '../../assets/images/safitri_shelton.jpg';


const About = () => {
  return (
    <section className="about_page flex-col align-center">
      <div className="about_project flex-row align-center justify-between">
        <div className="about_title">
          <h1>About This Project</h1>
          <div className="tech_icons_wrapper">
            <h2>Technologies Used</h2>
            <div className="tech_icons flex-row">
              <img src={MongoDB} alt="MongoDB_icon" />
              <img src={Express} alt="Express_icon" />
              <img src={React} alt="React_icon" />
              <img src={Node} alt="Node_icon" />
              <img src={Javascript} alt="Javascript_icon" />
              <img src={Redux} alt="Redux_icon" />
              <img src={HTML5} alt="HTML5_icon" />
              <img src={CSS3} alt="CSS3_icon" />
              <img src={SASS} alt="SASS_icon" />
              <img src={Git} alt="Git_icon" />
              <img src={Github} alt="Github_icon" />
              <img src={AWS} alt="AWS_icon" />
              <img src={GoogleMaps} alt="GoogleMaps_icon" />
              <img src={Webpack} alt="Webpack_icon" />
              <img src={Bootstrap} alt="Bootstrap_icon" />
              <img src={VisualStudio} alt="VisualStudio_icon" />
            </div>
          </div>
        </div>
        <div className="about_content">
          <p>Treasure is a a MERN-stack web application which enables users to create, share and participate in digitally-enhanced scavenger hunts. 
            The web app helps in the planning and creation of events, the distribution and organization of event information, and the tracking of participant's location and game status as they proceed along the game course. 
          </p>
          <p>
            It leverages GPS location fetches, an intricate backend data structure, and a user-friendly interface to take the difficulty out of the planning and participation. 
            Easily construct a connected set of event points on the map, create and trigger event clues upon participants' arrival, organize the needed supplies and costs, and share your event with the public or your community. During the event, track participants' locations and which events they have completed and automatically share with them important information at appropriate times.
          </p>
        </div>
      </div>

      <div className='about_project flex-col align-center'>
        <h1>Meet Our Team</h1>
        <div className="flex-row">
          <div className='member_details flex-col align-center'>
            <img src={Dan} alt="Dan_picture" />
            <p>Dan Culbertson</p>
            <div className='member_links flex-row'>
              <Link to={{ pathname: "https://github.com/safetyboi" }} target="_blank">
                <i className="fa-brands fa-github"></i>
              </Link>
              <Link to={{ pathname: "https://www.linkedin.com/in/daniel-culbertson-23bb757b/" }} target="_blank">
                <i className="fa-brands fa-linkedin"></i>
              </Link>
              <Link to="#"
                className="modal_email flex-row align-center"
                onClick={e => {
                  e.preventDefault();
                  window.location = 'mailto:daniel.j.culbertson@gmail.com';}}>
                <i class="fa-solid fa-envelope"></i>
              </Link>
            </div>
          </div>
          <div className='member_details flex-col align-center'>
            <img src={Moses} alt="moses_picture" />
            <p>Michael Moses</p>
            <div className='member_links flex-row'>
              <Link to={{ pathname: "https://github.com/mmoses1127" }} target="_blank">
                <i className="fa-brands fa-github"></i>
              </Link>
              <Link to={{ pathname: "https://www.linkedin.com/in/michael-moses-8786b615/" }} target="_blank">
                <i className="fa-brands fa-linkedin"></i>
              </Link>
              <Link to="#"
                className="modal_email flex-row align-center"
                onClick={e => {
                  e.preventDefault();
                  window.location = 'mailto:MMoses1127@gmail.com';}}>
                <i class="fa-solid fa-envelope"></i>
              </Link>
            </div>
          </div>
          <div className='member_details flex-col align-center'>
            <img src={Fifi} alt="fifi_picture" />
            <p>Safitri Shelton</p>
            <div className='member_links flex-row'>
              <Link to={{ pathname: "https://github.com/fee3fitri" }} target="_blank">
                <i className="fa-brands fa-github"></i>
              </Link>
              <Link to={{ pathname: "https://www.linkedin.com/in/safitri-shelton/" }} target="_blank">
                <i className="fa-brands fa-linkedin"></i>
              </Link>
              <Link to="#"
                className="modal_email flex-row align-center"
                onClick={e => {
                  e.preventDefault();
                  window.location = 'mailto:safitri.shelton@gmail.com';}}>
                <i class="fa-solid fa-envelope"></i>
              </Link>
            </div>
          </div>
          <div className='member_details flex-col align-center'>
            <img src={Vince} alt="vince_picture" />
            <p>Vince Memmo</p>
            <div className='member_links flex-row'>
              <Link to={{ pathname: "https://github.com/vince-memmo" }} target="_blank">
                <i className="fa-brands fa-github"></i>
              </Link>
              <Link to={{ pathname: "https://www.linkedin.com/in/vince-memmo-394247105/" }} target="_blank">
                <i className="fa-brands fa-linkedin"></i>
              </Link>
              <Link to="#"
                className="modal_email flex-row align-center"
                onClick={e => {
                  e.preventDefault();
                  window.location = 'mailto:MMoses1127@gmail.com';}}>
                <i class="fa-solid fa-envelope"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}

export default About;