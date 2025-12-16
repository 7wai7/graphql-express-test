import { GraphQLError } from "graphql";

export const errors = {
  conflict: (msg = "Conflict") =>
    new GraphQLError(msg, { extensions: { code: "CONFLICT" } }),
  unauthenticated: (msg = "Invalid credentials") =>
    new GraphQLError(msg, { extensions: { code: "UNAUTHENTICATED" } }),
  badInput: (msg = "Bad input") =>
    new GraphQLError(msg, { extensions: { code: "BAD_USER_INPUT" } }),
  notFound: (msg = "Not found") =>
    new GraphQLError(msg, { extensions: { code: "NOT_FOUND" } }),
};
