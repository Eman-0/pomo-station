import type { Dispatch, SetStateAction} from "react";
import { useEffect, useState } from "react";
import Button from "../uiMisc/button";

const PomodoroTimer = ({setIsBreak} : {setIsBreak :Dispatch<SetStateAction<boolean>>}) => {
  const [[mins, secs], setTime] = useState([0, 1]);
  const [isActive, setIsActive] = useState(false);

  const tick = () => {
    if (mins === 0 && secs === 0) {
        resetTimer();
        setIsBreak(true);
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
    setIsActive(false);
    setTime([25, 0]);
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div style={{ color: "white" }}>
        <div>
          {`${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`}
        </div>
        
        <Button title="Reset" onClickHandle={resetTimer} />
        <Button title={isActive ? "Stop" : "Start"} onClickHandle={toggle} />
      </div>
    </>
  );
};

export default PomodoroTimer;
