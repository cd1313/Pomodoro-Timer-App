import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import breakBtn from "./assets/break.png";
import breakBtnPressed from "./assets/break_pressed.png";
import workBtn from "./assets/work.png";
import workBtnPressed from "./assets/work_pressed.png";
import playBtn from "./assets/play.png";
import resetBtn from "./assets/reset.png";
import breakGif from "./assets/break.gif";
import workGif from "./assets/work.gif";
import defaultGif from "./assets/default.gif";
import closeBtn from "./assets/close.png";
import bark from "./assets/seal-sound.mov";

function App() {

  const [timeLeft, setTimeLeft] = useState(25*60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [breakButtonImage, setBreakButtonImage] = useState(breakBtn);
  const [workButtonImage, setWorkButtonImage] = useState(workBtnPressed);
  const [homeButtonImage, setHomeButtonImage] = useState(playBtn);
  const [gifImage, setGifImage] = useState(defaultGif);
  const barkSound = new Audio(bark);

  const workMessages = [
    "Get seal-rious OwO",
    "LOCK INNNN",
    "Quit slacking off!!",
    "Get a job UwU",
    "Keep working, bum",
  ];

  const breakMessages = [
    "Time to bum around!",
    "Enjoy it while it lasts!",
    "You're wasting daylight!",
    "Don't seal-ebrate yet!",
    "Mental health? OwO"
  ];


  // update the "encouraging" messages
  useEffect(() => {
    let messageInterval: NodeJS.Timeout;

    if (isRunning) {
      const messages = isBreak? breakMessages : workMessages;

      setEncouragement(messages[0]);  // initialization
      let idx = 1
    
      messageInterval = setInterval(() => {
        setEncouragement(messages[idx]);
        idx = (idx+1) % messages.length;
      }, 4000); // change every 4 sec
    } else {
      setEncouragement("");
    }

    return () => clearInterval(messageInterval);
  }, [isRunning, isBreak]);


  // make the timer count down
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      // setInterval: will repeatedly update every 1000 ms (1 s)
      timer = setInterval(() => {
        setTimeLeft(prev => prev-1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);


  // make seal bark noise when timer ends
  useEffect(() => {
    if (timeLeft == 0 && isRunning) {
      barkSound.play().catch(err => {
        console.error("Audio play failed:", err);
      });
      setIsRunning(false);
      setHomeButtonImage(playBtn);
      setGifImage(defaultGif);
      setTimeLeft(isBreak ? 5*60 : 25*60);
    }
  }, [timeLeft]);

  // format the timer as string
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds/60).toString().padStart(2, "0");
    const s = (seconds%60).toString().padStart(2, "0");

    return `${m}:${s}`;
  };


  // switch between break and work mode
  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setBreakButtonImage(breakMode ? breakBtnPressed : breakBtn);
    setWorkButtonImage(breakMode ? workBtn : workBtnPressed);
    setHomeButtonImage(playBtn);
    setGifImage(defaultGif);
    setTimeLeft(breakMode ? 5*60 : 25*60);
  }

  
  // handle the start/stop button being clicked
  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
      setHomeButtonImage(resetBtn);
      setGifImage(isBreak ? breakGif : workGif)
    } else {
      setIsRunning(false);
      setHomeButtonImage(playBtn);
      setTimeLeft(isBreak ? 5*60 : 25*60);
      setGifImage(defaultGif);
    }
  };


  const handleCloseClick = () => {
    if (window.electronAPI?.closeApp) {
      window.electronAPI.closeApp();
    } else {
      console.warn("Electron API not available.");
    }
  }


  return (
    <div className="home-container" style={{position: "relative"}}>
      <div>
        <button className="close-button" onClick={handleCloseClick}>
          <img src={closeBtn} alt="Close"/>
        </button>
      </div>

      <div className="home-content">
        <div className="home-controls">
          <button className="image-button" onClick={() => switchMode(false)}>
            <img src={workButtonImage} alt="Work"/>
          </button>

          <button className="image-button" onClick={() => switchMode(true)}>
            <img src={breakButtonImage} alt="Break"/>
          </button>
        </div>

        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
          {encouragement}
        </p>
        <h1 className="home-timer">{formatTime(timeLeft)}</h1>
        <img src={gifImage} className="gif-image"/>
        <button className="home-button" onClick={handleClick}>
          <img src={homeButtonImage} alt="Button Icon"/>
        </button>
      </div>
    </div>
  );
}

export default App;
