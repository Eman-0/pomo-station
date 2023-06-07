import type { Dispatch, SetStateAction} from "react";
import { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import clsx from "clsx";

const PomodoroTimer = () => {
  const prevTimerMins = useRef(1);
  const prevBreakMins = useRef(1);
  const [[timerMins, timerSecs], setTime] = useState([prevTimerMins.current, 0]);
  const [[breakMins, breakSecs], setBreakTime] = useState([prevBreakMins.current, 0]);

  const [isActive, setIsActive] = useState(false);
  const [isTimerBreak, setIsTimerBreak] = useState(false);
  const [isGreenButtonActive, setIsGreenButtonActive] = useState(false);
  const [playAlarm] = useSound(
    "assets/198841_bone666138_analog-alarm-clock.wav"
  );

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (isTimerBreak) {
      setBreakTime([prevBreakMins.current, 0]);
    } else {
      setTime([prevTimerMins.current, 0]);
    }
  }, [isTimerBreak]);

  const tick = useCallback(
    ({ mins, secs, setTickDown }: { mins: number; secs: number; setTickDown: Dispatch<SetStateAction<[number, number]>> }) => {
      if (mins === 0 && secs === 0) {
        resetTimer();
        playAlarm()
        setTimeout(() => setIsTimerBreak(!isTimerBreak), 5600);
      } else if (secs === 0) {
        setTickDown([mins - 1, 59]);
      } else {
        setTickDown([mins, secs - 1]);
      }
    },
    [isTimerBreak, playAlarm, resetTimer]
  );

  useEffect(() => {
    if (isActive && isTimerBreak === false) {
      const mins = timerMins;
      const secs = timerSecs;
      const setTickDown = setTime;
      const timerId = setInterval(() => tick({ mins, secs, setTickDown }), 1000);
      return () => clearInterval(timerId);
    }
    if (!isActive && isTimerBreak === false) {
      // setTime([timerMins, 0]);
      prevTimerMins.current = timerMins;
    }

    if (isActive && isTimerBreak === true) {
      const mins = breakMins;
      const secs = breakSecs;
      const setTickDown = setBreakTime;
      const timerId = setInterval(() => tick({ mins, secs, setTickDown }), 1000);
      return () => clearInterval(timerId);
    }
    if (!isActive && isTimerBreak === true) {
      // setBreakTime([breakMins, 0]);
      prevBreakMins.current = breakMins;
    }
  }, [
    isActive,
    timerMins,
    tick,
    isTimerBreak,
    timerSecs,
    breakMins,
    breakSecs,
  ]);

  const toggle = () => {
    setIsActive(!isActive);
    setIsGreenButtonActive(!isGreenButtonActive);
  };

  const toggleTimerSwitch = () => {
    setIsTimerBreak(!isTimerBreak);
  };
  const toggleMinutesUp = () => {
    if (isTimerBreak) {
      if (breakMins + 1 > 59) {
        setBreakTime([1, 0]);
        
      } else {
        setBreakTime([breakMins + 1, 0]);
      }
    } else {
      if (timerMins + 1 > 59) {
        setTime([1, 0]);
      } else {
        setTime([timerMins + 1, 0]);
      }
    }
  };

  const toggleMinutesDown = () => {
    if (isTimerBreak) {
      if (breakMins - 1 < 1) {
        setBreakTime([59, 0]);
      } else {
        setBreakTime([breakMins - 1, 0]);
      }
    } else {
      if (timerMins - 1 < 1) {
        setTime([59, 0]);
      } else {
        setTime([timerMins - 1, 0]);
      }
    }
  };

  const Study = () => (
    <div>{`${timerMins.toString().padStart(2, "0")}:${timerSecs
      .toString()
      .padStart(2, "0")}`}</div>
  );

  const Break = () => (
    <div>
      {`${breakMins.toString().padStart(2, "0")}:${breakSecs
        .toString()
        .padStart(2, "0")}`}
    </div>
  );

  // #623e25 43291F
  return (
    <div className="m-4 flex w-5/6 flex-col rounded-2xl border-4 border-solid border-[#242223] bg-[#504136] text-center md:w-3/4 md:max-w-md lg:w-3/4 lg:max-w-lg">
      <div className="m-2 flex place-content-center">
        <div className="flex place-content-end">
          <div className="self-center">
            <div className="align-self-end flex flex-col">
              <button
              disabled={isGreenButtonActive}
                className="triangle-btn-up m-1"
                onClick={toggleMinutesUp}
              ></button>
              <button
              disabled={isGreenButtonActive}
                className="triangle-btn-down m-1"
                onClick={toggleMinutesDown}
              ></button>
            </div>
          </div>
        </div>
        <div className="ml-4 w-1/2 rounded-2xl border-4 border-solid border-[#170f10] bg-[#939879] p-2 text-5xl text-[#262425]">
          <div className="text-sm">
            <p>{isTimerBreak ? "BREAK" : "STUDY"}</p>
          </div>
          <div className="">{isTimerBreak ? <Break /> : <Study />}</div>
        </div>

        <div className="ml-4 flex flex-col place-content-center">
          <button
            disabled={isGreenButtonActive}
            className={clsx(isTimerBreak ? "btn-yellow" : "btn-blue-round")}
            onClick={toggleTimerSwitch}
          ></button>
          <button
            className={clsx(isGreenButtonActive ? "btn-red" : "btn-green", "mt-4")}
            onClick={toggle}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
