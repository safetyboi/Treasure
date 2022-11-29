import ProfileEventItem from './ProfileEventItem';
import './Profile.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUserEvents } from '../../store/events';
import { useParams } from 'react-router-dom';

function ProfileEvent() {
  const dispatch = useDispatch();
  const {userId} = useParams();
  const userEvents = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchUserEvents(userId));
  }, [dispatch, userId]);


  return (
    <div className='profile_event_wrapper'>
      <div className='event_wrapper'>
        <h2>Joined Events</h2>
        <div className='profile_event_list'>
          <ProfileEventItem />
        </div>
      </div>
      <div className='border'></div>
      <div className='event_wrapper'>
        <h2>Created events</h2>
        <p>No events created...yet!</p>
      </div>
    </div>
  );
}

export default ProfileEvent;