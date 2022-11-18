

const GameOver = () => {
    return (
        <>
        <div>
            Gameover!
        </div>
        <br />
        <div>Your Stats:</div>
        <br />
        <div>Remaining Time: {remainingTime}</div>
        <br />
        <div>Distance Traveled: {distance}</div>
        <br />
        <div>Time Spent Walking: {timeWalked}</div>
        <br />
        <div>Time Spent Pondering: {thinkingTime}</div>
        </>
    )
}

export default GameOver;

//remainingTime, distance, timeWalked, thinkingTime