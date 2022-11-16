import './Profile.scss'
import ProfileEventItem from './ProfileEventItem';

function ProfileEvent() {
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