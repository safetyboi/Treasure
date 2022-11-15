import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";

export const ViewingMap = ({event}) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState();
  const players = useSelector(getEventParticipants(event.id));
  const playerPositions, setPlayerPositions

  useEffect(() => {
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: 37.773972, lng: -122.431297}}))
    }
    
  }, [mapRef]);


  setInterval(fetchParticipantPositions, 30000);

  useEffect(() => {

  }, [])

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