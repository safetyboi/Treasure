import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import {useParams} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import ClueForm from "./ClueForm";
import { fetchEvent  } from "../../store/events";
// import { getEvent } from '______';
// import { getEventPins } from '_____';

export const OnlineGameMap = () => {
  // const event = useSelector(getEvent(eventId));
  // const currentUser = useSelector(getCurrentUser);
  // const participants = useSelector(getEventParticipants(event.id));
  // const [participantPositions, setParticipantPositions] = useState(updateParticipantPositions());
  const dispatch = useDispatch();
  const {eventId} = useParams();
  const event = 3;
  const eventPins = useSelector(getEventPins(eventId));
  // const eventPins = [{order: 1}, {order: 2}, {order: 3}];
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  // const [currentPosition, setCurrentPosition] = event?.pins[0].location;
  const [currentPosition, setCurrentPosition] = useState(eventPins[0].location);
  const [coords, setCoords] = useState([]);
  // const [clueForm, setClueForm] = useState(1);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(event?.duration);
  let [numPoints, setNumPoints] = useState(0);
  const [thinkingTime, setThinkingTime] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  
  const setPin = (order) => {
    return eventPins.filter(pin => pin.order === order)[0]
  }
  
  const [currentPin, setCurrentPin] = useState(setPin(1));

  const getEventPins = (eventId) => (state) => {
    if (state.events) return Object.values(state.events);
    return [];
  }

  setTimeout(() => {
    setThinkingTime(thinkingTime + 1)
  }, 60000)

  useEffect(() => {
    setRemainingTime(event?.duration - thinkingTime - duration)
  }, [thinkingTime, duration])

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEvent(eventId));
      dispatch(fetchEventPins(eventId));
    }
  },[eventId])
  
  useEffect(() => {
    if (!map) {
      // setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: (event?.pins[0].location.latitude), lng: (event?.pins[0].location.latitude)}}))
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: 37.773972, lng: -122.431297}}))
    };
    setCoords(allCoords => [...allCoords, {lat: 37.773972, lng: -122.431297}]);
    addLocationPin({lat: 37.773972, lng: -122.431297}, map);
    
  }, [mapRef]);

  useEffect(() => {
    renderEventPins();
  }, [currentPin])

  useEffect(() => {
    releaseClue();
  }, [currentPosition])

  // todo: differentiate playerpin and event pins, tie the markers to the pin info somehow

  const renderEventPins = () => {
    eventPins.forEach(eventPin => {
      if (eventPin.order <= currentPin.order) {
        const marker = new window.google.maps.Marker({
          order: eventPin.order,
          position: eventPin.position,
          map: map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8.5,
            fillColor: "blue",
            fillOpacity: 0.8,
            strokeWeight: 0
        }
        });
      }
    })
  };

  const addLocationPin = (location, map) => {
    setNumPoints(numPoints++)
    const marker = new window.google.maps.Marker({
      order: numPoints,
      position: location,
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 4.5,
        fillColor: "green",
        fillOpacity: 0.8,
        strokeWeight: 0
    }
    });
    // marker.addListener('click', async () => {
    //   setClueForm(marker);
    // })
    // setMarkers(marks => [...marks, marker])
    // addPinToArray(blankPin(marker))
    // setClueForm(marker)
    setCurrentPosition(marker.position);
  };

  useEffect(() => {
    if (map) {
      window.google.maps.event.addListener(map, "click", (event) => {
        setCoords(allCoords => [...allCoords, event.latLng])
        addLocationPin(event.latLng, map);

      });
    };
    
  }, [map]) ;


  function haversineDistance(mk1, mk2) {
    const R = 6.378e+6; // Radius of the Earth in meters
    const rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
    const rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
    const difflat = rlat2-rlat1; // Radian difference (latitudes)
    const difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
  }

  const pointReached = () => {
    return haversineDistance(currentPosition, currentPin.position) < currentPin.radius
  }

  const releaseClue = () => {
    if (pointReached()) {
      setShowClue(true)
      setShowWrong(false)
    } else {
      setShowWrong(true)
    }
  }

  const checkResponse = (response, currentPin) => {
    if (response === currentPin.task.correctAnswer) {
      setCurrentPin(currentPin.order + 1)
      setShowClue(false)
    }
  }

  const directionsRenderer = new window.google.maps.DirectionsRenderer({suppressMarkers: true});
  directionsRenderer.setMap(map);
  const directionsService = new window.google.maps.DirectionsService();
  
  const renderPath = () => {

      let midpoints = []
      for(let i = 1; i < coords.length - 1; i++) {
        let point = coords[i];
        let wayPoint = {};
          wayPoint['location'] = new window.google.maps.LatLng(point);
          midpoints.push(wayPoint);
          wayPoint = {}
      }

      const request = {
          origin: coords[0],
          destination: coords[coords.length - 1],
          travelMode: 'WALKING',
          unitSystem: window.google.maps.UnitSystem.METRIC,
          waypoints: midpoints
      }
      
      directionsService.route(request, (response, status) => {
          if (status === 'OK') {
              const poly = response.routes[0].overview_polyline
              
              const distanceArray = response.routes[0].legs;
              let totalDistance = 0;
              distanceArray.forEach(dis => {
                  let value = dis.distance.value / 1000;
                  totalDistance += value;
              })

              const durationArray = response.routes[0].legs;
              let totalDuration = 0;
              durationArray.forEach(dur => {
                  let value = dur.duration.value;
                  totalDuration += value;

                  
                })
              
              setDistance(Math.round(totalDistance * 10) / 10);
              setDuration(Math.round(totalDuration / 60 * 10) / 10);

              directionsRenderer.setDirections(response);
          }
      }); 
      
  };

  useEffect(() => {

    if (coords.length > 1) {
        renderPath();
    } 

  }, [coords])

  return (
    <>
      <div className='game-info'>
        <h1>{event?.title}</h1>
        <p>{currentPin?.directionsToPin}</p>
        {showWrong && <h2>You're at the wrong location!</h2>}
        <form>
          <label>Remaining Time
            <input type='text' value={remainingTime} readOnly/>
          </label>
          <label>Distance Traveled
            <input type='text' value={distance} readOnly/>
          </label>
          <label>Time "Walked"
            <input type='text' value={duration} readOnly/>
          </label>
          <label>Time Pondered
            <input type='text' value={thinkingTime} readOnly/>
          </label>
        </form>
      </div>
      <div className="google-map-container" ref={mapRef}>Map</div>
      {showClue &&
      <ClueForm checkResponse={checkResponse} currentPin={currentPin}/>
      }
    </>
  )

};






const OnlineGameMapWrapper = ({event}) => {

  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY} libraries={["geometry"]}>
      <OnlineGameMap event={event}/>
    </Wrapper>
  )
};


export default OnlineGameMapWrapper;