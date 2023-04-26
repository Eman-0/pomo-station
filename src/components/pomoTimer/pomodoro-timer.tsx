import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import useSound from "use-sound";

const PomodoroTimer = ({
  workMin,
  setIsBreak,
}: {
  workMin: string;
  setIsBreak: Dispatch<SetStateAction<boolean>>;
}) => {
  const [[mins, secs], setTime] = useState([parseInt(workMin), 0]);
  const [isActive, setIsActive] = useState(false);
  const [playAlarm] = useSound(
    "assets/198841_bone666138_analog-alarm-clock.wav"
  );

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTime([parseInt(workMin), 0]);
  }, [workMin]);

  const tick = useCallback(() => {
    if (mins === 0 && secs === 0) {
      resetTimer();
      setIsBreak(true);
      playAlarm();
    } else if (secs === 0) {
      setTime([mins - 1, 59]);
    } else {
      setTime([mins, secs - 1]);
    }
  }, [mins, playAlarm, resetTimer, secs, setIsBreak]);

  useEffect(() => {
    if (isActive) {
      const timerId = setInterval(() => tick(), 1000);
      return () => clearInterval(timerId);
    }
    if (!isActive) {
      setTime([parseInt(workMin), 0]);
    }
  }, [isActive, workMin, tick]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  // #623e25
  return (
    <div className="m-4 flex w-5/6 flex-col rounded-md border-4 border-solid border-[#242223] bg-[#623e25] text-center md:w-3/4 md:max-w-md lg:w-3/4 lg:max-w-lg">
      <div className="flex place-content-center m-2">
        <div className="border-solid rounded-md border-4 text-[#262425] text-5xl border-[#170f10] bg-[#939879] p-2 w-1/2">
          <div className="">
            {`${mins.toString().padStart(2, "0")}:${secs
              .toString()
              .padStart(2, "0")}`}
          </div>
        </div>

        <div className="flex flex-col place-content-center">
          <button className="btn-green" onClick={toggle}></button>
          <button className="btn-red" onClick={resetTimer}></button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
