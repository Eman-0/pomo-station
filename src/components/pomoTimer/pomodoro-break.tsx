import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

const PomodoroBreak = ({setIsDisplayModal} : {setIsDisplayModal :Dispatch<SetStateAction<boolean>>} ) => {
    const [[mins, secs], setTime] = useState([0, 2]);
    const [isActive, setIsActive] = useState(true);
  
    const tick = () => {
      if (mins === 0 && secs === 0) {
          resetTimer();
          setIsActive(false);
          setIsDisplayModal(false);
      }
      else if (secs === 0) {
        setTime([mins - 1, 59]);
      } else {
        setTime([mins, secs - 1]);
      }
    };
  
    useEffect(() => {
      if (isActive) {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
      }
    }),
      [isActive];
  
    const resetTimer = () => {
      setIsActive(true);
      setTime([5, 0]);
    };
  
    return (
      <>
        <div style={{ color: "white" }}>
          <div>
            {`${mins.toString().padStart(2, "0")}:${secs
              .toString()
              .padStart(2, "0")}`}
          </div>
          
          <button onClick={resetTimer}>Reset</button>
        </div>
      </>
    );
  };

export default PomodoroBreak;