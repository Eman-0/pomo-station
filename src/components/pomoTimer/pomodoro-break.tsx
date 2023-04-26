import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Button from "../uiMisc/button";
import useSound from "use-sound";

const PomodoroBreak = ({setOpenBreakModal, breakMin} : {setOpenBreakModal :Dispatch<SetStateAction<boolean>>, breakMin: string} ) => {
    const [[mins, secs], setTime] = useState([parseInt(breakMin), 2]);
    const [isActive, setIsActive] = useState(false);
    const [isBreakOver, setIsBreakOver] = useState(false);
    const [playAlarm] = useSound("assets/198841_bone666138_analog-alarm-clock.wav")
    
    const resetTimer = useCallback(() => {
      setIsActive(true);
      setIsBreakOver(false);
      setTime([parseInt(breakMin), 0]);
    },[breakMin]);

    const tick = useCallback(() => {
      if (mins === 0 && secs === 0) {
          resetTimer();
          playAlarm();
          setIsActive(false);
          setIsBreakOver(true);
      }
      else if (secs === 0) {
        setTime([mins - 1, 59]);
      } else {
        setTime([mins, secs - 1]);
      }
    },[mins, playAlarm, resetTimer, secs]);
  
    useEffect(() => {
      if (isActive) {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
      }
      if (!isActive){
        setTime([parseInt(breakMin), 0])
      }
      
    }, [isActive, breakMin, tick]);
  
    
  
    const closeTimer = () => {
      setIsActive(false);
      setTime([parseInt(breakMin),0]);
      setOpenBreakModal(false);
    }

    const toggle = () => {
      setIsActive(!isActive);
    };
  
    return (
      <>
        <div className="m-6 flex flex-col rounded bg-sky-400 text-center text-4xl">
      <div className="m-4 rounded bg-[#fcfafa]">
        <div className="flex place-content-center">
          <div className="self-center">
            {`${mins.toString().padStart(2, "0")}:${secs
              .toString()
              .padStart(2, "0")}`}
          </div>

          <div className="">
            <div className="align-self-end flex flex-col">
              <button className="triangle-btn-up m-1"></button>
              <button className="triangle-btn-down m-1"></button>
            </div>
          </div>
        </div>

        <div>
          <button className="btn-blue" onClick={resetTimer}>
            Reset
          </button>
          <button className="btn-blue" onClick={toggle}>
            {isActive ? "Stop" : "Start"}{" "}
          </button>
        </div>
      </div>
    </div>
          {!isBreakOver && <Button title="Cancel" onClickHandle={closeTimer} />}
          {isBreakOver && <Button title="Close" onClickHandle={closeTimer}/>}
        
      </>
    );
  };

export default PomodoroBreak;