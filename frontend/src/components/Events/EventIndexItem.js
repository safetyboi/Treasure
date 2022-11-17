import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function EventIndexItem({event}) {
  // if (event) {
  //   console.log(event._id)
  // }

  return (
    <li className="event_index_list">
      <div className="flex-row">
        <div className="event_list_details">
          <h2>{event.name}</h2>
          <p>{event.location}</p>
          <p>{event.date}</p>
          <p>{event.duration}</p>
          <p>{event.price}</p>
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