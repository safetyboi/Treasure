import { Wrapper } from "@googlemaps/react-wrapper";
import { useRef, useState, useEffect } from "react";


export const EventIndexMap = () => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);


  useEffect(() => {
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, { zoom: 12, center: {lat: 37.773259546305965, lng: -122.44496350133707}}))
    };
    
  }, [mapRef]);

  return (
    <div className="google-map-container" ref={mapRef}>Map</div>
  )

}



const EventIndexMapWrapper = () => {

  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY} libraries={["geometry"]}>
      <EventIndexMap/>
    </Wrapper>
  )
};


export default EventIndexMapWrapper;