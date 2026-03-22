import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

interface CreateUserInput {
  email: string;
  passwordHash: string;
  name?: string;
}

const userWithPasswordSelect = {
  id: true,
  email: true,
  name: true,
  passwordHash: true,
} satisfies Prisma.UserSelect;

const safeUserSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect;

export type UserWithPassword = Prisma.UserGetPayload<{
  select: typeof userWithPasswordSelect;
}>;

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: userWithPasswordSelect,
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
  }

  createUser(input: CreateUserInput) {
    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        name: input.name,
      },
      select: safeUserSelect,
    });
  }

  toSafeUser(user: Pick<User, "id" | "email" | "name">): SafeUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
