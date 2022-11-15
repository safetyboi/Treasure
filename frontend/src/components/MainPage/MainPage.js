import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import ManMap from '../../assets/images/ManMap.svg';

import './MainPage.scss';

function MainPage() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  return (
    <section className='hero flex-row'>
      <div className='hero_title flex-col justify-center'>
        <h1>Create and organize your own scavenger hunt event</h1>
        <p>Track the status of your joined event, create, and invite people, all in one app.</p>
        <div className='hero_button flex-row justify-center'>
          <Button onClik={handleShow}>Sign up</Button>
          <Button onClik={handleShow}>Log in</Button>
        </div>
      </div>
      <div className='hero_img flex-row justify-end'>
        <img src={ManMap} alt="Map illustration" />
      </div>
    </section>
  );
}
  
  export default MainPage;