
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchEvent, loadEvent } from "../../store/events";
import { Button } from "react-bootstrap";
import Footer from '../NavBar/Footer';
import PlayGame from '../../assets/images/PlayGame.svg';
import defaultImage from '../../assets/images/defaultImage.svg'

const EventLobby = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {eventId} = useParams();
  const event = useSelector(loadEvent(eventId));

  const dateObj = new Date(event.date);
  const dateStrg = String(dateObj)
  const day = dateStrg.slice(0, 3);
  const date = dateStrg.slice(4, 15);
  const localTime = dateObj.toLocaleString('en-eg', {timeZone:"America/Los_Angeles"});
  const comaIdx = localTime.indexOf(' ');
  const colonIdx = localTime.indexOf(':');
  const hour = colonIdx === 13 ? localTime.slice(comaIdx, comaIdx + 5) : localTime.slice(comaIdx, comaIdx + 6);
  const ampm = localTime.slice(-2);
  const duration = Math.ceil(event.duration / 60);

  useEffect(() => {
    dispatch(fetchEvent(eventId))
  }, [dispatch, eventId]);

  const openOnlineGame = (e) => {
    e.preventDefault();
    history.push(`/events/${eventId}/online-game`)
  }

  const openLiveGame = (e) => {
    e.preventDefault();
    history.push(`/events/${eventId}/live-game`)
  }

  return (
    <section className="event_lobby_page">
      <div className="event_lobby_wrapper">
        <div className="event_img flex-row justify-center">
          <img src={event.image} alt={`${event.name}_image`}/>
        </div>
        <div className="event_details_wrapper flex-row justify-between">
          <div className="event_details">
            <div className="event_preview">
              <h1>{event.name}</h1>
              <p>By <span>{!event.creator.username ? null : event.creator.username}</span></p>
              <p><i className="fa-solid fa-dollar-sign"></i>{event.price} USD</p>
            </div>
            <div className="event_description">
              <p>{event.description}</p>
            </div>
            <div className="time_location">
              <h2>When and Where</h2>
              <div className="flex-row justify-between">
                <div className="time_duration">
                  <div className="time flex-row">
                    <i className="fa-solid fa-calendar-days"></i>
                    <div className="time_details">
                      <p>{day}, {date}</p>
                      <p>{hour} {ampm}</p>
                    </div>
                  </div>
                  <div className="duration flex-row">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <p>{duration} hours</p>
                  </div>
                </div>
                <div className="divider"></div>
                <div className="location flex-row">
                  <i className="fa-solid fa-location-dot"></i>
                  <p>{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="event_buttons flex-col align-center">
            {/* <img src={PlayGame} alt="play game" /> */}
            <Button onClick={openOnlineGame}>Play Online Game</Button>
            <Button>Join the event</Button>
            {/* <Button onClick={openLiveGame}>Play Live Game</Button> */}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  )
};

export default EventLobby;