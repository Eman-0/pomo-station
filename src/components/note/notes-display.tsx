import { useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import ListItem from "./note-item";
import { toast } from "react-toastify";

interface NoteDisplayProps {
  filter: string;
}

const NoteDisplay = (props: NoteDisplayProps) => {
  const [text, setText] = useState("");

  const allTasks = api.todo.all.useQuery(undefined, {
    staleTime: 3000,
  });
  const utils = api.useContext();

  const addTask = api.todo.add.useMutation({
    async onMutate({ text }) {
      await utils.todo.all.cancel();
      const tasks = allTasks.data ?? [];
      utils.todo.all.setData(undefined, [
        ...tasks,
        {
          id: `${Math.random()}`,
          userId: "",
          completed: false,
          text,
          createdAt: new Date(),
        },
      ]);
      toast.success("Task added successfully", {
        autoClose: 3000,
        position: "top-right",
      });
    },
  });

  const clearCompleted = api.todo.clearCompleted.useMutation({
    async onMutate() {
      await utils.todo.all.cancel();
      const tasks = allTasks.data ?? [];
      utils.todo.all.setData(
        undefined,
        tasks.filter((t) => !t.completed)
      );
      toast.success("Tasks cleared successfully", {
        autoClose: 3000,
        position: "top-right",
      });
    },
  });

  const number = useIsMutating();
  useEffect(() => {
    // invalidate queries when mutations have settled
    // doing this here rather than in `onSettled()`
    // to avoid race conditions if you're clicking fast
    if (number === 0) {
      void utils.todo.all.invalidate();
    }
  }, [number, utils]);
  return (
    <div className="flex flex-col m-4 rounded-2xl bg-gradient-to-b from-stone-100 to-stone-50 p-6 shadow h-96 sm:h-5/6 md:h-5/6 w-5/6 sm:w-[30rem] md:w-[32rem]">
      <form onSubmit={(e) => {e.preventDefault(); addTask.mutate({ text }); setText("")}} className="mb-4 flex">
        <input
          type="text"
          value={text}
          className="
          m-2
          block
          w-5/6
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
        "
          placeholder="Enter TODOs here"
          autoFocus
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="m-2 flex-grow-0 rounded border-2 border-green-600 p-2 text-green-600 hover:bg-green-600 hover:text-white"
        >
          Add
        </button>
      </form>

      <ul className="flex flex-col overflow-y-auto">
        {/* These are here just to show the structure of the list items */}
        {/* List items should get the class `editing` when editing and `completed` when marked as completed */}
        {allTasks.data
          ?.filter((task) => {
            if (props.filter === "active") {
              return !task.completed;
            }
            if (props.filter === "completed") {
              return task.completed;
            }
            return true;
          })
          .map((task) => (
            <ListItem key={task.id} task={task} />
          ))}
      </ul>
      {/* This footer should be hidden by default and shown when there are todos */}
      <div className="text-end">
        {/* Hidden if no completed items are left ↓ */}
        {allTasks.data?.some((task) => task.completed) && (
          <button
            className="ml-2 flex-shrink-0 rounded border-2 border-red-600 p-2 text-red-600 hover:bg-red-600 hover:text-white"
            onClick={() => {
              clearCompleted.mutate();
            }}
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteDisplay;
