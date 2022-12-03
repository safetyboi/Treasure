import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Footer from '../NavBar/Footer';
import './DemoLobby.scss';
import Calendar from '../../assets/images/Calendar.svg';
import Treasure from '../../assets/images/Treasure.svg';

const DemoLobby = () => {
    return (
      <section className='demo_page'>
        <div className='flex-row justify-center'>
          <div className='left_demo flex-col align-center'>
            <img src={Treasure} alt="demo_hunt" />
            <Link className="lobby-link" to={'/events/638a9e6fcbf4f1662f53440a/online-game'}>
              <Button className="lobby-button" >Try Our Demo Hunt!</Button>
            </Link>
          </div>

          <div className='rigth_demo flex-col align-center'>
            <img src={Calendar} alt="demo_book" />
            <Link className="lobby-link" to={'/events/new'}>
                <Button className="lobby-button"> Create Your Own!</Button>  
            </Link>
          </div>
        </div>
      </section>
    )
}

export default DemoLobby;