import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers/index.js";
import type { Application } from "express";
import { expressMiddleware } from "@as-integrations/express5";
import type { ResolverContext } from "./types.js";

export const createGraphQLServer = async (app: Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async (): Promise<ResolverContext> => ({
        user: { id: 1 },
      }),
    })
  );
};
