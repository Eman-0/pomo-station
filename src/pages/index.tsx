import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import PomodoroTimer from "../components/pomoTimer/pomodoro-timer";
import Clock from "../components/clock/clock";
import Modal from "../components/modal/modal";
import { api } from "../utils/api";
import NoteDisplay from "../components/notesUI/note-display";

const Home: NextPage = () => {
  const [isBreak, setIsBreak] = useState(false);
  const hello = api.example.hello.useQuery({ text: "from api" });

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
          
        </div>
        <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading api query..."}
            </p>
            <AuthShowcase />
          </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      {sessionData && <NoteDisplay/>}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};


