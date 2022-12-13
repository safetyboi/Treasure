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

Code Snippet: Find address of the first pin of the map 
```
const geocoder = new window.google.maps.Geocoder();

let address = await geocoder.geocode({location: firstPin.location});
if (address.results[0]) {
  address = address.results[0].formatted_address;
} else {
  address = "Location Unavailable"
};
```
