# Treasure
[Click here to view!](https://treasure-mhx1.onrender.com/)
<br>

## Background
Scavenger hunts are a popular form of entertainment, common in settings ranging from simple birthday parties to corporate team-building events to highly-organized clubs such as the [Hash house Harriers](https://en.wikipedia.org/wiki/Hash_House_Harriers). Treasure is a a MERN-stack web application which enables users to create, share and participate in digitally-enhanced scavenger hunts. The web app helps in the planning and creation of events, the distribution and organization of event information, and the tracking of participant's location and game status as they proceed along the game course. It leverages GPS location fetches, an intricate backend data structure, and a user-friendly interface to take the difficulty out of the planning and participation. Easily construct a connected set of event points on the map, create and trigger event clues upon participants' arrival, organize the needed supplies and costs, and share your event with the public or your community. During the event, track participants' locations and which events they have completed and automatically share with them important information at appropriate times.

Treasure is designed to be as flexible: Events can be a complex series of mini-games with clues and required responses, or they can simply by a series of GPS locations on a map, each revealed upon a participant's arrival at the former. These events can be published, shared, and replayed by other users long after the original event has occurred, allowing for great scavenger hunt game designs to be appreciated by a larger audience and for events to be created without having to plan them from scratch.

![image](https://user-images.githubusercontent.com/110148438/207213514-23171777-f3f5-4f08-a56d-b93c315e0f2d.png)
<br>

## Tech Stack
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
<br>
<br>

## Features
### User Authentication - Login/Signup
Treasure user authetntication allows user to create an account or login, either with their own account or as a demo user. Login is required before user is able to browse around the app. 

![Sign Up](https://user-images.githubusercontent.com/110148438/207214377-37934169-4f77-457e-8de2-6adce70e2a16.png)
<br>

### Event Planning
Logged in users can create, read, update, and delete their own events. An interactive map will be shown so users are able to create their own route and create each details in each points. Total distance, elevation gain, and estimated event duration will be automatically updated according to the user input.

![create_event](https://s9.gifyu.com/images/create_event47c6d01a4d76800d.gif)

Perhaps the biggest challenge of the event planning map is the deleting of pins amongst the ones the user has already placed when planning an event. Not only does the targeted pin need to be deleted, but all pins placed later in the event need their order to be decremented, and the route needs to be redrawn without passing their the location of the deleted pin. 

It was decided that a custom reducer function would be utilized to rebuild the array of pins, markers, and coordinates upon pin deletion. 

###PlanningMap.js
```javascript

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


```



A street address and starting location was acquired for each event by calling the Google Maps Geocoder API and passing in the coordinates of the event's first pin. This address is displayed to users so that they can easily locate the start of the event.  

```javascript
const geocoder = new window.google.maps.Geocoder();

let address = await geocoder.geocode({location: firstPin.location});
if (address.results[0]) {
  address = address.results[0].formatted_address;
} else {
  address = "Location Unavailable"
};
```
### Online Game Play

A major problem with starting a game was access to event data on initial page render. Pin location information was needed when rendering the map to render the first event pin, but that info was not available until the fetch event and pin thunks were dispatched. This problem was solved by adding a start button to the page – the game would not attempt to render the first pin until the user clicked start, ensure that pin data would be readily available.

###OnlineGameMap.js

```javascript

  const startGame = () => {
    setShowStartButton(false);
    setCoords(allCoords => [...allCoords, event.initCoords[0]])
    addLocationPin(event.initCoords[0], map);
    
    if (map) {
      window.google.maps.event.addListener(map, "click", (event) => {
        if (!showClueRef.current) {
          dartSound.play();
          setCoords(allCoords => [...allCoords, event.latLng])
          addLocationPin(event.latLng, map);     
        }
      });
    };
    
…

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
      setCurrentPosition({lat: marker.position.lat(), lng: marker.position.lng()});

  };


```

The game needs a way to track a user’s ‘location’ as she clicks around the map, searching for the next event pin. This is accomplished by an event listener bound to the map, changing her current position to wherever she clicks, and a custom Haversine Distance function, which compares her position to that of the target pin and releases the next clue if she is within a certain radius.

###OnlineGameMap.js
```javascript
    window.google.maps.event.addListener(map, "click", (event) => {
      if (!showClueRef.current) {
        dartSound.play();
        setCoords(allCoords => [...allCoords, event.latLng])
        addLocationPin(event.latLng, map);     
      }
    });
      
…

  function haversineDistance(mk1, mk2) {
    if (mk2) {
      const R = 6.378e+6; // Radius of the Earth in meters
      const rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
      const rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
      const difflat = rlat2-rlat1; // Radian difference (latitudes)
      const difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Radian difference (longitudes)
      
      const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
      return d;
    }
  }
  
  const pointReached = () => {
    return haversineDistance(currentPosition, grabPin(currentPinOrder).location[0]) < 500
  }
  
  const releaseClue = () => {
    if (pointReached()) {
      jingleSound.play();

      setTimeout(() => {
        if ( currentPinOrder !== 1) {
          alert(`You've reached point ${currentPinOrder}! Answer the question below to unlock directions to the next point!`)
        }
        renderEventPin(currentPinOrder);
        showClueUpdater(true)
      }, 500)
    }
  }

```

### Event Index Map

The event index map displays not only a list of all events, but an interactive map displaying each event’s location as a pin. These are rendered as custom Google Maps markers which display a label with the event’s name upon hover. Furthermore, clicking renders a pop-up displaying basic info about the event.

###EventIndexMap.js

```javascript

window.google.maps.event.addListener(map, "click", () => {
        setShowInfoBox(false);   
    });
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


```


