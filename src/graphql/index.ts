import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers/index.js";
import type { Application } from "express";
import { expressMiddleware } from "@as-integrations/express5";
import type { ResolverContext } from "./types.js";
import { prisma } from "../prisma/index.js";
import { GraphQLError } from "graphql";

export const createGraphQLServer = async (app: Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async (): Promise<ResolverContext> => {
        const currentUserId = 1;

        const user = await prisma.user.findUnique({
          where: {
            id: currentUserId,
          },
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
          },
        });

        if (!user)
          throw new GraphQLError("Unauthorized", {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          });
        return { user };
      },
    })
  );
};
