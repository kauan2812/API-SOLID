import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users.reporitory";
import { UserAlreadyExistsError } from "@/use-cases/_erros/user-alredy-exists.error";
import { RegisterUseCase } from "@/use-cases/register.use-case";

export const RegisterController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	try {
		const usersRepository = new PrismaUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		await registerUseCase.execute({ name, email, password });
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: err.message });
		}
		throw err;
	}

	return reply.status(201).send();
};
