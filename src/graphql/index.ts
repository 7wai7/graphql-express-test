import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers/index.js";
import type { Application } from "express";
import { expressMiddleware } from "@as-integrations/express5";

export const createGraphQLServer = async (app: Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError) => {
      console.error(formattedError);

      return {
        message: formattedError.message,
        extensions: {
          code: formattedError.extensions?.code,
        },
      };
    },
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<any> => ({ req, res }),
    })
  );
};
