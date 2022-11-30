import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import './GameOver.scss'

const GameOver = ({remainingTime, distance, timeWalked, thinkingTime}) => {

    const roundedTime = Math.round(remainingTime);

return (
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
                    <Button className="lobby-button" >Find Another Event!</Button>
                </Link>
            </div>
        </div>
    )
}

export default GameOver;

//remainingTime, distance, timeWalked, thinkingTime