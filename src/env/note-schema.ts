import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),

  userId: z.string(),
  completed: z.boolean().optional(),
});

export const params = z.object({
  noteId: z.string(),
});

export const updateNoteSchema = z.object({
  params,
  body: z
    .object({
      title: z.string(),
      description: z.string(),
      completed: z.boolean(),
    })
    .partial(),
});

export const filterQuery = z.object({
  limit: z.number().default(1),
  page: z.number().default(10),
});

export type ParamsInput = z.TypeOf<typeof params>;
export type FilterQueryInput = z.TypeOf<typeof filterQuery>;
export type CreateNoteInput = z.TypeOf<typeof createNoteSchema>;
export type UpdateNoteInput = z.TypeOf<typeof updateNoteSchema>;