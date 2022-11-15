import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ManMap from '../../assets/images/ManMap.svg';

import './MainPage.scss';

function MainPage() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  return (
    <div className='hero_wrapper'>
      <section className='hero flex-row justify-center'>
        <div className='hero_title flex-col justify-evenly'>
          <h1>Create and organize your own scavenger hunt event.</h1>
          <p>Track the status of your joined event, create, and invite people, all in one app.</p>
          <div className='hero_button flex-row justify-center'>
            <Link to={'/signup'}><Button className='border-btn'>Sign up</Button></Link>
            <Link to={'/login'}><Button className='border-btn'>Log in</Button></Link>
            <Link to={'#'}><Button>Demo</Button></Link>
          </div>
        </div>
        <div className='hero_img flex-row justify-center'>
          <img src={ManMap} alt="Map illustration" />
        </div>
      </section>
    </div>
    
  );
}
  
  export default MainPage;