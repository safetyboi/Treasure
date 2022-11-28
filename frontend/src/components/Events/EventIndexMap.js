import { Wrapper } from "@googlemaps/react-wrapper";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import eventsReducer, { fetchEvents, loadEvents } from "../../store/events";
import myIcon from './MapMarker.png';
import EventIndexItem from "./EventIndexItem";
import './Event.scss'


export const EventIndexMap = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const events = useSelector(loadEvents);
  const [showInfoBox, setShowInfoBox] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [])

  useEffect(() => {
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: 37.773259546305965, lng: -122.44496350133707}}));
    };
    
  }, [mapRef]);

  if (map) {
    window.google.maps.event.addListener(map, "click", () => {
        setShowInfoBox(false);   
    });
  };

  const markerIcon = {
    url: myIcon,
    scaledSize: new window.google.maps.Size(30, 30),
    labelOrigin: new window.google.maps.Point(15,-10),
  };

  useEffect(() => {
    if (map && events.length) {
      events.forEach(event => {
        const marker = new window.google.maps.Marker({
          position: event.initCoords[0],
          map: map,
          icon: markerIcon
        });
        marker.addListener('mouseover', () => {
          marker.setLabel({
            text: event.name,
            fontSize: '20px',
            fontWeight: '700'
          })
        });
        marker.addListener('mouseout', () => {
          marker.setLabel(null);
        });
        marker.addListener('click', () => {
          setShowInfoBox(event);
        });
      })
    }
  }, [map, events])

  return (
    <>
      <div className="google-map-container" ref={mapRef}>Map</div>
      { showInfoBox &&
        <div className="popup-box">
          <EventIndexItem event={showInfoBox}/>
        </div>
      }
    </>
  )

}



const EventIndexMapWrapper = () => {

  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY} >
      <EventIndexMap/>
    </Wrapper>
  )
};


export default EventIndexMapWrapper;