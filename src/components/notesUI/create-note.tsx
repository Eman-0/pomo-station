import type { FC } from "react";
import type { SubmitHandler} from "react-hook-form";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import type { TypeOf } from "zod";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../misc/loading-button";
import { api } from "../../utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type ICreateNoteProps = {
  setOpenNoteModal: (open: boolean) => void;
};

const CreateNote: FC<ICreateNoteProps> = ({ setOpenNoteModal }) => {
  const { data: sessionData } = useSession();
  let userId = "";
  if (sessionData?.user !== undefined) {
    userId = sessionData?.user.id;
  }


  const createNoteSchemaClient = object({
    title: string().min(1, "Title is required"),
    description: string().min(1, "Description is required"),
    userId: string().default(userId)
  });
  
  type CreateNoteInputClient = TypeOf<typeof createNoteSchemaClient>;

  const queryClient = useQueryClient();
  const { isLoading, mutate: createNote } = api.user.createNote.useMutation({
    onSuccess: async () => {
       await queryClient.invalidateQueries([["getNotes"], { limit: 10, page: 1 }]);
      setOpenNoteModal(false);
    },
    onError() {
      setOpenNoteModal(false);
    },
  });
  const methods = useForm<CreateNoteInputClient>({
    resolver: zodResolver(createNoteSchemaClient),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateNoteInputClient> = (input) => {
    createNote(input);
  };
 
  return (
    <section>
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">Create Note</h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Title
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              errors["title"] && `${"border-red-500"}`
            )}
            {...methods.register("title")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              errors["title"] && `${"visible"}`
            )}
          >
            {errors["title"]?.message as string}
          </p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Content
          </label>
          <textarea
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              errors.description && `${"border-red-500"}`
            )}
            rows={6}
            {...register("description")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2`,
              `${errors.description ? "visible" : "invisible"}`
            )}
          >
            {errors.description && errors.description.message}
          </p>
        </div>
        <LoadingButton isLoading={isLoading}>Create Note</LoadingButton>
      </form>
    </section>
  );
};

export default CreateNote;
