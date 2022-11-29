import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { login, clearSessionErrors } from '../../store/session';
import Button from 'react-bootstrap/Button';
import Footer from '../NavBar/Footer';
import ManMap from './ManMapImg';
import './MainPage.scss';

function MainPage() {
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => !!state.session.user);
  const demoLogin = ()=> {
    dispatch(login({email: 'demo@user.io', password: 'password'}))
  }

  const splashButtons = () => {
    if (loggedIn) {
      return (
        <div className='hero_button flex-row justify-start'>
          <Link to={'/demo-lobby'}><Button className='demo-btn' onClick={demoLogin}>DEMO</Button></Link>
        </div>
      )
      
    } else {
      return (
        <div className='hero_button flex-row justify-start'>
          <Link to={'/signup'}><Button className='border-btn'>Sign up</Button></Link>
          <Link to={'/login'}><Button className='border-btn'>Log in</Button></Link>
          <Link to={'/demo-lobby'}><Button className='demo-btn' onClick={demoLogin}>DEMO</Button></Link>
        </div>
      )
    }
  }

  return (
    <section className='main_page'>
      <div className='hero_wrapper'>
        <section className='hero flex-row justify-center'>
          <div className='hero_title flex-col justify-evenly'>
            <h1>Create and organize your own scavenger hunt event.</h1>
            <p>Track the status of your joined event, create, and invite people, all in one app.</p>
            {splashButtons()}
          </div>
          <ManMap />
        </section>
      </div>
      <Footer />
    </section>
  );
}
  
  export default MainPage;