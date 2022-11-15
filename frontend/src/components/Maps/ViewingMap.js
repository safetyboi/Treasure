import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";

export const ViewingMap = ({event}) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const currentUser = useSelector(getCurrentUser);
  const [currentPosition, setCurrentPosition] = useState(getUserPosition(currentUser.id));
  const participants = useSelector(getEventParticipants(event.id));
  const [participantPositions, setParticipantPositions] = useState(updateParticipantPositions());
  
  useEffect(() => {
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: 37.773972, lng: -122.431297}}))
    }
    
  }, [mapRef]);

  

  const addMarker = (location, map) => {
    const marker = new window.google.maps.Marker({
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

  useEffect(() => {

    if (coords.length > 1) {
        renderPath();
    } 

  }, [coords])

  return (
    <div className="google-map-container" ref={mapRef}>Map</div>
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