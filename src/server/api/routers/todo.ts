import { z } from 'zod';
import { publicProcedure, createTRPCRouter } from '../trpc';

export const todoRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let userId = "";
      if (ctx.session?.user.id !== undefined) userId = ctx.session.user.id;
      const todo = await ctx.prisma.note.create({
        data: {
          userId,
          text: input.text,
        },
      });
      return todo;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: z.object({
          completed: z.boolean().optional(),
          text: z.string().min(1).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const todo = await ctx.prisma.note.update({
        where: { id },
        data,
      });
      return todo;
    }),
  delete: publicProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.prisma.note.delete({ where: { id } });
      return id;
    }),
  clearCompleted: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.note.deleteMany({ where: { completed: true } });

    return ctx.prisma.note.findMany();
  }),
});
