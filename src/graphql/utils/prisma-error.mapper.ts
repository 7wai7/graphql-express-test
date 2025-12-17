import { Prisma } from "@prisma/client";
import { errors } from "./errors.util.js";

export function mapPrismaError(e: unknown): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case "P2000":
      case "P2005":
      case "P2006":
      case "P2007":
        throw errors.badInput();

      case "P2002":
        throw errors.conflict("Unique constraint failed");

      case "P2003":
      case "P2014":
        throw errors.conflict("Relation constraint violation");

      case "P2025":
        throw errors.notFound("Record does not exist");

      case "P2037":
        throw errors.internal("Database overloaded");

      default:
        throw errors.internal();
    }
  }

  if (e instanceof Prisma.PrismaClientValidationError) {
    throw errors.badInput();
  }

  throw errors.internal();
}


/**
 * === Prisma error codes ===
 * 
 * P2000 — Value too long
 * P2001 — Record not found (where condition)
 * P2002 — Unique constraint failed
 * P2003 — Foreign key constraint failed
 * P2004 — Constraint failed
 * P2005 — Invalid value for field
 * P2006 — Invalid value
 * P2007 — Data validation error
 * P2014 — Relation violation
 * P2015 — Related record not found
 * P2016 — Query interpretation error
 * P2017 — Records for relation not connected
 * P2025 — Record not found
 * P2034 — Transaction failed
 * P2037 — Too many connections
 */
