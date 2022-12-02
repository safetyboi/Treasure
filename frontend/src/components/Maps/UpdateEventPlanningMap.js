import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import UpdatePinForm from "./UpdatePinForm";
import EventUpdate from '../Events/EventUpdate';
import Footer from "../NavBar/Footer";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvent, loadEvent } from "../../store/events";
import { fetchEventPins, getEventPins } from "../../store/pins";
import { useParams } from 'react-router-dom';
import Instructions from './Instructions.js';
import { Button } from "react-bootstrap";
import './Map.scss';
import './PinEditForm.scss';
import "./Instructions.scss";
import dart from '../../assets/sounds/dart.wav';
import fizz from '../../assets/sounds/fizz.wav';


export const UpdatePlanningMap = () => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [polyline, setPolyline] = useState('');
  const [duration, setDuration] = useState(0);
  const [pathPoints, setPathPoints] = useState([]);
  const [elevationArray, setElevationArray] = useState([]);
  const [showPinEditForm, setShowPinEditForm] = useState(false);
  const [numPoints, setNumPoints] = useState(0);
  const numPointsRef = useRef(numPoints);
  const [mapData, setMapData] = useState({});
  const [directionsRenderer, setDirectionsRenderer] = useState(new window.google.maps.DirectionsRenderer({suppressMarkers: true, preserveViewport: true}));
  const [mapListener, setMapListener] = useState('');
  const dartSound = new Audio(dart);
  const fizzSound = new Audio(fizz);
  
  const dispatch = useDispatch();
  const {eventId} = useParams()
  const event = useSelector(loadEvent(eventId)); //but where is it getting eventId from?
  const eventPins = useSelector(getEventPins(eventId));
  const [pins, setPins] = useState(eventPins);
  const pinsRef = useRef(pins);
  const [showStartButton, setShowStartButton] = useState(true);
  const showStartButtonRef = useRef(showStartButton);

  const _setShowStartButton = (value) => {
    showStartButtonRef.current = value;
    setShowStartButton(value);
  }

  const _setPins = (value) => {
    pinsRef.current = value;
    setPins(value);
  }

  const _setNumPoints = (value) => {
    numPointsRef.current = value;
    setNumPoints(value);
  }

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEvent(eventId));
      dispatch(fetchEventPins(eventId));
    }
  },[dispatch, eventId])

  useEffect(() => {
    if (!map && event) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: event.initCoords[0]}))
    }
    
  }, [mapRef, event]);

  const startPlanning = () => {
    _setShowStartButton(false);
    _setPins(eventPins);
    setCoords(eventPins.map(pin => {
      return {lat: pin.location[0].lat, lng: pin.location[0].lng}
    }).reverse());
    renderEventPins(eventPins);
    _setNumPoints(pinsRef.current.length);

  }

  const calcElevationArray = async (points) => {
    if (points.length > 1) {
      let elev = await (elevator.getElevationAlongPath({
        path: points,
        samples: 40,
      }));
      await setElevationArray(elev[`results`].map(result => {
        return result[`elevation`];
      }));
    };
    
  };

  const selectedPin = (order) => {
    return pins.filter(pin => {
      return pin.order === order
    })[0];
  };

  const addPinToArray = (newPin) => {
    if (pins.filter(pin => {
      return pin.order === newPin.order
    })) {
      _setPins(allPins => 
        [...allPins.filter(pin => {
          return pin.order !== newPin.order
        }), newPin]
      )
    } else {
      _setPins(allPins => [...allPins, newPin])
    }
  };

  const deletePin = (marker) => {
    _setNumPoints(numPointsRef.current - 1);
    setShowPinEditForm(false);

    _setPins(pins.map(pin => {
      if (pin.order > marker.order) {
        return {...pin, ['order']: pin.order - 1}
      } else if (pin.order === marker.order) {
        return {...pin, ['order']: -1}
      } else {
        return pin
      }
    }).filter(pin => {
      return pin.order !== -1
    }));


    marker.setMap(null);
    let reducedMarkers = [];
    markers.forEach(mark => {
      if (mark.order > marker.order) {
        mark.setMap(null);
        const newMarker = new window.google.maps.Marker({
          order: mark.order - 1,
          position: mark.position,
          map: map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 4.5,
            fillColor: "red",
            fillOpacity: 0.8,
            strokeWeight: 0,
        }
        });
        newMarker.addListener('click', () => {
          setShowPinEditForm(newMarker);
          fizzSound.play();
        })
        reducedMarkers.push(newMarker);
      } else if (mark.order < marker.order) {
        reducedMarkers.push(mark);
      }
    })
    setMarkers(reducedMarkers);

    window.google.maps.event.removeListener(mapListener);
    setMapListener(window.google.maps.event.addListener(map, "click", (event) => {
      if (!showStartButtonRef.current) {
        dartSound.play();
        setCoords(allCoords => [...allCoords, event.latLng])
        addPin(event.latLng, map);
      }
    }));

    let reducedCoords = [...coords];
    reducedCoords.splice(marker.order - 1, 1);
    setCoords(reducedCoords)
  };

  const calcElevation = (elevationArray) => {
    let totalClimbing = 0;
    for (let i = 0; i < elevationArray.length - 1; i++) {
      if (elevationArray[i] < elevationArray[i+1]) {
        totalClimbing += elevationArray[i+1] - elevationArray[i]
      };
    };
    setElevation(Math.round(totalClimbing * 10) / 10);
  };

  const blankPin = (marker) => {

    return {
      order: marker.order,
      location: [{
        latitude: marker.position.lat(),
        longitude: marker.position.lng(),
      }],
      directionToPin: [{text: ''}],
      task: [{
        prompt: '',
        correctAnswer: '',
      }],
      supplies: '',
      price: 0,
      duration: 0
    }
  }

  const renderEventPins = (pins) => {
    pins.forEach(pin => {
        const marker = new window.google.maps.Marker({
            order: pin?.order,
            position: pin?.location[0],
            map: map,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 4.5,
                fillColor: "red",
                fillOpacity: 0.8,
                strokeWeight: 0
            }
        });
        marker.addListener('click', async () => {
          fizzSound.play();
            setShowPinEditForm(marker);
        })
        setMarkers(marks => [...marks, marker])
    })
    }
  
  const addPin = (location, map) => {
    _setNumPoints(numPointsRef.current + 1);
    const marker = new window.google.maps.Marker({
      order: numPointsRef.current,
      position: location,
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 4.5,
        fillColor: "red",
        fillOpacity: 0.8,
        strokeWeight: 0,
    }
    });
    marker.addListener('click', async() => {
      setShowPinEditForm(marker);
    })
    setMarkers(marks => [...marks, marker])
    addPinToArray(blankPin(marker))
    setShowPinEditForm(marker);
  };

  useEffect(() => {
    if (map) {
      setMapListener(window.google.maps.event.addListener(map, "click", (event) => {
        if (!showStartButtonRef.current) {
          dartSound.play();
          setCoords(allCoords => [...allCoords, event.latLng])
          addPin(event.latLng, map);
        }
      }));
    };
    
  }, [map]) ;

  useEffect(() => {
    setMapData({
      distance,
      elevation,
      duration,
    })
  }, [distance, elevation, duration])

  // const directionsRenderer = new window.google.maps.DirectionsRenderer({suppressMarkers: true});
  // directionsRenderer.setMap(map);
  const directionsService = new window.google.maps.DirectionsService();
  const elevator = new window.google.maps.ElevationService();
  
  const renderPath = () => {
    directionsRenderer.setMap(map);

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
              });

            const pathPointSet = response.routes[0].overview_path;
            
            setDistance(Math.round(totalDistance * 10) / 10);
            setPolyline(poly);
            setDuration(Math.round(totalDuration / 60 * 10) / 10);
            setPathPoints(pathPointSet);

            directionsRenderer.setDirections(response);
        }
    }); 
  };

  useEffect(() => {
    if (coords.length > 0) {
        renderPath();
    } 

  }, [coords])

  useEffect(() => {
    calcElevationArray(pathPoints);
  }, [pathPoints])

  useEffect(() => {
    calcElevation(elevationArray);
  }, [elevationArray])

	// const height = document.getElementById('accordion').clientHeight();
  // document.getElementById('google-map-container').style.height = height
  console.log(pinsRef.current)
  return (
    <div className="planning_map_area flex-row justify-center">
      {showStartButton && 
      <div className="instruction_area flex-col align-center">
        <Instructions />
        <Button onClick={startPlanning}>Start Planning</Button>
      </div>
      }

			<div className="planning_map_form">
        {event && !showStartButton &&
		    <EventUpdate event={event} pins={pins} mapData={mapData}/>
        }
			</div>
      <div id="google-map-container" ref={mapRef}>
        Map
        {showPinEditForm && 
					<UpdatePinForm 
						deletePin={deletePin} 
						addPinToArray={addPinToArray} 
						marker={showPinEditForm} 
						pin={selectedPin(showPinEditForm.order)}
					/>
				}
      </div>
      {/* TODO grab the correct marker */}
    </div>
  )

};

const UpdatePlanningMapWrapper = () => {
  return (
    <div className="planning_map">
      <section className="planning_map_wrapper flex-col align-center">
        <h1>Update an Event</h1>
        <Wrapper 
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
          className="flex-row justify-center align-center">
          <UpdatePlanningMap/>
        </Wrapper>
      </section>
      <Footer />
    </div>
  )
};


export default UpdatePlanningMapWrapper;