import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import './NavBar.scss';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="links-nav flex-row">
          <Link to={'/events'}>All Events</Link>
          <Link to={'/profile'}>Profile</Link>
          <Link to={'/events/new'}>Create an Event</Link>
          <button onClick={logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (

        <div className="links-auth flex-row justify-evenly">
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
          <Link to="#">Demo</Link>
        </div>
      );
    }
  }

  return (
    <header className='flex-row justify-between align-center'>
      <Link to={'/'}><h1>Treasure</h1></Link>
      { getLinks() }
    </header>
  );
}

export default NavBar;