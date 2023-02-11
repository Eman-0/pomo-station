import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import PomodoroTimer from "../components/pomoTimer/pomodoro-timer";
import Clock from "../components/clock/clock";
import Modal from "../components/modal/modal";
import Notes from "../components/notesUI/notes";

const Home: NextPage = () => {
  const [isBreak, setIsBreak] = useState(false);

  return (
    <>
      <Head>
        <title>PomoStation</title>
        <meta
          name="description"
          content="Productivity station that takes inspiration from the pomodoro study method."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Clock />
          <PomodoroTimer setIsBreak={setIsBreak} />
          {isBreak ? <Modal setIsDisplayModal={setIsBreak} /> : null}
          <Notes/>
        </div>
      </main>
    </>
  );
};

export default Home;
