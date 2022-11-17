import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function EventIndexItem({event}) {
  const dateVal = event.date;
  const dateObj = new Date(dateVal);
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
  const day = dateObj.getDay();
  const index = dateVal.indexOf('T');
  const date = dateVal.slice(0, index);
  
  return (
    <li className="event_index_list">
      <div className="flex-row">
        <div className="event_list_details">
          <h2>{event.name}</h2>
          <p>{event.location}</p>
          <p>{days[day]}, {date}</p>
          <p>{event.duration} minutes</p>
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