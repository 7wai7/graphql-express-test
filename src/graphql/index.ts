import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import type { Application } from "express";
import { expressMiddleware } from "@as-integrations/express5";

export const createGraphQLServer = async (app: Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async () => ({
        user: null,
      }),
    })
  );
};
