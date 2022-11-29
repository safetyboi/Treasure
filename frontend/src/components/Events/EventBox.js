function EventBox ({ name, description, duration, distance, price, supplies}) {
    return (
        <>
      <div className="event">
        <div>{name ? `${name}` : ""}</div>
        <div>{description ? `${description}` : ""}</div>
        <div>{duration ? `${duration}` : ""}</div>
        <div>{distance ? `${distance}` : ""}</div>
        <div>{price ? `${price}` : ""}</div>
        <div>{supplies ? `${supplies}` : ""}</div>
      </div>
      </>
    );
  }
  
  export default EventBox;