import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../store/events';
import EventIndexItem from './EventIndexItem';
import './Event.scss';
import Footer from '../NavBar/Footer';

function EventIndex() {
  const events = useSelector(state => Object.values(state.events));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <section className='events_wrapper'>
      <div className='event_index_wrapper'>
        <h1>All Events</h1>
        <div className='event_index flex-row'>
          <div className='event_list_wrapper'>
            <ul className='event_list'>
              {events.map(event => (
                <EventIndexItem event={event} />
              ))}
            </ul>
          </div>
          <div id='event_map'>
            
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}

export default EventIndex;