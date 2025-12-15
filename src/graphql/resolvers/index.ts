import { mergeResolvers } from "@graphql-tools/merge";
import { commentResolvers } from "./comment.resolver.js";
import { postResolvers } from "./post.resolver.js";
import { scalarResolvers } from "./scalar.resolver.js";
import { userResolvers } from "./user.resolver.js";

export const resolvers = mergeResolvers([
  scalarResolvers,
  userResolvers,
  postResolvers,
  commentResolvers,
]);