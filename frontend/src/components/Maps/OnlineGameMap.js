import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import {useParams} from 'react-router-dom';
import { useDispatch } from 'react-redux';

export const ViewingMap = () => {
  const dispatch = useDispatch();
  const {eventId} = useParams();
  const event = useSelector(getEvent(eventId));
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const currentUser = useSelector(getCurrentUser);
  const [currentPosition, setCurrentPosition] = useState(getUserPosition(currentUser.id));
  const participants = useSelector(getEventParticipants(event.id));
  const [participantPositions, setParticipantPositions] = useState(updateParticipantPositions());
  const [clueForm, setClueForm] = useState(1);
  const [currentPin, setCurrentPin] = useState(1);

  useEffect(() => {
    if (eventId) dispatch(fetchEvent(eventId))
  },[eventId])
  
  useEffect(() => {
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: (event?.pins[0].location.latitude), lng: (event?.pins[0].location.latitude)}}))
    };
    renderPins();
    
  }, [mapRef]);

  // todo: differentiate playerpin and event pins, tie the markers to the pin info somehow

  const renderEventPins = () => {
    event.pins.forEach(eventPin => {
      if (eventPin.order <= currentPin) {
        const marker = new window.google.maps.Marker({
          order: numPoints,
          position: location,
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
  };

  useEffect(() => {
    if (map) {
      window.google.maps.event.addListener(map, "click", (event) => {
        setCoords(allCoords => [...allCoords, event.latLng])
        addLocationPin(event.latLng, map);
      });
    };
    
  }, [map]) ;

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

  const renderParticipantPositions = () => {
    participantPositions.forEach(position => {
      addMarker(position, map)
    })
  };

  const updateParticipantPositions = () => {
    setParticipantPositions(fetchParticipantPositions());
    renderParticipantPositions();
  };

  setInterval(updateParticipantPositions, 30000);

  const renderPins = () => {
    event.pins.forEach(pin => {
      addMarker(pin.location, map)
    })
  }

  useEffect(() => {

    if (coords.length > 1) {
        renderPath();
    } 

  }, [coords])

  return (
    <>
      <div className="google-map-container" ref={mapRef}>Map</div>
      <ClueForm pinOrder={currentPin}/>
    </>
  )

};






const ViewingMapWrapper = ({event}) => {

  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY} libraries={["geometry"]}>
      <ViewingMap event={event}/>
    </Wrapper>
  )
};


export default ViewingMapWrapper;