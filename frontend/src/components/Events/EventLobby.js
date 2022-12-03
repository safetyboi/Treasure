import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteEvent, fetchEvent, loadEvent } from "../../store/events";
import { Modal, Button, CloseButton } from "react-bootstrap";
import Footer from '../NavBar/Footer';
import defaultImage from '../../assets/images/defaultImage.svg';
import EventShowMapWrapper from "../Maps/EventShowMap";

const EventLobby = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {eventId} = useParams();
  const event = useSelector(loadEvent(eventId));
  const user = useSelector(state => state.session.user);
  const [show, setShow] = useState(false);

  // Date time object
  const dateObj = new Date(event?.date);
  const dateStrg = String(dateObj)
  const localTime = dateObj.toLocaleString('en-eg', {timeZone:"America/Los_Angeles"});
  const comaIdx = localTime.indexOf(',');
  const colonIdx = localTime.indexOf(':');
  const date = localTime.slice(0, comaIdx);
  const day = dateStrg.slice(0, 3);
  const hourLen = colonIdx - comaIdx;
  const hour = hourLen === 3 ? localTime.slice(comaIdx + 2, comaIdx + 6) : localTime.slice(comaIdx + 2, comaIdx + 7);
  const ampm = localTime.slice(-2);
  const duration = Math.ceil(event?.duration / 60);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    dispatch(fetchEvent(eventId))
  }, [dispatch, eventId]);

  const openOnlineGame = (e) => {
    e.preventDefault();
    history.push(`/events/${eventId}/online-game`)
  }

  const openUpdateEvent = (e) => {
    e.preventDefault();
    if (eventId === '638a9e6fcbf4f1662f53440a') {
      alert(`The precious demo event may not be manipulated.`)
    } else {  
      history.push(`/events/${eventId}/update-event`)
    }
  }

  const redirectEvent = () => {
    history.push(`/events/`)
  }

  const openLiveGame = (e) => {
    e.preventDefault();
    history.push(`/events/${eventId}/live-game`)
  }

  const eventImg = () => {
    if (event) {
      // if (!event.image) {
      //   return <img src={defaultImage} alt={`event_${event.name}`} className="default_img" />
      // }
  
      return <img src={event.image} alt={`${event.name}_image`}/>

    }
  }

  const updateDeleteEvent = () => {
    if (event && user._id === event.creator._id) {
      return (
        <>
          <Button onClick={openUpdateEvent}>Update Event</Button>
          <Button onClick={
            
            () => {
              if (eventId === '638a9e6fcbf4f1662f53440a') {
                alert(`The precious demo event may not be deleted.`)
              } else {  
                if (window.confirm("Are you sure? Deleting an event is irreversible.")) {
                  dispatch(deleteEvent(eventId));
                  redirectEvent();
                };
                }
          
            }}>
            Delete Event
          </Button>
        </>
      )
    }
  }

  return (
    <section className="event_lobby_page">
      <div className="event_lobby_wrapper">
        <div className="event_img flex-row justify-center">
          <EventShowMapWrapper />
        </div>
        <div className="event_details_wrapper flex-row justify-between">
          <div className="event_details">
            <div className="event_header flex-row align-center">
              {eventImg()}
              <div className="event_preview">
                <h1>{event?.name}</h1>
                <p>By <span>{event?.creator?.username}</span></p>
                <p><i className="fa-solid fa-dollar-sign"></i>{event?.price} USD</p>
              </div>
            </div>
            <div className="event_description">
              <p>{event?.description}</p>
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
                  <p>{event?.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="event_buttons flex-col align-center">
            <Button onClick={openOnlineGame}>Play Online Game</Button>
            <Button onClick={handleShow}>Join the event</Button>
            {updateDeleteEvent()}
            {/* <Button onClick={openLiveGame}>Play Live Game</Button> */}
          </div>
        </div>
      </div>

      <Footer />

      <Modal show={show} 
        onHide={handleClose}
        className="event_modal">
        <Modal.Header closeButton>
          <Modal.Title>Thanks for checking our app!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Want to know more about our projects?
          You can browse around this app, check our portfolios, or shoot us a message.
          We'd love to hear from you and collaborate to create something awesome.
        </Modal.Body>
        <Modal.Footer className="flex-row">
          <Link to='/about'><Button>About Us</Button></Link>
          <Link to="#"
            className="modal_email flex-row align-center"
            onClick={e => {
              e.preventDefault();
              window.location = 'mailto:treasure.mern.team@gmail.com';
            }}>
            Email Us
          </Link>
        </Modal.Footer>
      </Modal>
    </section>
  )
};

export default EventLobby;