import { useEffect, useState, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { loadEvent } from "../../store/events";
import { Button } from "react-bootstrap";
import './GameMap.scss'
import PlayGame from '../../assets/images/PlayGame.svg';

export const ViewingMap = () => {
  const history = useHistory();
  const {eventId} = useParams();
  const event = useSelector(loadEvent(eventId));
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  // const currentUser = useSelector(getCurrentUser);
  // const [currentPosition, setCurrentPosition] = useState(getUserPosition(currentUser.id));
  // const participants = useSelector(getEventParticipants(event.id));
  const updateParticipantPositions = () => {
    // setParticipantPositions(fetchParticipantPositions());
    // renderParticipantPositions();
  };
  const [participantPositions, setParticipantPositions] = useState(updateParticipantPositions());
  const [showPointViewForm, setShowPointViewForm] = useState(null);
  
  const openOnlineGame = (e) => {
    e.preventDefault();
    console.log(eventId)
    history.push(`/events/${eventId}/online-game`)
  }

  // useEffect(() => {
  //   if (!map) {
  //     setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: 37.773972, lng: -122.431297}}))
  //   };
  //   renderPins();
    
  // }, [mapRef]);

  // todo: differentiate playerpin and event pins, tie the markers to the pin info somehow

  const addMarker = (location, map, order) => {
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
    marker.addListener(map, 'click', (event) => {
      setShowPointViewForm(marker.order);
  })};

  const renderParticipantPositions = () => {
    participantPositions.forEach(position => {
      addMarker(position, map)
    })
  };


  setInterval(updateParticipantPositions, 30000);

  const renderPins = () => {
    event?.pins?.forEach(pin => {
      addMarker(pin.location, map)
    })
  }

  // useEffect(() => {

  //   if (coords.length > 1) {
  //       renderPath();
  //   } 

  // }, [coords])

  return (
    <div className="view_map flex-col align-center">
      <img src={PlayGame} alt="play game" />
      <Button onClick={openOnlineGame}>Play Online Game</Button>
    </div>
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