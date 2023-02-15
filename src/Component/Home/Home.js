import React, { useState, useEffect, useRef } from 'react'
import './Home.css'

function Home() {
    const [bingoNo, setBingoNo] = useState(0)
    const [ticketBoard, setTicketBoard] = useState({})
    const [totalTime, setTotalTime] = useState(180);
    let guessNoInterval = useRef(), timeInterval = useRef();

    useEffect(() => {
        refreshBingoBoard();
    }, [])

    useEffect(() => {
        if (totalTime === 0) {
            clearInterval(timeInterval.current);
            clearInterval(guessNoInterval.current)
            setBingoNo(0)
        }
    }, [totalTime])

    //Generate random nos between 1-99
    const generateRandomNos = () => {
        return Math.floor((Math.random() * 99) + 1)
    }

    //generate bingo nos
    const generateBingoNos = () => {
        guessNoInterval.current = setInterval(() => {
            let randomNo = generateRandomNos();
            setBingoNo(randomNo);
            if (Object.values(ticketBoard).some(item => item === false)) {
                if (ticketBoard[randomNo] !== undefined) {
                    ticketBoard[randomNo] = true
                    setTicketBoard({ ...ticketBoard });
                }
            }
            else {
                clearInterval(guessNoInterval.current);
                clearInterval(timeInterval.current);
            }
        }, 500)
    }

    //handle start btn 
    const onStartBtn = () => {
        if (totalTime === 0)
            setTotalTime(180);
        timeInterval.current = setInterval(() => { setTotalTime(prevTime => prevTime - 1) }, 1000)
        generateBingoNos()
    }

    //handle refresh btn
    const onRefreshBtn = () => {
        clearInterval(guessNoInterval.current);
        clearInterval(timeInterval.current);
        setBingoNo(0)
        setTotalTime(180)
        refreshBingoBoard();
    }

    //generate bingo board
    const refreshBingoBoard = () => {
        let arr = {};
        while (Object.keys(arr).length < 20) {
            let randomNo = generateRandomNos();
            arr[randomNo] = false;
        }
        setTicketBoard(arr);
    }

    return (
        <div className='homeWrapper'>
            <span className='headerText'>Bingo Board</span>

            <p>
                <span>Bingo No - {bingoNo}</span>
                <span style={{ marginLeft: '20px' }}>Time left - {totalTime}s</span>
            </p>

            <div className='boardWrapper'>
                {
                    Object.keys(ticketBoard).map((item, i) => (
                        <span className={ticketBoard[item] ? 'guessedNoTrue' : 'guessedNoFalse'} key={i}>{item}</span>
                    ))
                }
            </div>

            <p>{(totalTime === 0 || Object.values(ticketBoard).every(item => item === true)) ? Object.values(ticketBoard).every(item => item === true)
                ? `Wohoo!!! you won - ${Math.floor(Math.random() * 11) * 10} Rs` : `Sorry you lost!!!` : "Game in-progress"}</p>

            <div className='btnWrapper'>
                <div className='innerBtnDiv'>
                    <button onClick={onStartBtn}>Start Game</button>
                    <button onClick={onRefreshBtn}>Refresh Board</button>
                </div>
            </div>
        </div>
    )
}

export default Home