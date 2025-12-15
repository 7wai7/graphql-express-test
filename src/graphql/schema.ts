import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar Date

  type Query {
    users: [User]!
    postsByUser(input: FindByUserArgs!): [Post!]!
    commentsByPost(postId: Int!): [Comment!]!
    commentsByUser(input: FindByUserArgs!): [Comment!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createPost(input: CreatePostInput!): Post!
    createComment(input: CreateCommentInput!): Comment!
  }

  type User {
    id: ID!
    username: String!
    email: String!

    posts: [Post]
    comments: [Comment]
  }

  type Post {
    id: ID!
    content: String!
    createdAt: Date!
    updatedAt: Date!

    user: User
    comments: [Comment]
  }

  type Comment {
    id: ID!
    content: String!
    createdAt: Date!
    updatedAt: Date!

    user: User
    post: Post
  }

  input FindByUserArgs {
    id: Int
    username: String
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input CreatePostInput {
    userId: Int!
    content: String!
  }

  input CreateCommentInput {
    userId: Int!
    postId: Int!
    content: String!
  }
`;
