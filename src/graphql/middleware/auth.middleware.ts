import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/index.js";
import type { Middleware } from "../types.js";

export const auth: Middleware = (next) => {
  return async (parent, args, ctx) => {
    const token = ctx.req.cookies.token;
    if (!token) {
      // if (isHardGuard) throw new Error("Unauthorized");
      return next(parent, args, ctx);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await prisma.user.findUnique({
      where: {
        id: (decoded as any).id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    // if (!user && isHardGuard) {}

    ctx.user = user;
    return next(parent, args, ctx);
  };
};
