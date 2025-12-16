import type { Middleware } from "../types.js";
import { errors } from "../utils/errors.util.js";

export const requireAuth: Middleware = (next) => {
  return async (parent, args, ctx) => {
    if (!ctx.user) throw errors.unauthenticated();
    return next(parent, args, ctx);
  };
};
