import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { InvalidCredentialsError } from "@/use-cases/_erros/invalid-credentials.error";
import { MakeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case.factory";

export const AuthenticateController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string(),
	});

	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		const authenticateUseCase = MakeAuthenticateUseCase();

		await authenticateUseCase.execute({
			email,
			password,
		});
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			return reply.status(400).send({
				message: err.message,
			});
		}

		throw err;
	}

	return reply.status(200).send();
};
