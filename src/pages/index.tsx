import { type NextPage } from "next";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import PomodoroTimer from "../components/pomoTimer/pomodoro-timer";
import NoteDisplay from "../components/note/notes-display";
import BreakModal from "../components/modal/modal";
import Menu from "../components/uiMisc/menu";
import { toast } from "react-toastify";

const Home: NextPage = () => {
  const [openBreakModal, setOpenBreakModal] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);
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
        <link rel="icon" href="/icons8-tomato-color-32.png" />
      </Head>
      <div className="main-footer-container flex min-h-screen flex-col justify-between bg-gradient-to-b from-lime-500 via-lime-400 to-lime-300">
        <main className="flex flex-col items-center">
          <div className="flex w-full place-content-center self-center p-4 text-center text-2xl text-black">
            {sessionData ? (
              <div className="justify-self-center">
                <Image
                  src={sessionData.user.image || "/icons8-tomato-color-32.png"}
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
              <span className="col-start-2 col-end-3 flex place-content-center place-items-center">
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
                          signIn("discord", {})
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
                <p className="ml-2">to take notes!</p>
              </span>
            )}
          </div>

          <PomodoroTimer />

          {openMenuModal && (
            <BreakModal
              openBreakModal={openMenuModal}
              setOpenBreakModal={setOpenMenuModal}
            >
              <Menu setOpenBreakModal={setOpenBreakModal} />
            </BreakModal>
          )}

          {sessionData && <NoteDisplay filter={filter} />}
        </main>
        <footer className="bottom-0 flex h-4 place-content-center text-xs">
          <span>
            {" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://icons8.com/icon/18102/tomato"
              className="text-blue-500"
            >
              Tomato
            </a>
            {", "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://icons8.com/icon/7913/no-audio"
              className="text-blue-500"
            >
              No Audio
            </a>
            {", "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://icons8.com/icon/2795/audio"
              className="text-blue-500"
            >
              Audio
            </a>{" "}
            icons by{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://icons8.com"
              className="text-blue-500"
            >
              Icons8
            </a>
          </span>
        </footer>
      </div>
    </>
  );
};

export default Home;
