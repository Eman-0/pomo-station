import { useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "../../utils/api";
import ListItem from "./note-item";
import { toast } from "react-toastify";

interface NoteDisplayProps {
  filter: string;
}

const NoteDisplay = (props: NoteDisplayProps) => {
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
      toast.success("Task added successfully", {autoClose: 3000, position: "top-right"});
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
      toast.success("Tasks cleared successfully", {autoClose: 3000, position: "top-right"});
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
    <div className="m-4 rounded bg-white p-6 shadow lg:w-3/4 lg:max-w-lg">
      <div className="mb-4">
        <input
          type="text"
          className="
          mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
        "
          placeholder="Enter TODOs here"
          autoFocus
          onKeyDown={(e) => {
            const text = e.currentTarget.value.trim();
            if (e.key === "Enter" && text) {
              addTask.mutate({ text });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>

      <ul className="h-96 overflow-y-auto">
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
