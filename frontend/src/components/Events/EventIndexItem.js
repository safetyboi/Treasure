import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import defaultImage from '../../assets/images/defaultImage.svg';

function EventIndexItem({event}) {
  const dateObj = new Date(event.date);
  const dateStrg = String(dateObj)
  const day = dateStrg.slice(0, 3);
  const date = dateStrg.slice(4, 15);
  const localTime = dateObj.toLocaleString('en-eg', {timeZone:"America/Los_Angeles"});
  const comaIdx = localTime.indexOf(' ');
  const hour = localTime.slice(comaIdx, comaIdx + 6);
  const ampm = localTime.slice(-2);
  const duration = Math.ceil(event.duration / 60);
  
  const eventImg = () => {
    if (!event.image) {
      return <img src={defaultImage} alt={`event_${event.name}`} className="default_img" />
    }

    return <img src={event.image} alt={`event_${event.name}`} className='event-image' />
  };

  return (
    <li className="event_index_list">
      <div className="flex-row">
        <div className="event_list_details">
          <h2>{event.name}</h2>
          <p>{event.location}</p>
          <p>{day}, {date}</p>
          <p>{hour} {ampm}</p>
          <p>{duration} {duration === 1 ? 'hour' : 'hours'}</p>
          <p>${event.price}</p>
        </div>
        <div className="event_list_img">
          <picture>
            {/* <img className='thumb-image' src={eventImg()} 
              alt={`event_${event.name}`} 
              onError={e => {
                e.target.src={defaultImage}
                e.onerror=null}}
            /> */}
            {eventImg()}
          </picture>
        </div>
      </div>
      <Link to={`/events/${event._id}`}><Button>Check event</Button></Link>
    </li>
  );
}

export default EventIndexItem;