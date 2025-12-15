import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    createUser(input: AddUserInput!): User!
  }

  type User {
    id: ID!
    username: String!
    email: String!
  }

  input AddUserInput {
    username: String!
    email: String!
    password: String!
  }
`;
