import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchEvent, loadEvent } from "../../store/events";
import { fetchEventPins, getEventPins } from "../../store/pins";
import { useSelector, useDispatch } from "react-redux";
import * as pinReducerActions from '../../store/pins';
import * as eventReducerActions from '../../store/events';
import jwtFetch from '../../store/jwt';
import './Event.scss'
import { useParams } from 'react-router-dom';

export const EventUpdate = ({event, pins, mapData}) => {

    const [name, setName] = useState(event?.name);
    const [description, setDescription] = useState(event?.description);
    const [date, setDate] = useState(event?.date?.slice(0,10));
    const [time, setTime] = useState(event?.time?.slice(11,20));
    const [imageFile, setImageFile] = useState(event?.image)
    const [photoUrl, setPhotoUrl] = useState('')

    // console.log(date);
    // console.log(time);

    const updateName = e => setName(e.currentTarget.value);
    const updateDescription = e => setDescription(e.currentTarget.value);
    const updateDate = e => setDate(e.currentTarget.value);
    const updateTime = e => setTime(e.currentTarget.value);
    const {eventId} = useParams()

    const dispatch = useDispatch();
    const errors = useSelector(state => state.errors.events);
    const history = useHistory();

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

    const eventDurationSum = () => {
        let duration = 0;
        pins.forEach(pin => {
          duration += pin.duration
        });
        return duration;
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


      const eventToUpdate = {
            id: eventId, //this line is strictly so that the thunk will have a wildcard in the package it receives 
            name: name,
            description: description,
            duration: (mapData.duration + eventDurationSum()),
            distance: mapData.distance,
            price: totalPrice(), 
            supplies: totalSupplies(),
            elevation: mapData.elevation,
            date: date,
            status: false,
            initCoords: firstPin.location,
            location: address
        }
      let eventUpdated = await dispatch(eventReducerActions.updateEvent(eventToUpdate));

      if (eventUpdated && photoUrl) { 
        await jwtFetch(`/api/events/addImage/${eventUpdated._id}`, {
          method: "PATCH",
          body: formData,
        })
      }

      history.push(`/events/${eventId}`)
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
        return total;
    }

    const totalDuration = () => {
    let total = mapData.duration;
    pins.forEach(pin=> {
        return total += pin.duration;
    })
    return total;
    }

    const previewTitle = photoUrl ?  <h3 className='preview-title'> Image preview</h3>: <h3 className='preview-title'> Original Image</h3>;
    const preview = photoUrl ? <img className='preview-image' src={photoUrl} alt="" /> : <img className='preview-image' src={imageFile} alt="" /> ;
    return event ? (
        <>
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
                  type="number" 
                  value={totalPrice()} 
                />            
              </label>
  
              <div className="errors">{errors && errors.text}</div>
              <input type="file" onChange={updateImage} multiple />
              {previewTitle}
              {preview}
              <button>Submit</button>
            </form>
            {/* <div>{displayPins()}</div> */}
  
            
          </div>
  
          <div className='map_stat_wrapper'>
            <div className='flex-row'>
              <p className='stat_key'>Estimated Event Duration</p>
              <p className='stat_value'>{totalDuration()}</p>
            </div>
            <div className='flex-row'>
              <p className='stat_key'>Estimated Walking Duration</p>
              <p className='stat_value'>{mapData.duration}</p>
            </div>
            <div className='flex-row'>
              <p className='stat_key'>Total Distance</p>
              <p className='stat_value'>{mapData.distance}</p>
            </div>
            <div className='flex-row'>
              <p className='stat_key'>Total Elevation Gain</p>
              <p className='stat_value'>{mapData.elevation}</p>
            </div>
          </div>
        </>
      ) : null;

}