import type { Request, Response } from "express";

export type Resolver<TArgs = any, TResult = any> = (
  parent: unknown,
  args: TArgs,
  ctx: ResolverContext
) => Promise<TResult> | TResult;

export type Middleware<TArgs = any> = (
  resolver: Resolver<TArgs>
) => Resolver<TArgs>;

export type ResolverContext = {
  req: Request;
  res: Response;
  user: {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
  } | null;
};

export type JwtUserPayload = {
  id: number;
  username: string;
  email: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export type CreatePostInput = {
  content: string;
};

export type CreateCommentInput = {
  content: string;
  postId: number;
};

export type FindByUserArgs = {
  id?: number;
  username?: string;
};
