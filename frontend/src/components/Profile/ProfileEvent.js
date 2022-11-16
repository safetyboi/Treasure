import './Profile.scss'

const ProfileEvent = () => {
  return (
    <div className='profile_event_wrapper flex-row'>
      <div className='joined_event_wrapper flex-col'>
        <h2>Joined Events</h2>
      </div>
      <div className='border'></div>
      <div className='created_event_wrapper flex-col'>
        <h2>Created events</h2>
      </div>
    </div>
  );
}

export default ProfileEvent;