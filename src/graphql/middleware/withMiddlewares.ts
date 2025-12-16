import type { Middleware, Resolver } from "../types.js";

export function withMiddlewares<TArgs, TResult>(
  ...middlewares: [...Middleware<TArgs>[], Resolver<TArgs, TResult>]
) {
  const resolver = middlewares.pop() as Resolver<TArgs, TResult>;
  return middlewares.reduceRight((next, mw: any) => mw(next), resolver);
}