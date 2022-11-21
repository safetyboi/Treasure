
import { useHistory, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import PlayGame from '../../assets/images/PlayGame.svg';

const EventLobby = () => {
  const history = useHistory();
  const {eventId} = useParams();

  const openOnlineGame = (e) => {
    e.preventDefault();
    history.push(`/events/${eventId}/online-game`)
  }

  const openLiveGame = (e) => {
    e.preventDefault();
    history.push(`/events/${eventId}/live-game`)
  }

  return (
    <div className="view_map flex-col align-center">
      <img src={PlayGame} alt="play game" />
      <Button onClick={openOnlineGame}>Play Online Game</Button>
      {/* <Button onClick={openLiveGame}>Play Live Game</Button> */}
    </div>
  )
};


export default EventLobby;