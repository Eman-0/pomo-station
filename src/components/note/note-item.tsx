import clsx from "clsx";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../utils/api";
import type { Note } from "@prisma/client";
import { toast } from "react-toastify";

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
function ListItem({ task }: { task: Note }) {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = api.useContext();
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);
  useEffect(() => {
    setText(task.text);
  }, [task.text]);
  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  const editTask = api.todo.edit.useMutation({
    async onMutate({ id, data }) {
      await utils.todo.all.cancel();
      const allTasks = utils.todo.all.getData();
      if (!allTasks) {
        return;
      }
      utils.todo.all.setData(
        undefined,
        allTasks.map((t) =>
          t.id === id
            ? {
                ...t,
                ...data,
              }
            : t
        )
      );
    },
  });
  const deleteTask = api.todo.delete.useMutation({
    async onMutate() {
      await utils.todo.all.cancel();
      const allTasks = utils.todo.all.getData();
      if (!allTasks) {
        return;
      }
      utils.todo.all.setData(
        undefined,
        allTasks.filter((t) => t.id != task.id)
      );
      toast.success("Task deleted successfully", {autoClose: 3000, position: "top-right"});
    },
  });

  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback() {
      editTask.mutate({
        id: task.id,
        data: { text },
      });
      toast.success("Task edited successfully", {autoClose: 3000, position: "top-right"});
      setEditing(false);
    },
  });
  return (
    <div
      key={task.id}
      className={clsx(
        editing && "editing",
        completed && "completed",
        "m-2 flex items-center content-between"
      )}
      ref={wrapperRef}
    >
        <input
          className={clsx(editing && "hidden", "rounded-full mr-8")}
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            const checked = e.currentTarget.checked;
            setCompleted(checked);
            editTask.mutate({
              id: task.id,
              data: { completed: checked },
            });
          }}
          autoFocus={editing}
        />
        <label
        className={clsx( editing && "hidden",
          completed && "text-red-600 line-through",
          "text-grey-darkest w-full"
        )}
          onDoubleClick={(e) => {
            setEditing(true);
            e.currentTarget.focus();
          }}
          
        >
          {text}
        </label>
        <input
        className={clsx(editing ? "inline-block w-full" : "hidden")}
          value={text}
          ref={inputRef}
          onChange={(e) => {
            const newText = e.currentTarget.value;
            setText(newText);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editTask.mutate({
                id: task.id,
                data: { text },
              });
              setEditing(false);
            }
          }}
        />
        <button
          className={clsx(editing && "hidden", "flex-grow-0 ml-2 rounded border-2 border-red-600 p-2 text-red-600 hover:bg-red-600 hover:text-white")}
          onClick={() => {
            deleteTask.mutate(task.id);
          }}
        >
          Delete
        </button>
    </div>
  );
}

export default ListItem;
