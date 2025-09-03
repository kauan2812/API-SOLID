import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import type { UsersRepository } from "../users.repository";

export class PrismaUsersRepository implements UsersRepository {
	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({
			data,
		});

		return user;
	}

	async findByEmail(email: string) {
		const userFromEmail = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		return userFromEmail;
	}
}
