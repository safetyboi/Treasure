import './Profile.scss'

function ProfileEventItem() {
  
  return (
    <div className='profile_event_item flex-row justify-between'>
      <picture>
        <img src="" alt="event_image" />
      </picture>
      <div className='profile_event_details'>
        <h3>Gem Hunt</h3>
        <p>Golden Gate Park</p>
        <p>Saturday, 11/19/2022</p>
        <p>09.00 AM</p>
      </div>
      <div className='profile_event_status'>
        <span>SOON</span>
      </div>
    </div>
  )
}

export default ProfileEventItem;