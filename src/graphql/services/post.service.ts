import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index.js";
import { errors } from "../utils/errors.util.js";

export class PostService {
  static async postsByUser({
    id,
    username,
  }: {
    id?: number;
    username?: string;
  }) {
    const where: any = {};

    if (id) where.userId = id;
    if (username) where.user = { username: username };

    return await prisma.post.findMany({
      where,
      include: { user: true, comments: { include: { user: true } } },
    });
  }

  static async createPost(input: Prisma.PostUncheckedCreateInput) {
    const post = await prisma.post.create({
      data: { ...input },
    });

    return await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        user: true,
        comments: true,
      },
    });
  }

  static async deletePost(id: number, userId: number) {
    try {
      return await prisma.post.delete({
        where: {
          id,
          userId,
        },
        include: {
          user: true,
          comments: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case "P2025": // Not found
            throw errors.notFound("Post does not exist");
        }
      }
      throw e;
    }
  }
}
