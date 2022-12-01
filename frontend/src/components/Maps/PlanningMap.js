import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import PinEditForm from "./EditPinForm";
import EventCreate from '../Events/EventCreate';
import Footer from "../NavBar/Footer";
import './Map.scss';
import './PinEditForm.scss';
import Step1 from "../../assets/images/step_1.png";
import Step2 from "../../assets/images/step_2.png";
import Step3 from "../../assets/images/step_3.png";
import Step4 from "../../assets/images/step_4.png";

export const PlanningMap = () => {
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
  let [numPoints, setNumPoints] = useState(0);
  const [pins, setPins] = useState([]);
  const [mapData, setMapData] = useState({});
  const [directionsRenderer, setDirectionsRenderer] = useState(new window.google.maps.DirectionsRenderer({suppressMarkers: true, preserveViewport: true}));
  const [mapListener, setMapListener] = useState('');
  const [showStartButton, setShowStartButton] = useState(true);
  const showStartButtonRef = useRef(showStartButton);
  const [open, setOpen] = useState(false);

  const _setShowStartButton = (value) => {
    showStartButtonRef.current = value;
    setShowStartButton(value);
  }

  useEffect(() => {
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: 37.773972, lng: -122.431297}}))
    }
    
  }, [mapRef]);

  const startPlanning = () => {
    _setShowStartButton(false);
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
      setPins(allPins => 
        [...allPins.filter(pin => {
          return pin.order !== newPin.order
        }), newPin]
      )
    } else {
      setPins(allPins => [...allPins, newPin])
    }
  };

  const deletePin = (marker) => {
    setNumPoints(numPoints - 1);
    setShowPinEditForm(false);

    setPins(pins.map(pin => {
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
      location: {
        latitude: marker.position.lat(),
        longitude: marker.position.lng(),
      },
      directionToPin: {text: ''},
      task: {
        prompt: '',
        correctAnswer: '',
      },
      supplies: '',
      price: 0,
      duration: 0
    }
  }
  
  const addPin = (location, map) => {
    setNumPoints(numPoints++);
    const marker = new window.google.maps.Marker({
      order: numPoints,
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

  return (
    <>
      <div className="accordion flex-col justify-center">
        <div className="accordion_title">
          <h2 className="text-center">How to Plan An Event</h2>
        </div>
        <div className="accordion_body flex-row">
          <div className="step_card flex-col align-center">
            <span className="step_number fa-stack fa-2x">
              <i className="fa-solid fa-circle fa-stack-2x"></i>
              <i className="number fa-solid fa-stack-1x">1</i>
            </span>
            {/* <div className="step_number">
              <span className="number flex-row justify-center align-center">1</span>
            </div> */}
            <div className="step_image">
              <img src={Step1} alt="step 1 how to plan" />
            </div>
            <div className="step_details">
              <h3>Click anywhere on the map to create an event pin</h3>
              <p>Enter pertinent data into the pin editor. It is automatically saved.</p>
            </div>
          </div>
          <div className="step_card flex-col align-center">
            <span className="step_number fa-stack fa-2x">
              <i className="fa-solid fa-circle fa-stack-2x"></i>
              <i className="number fa-solid fa-stack-1x">2</i>
            </span>
            <div className="step_image">
              <img src={Step2} alt="step 2 how to plan" />
            </div>
            <div className="step_details">
              <h3>Create as many event pins as you like</h3>
              <p>A route will automatically be drawn connecting them.</p>
            </div>
          </div>
          <div className="step_card flex-col align-center">
            <span className="step_number fa-stack fa-2x">
              <i className="fa-solid fa-circle fa-stack-2x"></i>
              <i className="number fa-solid fa-stack-1x">3</i>
            </span>
            <div className="step_image">
              <img src={Step3} alt="step 3 how to plan" />
            </div>
            <div className="step_details">
              <h3>Click any pin and the "Delete" button to remove it from your event</h3>
              <p>Pin will be deleted. General info about the event goes in the form on the left of the map.</p>
            </div>
          </div>
          <div className="step_card flex-col align-center">
            <span className="step_number fa-stack fa-2x">
              <i className="fa-solid fa-circle fa-stack-2x"></i>
              <i className="number fa-solid fa-stack-1x">4</i>
            </span>
            <div className="step_image">
              <img src={Step4} alt="step 4 how to plan" />
            </div>
            <div className="step_details">
              <h3>When your event looks good, click the submit button at the bottom</h3>
              <p>Your event will be submitted and saved.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="planning_map_area flex-row">
        {/* {showStartButton && 
        <div>
          <h3>How to Plan An Event</h3>
          <ul>
            <li>Click anywhere on the map to create an event pin.</li>
            <li>Enter pertinent data into the pin editor. It is automatically saved.</li>
            <li>Create as many event pins as you like - a route will automatically be drawn connecting them.</li>
            <li>Click any pin and the "Delete" button to remove it from your event.</li>
            <li>General info about the event goes in the form on the left of the map.</li>
            <li>When your event looks good, click the submit button at the bottom.</li>
          </ul>
          <button onClick={startPlanning}>Start Planning</button>
        </div>
        } */}
        <div className="planning_map_form">
          <EventCreate pins={pins} mapData={mapData}/>
        </div>
        <div className="map_instructions">
          
          <div id="google-map-container" ref={mapRef}>
            Map
            {showPinEditForm && 
              <PinEditForm 
                deletePin={deletePin} 
                addPinToArray={addPinToArray} 
                marker={showPinEditForm} 
                pin={selectedPin(showPinEditForm.order)}
              />
            }
          </div>
        </div>
        
        {/* TODO grab the correct marker */}
      </div>
    </>
  )

};

const PlanningMapWrapper = () => {
  return (
    <div className="planning_map">
      <section className="planning_map_wrapper flex-col align-center">
        <h1>Plan an Event</h1>
        <Wrapper 
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
          className="flex-row justify-center">
          <PlanningMap/>
        </Wrapper>
      </section>
      <Footer />
    </div>
  )
};


export default PlanningMapWrapper;