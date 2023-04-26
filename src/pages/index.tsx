import { type NextPage } from "next";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import PomodoroTimer from "../components/pomoTimer/pomodoro-timer";
import NoteDisplay from "../components/note/notes-display";
import BreakModal from "../components/modal/modal";
import PomodoroBreak from "../components/pomoTimer/pomodoro-break";
import Menu from "../components/uiMisc/menu";
import GlobalTimer from "../components/pomoTimer/timer-template";
import { toast } from "react-toastify";

const Home: NextPage = () => {
  const [openBreakModal, setOpenBreakModal] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);
  const [workMin, setWorkMin] = useState("0");
  const [breakMin, setBreakMin] = useState("0");
  const { data: sessionData } = useSession();
  const filter = "all";

  return (
    <>
      <Head>
        <title>PomoStation</title>
        <meta
          name="description"
          content="Productivity station that takes inspiration from the pomodoro study method."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col">
        <div className="flex px-4">
          <div className="grid w-full self-center p-4 text-end text-2xl text-black">
            {sessionData ? (
              <div className="justify-self-center">
                <Image
                  src={sessionData.user.image || "null"}
                  width="40"
                  height="40"
                  alt="profile-picture"
                  onClick={() => {
                    setOpenMenuModal(true);
                  }}
                  className="rounded-full"
                />
              </div>
            ) : (
              <span className="flex place-content-center place-items-center">
                <button
                  className="btn-blue"
                  onClick={
                    sessionData
                      ? () => {
                          signOut()
                            .then(() => {
                              toast.success("See you next time", {
                                autoClose: 3000,
                                position: "top-right",
                              });
                            })
                            .catch(() => {
                              toast.error("Unable to sign out");
                            });
                        }
                      : () => {
                          signIn("discord", {
                            callbackUrl: "http://localhost:3000/",
                          })
                            .then((res) => {
                              if (res?.ok) {
                                toast.success("Welcome", {
                                  autoClose: 3000,
                                  position: "top-right",
                                });
                              }
                            })
                            .catch(() => {
                              toast.error("Unable to sign in");
                            });
                        }
                  }
                >
                  {sessionData ? "Sign out" : "Sign in"}
                </button>
                to take notes!
              </span>
            )}
          </div>
        </div>

        <div className="flex place-content-center text-center">
          <PomodoroTimer workMin={workMin} setIsBreak={setOpenBreakModal} />
        </div>
        <div className="self-center">
          <div className="flex place-content-end">
            <GlobalTimer
              title="Work interval"
              timerMin={workMin}
              setTimerMin={setWorkMin}
            />
            <div className="">
              <div className="align-self-end flex flex-col">
                <button
                  className="triangle-btn-up m-1"
                  onClick={() => {
                    setWorkMin((parseInt(workMin.toString()) + 1).toString());
                  }}
                ></button>
                <button
                  className="triangle-btn-down m-1"
                  onClick={() => {
                    setWorkMin((parseInt(workMin.toString()) - 1).toString());
                  }}
                ></button>
              </div>
            </div>
          </div>
          <div className="flex place-content-end">
            <GlobalTimer
              title="Break interval"
              timerMin={breakMin}
              setTimerMin={setBreakMin}
            />
            <div className="">
              <div className="align-self-end flex flex-col">
                <button
                  className="triangle-btn-up m-1"
                  onClick={() => {
                    setBreakMin((parseInt(breakMin.toString()) + 1).toString());
                  }}
                ></button>
                <button
                  className="triangle-btn-down m-1"
                  onClick={() => {
                    setBreakMin((parseInt(breakMin.toString()) - 1).toString());
                  }}
                ></button>
              </div>
            </div>
          </div>
        </div>
        {openBreakModal && (
          <BreakModal
            openBreakModal={openBreakModal}
            setOpenBreakModal={setOpenBreakModal}
          >
            <PomodoroBreak
              breakMin={breakMin}
              setOpenBreakModal={setOpenBreakModal}
            />
          </BreakModal>
        )}
        {openMenuModal && (
          <BreakModal
            openBreakModal={openMenuModal}
            setOpenBreakModal={setOpenMenuModal}
          >
            <Menu setOpenBreakModal={setOpenBreakModal} />
          </BreakModal>
        )}
        <div className="mt-4 flex items-center justify-center font-sans">
          {sessionData && <NoteDisplay filter={filter} />}
        </div>
      </main>
    </>
  );
};

export default Home;
