import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/use-cases/_erros/user-alredy-exists.error";
import { MakeRegisterUseCase } from "@/use-cases/factories/make-register-use-case.factory";

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
		const registerUseCase = MakeRegisterUseCase();

		await registerUseCase.execute({ name, email, password });
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: err.message });
		}
		throw err;
	}

	return reply.status(201).send();
};
