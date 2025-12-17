import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index.js";
import { mapPrismaError } from "../utils/prisma-error.mapper.js";

export class PostService {
  static async findMany(options: Prisma.PostFindManyArgs) {
    return await prisma.post.findMany({
      ...options,
      include: { user: true, comments: { include: { user: true } } },
    });
  }

  static async create(input: Prisma.PostUncheckedCreateInput) {
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

  static async delete(id: number, userId: number) {
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
      mapPrismaError(e);
    }
  }
}
