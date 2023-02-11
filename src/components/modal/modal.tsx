import type { Dispatch, SetStateAction } from "react";
import PomodoroBreak from "../pomoTimer/pomodoro-break";

const Modal = ({setIsDisplayModal} : {setIsDisplayModal :Dispatch<SetStateAction<boolean>>}) => {
  return (
    <section>
      <PomodoroBreak setIsDisplayModal={setIsDisplayModal}/>
      <button>close</button>
    </section>
  );
  
};

export default Modal;
