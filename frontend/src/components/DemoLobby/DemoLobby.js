import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './DemoLobby.scss';
import Footer from '../NavBar/Footer';
// import { Redirect } from 'react-router-dom'

const DemoLobby = () => {

    return (
        <>
        <div className="vertical-container">
        <div className="horizontal-container">
        <div className="lobby-buttons-container flex-row">
                <Link className="lobby-link" to={'/online-game'}>
            <Button className="lobby-button" >Try Our Demo Hunt!</Button>
                </Link>
                <div className="or-container">
                {/* <div>or...</div> */}
                </div>
                <Link className="lobby-link" to={'/testmap'}>
            <Button className="lobby-button"> Create Your Own!</Button>  
                </Link>
        </div>
        </div>
        </div>
        <Footer />
        </>
    )

}

export default DemoLobby;