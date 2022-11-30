import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import PinEditForm from "./EditPinForm";
import EventCreate from '../Events/EventCreate';
import Footer from "../NavBar/Footer";
import './Map.scss';
import './PinEditForm.scss';

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
  const [mapData, setMapData] = useState({})

  useEffect(() => {
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: 37.773972, lng: -122.431297}}))
    }
    
  }, [mapRef]);

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
    // TODO: figure out how to delete a pin

    // setPins(pins.filter(pin => {
    //   return pin.order !== marker.order
    // }));
    // setMarkers(markers.filter(mark => {
    //   return mark.order !== marker.order
    // }));
    // marker.setMap(null);
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
  

  // todo - pineditform is rendered for each position in the marker positions array (statevar). map and pass in the position to it, only show if the showeditform is set to its order. click handler on markers sets that variable to the position. 
  const addPin = (location, map) => {
    setNumPoints(numPoints++)
    const marker = new window.google.maps.Marker({
      order: numPoints,
      position: location,
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
      setShowPinEditForm(marker);
    })
    setMarkers(marks => [...marks, marker])
    addPinToArray(blankPin(marker))
    setShowPinEditForm(marker)
  };

  useEffect(() => {
    if (map) {
      window.google.maps.event.addListener(map, "click", (event) => {
        setCoords(allCoords => [...allCoords, event.latLng])
        addPin(event.latLng, map);
      });
    };
    
  }, [map]) ;

  useEffect(() => {
    setMapData({
      distance,
      elevation,
      duration,
    })
  }, [distance, elevation, duration])


  // todo: create conditional render of point edit form, pass in the showPointEditForm value to get the specific point

  const elevator = new window.google.maps.ElevationService();
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

    if (coords.length > 1) {
        renderPath();
    } 

  }, [coords])

  useEffect(() => {
    calcElevationArray(pathPoints);
  }, [pathPoints])

  useEffect(() => {
    calcElevation(elevationArray);
  }, [elevationArray])

  // useEffect(() => {
  //   passUpMapData(distance, duration, polyline, elevationArray, elevation);
  // }, [distance, duration, polyline, elevationArray, elevation])

	// const height = document.getElementById('accordion').clientHeight();
  // document.getElementById('google-map-container').style.height = height

  return (
    <div className="planning_map_area flex-row">
			<div className="planning_map_form">
			  <EventCreate pins={pins} mapData={mapData}/>
			</div>
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
      {/* TODO grab the correct marker */}
    </div>
  )

};

const PlanningMapWrapper = () => {
  return (
    <div className="planning_map">
      <section className="planning_map_wrapper flex-col align-center">
        <h1>Plan an Event</h1>
        <p>(Click anywhere on the map to create a pin)</p>
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