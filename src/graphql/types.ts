export type ResolverContext = {
  user: {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
  };
};

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export type CreatePostInput = {
  content: string;
  userId: number;
};

export type CreateCommentInput = {
  content: string;
  userId: number;
  postId: number;
};

export type FindByUserArgs = {
  id?: number;
  username?: string;
};
