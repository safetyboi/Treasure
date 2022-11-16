import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = useSelector(state => state.session.user);

  return (
    <section className="profile_wrapper">
      <div className="profile_content flex-row">
        <div className="profile_details">
          <picture>
            <img src='' alt='user_images' />
          </picture>
        </div>
        <div className="profile_button">
          <Link to={'/events/new'}>Create Event</Link>
          <Link to={'/events'}>Find events to join</Link>
        </div>
      </div>

      <div className="profile_event">

      </div>
    </section>

  )
}

export default Profile;