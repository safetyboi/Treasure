function EventIndexItem({event}) {
  const {name, location, date, duration, price} = event;

  return (
    <li className="event_index_list flex-row">
      <div className="event_index_list_details">
        <h2>{name}</h2>
        <p>{location}</p>
        <p>{date}</p>
        <p>{duration}</p>
        <p>{price}</p>
      </div>
      <div className="event_index_list_img">
        <picture>
          <img src="" alt={`event_${name}`} />
        </picture>
      </div>
    </li>
  );
}

export default EventIndexItem;