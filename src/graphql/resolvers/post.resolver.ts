import { requireAuth } from "../middleware/requireAuth.middleware.js";
import { withMiddlewares } from "../middleware/withMiddlewares.js";
import { PostService } from "../services/post.service.js";
import type {
  CreatePostInput,
  FindByUserArgs,
  ResolverContext,
} from "../types.js";

export const postResolvers = {
  Query: {
    postsByUser: async (_: unknown, { input }: { input: FindByUserArgs }) =>
      PostService.findByUser(input),
  },

  Mutation: {
    createPost: withMiddlewares(
      requireAuth,
      async (
        _: unknown,
        { input }: { input: CreatePostInput },
        ctx: ResolverContext
      ) => PostService.create({ ...input, userId: ctx.user.id })
    ),

    deletePost: withMiddlewares(
      requireAuth,
      async (_: unknown, { id }: { id: number }, ctx: ResolverContext) =>
        PostService.delete(id, ctx.user.id)
    ),
  },
};
