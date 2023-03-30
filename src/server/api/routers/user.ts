import {
  createNoteController,
  deleteNoteController,
  findAllNotesController,
  findNoteController,
  updateNoteController,
} from "../../notes-controller";
import {
  createNoteSchema,
  filterQuery,
  params,
  updateNoteSchema,
} from "../../../env/note-schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

// TODO: switch to protectedProcedure when everything works
export const userRouter = createTRPCRouter({
  getHello: publicProcedure.query((req) => {
    return { message: "Welcome to Full-Stack tRPC CRUD App with Next.js" };
  }),
  createNote: publicProcedure
    .input(createNoteSchema)
    .mutation(({ input }) => createNoteController({ input })),
  updateNote: publicProcedure
    .input(updateNoteSchema)
    .mutation(({ input }) =>
      updateNoteController({ paramsInput: input.params, input: input.body })
    ),
  deleteNote: publicProcedure
    .input(params)
    .mutation(({ input }) => deleteNoteController({ paramsInput: input })),
  getNote: publicProcedure
    .input(params)
    .query(({ input }) => findNoteController({ paramsInput: input })),
  getNotes: publicProcedure
    .input(filterQuery)
    .query(({ input }) => findAllNotesController({ filterQuery: input })),
});

// export type userRouter = typeof userRouter;
