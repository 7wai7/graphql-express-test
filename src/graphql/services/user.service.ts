import { prisma } from "../../prisma/index.js";
import { errors } from "../utils/errors.util.js";
import bcrypt from "bcrypt";

export class UserService {
  static async getAll() {
    return await prisma.user.findMany({
      select: { id: true, username: true, email: true, createdAt: true },
    });
  }

  static async create({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const existedUser = await this.existedUser(username, email);
    if (existedUser) throw errors.conflict("This user already exists");
 
    const hash = await bcrypt.hash(password, 5);

    return await prisma.user.create({
      data: { username, email, hash_password: hash },
    });
  }

  static async existedUser(username: string, email: string) {
    return await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              contains: email,
              mode: "insensitive", // for case-insensitive search
            },
          },
          {
            username: {
              contains: username,
            },
          },
        ],
      },
    });
  }
}
