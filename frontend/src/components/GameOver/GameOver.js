import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './GameOver.scss';
import '../Events/Event.scss';

const GameOver = ({remainingTime, distance, timeWalked, thinkingTime}) => {
	const roundedTime = Math.round(remainingTime);
  const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);

	const handleShow = () => {
		const timer = setTimeout(() => {
			setShow(true);
		}, 3000);
		return () => clearTimeout(timer);
	}

	useEffect(() => {
		handleShow();
	}, []);

	return (
		<>
			<div className='game-over-page flex-col align-center justify-center'>
				<h1>{remainingTime > 0 ? 'You Win!' : 'You Lose!'}</h1>
				<h2>YOUR STATS</h2>
				{/* <div className='flex-row'>
					<p className='game_over_key'>Remaining Time</p>
					<p className='game_over_value'>{remainingTime}</p>
				</div> */}
				<div className='stats_details'>
					<div className='flex-row'>
						<p className='game_over_key'>Distance Traveled</p>
						<p className='game_over_value'>{distance === 1 ? `${distance} kilometer` : `${distance} kilometers` }</p>
					</div>
					<div className='flex-row'>
						<p className='game_over_key'>Time Spent Walking</p>
						<p className='game_over_value'>{timeWalked === 1 ? `${timeWalked} minute` : `${timeWalked} minutes` }</p>
					</div>
					<div className='flex-row'>
						<p className='game_over_key'>Time Spent Pondering</p>
						<p className='game_over_value'>{thinkingTime === 1 ? `${thinkingTime} minute` : `${thinkingTime} minutes` }</p>
				</div>
					{remainingTime > 0 && 
						<div className='flex-row'>
							<p className='game_over_key'>Remaining Time</p>
							<p className='game_over_value'>{roundedTime === 1 ? `${roundedTime} minute` : `${roundedTime} minutes` }</p>
						</div>
					}
			</div>
				
				<div className="buttons-container flex-row">
					{/* <Link className="button-link" to={'/testmap'}>
							<Button className="lobby-button" >Play Again!</Button>
					</Link> */}
					<Link className="button-link" to={'/events/new'}>
						<Button className="lobby-button" >Try Creating an Event!</Button>
					</Link>
					<Link className="button-link" to={'/events'}>
						<Button className="lobby-button">Find Another Event!</Button>
					</Link>
				</div>
			</div>
			
			<Modal show={show} 
        onHide={handleClose}
        className="event_modal">
        <Modal.Header closeButton>
          <Modal.Title>Thanks for checking our app!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Want to know more about our projects?
          You can browse around this app, check our portfolios, or shoot us a message.
          We'd love to hear from you and collaborate to create something awesome.
        </Modal.Body>
        <Modal.Footer className="flex-row">
          <Link to='/about'><Button>About Us</Button></Link>
          <Link to="#"
            className="modal_email flex-row align-center"
            onClick={e => {
              e.preventDefault();
              window.location = 'mailto:treasure.mern.team@gmail.com';
            }}>
            Email Us
          </Link>
        </Modal.Footer>
      </Modal>
		</>
	)
}

export default GameOver;

//remainingTime, distance, timeWalked, thinkingTime