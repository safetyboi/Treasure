import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'; 
import { clearEventErrors, createEvent } from '../../store/events';
import { Modal } from 'react-bootstrap';
import { PinBox } from './PinBox'
import EventBox from './EventBox';
import * as pinReducerActions from '../../store/pins'
import * as eventReducerActions from '../../store/events';
import jwtFetch from '../../store/jwt';
import './Event.scss'
import { useRef } from 'react';


function EventCreate ({pins, mapData}) {
    let newEvent;
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [description, setDescription] = useState('');
    // const [duration, setDuration] = useState(0);
    // const [distance, setDistance] = useState(0);
    // const [price, setPrice] = useState(0);
    // const [supplies, setSupplies] = useState('');
    // const [elevation, setElevation] = useState(0);
    const [date, setDate] = useState('');
    const dateRef = useRef(date);
    const [time, setTime] = useState('');
    // const [location, setLocation] = useState('');
    const dispatch = useDispatch();
    const errors = useSelector(state => state.errors.events);
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('')
  

    const _setDate = (value) => {
      dateRef.current = value;
      setDate(value);
    }

    console.log(date);
    const localTime = time >= 13 ? time - 12 : time;
    
    const modalTime = () => {
      if (time >= 13) {
        return `${localTime} PM`
      }
      return `${localTime} AM`
    }

    const handleShow = () => setShow(true);
    const handleClose = () => {
      setShow(false);
      //Redirect to "/" or eventually the eventShow for newlycreated Event:
      // <Redirect to="/"/>
      history.push(`/events`);
    };
  
    useEffect(() => {
      return () => dispatch(clearEventErrors());
    }, [dispatch]);

    const updateImage = async (e) => {
      setImageFile(e.target.files[0])
      if (e.target.files[0]) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => {
          setPhotoUrl(fileReader.result);
        };
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const dateTime = dateRef.current + 'T' + time + '-08:00';
      debugger;
    if (name.length === 0) {
      alert('Event must contain a name')
      return;
    }

    if (description.length === 0) {
      alert('Event must contain a description')
      return;
    }

    if (pins.length === 0) {
      alert('Event must contain at least one pin! (click anywhere on the map to add your first pin)')
      return;
    }

    if (imageFile) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(imageFile.name)) {
        alert('Invalid file type, please upload a .jpeg, .jpg, or, .png');
        return;
      }
    }

      const formData = new FormData();
      
      formData.append("images", imageFile);
      let errorPins = [];

      const eventDurationSum = () => {
        let duration = 0;
        pins.forEach(pin => {
          duration += pin.duration
        });
        return duration;
      }

      pins.forEach(pin=> {
        if (!pin.directionToPin.text) {
          errorPins.push(pin.order)
        }
      });

      if (errorPins.length > 1) {
        alert(`Directions to pins ${errorPins.map(num => ' ' + String(num))} are required!`);
        return;
      }

      if (errorPins.length === 1) {
        alert(`Directions to pin ${errorPins.map(num => String(num))} is required!`);
        return;
      }

      const firstPin = pins.filter(pin => {
        return pin.order === 1
      })[0]

      const geocoder = new window.google.maps.Geocoder();

      let address = await geocoder.geocode({location: firstPin.location});
      if (address.results[0]) {
        address = address.results[0].formatted_address;
      } else {
        address = "Location Unavailable"
      };

      
      newEvent = {
        name: name,
        description: description,
        duration: (mapData.duration + eventDurationSum()),
        distance: mapData.distance,
        price: totalPrice(), 
        supplies: totalSupplies(),
        elevation: mapData.elevation,
        date: dateTime,
        status: false,
        initCoords: firstPin.location,
        location: address
      }
      
      let eventExists = await dispatch(eventReducerActions.createEvent(newEvent));
      
      if (eventExists) { 
        await jwtFetch(`/api/events/addImage/${eventExists._id}`, {
          method: "PATCH",
          body: formData,
        })
      }
      
      if (eventExists) {
        // before we dispatch the createPin thunk, we need to add the event's id to the pin:
        // we theoretically have this information in the state, or will, if the event is successfully created
        const mappedPins = pins.map(pin=> { //is pins an array or an object holding an array? I don't know if '.map' is smart enough by itself to handle an object
          return {...pin, event: eventExists._id}
        })
        mappedPins.forEach(pin=> {
          dispatch(pinReducerActions.createPin(pin))
          })
      }

      handleShow();
    };
  
    const updateName = e => setName(e.currentTarget.value);
    const updateDescription = e => setDescription(e.currentTarget.value);
    // const updateDuration = e => setDuration(e.currentTarget.value);
    // const updateDistance = e => setDistance(e.currentTarget.value);
    // const updatePrice = e => setPrice(e.currentTarget.value);
    // const updateSupplies = e => setSupplies(e.currentTarget.value);
    // const updateElevation = e => setElevation(e.currentTarget.value);
    const updateDate = e => _setDate(e.currentTarget.value);
    const updateTime = e => setTime(e.currentTarget.value);
    // const updateLocation = e => setLocation(e.currentTarget.value);

    const displayPins = ()=> {
        if (pins?.length) {
        return (
          <ul className='pin_box'>
            {pins.map(pin=>{
              return (
              <li>
                <PinBox pin={pin}/>
              </li>
              )
            })}
            </ul>
        )
        } 
    }

    const totalPrice = () => {
        let total = 0;
        pins.forEach(pin=> {
          total += pin.price;
        })
        return total || 0;
    }

    const totalSupplies = () => {
      let total = ""
      pins.forEach(pin=> {
        if (pin.supplies.length > 0) return total += `${pin.supplies}, `;
      })
      return total.slice(0, -2);
    }

    const totalDuration = () => {
      let total = mapData.duration;
      pins.forEach(pin=> {
        return total += pin.duration;
      })
      return total;
    }

    const previewTitle = photoUrl ? <h3 className='preview-title'> Image preview</h3> : null;
    const preview = photoUrl ? <img className='preview-image' src={photoUrl} alt="" /> : null;
    return (
      <section className="create_event_page">
        <div className='form_area'>
          <form className="create_event" onSubmit={handleSubmit}>
            <h2>Event Details</h2> 
            <div className='border'></div>
            <label>Event Name
              <input 
                  type="text"
                  value={name}
                  onChange={updateName}
                  placeholder="What's in a name?"
                />
            </label>
            <div className='date_time_form flex-row justify-between'>
              <label>Date
                <input 
                type="date" //what type?
                value={date}
                onChange={updateDate}
                />
              </label>
              <label>Time
                <input
                type="time" //what type?
                value={time}
                onChange={updateTime}
                />
              </label>
            </div>
            {/* <label>Location
              <input
              type="text"
              value={location}
              onChange={updateLocation}
              />
            </label> */}
            <div className='textarea'>
              <label> Description</label>
              <textarea 
                value={description}
                onChange={updateDescription}
                className="textarea"
                placeholder="Include a description...">
              </textarea>
            </div>
            <div className='textarea'>
              <label> Supplies List</label>
              <textarea 
                disabled
                className="textarea"
                value={totalSupplies()}>
              </textarea> 
            </div>
            
            <label>Estimated Supplies Cost
              <input 
                disabled
                type="number" //are numbers allowed?
                value={totalPrice()} //helper function
              />            
            </label>

            <div className="errors">{errors && errors.text}</div>
            <input type="file" onChange={updateImage} />
            {previewTitle}
            {preview}
            <button>Submit</button>
          </form>
          {/* <div>{displayPins()}</div> */}

          {/* <label>Estimated Event Duration
              <input 
              disabled
                type="number" //can you do 'number'?
                value={totalDuration()} //this will get passed down as a key on 'pins' prop
                placeholder="Apx how long should attendees expect this event to run?"
              />
              </label>      
            <label>Estimated Walking Duration
              <input 
              disabled
                type="number" //can you do 'number'?
                value={mapData.duration} //this will get passed down as a key on 'pins' prop
                placeholder="Apx how long should attendees expect this event to run?"
              />
              </label>          
            <label>Total Distance
              <input 
              disabled
                type="text"
                value={mapData.distance} //this will get passed down as a key on 'pins' prop
                placeholder="Let them know how much ground they'll be covering"
              />
              </label>
            <label> Total Elevation Gain
              <input 
                disabled
                type="number"
                value={mapData.elevation} //helper function            
              />
            </label> */}
        </div>

        <div className='map_stat_wrapper'>
          <div className='flex-row'>
            <p className='stat_key'>Estimated Event Duration</p>
            <p className='stat_value'>{Math.round(totalDuration())} minutes</p>
          </div>
          <div className='flex-row'>
            <p className='stat_key'>Estimated Walking Duration</p>
            <p className='stat_value'>{Math.round(mapData.duration)} minutes</p>
          </div>
          <div className='flex-row'>
            <p className='stat_key'>Total Distance</p>
            <p className='stat_value'>{mapData.distance} kilometers</p>
          </div>
          <div className='flex-row'>
            <p className='stat_key'>Total Elevation Gain</p>
            <p className='stat_value'>{Math.round(mapData.elevation)} meters</p>
          </div>
        </div>

        <Modal show={show}
          onHide={handleClose}
          className="event_modal">
          <Modal.Header closeButton>
            <Modal.Title>Awesome!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='modal_body_preview'>
              <p>You've successfully created an event.</p>
              <p>Here are the details of your new created event:</p>
            </div>
            <div className='event_modal_details flex-row'>
              <p className='detail_key'>Name</p>
              <p className='colon'>:</p>
              <p className='detail_value'>{name}</p>
            </div>
            <div className='event_modal_details flex-row'>
              <p className='detail_key'>Date</p>
              <p className='colon'>:</p>
              <p className='detail_value'>{date.split('-').join('/')}</p>
            </div>
            <div className='event_modal_details flex-row'>
              <p className='detail_key'>Time</p>
              <p className='colon'>:</p>
              <p className='detail_value'>{modalTime()}</p>
            </div>
            <div className='event_modal_details flex-row'>
              <p className='detail_key'>Description</p>
              <p className='colon'>:</p>
              <p className='detail_value'>{description}</p>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    )
  }
  
  export default EventCreate;