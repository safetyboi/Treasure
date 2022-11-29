// src/App.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import DemoLobby from './components/DemoLobby/DemoLobby';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import EventIndex from './components/Events/EventIndex';
// import EventCompose from './components/Events/EventCompose';
import Profile from './components/Profile/Profile';
import Footer from './components/NavBar/Footer';
import PlanningMapWrapper from './components/Maps/PlanningMap';
import UpdateEventPlanningMapWrapper from './components/Maps/UpdateEventPlanningMap';
import { getCurrentUser } from './store/session';
import OnlineGameMapWrapper from './components/Maps/OnlineGameMap';
import ImageUploader from '../src/components/AWSTest/ImageUploader';
import LiveGameMapWrapper from './components/Maps/LiveGameMap';
import EventLobby from './components/Events/EventLobby';


function App() {

  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true));
  }, [dispatch]);

  return loaded && (
    <>
      <NavBar/>
      <Switch>
        <AuthRoute exact path="/" component={MainPage} />
        <AuthRoute exact path="/login" component={LoginForm} />
        <AuthRoute exact path="/signup" component={SignupForm} />

        <ProtectedRoute exact path="/events/:eventId/live-game" component={LiveGameMapWrapper} />
        <ProtectedRoute exact path="/events/:eventId/online-game" component={OnlineGameMapWrapper} />
        <ProtectedRoute exact path="/events/:eventId/update-event" component={UpdateEventPlanningMapWrapper} />
        <ProtectedRoute exact path="/events/new" component={PlanningMapWrapper} />
        <ProtectedRoute exact path="/events/:eventId" component={EventLobby} />
        <ProtectedRoute exact path="/events" component={EventIndex} />
        <ProtectedRoute exact path="/profile" component={Profile} />
        <ProtectedRoute exact path="/online-game" component={OnlineGameMapWrapper} />
        <ProtectedRoute exact path="/onlinegame" component={OnlineGameMapWrapper} />
        <ProtectedRoute exact path="/imageupload" component={ImageUploader} />
        <ProtectedRoute exact path="/demo-lobby" component={DemoLobby} />
      </Switch>
    </>
  );
}

export default App;
