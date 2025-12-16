import { requireAuth } from "../middleware/requireAuth.middleware.js";
import { withMiddlewares } from "../middleware/withMiddlewares.js";
import { CommentService } from "../services/comment.service.js";
import type {
  CreateCommentInput,
  FindByUserArgs,
  ResolverContext,
} from "../types.js";

export const commentResolvers = {
  Query: {
    commentsByPost: async (_: unknown, { postId }: { postId: number }) =>
      CommentService.findByPost(postId),

    commentsByUser: async (_: unknown, { input }: { input: FindByUserArgs }) =>
      CommentService.findByUser(input),
  },

  Mutation: {
    createComment: withMiddlewares(
      requireAuth,
      async (
        _: unknown,
        { input }: { input: CreateCommentInput },
        ctx: ResolverContext
      ) => CommentService.create({ ...input, userId: ctx.user.id })
    ),

    deleteComment: withMiddlewares(
      requireAuth,
      async (_: unknown, { id }: { id: number }, ctx: ResolverContext) =>
        CommentService.delete(id, ctx.user.id)
    ),
  },
};
