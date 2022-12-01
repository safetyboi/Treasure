import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import {useHistory, useParams, Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import ClueForm from "./ClueForm";
import { fetchEvent, loadEvent  } from "../../store/events";
import { fetchEventPins, getEventPins } from "../../store/pins";
import GameOver from '../GameOver/GameOver';
import { Button } from "react-bootstrap";
import jingle from '../../assets/sounds/success-bell.wav';
import win from '../../assets/sounds/win.wav';
import './GameMap.scss'

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
  const showClueRef = useRef(showClue);
  const [currentPinOrder, setCurrentPinOrder] = useState(1);
  const [showEndGame, setShowEndGame] = useState(false);
  const[markers, setMarkers] = useState([]);
  const history = useHistory();
  const [eventDuration, setEventDuration] = useState(0);
  const [showStartButton, setShowStartButton] = useState(true);
  const jingleSound = new Audio(jingle);
  const winSound = new Audio(win);
  const [intervalId, setIntervalId] = useState('');

  const grabPin = (order) => {
    return eventPins.filter(pin => pin.order === order)[0]
  }

  const showClueUpdater = (value) => {
    showClueRef.current = value;
    setShowClue(value);
  }

  const startGame = () => {
    setShowStartButton(false);
    setCoords(allCoords => [...allCoords, event.initCoords[0]])
    addLocationPin(event.initCoords[0], map);
    
    if (map) {
      window.google.maps.event.addListener(map, "click", (event) => {
        if (!showClueRef.current) {
          setCoords(allCoords => [...allCoords, event.latLng])
          addLocationPin(event.latLng, map);     
        }
      });
    };

    setIntervalId(setInterval(() => {
      setThinkingTime(thinkingTime + 1)
    }, 60000));
  }

  const eventDurationSetter = () => {
    let duration = 0
    eventPins.forEach(pin => {
      duration += pin.duration
    });
    return duration;
  }
  
  useEffect(() => {
    if (eventId) {
      dispatch(fetchEvent(eventId));
      dispatch(fetchEventPins(eventId));
    }
  },[eventId])

  useEffect(() => {
      if (currentPinOrder && currentPosition) releaseClue();
  }, [currentPosition])

  useEffect(() => {

    if (eventPins && !eventDuration) {
      setEventDuration(eventDurationSetter());
    }
  }, [event])

  useEffect(() => {
    if (!map && event) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: event.initCoords[0]}))
    };
    
  }, [mapRef, event]);

  useEffect(() => {
    if (remainingTime < 1) {
      winSound.play();
      clearInterval(intervalId);
      setShowEndGame(true)
    }
  }, [remainingTime])

  useEffect(() => {
    if (event && event.duration > 0 && duration > 0) setRemainingTime(event.duration - thinkingTime - duration)
  }, [thinkingTime, duration])
  
  const mIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillOpacity: 1,
    fillColor: 'blue',
    strokeOpacity: 0,
    strokeWeight: 0,
    strokeColor: '#333',
    scale: 6
  };

  const renderEventPin = (order) => {
    const pin = grabPin(order)
    if (pin) {
      const marker = new window.google.maps.Marker({
        order: pin?.order,
        position: pin?.location[0],
        map: map,
        icon: mIcon,
        label: {
          color: '#000', 
          fontSize: '12px', 
          fontWeight: '600',
          text: String(pin?.order)
        }
      });
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      if (markers.length) {
        markers[markers.length - 1].setAnimation(null);
      }
      setMarkers(markers => [...markers, marker])
    }
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
      jingleSound.play();

      setTimeout(() => {
        if ( currentPinOrder !== 1) {
          alert(`You've reached point ${currentPinOrder}! Answer the question below to unlock directions to the next point!`)
        }
        renderEventPin(currentPinOrder);
        showClueUpdater(true)
      }, 500)
    }
  }
  
  const nextPin = () => {
      setCurrentPinOrder(currentPinOrder + 1);
      showClueUpdater(false);
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
              setDuration(Math.round((totalDuration / 60)));
              
              directionsRenderer.setDirections(response);
            }
          }); 
      
  };
  
  useEffect(() => {

    if (coords.length > 1) {
      renderPath();
    } 
    
  }, [coords]);

  const handleRoute = () => {
    history.push('/events');
  }

  
  if (!mapRef) return null;

  return (
    <section className="game_page">
      {!showStartButton && 
        <div className='game-info'>
          <h1>{event?.name}</h1>
          <h2 className='task-header'>CURRENT TASK <br /><br />{showClue ? `Respond to the clue below.` : `Follow the directions and click the map to travel to the next location pin.` }</h2>
          <ul>
            <li className='flex-row'>
              <p className="game_key">Remaining Time</p>
              <p className="game_value">{duration > 0 ? `${Math.round(remainingTime)} minutes` : `${Math.round(event?.duration)} minutes` }</p>
            </li>
            <li className='flex-row'>
              <p className="game_key">Distance Traveled</p>
              <p className="game_value">{distance} km</p>
            </li>
            <li className='flex-row'>
              <p className="game_key">Time "Walked"</p>
              <p className="game_value">{Math.round(duration)} minutes</p>
            </li>
            <li className='flex-row'>
              <p className="game_key">Time Pondered</p>
              <p className="game_value">{thinkingTime} {thinkingTime === 1 ? `minute` : `minutes`}</p>
            </li>
          </ul>
          <Link className="back" to='/events'><Button>QUIT</Button></Link>
        </div>
      }

      <div className="google-map-container" ref={mapRef}>Map</div>
      {!showStartButton && 
        <ClueForm intervalId={intervalId} setCoords={setCoords} addLocationPin={addLocationPin} winSound={winSound} showClue={showClue} setShowEndGame={setShowEndGame} nextPin={nextPin} grabPin={grabPin} eventPins={eventPins} currentPinOrder={currentPinOrder}/>
      }
      {/* <Link className="back" to='/events'><Button>QUIT</Button></Link> */}
      {showStartButton &&
        <div>
        <h3>How to Play an Online Scavenger Hunt</h3>
        <ul>
          <li>When you click "Start," your remaining time will start ticking down.</li>
          <li>Your "Current Task" will always be displayed in the top-right corner of the screen.</li>
          <li>Notice the panel in the top-left corner of the screen: You must alternate between typing your answers to the "Clue" prompts and then following the "Directions to Pin" by clicking on the appropriate locations on the map.</li>
          <li>Hint...if you don't see a "My Response" box, you haven't reached the next pin by clicking the right map location yet!</li>
          <li>Be careful! Both your "thinking time" and "walking time" reduce your remaining game time. When it reaches 0, you lose!</li>
          <li>Answer the final pin's clue correctly to win the game!</li>
          <li>The "Cheat Button" reveals the correct answer or brings you to the next pin location, as appropriate.</li>
        </ul>
        <Button onClick={startGame} className="start-button">Start Game</Button>
      </div>
      }
      {showEndGame && <GameOver remainingTime={remainingTime} distance={distance} timeWalked={duration} thinkingTime={thinkingTime} />}
    </section>
  )

};



const OnlineGameMapWrapper = () => {

  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY} >
      <OnlineGameMap/>
    </Wrapper>
  )
};


export default OnlineGameMapWrapper;