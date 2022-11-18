import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ManMap from '../../assets/images/ManMap.svg';
import { login, clearSessionErrors } from '../../store/session';
import { useDispatch } from 'react-redux';

import './MainPage.scss';
import Footer from '../NavBar/Footer';

function MainPage() {
  dispatch = useDispatch();
  return (
    <section className='main_page'>
      <div className='hero_wrapper'>
        <section className='hero flex-row justify-center'>
          <div className='hero_title flex-col justify-evenly'>
            <h1>Create and organize your own scavenger hunt event.</h1>
            <p>Track the status of your joined event, create, and invite people, all in one app.</p>
            <div className='hero_button flex-row justify-start'>
              <Link to={'/signup'}><Button className='border-btn'>Sign up</Button></Link>
              <Link to={'/login'}><Button className='border-btn'>Log in</Button></Link>
              <Link to={'/demo-lobby'}><Button className='demo-btn' onClick={dispatch(login({username: 'DemoUser', password: 'password'}))}>DEMO</Button></Link>
            </div>
          </div>
          <div className='hero_img flex-row justify-center'>
            <img src={ManMap} alt="Map illustration" />
          </div>
        </section>
      </div>
      <Footer />
    </section>
  );
}
  
  export default MainPage;