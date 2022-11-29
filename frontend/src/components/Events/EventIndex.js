import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, loadEvents } from '../../store/events';
import EventIndexItem from './EventIndexItem';
import Footer from '../NavBar/Footer';
import EventIndexMapWrapper from './EventIndexMap';
import './Event.scss';

function EventIndex() {
  const dispatch = useDispatch();
  let events = useSelector(loadEvents);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (!events) return null;

  return (
    <section className='events_page'>
      <div className='event_index_wrapper flex-col align-center'>
        <h1>All Events</h1>
        <div className='event_index flex-row justify-between'>
          <div className='event_list_wrapper'>
            <ul className='event_list'>
              {events.map(event => (
                <EventIndexItem key={event._id} event={event} />
              ))}
              {}
            </ul>
          </div>
          <div id='event_map'>
            <EventIndexMapWrapper/>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}

export default EventIndex;