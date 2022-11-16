// src/App.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import EventIndex from './components/Events/EventIndex';
// import EventCompose from './components/Events/EventCompose';
import Profile from './components/Profile/Profile';
import Footer from './components/NavBar/Footer';
import PlanningMap from './components/Maps/PlanningMap';
import { getCurrentUser } from './store/session';
import OnlineGameMap from './components/Maps/OnlineGameMap';
import ImageUploader from '../src/components/AWSTest/ImageUploader'


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

        <ProtectedRoute exact path="/events" component={EventIndex} />
        <ProtectedRoute exact path="/profile" component={Profile} />
        {/* <ProtectedRoute exact path="/events/new" component={EventCompose} /> */}
        <ProtectedRoute exact path="/testmap" component={PlanningMap} />
        <ProtectedRoute exact path="/onlinegame" component={OnlineGameMap} />
        <ProtectedRoute exact path="/imageupload" component={ImageUploader} />
      </Switch>
    </>
  );
}

export default App;
