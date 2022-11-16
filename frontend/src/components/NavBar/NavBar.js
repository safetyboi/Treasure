import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import './NavBar.scss';

function NavBar () {
  const dispatch = useDispatch(); 
  const loggedIn = useSelector(state => !!state.session.user);
  const history = useHistory();
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
      history.push('/');
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="links-nav flex-row justify-end align-center">
          <Link to={'/events'}>All Events</Link>
          <Link to={'/profile'}>Profile</Link>
          <Link to={'/events/new'}>Create Event</Link>
          <button onClick={logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div className="links-auth flex-row justify-evenly align-center">
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
          <Link to="#" className='demo-btn'>DEMO</Link>
        </div>
      );
    }
  }

  return (
    <>
      <div className='spacer layer'></div>
      <header className='flex-row justify-between align-center'>
        <Link to={'/'}><h1>Treasure</h1></Link>
        { getLinks() }
      </header>
    </>
    
  );
}

export default NavBar;