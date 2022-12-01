import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadEvent, fetchEvent } from "../../store/events";
import './GameMap.scss'
import myIcon from '../Events/MapMarker.png';

export const EventShowMap = () => {

  const dispatch = useDispatch();
  const {eventId} = useParams();
  const event = useSelector(loadEvent(eventId));
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEvent(eventId));
    }
  },[eventId])

  useEffect(() => {
    if (!map && event) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 15, center: event.initCoords[0]}))
    };
    
  }, [mapRef, event]);

  const markerIcon = {
    url: myIcon,
    scaledSize: new window.google.maps.Size(30, 30),
    labelOrigin: new window.google.maps.Point(15,-10),
  };

  useEffect(() => {
    if (map && event) {
      const marker = new window.google.maps.Marker({
        position: event.initCoords[0],
        map: map,
        icon: markerIcon,
      });
    }
  }, [event, map])


  return (
    <div className="google-map-container" ref={mapRef}>Map</div>
  )
  
}

const EventShowMapWrapper = () => {
  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
      <EventShowMap/>
    </Wrapper>
  )
}

export default EventShowMapWrapper;