import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import {useParams} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import ClueForm from "./ClueForm";
import { fetchEvent, loadEvent  } from "../../store/events";
import { fetchEventPins, getEventPins } from "../../store/pins";
import GameOver from '../GameOver/GameOver';

export const OnlineGameMap = () => {
  const dispatch = useDispatch();
  const {eventId} = useParams();
  const event = useSelector(loadEvent(eventId));
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const eventPins = useSelector(getEventPins(eventId));
  const [currentPosition, setCurrentPosition] = useState(null);
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState("Click Map to Begin");
  let [numPoints, setNumPoints] = useState(0);
  const [thinkingTime, setThinkingTime] = useState(0);
  const [showClue, setShowClue] = useState(true);
  const [showWrong, setShowWrong] = useState(false);
  const [latestRenderedPin, setlatestRenderedPin] = useState(0);
  const [currentPinOrder, setCurrentPinOrder] = useState(1);
  const [showEndGame, setShowEndGame] = useState(false);

  let currentLocationPin;
  let firstPin;
  
  const grabPin = (order) => {
    return eventPins.filter(pin => pin.order === order)[0]
  }
  
  useEffect(() => {
    if (eventId) {
      dispatch(fetchEvent(eventId));
      dispatch(fetchEventPins(eventId));
    }
  },[eventId])

  useEffect(() => {
    if (grabPin(currentPinOrder)) pointReached();

  }, [currentPosition])

  useEffect(() => {
    if (event) {
      setCurrentPosition(event.initCoords[0]);

    }
  }, [event])

  useEffect(() => {
    if (!map && event) {
      // setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: (event?.pins[0].location.latitude), lng: (event?.pins[0].location.latitude)}}))
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: event.initCoords[0]}))
    };
    
  }, [mapRef, event]);

  useEffect(() => {
    if (map) {
      window.google.maps.event.addListener(map, "click", (event) => {
        setCoords(allCoords => [...allCoords, event.latLng])
        addLocationPin(event.latLng, map);
        // if (currentLocationPin) {
        //   currentLocationPin.position = event.latLng;
        // }
        // setCurrentPosition(event.latLng.getPosition());
        
        
      });

      // setTimeout(() => console.log(event), 5000)
      // addLocationPin(event.initCoords[0], map)
      
      
      // if (grabPin(1)) {
      //   setCoords(allCoords => [...allCoords, grabPin(1).location[0]]);
      //   console.log(coords)
      // }
    };
    
  }, [map]) ;
  

  
  
  setInterval(() => {
    setThinkingTime(thinkingTime + 1)
  }, 60000)

  useEffect(() => {
    if (event && event.duration > 0 && duration > 0) setRemainingTime(event.duration - thinkingTime - duration)
  }, [thinkingTime, duration])

  
  // useEffect(() => {
  //   renderEventPin(currentPinOrder);
  //   if (currentPinOrder === 0) setCurrentPinOrder(1)
  // }, [eventPins, currentPinOrder])

  // useEffect(()=> {
  //   console.log(currentPinOrder)
  //   if (currentPinOrder === 1) setCurrentPosition(grabPin(currentPinOrder).location[0])
  // }, [currentPinOrder])

  // useEffect(() => {
  //   releaseClue();
  // }, [currentPosition])
  
  // todo: differentiate playerpin and event pins, tie the markers to the pin info somehow
  
  const renderEventPin = (order) => {
    const pin = grabPin(order)
    if (pin) {
      const marker = new window.google.maps.Marker({
        order: pin?.order,
        position: pin?.location[0],
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8.5,
          fillColor: "blue",
          fillOpacity: 0.8,
          strokeWeight: 0
        }
      });
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      // firstPin.position = grabPin(2).location[0]
    }
  };

  // if (!latestRenderedPin) {
  //   renderEventPin(1);
  //   setlatestRenderedPin(1);
  // }

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
    setCurrentPosition({lat: marker.position.lat(), lng: marker.position.lng()});
  };
  

    
  function haversineDistance(mk1, mk2) {
    if (mk2) {
      const R = 6.378e+6; // Radius of the Earth in meters
      const rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
      const rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
      const difflat = rlat2-rlat1; // Radian difference (latitudes)
      const difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Radian difference (longitudes)
      
      const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
      return d;
    }
  }
  
  const pointReached = () => {
    return haversineDistance(currentPosition, grabPin(currentPinOrder).location[0]) < 500
  }

  const releaseClue = () => {
    if (pointReached()) {
      setShowClue(true)
      setShowWrong(false)
    } else {
      setShowWrong(true)
    }
  }
  
  const nextPin = () => {
      setCurrentPinOrder(currentPinOrder + 1);
      setShowClue(false);
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
    
  }, [coords]);

  
  if (!mapRef) return null;

  return (
    <>
      <div className='game-info'>
        <h1>{event?.name}</h1>
        <p>Current Position: {String(currentPosition)}</p>
        <p> Pin {currentPinOrder && grabPin(currentPinOrder)?.directionsToPin}</p>
        {showWrong && <h2>You're at the wrong location!</h2>}
        <ul>
          <li>Remaining Time: {duration > 0 ? `${Math.round(remainingTime)} minutes` : `${Math.round(event?.duration)} minutes` }</li>
          <li>Distance Traveled: {distance} km</li>
          <li>Time "Walked": {duration} minutes</li>
          <li>Time Pondered: {thinkingTime} minutes</li>
        </ul>


      </div>
      <div className="google-map-container" ref={mapRef}>Map</div>

      <ClueForm showClue={showClue} setShowEndGame={setShowEndGame} nextPin={nextPin} grabPin={grabPin} eventPins={eventPins} currentPinOrder={currentPinOrder}/>

      {showEndGame && <GameOver remainingTime={remainingTime} distance={distance} timeWalked={duration} thinkingTime={thinkingTime} />}
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