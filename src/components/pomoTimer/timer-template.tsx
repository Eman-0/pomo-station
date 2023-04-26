import clsx from "clsx";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

function useClickOutside({
  ref,
  callback,
  enabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: RefObject<any>;
  callback: () => void;
  enabled: boolean;
}) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (!enabled) {
      return;
    }
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (ref.current && !ref.current.contains(event.target)) {
        callbackRef.current();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, enabled]);
}
function GlobalTimer({
  title,
  timerMin,
  setTimerMin,
}: {
  title: string;
  timerMin: string;
  setTimerMin: Dispatch<SetStateAction<string>>;
}) {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [timerMinutes, setTimerMinutes] = useState(timerMin);

  useEffect(() => {
    if (parseInt(timerMin) < 0){
      setTimerMin("59");
    }
    if (parseInt(timerMin) > 59) {
      setTimerMin("0");
    }
    setTimerMinutes(timerMin);
  }, [timerMin]);

  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback() {
        setTimerMin(timerMinutes);
      setEditing(false);
    },
  });
  return (
    <div
      className={clsx(
        editing && "editing",
        "m-2 flex content-between items-center"
      )}
      ref={wrapperRef}
    >
      <label
        className={clsx(editing && "hidden", "text-grey-darkest w-full")}
        onDoubleClick={(e) => {
          setEditing(true);
          e.currentTarget.focus();
        }}
      >
        {title + ": " + timerMinutes}
      </label>
      <input
        className={clsx(editing ? "inline-block w-full" : "hidden")}
        value={timerMinutes}
        ref={inputRef}
        onChange={(e) => {
          const newText = e.currentTarget.value;
          setTimerMinutes(newText);
        }}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                setTimerMin(e.currentTarget.value);
                setEditing(false);
            }
        }}
      />
    </div>
  );
}

export default GlobalTimer;
