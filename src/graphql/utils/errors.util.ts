import { GraphQLError } from "graphql";

export const errors = {
  unauthenticated: (msg = "Invalid credentials") =>
    new GraphQLError(msg, { extensions: { code: "UNAUTHENTICATED" } }),
  forbidden: (msg = "Forbidden") =>
    new GraphQLError(msg, { extensions: { code: "FORBIDDEN" } }),
  badInput: (msg = "Bad input") =>
    new GraphQLError(msg, { extensions: { code: "BAD_USER_INPUT" } }),
  notFound: (msg = "Not found") =>
    new GraphQLError(msg, { extensions: { code: "NOT_FOUND" } }),
  conflict: (msg = "Conflict") =>
    new GraphQLError(msg, { extensions: { code: "CONFLICT" } }),
  internal: (msg = "Server error") =>
    new GraphQLError(msg, { extensions: { code: "INTERNAL_SERVER_ERROR" } }),
};


/**
 * UNAUTHENTICATED	401
 * FORBIDDEN	403
 * BAD_USER_INPUT	400
 * NOT_FOUND	404
 * CONFLICT	409
 * INTERNAL_SERVER_ERROR	500
 */