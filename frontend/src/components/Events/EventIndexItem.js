import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function EventIndexItem({event}) {
  const {id, name, location, date, duration, price} = event;

  return (
    <li className="event_index_list">
      <div className="flex-row">
        <div className="event_list_details">
          <h2>{name}</h2>
          <p>{location}</p>
          <p>{date}</p>
          <p>{duration}</p>
          <p>{price}</p>
        </div>
        <div className="event_list_img">
          <picture>
            <img src="" alt={`event_${name}`} />
          </picture>
        </div>
      </div>
      <Link to={`/events/${id}`}><Button>Check event</Button></Link>
    </li>
  );
}

export default EventIndexItem;