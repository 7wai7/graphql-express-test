import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index.js";
import type { FindByUserArgs } from "../types.js";
import { mapPrismaError } from "../utils/prisma-error.mapper.js";

export class CommentService {
  static async findByPost(postId: number) {
    return await prisma.comment.findMany({
      where: { postId },
      include: {
        post: true,
        user: true,
      },
    });
  }

  static async findByUser({ id, username }: FindByUserArgs) {
    const where: any = {};

    if (id) where.userId = id;
    if (username) where.user = { username: username };

    return await prisma.comment.findMany({
      where,
      include: {
        post: true,
        user: true,
      },
    });
  }

  static async create(input: Prisma.CommentUncheckedCreateInput) {
    const post = await prisma.comment.create({
      data: { ...input },
    });

    return await prisma.comment.findUnique({
      where: { id: post.id },
      include: {
        user: true,
        post: true,
      },
    });
  }

  static async delete(id: number, userId: number) {
    try {
      return await prisma.comment.delete({
        where: {
          id,
          userId,
        },
        include: {
          user: true,
          post: true,
        },
      });
    } catch (e) {
      mapPrismaError(e);
    }
  }
}
