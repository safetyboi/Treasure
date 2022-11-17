import Button from 'react-bootstrap/Button';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfileEvent from './ProfileEvent';
import { useDispatch } from 'react-redux';
import Footer from '../NavBar/Footer';
import './Profile.scss'
import { useEffect } from 'react';
import { fetchUser } from '../../store/session';

function Profile() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  return (
    <section className='profile_page'>
      <div className="profile_wrapper flex-col">
        <h1 className='text-center'>Profile</h1>
        <div className="profile_content flex-row justify-between">
          <div className='flex-row align-center'>
            <div className="profile_details flex-row justify-center">
              <picture>
                <img src={user.image} alt='user_images' />
              </picture>
              <div className="user_details">
                <h2>{user.username}</h2>
                <h3>{user.email}</h3>
                <p className="join">Joined in {user.createdAt}</p>
                <p className='delete'>Delete profile</p>
              </div>
            </div>
            <div className="profile_link flex-col align-end">
              <Link to={'/events/new'}><Button>Create event</Button></Link>
              <Link to={'/events'}><Button>Find events to join</Button></Link>
            </div>
          </div>
        </div>
        <div className='border'></div>
        <ProfileEvent />
      </div>
      <Footer />
    </section>
  )
}

export default Profile;