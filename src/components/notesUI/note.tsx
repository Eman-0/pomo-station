import type { FC} from "react";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import NoteModal from "../modal/note-modal";
import UpdateNote from "./update-note";
import type { INote } from "../../utils/note-type";
import { api } from "../../utils/api";
import { useQueryClient } from "@tanstack/react-query";

type NoteItemProps = {
  note: INote;
};

const NoteItem: FC<NoteItemProps> = ({ note }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: deleteNote } = api.user
.deleteNote.useMutation({
    onSuccess: async () => {
     await queryClient.invalidateQueries([["getNotes"], { limit: 10, page: 1 }]);
      setOpenNoteModal(false);
    },
    onError() {
      setOpenNoteModal(false);
    },
  });
  // might need to edit prisma schema to string
  const onDeleteHandler = (noteId: string) => {
    if (window.confirm("Are you sure")) {
      deleteNote({ noteId: noteId});
    }
  };
  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md flex flex-col justify-between">
        <div className="details">
          <h4 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
            {note.title.length > 20
              ? note.title.substring(0, 20) + "..."
              : note.title}
          </h4>
          <p className="mb-3 font-normal text-ct-dark-200">
            {note.description.length > 210
              ? note.description.substring(0, 210) + "..."
              : note.description}
          </p>
        </div>
        <div className="relative border-t border-slate-300 flex justify-between items-center">
          <span className="text-ct-dark-100 text-sm">
            {format(parseISO(note.createdAt.toISOString()), "PPP")}
          </span>
          <div
            onClick={() => setOpenSettings(!openSettings)}
            className="text-ct-dark-100 text-lg cursor-pointer"
          >
            <i className="bx bx-dots-horizontal-rounded"></i>
          </div>
          <div
            id="settings-dropdown"
            className={twMerge(
              `absolute right-0 bottom-3 z-10 w-28 text-base list-none bg-white rounded divide-y divide-gray-100 shadow`,
              `${openSettings ? "block" : "hidden"}`
            )}
          >
            <ul className="py-1" aria-labelledby="dropdownButton">
              <li
                onClick={() => {
                  setOpenSettings(false);
                  setOpenNoteModal(true);
                }}
                className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-pencil"></i> Edit
              </li>
              <li
                onClick={() => {
                  setOpenSettings(false);
                  onDeleteHandler(note.id);
                }}
                className="py-2 px-4 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-trash"></i> Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
      <NoteModal
        openNoteModal={openNoteModal}
        setOpenNoteModal={setOpenNoteModal}
      >
        <UpdateNote note={note} setOpenNoteModal={setOpenNoteModal} />
      </NoteModal>
    </>
  );
};

export default NoteItem;
