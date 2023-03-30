// attack author to user in the future
export type INote = {
    id: string;
    title: string;
    description: string;
    completed: boolean | null;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
  };