import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function EventIndexItem({event}) {
  const dateObj = new Date(event.date);
  const dateStrg = String(dateObj)
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
  const day = dateObj.getDay();
  const index = dateStrg.indexOf('T');
  const dateDash = dateStrg.slice(0, index);
  const date = dateDash.split('-').join('/');
  const localTime = dateObj.toLocaleString('en-eg', {timeZone:"America/Los_Angeles"});
  const comaIdx = localTime.indexOf(' ');
  const hour = localTime.slice(comaIdx, comaIdx + 5);
  const ampm = localTime.slice(-2);
  const duration = Math.ceil(event.duration / 60);

  return (
    <li className="event_index_list">
      <div className="flex-row">
        <div className="event_list_details">
          <h2>{event.name}</h2>
          <p>{event.location}</p>
          <p>{days[day]}, {date}</p>
          <p>{hour} {ampm}</p>
          <p>{duration} {duration === 1 ? 'hour' : 'hours'}</p>
          <p>${event.price}</p>
        </div>
        <div className="event_list_img">
          <picture>
            <img src="" alt={`event_${event.name}`} />
          </picture>
        </div>
      </div>
      <Link to={`/events/${event._id}`}><Button>Check event</Button></Link>
    </li>
  );
}

export default EventIndexItem;